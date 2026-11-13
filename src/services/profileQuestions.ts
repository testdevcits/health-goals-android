import { authenticatedRequest } from './authenticatedApi';
import { API_ENDPOINTS } from '../constants/endpoints';

export type ProfileQuestionType = 'text' | 'number' | 'select' | 'date';

export type ProfileQuestion = {
  id: string;
  key: string;
  label: string;
  type: ProfileQuestionType;
  options: string[];
  required: boolean;
  active: boolean;
  order: number;
};

type QuestionsResponse = {
  questions: ProfileQuestion[];
};

type AnswersResponse = {
  user?: unknown;
  pendingQuestions?: ProfileQuestion[];
};

const isQuestion = (value: unknown): value is ProfileQuestion => {
  if (!value || typeof value !== 'object') return false;
  const question = value as Partial<ProfileQuestion>;
  return (
    typeof question.id === 'string' &&
    typeof question.key === 'string' &&
    typeof question.label === 'string' &&
    ['text', 'number', 'select', 'date'].includes(question.type || '') &&
    Array.isArray(question.options) &&
    question.options.every(option => typeof option === 'string') &&
    typeof question.required === 'boolean' &&
    typeof question.active === 'boolean' &&
    Number.isFinite(question.order)
  );
};

const validateQuestions = (questions: unknown): ProfileQuestion[] => {
  if (!Array.isArray(questions) || !questions.every(isQuestion)) {
    throw new Error('The server returned invalid profile questions.');
  }
  return [...questions]
    .filter(question => question.active)
    .sort((first, second) => first.order - second.order);
};

export async function fetchPendingProfileQuestions(): Promise<
  ProfileQuestion[]
> {
  const result = await authenticatedRequest<QuestionsResponse>(
    'GET',
    API_ENDPOINTS.AUTH.PROFILE_QUESTIONS,
  );
  return validateQuestions(result?.questions);
}

export async function saveProfileAnswers(
  answers: Record<string, string | number | null>,
): Promise<ProfileQuestion[] | null> {
  const result = await authenticatedRequest<AnswersResponse>(
    'PATCH',
    API_ENDPOINTS.AUTH.PROFILE_ANSWERS,
    { answers },
  );
  if (result?.pendingQuestions === undefined) return null;
  return validateQuestions(result.pendingQuestions);
}
