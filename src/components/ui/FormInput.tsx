import { Ionicons } from '@expo/vector-icons';
import { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
  type TextInputProps,
} from 'react-native';
import { colors, radius } from '../../theme';

type IconName = keyof typeof Ionicons.glyphMap;

interface Props extends TextInputProps {
  label: string;
  icon: IconName;
  error?: string;
}

export default function FormInput({ label, icon, error, ...inputProps }: Props) {
  const [secureVisible, setSecureVisible] = useState(false);
  const isSecure = inputProps.secureTextEntry;
  const effectiveSecure = isSecure && !secureVisible;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.field, error && styles.fieldError]}>
        <Ionicons name={icon} size={19} color={colors.textSoft} />
        <TextInput
          style={styles.input}
          placeholderTextColor={colors.textDim}
          {...inputProps}
          secureTextEntry={effectiveSecure}
        />
        {isSecure ? (
          <Pressable onPress={() => setSecureVisible((v) => !v)} hitSlop={10}>
            <Ionicons
              name={secureVisible ? 'eye-off-outline' : 'eye-outline'}
              size={20}
              color={colors.textSoft}
            />
          </Pressable>
        ) : null}
      </View>
      {error ? <Text style={styles.error}>{error}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 7,
  },
  field: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: colors.input,
    borderRadius: radius.md,
    paddingHorizontal: 14,
    height: 54,
  },
  fieldError: {
    backgroundColor: colors.dangerBg,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: colors.text,
  },
  error: {
    marginTop: 6,
    fontSize: 13,
    color: colors.danger,
  },
});