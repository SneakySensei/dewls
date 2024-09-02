export const moveToFront = <T>(arr: T[], from: number): T[] => {
  const _arr = [...arr];
  if (from > -1 && from !== 0) {
    const [element] = _arr.splice(from, 1);
    _arr.unshift(element);
  }

  return _arr;
};
