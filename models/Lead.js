import mongoose from 'mongoose'
const LeadSchema=new mongoose.Schema({type:String,email:String,name:String,message:String,payload:Object},{timestamps:true})
export default mongoose.models.Lead || mongoose.model('Lead',LeadSchema)
