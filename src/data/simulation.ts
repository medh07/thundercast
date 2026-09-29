// Deterministic, pre-scripted SYNTHETIC storm event (Storm Cell T-01).
// Replace `stormKeyframes` / `threatAreas` with observed radar/satellite/lightning/model
// data via src/services/simulation.ts — the UI only consumes `StormState`.

export type StormStage = 'Formation' | 'Developing' | 'Intensifying' | 'Mature / Severe' | 'Mature' | 'Weakening' | 'Dissipated';
export type SimSeverity = 'Low' | 'Moderate' | 'High' | 'Severe';
export type StormKeyframe = { t: number; x: number; y: number; r: number; dbz: number; lightning: number; ctt: number; rain: number; gust: number; speed: number; heading: number; pThunder: number; pLightning: number; cape: number; stage: StormStage };
export type StormState = Omit<StormKeyframe, 'stage'> & { stage: StormStage; severity: SimSeverity; direction: string };
export type ThreatArea = { id: string; name: string; x: number; y: number };

export const SIM_TOTAL_MIN = 360; // 6-hour lifecycle
export const SIM_REAL_SECONDS = 300; // replayed in 5 minutes at 1x
export const SEVERE_JUMP_MIN = 168;
export const SIM_START_CLOCK = { h: 12, m: 0 }; // 12:00 IST synthetic start

// Map coordinate space: 1000 x 700
export const stormKeyframes: StormKeyframe[] = [
  { t: 0, x: 150, y: 575, r: 16, dbz: 20, lightning: 0, ctt: -6, rain: 0.4, gust: 12, speed: 16, heading: 50, pThunder: 14, pLightning: 6, cape: 1900, stage: 'Formation' },
  { t: 45, x: 215, y: 530, r: 32, dbz: 33, lightning: 2, ctt: -22, rain: 3, gust: 22, speed: 24, heading: 48, pThunder: 38, pLightning: 22, cape: 2300, stage: 'Developing' },
  { t: 100, x: 300, y: 470, r: 56, dbz: 46, lightning: 11, ctt: -46, rain: 16, gust: 42, speed: 34, heading: 44, pThunder: 71, pLightning: 63, cape: 2700, stage: 'Intensifying' },
  { t: 150, x: 400, y: 405, r: 80, dbz: 57, lightning: 29, ctt: -66, rain: 48, gust: 70, speed: 42, heading: 40, pThunder: 91, pLightning: 88, cape: 2900, stage: 'Intensifying' },
  { t: 185, x: 470, y: 362, r: 95, dbz: 63, lightning: 41, ctt: -74, rain: 72, gust: 86, speed: 45, heading: 38, pThunder: 97, pLightning: 95, cape: 2600, stage: 'Mature / Severe' },
  { t: 235, x: 580, y: 300, r: 88, dbz: 56, lightning: 24, ctt: -64, rain: 44, gust: 62, speed: 43, heading: 36, pThunder: 86, pLightning: 79, cape: 1900, stage: 'Mature' },
  { t: 290, x: 690, y: 238, r: 64, dbz: 42, lightning: 8, ctt: -42, rain: 14, gust: 34, speed: 34, heading: 34, pThunder: 52, pLightning: 36, cape: 1100, stage: 'Weakening' },
  { t: 330, x: 765, y: 200, r: 40, dbz: 30, lightning: 2, ctt: -24, rain: 4, gust: 20, speed: 28, heading: 33, pThunder: 26, pLightning: 12, cape: 700, stage: 'Weakening' },
  { t: 360, x: 820, y: 175, r: 18, dbz: 16, lightning: 0, ctt: -8, rain: 0.2, gust: 12, speed: 22, heading: 32, pThunder: 8, pLightning: 3, cape: 500, stage: 'Dissipated' },
];

export const threatAreas: ThreatArea[] = [
  { id: 'gurugram', name: 'Gurugram', x: 325, y: 452 },
  { id: 'delhi', name: 'New Delhi', x: 470, y: 368 },
  { id: 'ghaziabad', name: 'Ghaziabad', x: 590, y: 296 },
  { id: 'meerut', name: 'Meerut', x: 700, y: 232 },
];
export const mapPlaces = [{ name: 'Jaipur', x: 120, y: 640 }, { name: 'Rohtak', x: 250, y: 330 }, { name: 'Noida', x: 540, y: 410 }, { name: 'Agra', x: 640, y: 610 }, { name: 'Moradabad', x: 870, y: 260 }];
