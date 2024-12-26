// utils/safeLocalStorage.js
export const safeLocalStorage = {
    getItem: (key) => {
      if (typeof window !== "undefined") {
        try {
          return localStorage.getItem(key);
        } catch (error) {
          console.error("Error accessing localStorage:", error);
        }
      }
      return null;
    },
    setItem: (key, value) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.setItem(key, value);
        } catch (error) {
          console.error("Error setting localStorage:", error);
        }
      }
    },
    removeItem: (key) => {
      if (typeof window !== "undefined") {
        try {
          localStorage.removeItem(key);
        } catch (error) {
          console.error("Error removing from localStorage:", error);
        }
      }
    },
  };
  