import server from '../dist/server/server.js';
export default {
  async fetch(request, env) {
    if (new URL(request.url).pathname.startsWith('/assets/'))
      return env.ASSETS.fetch(request);
    return server.fetch(request);
  },
};
