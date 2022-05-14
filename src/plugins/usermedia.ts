import type Foreseen from "..";
import ForeseenPlugin from "./ForeseenPlugin";

const audioConfig = {
  minDecibels: -180,
  maxDecibels: 120,
  smoothingTimeConstant: 0.85,
  fftSize: 1024,
};


class UserMediaPlugin extends ForeseenPlugin {
  constructor() {
    super();
  }

  #foreseen: Foreseen | null = null;

  name = 'usermedia';

  get ready() {
    return !!this.#foreseen && !!this.#stream;
  }

  #audioContext: AudioContext | null = null;
  #analyser: AnalyserNode | null = null;
  #frequencyArray: Uint8Array | null = null;
  #timeDomainArray: Uint8Array | null = null;

  audioConfig = audioConfig;

  #stream: MediaStream | null = null;

  async #getMedia() {
    try {
      this.#stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
      });

      this.#audioContext = new AudioContext();
      this.#analyser = this.#audioContext.createAnalyser();
      this.#analyser.minDecibels = this.audioConfig.minDecibels;
      this.#analyser.maxDecibels = this.audioConfig.maxDecibels;
      this.#analyser.smoothingTimeConstant = this.audioConfig.smoothingTimeConstant;
      this.#analyser.fftSize = this.audioConfig.fftSize;
      this.#frequencyArray = new Uint8Array(this.#analyser.frequencyBinCount);
      this.#timeDomainArray = new Uint8Array(this.#analyser.frequencyBinCount);
      const source = this.#audioContext.createMediaStreamSource(this.#stream);
      source.connect(this.#analyser);
    } catch (err) {
      console.warn('[usermedia plugin] getMedia error', err);
    }
  }

  registerFunctions() {
    return {
      'frequency': (idx = 0) => {
        if (!this.ready) return 1;
        this.#analyser.getByteFrequencyData(this.#frequencyArray)
        return this.#frequencyArray[idx]
      },
      'timeDomain': (idx = 0) => {
        if (!this.ready) return 1;
        this.#analyser.getByteTimeDomainData(this.#timeDomainArray)
        return this.#timeDomainArray[idx]
      },
    }
  }

  /*
  data() {
    console.info('[usermedia plugin] prerender', this.ready)
    if (!this.ready) return
    this.#analyser.getByteFrequencyData(this.#frequencyArray);
    this.#analyser.getByteTimeDomainData(this.#timeDomainArray);
    return {
      frequency: Array.from(this.#frequencyArray),
      timeDomain: Array.from(this.#timeDomainArray),
    };
  }
  */

  connect(foreseen: Foreseen) {
    console.info('[usermedia plugin] connect')
    this.#foreseen = foreseen;

    window.addEventListener('mousemove', (e) => {
      console.info('[usermedia plugin] mousemove')
      this.#getMedia()
    }, { once: true })
  }

  dispose() {
    console.info('[usermedia plugin] dispose')
  }
}

export default UserMediaPlugin;