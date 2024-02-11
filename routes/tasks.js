const express = require("express");
const router = express.Router();
const {
  createTask,
  GetAllTask,
  updateTask,
  deleteTask,
  prioritizeTask,
} = require("../controllers/tasks");
const auth = require("../middleware/auth");

router.post("/", auth, createTask);
router.get("/", auth, GetAllTask);
router.put("/:id", auth, updateTask);
router.delete("/:id", auth, deleteTask);
router.patch("/:id/prioritize", auth, prioritizeTask);

module.exports = router;
