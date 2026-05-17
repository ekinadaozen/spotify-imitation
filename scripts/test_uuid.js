function stringToUuid(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  
  const hex1 = Math.abs(hash).toString(16).padStart(8, '0');
  const hex2 = Math.abs(hash * 31).toString(16).padStart(8, '0');
  const hex3 = Math.abs(hash * 17).toString(16).padStart(8, '0');
  const hex4 = Math.abs(hash * 7).toString(16).padStart(8, '0');
  
  const fullHex = (hex1 + hex2 + hex3 + hex4).padEnd(32, '0');
  
  const uuid = `${fullHex.slice(0, 8)}-${fullHex.slice(8, 12)}-4${fullHex.slice(13, 16)}-8${fullHex.slice(17, 20)}-${fullHex.slice(20, 32)}`;
  return uuid;
}

console.log("UUID:", stringToUuid("f4quxcmstdutqkfghycvmapxp"));
