import { BrainCircuit, CloudSun, Map as MapIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useWeather } from './WeatherContext';
import { stormAt } from '@/services/simulation';
import {
  assessEnvironment, capeLabel, capeLevel, cinLabel, cinLevel, envOverlayNames, getEnvironment, moistureLabel, moistureLevel,
  predictionDrivers, shearLabel, shearLevel, spreadLevel, type EnvOverlay, type Level,
} from '@/services/environment';

const sev = (l: Level) => ({ LOW: 'low', MODERATE: 'moderate', HIGH: 'high', 'VERY HIGH': 'severe' })[l];
const fmt = (n: number) => n.toLocaleString('en-US');

export function AtmosphericPanel() {
  const { envOverlay, setEnvOverlay, time } = useWeather();
  const env = getEnvironment();
  const assessment = assessEnvironment(env);
  const simT = Math.min(360, 168 + time);
  const now = stormAt(simT), prev = stormAt(Math.max(0, simT - 15));
  const { drivers, conclusion } = predictionDrivers(env, { dbz: now.dbz, dbzTrend: now.dbz - prev.dbz }, { rate: Math.round(now.lightning), trend: now.lightning - prev.lightning });
  const spread = spreadLevel(env.t2m, env.d2m);
  const params = [
    { name: 'CAPE', value: `${fmt(env.cape)} J/kg`, label: capeLabel(env.cape), level: capeLevel(env.cape) },
    { name: 'CIN', value: `−${fmt(Math.abs(env.cin))} J/kg`, label: cinLabel(env.cin), level: cinLevel(env.cin) },
    { name: 'Total Column Water Vapour', value: `${env.tcwv} kg/m²`, label: moistureLabel(env.tcwv), level: moistureLevel(env.tcwv) },
    { name: '0–6 km Wind Shear', value: `${env.shear} m/s`, label: shearLabel(env.shear), level: shearLevel(env.shear) },
    { name: '2m Temperature', value: `${env.t2m.toFixed(1)}°C`, label: 'Surface heating', level: (env.t2m >= 35 ? 'VERY HIGH' : env.t2m >= 30 ? 'HIGH' : env.t2m >= 25 ? 'MODERATE' : 'LOW') as Level },
    { name: '2m Dew Point', value: `${env.d2m.toFixed(1)}°C`, label: `Spread ${(env.t2m - env.d2m).toFixed(1)}°C`, level: spread },
  ];
  const [showChoices, setShowChoices] = [envOverlay !== null, (on: boolean) => setEnvOverlay(on ? 'cape' : null)];
  const viewOnMap = () => { setShowChoices(!showChoices); if (!showChoices) document.querySelector('.weather-map')?.scrollIntoView({ behavior: 'smooth', block: 'center' }); };

  return <div className="atmos-row">
    <section className="panel atmos-panel" aria-label="3D Atmospheric Environment">
      <div className="atmos-head"><div className="panel-title"><CloudSun size={17} /> 3D Atmospheric Environment</div>{env.simulated && <span className="sim-tag">SIMULATED ERA5 ENVIRONMENT</span>}</div>
      <div className="atmos-grid">{params.map(p => <div className="atmos-param" key={p.name}><span title={p.name}>{p.name}</span><strong>{p.value}</strong><small>{p.label}</small><b className={`severity severity-${sev(p.level)}`}>{p.level}</b></div>)}</div>
      <div className="atmos-foot">
        <div className="atmos-assess">Atmospheric Environment:<b className={`severity severity-${assessment.tone}`}>{assessment.label}</b><small>Source: {env.source}{env.simulated ? ' (simulated values)' : ''} · {env.timestamp}</small></div>
        <div className="env-choices">
          {showChoices && (Object.keys(envOverlayNames) as EnvOverlay[]).map(k => <Button key={k} size="sm" variant={envOverlay === k ? 'filterActive' : 'filter'} onClick={() => setEnvOverlay(k)}>{envOverlayNames[k]}</Button>)}
          <Button size="sm" variant="outline" onClick={viewOnMap}><MapIcon size={14} /> {showChoices ? 'Hide from Map' : 'View on Map'}</Button>
        </div>
      </div>
    </section>
    <section className="panel drivers-panel" aria-label="Why is ThunderCast predicting this?">
      <div className="panel-title"><BrainCircuit size={17} /> Why is ThunderCast predicting this?</div>
      <div className="drivers-list">{drivers.map(d => <div className="driver" key={d.name}><i className={d.up ? 'up' : 'down'}>{d.up ? '↑' : '↓'}</i><span>{d.name}</span><small>{d.note}</small></div>)}</div>
      <div className="drivers-conclusion">→ {conclusion}</div>
      <div className="drivers-fusion">Radar + Satellite + Lightning + Atmospheric Environment + AI</div>
    </section>
  </div>;
}
