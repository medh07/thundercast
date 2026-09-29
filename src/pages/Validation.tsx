import { useState } from 'react';
import { ClipboardCheck, Hourglass } from 'lucide-react';
import { Button } from '@/components/ui/button';

const leads = ['+30 min', '+60 min', '+90 min', '+120 min'];
const metrics = [
  { key: 'POD', name: 'Probability of Detection', formula: 'hits / (hits + misses)', better: 'Higher is better' },
  { key: 'FAR', name: 'False Alarm Ratio', formula: 'false alarms / (hits + false alarms)', better: 'Lower is better' },
  { key: 'CSI', name: 'Critical Success Index', formula: 'hits / (hits + misses + false alarms)', better: 'Higher is better' },
];

export function Validation() {
  const [lead, setLead] = useState(leads[0]!);
  return <div className="page"><div className="page-heading"><div><span className="eyebrow">MODEL EVALUATION</span><h1>Validation</h1><p>Verification framework for ThunderCast nowcasts</p></div><span className="sim-badge pending"><Hourglass size={12} /> HISTORICAL VALIDATION PENDING</span></div>
    <section className="panel validation-banner"><ClipboardCheck size={22} /><div><strong>Historical validation pending</strong><span>No verification results are shown. Scores will be computed against observed historical storm events once the evaluation dataset is prepared. Prototype Model — Validation in Progress.</span></div></section>
    <div className="segmented validation-leads">{leads.map(l => <Button key={l} variant={lead === l ? 'segmentActive' : 'segment'} size="sm" onClick={() => setLead(l)}>{l}</Button>)}</div>
    <div className="validation-grid">{metrics.map(m => <article className="panel validation-card" key={m.key}><span className="eyebrow">{m.key} · {lead}</span><h2>{m.name}</h2><div className="validation-value">—</div><small>Pending</small><p>{m.formula}</p><em>{m.better}</em></article>)}</div>
    <section className="panel validation-table"><div className="panel-title">POD / FAR / CSI by lead time</div><table><thead><tr><th>Lead time</th><th>POD</th><th>FAR</th><th>CSI</th></tr></thead><tbody>{leads.map(l => <tr key={l} className={l === lead ? 'active' : ''}><td>{l}</td><td>Pending</td><td>Pending</td><td>Pending</td></tr>)}</tbody></table></section>
    <section className="panel validation-table"><div className="panel-title">AI vs Baseline vs Actual</div><table><thead><tr><th>Series</th><th>Description</th><th>Status</th></tr></thead><tbody><tr><td>ThunderCast AI</td><td>AI nowcast of storm position, intensity and lightning</td><td>Pending</td></tr><tr><td>Baseline</td><td>Persistence / radar extrapolation reference</td><td>Pending</td></tr><tr><td>Actual</td><td>Observed radar, lightning and surface reports</td><td>Pending</td></tr></tbody></table></section>
  </div>;
}
