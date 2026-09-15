import { Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  variant?: 'light' | 'ghost';
}

export default function SecondaryButton({ title, onPress, variant = 'light' }: Props) {
  const isGhost = variant === 'ghost';
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        isGhost ? styles.ghost : styles.light,
        pressed && styles.pressed,
      ]}
    >
      <Text style={[styles.title, isGhost ? styles.ghostTitle : styles.lightTitle]}>
        {title}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 58,
    marginTop: 14,
    borderRadius: radius.pill,
    alignItems: 'center',
    justifyContent: 'center',
  },
  light: {
    borderWidth: 1.5,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  ghost: {
    borderWidth: 1.2,
    borderColor: 'rgba(255,255,255,0.28)',
    backgroundColor: 'rgba(255,255,255,0.06)',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
  },
  lightTitle: {
    color: colors.text,
  },
  ghostTitle: {
    color: colors.white,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.98 }],
  },
});