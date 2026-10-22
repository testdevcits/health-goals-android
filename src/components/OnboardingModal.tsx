// src/components/OnboardingModal.tsx
import React, { useState, useRef } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  Animated,
  TouchableOpacity,
} from 'react-native';
import { useTheme } from '../theme/useTheme';
import AppText from './AppText';
import AppButton from './AppButton';

const STEPS = [
  {
    emoji: '👋',
    step: 'STEP 1 OF 3',
    title: 'Welcome to Vitality',
    desc: 'Track your health, compete on leaderboards, and build momentum with your crew.',
  },
  {
    emoji: '🏆',
    step: 'STEP 2 OF 3',
    title: 'Compete & Achieve',
    desc: 'Join challenges, climb leaderboards, and earn badges as you crush your goals.',
  },
  {
    emoji: '💪',
    step: 'STEP 3 OF 3',
    title: 'Build Your Crew',
    desc: 'Connect with teammates, share workouts, and motivate each other every single day.',
  },
];

interface OnboardingModalProps {
  visible: boolean;
  onDismiss: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({
  visible,
  onDismiss,
}) => {
  const { theme } = useTheme();
  const { colors, spacing, radius } = theme;
  const [step, setStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;

  const animateStep = (toStep: number) => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start();
    setStep(toStep);
  };

  const handleNext = () => {
    if (step < STEPS.length - 1) {
      animateStep(step + 1);
    } else {
      setStep(0);
      onDismiss();
    }
  };

  const current = STEPS[step];

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      statusBarTranslucent
      onRequestClose={onDismiss}>
      <View style={styles.backdrop}>
        <View
          style={[
            styles.card,
            {
              backgroundColor: colors.surface,
              borderRadius: radius.xxl,
              marginHorizontal: spacing.xl,
              padding: spacing.xl,
            },
          ]}>
          <Animated.View
            style={{ opacity: fadeAnim, alignItems: 'center', width: '100%' }}>
            {/* Emoji */}
            <AppText style={styles.emoji}>{current.emoji}</AppText>

            {/* Step tag */}
            <AppText variant="label" primary bold center mb={10}>
              {current.step}
            </AppText>

            {/* Title */}
            <AppText variant="h3" center mb={12}>
              {current.title}
            </AppText>

            {/* Description */}
            <AppText
              variant="body2"
              secondary
              center
              mb={28}
              style={{ paddingHorizontal: spacing.sm }}>
              {current.desc}
            </AppText>
          </Animated.View>

          {/* Progress dots */}
          <View style={styles.dots}>
            {STEPS.map((_, i) => (
              <TouchableOpacity
                key={i}
                onPress={() => animateStep(i)}
                style={[
                  styles.dot,
                  {
                    width: i === step ? 28 : 8,
                    backgroundColor:
                      i === step ? colors.primary : colors.border,
                  },
                ]}
              />
            ))}
          </View>

          {/* CTA */}
          <AppButton
            title={step === STEPS.length - 1 ? 'Get Started 🚀' : 'Next'}
            onPress={handleNext}
            style={{ marginTop: spacing.lg, marginBottom: spacing.sm }}
          />
          <AppButton title="Skip Tour" onPress={onDismiss} variant="ghost" />
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    width: '100%',
    alignItems: 'center',
    elevation: 10,
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
  },
  emoji: {
    fontSize: 56,
    marginBottom: 16,
  },
  dots: {
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
  },
  dot: {
    height: 8,
    borderRadius: 4,
  },
});

export default OnboardingModal;
