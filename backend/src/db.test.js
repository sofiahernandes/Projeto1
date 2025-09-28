import mongoose from "mongoose";

const url = "";
async function run(){
  try{
    await mongoose.connect(url);
    console.log("conectadoooo!!!!");
  }catch(err){
    console.error("nãooooooo tá conectado...........", err.message);
    process.exit(1);
  }
}
run();