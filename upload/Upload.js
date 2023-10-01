import pkg from "mongoose";
const { Schema, model, Types } = pkg;

const schema = Schema;

var UploadSchema = new schema({
  id: {
    type: String,
  },
});

export default model("Upload", UploadSchema);
