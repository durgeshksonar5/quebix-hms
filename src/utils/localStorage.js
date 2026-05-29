// LocalStorage utility helper functions

export const getData = (key, defaultValue) => {
  try {
    const saved = localStorage.getItem(`quebix_${key}`);
    if (saved) {
      const parsed = JSON.parse(saved);
      // Auto-purge any stale data containing legacy naming/references if found
      const strVal = JSON.stringify(parsed).toLowerCase();
      if (
        strVal.includes('medicore') ||
        strVal.includes('connor') ||
        strVal.includes('doe') ||
        strVal.includes('smith') ||
        strVal.includes('parker')
      ) {
        localStorage.setItem(`quebix_${key}`, JSON.stringify(defaultValue));
        return defaultValue;
      }
      return parsed;
    }
  } catch (e) {
    console.error(`Error reading localStorage key quebix_${key}:`, e);
  }
  localStorage.setItem(`quebix_${key}`, JSON.stringify(defaultValue));
  return defaultValue;
};

export const saveData = (key, data) => {
  try {
    localStorage.setItem(`quebix_${key}`, JSON.stringify(data));
  } catch (e) {
    console.error(`Error saving localStorage key quebix_${key}:`, e);
  }
};

export const generateId = (prefix) => {
  const digits = String(Math.floor(100 + Math.random() * 900));
  return `${prefix}-${digits}`;
};

export const addItem = (key, item, idPrefix = 'ITEM') => {
  const data = getData(key, []);
  const newItem = {
    ...item,
    id: item.id || generateId(idPrefix),
    createdTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    date: item.date || new Date().toISOString().split('T')[0]
  };
  data.unshift(newItem);
  saveData(key, data);
  return newItem;
};

export const updateItem = (key, updatedItem) => {
  const data = getData(key, []);
  const index = data.findIndex(i => i.id === updatedItem.id);
  if (index !== -1) {
    data[index] = { ...data[index], ...updatedItem };
    saveData(key, data);
    return true;
  }
  return false;
};

export const deleteItem = (key, id) => {
  const data = getData(key, []);
  const filtered = data.filter(i => i.id !== id);
  saveData(key, filtered);
  return true;
};
