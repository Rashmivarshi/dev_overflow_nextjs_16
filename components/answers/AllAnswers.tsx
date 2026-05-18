import { EMPTY_ANSWERS } from "@/constants/states";
import DataRender from "../DataRender";
import AnswerCard from "../cards/AnswerCard";
import { AnswerFilters } from "@/constants/filters";
import CommonFilter from "../filters/CommonFilter";
import Pagination from "../Pagination";

interface Props extends ActionResponse<Answer[]> {
  page: number;
  isNext: boolean;
  totalAnswers: number;
}

const AllAnswers = ({
  page,
  isNext,
  data,
  success,
  error,
  totalAnswers,
}: Props) => {
  return (
    <div className="mt-11">
      <div className="flex items-center gap-4">
        <h3 className="primary-text-gradient shrink-0">
          {totalAnswers} {totalAnswers === 1 ? "Answer" : "Answers"}
        </h3>

        <div className="relative z-10 ml-auto">
          <CommonFilter
            filters={AnswerFilters}
            otherClasses="sm:min-w-32"
            containerClasses="max-xs:w-full"
          />
        </div>
      </div>

      <DataRender
        success={success}
        data={data}
        error={error}
        empty={EMPTY_ANSWERS}
        render={(answers) =>
          answers.map((answer) => <AnswerCard key={answer._id} {...answer} />)
        }
      />

      <Pagination page={page} isNext={isNext} />
    </div>
  );
};

export default AllAnswers;
