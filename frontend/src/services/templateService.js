let cachedTemplates = null;

async function loadTemplates() {
  if (cachedTemplates) return cachedTemplates;
  const res = await fetch('/data/templates.json');
  cachedTemplates = await res.json();
  return cachedTemplates;
}

export const templateService = {
  getTemplates: async (category) => {
    const templates = await loadTemplates();
    if (category && category !== 'all') {
      return templates.filter((t) => t.category === category);
    }
    return templates;
  },

  getTemplate: async (slug) => {
    const templates = await loadTemplates();
    return templates.find((t) => t.slug === slug) || null;
  },
};
