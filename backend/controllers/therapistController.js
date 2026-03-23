import {
  getDashboardSummaryData,
  getLetterReportData,
  getSentenceReportData,
  getStudentDetail,
  getStudentsForTeacher,
  getWordReportData,
} from "../services/reportingService.js";

export const getTherapistStudents = async (req, res) => {
  try {
    const students = await getStudentsForTeacher(req.user._id);
    return res.json({ students });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load students" });
  }
};

export const getStudentDetailForTherapist = async (req, res) => {
  try {
    const student = await getStudentDetail(req.params.studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    return res.json({ student });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load student details" });
  }
};

export const getStudentDashboardSummary = async (req, res) => {
  try {
    const data = await getDashboardSummaryData(req.params.studentId, req.query.timeframe);
    return res.json(data);
  } catch (error) {
    return res.status(500).json({ message: "Failed to load student summary" });
  }
};

export const getStudentWordReport = async (req, res) => {
  try {
    const data = await getWordReportData(req.params.studentId, req.query.timeframe);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load word report" });
  }
};

export const getStudentSentenceReport = async (req, res) => {
  try {
    const data = await getSentenceReportData(req.params.studentId, req.query.timeframe);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load sentence report" });
  }
};

export const getStudentLetterReport = async (req, res) => {
  try {
    const data = await getLetterReportData(req.params.studentId, req.query.timeframe);
    return res.json({ data });
  } catch (error) {
    return res.status(500).json({ message: "Failed to load letter report" });
  }
};

export const assignStudentToTherapist = async (_req, res) => {
  return res.status(501).json({ message: "Use relationship routes to assign students." });
};

export const removeStudentFromTherapist = async (_req, res) => {
  return res.status(501).json({ message: "Use relationship routes to remove students." });
};
