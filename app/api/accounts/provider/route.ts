import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";
import z from "zod";

export async function POST(request: Request) {
  try {
    await dbConnect();
    const { providerAccountId } = await request.json();
    const validateData = AccountSchema.partial().safeParse({
      providerAccountId,
    });
    if (!validateData.success) {
      throw new ValidationError(z.flattenError(validateData.error).fieldErrors);
    }
    const account = await Account.findOne({ providerAccountId });
    if (!account) throw new NotFoundError("User");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
