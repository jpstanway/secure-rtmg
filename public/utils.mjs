export const generateCrypto = (maxX, minX, maxY, minY) => {
  const id = `CR${String(Math.floor(Math.random() * 100))}`;
  const x = Math.floor(Math.random() * (maxX - minX) + minX);
  const y = Math.floor(Math.random() * (maxY - minY) + minY);
  const value = Math.floor(Math.random() * (10 - 1) + 1);

  return { x, y, value, id };
};
