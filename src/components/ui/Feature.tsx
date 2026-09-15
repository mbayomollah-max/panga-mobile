import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, Text, View } from 'react-native';
import { colors, radius } from '../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface Props {
  icon: IconName;
  title: string;
  variant?: 'glass' | 'paper';
}

export default function Feature({ icon, title, variant = 'glass' }: Props) {
  const isGlass = variant === 'glass';
  return (
    <View style={[styles.feature, isGlass ? styles.glass : styles.paper]}>
      <View style={styles.circle}>
        <Ionicons name={icon} size={22} color={colors.tealBright} />
      </View>
      <Text style={[styles.text, isGlass ? styles.glassText : styles.paperText]}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  feature: {
    flex: 1,
    borderRadius: radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
  },
  glass: {
    backgroundColor: 'rgba(255,255,255,0.09)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.16)',
  },
  paper: {
    backgroundColor: colors.surface,
    paddingHorizontal: 8,
  },
  circle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: 'rgba(14, 190, 158, 0.16)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 13,
    lineHeight: 17,
    textAlign: 'center',
    fontWeight: '600',
  },
  glassText: {
    color: colors.white,
  },
  paperText: {
    color: colors.textMuted,
  },
});