import { useState } from 'react';
import { useDashboard } from './store';

export default function AddWidgetDrawer({ initialTab, onClose }) {
  const categories = useDashboard((s) => s.categories);
  const applyChanges = useDashboard((s) => s.applyChanges);

  const [tab, setTab] = useState(initialTab);
  const [query, setQuery] = useState('');
  // Draft checkbox state, committed only on Confirm
  const [selection, setSelection] = useState(() =>
    Object.fromEntries(categories.flatMap((c) => c.widgets.map((w) => [w.id, w.visible])))
  );
  const [pending, setPending] = useState([]); // new widgets created in this session
  const [name, setName] = useState('');
  const [text, setText] = useState('');

  const q = query.trim().toLowerCase();
  const matches = (w) => !q || (w.name + ' ' + w.text).toLowerCase().includes(q);
  // With a search term, look through ALL categories; otherwise show the active tab.
  const rows = categories
    .filter((c) => q || c.id === tab)
    .flatMap((c) => [
      ...c.widgets.filter(matches).map((w) => ({ ...w, key: w.id, catName: c.tab, pendingItem: false })),
      ...pending.map((p, i) => ({ ...p, key: 'p' + i, catName: c.tab, pendingItem: true })).filter((p) => p.catId === c.id && matches(p)),
    ]);

  const stage = () => {
    if (!name.trim()) return;
    setPending([...pending, { catId: tab, name: name.trim(), text: text.trim() || 'Random widget text' }]);
    setName(''); setText('');
  };
  const confirm = () => { applyChanges(selection, pending); onClose(); };

  return (
    <div className="overlay" onClick={onClose}>
      <aside className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Add Widget">
        <div className="drawer-head"><span>Add Widget</span><button className="x light" aria-label="Close" onClick={onClose}>×</button></div>
        <div className="drawer-body">
          <p className="hint">Personalise your dashboard by adding the following widget</p>
          <input className="field" placeholder="Search widgets…" value={query} onChange={(e) => setQuery(e.target.value)} />
          <div className="tabs">
            {categories.map((c) => (
              <button key={c.id} className={c.id === tab && !q ? 'tab on' : 'tab'} onClick={() => { setTab(c.id); setQuery(''); }}>{c.tab}</button>
            ))}
          </div>

          <div className="list">
            {rows.length === 0 && <p className="empty">No widgets found.</p>}
            {rows.map((r) => (
              <label key={r.key} className="row">
                <input type="checkbox"
                  checked={r.pendingItem ? true : !!selection[r.id]}
                  disabled={r.pendingItem}
                  onChange={(e) => setSelection({ ...selection, [r.id]: e.target.checked })} />
                <span>{r.name}{q && <em> · {r.catName}</em>}{r.pendingItem && <em> · new</em>}</span>
              </label>
            ))}
          </div>

          <div className="new">
            <b>Create a new widget in {categories.find((c) => c.id === tab)?.tab}</b>
            <input className="field" placeholder="Widget name" value={name} onChange={(e) => setName(e.target.value)} />
            <textarea className="field" rows="2" placeholder="Widget text" value={text} onChange={(e) => setText(e.target.value)} />
            <button className="btn" disabled={!name.trim()} onClick={stage}>Add to {categories.find((c) => c.id === tab)?.tab}</button>
          </div>
        </div>
        <div className="drawer-foot">
          <button className="btn" onClick={onClose}>Cancel</button>
          <button className="btn dark" onClick={confirm}>Confirm</button>
        </div>
      </aside>
    </div>
  );
}
