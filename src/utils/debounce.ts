interface Debounce {
  (): any;
  clear: () => void;
  flush: () => void;
}

export const debounce = (
  func: (a: any) => any,
  wait: number,
  immediate: boolean = false
) => {
  let timeout: number | null;
  let args: any;
  let context: any;
  let timestamp: number;
  let result: any;

  const later = () => {
    const last = Date.now() - timestamp;

    if (last < wait && last >= 0) {
      timeout = window.setTimeout(later, wait - last);
    } else {
      timeout = null;
      if (!immediate) {
        result = func.apply(context, args);
        context = args = null;
      }
    }
  };

  const debouncedFunc: () => any = function(this: typeof debouncedFunc) {
    context = this;
    args = arguments;
    timestamp = Date.now();
    const callNow = immediate && !timeout;

    if (!timeout) {
      timeout = window.setTimeout(later, wait);
    }
    if (callNow) {
      result = func.apply(context, args);
      context = args = null;
    }

    return result;
  };

  const clear = () => {
    if (timeout) {
      clearTimeout(timeout);
      timeout = null;
    }
  };

  const flush = () => {
    if (timeout) {
      result = func.apply(context, args);
      context = args = null;

      clearTimeout(timeout);
      timeout = null;
    }
  };

  const debounced: Debounce = (() => {
    const f: any = debouncedFunc;
    f.clear = clear;
    f.flush = flush;
    return f;
  })();

  return debounced;
};
