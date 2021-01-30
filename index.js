const fastify = require('fastify');

const routes = [
  {
    method: 'GET',
    url: '/',
    handler(req, res) {
      res.redirect('/a');
    },
  },
  {
    method: 'GET',
    url: '/a',
    handler(req, res) {
      res.redirect('/b');
    },
  },
  {
    method: 'GET',
    url: '/b',
    handler(req, res) {
      res
        .header('Content-Type', 'text/html; charset=UTF-8')
        .send([
          'Hello form route /b',
          '<a href="/a">Got to /a</a>',
          '<a href="https://github.com/Melodyn/vk_redirect">Sources: https://github.com/Melodyn/vk_redirect</a>',
        ].join('<br>'));
    },
  },
];

const createApp = async () => {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const server = fastify({
    logger: {
      level: process.env.LOG_LEVEL,
    },
  });
  routes.forEach((route) => server.route(route));

  await server.listen(process.env.PORT, process.env.HOST);

  const stop = async () => {
    await server.close();
    server.log.info('App stopped');

    if (!process.env.IS_TEST_ENV) {
      process.exit(0);
    }
  };

  process.on('SIGTERM', stop);

  return {
    server,
    stop,
  };
};

module.exports = createApp;
