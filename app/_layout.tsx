import { Stack, useRouter } from "expo-router";
import {
  useFonts,
  FrankRuhlLibre_800ExtraBold,
  FrankRuhlLibre_500Medium,
  FrankRuhlLibre_900Black,
} from "@expo-google-fonts/frank-ruhl-libre";
import {
  useColorScheme,
  TouchableOpacity,
  Appearance,
  Platform,
} from "react-native";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BottomSheetModalProvider } from "@gorhom/bottom-sheet";
import Logo from "@/assets/images/nyt-logo.svg";
import { Colors } from "@/constants/Colors";
import { ClerkProvider, ClerkLoaded } from "@clerk/clerk-expo";
import { tokenCache } from "@/utils/cache";
import { useMMKVBoolean, useMMKVString } from "react-native-mmkv";
import { storage } from "@/utils/storage";
import { useTranslation, I18nextProvider } from "react-i18next";
import * as RNLocalize from "react-native-localize";
import i18n from "@/utils/i18n";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error(
    "Missing Publishable Key. Please set EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY in your .env"
  );
}

// Load the fonts first before hiding the splash screen
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [dark] = useMMKVBoolean("dark-mode", storage);
  const [language, setLanguage] = useMMKVString("language", storage);

  const { t } = useTranslation();

  useEffect(() => {
    if (!language) {
      const locale = RNLocalize.getLocales()[0].languageCode;
      setLanguage(locale);
      i18n.changeLanguage(locale);
    } else {
      const locale = language;
      i18n.changeLanguage(locale);
    }
  }, []);

  useEffect(() => {
    if (Platform.OS !== "web") {
      Appearance.setColorScheme(dark ? "dark" : "light");
    }
  }, [dark]);

  let [fontsLoaded] = useFonts({
    FrankRuhlLibre_800ExtraBold,
    FrankRuhlLibre_500Medium,
    FrankRuhlLibre_900Black,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <ClerkProvider publishableKey={publishableKey} tokenCache={tokenCache}>
      <ClerkLoaded>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <I18nextProvider i18n={i18n}>
              <BottomSheetModalProvider>
                <Stack>
                  <Stack.Screen
                    name="index"
                    options={{
                      headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="game"
                    options={{
                      headerBackTitle: "Wordle",
                      headerTintColor: colorScheme === "dark" ? "#fff" : "#000",
                      headerBackTitleStyle: {
                        fontFamily: "FrankRuhlLibre_800ExtraBold",
                        fontSize: 26,
                      },
                      title: "",
                    }}
                  />
                  <Stack.Screen
                    name="login"
                    options={{
                      presentation: "modal",
                      headerShadowVisible: false,
                      headerBackVisible: Platform.OS === "android" && false,
                      headerTitle: () => <Logo width={150} height={40} />,
                      headerTitleAlign: "center",
                      headerLeft: () => (
                        <TouchableOpacity onPress={() => router.back()}>
                          <Ionicons
                            name="close"
                            size={26}
                            color={Colors.light.gray}
                          />
                        </TouchableOpacity>
                      ),
                    }}
                  />
                  <Stack.Screen
                    name="end"
                    options={{
                      presentation: "fullScreenModal",
                      title: "",
                      headerShadowVisible: false,
                      headerShown: Platform.OS === "android" && false,
                      // headerStyle: {
                      //   backgroundColor: '#fff',
                      // },
                      // headerTransparent: true,
                      // headerShown: false,
                    }}
                  />
                  <Stack.Screen
                    name="oauth-native-callback"
                    options={{
                      presentation: "fullScreenModal",
                      title: "",
                      headerShadowVisible: false,
                      headerShown: false,
                    }}
                  />
                </Stack>
              </BottomSheetModalProvider>
            </I18nextProvider>
          </GestureHandlerRootView>
        </ThemeProvider>
      </ClerkLoaded>
    </ClerkProvider>
  );
}
