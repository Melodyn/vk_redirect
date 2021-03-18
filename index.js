const fastify = require('fastify');
const fastifyForm = require('fastify-formbody');
const qs = require('querystring');

const routes = [
  {
    method: 'GET',
    url: '/',
    handler(req, res) {
      const query = qs.stringify(req.query);
      res
        .header('Content-Type', 'text/html; charset=UTF-8')
        .send([
          '<h1>Главная страница. /</h1>',
          `<a href="/a?${query}">Перейти на страницу /a, с редиректом на /b</a>`,
          `<a href="/b?${query}">Перейти на страницу /b</a>`,
          `<a href="/c?hello=world&goodbye=kitty&${query}">Перейти на страницу /c?hello=world&goodbye=kitty</a>`,
          `<form action="/form?${query}" method="get">
            <input type="hidden" name="action" value="Hello">
            <input type="submit" value="Отправить форму на GET /action">
          </form>`,
          `<form action="/form?${query}" method="POST">
            <input type="hidden" name="action" value="World">
            <input type="submit" value="Отправить форму на POST /action">
          </form>`,
          '<a href="https://github.com/Melodyn/vk_redirect" target="_blank">Sources: https://github.com/Melodyn/vk_redirect</a>',
        ].join('<br><br>'));
    },
  },
  {
    method: 'GET',
    url: '/form',
    handler(req, res) {
      res
        .header('Content-Type', 'text/html; charset=UTF-8')
        .send('<h1>Form GET</h1>');
    },
  },
  {
    method: 'POST',
    url: '/form',
    handler(req, res) {
      res.redirect(`/form?${qs.stringify(req.query)}`);
    },
  },
  {
    method: 'GET',
    url: '/a',
    handler(req, res) {
      res.redirect(`/b?${qs.stringify(req.query)}`);
    },
  },
  {
    method: 'GET',
    url: '/b',
    handler(req, res) {
      const query = qs.stringify(req.query);
      res
        .header('Content-Type', 'text/html; charset=UTF-8')
        .send([
          '<h1>Страница /b</h1>',
          `<a href="/?${query}">Перейти на главную страницу /</a>`,
          `<a href="/a?${query}">Перейти на страницу /a, с редиректом на /b</a>`,
          `<a href="/b?${query}">Перейти снова на страницу /b</a>`,
          `<a href="/c?hello=world&goodbye=kitty&${query}">Перейти на страницу /c?hello=world&goodbye=kitty</a>`,
          'Исходники: <a href="https://github.com/Melodyn/vk_redirect" target="_blank">https://github.com/Melodyn/vk_redirect</a>',
        ].join('<br><br>'));
    },
  },
  {
    method: 'GET',
    url: '/c',
    handler(req, res) {
      const { hello = 'world', goodbye = 'kitty', ...other } = req.query;
      const otherQuery = qs.stringify(other);
      res
        .header('Content-Type', 'text/html; charset=UTF-8')
        .send([
          `<h1>Страница /c?hello=${hello}&goodbye=${goodbye}</h1>`,
          `<a href="/?${otherQuery}">Перейти на главную страницу /</a>`,
          `<a href="/a?${otherQuery}">Перейти на страницу /a, с редиректом на /b</a>`,
          `<a href="/b?${otherQuery}">Перейти на страницу /b</a>`,
          `<a href="/c?hello=${goodbye}&goodbye=${hello}&${otherQuery}">Изменить query: hello=${goodbye}&goodbye=${hello}</a>`,
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
  server.register(fastifyForm);
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
