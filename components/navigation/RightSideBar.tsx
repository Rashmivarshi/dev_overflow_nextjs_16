import ROUTES from "@/constants/routes";
import Link from "next/link";
import Image from "next/image";
import TagCard from "../cards/TagCard";

const hotQuestions = [
  { _id: "1", title: "How to learn React?" },
  { _id: "2", title: "What is the best way to learn JavaScript?" },
  { _id: "3", title: "How to use Next.js with TypeScript?" },
  {
    _id: "4",
    title: "What are the best practices for state management in React?",
  },
  { _id: "5", title: "How to optimize React performance?" },
];

const popularTags = [
  { _id: "1", name: "react", questions: 1200 },
  { _id: "2", name: "javascript", questions: 1500 },
  { _id: "3", name: "nextjs", questions: 800 },
  { _id: "4", name: "typescript", questions: 1000 },
  { _id: "5", name: "css", questions: 900 },
];

const RightSideBar = () => {
  return (
    <section className="pt-36 custom-scrollbar background-light900_dark200 light-border sticky top-0 right-0 w-[350px] h-screen overflow-y-auto p-6 border-l shadow-light-300 dark:shadow-none max-lg:hidden">
      <div>
        <h3 className="h3-bold text-dark200_light900">top questions</h3>
        <div className="mt-7 w-full flex flex-col gap-[30px]">
          {hotQuestions.map(({ _id, title }) => (
            <Link
              key={_id}
              href={ROUTES.PROFILE(_id)}
              className="flex items-center gap-7 cursor-pointer justify-between"
            >
              <p className="body-medium text-dark500_light700">{title}</p>
              <Image
                src="/icons/chevron-right.svg"
                width={20}
                height={20}
                alt="chevron right"
                className="invert-colors"
              />
            </Link>
          ))}
        </div>
      </div>
      <div className="mt-16">
        <h3 className="body-medium text-dark200_light900">Popular Tags</h3>
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
      </div>
    </section>
  );
};

export default RightSideBar;
