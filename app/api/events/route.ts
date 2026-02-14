import { Event } from "@/database";
import connectDB from "@/lib/mongodb";
import { NextRequest, NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";
import { json } from "stream/consumers";

export async function POST(req:NextRequest){
    try {
        await connectDB();
        const formdata = await req.formData();
        let event;
        try {
            event = Object.fromEntries(formdata.entries());
        } catch (error) {
            return NextResponse.json({message: "Invalid form data"}, {status: 400});            
        }
        const file = formdata.get("file") as File;
        if(!file){
            return NextResponse.json({message: "File is required"}, {status: 400});
        }
        let tags, agenda;
        try {
            tags = JSON.parse(formdata.get("tags") as string);
            agenda = JSON.parse(formdata.get("agenda") as string);
        } catch {
            return NextResponse.json({message: "Invalid JSON in tags or agenda"}, {status: 400});
        }
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        const uploadResult = await new Promise((resolve, reject) => {

            cloudinary.uploader.upload_stream({ resource_type: "image",folder:"Devent" }, (error, result) => {
                if (error) {
                    reject(error);
        }
        resolve(result);
        }).end(buffer);
        });
        event.image = (uploadResult as {secure_url: string}).secure_url;    




        const createdEvent = await Event.create({...event,
            tags:tags,
            agenda:agenda}
        );
        return NextResponse.json({message: "Event created successfully", event: createdEvent}, {status: 201});
    } catch (e) {
        console.log(e);
        return NextResponse.json({message: "Internal Server Error",error:e instanceof Error ? e.message:"unkown"}, {status: 500});
        
    }

}

export async function GET(){
    try {
        await connectDB();
        const events = await Event.find().sort({createdAt: -1});
        return NextResponse.json({message:"Events fetched successfully"}, {status: 200});
    } catch (e) {
        console.log(e);
        return NextResponse.json({message: "Event fetching failed ",error:e instanceof Error ? e.message:"unkown"}, {status: 500});      
}}