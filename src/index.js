export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostParts = url.hostname.split('.');

    const hasVendorSubdomain = hostParts.length > 2 && hostParts[0] !== 'www';

    if (hasVendorSubdomain && (url.pathname === '/' || url.pathname === '')) {
      const rewrittenUrl = new URL(request.url);
      rewrittenUrl.pathname = '/store.html';
      rewrittenUrl.searchParams.set('_h', hostParts[0]);

      const assetRequest = new Request(rewrittenUrl.toString(), {
        method: request.method,
        headers: request.headers,
        cf: { cacheTtl: 0, cacheEverything: false },
      });
      const response = await env.ASSETS.fetch(assetRequest);
      const newResponse = new Response(response.body, response);
      newResponse.headers.set('Cache-Control', 'no-store');
      return newResponse;
    }

    return env.ASSETS.fetch(request);
  },
};
