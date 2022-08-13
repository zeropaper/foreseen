import type Foreseen from '..';
import ForeseenPlugin from './ForeseenPlugin';

export default class MousePlugin extends ForeseenPlugin {
  constructor(foreseen: Foreseen) {
    super(foreseen);
    this.eventListener = this.eventListener.bind(this);
    this.parent.canvas.addEventListener('mousemove', this.eventListener);
  }

  get ready(): boolean {
    return true
  }

  #x: number = 0;

  #y: number = 0;

  eventListener: (ev: MouseEvent) => any = (event) => {
    const { clientWidth, clientHeight } = event.target as HTMLCanvasElement;
    if (!clientWidth || !clientHeight) return;
    this.#y = (1 / clientHeight) * event.y;
    this.#x = (1 / clientWidth) * event.x;
  };

  registerFunctions() {
    return {
      'mouseX': () => {
        return this.#x;
      },
      'mouseY': () => {
        return this.#y;
      },
    };
  }

  dispose(): void {
    this.parent.canvas.removeEventListener('mousemove', this.eventListener);
  }
}
