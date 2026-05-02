import { NextRequest, NextResponse } from 'next/server';

function getAllowedHosts(): Set<string> {
  const configured = process.env.AD_PROXY_ALLOWED_HOSTS;
  if (!configured) {
    return new Set(['ads.example.com']);
  }

  return new Set(
    configured
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean),
  );
}

function validateAdUrl(rawUrl: string, allowedHosts: Set<string>, base?: string): URL | null {
  let parsed: URL;
  try {
    parsed = base ? new URL(rawUrl, base) : new URL(rawUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  if (parsed.username || parsed.password) {
    return null;
  }

  // Only allow default web ports to reduce SSRF surface.
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  if (!allowedHosts.has(host)) {
    return null;
  }

  // Rebuild a canonical URL from validated components to avoid forwarding
  // user-controlled URL text directly to fetch.
  const canonical = new URL(`${parsed.protocol}//${host}`);
  canonical.port = parsed.port;
  canonical.pathname = parsed.pathname;
  canonical.search = parsed.search;
  canonical.hash = parsed.hash;

  return canonical;
}

async function fetchWithValidatedRedirects(
  initialUrl: URL,
  allowedHosts: Set<string>,
  maxRedirects = 5,
): Promise<Response> {
  let currentUrl = initialUrl;

  for (let i = 0; i <= maxRedirects; i++) {
    const validatedCurrentUrl = validateAdUrl(currentUrl.toString(), allowedHosts);
    if (!validatedCurrentUrl) {
      throw new Error('Current URL is not allowed');
    }

    const response = await fetch(validatedCurrentUrl, { redirect: 'manual' });

    if (response.status >= 300 && response.status < 400) {
      const location = response.headers.get('location');
      if (!location) {
        throw new Error('Redirect response missing Location header');
      }

      const validatedRedirectUrl = validateAdUrl(location, allowedHosts, validatedCurrentUrl.toString());
      if (!validatedRedirectUrl) {
        throw new Error('Redirect URL is not allowed');
      }

      currentUrl = validatedRedirectUrl;
      continue;
    }

    return response;
  }

  throw new Error('Too many redirects');
}

export async function GET(request: NextRequest) {
  // In non-production environments (dev, test), don't make real requests.
  // This prevents network errors in CI/local dev if the ad service is unreachable.
  if (process.env.NODE_ENV !== 'production') {
    return new NextResponse('<html><body><!-- Ad mock for non-production --></body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }

  const { searchParams } = new URL(request.url);
  const src = searchParams.get('src');

  if (!src) {
    return new NextResponse('Missing src parameter', { status: 400 });
  }

  const allowedHosts = getAllowedHosts();
  const validatedSrc = validateAdUrl(src, allowedHosts);
  if (!validatedSrc) {
    return new NextResponse('Invalid src parameter', { status: 400 });
  }

  try {
    // First, try to get the initial content which might be a redirect script
    const response = await fetchWithValidatedRedirects(validatedSrc, allowedHosts);
    const text = await response.text();
    let finalScriptContent = text;

    // If the initial response is HTML with a JS redirect, handle it
    if (text.trim().startsWith('<')) {
      const match = text.match(/window\.location\.replace\('([^']*)'\)/);
      if (match && match[1]) {
        const finalUrl = match[1];
        const validatedFinalUrl = validateAdUrl(finalUrl, allowedHosts, validatedSrc.toString());
        if (!validatedFinalUrl) {
          return new NextResponse('Invalid redirect URL in ad content', { status: 400 });
        }
        // Fetch the actual script from the redirect URL
        const scriptResponse = await fetchWithValidatedRedirects(validatedFinalUrl, allowedHosts);
        finalScriptContent = await scriptResponse.text();
      }
    }

    return new NextResponse(finalScriptContent, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
      },
    });
  } catch (error) {
    console.error('Ad Proxy Error:', error);
    // Gracefully degrade: return empty HTML so the iframe doesn't break the page
    return new NextResponse('<html><body><!-- Ad failed to load --></body></html>', {
      status: 200,
      headers: { 'Content-Type': 'text/html' },
    });
  }
}

