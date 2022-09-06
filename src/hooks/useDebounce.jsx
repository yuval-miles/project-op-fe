import { useCallback } from "react";

export function useDebounce(fn, delay) {
  let timeoutID;
  return useCallback(function (...args) {
    clearTimeout(timeoutID);
    timeoutID = window.setTimeout(() => fn.apply(args), delay);
  }, []);
}
