export type LayerKey = 'radar' | 'satellite' | 'lightning' | 'stormCells' | 'predictedTrack' | 'coverage' | 'rainfall' | 'wind' | 'modelForecast';
export type Severity = 'Severe' | 'High' | 'Moderate';
export type Storm = { id: string; name: string; x: number; y: number; intensity: string; lightning: number; speed: number; direction: string; lifecycle: string; arrival: string; confidence: number; severity: Severity };
export type WeatherAlert = { id: string; title: string; region: string; severity: Severity; arrival: string; confidence: number; issued: string; status: 'Active' | 'Acknowledged' | 'Resolved'; detail: string };
export type ForecastPoint = { minutes: number; thunderstorm: number; lightning: number; rainfall: number; intensity: number; confidence: number };
export type SourceStatus = { id: string; name: string; station: string; status: 'Operational' | 'Degraded'; updated: string; latency: string; detail: string };
export type WeatherSettings = { layers: Record<LayerKey, boolean>; duration: number; updateInterval: number; alertThreshold: number; animationSpeed: number; compact: boolean };
