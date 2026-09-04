/**
 * Banda sonora de la intro generada con Web Audio API (sin assets).
 * Tres gestos: crujido de papel al abrir el flap, crack del sello de cera
 * y un timbre suave (music box) en la revelación de los nombres.
 *
 * El AudioContext puede requerir un gesto del usuario para arrancar
 * (política de autoplay del navegador); en ese caso se reanuda con el
 * primer pointerdown/keydown/touchstart.
 */

const CLAVE_MUTE = "wedding-intro-audio-muted";

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let ruido: AudioBuffer | null = null;
let habilitado =
  typeof localStorage !== "undefined" && localStorage.getItem(CLAVE_MUTE) !== "true";
let gestosProgramados = false;

const MUTE_GANANCIA = 0.5;

function crearContexto(): AudioContext | null {
  if (ctx) return ctx;
  const w = window as unknown as { webkitAudioContext?: typeof AudioContext };
  const Ctor = window.AudioContext ?? w.webkitAudioContext;
  if (!Ctor) return null;

  ctx = new Ctor();
  master = ctx.createGain();
  master.gain.value = habilitado ? MUTE_GANANCIA : 0;
  master.connect(ctx.destination);
  return ctx;
}

function programarReanudacion(): void {
  if (!ctx || gestosProgramados) return;
  gestosProgramados = true;
  const retomar = () => {
    void ctx?.resume();
    window.removeEventListener("pointerdown", retomar);
    window.removeEventListener("keydown", retomar);
    window.removeEventListener("touchstart", retomar);
  };
  window.addEventListener("pointerdown", retomar);
  window.addEventListener("keydown", retomar);
  window.addEventListener("touchstart", retomar);
}

/** Inicializa el canal. Llamar al montar la intro. */
export function asegurarCanal(): void {
  const contexto = crearContexto();
  if (!contexto) return;
  void contexto.resume();
  if (contexto.state !== "running") {
    programarReanudacion();
  }
}

export function esIntroAudioActivo(): boolean {
  return habilitado;
}

export function setIntroAudio(on: boolean): void {
  habilitado = on;
  if (typeof localStorage !== "undefined") {
    localStorage.setItem(CLAVE_MUTE, on ? "false" : "true");
  }
  if (master) master.gain.value = on ? MUTE_GANANCIA : 0;
}

function bufferRuido(): AudioBuffer | null {
  if (!ctx) return null;
  if (ruido) return ruido;
  const duracion = 1.2;
  const buffer = ctx.createBuffer(1, Math.floor(ctx.sampleRate * duracion), ctx.sampleRate);
  const datos = buffer.getChannelData(0);
  for (let i = 0; i < datos.length; i++) {
    datos[i] = Math.random() * 2 - 1;
  }
  ruido = buffer;
  return buffer;
}

function listo(): boolean {
  return Boolean(ctx && master && ctx.state === "running" && habilitado);
}

/** Crujido de papel: ráfaga de ruido pasada por un filtro de paso banda. */
export function tocarPapel(): void {
  if (!listo()) return;
  const c = ctx as AudioContext;
  const src = c.createBufferSource();
  src.buffer = bufferRuido();
  const filtro = c.createBiquadFilter();
  filtro.type = "bandpass";
  filtro.frequency.setValueAtTime(900, c.currentTime);
  filtro.frequency.exponentialRampToValueAtTime(2400, c.currentTime + 0.35);
  filtro.Q.value = 0.7;

  const t = c.currentTime;
  const env = c.createGain();
  env.gain.setValueAtTime(0.0001, t);
  env.gain.exponentialRampToValueAtTime(0.28, t + 0.16);
  env.gain.exponentialRampToValueAtTime(0.0001, t + 0.85);

  src.connect(filtro);
  filtro.connect(env);
  env.connect(master as GainNode);
  src.start(t);
  src.stop(t + 0.9);
}

/** Crack del sello: transiente seco de alta frecuencia + golpe grave corto. */
export function tocarCrack(): void {
  if (!listo()) return;
  const c = ctx as AudioContext;
  const t = c.currentTime;

  const frio = c.createBufferSource();
  frio.buffer = bufferRuido();
  const hp = c.createBiquadFilter();
  hp.type = "highpass";
  hp.frequency.value = 3200;

  const envFrio = c.createGain();
  envFrio.gain.setValueAtTime(0.5, t);
  envFrio.gain.exponentialRampToValueAtTime(0.0001, t + 0.09);

  frio.connect(hp);
  hp.connect(envFrio);
  envFrio.connect(master as GainNode);
  frio.start(t);
  frio.stop(t + 0.1);

  const grave = c.createOscillator();
  grave.type = "triangle";
  grave.frequency.setValueAtTime(170, t);
  grave.frequency.exponentialRampToValueAtTime(55, t + 0.28);
  const envGrave = c.createGain();
  envGrave.gain.setValueAtTime(0.32, t);
  envGrave.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

  grave.connect(envGrave);
  envGrave.connect(master as GainNode);
  grave.start(t);
  grave.stop(t + 0.32);
}

/** Timbre suave estilo music box al revelar los nombres. */
const NOTAS_TIMBRE = [783.99, 1174.66, 987.77, 1567.98]; // G5, D6, B5, G6

export function tocarTimbre(): void {
  if (!listo()) return;
  const c = ctx as AudioContext;
  NOTAS_TIMBRE.forEach((frecuencia, i) => {
    const t = c.currentTime + i * 0.13;
    const osc = c.createOscillator();
    osc.type = "sine";
    osc.frequency.value = frecuencia;
    const env = c.createGain();
    env.gain.setValueAtTime(0.0001, t);
    env.gain.exponentialRampToValueAtTime(0.09, t + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, t + 1.5);
    osc.connect(env);
    env.connect(master as GainNode);
    osc.start(t);
    osc.stop(t + 1.6);
  });
}