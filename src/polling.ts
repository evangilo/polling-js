import { State, Pending } from './states'

export declare type Executor = (signal?: any) => Promise<any>;

export declare type AbortCallback = () => void;

export interface IAbortController {
  signal: any;
  abort: AbortCallback;
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
    this._state = new Pending();
    this._scheduleId = null;
  }

  get state(): State {
    return this._state;
  }

  run = () => {
    this._state = this._state.run(this._run) || this._state;
    return this.cancel;
  }

  cancel = () => {
    this._state = this._state.cancel(this._cancel) || this._state;
  };

  private _cancel = () => {
    this._abortController?.abort();
    clearTimeout(this._scheduleId);
  };

  private _run = () => {
    this._executor(this._abortController?.signal).finally(() => this._state.schedule(this._schedule));
  };

  private _schedule = () => {
    this._scheduleId = setTimeout(this._run, this._interval);
  };
}

export function setPolling(
  executor: Executor,
  interval: number,
  abortController?: IAbortController,
) {
  return new Polling(executor, interval, abortController).run();
}
