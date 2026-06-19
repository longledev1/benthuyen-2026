import { useState, useEffect } from "react";

/**
 * Custom hook để trì hoãn việc cập nhật giá trị (Debounce)
 * @param {any} value Giá trị cần debounce
 * @param {number} delay Thời gian trễ (ms)
 */
export const useDebounce = (value, delay) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
};

export default useDebounce;
