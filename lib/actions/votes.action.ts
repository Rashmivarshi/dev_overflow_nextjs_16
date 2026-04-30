"use server";

import { Answer, Question, Vote } from "@/database";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  CreateVoteSchema,
  HasVotedSchema,
  UpdateVoteCountSchema,
} from "../validations";
import mongoose, { ClientSession } from "mongoose";
export async function updateVoteCount(
  params: UpdateVoteCountParams,
  session?: ClientSession,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: UpdateVoteCountSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionResponse;
  }

  const { targetId, targetType, voteType, change } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  const Model = targetType === "question" ? Question : Answer;
  const voteField = voteType === "upvote" ? "upvotes" : "downvotes";

  try {
    const result = await Model.findByIdAndUpdate(
      targetId,
      { $inc: { [voteField]: change } },
      { new: true, session },
    );
    if (!result) {
      return handleError(
        new Error("Failed to update vote count"),
      ) as ErrorResponse;
    }
    return {
      success: true,
      data: result,
    };
  } catch (error) {
    return handleError(
      error instanceof Error ? error : new Error("Unknown error"),
    ) as ErrorResponse;
  }
}

export async function createVotes(
  params: CreateVoteParams,
): Promise<ActionResponse> {
  const validationResult = await action({
    params,
    schema: CreateVoteSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ActionResponse;
  }

  const { targetId, targetType, voteType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;

  if (!userId) return handleError(new Error("Unauthorized")) as ErrorResponse;

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const existingVote = await Vote.findOne({
      author: userId,
      id: targetId,
      type: targetType,
    }).session(session);

    if (existingVote) {
      if (existingVote.voteType === voteType) {
        await Vote.deleteOne({ _id: existingVote._id }).session(session);
        await updateVoteCount(
          { targetId, targetType, voteType, change: -1 },
          session,
        );
      } else {
        await Vote.findByIdAndUpdate(
          existingVote._id,
          { voteType },
          { new: true, session },
        );
        await updateVoteCount(
          { targetId, targetType, voteType, change: 1 },
          session,
        );
      }
    } else {
      await Vote.create(
        [
          {
            author: userId,
            id: targetId,
            type: targetType,
            voteType,
          },
        ],
        { session },
      );
      await updateVoteCount(
        { targetId, targetType, voteType, change: 1 },
        session,
      );
    }
    session.commitTransaction();
    return {
      success: true,
    };
  } catch (error) {
    await session.abortTransaction();
    return handleError(
      error instanceof Error ? error : new Error("Unknown error"),
    ) as ErrorResponse;
  } finally {
    session.endSession();
  }
}

export async function hasVoted(
  params: HasVotedParams,
): Promise<ActionResponse<HasVotedResponse>> {
  const validationResult = await action({
    params,
    schema: HasVotedSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { targetId, targetType } = validationResult.params!;
  const userId = validationResult.session?.user?.id;
  try {
    const vote = await Vote.findOne({
      author: userId,
      id: targetId,
      type: targetType,
    });
    if (!vote) {
      return {
        success: false,
        data: {
          hasUpvoted: false,
          hasDownvoted: false,
        },
      };
    } else {
      return {
        success: true,
        data: {
          hasUpvoted: vote.voteType === "upvote",
          hasDownvoted: vote.voteType === "downvote",
        },
      };
    }
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
