import mongoose from "mongoose";

const toDoSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      maxLength: 500,
    },
    deadline: {
      type: Date,
    },
    status: {
      type: String,
      enum: ["pending", "success", "failure", "expired"],
      default: "pending",
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

const ToDo = mongoose.model("ToDo", toDoSchema);

export default ToDo;
