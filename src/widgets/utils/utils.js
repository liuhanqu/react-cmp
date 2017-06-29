export const round = (number, decimals) => {
  if (!isNaN(parseFloat(number)) && isFinite(number)) {
    const decimalPower = 10 ** decimals;
    return Math.round(parseFloat(number) * decimalPower) / decimalPower;
  }

  return NaN;
};

export const range = (start = 0, stop = null, step = 1) => {
  let [_start, _stop] = [0, start];
  if (stop !== null) {
    [_start, _stop] = [start, stop];
  }
  const length = Math.max(Math.ceil((_stop - _start) / step), 0);
  const _range = Array(length);

  for (let idx = 0; idx < length; idx += 1, _start += step) {
    _range[idx] = _start;
  }

  return _range;
};

export const getViewport = () => ({
  height: window.innerHeight || document.documentElement.offsetHeight,
  width: window.innerWidth || document.documentElement.offsetWidth,
});
