import { NextRequest, NextResponse } from 'next/server';

function getAllowedHosts(): Set<string> {
  const configured = process.env.AD_PROXY_ALLOWED_HOSTS;
  if (!configured) {
    return new Set(['google.com']);
  }

  return new Set(
    configured
      .split(',')
      .map((h) => h.trim().toLowerCase())
      .filter(Boolean),
  );
}

function validateAdUrl(rawUrl: string, allowedHosts: Set<string>, base?: string | URL): URL | null {
  let parsed: URL;
  try {
    parsed = base ? new URL(rawUrl, base) : new URL(rawUrl);
  } catch {
    return null;
  }

  if (parsed.protocol !== 'https:' && parsed.protocol !== 'http:') {
    return null;
  }

  if (parsed.protocol === 'http:') {
    // A log is generated to identify which providers still use HTTP.
    console.warn(`Ad-proxy: Allowing insecure HTTP request to ${parsed.href}`);
  }

  if (parsed.username || parsed.password) {
    return null;
  }

  // Only allow default web ports to reduce SSRF surface.
  if (parsed.port && parsed.port !== '80' && parsed.port !== '443') {
    return null;
  }

  const host = parsed.hostname.toLowerCase();
  let hostAllowed = false;
  for (const allowedHost of allowedHosts) {
    // Check if the host matches the allowedHost exactly or is a subdomain of the allowedHost
    if (host === allowedHost || host.endsWith(`.${allowedHost}`)) {
      hostAllowed = true;
      break;
    }
  }
  if (!hostAllowed) {
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

      const validatedRedirectUrl = validateAdUrl(location, allowedHosts, validatedCurrentUrl);
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

const MAX_AD_SIZE_BYTES = 2 * 1024 * 1024; // 2MB

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

    const contentLength = response.headers.get('Content-Length');
    if (contentLength && parseInt(contentLength, 10) > MAX_AD_SIZE_BYTES) {
      return new NextResponse('Ad content is too large', { status: 400 });
    }

    const text = await response.text();
    let finalScriptContent = text;

    // If the initial response is HTML with a JS redirect, handle it
    if (text.trim().startsWith('<')) {
      // More robust regex to handle single/double quotes and whitespace
      const match = text.match(/window\.location\.replace\s*\(\s*(['"])(.*?)\1\s*\)/i);
      if (match && match[2]) {
        const finalUrl = match[2];
        const validatedFinalUrl = validateAdUrl(finalUrl, allowedHosts, validatedSrc);
        if (!validatedFinalUrl) {
          return new NextResponse('Invalid redirect URL in ad content', { status: 400 });
        }
        // Fetch the actual script from the redirect URL
        const scriptResponse = await fetchWithValidatedRedirects(validatedFinalUrl, allowedHosts);

        const scriptContentLength = scriptResponse.headers.get('Content-Length');
        if (scriptContentLength && parseInt(scriptContentLength, 10) > MAX_AD_SIZE_BYTES) {
          return new NextResponse('Ad script content is too large', { status: 400 });
        }

        finalScriptContent = await scriptResponse.text();
      }
    }

    return new NextResponse(finalScriptContent, {
      headers: {
        'Content-Type': 'text/html',
        'Cache-Control': 's-maxage=3600, stale-while-revalidate',
        'X-Content-Type-Options': 'nosniff',
        'Permissions-Policy': 'microphone=(), camera=(), geolocation=(), payment=()',
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

