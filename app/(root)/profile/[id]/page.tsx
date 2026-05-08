import { auth } from "@/auth";
import ProfileLink from "@/components/user/ProfileLink";
import UserAvatar from "@/components/UserAvatar";
import {
  getUser,
  getUserAnswers,
  getUserQuestions,
} from "@/lib/actions/user.action";
import { notFound } from "next/navigation";
import dayjs from "dayjs";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import Stats from "@/components/user/Stats";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import DataRender from "@/components/DataRender";
import { EMPTY_ANSWERS, EMPTY_QUESTION } from "@/constants/states";
import QuestionCard from "@/components/cards/QuestionCard";
import Pagination from "@/components/Pagination";
import AnswerCard from "@/components/cards/AnswerCard";

const Profile = async ({ params, searchParams }: RouteParams) => {
  const { id } = await params;
  const { page, pageSize } = await searchParams;

  if (!id) {
    return notFound();
  }
  const loggedUser = await auth();

  const { success, data, error } = await getUser({ userId: id });

  if (!success)
    return (
      <div>
        <div className="h1-bold text-dark100_light900">{error?.message}</div>
      </div>
    );
  const { user, totalQuestions, totalAnswers } = data!;

  const { _id, name, image, portfolio, location, createdAt, username, bio } =
    user;

  const {
    success: UserQuestionSuccess,
    data: UserQuestion,
    error: UserQuestionError,
  } = await getUserQuestions({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const {
    success: UserAnswerSuccess,
    data: UserAnswer,
    error: UserAnswerError,
  } = await getUserAnswers({
    userId: id,
    page: Number(page) || 1,
    pageSize: Number(pageSize) || 10,
  });

  const { questions, isNext: hasMoreQuestions } = UserQuestion!;
  const { answers, isNext: hasMoreAnswers } = UserAnswer!;

  return (
    <>
      <section className="flex flex-col-reverse justify-between items-start sm:flex-row">
        <div className="flex flex-col items-start gap-6 lg:flex-row">
          <UserAvatar
            id={_id}
            name={name}
            imageUrl={image}
            className="size-[140px] rounded-full object-cover"
            fallbackClassName="text-6xl fond-bolder"
          />
          <div className="mt-3">
            <h2 className="h2-bold text-dark100_light900">{name}</h2>
            <p className="paragraph-regular text-dark200_light800">
              @{username}
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-start gap-5">
              {portfolio && (
                <ProfileLink
                  imgUrl="/icons/link.svg"
                  href={portfolio}
                  title="Portfolio"
                />
              )}
              {location && (
                <ProfileLink imgUrl="/icons/location.svg" title="Portfolio" />
              )}
              <ProfileLink
                imgUrl="/icons/calendar.svg"
                title={dayjs(createdAt).format("MMMM YYYY")}
              />
            </div>
            {bio && (
              <p className="paragraph-regular text-dark400_light800 mt-8">
                {bio}
              </p>
            )}
          </div>
        </div>
        <div className="flex justify-end max-sm:mb-5 max-sm:w-full sm:mt-3">
          {loggedUser?.user?.id === _id && (
            <Link href="/profile/edit">
              <Button className="paragraph-medium btn-secondary text-dark300_light900 min-h-12 min-w-44 px-4 py-3">
                Edit Profile
              </Button>
            </Link>
          )}
        </div>
      </section>

      <Stats
        totalQuestions={totalQuestions}
        totalAnswers={totalAnswers}
        badges={{
          GOLD: 0,
          SILVER: 0,
          BRONZE: 0,
        }}
      />
      <section className="mt-5 flex gap-10">
        <Tabs defaultValue="top-posts" className="flex-[2]">
          <TabsList className="min-h-[42px] p-1">
            <TabsTrigger value="top-posts" className="tab">
              Top Posts
            </TabsTrigger>
            <TabsTrigger value="answers" className="tab">
              Answers
            </TabsTrigger>
          </TabsList>
          <TabsContent
            value="top-posts"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRender
              data={questions}
              success={UserQuestionSuccess}
              error={UserQuestionError}
              empty={EMPTY_QUESTION}
              render={(questions) => (
                <div className="flex w-full flex-col gap-6">
                  {questions.map((question) => (
                    <QuestionCard key={question._id} question={question} />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreQuestions} />
          </TabsContent>
          <TabsContent
            value="answers"
            className="mt-5 flex w-full flex-col gap-6"
          >
            <DataRender
              data={answers}
              success={UserAnswerSuccess}
              error={UserAnswerError}
              empty={EMPTY_ANSWERS}
              render={(answers) => (
                <div className="flex w-full flex-col gap-6">
                  {answers.map((answer) => (
                    <AnswerCard
                      key={answer._id}
                      {...answer}
                      content={answer.content.slice(0, 28)}
                      containerClassName="card-wrapper rounded-[10px] px-7 py-9 sm:px-11"
                      showReadMore
                    />
                  ))}
                </div>
              )}
            />
            <Pagination page={page} isNext={hasMoreAnswers} />
          </TabsContent>
        </Tabs>
      </section>
    </>
  );
};

export default Profile;
