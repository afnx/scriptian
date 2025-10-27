import { Icon, IconSizes } from "@/src/constants/Icons";
import { Ionicons } from "@expo/vector-icons";
import { ColorValue, Pressable, StyleSheet, ViewStyle } from "react-native";

interface IconButtonProps {
  icon: Icon;
  size?: number;
  color?: ColorValue;
  disabled?: boolean;
  accessibilityLabel?: string;
  style?: ViewStyle;
  onPress?: () => void;
}

export default function IconButton({
  icon,
  size = IconSizes.medium,
  color = "#000",
  disabled = false,
  accessibilityLabel,
  style,
  onPress,
}: IconButtonProps) {
  return (
    <Pressable
      style={({ pressed }) => [
        styles.button,
        style,
        disabled && styles.disabled,
        pressed && !disabled && styles.pressed,
      ]}
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      <Ionicons name={icon} size={size} color={color} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 8,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  disabled: {
    opacity: 0.4,
  },
  pressed: {
    opacity: 0.7,
  },
});

export { IconSizes };
