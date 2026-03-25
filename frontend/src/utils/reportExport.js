function sanitizeSegment(value) {
  return String(value || "report")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50) || "report";
}

function csvEscape(value) {
  if (value == null) {
    return "";
  }

  const text = String(value);
  if (/[",\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function toCsv(rows) {
  return rows.map((row) => row.map(csvEscape).join(",")).join("\n");
}

function downloadTextFile(filename, content, mimeType = "text/csv;charset=utf-8;") {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

function buildSummaryRows(summary) {
  return [
    ["Section", "Metric", "Value"],
    ["Letters", "Total", summary?.letters?.total ?? 0],
    ["Letters", "Average Strength", `${summary?.letters?.avgStrength ?? 0}%`],
    ["Words", "Total", summary?.words?.total ?? 0],
    ["Words", "Success Rate", `${summary?.words?.successRate ?? 0}%`],
    ["Sentences", "Total", summary?.sentences?.total ?? 0],
    ["Sentences", "Success Rate", `${summary?.sentences?.successRate ?? 0}%`],
  ];
}

function buildLetterRows(reportData) {
  return [
    ["Letter", "Strength", "Attempts"],
    ...((reportData?.letters || []).map((item) => [
      item.letter,
      `${item.strength}%`,
      item.attempts ?? 0,
    ])),
  ];
}

function buildWordRows(reportData) {
  const words = [
    ...((reportData?.twoLetter?.allWords || []).map((item) => ({
      category: "Two-letter",
      ...item,
    }))),
    ...((reportData?.words?.allWords || []).map((item) => ({
      category: "Word",
      ...item,
    }))),
  ];

  return [
    ["Category", "Target", "Attempts", "Correct", "Accuracy", "Avg Response (s)"],
    ...words.map((item) => [
      item.category,
      item.word,
      item.totalAttempts ?? 0,
      item.correctCount ?? 0,
      `${item.successRate ?? 0}%`,
      typeof item.avgResponseTime === "number"
        ? (item.avgResponseTime / 1000).toFixed(2)
        : "",
    ]),
  ];
}

function buildSentenceRows(reportData) {
  return [
    ["Sentence", "Status", "Accuracy", "Response (s)", "Eye Score"],
    ...((reportData?.attempts || []).map((item) => [
      item.sentence,
      item.correct ? "Correct" : "Needs focus",
      `${item.accuracy ?? 0}%`,
      typeof item.responseTime === "number" ? (item.responseTime / 1000).toFixed(2) : "",
      item.eyeScore ?? "",
    ])),
  ];
}

export function downloadReportCsv({
  profileLabel,
  subjectName,
  reportType,
  timeframe,
  summary,
  reportData,
}) {
  const selectedType = reportType || "summary";
  let rows = [];

  if (selectedType === "summary") {
    rows = buildSummaryRows(summary);
  } else if (selectedType === "letters") {
    rows = buildLetterRows(reportData);
  } else if (selectedType === "words") {
    rows = buildWordRows(reportData);
  } else if (selectedType === "sentences") {
    rows = buildSentenceRows(reportData);
  } else {
    rows = [["Message"], ["No export data available"]];
  }

  const metadataRows = [
    ["Profile", profileLabel || "Report"],
    ["Subject", subjectName || "Learner"],
    ["Report Type", selectedType],
    ["Timeframe (days)", timeframe ?? ""],
    ["Exported At", new Date().toLocaleString()],
    [],
  ];

  const filename = [
    sanitizeSegment(profileLabel),
    sanitizeSegment(subjectName),
    sanitizeSegment(selectedType),
    `${timeframe || "all"}d`,
    "report.csv",
  ].join("-");

  downloadTextFile(filename, toCsv([...metadataRows, ...rows]));
}
