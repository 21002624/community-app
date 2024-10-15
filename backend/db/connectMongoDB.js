import mongoose from 'mongoose';

const connectMongoDB = async () => {
  try{
    const conn= await mongoose.connect(process.env.MONGO_URI);
    console.log(`Mongo connected : ${conn.connection.host}`);
  }
  catch(error){
    console.log(`Error connect to mangodb: %{error.message}`);
    process.exit(1);
  }
}

export default connectMongoDB; 
