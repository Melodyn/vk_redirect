const createApp = require('../index.js');

let app;

test('Run app', async () => {
  app = await createApp().catch((e) => e);
  expect(app).not.toBeInstanceOf(Error);
});

test('App is exists', async () => {
  expect(app).not.toBeFalsy();
  expect(app).toEqual(expect.objectContaining({
    server: expect.any(Object),
    stop: expect.any(Function),
  }));
});

test('Stop app', async () => {
  await expect(app.stop()).resolves.not.toThrow();
});
