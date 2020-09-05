import { useState } from "react";

function useStorageState(key, initialValue, storage = localStorage) {
  const [value, setValue] = useState(() => {
    try {
      const value = storage.getItem(key);
      return value ? JSON.parse(value) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue;
    }
  });

  function handleChange(newValue) {
    storage.setItem(key, JSON.stringify(newValue));
    setValue(newValue);
  }

  return [value, handleChange];
}

export default useStorageState;
