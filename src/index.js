export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostParts = url.hostname.split('.');

    const hasVendorSubdomain = hostParts.length > 2 && hostParts[0] !== 'www';

    if (hasVendorSubdomain && (url.pathname === '/' || url.pathname === '')) {
      const rewrittenUrl = new URL(request.url);
      rewrittenUrl.pathname = '/store.html';
      const assetRequest = new Request(rewrittenUrl.toString(), {
        method: request.method,
        headers: request.headers,
      });
      return env.ASSETS.fetch(assetRequest);
    }

    return env.ASSETS.fetch(request);
  },
};
