import { Polling } from './polling';

const getPolling = () => {
  const task = () => {
    return Promise.resolve();
  };
  return new Polling(task, 1000);
};

it('test pending polling', () => {
  const mockedWarn = jest.fn();
  console.warn = mockedWarn;
  const polling = getPolling();

  polling.cancel();
  expect(mockedWarn.mock.calls[0][0]).toBe(
    'You cannot cancel a pending polling.'
  );
});

it('test running polling', () => {
  const mockedWarn = jest.fn();
  console.warn = mockedWarn;
  const polling = getPolling();
  polling.run();

  polling.run();
  expect(mockedWarn.mock.calls[0][0]).toBe('You cannot run a running polling.');
  polling.cancel();
});

it('test canceled polling', () => {
  const mockedWarn = jest.fn();
  console.warn = mockedWarn;
  const polling = getPolling();
  polling.run();
  polling.cancel();

  polling.run();
  expect(mockedWarn.mock.calls[0][0]).toBe(
    'You cannot run a canceled polling.'
  );
  polling.cancel();
  expect(mockedWarn.mock.calls[1][0]).toBe(
    'You cannot cancel a canceled polling.'
  );
});
