// ERA5-style environment adapter. Currently synthetic: replace `getEnvironment` / `environmentField`
// with a real ERA5 (Copernicus CDS) feed without changing the UI.
export type EnvOverlay = 'cape' | 'moisture' | 'shear';
export type Level = 'LOW' | 'MODERATE' | 'HIGH' | 'VERY HIGH';
export type Environment = {
  cape: number; cin: number; tcwv: number; shear: number; t2m: number; d2m: number;
  timestamp: string; source: string; simulated: boolean;
};

export const envOverlayNames: Record<EnvOverlay, string> = { cape: 'CAPE', moisture: 'Atmospheric Moisture', shear: 'Wind / Shear' };

export function getEnvironment(): Environment {
  return { cape: 2450, cin: -35, tcwv: 48, shear: 22, t2m: 32.4, d2m: 24.8, timestamp: '26 May 2025 14:00 IST (08:30 UTC)', source: 'ERA5 Atmospheric Analysis', simulated: true };
}

const band = (v: number, cuts: [number, number, number]): Level => v >= cuts[2] ? 'VERY HIGH' : v >= cuts[1] ? 'HIGH' : v >= cuts[0] ? 'MODERATE' : 'LOW';
export const capeLevel = (v: number) => band(v, [1000, 2000, 3500]);
export const moistureLevel = (v: number) => band(v, [30, 42, 55]);
export const shearLevel = (v: number) => band(v, [10, 18, 28]);
// For CIN, weaker inhibition is more supportive; level describes inhibition strength.
export const cinLevel = (v: number): Level => { const a = Math.abs(v); return a >= 200 ? 'VERY HIGH' : a >= 100 ? 'HIGH' : a >= 50 ? 'MODERATE' : 'LOW'; };
export const spreadLevel = (t: number, d: number): Level => { const s = t - d; return s <= 5 ? 'VERY HIGH' : s <= 10 ? 'HIGH' : s <= 15 ? 'MODERATE' : 'LOW'; };

export const capeLabel = (v: number) => ({ LOW: 'Weak Instability', MODERATE: 'Moderate Instability', HIGH: 'High Instability', 'VERY HIGH': 'Extreme Instability' })[capeLevel(v)];
export const cinLabel = (v: number) => ({ LOW: 'Weak Inhibition', MODERATE: 'Moderate Inhibition', HIGH: 'Strong Inhibition', 'VERY HIGH': 'Capped' })[cinLevel(v)];
export const moistureLabel = (v: number) => ({ LOW: 'Dry', MODERATE: 'Moderate Moisture', HIGH: 'High Moisture', 'VERY HIGH': 'Very Moist' })[moistureLevel(v)];
export const shearLabel = (v: number) => ({ LOW: 'Weak', MODERATE: 'Moderate', HIGH: 'Strong / Supportive', 'VERY HIGH': 'Very Strong / Organised' })[shearLevel(v)];

const score = (l: Level) => ({ LOW: 0, MODERATE: 1, HIGH: 2, 'VERY HIGH': 3 })[l];

export function assessEnvironment(e: Environment) {
  const total = score(capeLevel(e.cape)) + score(moistureLevel(e.tcwv)) + score(shearLevel(e.shear)) + (3 - score(cinLevel(e.cin)));
  if (total >= 9) return { label: 'HIGHLY SUPPORTIVE FOR SEVERE CONVECTION', tone: 'severe' as const };
  if (total >= 6) return { label: 'SUPPORTIVE FOR THUNDERSTORMS', tone: 'high' as const };
  if (total >= 4) return { label: 'MARGINAL FOR CONVECTION', tone: 'moderate' as const };
  return { label: 'UNFAVOURABLE FOR CONVECTION', tone: 'low' as const };
}

export type Driver = { name: string; up: boolean; note: string };
export function predictionDrivers(e: Environment, radar: { dbz: number; dbzTrend: number }, lightning: { rate: number; trend: number }) {
  const drivers: Driver[] = [
    { name: 'CAPE', up: score(capeLevel(e.cape)) >= 2, note: capeLabel(e.cape) },
    { name: 'CIN', up: false, note: cinLabel(e.cin) },
    { name: 'Moisture', up: score(moistureLevel(e.tcwv)) >= 2, note: moistureLabel(e.tcwv).replace(' Moisture', '') },
    { name: 'Wind shear', up: score(shearLevel(e.shear)) >= 2, note: shearLabel(e.shear) },
    { name: 'Radar reflectivity', up: radar.dbzTrend >= 0, note: `${Math.round(radar.dbz)} dBZ` },
    { name: 'Lightning activity', up: lightning.trend >= 0, note: `${lightning.rate} strikes/min` },
  ];
  const envTone = assessEnvironment(e).tone;
  const obsUp = (radar.dbzTrend >= 0 ? 1 : 0) + (lightning.trend >= 0 ? 1 : 0);
  const conclusion = envTone === 'severe' && obsUp === 2 ? 'Rapid storm intensification likely'
    : (envTone === 'severe' || envTone === 'high') && obsUp >= 1 ? 'Storm likely to sustain or intensify'
    : envTone === 'moderate' ? 'Limited further development expected' : 'Storm likely to weaken';
  return { drivers, conclusion };
}

// Synthetic gridded field around Delhi NCR (0..1 intensity) for map overlays.
export function environmentField(kind: EnvOverlay, lat: number, lng: number) {
  const c = kind === 'cape' ? [28.35, 77.0] : kind === 'moisture' ? [28.2, 77.5] : [28.8, 76.9];
  const d = Math.hypot((lat - c[0]!) / 0.9, (lng - c[1]!) / 1.2);
  const wave = 0.12 * Math.sin(lat * 6 + lng * 4);
  return Math.max(0, Math.min(1, 1 - d * 0.75 + wave));
}
export const fieldValue = (kind: EnvOverlay, v: number) => kind === 'cape' ? `${Math.round(v * 3200)} J/kg` : kind === 'moisture' ? `${Math.round(20 + v * 38)} kg/m²` : `${Math.round(6 + v * 22)} m/s`;
