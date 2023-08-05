import mongoose from "mongoose";

const Schema = mongoose.Schema;

const forumSchema = new Schema({
  text: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  userName: {
    type: String,
    required: true,
    select: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
});

const Fanfics = mongoose.model("fanficsForum", forumSchema);
export default Fanfics;
