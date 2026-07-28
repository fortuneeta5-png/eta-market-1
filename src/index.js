export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostParts = url.hostname.split('.');

    const hasVendorSubdomain = hostParts.length > 2 && hostParts[0] !== 'www';

    if (hasVendorSubdomain) {
      const path = url.pathname;
      const looksLikeRealFile = /\.[a-zA-Z0-9]+$/.test(path);

      if (!looksLikeRealFile) {
        const rewrittenUrl = new URL(request.url);
        rewrittenUrl.pathname = '/store.html';
        const productId = path.replace(/^\//, '').trim();
        if (productId) {
          rewrittenUrl.searchParams.set('p', productId);
        }
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
    }

    const cleanPathMap = {
      '/dashboard': '/dashboard.html',
      '/dashboard/': '/dashboard.html',
      '/suivi': '/suivi.html',
      '/suivi/': '/suivi.html',
      '/boutiques': '/explore.html',
      '/boutiques/': '/explore.html',
    };
    if (cleanPathMap[url.pathname]) {
      const rewrittenUrl = new URL(request.url);
      rewrittenUrl.pathname = cleanPathMap[url.pathname];
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
