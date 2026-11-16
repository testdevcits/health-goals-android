import React, { useCallback, useMemo, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getCurrentUser } from '../../services/profile';
import {
  fetchPendingProfileQuestions,
  ProfileQuestion,
  saveProfileAnswers,
} from '../../services/profileQuestions';
import { apiErrorMessage } from '../../services/api';
import { showAppToast } from '../../utils/appToast';

export const isValidDateAnswer = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
  );
};

export const dateAnswerToCalendarKey = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  return match ? `${match[3]}-${match[2]}-${match[1]}` : undefined;
};

export const calendarKeyToDateAnswer = (value: string) => {
  const [year, month, day] = value.split('-');
  return `${day}/${month}/${year}`;
};

export const getMaxBirthDate = () => {
  const today = new Date();
  return new Date(today.getFullYear() - 18, today.getMonth(), today.getDate());
};

export const maxBirthDateCalendarKey = () => {
  const max = getMaxBirthDate();
  return `${max.getFullYear()}-${String(max.getMonth() + 1).padStart(2, '0')}-${String(max.getDate()).padStart(2, '0')}`;
};

export const isAtLeast18 = (value: string) => {
  const match = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(value.trim());
  if (!match) return false;
  const day = Number(match[1]);
  const month = Number(match[2]);
  const year = Number(match[3]);
  const date = new Date(year, month - 1, day);
  return date <= getMaxBirthDate();
};

export const useProfileQuestions = (enabled = true) => {
  const [visible, setVisible] = useState(false);
  const [userId, setUserId] = useState('');
  const [questions, setQuestions] = useState<ProfileQuestion[]>([]);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [datePickerVisible, setDatePickerVisible] = useState(false);
  const checkedUserId = React.useRef<string | null>(null);
  const loadingRef = React.useRef(false);
  const reloadAfterLoadingRef = React.useRef(false);
  const focusedRef = React.useRef(false);
  const loadQuestionsRef = React.useRef<() => Promise<void>>(async () => {});
  const currentQuestion = questions[questionIndex];

  const loadQuestions = useCallback(async () => {
    if (!enabled || !focusedRef.current) return;
    if (loadingRef.current) {
      reloadAfterLoadingRef.current = true;
      return;
    }
    loadingRef.current = true;
    try {
      const user = await getCurrentUser();
      if (!focusedRef.current || !enabled) return;
      if (checkedUserId.current === user.id) return;
      const pendingQuestions = await fetchPendingProfileQuestions();
      if (!focusedRef.current || !enabled) return;
      checkedUserId.current = user.id;
      setUserId(user.id);
      setQuestions(pendingQuestions);
      setQuestionIndex(0);
      setAnswer('');
      setError('');
      setDatePickerVisible(false);
      setVisible(pendingQuestions.length > 0);
    } catch (cause) {
      if (focusedRef.current) {
        console.error('Unable to load pending profile questions:', cause);
        showAppToast(
          'error',
          'Could not load profile questions',
          apiErrorMessage(cause),
        );
      }
    } finally {
      loadingRef.current = false;
      if (reloadAfterLoadingRef.current) {
        reloadAfterLoadingRef.current = false;
        if (focusedRef.current) {
          loadQuestionsRef.current().catch(cause => {
            console.error('Unexpected profile-question loading failure:', cause);
          });
        }
      }
    }
  }, [enabled]);
  loadQuestionsRef.current = loadQuestions;

  useFocusEffect(
    useCallback(() => {
      focusedRef.current = true;
      loadQuestions().catch(cause => {
        console.error('Unexpected profile-question loading failure:', cause);
      });
      return () => {
        focusedRef.current = false;
      };
    }, [loadQuestions]),
  );

  const dismiss = () => {
    if (userId) checkedUserId.current = userId;
    setVisible(false);
    setDatePickerVisible(false);
    setError('');
  };

  const validationError = useMemo(() => {
    if (!currentQuestion) return '';
    const trimmed = answer.trim();
    if (!trimmed) {
      return currentQuestion.required ? 'This answer is required.' : '';
    }
    if (
      currentQuestion.type === 'select' &&
      !currentQuestion.options.includes(trimmed)
    ) {
      return 'Select one of the available options.';
    }
    if (currentQuestion.type === 'number' && !Number.isFinite(Number(trimmed))) {
      return 'Enter a valid number.';
    }
    if (currentQuestion.type === 'date') {
      if (!isValidDateAnswer(trimmed)) {
        return 'Enter a valid date in DD/MM/YYYY format.';
      }
      if (!isAtLeast18(trimmed)) {
        return 'You must be at least 18 years old.';
      }
    }
    return '';
  }, [answer, currentQuestion]);

  const saveAndContinue = async () => {
    if (!currentQuestion || saving) return;
    if (validationError) {
      setError(validationError);
      return;
    }

    const trimmed = answer.trim();
    const value =
      trimmed.length === 0
        ? null
        : currentQuestion.type === 'number'
        ? Number(trimmed)
        : trimmed;
    setSaving(true);
    setError('');
    try {
      const pending =
        (await saveProfileAnswers({ [currentQuestion.key]: value })) ??
        (await fetchPendingProfileQuestions());
      const nextQuestions = pending.filter(
        question => question.key !== currentQuestion.key,
      );
      setQuestions(nextQuestions);
      setQuestionIndex(0);
      setAnswer('');
      setDatePickerVisible(false);
      if (nextQuestions.length === 0) {
        setVisible(false);
        showAppToast(
          'success',
          'Profile updated',
          'Your answers have been saved.',
        );
      }
    } catch (cause) {
      setError(apiErrorMessage(cause));
    } finally {
      setSaving(false);
    }
  };

  return {
    visible,
    questions,
    questionIndex,
    currentQuestion,
    answer,
    setAnswer,
    saving,
    error,
    setError,
    datePickerVisible,
    setDatePickerVisible,
    dismiss,
    saveAndContinue,
  };
};
