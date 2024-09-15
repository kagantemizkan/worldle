import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Colors } from "@/constants/Colors";
import { useMMKVString } from "react-native-mmkv";
import { storage } from "@/utils/storage";
import { useEffect, useState } from "react";

type OnScreenKeyboardProps = {
  onKeyPressed: (key: string) => void;
  greenLetters: string[];
  yellowLetters: string[];
  grayLetters: string[];
};

export const ENTER = "ENTER";
export const BACKSPACE = "BACKSPACE";

const keysEnglish = [
  ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l"],
  [ENTER, "z", "x", "c", "v", "b", "n", "m", BACKSPACE],
];
const keysTurkish = [
  ["e", "r", "t", "y", "u", "ı", "o", "p", "ğ", "ü"],
  ["a", "s", "d", "f", "g", "h", "j", "k", "l", "ş", "i"],
  [ENTER, "z", "c", "v", "b", "n", "m", "ö", "ç", BACKSPACE],
];

const OnScreenKeyboard = ({
  onKeyPressed,
  greenLetters,
  yellowLetters,
  grayLetters,
}: OnScreenKeyboardProps) => {
  const { width } = useWindowDimensions();
  const [language] = useMMKVString("language", storage);
  const [keys, setKeys] = useState<string[][]>();
  useEffect(() => {
    if (language === "tr") {
      console.log("TÜRKÇE KLAVYE");
      setKeys(keysTurkish);
    } else if (language === "en") {
      setKeys(keysEnglish);
    }
  }, []);

  const keyWidth = keys
    ? Platform.OS === "web"
      ? 58
      : (width - 65) / keys[0].length
    : 0;
  const keyHeight = 60;

  const isSpecialKey = (key: string) => key === ENTER || key === BACKSPACE;

  const isInLetters = (key: string) =>
    [...greenLetters, ...yellowLetters, ...grayLetters].includes(key);

  return (
    <View style={styles.container}>
      {keys &&
        keys.map((row, rowIndex) => (
          <View key={`row-${rowIndex}`} style={styles.row}>
            {row.map((key, keyIndex) => (
              <Pressable
                onPress={() => onKeyPressed(key)}
                key={`key-${key}`}
                style={({ pressed }) => [
                  styles.key,
                  {
                    width: keyWidth,
                    height: keyHeight,
                    backgroundColor: "#ddd",
                  },
                  isSpecialKey(key) && { width: keyWidth * 1.5 },
                  pressed && { backgroundColor: "#868686" },
                  {
                    backgroundColor: greenLetters.includes(key)
                      ? Colors.light.green
                      : yellowLetters.includes(key)
                      ? Colors.light.yellow
                      : grayLetters.includes(key)
                      ? Colors.light.gray
                      : "#ddd",
                  },
                ]}
              >
                <Text
                  style={[
                    styles.keyText,
                    key === "ENTER" && { fontSize: 12 },
                    isInLetters(key) && { color: "#fff" },
                  ]}
                >
                  {isSpecialKey(key) ? (
                    key === ENTER ? (
                      "ENTER"
                    ) : (
                      <Ionicons
                        name="backspace-outline"
                        size={24}
                        color="black"
                      />
                    )
                  ) : key === "i" ? (
                    "İ"
                  ) : (
                    key.toUpperCase()
                  )}
                </Text>
              </Pressable>
            ))}
          </View>
        ))}
    </View>
  );
};
export default OnScreenKeyboard;
const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    gap: 6,
    alignSelf: "center",
  },
  row: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 4,
  },
  key: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  keyText: {
    fontWeight: "bold",
    fontSize: 20,
  },
});
