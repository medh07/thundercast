import type { ForecastPoint, LayerKey, SourceStatus, Storm, WeatherAlert, WeatherSettings } from '@/types/weather';

export const layerLabels: Record<LayerKey, string> = { radar: 'Radar', satellite: 'Satellite', lightning: 'Lightning', stormCells: 'Storm Cells', predictedTrack: 'Predicted Track', coverage: 'Radar Coverage', rainfall: 'Rainfall', wind: 'Wind', modelForecast: 'Model Forecast' };
export const defaultSettings: WeatherSettings = { layers: { radar: true, satellite: false, lightning: true, stormCells: true, predictedTrack: true, coverage: true, rainfall: false, wind: false, modelForecast: false }, duration: 120, updateInterval: 5, alertThreshold: 65, animationSpeed: 1, compact: false };
export const storms: Storm[] = [
  { id: 'delhi', name: 'Delhi Core', x: 42, y: 61, intensity: 'Very high · 62 dBZ', lightning: 248, speed: 45, direction: 'NE', lifecycle: 'Intensifying', arrival: '~45 min', confidence: 87, severity: 'Severe' },
  { id: 'gurugram', name: 'Gurugram Cell', x: 34, y: 71, intensity: 'High · 52 dBZ', lightning: 96, speed: 32, direction: 'NE', lifecycle: 'Mature', arrival: '~30 min', confidence: 84, severity: 'High' },
  { id: 'jaipur', name: 'Jaipur Cluster', x: 23, y: 83, intensity: 'Moderate · 41 dBZ', lightning: 42, speed: 27, direction: 'E', lifecycle: 'Developing', arrival: '~90 min', confidence: 78, severity: 'Moderate' },
];
export const forecast: ForecastPoint[] = [
  { minutes: 0, thunderstorm: 91, lightning: 84, rainfall: 32, intensity: 62, confidence: 94 },
  { minutes: 15, thunderstorm: 94, lightning: 89, rainfall: 39, intensity: 65, confidence: 92 },
  { minutes: 30, thunderstorm: 88, lightning: 82, rainfall: 35, intensity: 60, confidence: 90 },
  { minutes: 45, thunderstorm: 83, lightning: 76, rainfall: 28, intensity: 55, confidence: 87 },
  { minutes: 60, thunderstorm: 72, lightning: 67, rainfall: 21, intensity: 48, confidence: 83 },
  { minutes: 120, thunderstorm: 48, lightning: 42, rainfall: 12, intensity: 35, confidence: 76 },
];
export const initialAlerts: WeatherAlert[] = [
  { id: 'a1', title: 'Thunderstorm & Lightning Alert', region: 'Delhi (Rohini, Pitampura, North Delhi)', severity: 'Severe', arrival: '~45 min', confidence: 87, issued: '14:32 IST', status: 'Active', detail: 'High risk of severe thunderstorm with frequent cloud-to-ground lightning in the next 1–2 hours.' },
  { id: 'a2', title: 'Frequent Lightning Detected', region: 'Gurugram', severity: 'High', arrival: '~30 min', confidence: 84, issued: '14:25 IST', status: 'Active', detail: 'Lightning activity is increasing ahead of a northeast-moving storm cell.' },
  { id: 'a3', title: 'Heavy Rain Advisory', region: 'Noida', severity: 'Moderate', arrival: '~60 min', confidence: 79, issued: '14:18 IST', status: 'Active', detail: 'Moderate to heavy rainfall is possible as the storm system moves east.' },
  { id: 'a4', title: 'Rainfall Advisory', region: 'Faridabad', severity: 'Moderate', arrival: '~90 min', confidence: 74, issued: '13:55 IST', status: 'Resolved', detail: 'Earlier rainfall advisory. Conditions have improved.' },
];
export const sources: SourceStatus[] = [
  { id: 'radar', name: 'Multi-Radar', station: 'Delhi · Jaipur · Lucknow · Bhopal', status: 'Operational', updated: '14:30 IST', latency: '2 min', detail: 'Four radar stations contributing reflectivity and velocity scans.' },
  { id: 'satellite', name: 'Satellite Imagery', station: 'INSAT-3D | IR (10.8 μm)', status: 'Operational', updated: '14:20 IST', latency: '12 min', detail: 'Infrared cloud-top imagery across northern India.' },
  { id: 'lightning', name: 'Lightning Network', station: 'Ground-based detection', status: 'Operational', updated: '14:32 IST', latency: '< 1 min', detail: 'Cloud-to-ground and intra-cloud strike observations.' },
  { id: 'observations', name: 'Atmospheric Observations', station: 'Delhi NCR surface stations', status: 'Operational', updated: '14:28 IST', latency: '4 min', detail: 'Temperature, humidity, pressure and surface wind measurements.' },
  { id: 'model', name: 'Weather Models', station: 'WRF Model (6 km)', status: 'Operational', updated: '14:00 IST', latency: '32 min', detail: 'High-resolution model guidance for rainfall and storm development.' },
];
