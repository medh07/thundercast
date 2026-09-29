import { useEffect, useRef, useState } from 'react';
import { Activity, AlertTriangle, Brain, CloudRain, Droplets, FastForward, Gauge, Navigation, Pause, Play, RotateCcw, Thermometer, Timer, Wind, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SEVERE_JUMP_MIN, SIM_REAL_SECONDS, SIM_TOTAL_MIN } from '@/data/simulation';
import { activeWarning, areaThreats, clockFor, explain, nowcastAt, stormAt } from '@/services/simulation';
import { SimulationLeafletMap, simulationLayerNames, type SimLayer } from '@/components/weather/SimulationLeafletMap';

const leads = [30, 60, 90, 120];
const riskOf = (v: number, hi: number, mid: number) => v >= hi ? 'High' : v >= mid ? 'Moderate' : 'Low';

export function StormSimulation() {
  const [time, setTime] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [layers, setLayers] = useState<Record<SimLayer, boolean>>({ radar: true, satellite: false, lightning: true, wrf: false, ai: true });
  const last = useRef<number | null>(null);

  useEffect(() => {
    if (!playing) { last.current = null; return; }
    let frame = 0;
    const tick = (now: number) => {
      const dt = last.current === null ? 0 : (now - last.current) / 1000;
      last.current = now;
      setTime(t => { const next = t + dt * speed * (SIM_TOTAL_MIN / SIM_REAL_SECONDS); if (next >= SIM_TOTAL_MIN) { setPlaying(false); return SIM_TOTAL_MIN; } return next; });
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [playing, speed]);

  const s = stormAt(time);
  const why = explain(time);
  const warning = activeWarning(time);
  const predictions = leads.map(l => nowcastAt(time, l)).filter(p => p.valid && p.dbz > 18);
  const toggle = (k: SimLayer) => setLayers(l => ({ ...l, [k]: !l[k] }));
  const restart = () => { setTime(0); setPlaying(true); };
  const alive = time < SIM_TOTAL_MIN - 1;

  return <div className="page sim-page">
    <div className="page-heading"><div><span className="eyebrow">SCENARIO REPLAY / STORM CELL T-01</span><h1>Storm Simulation</h1><p>A 6-hour thunderstorm lifecycle replayed in 5 minutes · deterministic synthetic event</p></div><span className="sim-badge">SIMULATED DATA</span></div>

    <div className="sim-layout">
      <div className="sim-main">
        <div className="panel sim-map">
          <div className="sim-map-head"><strong><Activity size={15} /> T-01 · {s.stage}</strong><span className={`sim-sev sim-sev-${s.severity.toLowerCase()}`}>{s.severity}</span><span className="sim-clock">{clockFor(time)} IST <small>T+{Math.floor(time)} min</small></span></div>
          <div className="sim-layers">{(Object.keys(simulationLayerNames) as SimLayer[]).map(k => <Button key={k} variant={layers[k] ? 'filterActive' : 'filter'} size="sm" onClick={() => toggle(k)}>{simulationLayerNames[k]}</Button>)}</div>
          <SimulationLeafletMap time={time} layers={layers} state={s} />

            {layers.wrf && <g className="wrf-layer"><ellipse cx={s.x + 90} cy={s.y - 60} rx={80 + s.cape / 18} ry={50 + s.cape / 30} fill="url(#wrfGrad)" style={{ opacity: Math.min(0.85, s.cape / 3000) }} /><text x={s.x + 110} y={s.y - 60 - s.cape / 30 - 12} className="sim-tag">WRF CAPE {Math.round(s.cape)} J/kg</text></g>}
            {layers.satellite && <g filter="url(#softer)" style={{ opacity: Math.min(0.8, -s.ctt / 80) }}><path d={stormPath({ ...s, r: s.r * 1.25 }, 1.15, 4)} className="sat-cloud" /><path d={stormPath({ ...s, r: s.r * 1.25 }, 0.6, 5)} className={s.ctt < -55 ? 'sat-cold' : 'sat-mid'} /></g>}

            {layers.ai && predictions.length > 0 && <g className="ai-layer">
              <path d={`M${s.x},${s.y} ${predictions.map(p => `L${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')}`} className="ai-track" />
              {predictions.map(p => <g key={p.lead}><circle cx={p.x} cy={p.y} r={p.r * 0.95 + p.uncertainty} className="ai-cone" /><path d={stormPath(p, 0.9, p.lead)} className={`ai-ghost ai-ghost-${p.lead}`} /><text x={p.x} y={p.y - p.r * 0.9 - p.uncertainty - 6} className="ai-label">+{p.lead} min · {Math.round(p.dbz)} dBZ</text></g>)}
            </g>}

            {layers.radar && <g filter="url(#soft)">{bands.map((b, i) => { const op = Math.max(0, Math.min(1, (s.dbz - b.min) / 5)); return op > 0 ? <path key={b.cls} d={stormPath(s, b.scale, i * 1.7)} className={b.cls} style={{ opacity: op * 0.9 }} /> : null; })}</g>}

            {areaThreats.map(a => { const warned = warning?.id === a.id; const hit = a.impactT !== null && time >= a.impactT && (a.passedT === null || time < a.passedT); return <g key={a.id} className={`sim-area ${warned ? 'warned' : ''} ${hit ? 'hit' : ''}`}><circle cx={a.x} cy={a.y} r={warned ? 16 : 6} className="area-ring" /><circle cx={a.x} cy={a.y} r="4" className="area-dot" /><text x={a.x + 10} y={a.y + 18} className="sim-place strong">{a.name}</text></g>; })}
            {mapPlaces.map(p => <g key={p.name}><circle cx={p.x} cy={p.y} r="3" className="area-dot muted" /><text x={p.x + 7} y={p.y + 4} className="sim-place">{p.name}</text></g>)}

            {layers.lightning && strikes.map(st => <g key={st.id} style={{ opacity: Math.max(0, 1 - st.age / 6) }}><path d={`M${st.x} ${st.y - 9} l-4 8 h5 l-4 9 l10 -12 h-5 l4 -5 z`} className={st.age < 0.6 ? 'strike-flash' : 'strike'} /></g>)}
            {alive && s.dbz > 20 && <g><path d={`M${s.x},${s.y} l${Math.cos((s.heading - 90) * Math.PI / 180) * 60},${Math.sin((s.heading - 90) * Math.PI / 180) * 60}`} className="motion-vector" /><text x={s.x - 18} y={s.y + 4} className="cell-id">T-01</text></g>}
          </svg>
          <div className="sim-legend"><span>dBZ</span><i className="dbz-20" />20<i className="dbz-35" />35<i className="dbz-45" />45<i className="dbz-55" />55<i className="dbz-60" />60+<span className="push-right"><i className="legend-ghost" /> AI nowcast +30…+120 min</span></div>
        </div>

        <div className="panel sim-controls">
          <Button variant="mapTool" size="icon" title={playing ? 'Pause' : 'Play'} onClick={() => { if (time >= SIM_TOTAL_MIN) setTime(0); setPlaying(!playing); }}>{playing ? <Pause /> : <Play />}</Button>
          <Button variant="mapTool" size="icon" title="Restart" onClick={restart}><RotateCcw /></Button>
          <input type="range" min={0} max={SIM_TOTAL_MIN} step={1} value={time} onChange={e => setTime(Number(e.target.value))} aria-label="Simulation timeline" className="sim-scrubber" style={{ ['--pct' as string]: `${(time / SIM_TOTAL_MIN) * 100}%` }} />
          <div className="segmented">{[1, 2, 4].map(v => <Button key={v} variant={speed === v ? 'segmentActive' : 'segment'} size="sm" onClick={() => setSpeed(v)}>{v}×</Button>)}</div>
          <Button variant="destructive" size="sm" onClick={() => { setTime(SEVERE_JUMP_MIN); }}><FastForward size={14} /> Jump to Severe Stage</Button>
        </div>
        <div className="sim-stages">{['Formation', 'Developing', 'Intensifying', 'Mature / Severe', 'Mature', 'Weakening', 'Dissipated'].map(st => <span key={st} className={s.stage === st ? 'active' : ''}>{st}</span>)}</div>
      </div>

      <aside className="sim-side">
        {warning && warning.impactT !== null && warning.issuedT !== null ? <section className={`panel sim-warning ${time >= warning.impactT ? 'impact' : ''}`}>
          <div className="panel-title"><AlertTriangle size={17} /> {time >= warning.impactT ? 'IMPACT IN PROGRESS' : 'EARLY WARNING ISSUED'}</div>
          <h2>{warning.name}</h2>
          <div className="warn-grid">
            <span>Expected arrival<strong>{time >= warning.impactT ? 'Now' : `~${Math.ceil(warning.impactT - time)} min`} <small>({clockFor(warning.impactT)} IST)</small></strong></span>
            <span>ThunderCast lead time<strong className="text-success">{warning.impactT - warning.issuedT} min</strong></span>
            <span>Lightning risk<strong>{riskOf(stormAt(warning.impactT).pLightning, 80, 50)}</strong></span>
            <span>Rainfall risk<strong>{riskOf(stormAt(warning.impactT).rain, 40, 12)}</strong></span>
            <span>Wind risk<strong>{riskOf(stormAt(warning.impactT).gust, 65, 35)}</strong></span>
            <span>Issued<strong>{clockFor(warning.issuedT)} IST</strong></span>
          </div>
        </section> : <section className="panel sim-warning idle"><div className="panel-title"><AlertTriangle size={17} /> Early Warning</div><p>{time < 60 ? 'Monitoring developing convection. No area threatened yet.' : 'No area currently in the forecast path.'}</p></section>}

        <section className="panel sim-metrics">
          <div className="panel-title"><Gauge size={16} /> Observed T-01</div>
          <div className="sim-metric-grid">
            <Metric icon={<Activity size={14} />} label="Reflectivity" value={`${Math.round(s.dbz)} dBZ`} pct={s.dbz / 65} />
            <Metric icon={<Zap size={14} />} label="Lightning" value={`${Math.round(s.lightning)} /min`} pct={s.lightning / 42} />
            <Metric icon={<Thermometer size={14} />} label="Cloud-top temp" value={`${Math.round(s.ctt)} °C`} pct={-s.ctt / 75} />
            <Metric icon={<Droplets size={14} />} label="Rainfall" value={`${s.rain.toFixed(1)} mm/h`} pct={s.rain / 72} />
            <Metric icon={<Wind size={14} />} label="Gusts" value={`${Math.round(s.gust)} km/h`} pct={s.gust / 86} />
            <Metric icon={<Navigation size={14} />} label="Motion" value={`${s.direction} @ ${Math.round(s.speed)} km/h`} pct={s.speed / 45} />
            <Metric icon={<CloudRain size={14} />} label="Thunderstorm prob." value={`${Math.round(s.pThunder)}%`} pct={s.pThunder / 100} />
            <Metric icon={<Zap size={14} />} label="Lightning prob." value={`${Math.round(s.pLightning)}%`} pct={s.pLightning / 100} />
          </div>
        </section>

        <section className="panel sim-why">
          <div className="panel-title"><Brain size={16} /> Why is AI predicting this?</div>
          <p>{why.signals.join(' + ')} → <strong>{why.verdict}</strong></p>
        </section>

        <section className="panel sim-nowcast">
          <div className="panel-title"><Timer size={16} /> AI Nowcast (0–120 min)</div>
          {leads.map(l => { const p = nowcastAt(time, l); return <div className="metric-row" key={l}><span>+{l} min · {clockFor(time + l)}</span>{p.valid ? <><strong>{Math.round(p.dbz)} dBZ</strong><b className={`sim-sev sim-sev-${p.severity.toLowerCase()}`}>{p.severity}</b></> : <small className="muted-text">beyond event</small>}</div>; })}
          <small className="muted-text">Prototype Model — Validation in Progress</small>
        </section>
      </aside>
    </div>
  </div>;
}

function Metric({ icon, label, value, pct }: { icon: React.ReactNode; label: string; value: string; pct: number }) {
  return <div className="sim-metric"><span>{icon}{label}</span><strong>{value}</strong><i style={{ width: `${Math.max(2, Math.min(100, pct * 100))}%` }} /></div>;
}
