import { Image, Pressable, StyleSheet, Text } from 'react-native';
import { colors, radius, shadows } from '../../theme';

interface Props {
  title: string;
  onPress: () => void;
  disabled?: boolean;
}

export default function IdPButton({ title, onPress, disabled }: Props) {
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      style={({ pressed }) => [
        styles.button,
        pressed && styles.pressed,
        disabled && styles.disabled,
      ]}
    >
      <Image source={require('../../../assets/mbayo.png')} style={styles.logo} />
      <Text style={styles.title}>{title}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    width: '100%',
    minHeight: 56,
    paddingHorizontal: 20,
    borderRadius: radius.pill,
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: '#DCDFE3',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    ...(shadows.sm as object),
  },
  logo: {
    width: 24,
    height: 24,
    borderRadius: 6,
  },
  title: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  pressed: {
    backgroundColor: '#FAFAFA',
    transform: [{ scale: 0.985 }],
  },
  disabled: {
    opacity: 0.7,
  },
});