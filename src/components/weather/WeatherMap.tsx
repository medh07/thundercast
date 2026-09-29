import { useState } from 'react';
import { TransformComponent, TransformWrapper } from 'react-zoom-pan-pinch';
import { Crosshair, Layers3, MapPin, Minus, Play, Pause, Plus, Search, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { layerLabels, storms } from '@/data/weather';
import { useWeather } from './WeatherContext';
import radarImage from '@/assets/delhi-radar.jpg';
import satelliteImage from '@/assets/delhi-satellite.jpg';
import forecastImage from '@/assets/delhi-forecast.jpg';
import type { LayerKey, Storm } from '@/types/weather';

const times = [0, 15, 30, 45, 60, 120];
export function WeatherMap({ full = false }: { full?: boolean }) {
  const { settings, toggleLayer, time, setTime, playing, setPlaying } = useWeather();
  const [selected, setSelected] = useState<Storm | null>(null);
  const [layersOpen, setLayersOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [searchError, setSearchError] = useState('');
  const [center, setCenter] = useState<{ x: number; y: number; label: string } | null>(null);
  const image = settings.layers.satellite ? satelliteImage : settings.layers.modelForecast || settings.layers.rainfall ? forecastImage : radarImage;
  const locate = () => {
    const location = search.trim().toLowerCase();
    const places: Record<string, { x: number; y: number; label: string }> = { delhi: { x: 48, y: 59, label: 'New Delhi' }, 'new delhi': { x: 48, y: 59, label: 'New Delhi' }, gurugram: { x: 40, y: 68, label: 'Gurugram' }, noida: { x: 58, y: 65, label: 'Noida' }, jaipur: { x: 21, y: 72, label: 'Jaipur' }, lucknow: { x: 89, y: 64, label: 'Lucknow' }, agra: { x: 65, y: 80, label: 'Agra' }, faridabad: { x: 52, y: 72, label: 'Faridabad' } };
    const found = places[location] ?? storms.find(storm => storm.name.toLowerCase().includes(location) && location.length > 1);
    if (!found) { setSearchError('Location not found in this regional preview'); return; }
    setCenter(found);
    setSearchError('');
    setSearchOpen(false);
  };
  return <div className={`weather-map ${full ? 'weather-map-full' : ''}`}>
    <div className="map-heading"><strong>{full ? 'Live Radar + Satellite + Lightning Map' : 'Live Radar + Satellite + Lightning Overlay'}</strong><span className="live-indicator"><i /> LIVE</span></div>
    <div className="map-viewport">
      <TransformWrapper minScale={1} maxScale={4} initialScale={1} centerOnInit wheel={{ step: 0.12 }} doubleClick={{ mode: 'zoomIn' }}>
        {({ zoomIn, zoomOut, resetTransform }) => <>
          <TransformComponent wrapperClass="map-transform-wrap" contentClass="map-transform-content">
            <div className="map-canvas">
              <img src={image} alt="Illustrative Delhi NCR weather radar map" className="map-image" width={1536} height={1024} />
              {settings.layers.coverage && <svg className="map-svg" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true"><circle cx="365" cy="480" r="335" className="coverage-circle" /><circle cx="365" cy="480" r="226" className="coverage-circle" /><path d="M365 480 L118 247 M365 480 L680 210 M365 480 L660 695" className="coverage-line" /></svg>}
              {settings.layers.predictedTrack && <svg className="map-svg" viewBox="0 0 1000 760" preserveAspectRatio="none" aria-hidden="true"><path d="M430 458 Q505 330 770 211 Q823 185 810 124 Q783 75 735 124 Q540 252 408 420 Z" className="track-cone" /><path d="M430 458 Q560 290 760 167" className="track-dash" /><circle cx="575" cy="320" r="6" className="track-dot" /><circle cx="760" cy="167" r="7" className="track-dot" /></svg>}
              {settings.layers.wind && <div className="wind-arrows" aria-hidden="true">↗　↗　↗<br />　↗　↗　↗<br />↗　↗　↗</div>}
              {settings.layers.stormCells && storms.map(storm => <Button key={storm.id} variant="ghost" className={`storm-pin ${selected?.id === storm.id ? 'selected' : ''}`} style={{ left: `${storm.x}%`, top: `${storm.y}%` }} onClick={() => setSelected(storm)} title={`Inspect ${storm.name}`}><Zap size={18} fill="currentColor" /></Button>)}
              {settings.layers.lightning && <><span className="map-lightning" style={{ left: '38%', top: '56%' }}>ϟ</span><span className="map-lightning" style={{ left: '49%', top: '69%' }}>ϟ</span><span className="map-lightning" style={{ left: '28%', top: '77%' }}>ϟ</span></>}
              <span className="map-label" style={{ left: '50%', top: '60%' }}>New Delhi</span><span className="map-label" style={{ left: '12%', top: '71%' }}>Jaipur</span><span className="map-label" style={{ left: '68%', top: '79%' }}>Agra</span><span className="map-label" style={{ left: '87%', top: '67%' }}>Lucknow</span>
              {center && <span className="map-found" style={{ left: `${center.x}%`, top: `${center.y}%` }}><MapPin size={18} /> {center.label}</span>}
            </div>
          </TransformComponent>
          <div className="map-tools"><Button variant="mapTool" size="icon" title="Zoom in" onClick={() => zoomIn()}><Plus /></Button><Button variant="mapTool" size="icon" title="Zoom out" onClick={() => zoomOut()}><Minus /></Button><Button variant="mapTool" size="icon" title="Reset view" onClick={() => { resetTransform(); setCenter(null); }}><Crosshair /></Button><Button variant="mapTool" size="icon" title="Toggle map layers" onClick={() => setLayersOpen(!layersOpen)}><Layers3 /></Button>{full && <Button variant="mapTool" size="icon" title="Search location" onClick={() => setSearchOpen(!searchOpen)}><Search /></Button>}</div>
        </>}
      </TransformWrapper>
      {settings.layers.predictedTrack && !selected && <div className="track-label"><span>✣</span><div>Predicted Storm Track<small>Next 2 hours</small></div></div>}
      {layersOpen && <div className="map-popover layer-popover"><div className="popover-heading"><strong>Map layers</strong><Button variant="ghost" size="icon" title="Close layers" onClick={() => setLayersOpen(false)}><X /></Button></div>{(Object.keys(layerLabels) as LayerKey[]).map(key => <label key={key} className="layer-item"><input type="checkbox" checked={settings.layers[key]} onChange={() => toggleLayer(key)} />{layerLabels[key]}</label>)}</div>}
      {searchOpen && <div className="map-popover search-popover"><form onSubmit={event => { event.preventDefault(); locate(); }}><Input value={search} onChange={event => setSearch(event.target.value)} placeholder="Delhi, Noida, Jaipur..." aria-label="Search location" autoFocus /><Button type="submit" variant="default" size="icon" title="Find location"><Search /></Button></form>{searchError && <small className="error-text">{searchError}</small>}</div>}
      {selected && <div className="map-popover storm-detail"><div className="popover-heading"><strong><Zap size={15} /> {selected.name}</strong><Button variant="ghost" size="icon" title="Close storm details" onClick={() => setSelected(null)}><X /></Button></div><div className="storm-detail-grid"><span>Intensity<strong>{selected.intensity}</strong></span><span>Lightning<strong>{selected.lightning} strikes / hr</strong></span><span>Movement<strong>{selected.direction} · {selected.speed} km/h</strong></span><span>Lifecycle<strong>{selected.lifecycle}</strong></span><span>Arrival<strong>{selected.arrival}</strong></span><span>Confidence<strong>{selected.confidence}%</strong></span></div><p>Projected path: northeast toward Delhi NCR over the next 2 hours.</p></div>}
    </div>
    <div className="map-bottom"><div className="scale"><span>0</span><span>50</span><span>100</span><span>150 km</span><div className="scale-bar" /></div><div className="map-legend"><span><i className="legend-rain" /> Light — Extreme</span><span><Zap size={13} className="icon-yellow" /> Lightning</span><span><i className="legend-track" /> Predicted Track</span><span><i className="legend-cover" /> Radar Coverage</span></div></div>
    {full && <div className="map-timeline"><Button variant="mapTool" size="icon" title={playing ? 'Pause animation' : 'Play animation'} onClick={() => setPlaying(!playing)}>{playing ? <Pause /> : <Play />}</Button><div className="timeline-options">{times.filter(t => t <= settings.duration).map(t => <Button key={t} variant={time === t ? 'timelineActive' : 'timeline'} onClick={() => setTime(t)}>{t === 0 ? 'Now' : `+${t} min`}</Button>)}</div><span className="timeline-time">+{time} min</span></div>}
  </div>;
}
