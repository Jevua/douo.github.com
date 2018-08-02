function xsum(data) {
  return data.map(i => 1.0 / i).reduce((s, i) => s + i);
}
/*
 * 返奖率
 */
function returnRate(data) {
  return 1 / xsum(data);
}
/*
 * 胜率
 */
function winRate(data) {
  const sum = xsum(data);
  return data.map(i => 1.0 / i / sum);
}
