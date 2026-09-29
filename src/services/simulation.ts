import { SIM_START_CLOCK, SIM_TOTAL_MIN, stormKeyframes, threatAreas, type SimSeverity, type StormState, type ThreatArea } from '@/data/simulation';

// Simulation adapter. Swap these functions for observed/ML outputs later; the UI only reads their results.
const lerp = (a: number, b: number, k: number) => a + (b - a) * k;
const smooth = (k: number) => k * k * (3 - 2 * k);
const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
export const clampT = (t: number) => Math.max(0, Math.min(SIM_TOTAL_MIN, t));
export function severityFor(dbz: number): SimSeverity { return dbz >= 58 ? 'Severe' : dbz >= 47 ? 'High' : dbz >= 32 ? 'Moderate' : 'Low'; }

export function stormAt(time: number): StormState {
  const t = clampT(time);
  let i = 0;
  while (i < stormKeyframes.length - 2 && stormKeyframes[i + 1]!.t <= t) i++;
  const a = stormKeyframes[i]!, b = stormKeyframes[i + 1]!;
  const k = smooth((t - a.t) / (b.t - a.t || 1));
  const num = (key: 'x' | 'y' | 'r' | 'dbz' | 'lightning' | 'ctt' | 'rain' | 'gust' | 'speed' | 'heading' | 'pThunder' | 'pLightning' | 'cape') => lerp(a[key], b[key], k);
  const dbz = num('dbz');
  const heading = num('heading');
  return { t, x: num('x'), y: num('y'), r: num('r'), dbz, lightning: num('lightning'), ctt: num('ctt'), rain: num('rain'), gust: num('gust'), speed: num('speed'), heading, pThunder: num('pThunder'), pLightning: num('pLightning'), cape: num('cape'), stage: k < 0.5 ? a.stage : b.stage, severity: severityFor(dbz), direction: dirs[Math.round(heading / 22.5) % 16]! };
}

// Deterministic "AI nowcast": scripted future with a small, growing, reproducible bias.
export function nowcastAt(time: number, lead: number) {
  const future = stormAt(time + lead);
  const bias = lead / 120;
  return { ...future, x: future.x + 14 * bias, y: future.y - 8 * bias, uncertainty: 10 + lead * 0.42, lead, valid: time + lead <= SIM_TOTAL_MIN };
}

// Smooth, evolving storm outline (reflectivity contour) from low-order harmonics.
export function stormPath(s: StormState, scale: number, seed = 0) {
  return `M${stormOutline(s, scale, seed).map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join('L')}Z`;
}

export function stormOutline(s: StormState, scale: number, seed = 0): [number, number][] {
  const pts: [number, number][] = [];
  const rot = (s.heading - 90) * Math.PI / 180;
  const stretch = 1 + Math.min(0.55, s.speed / 90);
  for (let i = 0; i < 48; i++) {
    const th = (i / 48) * Math.PI * 2;
    const wobble = 1 + 0.16 * Math.sin(3 * th + s.t * 0.045 + seed) + 0.1 * Math.sin(5 * th - s.t * 0.07 + seed * 2) + 0.07 * Math.cos(2 * th + s.t * 0.03);
    const lx = Math.cos(th) * s.r * scale * wobble * stretch;
    const ly = Math.sin(th) * s.r * scale * wobble * (1 / Math.sqrt(stretch));
    const x = s.x + lx * Math.cos(rot) - ly * Math.sin(rot) + Math.sin(th * 2 + seed) * s.r * scale * 0.08;
    const y = s.y + lx * Math.sin(rot) + ly * Math.cos(rot);
    pts.push([x, y]);
  }
  return pts;
}

const hash = (n: number) => { const x = Math.sin(n * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
export function strikesAt(time: number) {
  const out: { id: string; x: number; y: number; age: number }[] = [];
  const now = Math.floor(time);
  for (let m = Math.max(0, now - 6); m <= now; m++) {
    const s = stormAt(m);
    const count = Math.round(s.lightning / 4);
    for (let j = 0; j < count; j++) {
      const a = hash(m * 31 + j) * Math.PI * 2, d = Math.sqrt(hash(m * 17 + j * 7)) * s.r * 0.85;
      out.push({ id: `${m}-${j}`, x: s.x + Math.cos(a) * d, y: s.y + Math.sin(a) * d, age: time - m });
    }
  }
  return out;
}

export type AreaThreat = ThreatArea & { impactT: number | null; issuedT: number | null; passedT: number | null };
export const areaThreats: AreaThreat[] = threatAreas.map(area => {
  let impactT: number | null = null, passedT: number | null = null;
  for (let t = 0; t <= SIM_TOTAL_MIN; t++) {
    const s = stormAt(t); const hit = Math.hypot(s.x - area.x, s.y - area.y) < s.r * 0.8 && s.dbz >= 35;
    if (hit && impactT === null) impactT = t;
    if (!hit && impactT !== null && passedT === null) passedT = t;
  }
  let issuedT: number | null = null;
  if (impactT !== null) for (let t = Math.max(0, impactT - 120); t < impactT; t++) { if (stormAt(t).dbz >= 30) { issuedT = t; break; } }
  return { ...area, impactT, issuedT, passedT };
});

export function activeWarning(time: number) {
  return areaThreats.find(a => a.issuedT !== null && a.impactT !== null && time >= a.issuedT && (a.passedT === null || time < a.passedT)) ?? null;
}

export function explain(time: number) {
  const now = stormAt(time), past = stormAt(time - 15);
  const signals: string[] = [];
  const dDbz = now.dbz - past.dbz, dLtg = now.lightning - past.lightning, dCtt = now.ctt - past.ctt;
  signals.push(dDbz > 0.5 ? 'Radar reflectivity increasing' : dDbz < -0.5 ? 'Radar reflectivity decreasing' : 'Reflectivity steady');
  signals.push(dLtg > 0.3 ? 'lightning increasing' : dLtg < -0.3 ? 'lightning decreasing' : 'lightning steady');
  signals.push(dCtt < -0.5 ? 'cloud tops cooling' : dCtt > 0.5 ? 'cloud tops warming' : 'cloud tops steady');
  signals.push(now.cape >= 2200 ? 'WRF supports convection' : now.cape >= 1200 ? 'WRF shows marginal instability' : 'WRF shows weakening instability');
  const verdict = time >= 358 ? 'Storm Dissipated' : dDbz > 3 && dCtt < -3 ? 'Rapid Intensification Likely' : now.dbz >= 58 ? 'Severe Stage — Peak Impact Now' : dDbz > 0.5 ? 'Gradual Intensification' : dDbz < -3 ? 'Weakening — Dissipation Expected' : dDbz < -0.5 ? 'Gradual Weakening' : 'Steady State';
  return { signals, verdict, trend: { dDbz, dLtg, dCtt } };
}

export function clockFor(time: number) {
  const total = SIM_START_CLOCK.h * 60 + SIM_START_CLOCK.m + Math.floor(time);
  return `${String(Math.floor(total / 60) % 24).padStart(2, '0')}:${String(total % 60).padStart(2, '0')}`;
}
