import { useState } from 'react';
import { Layers3, Play, Pause, Search, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { storms } from '@/data/weather';
import { stormAt } from '@/services/simulation';
import { SimulationLeafletMap, simulationLayerNames, type MapFocus, type SimLayer } from './SimulationLeafletMap';
import { useWeather } from './WeatherContext';

const times = [0, 15, 30, 45, 60, 120];
const places: Record<string, MapFocus> = {
  delhi: { lat: 28.6139, lng: 77.209, label: 'New Delhi' },
  'new delhi': { lat: 28.6139, lng: 77.209, label: 'New Delhi' },
  gurugram: { lat: 28.4595, lng: 77.0266, label: 'Gurugram' },
  noida: { lat: 28.5355, lng: 77.391, label: 'Noida' },
  jaipur: { lat: 26.9124, lng: 75.7873, label: 'Jaipur' },
  lucknow: { lat: 26.8467, lng: 80.9462, label: 'Lucknow' },
  agra: { lat: 27.1767, lng: 78.0081, label: 'Agra' },
  faridabad: { lat: 28.4089, lng: 77.3178, label: 'Faridabad' },
};
export function WeatherMap({ full = false }: { full?: boolean }) {
  const { settings, toggleLayer, time, setTime, playing, setPlaying } = useWeather();
  const [layersOpen, setLayersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [focus, setFocus] = useState<MapFocus | null>(null);
  const simTime = Math.min(360, 168 + time);
  const state = stormAt(simTime);
  const layers: Record<SimLayer, boolean> = {
    radar: settings.layers.radar,
    satellite: settings.layers.satellite,
    lightning: settings.layers.lightning,
    wrf: settings.layers.modelForecast,
    ai: settings.layers.predictedTrack,
  };
  const toggleSimLayer = (key: SimLayer) => toggleLayer(key === 'wrf' ? 'modelForecast' : key === 'ai' ? 'predictedTrack' : key);
  const locate = () => {
    const location = search.trim().toLowerCase();
    const matchedStorm = storms.find(storm => storm.name.toLowerCase().includes(location) && location.length > 1);
    const found = places[location] ?? (matchedStorm ? places[matchedStorm.id] : undefined);
    if (!found) { setSearchError('Location not found in this regional preview'); return; }
    setFocus(found);
    setSearchError('');
    setSearchOpen(false);
  };
  return <div className={`weather-map ${full ? 'weather-map-full' : ''}`}>
    <div className="map-heading"><strong>{full ? 'Live Radar + Satellite + Lightning Map' : 'Live Radar + Satellite + Lightning Overlay'}</strong><span className="live-indicator"><i /> SIMULATED</span></div>
    <div className="map-viewport">
      <SimulationLeafletMap time={simTime} layers={layers} state={state} focus={focus} className="weather-leaflet" />
      <div className="map-tools leaflet-map-tools"><Button variant="mapTool" size="icon" title="Toggle map layers" onClick={() => setLayersOpen(!layersOpen)}><Layers3 /></Button>{full && <Button variant="mapTool" size="icon" title="Search location" onClick={() => setSearchOpen(!searchOpen)}><Search /></Button>}</div>
      {settings.layers.predictedTrack && <div className="track-label"><span>✣</span><div>Predicted Storm Track<small>Next 2 hours</small></div></div>}
      {layersOpen && <div className="map-popover layer-popover"><div className="popover-heading"><strong>Map layers</strong><Button variant="ghost" size="icon" title="Close layers" onClick={() => setLayersOpen(false)}><X /></Button></div>{(Object.keys(simulationLayerNames) as SimLayer[]).map(key => <label key={key} className="layer-item"><input type="checkbox" checked={layers[key]} onChange={() => toggleSimLayer(key)} />{simulationLayerNames[key]}</label>)}</div>}
      {searchOpen && <div className="map-popover search-popover"><form onSubmit={event => { event.preventDefault(); locate(); }}><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Delhi, Noida, Jaipur..." aria-label="Search location" autoFocus /><Button type="submit" variant="default" size="icon" title="Find location"><Search /></Button></form>{searchError && <small className="error-text">{searchError}</small>}</div>}
    </div>
    <div className="map-bottom"><div className="scale"><span>0</span><span>50</span><span>100</span><span>150 km</span><div className="scale-bar" /></div><div className="map-legend"><span><i className="legend-rain" /> Light — Extreme</span><span><Zap size={13} className="icon-yellow" /> Lightning</span><span><i className="legend-track" /> Predicted Track</span><span><i className="legend-cover" /> Radar Coverage</span></div></div>
    {full && <div className="map-timeline"><Button variant="mapTool" size="icon" title={playing ? 'Pause animation' : 'Play animation'} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</Button><div className="timeline-options">{times.filter(t => t <= settings.duration).map(t => <Button key={t} variant={time === t ? 'timelineActive' : 'timeline'} onClick={() => setTime(t)}>{t === 0 ? 'Now' : `+${t} min`}</Button>)}</div><span className="timeline-time">+{time} min</span></div>}
  </div>;
}
