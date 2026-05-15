import TagCard from "@/components/cards/TagCard";
import Preview from "@/components/editor/Preview";
import Metric from "@/components/Metric";
import UserAvatar from "@/components/UserAvatar";
import ROUTES from "@/constants/routes";
import { getQuestion, incrementViews } from "@/lib/actions/question.action";
import { formatNumber, timeAgo } from "@/lib/utils";

import Link from "next/link";
import { redirect } from "next/navigation";
import { after } from "next/server";
import AnswerForm from "@/components/forms/AnswerForm";
import { getAnswers } from "@/lib/actions/answer.action";
import AllAnswers from "@/components/answers/AllAnswers";
import Votes from "@/components/votes/Votes";
import { hasVoted } from "@/lib/actions/votes.action";
import { Suspense } from "react";
import SavedQuestion from "@/components/questions/SavedQuestion";
import { hasSavedQuestion } from "@/lib/actions/collection.action";
import { auth } from "@/auth";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { id } = await params;

  const { success, data: question } = await getQuestion({ questionId: id });

  if (!success || !question)
    return {
      title: "question not found",
      description: "This question does not exist",
    };

  return {
    title: question.title,
    description: question.content.slice(0, 100),
    twitter: {
      card: "summary_large_image",
      title: question.title,
      description: question.content.slice(0, 100),
    },
  };
}

const QuestionDetails = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize, filter } = await searchParams;

  const loggedUser = await auth();
  if (!loggedUser) {
    redirect("/sign-in");
  }

  const { success, data: question } = await getQuestion({ questionId: id });

  // sequential it here to ensure view count is incremented before fetching question details, to reflect updated views count immediately. Can be optimized by running in parallel if eventual consistency is acceptable.
  // await incrementViews({ questionId: id });
  after(async () => {
    await incrementViews({ questionId: id });
  });

  const {
    success: AnswerSuccess,
    data: answersData,
    error: AnswerError,
  } = await getAnswers({
    questionId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
    filter,
  });

  const hasVotedPromise = hasVoted({
    targetId: id,
    targetType: "question",
  });

  const hasSavedQuestionPromise = hasSavedQuestion({
    questionId: id,
  });

  if (!success || !question) {
    return redirect("/404");
  }

  const { author, createdAt, title, content, views, answers, tags } = question;

  return (
    <>
      <div className=" flex-start w-full flex-col">
        <div className="flex flex-col-reverse w-full justify-between ">
          <div className="flex items-center justify-start gap-1">
            <UserAvatar
              id={author._id}
              name={author.name}
              imageUrl={author.image}
              className="size-[22px]"
              fallbackClassName="text-[10px]"
            />
            <Link href={ROUTES.PROFILE(author._id)}>
              <p className="paragraph-semibold text-dark300_light700">
                {author.name}
              </p>
            </Link>
          </div>
          <div className="flex justify-end items-center gap-4">
            <Suspense fallback={<div>Loading...</div>}>
              <Votes
                targetType="question"
                upvotes={question.upvotes}
                downvotes={question.downvotes}
                targetId={question._id}
                hasVotedPromise={hasVotedPromise}
              />
            </Suspense>
            <Suspense fallback={<div>Loading...</div>}>
              <SavedQuestion
                questionId={question._id}
                hasSavedQuestionPromise={hasSavedQuestionPromise}
              />
            </Suspense>
          </div>
        </div>
        <h2 className="h2-semibold text-dark300_light900 mt-3.5 w-full">
          {title}
        </h2>
      </div>
      <div className="mb-8 mt-5 flex flex-wrap gap-4">
        <Metric
          imgUrl="/icons/clock.svg"
          alt="clock icon"
          value={`asked ${timeAgo(new Date(createdAt))}`}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/message.svg"
          alt="message icon"
          value={answers}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
        <Metric
          imgUrl="/icons/eye.svg"
          alt="eye icon"
          value={formatNumber(views)}
          title=""
          textStyles="small-regular text-dark400_light700"
        />
      </div>
      <Preview content={content} />
      <div className="flex flex-wrap gap-4 mt-6">
        {tags.map((tag: Tag) => (
          <TagCard key={tag._id} _id={tag._id} name={tag.name} compact />
        ))}
      </div>
      <section className="my-5">
        <AllAnswers
          page={Number(page) || 1}
          isNext={answersData?.isNext || false}
          data={answersData?.answers}
          success={AnswerSuccess}
          error={AnswerError}
          totalAnswers={answersData?.totalAnswers || 0}
        />
      </section>
      <section className="mt-10">
        <AnswerForm
          questionId={question._id}
          questionTitle={question.title}
          questionContent={question.content}
        />
      </section>
    </>
  );
};

export default QuestionDetails;
