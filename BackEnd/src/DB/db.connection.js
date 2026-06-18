import mongoose from "mongoose";

const ConnectDB = async () => {
  await mongoose
    .connect(process.env.DB_URI)
    .then((res) => {
      console.log("DB connected ");
    })
    .catch((err) => {
      console.error("fail to connect to db");
    });
};

export default ConnectDB;
