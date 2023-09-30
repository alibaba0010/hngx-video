import pkg from "mongoose";
const { connect, connection, set } = pkg;

const connectDB = (url) => {
  try {
    connection.once("open", () => console.log("MongoDB connected"));
    set("strictQuery", false);
    return connect(url);
  } catch (e) {
    process.exit(1);
  }
};

export default connectDB;
