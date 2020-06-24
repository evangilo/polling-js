/* eslint-disable prefer-promise-reject-errors */
// eslint-disable-next-line no-unused-vars
import { Polling, Executor, IAbortController } from './polling';

it('test polling state', () => {
  const task = () => {
    return Promise.resolve();
  };
  const polling = new Polling(task, 1000);

  expect(polling.state).toBe('pending');

  polling.run();
  expect(polling.state).toBe('running');

  polling.cancel();
  expect(polling.state).toBe('canceled');
});

it('test polling resolve promise', async () => {
  const successHandle = jest.fn();
  const task: Executor = () => (Promise.resolve().then(() => successHandle()));
  const polling = new Polling(task, 1000);

  polling.run();
  await timeout(polling.cancel, 2000);

  expect(successHandle).toHaveReturnedTimes(2);
});

it('test polling reject promise', async () => {
  const errorHandle = jest.fn();
  const task: Executor = () => (Promise.reject().catch(() => errorHandle()));
  const polling = new Polling(task, 1000);

  polling.run();
  await timeout(polling.cancel, 2000);

  expect(errorHandle).toHaveReturnedTimes(2);
});

it('test polling abort controller', async () => {
  const executorMock = jest.fn();
  const abortMock = jest.fn();
  const abortController: IAbortController = {
    signal: 'mytoken',
    abort: () => abortMock()
  };
  const task: Executor = (
    signal
  ) => (Promise.reject().catch(() => executorMock(signal)));

  const polling = new Polling(task, 1000, abortController);

  polling.run();
  await timeout(polling.cancel, 2000);

  expect(executorMock).toHaveBeenCalledWith('mytoken');
  expect(abortMock.mock.calls.length).toBe(1);
});

it('test polling cancel after start', () => {
  const successHandle = jest.fn();
  const task = () => Promise.resolve().then(successHandle());
  const polling = new Polling(task, 1000);

  polling.run();
  polling.cancel();
  expect(successHandle).toHaveReturnedTimes(1);
});

it('test polling cancel using returned function', () => {
  const successHandle = jest.fn();
  const task = () => Promise.resolve().then(successHandle());
  const polling = new Polling(task, 1000);

  const cancel = polling.run();
  cancel();
  expect(successHandle).toHaveReturnedTimes(1);
});

const timeout = (fn: Function, interval: number) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      fn();
      resolve();
    }, interval);
  });
};
