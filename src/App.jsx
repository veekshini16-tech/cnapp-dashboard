import { useState } from 'react';
import { useDashboard } from './store';
import AddWidgetDrawer from './AddWidgetDrawer.jsx';
import { Donut, StackedBar, Empty } from './Charts.jsx';

function Widget({ catId, w }) {
  const remove = useDashboard((s) => s.removeWidget);
  return (
    <div className="card">
      <div className="card-head">
        <h4>{w.name}</h4>
        <button className="x" aria-label={`Remove ${w.name}`} onClick={() => remove(catId, w.id)}>×</button>
      </div>
      {w.type === 'donut' && <Donut data={w.data} center={w.center} />}
      {w.type === 'bar' && <StackedBar data={w.data} total={w.total} totalLabel={w.totalLabel} />}
      {w.type === 'empty' && <Empty text={w.text} />}
      {(!w.type || w.type === 'text') && <p className="card-text">{w.text}</p>}
    </div>
  );
}

export default function App() {
  const categories = useDashboard((s) => s.categories);
  const [drawerTab, setDrawerTab] = useState(null); // category id or null
  const [filter, setFilter] = useState('');
  const q = filter.trim().toLowerCase();

  return (
    <>
      <header className="topbar">
        <nav className="crumbs">Home &gt; <b>Dashboard V2</b></nav>
        <input className="search" placeholder="Search anything…" value={filter} onChange={(e) => setFilter(e.target.value)} />
      </header>

      <main className="page">
        <div className="title-row">
          <h2>CNAPP Dashboard</h2>
          <div className="actions">
            <button className="btn" onClick={() => setDrawerTab(categories[0].id)}>Add Widget +</button>
            <button className="btn icon" aria-label="Reset dashboard" title="Reset to default" onClick={() => useDashboard.getState().reset()}>⟳</button>
            <select className="btn range" defaultValue="2"><option value="2">Last 2 days</option><option value="7">Last 7 days</option><option value="30">Last 30 days</option></select>
          </div>
        </div>

        {categories.map((c) => {
          const shown = c.widgets.filter((w) => w.visible && (!q || (w.name + w.text).toLowerCase().includes(q)));
          return (
            <section key={c.id}>
              <h3>{c.name}</h3>
              <div className="grid">
                {shown.map((w) => <Widget key={w.id} catId={c.id} w={w} />)}
                <button className="card add" onClick={() => setDrawerTab(c.id)}>+ Add Widget</button>
              </div>
            </section>
          );
        })}
      </main>

      {drawerTab && <AddWidgetDrawer initialTab={drawerTab} onClose={() => setDrawerTab(null)} />}
    </>
  );
}
