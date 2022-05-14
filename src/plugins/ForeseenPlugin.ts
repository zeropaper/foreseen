import type Foreseen from "..";
export default class ForeseenPlugin {
  constructor() {
  }

  readonly name: string;

  get ready() {
    return false;
  }

  connect(instance: Foreseen) {
  }

  dispose() {
  }

  registerFunctions() {
    return {};
  }
}
