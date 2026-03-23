import express from "express";
import {
  getTherapistStudents,
  getStudentDetailForTherapist,
  getStudentDashboardSummary,
  getStudentWordReport,
  getStudentSentenceReport,
  getStudentLetterReport,
  assignStudentToTherapist,
  removeStudentFromTherapist
} from "../controllers/therapistController.js";
import { protect, authorizeRoles, canAccessStudent } from "../middleware/authMiddleware.js";

const router = express.Router();

// Protect all routes - teacher role allowed
router.use(protect, authorizeRoles("teacher"));

// Get all students assigned to therapist
router.get("/students", getTherapistStudents);

// Get specific student details
router.get("/students/:studentId", canAccessStudent, getStudentDetailForTherapist);

// Get student dashboard summary
router.get("/students/:studentId/summary", canAccessStudent, getStudentDashboardSummary);

// Get student word report
router.get("/students/:studentId/report/words", canAccessStudent, getStudentWordReport);

// Get student sentence report
router.get("/students/:studentId/report/sentences", canAccessStudent, getStudentSentenceReport);

// Get student letter report
router.get("/students/:studentId/report/letters", canAccessStudent, getStudentLetterReport);

// Assign student to therapist
router.post("/students/assign", assignStudentToTherapist);

// Remove student from therapist
router.delete("/students/:studentId", removeStudentFromTherapist);

export default router;
