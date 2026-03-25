function joinLabels(items = []) {
  if (!items.length) return "";
  if (items.length === 1) return items[0];
  if (items.length === 2) return `${items[0]} and ${items[1]}`;
  return `${items.slice(0, -1).join(", ")}, and ${items[items.length - 1]}`;
}

function formatLetters(items = []) {
  return joinLabels(items.map((item) => String(item).toUpperCase()));
}

export function describeTrend(trend, label = "accuracy") {
  if (!trend) {
    return `There is not enough recent data yet to show a ${label} trend.`;
  }

  const previous = Number(trend.previousAvg ?? 0).toFixed(1);
  const recent = Number(trend.recentAccuracy ?? 0).toFixed(1);
  const delta = Math.abs(Number(trend.change ?? 0)).toFixed(1);

  if (trend.direction === "improving") {
    return `${label} improved from ${previous}% to ${recent}% over recent practice, a gain of ${delta} points.`;
  }

  if (trend.direction === "declining") {
    return `${label} shifted from ${previous}% to ${recent}% recently, a drop of ${delta} points that may need extra support.`;
  }

  return `${label} stayed broadly steady, moving from ${previous}% to ${recent}% across recent practice.`;
}

export function deriveTrendFromAttempts(attempts = []) {
  const usable = (attempts || [])
    .filter((item) => item && item.updatedAt)
    .sort((a, b) => new Date(a.updatedAt).getTime() - new Date(b.updatedAt).getTime());

  if (usable.length < 2) {
    return null;
  }

  const midpoint = Math.ceil(usable.length / 2);
  const older = usable.slice(0, midpoint);
  const recent = usable.slice(midpoint);

  const averageAccuracy = (items) =>
    items.reduce((sum, item) => sum + Number(item.accuracy ?? (item.correct ? 100 : 0) ?? 0), 0) /
    items.length;

  const previousAvg = averageAccuracy(older);
  const recentAccuracy = averageAccuracy(recent);
  const change = recentAccuracy - previousAvg;

  return {
    direction: Math.abs(change) < 2 ? "stable" : change > 0 ? "improving" : "declining",
    change: change.toFixed(1),
    previousAvg: previousAvg.toFixed(1),
    recentAccuracy: recentAccuracy.toFixed(1),
  };
}

export function describeLetterProgress(letters = []) {
  const practised = (letters || []).filter((item) => (item.attempts || 0) > 0);
  if (!practised.length) {
    return "No letter practice has been recorded in this timeframe yet.";
  }

  const strongest = [...practised]
    .sort((a, b) => Number(b.strength) - Number(a.strength))
    .slice(0, 3)
    .map((item) => item.letter);

  const mostPractised = [...practised]
    .sort((a, b) => (b.attempts || 0) - (a.attempts || 0))
    .slice(0, 3)
    .map((item) => item.letter);

  const focus = [...practised]
    .filter((item) => Number(item.strength) < 0)
    .sort((a, b) => Number(a.strength) - Number(b.strength))
    .slice(0, 3)
    .map((item) => item.letter);

  let text = `Most practised letters in this timeframe were ${formatLetters(mostPractised)}. `;
  text += `Current strengths are ${formatLetters(strongest)}.`;

  if (focus.length) {
    text += ` Extra support is still needed for ${formatLetters(focus)}.`;
  }

  return text;
}
