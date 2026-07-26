export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const hostParts = url.hostname.split('.');

    const hasVendorSubdomain = hostParts.length > 2 && hostParts[0] !== 'www';

    if (hasVendorSubdomain) {
      const rewrittenUrl = new URL(request.url);
      rewrittenUrl.pathname = '/store.html';
      return env.ASSETS.fetch(new Request(rewrittenUrl, request));
    }

    return env.ASSETS.fetch(request);
  },
};
