import { StyleSheet, View } from 'react-native';
import { colors } from '../../theme';

interface Props {
  count: number;
  activeIndex: number;
  variant?: 'dark' | 'light';
}

export default function PaginationDots({
  count,
  activeIndex,
  variant = 'dark',
}: Props) {
  const base = variant === 'dark' ? colors.text : 'rgba(255,255,255,0.35)';
  const active = variant === 'dark' ? colors.primary : colors.mint;
  return (
    <View style={styles.row}>
      {Array.from({ length: count }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.dot,
            { backgroundColor: i === activeIndex ? active : base },
            i === activeIndex && styles.activeDot,
          ]}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 9,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  activeDot: {
    width: 26,
    borderRadius: 6,
  },
});