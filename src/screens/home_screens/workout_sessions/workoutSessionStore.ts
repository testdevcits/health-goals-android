import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@vitality/active-workout-session';

export interface WorkoutSession {
  activityId: string;
  elapsedMilliseconds: number;
  startedAtMilliseconds: number | null;
}

type Listener = () => void;

let session: WorkoutSession | null = null;
let loadPromise: Promise<WorkoutSession | null> | null = null;
let transitionQueue: Promise<void> = Promise.resolve();
const listeners = new Set<Listener>();

const notifyListeners = () => {
  listeners.forEach(listener => listener());
};

const loadSession = (): Promise<WorkoutSession | null> => {
  if (!loadPromise) {
    loadPromise = AsyncStorage.getItem(STORAGE_KEY).then(value => {
      if (value === null) {
        session = null;
        return session;
      }

      const storedSession: unknown = JSON.parse(value);
      if (
        typeof storedSession !== 'object' ||
        storedSession === null ||
        !('activityId' in storedSession) ||
        typeof storedSession.activityId !== 'string' ||
        !('elapsedMilliseconds' in storedSession) ||
        typeof storedSession.elapsedMilliseconds !== 'number' ||
        !Number.isFinite(storedSession.elapsedMilliseconds) ||
        storedSession.elapsedMilliseconds < 0 ||
        !('startedAtMilliseconds' in storedSession) ||
        (storedSession.startedAtMilliseconds !== null &&
          (typeof storedSession.startedAtMilliseconds !== 'number' ||
            !Number.isFinite(storedSession.startedAtMilliseconds)))
      ) {
        throw new Error('Saved workout session data is invalid.');
      }

      session = {
        activityId: storedSession.activityId,
        elapsedMilliseconds: storedSession.elapsedMilliseconds,
        startedAtMilliseconds: storedSession.startedAtMilliseconds,
      };
      return session;
    });
  }

  return loadPromise;
};

const transition = (
  update: (current: WorkoutSession | null) => WorkoutSession | null,
): Promise<WorkoutSession | null> => {
  const nextTransition = transitionQueue.then(async () => {
    await loadSession();
    const nextSession = update(session);

    if (nextSession === session) {
      return session;
    }

    if (nextSession === null) {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } else {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(nextSession));
    }

    session = nextSession;
    notifyListeners();
    return session;
  });

  transitionQueue = nextTransition.then(
    () => undefined,
    () => undefined,
  );

  return nextTransition;
};

export const subscribeToWorkoutSession = (listener: Listener) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getWorkoutSession = async () => {
  await loadSession();
  return session;
};

export const startWorkoutSession = (activityId: string) =>
  transition(
    current =>
      current ?? {
        activityId,
        elapsedMilliseconds: 0,
        startedAtMilliseconds: Date.now(),
      },
  );

export const pauseWorkoutSession = () =>
  transition(current => {
    if (!current || current.startedAtMilliseconds === null) {
      return current;
    }

    return {
      ...current,
      elapsedMilliseconds:
        current.elapsedMilliseconds +
        Math.max(0, Date.now() - current.startedAtMilliseconds),
      startedAtMilliseconds: null,
    };
  });

export const resumeWorkoutSession = () =>
  transition(current => {
    if (!current || current.startedAtMilliseconds !== null) {
      return current;
    }

    return { ...current, startedAtMilliseconds: Date.now() };
  });

export const clearWorkoutSession = () => transition(() => null);

export const getElapsedMilliseconds = (
  current: WorkoutSession,
  now = Date.now(),
) =>
  current.elapsedMilliseconds +
  (current.startedAtMilliseconds === null
    ? 0
    : Math.max(0, now - current.startedAtMilliseconds));
