"use server";

import { PipelineStage, QueryFilter, Types } from "mongoose";
import action from "../handlers/action";
import handleError from "../handlers/error";
import {
  GetUserQuestionsSchema,
  GetUsersAnswersSchema,
  GetUserSchema,
  GetUserTagsSchema,
  PaginatedSearchParamsSchema,
  UpdateUserSchema,
} from "../validations";
import { Answer, Question, User } from "@/database";
import { assignBadges } from "../utils";

export async function getUsers(
  params: PaginatedSearchParams,
): Promise<ActionResponse<{ users: User[]; isNext: boolean }>> {
  const validationResult = await action({
    params,
    schema: PaginatedSearchParamsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { page = 1, pageSize = 10, filter, query } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  const filterQuery: QueryFilter<typeof User> = {};

  if (query) {
    filterQuery.$or = [
      { name: { $regex: query, $options: "i" } },
      { email: { $regex: query, $options: "i" } },
    ];
  }
  let sortCriteria = {};

  switch (filter) {
    case "newest":
      sortCriteria = { createdAt: -1 };
      break;
    case "oldest":
      sortCriteria = { createdAt: 1 };
      break;
    case "popular":
      sortCriteria = { reputation: -1 };
      break;

    default:
      sortCriteria = { createdAt: -1 };
      break;
  }

  try {
    const TotalUsers = await User.countDocuments(filterQuery);

    const users = await User.find(filterQuery)
      .sort(sortCriteria)
      .skip(skip)
      .limit(limit);

    const isNext = TotalUsers > skip + users.length;

    return {
      success: true,
      data: {
        users: JSON.parse(JSON.stringify(users)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUser(params: GetUserParams): Promise<
  ActionResponse<{
    user: User;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId } = validationResult.params!;

  try {
    const user = await User.findById(userId);

    if (!user) {
      throw new Error("User not found");
    }

    return {
      success: true,
      data: {
        user: JSON.parse(JSON.stringify(user)),
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserQuestions(params: GetUserQuestionParams): Promise<
  ActionResponse<{
    questions: Question[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserQuestionsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId, page = 1, pageSize = 10 } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const totalQuestions = await Question.countDocuments({ author: userId });
    const questions = await Question.find({ author: userId })
      .populate("author", "name image")
      .populate("tags", "name")
      .skip(skip)
      .limit(limit);

    const isNext = totalQuestions > skip + questions.length;

    return {
      success: true,
      data: {
        questions: JSON.parse(JSON.stringify(questions)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserAnswers(params: GetUserAnswersParams): Promise<
  ActionResponse<{
    answers: Answer[];
    isNext: boolean;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUsersAnswersSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId, page = 1, pageSize } = validationResult.params!;
  const skip = (Number(page) - 1) * pageSize;
  const limit = Number(pageSize);

  try {
    const totalAnswers = await Answer.countDocuments({ author: userId });

    const answers = await Answer.find({ author: userId })
      .populate("author", "_id name image")
      .skip(skip)
      .limit(limit);

    const isNext = totalAnswers > skip + answers.length;

    return {
      success: true,
      data: {
        answers: JSON.parse(JSON.stringify(answers)),
        isNext,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserTopTags(params: GetUserTopTagParams): Promise<
  ActionResponse<{
    tags: { _id: string; name: string; count: number }[];
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserTagsSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId } = validationResult.params!;
  try {
    const pipeline: PipelineStage[] = [
      { $match: { author: new Types.ObjectId(userId) } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      {
        $lookup: {
          from: "tags",
          localField: "_id",
          foreignField: "_id",
          as: "tagInfo",
        },
      },
      { $unwind: "$tagInfo" },
      { $sort: { count: -1 } },
      { $limit: 10 },
      {
        $project: {
          _id: "$tagInfo._id",
          name: "$tagInfo.name",
          count: 1,
        },
      },
    ];
    const tags = await Question.aggregate(pipeline);

    return {
      success: true,
      data: {
        tags,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function getUserStats(params: GetUserParams): Promise<
  ActionResponse<{
    totalQuestions: number;
    totalAnswers: number;
    badges: Badges;
  }>
> {
  const validationResult = await action({
    params,
    schema: GetUserSchema,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }
  const { userId } = validationResult.params!;

  try {
    const [questionStats = { count: 0, upvotes: 0, views: 0 }] =
      await Question.aggregate([
        {
          $match: {
            author: new Types.ObjectId(userId),
          },
        },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            upvotes: { $sum: "$upvotes" },
            views: { $sum: "$views" },
          },
        },
      ]);
    const [answerStats = { count: 0, upvotes: 0 }] = await Answer.aggregate([
      { $match: { author: new Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          count: { $sum: 1 },
          upvotes: { $sum: "$upvotes" },
        },
      },
    ]);

    const badges = assignBadges({
      criteria: [
        { type: "ANSWER_COUNT", count: answerStats.count },
        { type: "QUESTION_COUNT", count: questionStats.count },
        {
          type: "QUESTION_UPVOTES",
          count: questionStats.upvotes + answerStats.upvotes,
        },
        { type: "TOTAL_VIEWS", count: questionStats.views },
      ],
    });

    return {
      success: true,
      data: {
        totalQuestions: questionStats.count,
        totalAnswers: answerStats.count,
        badges,
      },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}

export async function updateUser(
  params: UpdateUserParams,
): Promise<ActionResponse<{ user: User }>> {
  const validationResult = await action({
    params,
    schema: UpdateUserSchema,
    authorize: true,
  });

  if (validationResult instanceof Error) {
    return handleError(validationResult) as ErrorResponse;
  }

  const { user } = validationResult.session!;

  try {
    const updatedUser = await User.findByIdAndUpdate(user?.id, params, {
      new: true,
    });

    return {
      success: true,
      data: { user: JSON.parse(JSON.stringify(updatedUser)) },
    };
  } catch (error) {
    return handleError(error) as ErrorResponse;
  }
}
