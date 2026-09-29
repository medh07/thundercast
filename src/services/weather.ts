import { forecast, initialAlerts, sources, storms } from '@/data/weather';
// Replace the method bodies with API calls when live data feeds become available.
export const radarService = { getStorms: async () => storms, getStations: async () => sources[0] };
export const satelliteService = { getStatus: async () => sources[1] };
export const lightningService = { getActivity: async () => ({ lastHour: 248, strikes: storms.reduce((total, storm) => total + storm.lightning, 0) }), getStatus: async () => sources[2] };
export const weatherModelService = { getForecast: async () => forecast, getStatus: async () => sources[4] };
export const nowcastService = { getForecast: async () => forecast, getAlerts: async () => initialAlerts };
