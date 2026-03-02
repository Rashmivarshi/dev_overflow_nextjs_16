import LocalSearch from "@/components/search/LocalSearch";
import { Button } from "@/components/ui/button";
import ROUTES from "@/constants/routes";
import Link from "next/link";

const questions = [
  {
    _id: "1",
    title: "How to learn Next.js?",
    description:
      "I am new to web development and I want to learn Next.js. Can anyone suggest some resources or tutorials to get started?",
    tags: [
      {
        _id: "1",
        name: "next.js",
      },
      {
        _id: "2",
        name: "react",
      },
    ],
    author: { _id: "1", name: "John Doe" },
    upvotes: 10,
    downvotes: 2,
    answers: 5,
    createdAt: "2023-10-01T12:00:00Z",
  },
  {
    _id: "2",
    title:
      "What is the difference between getStaticProps and getServerSideProps in Next.js?",
    description:
      "Can someone explain the difference between getStaticProps and getServerSideProps in Next.js? When should I use each one?",
    tags: [
      {
        _id: "1",
        name: "next.js",
      },
      {
        _id: "3",
        name: "data-fetching",
      },
    ],
    author: { _id: "2", name: "Jane Smith" },
    upvotes: 15,
    downvotes: 1,
    answers: 8,
    createdAt: "2023-10-02T15:30:00Z",
  },
];

interface SearchParams {
  searchParams: Promise<{ [key: string]: string }>;
}
const Home = async ({ searchParams }: SearchParams) => {
  const { query = "" } = await searchParams;

  const filteredQuestions = questions.filter((question) =>
    question.title.toLowerCase().includes(query?.toLowerCase()),
  );
  return (
    <>
      <section className="flex w-full flex-col-reverse justify-between gap-4 sm:flex-row sm:items-center ">
        <h1 className="h1-bold text-dark100_light900">All Questions</h1>
        <Button
          className="primary-gradient min-h-[46px] px-4 py-3 !text-light-900"
          asChild
        >
          <Link href={ROUTES.ASK_QUESTION}>Ask a Question</Link>
        </Button>
      </section>
      <section className="mt-11">
        <LocalSearch
          route="/"
          imgSrc="/icons/search.svg"
          placeholder="Search questions..."
          otherClasses="flex-1"
        />
      </section>
      {/* homefilter */}
      <div className="mt-11 flex w-full flex-col gap-6">
        {filteredQuestions.map((question) => (
          <h1 key={question._id}>{question.title}</h1>
        ))}
      </div>
    </>
  );
};

export default Home;
