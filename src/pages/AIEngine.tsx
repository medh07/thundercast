import { ArrowRight, BellRing, Brain, Cloud, Combine, Crosshair, RadioTower, Satellite, Timer, Zap } from 'lucide-react';

const inputs = [
  { icon: RadioTower, name: 'Multiple DWR Radars', detail: 'Reflectivity & radial velocity (Delhi, Jaipur, Lucknow, Bhopal)' },
  { icon: Satellite, name: 'INSAT-3D', detail: 'IR 10.8 μm cloud-top temperature, cooling rate' },
  { icon: Zap, name: 'Lightning Network', detail: 'CG / IC strike rate and density' },
  { icon: Cloud, name: 'WRF / NWP', detail: 'CAPE, shear, moisture convergence' },
];
const stages = [
  { icon: Combine, name: 'Data Fusion', detail: 'Regrid, time-align and quality-control all sensors on a common grid' },
  { icon: Crosshair, name: 'AI Storm Detection / Tracking', detail: 'Identify convective cells (e.g. T-01), estimate motion & lifecycle stage' },
  { icon: Timer, name: '0–120 min Nowcast', detail: 'Predict position, intensity and lightning at +30/+60/+90/+120 min' },
  { icon: BellRing, name: 'Early Warning', detail: 'Flag threatened areas with arrival time, risks and lead time' },
];

export function AIEngine() {
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">SYSTEM ARCHITECTURE</span><h1>AI Engine</h1><p>How ThunderCast turns multi-sensor observations into early warnings</p></div><span className="sim-badge">PROTOTYPE MODEL — VALIDATION IN PROGRESS</span></div>
    <div className="engine-flow">
      <div className="engine-inputs">{inputs.map(i => <div className="panel engine-node input" key={i.name}><i.icon size={22} /><div><strong>{i.name}</strong><small>{i.detail}</small></div></div>)}</div>
      <div className="engine-merge" aria-hidden="true"><span /><ArrowRight /></div>
      <div className="engine-pipeline">{stages.map((st, idx) => <div className="engine-step" key={st.name}><div className={`panel engine-node stage ${idx === stages.length - 1 ? 'final' : ''}`}><span className="engine-num">{idx + 1}</span><st.icon size={24} /><div><strong>{st.name}</strong><small>{st.detail}</small></div></div>{idx < stages.length - 1 && <div className="engine-arrow" aria-hidden="true"><ArrowRight /></div>}</div>)}</div>
    </div>
    <section className="panel engine-note"><Brain size={20} /><p>In this prototype, every stage runs on deterministic synthetic data (see Storm Simulation). Each stage is a replaceable adapter, so real radar, satellite, lightning and model feeds — and a trained model — can be plugged in without changing the interface.</p></section>
  </div>;
}
