interface Tag {
  _id: string;
  name: string;
  questions: number;
}

interface Author {
  _id: string;
  name: string;
  image: string;
}
interface Question {
  _id: string;
  title: string;
  content: string;
  tags: Tag[];
  author: Author;
  upvotes: number;
  downvotes: number;
  views: number;
  answers: number;
  createdAt: Date;
}

type ActionResponse<T = null> = {
  success: boolean;
  data?: T;
  error?: {
    message: string;
    details?: Record<string, string[]>;
  };
  status?: number;
};

type SuccesResponse<T = null> = ActionResponse<T> & { success: true };
type ErrorResponse = ActionResponse<undefined> & { success: false };

type APIErrorResponse = NextResponse<ErrorResponse>;

type APIResponse<T = null> = NextResponse<SuccesResponse<T>> | APIErrorResponse;

interface RouteParams {
  params: Promise<Record<string, string>>;
  searchParams: Promise<Record<string, string>>;
}

interface PaginatedSearchParams {
  page: number;
  pageSize: number;
  filter?: string;
  sort?: string;
  query?: string;
}

interface Answer {
  _id: string;
  author: Author;
  question: Question;
  content: string;
  createdAt: Date;
  upvotes: number;
  downvotes: number;
}

interface User {
  _id: string;
  name: string;
  username: string;
  email: string;
  bio?: string;
  image?: string;
  location?: string;
  portfolio?: string;
  reputation?: number;
  createdAt: Date;
}

interface CollectionBaseParams {
  questionId: string;
}

interface Collection {
  _id: string;
  author: string | Author;
  question: Question;
}

interface GetUserParams {
  userId: string;
}

interface Badges {
  GOLD: number;
  SILVER: number;
  BRONZE: number;
}

interface GetUserTopTagParams {
  userId: string;
}

interface Job {
  job_id?: string;
  employer_name?: string;
  employer_logo?: string | undefined;
  employer_website?: string;
  job_employment_type?: string;
  job_title?: string;
  job_description?: string;
  job_apply_link?: string;
  job_city?: string;
  job_state?: string;
  job_country?: string;
}

interface Country {
  name: {
    common: string;
  };
  cca2: string;
}
