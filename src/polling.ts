import { Pending } from './states';

export type Executor = (signal?: any) => Promise<any>

export type CancelFunction = () => void

export interface IAbortController {
  signal: any;
  abort(): void;
}

export class Polling {
  private _executor: Executor
  private _interval: number
  private _abortController?: IAbortController
  private _state = new Pending()
  private _scheduleId: any = null;

  constructor (
    executor: Executor,
    interval: number,
    abortController?: IAbortController
  ) {
    this._executor = executor;
    this._interval = interval;
    this._abortController = abortController;
  }

  get state (): String {
    return this._state.constructor.name.toLowerCase();
  }

  run = (): CancelFunction => {
    this._state = this._state.run(this._run);
    return this.cancel;
  };

  cancel: CancelFunction = () => {
    this._state = this._state.cancel(this._cancel);
  };

  private _cancel = () => {
    // eslint-disable-next-line no-unused-expressions
    this._abortController?.abort();
    clearTimeout(this._scheduleId);
  };

  private _run = () => {
    this._executor(this._abortController?.signal).finally(this._schedule);
  };

  private _schedule = () => {
    this._scheduleId = setTimeout(this._run, this._interval);
  };
}

export function setPolling (
  executor: Executor,
  interval: number,
  abortController?: IAbortController
): CancelFunction {
  return new Polling(executor, interval, abortController).run();
}
