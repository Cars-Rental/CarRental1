export function toDisplayId(prefix, mongoId) {
  const idStr = mongoId.toString();
  const shortPart = idStr.slice(-6).toUpperCase();
  return `${prefix}-${shortPart}`;
}
