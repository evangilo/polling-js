export abstract class State {
  abstract cancel(callback: Function): State;
  abstract run(callback: Function): State;
}

export class Pending extends State {
  run (callback: Function): State {
    callback();
    return new Running();
  }

  cancel (callback: Function): State {
    console.warn('You cannot cancel a pending polling.');
    return this;
  }
}

export class Running extends State {
  run (callback: Function): State {
    console.warn('You cannot run a running polling.');
    return this;
  }

  cancel (callback: Function): State {
    callback();
    return new Canceled();
  }
}

export class Canceled extends State {
  run (callback: Function): State {
    console.warn('You cannot run a canceled polling.');
    return this;
  }

  cancel (callback: Function): State {
    console.warn('You cannot cancel a canceled polling.');
    return this;
  }
}
