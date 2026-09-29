import { stormAt, stormOutline } from './simulation';
import type { StormState } from '@/data/simulation';

// Synthetic 1000×700 simulation grid anchored over Delhi NCR. These are
// approximate demonstration coordinates, NOT observed storm geolocations.
export type GeoPoint = [latitude: number, longitude: number];
export function toGeo(x: number, y: number): GeoPoint {
  return [28.6139 - (y - 368) * 0.00178, 77.209 + (x - 470) * 0.0017];
}

export function stormGeoOutline(state: StormState, scale: number, seed = 0): GeoPoint[] {
  return stormOutline(state, scale, seed).map(([x, y]) => toGeo(x, y));
}

export function observedTrack(time: number): GeoPoint[] {
  const points: GeoPoint[] = [];
  for (let t = 0; t < time; t += 5) {
    const state = stormAt(t);
    points.push(toGeo(state.x, state.y));
  }
  const current = stormAt(time);
  points.push(toGeo(current.x, current.y));
  return points;
}

export function riskAreaOutline(x: number, y: number): GeoPoint[] {
  return Array.from({ length: 24 }, (_, i) => {
    const angle = i * Math.PI / 12;
    return toGeo(x + Math.cos(angle) * 35, y + Math.sin(angle) * 30);
  });
}