import { formatNumber } from "@/lib/utils";
import Image from "next/image";

interface Props {
  totalQuestions: number;
  totalAnswers: number;
  badges: Badges;
  reputationPoints: number;
}

interface StatsCardProps {
  imgUrl: string;
  title: string;
  value: number;
}
const StatsCard = ({ imgUrl, title, value }: StatsCardProps) => (
  <div className="light-border border rounded-md p-6 flex flex-wrap justify-evenly items-center gap-4 background-light900_dark300 shadow-light-300 dark:shadow-dark-200 ">
    <Image src={imgUrl} alt={title} width={40} height={50} />
    <div>
      <p className="paragraph-semibold text-dark200_light900">{value}</p>
      <p className="body-medium text-dark300_light700">{title}</p>
    </div>
  </div>
);

const Stats = ({
  totalQuestions,
  totalAnswers,
  badges,
  reputationPoints,
}: Props) => {
  return (
    <div className="mt-7">
      <h4 className="h3-semibold text-dark200_light900">
        Stats{" "}
        <span className="small-semibold primary-text-gradient">
          {formatNumber(reputationPoints)}
        </span>
      </h4>
      <div className="mt-5 grid grid-cols-1 xs:grid-cols-2 md:grid-cols-4 gap-5">
        <div className="light-border background-light900_dark300 flex flex-wrap justify-evenly items-center gap-4 p-6 border rounded-md shadow-light-300 dark:shadow-dark-200">
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalQuestions)}
            </p>
            <p className="body-medium text-dark300_light700">Questions</p>
          </div>
          <div>
            <p className="paragraph-semibold text-dark200_light900">
              {formatNumber(totalAnswers)}
            </p>
            <p className="body-medium text-dark300_light700">Answers</p>
          </div>
        </div>
        <StatsCard
          imgUrl="/icons/gold-medal.svg"
          title="Badges"
          value={badges.GOLD}
        />
        <StatsCard
          imgUrl="/icons/silver-medal.svg"
          title="Badges"
          value={badges.SILVER}
        />
        <StatsCard
          imgUrl="/icons/bronze-medal.svg"
          title="Badges"
          value={badges.BRONZE}
        />
      </div>
    </div>
  );
};

export default Stats;
