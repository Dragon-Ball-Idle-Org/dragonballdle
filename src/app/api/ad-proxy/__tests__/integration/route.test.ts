import { NextRequest } from 'next/server';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { GET } from '@/app/api/ad-proxy/route';

const AD_ALLOWED_HOST = 'good.ad-server.com';

describe('API Route: ad-proxy', () => {
  const originalEnv = process.env;
  const mockFetch = vi.fn();

  beforeEach(() => {
    vi.resetModules();
    process.env = {
      ...originalEnv,
      NODE_ENV: 'production',
      AD_PROXY_ALLOWED_HOSTS: AD_ALLOWED_HOST,
    };
    global.fetch = mockFetch;
  });

  afterEach(() => {
    process.env = originalEnv;
    vi.clearAllMocks();
  });

  it('should return 400 if "src" parameter is missing', async () => {
    const request = new NextRequest('https://example.com/api/ad-proxy');
    const response = await GET(request);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Missing src parameter');
  });

  it('should return 400 for invalid "src" URLs', async () => {
    const request = new NextRequest(`https://example.com/api/ad-proxy?src=${encodeURIComponent('//invalid-url')}`);
    const response = await GET(request);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid src parameter');
  });

  it('should allow HTTP URLs but log a warning', async () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    const adUrl = `http://${AD_ALLOWED_HOST}/ad.js`;
    mockFetch.mockResolvedValue(new Response('ad content'));

    const request = new NextRequest(
      `https://example.com/api/ad-proxy?src=${encodeURIComponent(adUrl)}`,
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe('ad content');
    expect(consoleWarnSpy).toHaveBeenCalledWith(`Ad-proxy: Allowing insecure HTTP request to ${adUrl}`);

    consoleWarnSpy.mockRestore();
  });

  it('should return 400 for disallowed hosts', async () => {
    const request = new NextRequest(
      `https://example.com/api/ad-proxy?src=${encodeURIComponent('https://bad.ad-server.com/ad.js')}`,
    );
    const response = await GET(request);
    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid src parameter');
  });

  it('should return 400 if ad content is too large', async () => {
    const adUrl = `https://${AD_ALLOWED_HOST}/ad.js`;
    mockFetch.mockResolvedValue(
      new Response('ad content', {
        headers: { 'Content-Length': '3000000' }, // > 2MB
      }),
    );

    const request = new NextRequest(`https://example.com/api/ad-proxy?src=${encodeURIComponent(adUrl)}`);
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Ad content is too large');
  });

  it('should proxy the ad and add security headers', async () => {
    const adContent = '/* ad script */';
    const adUrl = `https://${AD_ALLOWED_HOST}/ad.js`;
    mockFetch.mockResolvedValue(new Response(adContent));

    const request = new NextRequest(`https://example.com/api/ad-proxy?src=${encodeURIComponent(adUrl)}`);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(adContent);
    expect(response.headers.get('X-Content-Type-Options')).toBe('nosniff');
    expect(response.headers.get('Permissions-Policy')).toBe('microphone=(), camera=(), geolocation=(), payment=()');
    expect(mockFetch).toHaveBeenCalledWith(new URL(adUrl), { redirect: 'manual' });
  });

  it('should handle and validate JS redirects', async () => {
    const finalAdContent = '/* final ad script */';
    const finalAdUrl = `https://${AD_ALLOWED_HOST}/final-ad.js`;
    const initialHtml = `
      <html>
        <body>
          <script>
            window.location.replace('${finalAdUrl}');
          </script>
        </body>
      </html>
    `;
    const initialUrl = `https://${AD_ALLOWED_HOST}/redirector.html`;

    // First fetch returns the redirect HTML
    mockFetch.mockResolvedValueOnce(new Response(initialHtml));
    // Second fetch returns the final script
    mockFetch.mockResolvedValueOnce(new Response(finalAdContent));

    const request = new NextRequest(`https://example.com/api/ad-proxy?src=${encodeURIComponent(initialUrl)}`);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toBe(finalAdContent);
    expect(mockFetch).toHaveBeenCalledTimes(2);
    expect(mockFetch).toHaveBeenCalledWith(new URL(initialUrl), { redirect: 'manual' });
    expect(mockFetch).toHaveBeenCalledWith(new URL(finalAdUrl), { redirect: 'manual' });
  });

  it('should return 400 for redirects to disallowed hosts', async () => {
    const disallowedUrl = 'https://bad.ad-server.com/malicious.js';
    const initialHtml = `
      <html>
        <body>
          <script>
            window.location.replace("${disallowedUrl}");
          </script>
        </body>
      </html>
    `;
    const initialUrl = `https://${AD_ALLOWED_HOST}/redirector.html`;
    mockFetch.mockResolvedValue(new Response(initialHtml));

    const request = new NextRequest(`https://example.com/api/ad-proxy?src=${encodeURIComponent(initialUrl)}`);
    const response = await GET(request);

    expect(response.status).toBe(400);
    expect(await response.text()).toBe('Invalid redirect URL in ad content');
  });

  it('should return gracefully on fetch error', async () => {
    const adUrl = `https://${AD_ALLOWED_HOST}/ad.js`;
    mockFetch.mockRejectedValue(new Error('Network error'));

    const request = new NextRequest(`https://example.com/api/ad-proxy?src=${encodeURIComponent(adUrl)}`);
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<!-- Ad failed to load -->');
  });

  it('should return mock in non-production environment', async () => {
    process.env.NODE_ENV = 'development';
    const request = new NextRequest(
      `https://example.com/api/ad-proxy?src=${encodeURIComponent(`https://${AD_ALLOWED_HOST}/ad.js`)}`,
    );
    const response = await GET(request);

    expect(response.status).toBe(200);
    expect(await response.text()).toContain('<!-- Ad mock for non-production -->');
    expect(mockFetch).not.toHaveBeenCalled();
  });
});
