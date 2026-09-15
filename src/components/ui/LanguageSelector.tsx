import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { palette } from '../../theme/palette';
import { radius } from '../../theme';

interface Props {
  dark?: boolean;
}

export default function LanguageSelector({ dark }: Props) {
  const container = dark ? styles.darkButton : styles.lightButton;
  const textColor = dark ? palette.white : palette.navy;
  const borderColor = dark ? 'rgba(255,255,255,0.22)' : '#E1E5EA';

  return (
    <Pressable style={[styles.button, container, { borderColor }]}>
      <View style={styles.flag}>
        <View style={styles.flagBlue} />
        <View style={styles.flagRed} />
        <View style={styles.flagYellow} />
      </View>
      <Text style={[styles.text, { color: textColor }]}>FR</Text>
      <Ionicons name="chevron-down" size={18} color={textColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    height: 48,
    minWidth: 118,
    borderRadius: radius.pill,
    borderWidth: 1.4,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    gap: 8,
  },
  lightButton: {
    backgroundColor: palette.white,
  },
  darkButton: {
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  flag: {
    width: 26,
    height: 26,
    borderRadius: 13,
    overflow: 'hidden',
    backgroundColor: palette.flagBlue,
  },
  flagBlue: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: palette.flagBlue,
  },
  flagRed: {
    position: 'absolute',
    width: 40,
    height: 10,
    backgroundColor: palette.flagRed,
    transform: [{ rotate: '32deg' }],
    top: 9,
    left: -5,
  },
  flagYellow: {
    position: 'absolute',
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: palette.flagYellow,
    top: 6,
    left: 7,
  },
  text: {
    fontSize: 16,
    fontWeight: '800',
  },
});