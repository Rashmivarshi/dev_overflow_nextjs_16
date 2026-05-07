import ROUTES from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";
import TagCard from "../cards/TagCard";
import { getTopTags } from "@/lib/actions/tag.action";
import { getHotQuestions } from "@/lib/actions/question.action";
import DataRender from "../DataRender";

const RightSideBar = async () => {
  const [
    { success, data: hotQuestions, error },
    { success: tagsSuccess, data: popularTags, error: tagsError },
  ] = await Promise.all([getHotQuestions(), getTopTags()]);

  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky top-0 right-0 w-[350px] h-screen overflow-y-auto p-6 border-l shadow-light-300 dark:shadow-none max-lg:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">top questions</h3>
        <DataRender
          data={hotQuestions}
          success={success}
          error={error}
          empty={{
            title: "No Question Found",
            message: "No questions have been asked yet.",
          }}
          render={(hotQuestions) => (
            <div className="mt-7 flex w-full flex-col gap-[30px]">
              {hotQuestions.map(({ _id, title }) => (
                <Link
                  key={_id}
                  href={ROUTES.QUESTION(_id)}
                  className="flex cursor-pointer items-center justify-between gap-7"
                >
                  <p className="body-medium text-dark500_light700 line-clamp-2">
                    {title}
                  </p>
                  <Image
                    src="/icons/chevron-right.svg"
                    alt="Chevron"
                    width={20}
                    height={20}
                    className="invert-colors"
                  />
                </Link>
              ))}
            </div>
          )}
        />
      </div>
      <div className="mt-16">
        <h3 className="body-medium text-dark200_light900">Popular Tags</h3>
        <DataRender
          success={tagsSuccess}
          error={tagsError}
          empty={{
            title: "No Tag Found",
            message: "No Tag is created yet.",
          }}
          data={popularTags}
          render={(popularTags) => (
            <div className="mt-7 flex flex-col gap-4">
              {popularTags.map(({ _id, name, questions }) => (
                <TagCard
                  key={_id}
                  _id={_id}
                  name={name}
                  questions={questions}
                  showCount
                  compact
                />
              ))}
            </div>
          )}
        />
      </div>
    </section>
  );
};

export default RightSideBar;
