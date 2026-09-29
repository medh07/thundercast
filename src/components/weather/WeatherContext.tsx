import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { defaultSettings, initialAlerts } from '@/data/weather';
import type { LayerKey, WeatherAlert, WeatherSettings } from '@/types/weather';

type WeatherContextValue = { settings: WeatherSettings; setSetting: <K extends keyof WeatherSettings>(key: K, value: WeatherSettings[K]) => void; toggleLayer: (layer: LayerKey) => void; resetSettings: () => void; alerts: WeatherAlert[]; updateAlert: (id: string, status: WeatherAlert['status']) => void; time: number; setTime: (time: number) => void; playing: boolean; setPlaying: (playing: boolean) => void };
const Context = createContext<WeatherContextValue | null>(null);
const SETTINGS_KEY = 'thundercast-settings';
const ALERTS_KEY = 'thundercast-alerts';
export function WeatherProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<WeatherSettings>(defaultSettings);
  const [alerts, setAlerts] = useState<WeatherAlert[]>(initialAlerts);
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const saved = localStorage.getItem(SETTINGS_KEY);
      if (saved) { const parsed = JSON.parse(saved); setSettings({ ...defaultSettings, ...parsed, layers: { ...defaultSettings.layers, ...parsed.layers } }); }
      const savedAlerts = localStorage.getItem(ALERTS_KEY);
      if (savedAlerts) setAlerts(JSON.parse(savedAlerts));
    } catch { /* Ignore invalid saved preferences. */ }
    setLoaded(true);
  }, []);
  useEffect(() => { if (loaded) localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings)); }, [settings, loaded]);
  useEffect(() => { if (loaded) localStorage.setItem(ALERTS_KEY, JSON.stringify(alerts)); }, [alerts, loaded]);
  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => setTime(current => current >= settings.duration ? 0 : Math.min(settings.duration, current + 15)), 1200 / settings.animationSpeed);
    return () => window.clearInterval(timer);
  }, [playing, settings.duration, settings.animationSpeed]);
  const setSetting = <K extends keyof WeatherSettings>(key: K, value: WeatherSettings[K]) => setSettings(current => ({ ...current, [key]: value }));
  const toggleLayer = (layer: LayerKey) => setSettings(current => ({ ...current, layers: { ...current.layers, [layer]: !current.layers[layer] } }));
  const updateAlert = (id: string, status: WeatherAlert['status']) => setAlerts(current => current.map(alert => alert.id === id ? { ...alert, status } : alert));
  return <Context.Provider value={{ settings, setSetting, toggleLayer, resetSettings: () => setSettings(defaultSettings), alerts, updateAlert, time, setTime, playing, setPlaying }}>{children}</Context.Provider>;
}
export function useWeather() { const value = useContext(Context); if (!value) throw new Error('WeatherProvider missing'); return value; }
