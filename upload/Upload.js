import pkg from "mongoose";
const { Schema, model, Types } = pkg;

const schema = Schema;

var UploadSchema = new schema({
  video: {
    type: Object,
    required: [true, "Please provide an video"],
  },
});

export default model("Upload", UploadSchema);
