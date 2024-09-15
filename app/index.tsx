import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  useColorScheme,
  useWindowDimensions,
  Button,
} from "react-native";
import Icon from "@/assets/images/wordle-icon.svg";
import { format } from "date-fns";
import { Colors } from "@/constants/Colors";
import ThemedText from "@/components/ThemedText";
import { Link } from "expo-router";
import SubscribeModal from "@/components/SubscribeModal";
import { BottomSheetModal } from "@gorhom/bottom-sheet";
import { useRef } from "react";
import { SignedIn, SignedOut, useAuth } from "@clerk/clerk-expo";
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInLeft,
} from "react-native-reanimated";
import { useTranslation } from "react-i18next";
import SettingsModal from "@/components/SettingsModal";

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

export default function Index() {
  const colorScheme = useColorScheme();
  const backgroundColor = Colors[colorScheme ?? "light"].background;
  const textColor = Colors[colorScheme ?? "light"].text;
  const subscribeModalRef = useRef<BottomSheetModal>(null);
  const settingsModalRef = useRef<BottomSheetModal>(null);
  const { width } = useWindowDimensions();
  const { signOut } = useAuth();

  const handlePresentSubscribeModalPress = () => {
    subscribeModalRef.current?.present();
  };

  const handlePresentSettingsModalPress = () => {
    settingsModalRef.current?.present();
  };

  const { t, i18n } = useTranslation();

  const switchLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <Animated.View style={[styles.container, { backgroundColor: "#fff" }]}>
      <SubscribeModal ref={subscribeModalRef} />
      <SettingsModal ref={settingsModalRef} />
      <Animated.View style={styles.header} entering={FadeInDown}>
        <Icon width={100} height={70} />
        <ThemedText style={styles.title}>Wordle</ThemedText>
        <ThemedText style={styles.text}>{t("getChances")}</ThemedText>
      </Animated.View>

      <View
        style={[styles.menu, { flexDirection: width > 600 ? "row" : "column" }]}
      >
        <Link
          href={"/game"}
          style={[
            styles.btn,
            { backgroundColor: colorScheme === "light" ? "#000" : "#4a4a4a" },
          ]}
          asChild
        >
          <AnimatedTouchableOpacity entering={FadeInLeft}>
            <Text style={[styles.btnText, styles.primaryText]}>
              {t("play")}
            </Text>
          </AnimatedTouchableOpacity>
        </Link>

        <SignedOut>
          <Link
            href={"/login"}
            style={[styles.btn, { borderColor: textColor }]}
            asChild
          >
            <AnimatedTouchableOpacity entering={FadeInLeft.delay(100)}>
              <ThemedText style={styles.btnText}>{t("logIn")}</ThemedText>
            </AnimatedTouchableOpacity>
          </Link>
        </SignedOut>

        <SignedIn>
          <AnimatedTouchableOpacity
            onPress={() => signOut()}
            entering={FadeInLeft.delay(100)}
            style={[styles.btn, { borderColor: textColor }]}
          >
            <ThemedText style={styles.btnText}>{t("signOut")}</ThemedText>
          </AnimatedTouchableOpacity>
        </SignedIn>
        <AnimatedTouchableOpacity
          style={[styles.btn, { borderColor: textColor }]}
          onPress={handlePresentSettingsModalPress}
          entering={FadeInLeft.delay(200)}
        >
          <ThemedText style={styles.btnText}>
            {t("settingsLowrcase")}
          </ThemedText>
        </AnimatedTouchableOpacity>

        <AnimatedTouchableOpacity
          style={[styles.btn, { borderColor: textColor }]}
          onPress={handlePresentSubscribeModalPress}
          entering={FadeInLeft.delay(200)}
        >
          <ThemedText style={styles.btnText}>{t("subscribe")}</ThemedText>
        </AnimatedTouchableOpacity>
      </View>

      <Animated.View style={styles.footer} entering={FadeIn.delay(300)}>
        <ThemedText style={styles.footerDate}>
          {format(new Date(), "MMMM d, yyyy")}
        </ThemedText>
        <ThemedText style={styles.footerText}>No. 1151</ThemedText>
      </Animated.View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    gap: 40,
    paddingHorizontal: 50,
  },
  header: {
    alignItems: "center",
    gap: 10,
  },
  title: {
    fontSize: 40,
    fontFamily: "FrankRuhlLibre_800ExtraBold",
  },
  text: {
    fontSize: 26,
    textAlign: "center",
    fontFamily: "FrankRuhlLibre_500Medium",
  },
  menu: {
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  btn: {
    justifyContent: "center",
    borderRadius: 30,
    alignItems: "center",
    borderColor: "#000",
    borderWidth: 1,
    width: "60%",
    maxWidth: 200,
  },
  btnText: {
    padding: 14,
    fontSize: 16,
    fontWeight: "semibold",
    color: "#333",
  },
  primaryItem: {
    backgroundColor: "#000",
  },
  primaryText: {
    color: "#fff",
  },
  footer: {
    justifyContent: "center",
    alignItems: "center",
  },
  footerDate: {
    fontSize: 14,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
  },
});
