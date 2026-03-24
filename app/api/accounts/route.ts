import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { ForbiddenError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();
    const accounts = await Account.find({});
    return NextResponse.json({ sucess: true, data: accounts }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function POST(request: Request) {
  try {
    await dbConnect();
    const body = await request.json();
    const validateData = AccountSchema.parse(body);
    const existingUser = await Account.findOne({
      provider: validateData.provider,
      providerAccountId: validateData.providerAccountId,
    });
    if (existingUser)
      throw new ForbiddenError("Account with this provider already exists");

    const newAccount = await Account.create(validateData);

    return NextResponse.json(
      { sucess: true, data: newAccount },
      { status: 201 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
