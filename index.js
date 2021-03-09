const fastify = require('fastify');

const routes = [
  {
    method: 'GET',
    url: '/',
    handler(req, res) {
      res
        .header('Content-Type', 'text/html; charset=UTF-8')
        .send([
          'Главная страница. /',
          '<a href="/a">Перейти на страницу /a, с редиректом на /b</a>',
          '<a href="/b">Перейти на страницу /b</a>',
          '<a href="/c?hello=world&goodbay=kitty">Перейти на страницу /c?hello=world&goodbay=kitty</a>',
          '<a href="https://github.com/Melodyn/vk_redirect" target="_blank">Sources: https://github.com/Melodyn/vk_redirect</a>',
        ].join('<br><br>'));
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
          'Страница /b',
          '<a href="/">Перейти на главную страницу /</a>',
          '<a href="/a">Перейти на страницу /a, с редиректом на /b</a>',
          '<a href="/b">Перейти снова на страницу /b</a>',
          '<a href="/c?hello=world&goodbye=kitty">Перейти на страницу /c?hello=world&goodbye=kitty</a>',
          'Исходники: <a href="https://github.com/Melodyn/vk_redirect" target="_blank">https://github.com/Melodyn/vk_redirect</a>',
        ].join('<br><br>'));
    },
  },
  {
    method: 'GET',
    url: '/c',
    handler(req, res) {
      const { hello = 'world', goodbye = 'kitty' } = req.query;
      res
        .header('Content-Type', 'text/html; charset=UTF-8')
        .send([
          `Страница /c?hello=${hello}&goodbye=${goodbye}`,
          '<a href="/">Перейти на главную страницу /</a>',
          '<a href="/a">Перейти на страницу /a, с редиректом на /b</a>',
          '<a href="/b">Перейти на страницу /b</a>',
          `<a href="/c?hello=${goodbye}&goodbye=${hello}">Изменить query: hello=${goodbye}&goodbye=${hello}</a>`,
          '<a href="https://github.com/Melodyn/vk_redirect" target="_blank">Sources: https://github.com/Melodyn/vk_redirect</a>',
        ].join('<br><br>'));
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

  const stop = async () => {
    await server.close();
    server.log.info('App stopped');

    if (!process.env.IS_TEST_ENV) {
      process.exit(0);
    }
  };

  process.on('SIGTERM', stop);

  await server.listen(process.env.PORT, process.env.HOST);

  return {
    server,
    stop,
  };
};

module.exports = createApp;
