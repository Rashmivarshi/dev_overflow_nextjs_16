const QuestionDetails = async ({ params }: RouteParams) => {
  const { id } = await params;
  return <div>page:{id}</div>;
};

export default QuestionDetails;
