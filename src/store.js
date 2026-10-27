import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import data from './data/dashboard.json';

// Single source of truth: categories -> widgets. `visible` = shown on the dashboard.
export const useDashboard = create(
  persist(
    (set) => ({
      categories: data.categories,

      // Cross icon on a widget
      removeWidget: (catId, widgetId) =>
        set((s) => ({
          categories: s.categories.map((c) =>
            c.id !== catId ? c : { ...c, widgets: c.widgets.map((w) => (w.id === widgetId ? { ...w, visible: false } : w)) }
          ),
        })),

      // Add Widget drawer "Confirm": selection = { widgetId: boolean }, newWidgets = [{catId,name,text}]
      applyChanges: (selection, newWidgets) =>
        set((s) => ({
          categories: s.categories.map((c) => ({
            ...c,
            widgets: [
              ...c.widgets.map((w) => (w.id in selection ? { ...w, visible: selection[w.id] } : w)),
              ...newWidgets
                .filter((n) => n.catId === c.id)
                .map((n) => ({ id: 'w' + Date.now() + Math.random().toString(36).slice(2, 6), name: n.name, text: n.text, type: 'text', visible: true })),
            ],
          })),
        })),

      reset: () => set({ categories: data.categories }),
    }),
    { name: 'cnapp-dashboard' }
  )
);
