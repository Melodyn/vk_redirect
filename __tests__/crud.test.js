const createApp = require('../index.js');

let app;

beforeAll(async () => {
  app = await createApp();
});

afterAll(async () => {
  if (app) {
    await app.stop();
  }
});

describe('Positive cases', () => {
  test('Get /b', async () => {
    const { statusCode, payload } = await app.server.inject({
      method: 'GET',
      path: '/b',
    });

    expect(statusCode).toEqual(200);
    expect(payload).toMatch(/Hello/gim);
  });

  test('Get /a', async () => {
    const { statusCode, headers } = await app.server.inject({
      method: 'GET',
      path: '/a',
    });

    expect(statusCode).toEqual(302);
    expect(headers.location).toEqual('/b');
  });
});
