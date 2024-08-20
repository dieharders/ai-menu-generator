export const StorageAPI = {
  // Save an item to localStorage
  setItem: function (key: string, value: any) {
    if (typeof value === "object") {
      value = JSON.stringify(value);
    }
    localStorage.setItem(key, value);
  },

  // Load an item from localStorage
  getItem: function (key: string) {
    let value: any = localStorage.getItem(key);
    try {
      value = JSON.parse(value);
    } catch (e) {
      // Not a JSON string, return the value as is
    }
    return value;
  },

  // Remove an item from localStorage
  removeItem: function (key: string) {
    localStorage.removeItem(key);
  },

  // Clear all items from localStorage
  clear: function () {
    localStorage.clear();
  },
};
