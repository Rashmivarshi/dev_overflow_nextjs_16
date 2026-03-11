import Account from "@/database/account.model";
import handleError from "@/lib/handlers/error";
import { NotFoundError, ValidationError } from "@/lib/http-errors";
import dbConnect from "@/lib/mongoose";
import { AccountSchema } from "@/lib/validations";
import { APIErrorResponse } from "@/types/global";
import { NextResponse } from "next/server";
import z from "zod";

export async function GET(
  _: Request, //request:Request but here we are not using request so written as _
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");

  try {
    await dbConnect();

    const account = await Account.findById(id);
    if (!account) throw new NotFoundError("Account");
    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) throw new NotFoundError("Account");
  try {
    await dbConnect();

    const body = await request.json();

    const validationData = AccountSchema.partial().safeParse(body);
    if (!validationData.success) {
      throw new ValidationError(
        z.flattenError(validationData.error).fieldErrors,
      );
    }
    const updateAccount = await Account.findByIdAndUpdate(
      id,
      validationData.data,
      {
        new: true,
      },
    );
    if (!updateAccount) throw new NotFoundError("User");

    return NextResponse.json(
      { success: true, data: updateAccount },
      { status: 200 },
    );
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}

export async function DELETE(
  _: Request, //request:Request but here we are not using request so written as _
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  if (!id) {
    throw new NotFoundError("Account");
  }
  try {
    await dbConnect();

    const account = await Account.findByIdAndDelete(id);
    if (!account) throw new NotFoundError("Account");

    return NextResponse.json({ success: true, data: account }, { status: 200 });
  } catch (error) {
    return handleError(error, "api") as APIErrorResponse;
  }
}
