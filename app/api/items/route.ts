import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Item } from "@/models/Item";

export async function GET() {
  try {
    await connectDB();
    const items = await Item.find().sort({ createdAt: -1 }).limit(50);
    return NextResponse.json(items);
  } catch (error) {
    console.error("[api/items][GET]", error);
    return NextResponse.json(
      { error: "Database connection failed. Check MONGODB_URI and database availability." },
      { status: 503 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const item = await Item.create({
      title: body.title,
      description: body.description,
    });

    return NextResponse.json(item, { status: 201 });
  } catch (error) {
    console.error("[api/items][POST]", error);
    return NextResponse.json(
      { error: "Unable to create item. Check database connection and request payload." },
      { status: 503 }
    );
  }
}
