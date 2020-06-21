import { Polling } from "./polling";

export abstract class State {
  schedule(callback: Function): void {}
  
  abstract cancel(polling: Function): State;
  abstract run(callback: Function): State;
}

export class Pending extends State{
  run(callback: Function): State {
    callback();
    return new Running();
  }

  cancel(callback: Function): State {
    console.warn('You cannot cancel a pending polling.');
    return null;
  }
}

export class Running extends State{
  run(callback: Function): State {
    console.warn('You cannot run a running polling.');
    return null;
  }
    
  cancel(callback: Function): State {
    callback();
    return new Canceled();
  }

  schedule(callback: Function): void {
    callback();
  }
}

export class Canceled extends State{
  run(callback: Function): State {
    console.warn('You cannot run a canceled polling.');
    return null;
  }

  cancel(callback: Function): State {
    console.warn('You cannot cancel a canceled polling.');
    return null;
  }
}