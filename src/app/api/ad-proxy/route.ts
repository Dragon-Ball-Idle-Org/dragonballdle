import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const src = searchParams.get('src');

  if (!src) {
    return new NextResponse('Missing src parameter', { status: 400 });
  }

  try {
    // First, try to get the initial content which might be a redirect script
    const response = await fetch(src, { redirect: 'follow' });
    const text = await response.text();
    let finalScriptContent = text;
    
    // If the initial response is HTML with a JS redirect, handle it
    if (text.trim().startsWith('<')) {
      const match = text.match(/window\.location\.replace\('([^']*)'\)/);
      if (match && match[1]) {
        const finalUrl = match[1];
        // Fetch the actual script from the redirect URL
        const scriptResponse = await fetch(finalUrl, { redirect: 'follow' });
        finalScriptContent = await scriptResponse.text();
      }
    }

    return new NextResponse(finalScriptContent, {
      headers: {
        'Content-Type': 'text/html', // It's HTML, not JS
        'Cache-Control': 's-maxage=3600, stale-while-revalidate', // Cache for 1 hour
      },
    });
  } catch (error) {
    console.error('Ad Proxy Error:', error);
    return new NextResponse('Failed to fetch ad script', { status: 500 });
  }
}
