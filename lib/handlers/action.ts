"use server";

import { ZodError, ZodType } from "zod";
import { UnauthorizedError, ValidationError } from "../http-errors";
import { Session } from "next-auth";
import { auth } from "@/auth";
import dbConnect from "../mongoose";

type ActionOptions<T> = {
  params?: T;
  schema?: ZodType<T>;
  authorize?: boolean;
};

//1.checking whether schema and params provided and validating them
//2.checking whether user is authorized
//3.connecting to database
//4.returning params and session

async function action<T>({
  params,
  schema,
  authorize = false,
}: ActionOptions<T>) {
  if (params && schema) {
    try {
      schema.parse(params);
    } catch (error) {
      if (error instanceof ZodError) {
        const fieldErrors: Record<string, string[]> = error.issues.reduce(
          (acc, issue) => ({
            ...acc,
            [issue.path.join(".")]: [
              ...(acc[issue.path.join(".")] || []),
              issue.message as string,
            ],
          }),
          {} as Record<string, string[]>,
        );
        throw new ValidationError(fieldErrors);
      } else {
        throw new Error("Schema validation failed");
      }
    }
  }
  let session: Session | null = null;
  if (authorize) {
    session = await auth();
    if (!session) {
      return new UnauthorizedError();
    }
  }
  await dbConnect();
  return { params, session };
}
