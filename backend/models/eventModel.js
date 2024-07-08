import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    date: { type: Date, required: true },
    location: { type: String, required: true },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    contributions: [
      { type: mongoose.Schema.Types.ObjectId, ref: "Contribution" }
    ]
  },
  { timestamps: true, collection: "events" }
);

const Event = mongoose.model("Event", eventSchema);

export default Event;
