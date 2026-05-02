"use server";

import { Collection, Question } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import { CollectionBaseSchema } from "../validations";
import { revalidatePath } from "next/cache";
import ROUTES from "@/constants/routes";

export async function toggleSaveQuestion(
  params: CollectionBaseParms,
): Promise<ActionResponse<{ saved: boolean }>> {
  const validationResult = await action({
    params,
    schema: CollectionBaseSchema,
    authorize: true,
  });
  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { questionId } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) {
    return handleError(new Error("Unauthorized")) as ErrorResponse;
  }
  try {
    const question = await Question.findById(questionId);
    if (!question) {
      return handleError(new Error("Question not found")) as ErrorResponse;
    }
    const collection = await Collection.findOne({
      author: userId,
      question: questionId,
    });

    if (collection) {
      await Collection.findByIdAndDelete(collection._id);
      revalidatePath(ROUTES.QUESTION(questionId));
      return {
        success: true,
        data: { saved: false },
      };
    }

    await Collection.create({ author: userId, question: questionId });
    revalidatePath(ROUTES.QUESTION(questionId));
    return {
      success: true,
      data: { saved: true },
    };
  } catch (error) {
    return handleError(error as Error) as ErrorResponse;
  }
}
