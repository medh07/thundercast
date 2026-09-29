import { useEffect, useRef, useState } from 'react';
import type * as Leaflet from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { areaThreats, activeWarning, nowcastAt, stormAt, strikesAt } from '@/services/simulation';
import { observedTrack, riskAreaOutline, stormGeoOutline, toGeo } from '@/services/simulationGeo';
import type { StormState } from '@/data/simulation';

export type SimLayer = 'radar' | 'satellite' | 'lightning' | 'wrf' | 'ai';
export const simulationLayerNames: Record<SimLayer, string> = { radar: 'Radar', satellite: 'Satellite', lightning: 'Lightning', wrf: 'WRF/NWP', ai: 'AI Forecast' };
const bands = [
  { scale: 1, min: 18, cls: 'dbz-20' },
  { scale: .74, min: 32, cls: 'dbz-35' },
  { scale: .5, min: 45, cls: 'dbz-45' },
  { scale: .3, min: 54, cls: 'dbz-55' },
  { scale: .16, min: 60, cls: 'dbz-60' },
];
const leads = [30, 60, 90, 120];

type Props = { time: number; layers: Record<SimLayer, boolean>; state: StormState };

export function SimulationLeafletMap({ time, layers, state }: Props) {
  const node = useRef<HTMLDivElement>(null);
  const map = useRef<Leaflet.Map | null>(null);
  const leaflet = useRef<typeof Leaflet | null>(null);
  const overlays = useRef<Leaflet.LayerGroup | null>(null);
  const satelliteTiles = useRef<Leaflet.TileLayer | null>(null);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState(false);

  useEffect(() => {
    let disposed = false;
    let instance: Leaflet.Map | null = null;
    import('leaflet').then(L => {
      if (disposed || !node.current) return;
      leaflet.current = L;
      instance = L.map(node.current, { center: [28.6139, 77.209], zoom: 9, minZoom: 7, maxZoom: 15, zoomControl: true, scrollWheelZoom: true, preferCanvas: true });
      map.current = instance;
      L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, attribution: '&copy; Esri, HERE, Garmin & partners',
      }).addTo(instance);
      satelliteTiles.current = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
        maxZoom: 19, attribution: 'Imagery &copy; Esri and partners', opacity: .75,
      });
      overlays.current = L.layerGroup().addTo(instance);
      setReady(true);
      requestAnimationFrame(() => instance?.invalidateSize());
    }).catch(error => console.error('Map could not load', error));
    return () => { disposed = true; setReady(false); instance?.remove(); map.current = null; leaflet.current = null; overlays.current = null; satelliteTiles.current = null; };
  }, []);

  useEffect(() => {
    const L = leaflet.current, instance = map.current, group = overlays.current, satellite = satelliteTiles.current;
    if (!ready || !L || !instance || !group || !satellite) return;
    if (layers.satellite && !instance.hasLayer(satellite)) satellite.addTo(instance);
    if (!layers.satellite && instance.hasLayer(satellite)) instance.removeLayer(satellite);
  }, [ready, layers.satellite]);

  // The simulation service owns the scenario; this component only projects it.
  const frame = Math.floor(time * 4) / 4;
  useEffect(() => {
    const L = leaflet.current, group = overlays.current;
    if (!ready || !L || !group) return;
    group.clearLayers();
    const s = stormAt(frame);
    const color = (cls: string) => getComputedStyle(document.documentElement).getPropertyValue(cls).trim();
    const colors = {
      green: color('--green'), yellow: color('--yellow'), orange: color('--orange'), red: color('--red'),
      purple: color('--purple'), cyan: color('--cyan'), foreground: color('--foreground'), background: color('--background'),
    };
    const add = (layer: Leaflet.Layer) => group.addLayer(layer);

    // Risk footprints are approximate scenario areas, not administrative boundaries.
    const warning = activeWarning(frame);
    areaThreats.forEach(area => {
      const hit = area.impactT !== null && frame >= area.impactT && (area.passedT === null || frame < area.passedT);
      const warned = warning?.id === area.id;
      add(L.polygon(riskAreaOutline(area.x, area.y), {
        color: hit ? colors.red : warned ? colors.yellow : colors.cyan,
        weight: hit || warned ? 2 : 1, dashArray: hit ? undefined : '5 5', fillOpacity: hit ? .17 : warned ? .11 : .035,
      }).bindTooltip(`${area.name} · ${hit ? 'Impact in progress' : warned ? 'Early warning' : 'Risk area'}`));
      add(L.marker(toGeo(area.x, area.y), {
        icon: L.divIcon({ className: 'sim-place-label', html: area.name, iconSize: [90, 22], iconAnchor: [0, -7] }), interactive: false,
      }));
    });

    if (layers.wrf) {
      add(L.polygon(stormGeoOutline({ ...s, x: s.x + 90, y: s.y - 60, r: 80 + s.cape / 18 }, 1.2, 3), {
        color: colors.purple, fillColor: colors.purple, weight: 1, dashArray: '5 5', fillOpacity: .11,
      }).bindTooltip(`Synthetic WRF/NWP · CAPE ${Math.round(s.cape)} J/kg`));
    }
    if (layers.satellite) {
      add(L.polygon(stormGeoOutline({ ...s, r: s.r * 1.25 }, 1.15, 4), {
        color: colors.foreground, fillColor: colors.foreground, weight: 1, opacity: .32, fillOpacity: Math.min(.22, -s.ctt / 380),
      }).bindTooltip(`Simulated cloud tops · ${Math.round(s.ctt)} °C`));
    }

    if (frame > 0) add(L.polyline(observedTrack(frame), { color: colors.yellow, weight: 3, opacity: .9 }).bindTooltip('Observed T-01 track · synthetic replay'));

    if (layers.ai) {
      const predictions = leads.map(lead => nowcastAt(frame, lead)).filter(p => p.valid && p.dbz > 18);
      if (predictions.length) add(L.polyline([toGeo(s.x, s.y), ...predictions.map(p => toGeo(p.x, p.y))], {
        color: colors.cyan, weight: 2, dashArray: '8 7', opacity: .9,
      }).bindTooltip('AI predicted trajectory · synthetic'));
      predictions.forEach(p => {
        const point = toGeo(p.x, p.y);
        add(L.polygon(stormGeoOutline(p, .9, p.lead), { color: colors.cyan, weight: 1, dashArray: '4 5', fillOpacity: .045 + (120 - p.lead) / 800 }).bindTooltip(`+${p.lead} min · ${Math.round(p.dbz)} dBZ`));
        add(L.circle(point, { radius: (p.r * .95 + p.uncertainty) * 175, color: colors.cyan, weight: 1, dashArray: '3 5', fillOpacity: .025, opacity: .4, interactive: false }));
        add(L.marker(point, { icon: L.divIcon({ className: 'sim-forecast-pin', html: `+${p.lead}`, iconSize: [38, 22], iconAnchor: [19, 11] }) }).bindTooltip(`+${p.lead} min · ${Math.round(p.dbz)} dBZ`));
      });
    }

    if (layers.radar) bands.forEach((band, i) => {
      const opacity = Math.max(0, Math.min(1, (s.dbz - band.min) / 5));
      if (opacity <= 0) return;
      const fill = band.cls === 'dbz-20' ? colors.green : band.cls === 'dbz-35' ? colors.yellow : band.cls === 'dbz-45' ? colors.orange : band.cls === 'dbz-55' ? colors.red : colors.purple;
      add(L.polygon(stormGeoOutline(s, band.scale, i * 1.7), {
        color: fill, fillColor: fill, weight: 1, opacity: .7, fillOpacity: opacity * .58,
      }).on('click', () => setSelected(true)).bindTooltip(`T-01 · ${Math.round(s.dbz)} dBZ · ${s.stage}`));
    });

    if (layers.lightning) strikesAt(frame).forEach(strike => {
      add(L.marker(toGeo(strike.x, strike.y), { icon: L.divIcon({ className: 'sim-lightning-pin', html: 'ϟ', iconSize: [18, 24], iconAnchor: [9, 12] }), opacity: Math.max(.2, 1 - strike.age / 6), interactive: false }).bindTooltip('Simulated lightning strike'));
    });

    if (frame < 359 && s.dbz > 20) {
      add(L.circleMarker(toGeo(s.x, s.y), { radius: 11, color: colors.foreground, fillColor: colors.background, weight: 2, fillOpacity: .95 })
        .on('click', () => setSelected(true)).bindTooltip(`T-01 · ${s.stage} · Click for details`));
      add(L.marker(toGeo(s.x, s.y), { icon: L.divIcon({ className: 'sim-cell-pin', html: 'T-01', iconSize: [46, 22], iconAnchor: [23, -8] }) })
        .on('click', () => setSelected(true)));
    }
  }, [ready, frame, layers]);

  return <div className="sim-leaflet-wrap">
    <div ref={node} className="sim-leaflet" role="application" aria-label={`Interactive map of simulated storm T-01 at ${Math.round(state.dbz)} dBZ`} />
    {selected && <div className="sim-map-detail" role="dialog" aria-label="Storm cell T-01 details">
      <div className="sim-map-detail-head"><strong>T-01 · {state.stage}</strong><Button variant="ghost" size="icon" title="Close storm details" onClick={() => setSelected(false)}><X size={16} /></Button></div>
      <dl><div><dt>Reflectivity</dt><dd>{Math.round(state.dbz)} dBZ</dd></div><div><dt>Severity</dt><dd>{state.severity}</dd></div><div><dt>Lightning</dt><dd>{Math.round(state.lightning)} /min</dd></div><div><dt>Motion</dt><dd>{state.direction} · {Math.round(state.speed)} km/h</dd></div><div><dt>Rainfall</dt><dd>{state.rain.toFixed(1)} mm/h</dd></div></dl>
      <small>Simulated storm scenario</small>
    </div>}
  </div>;
}