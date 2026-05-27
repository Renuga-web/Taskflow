const mongoose    = require("mongoose");
const TASK_STATUS   = require("../constants/taskStatus");
const TASK_PRIORITY = require("../constants/taskPriority");
const ACTIVITY_TYPES = require("../constants/activityTypes");

const subTaskSchema = new mongoose.Schema(
  {
    title:       { type: String, required: true, trim: true },
    isCompleted: { type: Boolean, default: false },
    date:        { type: Date, default: Date.now },
    tag:         { type: String, default: "" },
  },
  { timestamps: true }
);

const activitySchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: Object.values(ACTIVITY_TYPES),
      default: ACTIVITY_TYPES.ASSIGNED,
    },
    activity: { type: String, required: true },
    date:     { type: Date, default: Date.now },
    by:       { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

const taskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Task title is required"],
      trim: true,
    },
    description: { type: String, default: "", trim: true },

    status: {
      type: String,
      enum: Object.values(TASK_STATUS),
      default: TASK_STATUS.TODO,
    },

    priority: {
      type: String,
      enum: Object.values(TASK_PRIORITY),
      default: TASK_PRIORITY.NORMAL,
    },

    team: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    dueDate:   { type: Date, default: null },
    isTrashed: { type: Boolean, default: false },
    subTasks:  [subTaskSchema],
    activities: [activitySchema],
    assets:    [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", taskSchema);