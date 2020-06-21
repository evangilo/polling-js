export declare type Executor = (signal?: any) => Promise<any>;

export declare type AbortFunction = () => void;

export declare type CancelFunction = () => void;

export enum State {
  PENDING = "pending",
  RUNNING = "running",
  CANCELED = "canceled",
}

export interface IAbortController {
  signal: any;
  abort: AbortFunction;
}

export class Polling {
  private _executor: Executor;
  private _interval: number;
  private _state: State;
  private _scheduleId: any;
  private _abortController?: IAbortController;

  constructor(
    executor: Executor,
    interval: number,
    abortController?: IAbortController,
  ) {
    this._executor = executor;
    this._interval = interval;
    this._abortController = abortController;
    this._state = State.PENDING;
    this._scheduleId = null;
  }

  get state(): State {
    return this._state;
  }

  run(): CancelFunction {
    if (this._state != State.PENDING) {
      console.warn(
        "Skipping execution because the Polling state is different from pending",
      );
      return this.cancel;
    }
    this._state = State.RUNNING;
    this._run();
    return this.cancel;
  }

  cancel: CancelFunction = () => {
    this._state = State.CANCELED;
    this._abortController?.abort();
    clearTimeout(this._scheduleId);
  };

  private _run = () => {
    this._executor(this._abortController?.signal).finally(this._schedule);
  };

  private _schedule = () => {
    if (this._state === State.RUNNING) {
      this._scheduleId = setTimeout(this._run, this._interval);
    }
  };
}

export function setPolling(
  executor: Executor,
  interval: number,
  abortController?: IAbortController,
): CancelFunction {
  return new Polling(executor, interval, abortController).run();
}
