import { StyleSheet, Text, View } from 'react-native';
import { colors } from '../../theme';

interface Props {
  name: string;
  size?: number;
}

export default function Avatar({ name, size = 48 }: Props) {
  const initial = name.charAt(0).toUpperCase() || '?';
  return (
    <View style={[styles.circle, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.text, { fontSize: size * 0.42 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  circle: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    color: colors.surface,
    fontWeight: '700',
  },
});