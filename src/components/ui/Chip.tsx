import { StyleSheet, Text, View } from 'react-native';
import { palette } from '../../theme/palette';

interface Props {
  label: string;
  tone?: 'sky' | 'soft';
}

export default function Chip({ label, tone = 'sky' }: Props) {
  const bg = tone === 'soft' ? palette.softTeal : palette.sky;
  const fg = tone === 'soft' ? palette.tealDark : palette.skyText;
  return (
    <View style={[styles.chip, { backgroundColor: bg }]}>
      <Text style={[styles.text, { color: fg }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  chip: {
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  text: {
    fontSize: 13,
    fontWeight: '600',
  },
});