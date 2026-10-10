import { useEffect, useState } from "react";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { verifyEmailSignIn } from "../services/scoreApi";

export default function VerifyEmail() {
  const { token } = useLocalSearchParams<{ token?: string }>();
  const router = useRouter();
  const { theme } = useTheme();
  const { completeSignIn } = useAuth();
  const [result, setResult] = useState<{
    message: string;
    isVerified: boolean;
  } | null>(null);
  const message =
    result?.message ??
    (typeof token === "string"
      ? "Verifying your sign-in link..."
      : "This sign-in link is missing its token.");
  const isVerified = result?.isVerified ?? false;

  useEffect(() => {
    if (typeof token !== "string") return;

    let isCurrent = true;
    void verifyEmailSignIn(token)
      .then((account) => {
        if (isCurrent) {
          completeSignIn(account.email);
          setResult({
            message: "Email verified. Your scores are now saved to your account.",
            isVerified: true,
          });
        }
      })
      .catch((error: unknown) => {
        if (isCurrent) {
          setResult({
            message:
              error instanceof Error
                ? error.message
                : "Could not verify the link.",
            isVerified: false,
          });
        }
      });

    return () => {
      isCurrent = false;
    };
  }, [completeSignIn, token]);

  return (
    <View style={[styles.page, { backgroundColor: theme.desktopBg }]}>
      <View
        style={[
          styles.dialog,
          {
            backgroundColor: theme.windowBg,
            borderColor: theme.windowBorderLight,
            borderRightColor: theme.windowBorderDark,
            borderBottomColor: theme.windowBorderDark,
          },
        ]}
      >
        <Text style={[styles.title, { color: theme.textMain }]}>
          {isVerified ? "Sign-in complete" : "Retro Portfolio"}
        </Text>
        <Text style={[styles.message, { color: theme.textMain }]}>{message}</Text>
        {isVerified && (
          <TouchableOpacity
            accessibilityRole="button"
            onPress={() => router.replace("/")}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Return to desktop</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  page: { flex: 1, alignItems: "center", justifyContent: "center", padding: 16 },
  dialog: { width: "100%", maxWidth: 420, borderWidth: 2, padding: 20, gap: 14 },
  title: { fontSize: 16, fontWeight: "bold" },
  message: { fontSize: 13 },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#777",
    borderBottomColor: "#777",
    borderRadius: 0,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  buttonText: { color: "#111", fontSize: 12, fontWeight: "bold" },
});
