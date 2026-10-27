const sum = (d) => d.reduce((a, x) => a + x.value, 0);

function Legend({ data }) {
  return (
    <ul className="legend">
      {data.map((d) => (
        <li key={d.label}><i style={{ background: d.color }} />{d.label} ({d.value})</li>
      ))}
    </ul>
  );
}

export function Donut({ data, center }) {
  const total = sum(data), r = 42, c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="donut-wrap">
      <svg viewBox="0 0 120 120" className="donut" role="img" aria-label="Donut chart">
        <g transform="rotate(-90 60 60)">
          {data.map((d) => {
            const len = (d.value / total) * c;
            const el = <circle key={d.label} cx="60" cy="60" r={r} fill="none" stroke={d.color} strokeWidth="16" strokeDasharray={`${len} ${c - len}`} strokeDashoffset={-offset} />;
            offset += len;
            return el;
          })}
        </g>
        <text x="60" y="60" textAnchor="middle" className="d-num">{center ?? total}</text>
        <text x="60" y="73" textAnchor="middle" className="d-lbl">Total</text>
      </svg>
      <Legend data={data} />
    </div>
  );
}

export function StackedBar({ data, total, totalLabel }) {
  const t = sum(data);
  return (
    <div>
      <p className="bar-total"><b>{total ?? t}</b> {totalLabel}</p>
      <div className="bar">
        {data.map((d) => <span key={d.label} style={{ width: `${(d.value / t) * 100}%`, background: d.color }} title={`${d.label}: ${d.value}`} />)}
      </div>
      <ul className="legend grid2">
        {data.map((d) => <li key={d.label}><i style={{ background: d.color }} />{d.label} ({d.value})</li>)}
      </ul>
    </div>
  );
}

export function Empty({ text }) {
  return (
    <div className="empty-chart">
      <svg width="44" height="44" viewBox="0 0 44 44" fill="none" stroke="#b8bcc6" strokeWidth="1.5"><path d="M6 36h32M10 36V24h5v12M19 36V16h5v20M28 36V20h5v16M8 18l9-7 8 4 11-9" /></svg>
      <span>{text}</span>
    </div>
  );
}
