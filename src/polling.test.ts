import { Polling, State, Executor, IAbortController } from "./polling";

it("test polling state", () => {
  const task = () => {
    return Promise.resolve();
  };
  const polling = new Polling(task, 1000);

  expect(polling.state).toBe(State.PENDING);

  polling.run();
  expect(polling.state).toBe(State.RUNNING);

  polling.cancel();
  expect(polling.state).toBe(State.CANCELED);
});

it("test polling resolve promise", async () => {
  const successHandle = jest.fn();
  const task: Executor = () => (Promise.resolve().then(() => successHandle()));
  const polling = new Polling(task, 1000);

  polling.run();
  setTimeout(polling.cancel, 2000);
  await waitPolling(polling);

  expect(successHandle).toHaveReturnedTimes(2);
});

it("test polling reject promise", async () => {
  const errorHandle = jest.fn();
  const task: Executor = () => (Promise.reject().catch(() => errorHandle()));
  const polling = new Polling(task, 1000);

  polling.run();
  setTimeout(polling.cancel, 2000);
  await waitPolling(polling);

  expect(errorHandle).toHaveReturnedTimes(2);
});

it("test polling abort controller", async () => {
  const executorMock = jest.fn();
  const abortMock = jest.fn();
  const abortController: IAbortController = {
    signal: "mytoken",
    abort: () => abortMock(),
  };
  const task: Executor = (
    signal,
  ) => (Promise.reject().catch(() => executorMock(signal)));

  const polling = new Polling(task, 1000, abortController);

  polling.run();
  setTimeout(polling.cancel, 2000);
  await waitPolling(polling);

  expect(executorMock).toHaveBeenCalledWith("mytoken");
  expect(abortMock.mock.calls.length).toBe(1);
});

const waitPolling = (polling: Polling, interval: number = 1000) => {
  return new Promise((resolve, reject) => {
    const check = () => (
      polling.state == State.RUNNING
        ? setTimeout(check, interval)
        : resolve(polling)
    );
    check();
  });
};
