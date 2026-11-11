import { authenticatedRequest } from '../src/services/authenticatedApi';
import {
  fetchPendingProfileQuestions,
  saveProfileAnswers,
} from '../src/services/profileQuestions';

jest.mock('../src/services/authenticatedApi', () => ({
  authenticatedRequest: jest.fn(),
}));

const requestMock = authenticatedRequest as jest.Mock;

const questions = [
  {
    id: 'question-later',
    key: 'activity',
    label: 'Preferred activity',
    type: 'select',
    options: ['Walking', 'Running'],
    required: false,
    active: true,
    order: 2,
  },
  {
    id: 'question-first',
    key: 'age',
    label: 'Age',
    type: 'number',
    options: [],
    required: true,
    active: true,
    order: 1,
  },
  {
    id: 'question-inactive',
    key: 'old-question',
    label: 'Old question',
    type: 'text',
    options: [],
    required: false,
    active: false,
    order: 0,
  },
];

beforeEach(() => {
  jest.clearAllMocks();
});

test('loads active profile questions in server-defined order', async () => {
  requestMock.mockResolvedValue({ questions });

  await expect(fetchPendingProfileQuestions()).resolves.toEqual([
    questions[1],
    questions[0],
  ]);
  expect(requestMock).toHaveBeenCalledWith(
    'GET',
    '/auth/me/profile-questions',
  );
});

test('submits keyed answers and validates returned pending questions', async () => {
  requestMock.mockResolvedValue({ pendingQuestions: questions });

  await expect(
    saveProfileAnswers({ age: 35, activity: null }),
  ).resolves.toEqual([questions[1], questions[0]]);
  expect(requestMock).toHaveBeenCalledWith(
    'PATCH',
    '/auth/me/profile-answers',
    { answers: { age: 35, activity: null } },
  );
});

test('rejects malformed question data', async () => {
  requestMock.mockResolvedValue({
    questions: [{ id: 'incomplete', key: 'age' }],
  });

  await expect(fetchPendingProfileQuestions()).rejects.toThrow(
    'The server returned invalid profile questions.',
  );
});
