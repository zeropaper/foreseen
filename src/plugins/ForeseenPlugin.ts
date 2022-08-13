import type Foreseen from "..";

export default class ForeseenPlugin {
  constructor(parent: Foreseen) {
    this.#parent = parent;
  }

  #parent: Foreseen;

  get parent() {
    return this.#parent;
  };

  get name() {
    return this.constructor.name;
  };

  get ready(): boolean {
    return false;
  }

  get controlsElement(): HTMLElement | null {
    return null;
  }

  connect() {
  }

  dispose() {
  }

  registerFunctions() {
    return {};
  }
}
