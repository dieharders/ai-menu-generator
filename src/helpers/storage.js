export const StorageAPI = {
  // Save an item to localStorage
  setItem: function (key, value) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  },

  // Load an item from localStorage
  getItem: function (key) {
    let value = localStorage.getItem(key);
    try {
      value = JSON.parse(value);
    } catch (e) {
      // Not a JSON string, return the value as is
    }
    return value;
  },

  // Remove an item from localStorage
  removeItem: function (key) {
    localStorage.removeItem(key);
  },

  // Clear all items from localStorage
  clear: function () {
    localStorage.clear();
  },
};
