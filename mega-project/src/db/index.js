import mongoose from "mongoose"

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI)
    console.log("MongoDB connected");
    
  } catch (error) {
    console.error("MongoDB is not Connected", error);
    process.exit(1)
  }
}