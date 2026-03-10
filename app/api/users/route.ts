import User from "@/database/user.model";
import handleError from "@/lib/handlers/error";
import dbConnect from "@/lib/mongoose";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import { UserSchema } from "../../../lib/validations";
import { ValidationError } from "@/lib/http-errors";
import z from "zod";

export async function GET() {
  try {
    await dbConnect();
    const users = await User.find({});
    return NextResponse.json({ sucess: true, data: users }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validateData = UserSchema.safeParse(body);
    if (!validateData.success) {
      throw new ValidationError(z.flattenError(validateData.error).fieldErrors);
    }

    const { email, username } = validateData.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) throw new Error("User already exists");

    const existingUsername = await User.findOne({ username }); // check if username
    if (existingUsername) throw new Error("Username already exists");

    const newUser = await User.create(validateData.data);

    return NextResponse.json({ sucess: true, data: newUser }, { status: 201 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
