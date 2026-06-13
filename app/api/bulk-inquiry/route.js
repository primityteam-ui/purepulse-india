import connectDB from '@/lib/mongodb';import Lead from '@/models/Lead'
export async function POST(req){try{await connectDB();const body=await req.json();const lead=await Lead.create({type:'bulk',...body,payload:body});return Response.json(lead,{status:201})}catch(e){return Response.json({error:e.message},{status:400})}}
