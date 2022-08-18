import type Foreseen from "..";
import ForeseenPlugin from "./ForeseenPlugin";

const audioConfig = {
  minDecibels: -180,
  maxDecibels: 120,
  smoothingTimeConstant: 0.85,
  fftSize: 1024,
};

const makeUI = (plugin: UserMediaPlugin) => {
  const el = document.createElement('div');
  el.classList.add('foreseen-plugin')
  el.classList.add(`foreseen-plugin-${plugin.name}`)
  el.innerHTML = `
  <label>
    <span>Min. decibel</span>
    <input name="minDecibel" value="${plugin.audioConfig.minDecibels}" min="-240" max="0" type="number" />
  </label>
  <label>
    <span>Max. decibel</span>
    <input name="maxDecibel" value="${plugin.audioConfig.maxDecibels}" min="0" max="240" type="number" />
  </label>
  <label>
    <span>Smoothing time contstant</span>
    <input name="smoothingTimeContstant" value="${plugin.audioConfig.smoothingTimeConstant}" step="0.01" min="0" max="1" type="number" />
  </label>
  <label>
    <span>FFT Size</span>
    <input name="fftSize" value="${plugin.audioConfig.fftSize}" step="256" min="256" max="4096" type="number" />
  </label>
  `;
  el.querySelectorAll('input').forEach(el => el.addEventListener('change', () => {
    plugin.audioConfig = {
      ...audioConfig,
      [el.name]: el.value
    }
  }))
  return el
}

class UserMediaPlugin extends ForeseenPlugin {
  constructor(foreseen: Foreseen) {
    super(foreseen);
    this.#el = makeUI(this);
    foreseen.controls.append(this.#el);
  }

  #el: HTMLElement;

  #foreseen: Foreseen | null = null;

  get ready() {
    return !!this.#foreseen && !!this.#stream;
  }

  get controlsElement() {
    return this.#el;
  }

  #audioSource: MediaStreamAudioSourceNode | null = null;
  #audioContext: AudioContext | null = null;
  #analyser: AnalyserNode | null = null;
  #frequencyArray: Uint8Array | null = null;
  #timeDomainArray: Uint8Array | null = null;

  #audioConfig: typeof audioConfig = audioConfig;

  set audioConfig(update) {
    if (!this.#audioContext || !this.#stream) return;
    this.#audioConfig = update
    this.#analyser = this.#audioContext.createAnalyser();
    this.#analyser.minDecibels = update.minDecibels;
    this.#analyser.maxDecibels = update.maxDecibels;
    this.#analyser.smoothingTimeConstant = update.smoothingTimeConstant;
    this.#analyser.fftSize = update.fftSize;
    this.#audioSource = this.#audioContext.createMediaStreamSource(this.#stream);
    this.#audioSource.connect(this.#analyser);
  }

  get audioConfig() {
    return this.#audioConfig
  }

  #stream: MediaStream | null = null;

  async #getMedia() {
    try {
      this.#stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
      });

      this.#audioContext = new AudioContext();
      this.#analyser = this.#audioContext.createAnalyser();
      this.#analyser.minDecibels = this.audioConfig.minDecibels;
      this.#analyser.maxDecibels = this.audioConfig.maxDecibels;
      this.#analyser.smoothingTimeConstant = this.audioConfig.smoothingTimeConstant;
      this.#analyser.fftSize = this.audioConfig.fftSize;
      this.#frequencyArray = new Uint8Array(this.#analyser.frequencyBinCount);
      this.#timeDomainArray = new Uint8Array(this.#analyser.frequencyBinCount);
      this.#audioSource = this.#audioContext.createMediaStreamSource(this.#stream);
      this.#audioSource.connect(this.#analyser);
    } catch (err) {
      console.warn('[usermedia plugin] getMedia error', err);
    }
  }

  registerFunctions() {
    return {
      'frequency': (idx = 0) => {
        if (!this.ready || !this.#analyser || !this.#frequencyArray) return 1;
        this.#analyser.getByteFrequencyData(this.#frequencyArray)
        return this.#frequencyArray[idx]
      },
      'timeDomain': (idx = 0) => {
        if (!this.ready || !this.#analyser || !this.#timeDomainArray) return 1;
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

  connect() {
    window.addEventListener('mousemove', () => {
      console.info('[usermedia plugin] mousemove')
      this.#getMedia()
    }, { once: true })
  }

  dispose() {
    console.info('[usermedia plugin] dispose')
    this.#analyser?.disconnect()
    this.#audioContext?.close()
    this.parent.controls.remove(this.#el);
  }
}

export default UserMediaPlugin;