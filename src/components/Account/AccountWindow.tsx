import { useState } from "react";
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import { isScoreApiConfigured } from "../../services/scoreApi";

export default function AccountWindow() {
  const { theme } = useTheme();
  const { email, isLoading, loadError, requestSignIn, signOut } = useAuth();
  const [address, setAddress] = useState("");
  const [message, setMessage] = useState("");
  const [isSending, setIsSending] = useState(false);

  const sendSignInLink = async () => {
    const normalizedEmail = address.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail)) {
      setMessage("Enter a valid email address.");
      return;
    }
    setIsSending(true);
    setMessage("");
    try {
      await requestSignIn(normalizedEmail);
      setMessage("Check your inbox for a one-time sign-in link.");
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Could not send the sign-in link.");
    } finally {
      setIsSending(false);
    }
  };

  const themedInput = [
    styles.input,
    {
      color: theme.textMain,
      borderColor: theme.windowBorderDark,
      backgroundColor: theme.windowBg,
    },
  ];

  if (isLoading) {
    return <Text style={[styles.copy, { color: theme.textMain }]}>Checking account...</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={[styles.heading, { color: theme.textMain }]}>
        {email ? "You are signed in" : "Sign in to your account"}
      </Text>
      {email ? (
        <>
          <Text style={[styles.copy, { color: theme.textMain }]}>{email}</Text>
          <Text style={[styles.copy, { color: theme.textMuted }]}>
            Your scores will be saved to this account automatically in supported games.
          </Text>
          <TouchableOpacity
            accessibilityRole="button"
            onPress={signOut}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Sign out</Text>
          </TouchableOpacity>
        </>
      ) : (
        <>
          <Text style={[styles.copy, { color: theme.textMuted }]}>
            Enter your email and we’ll send a one-time link. You stay signed in on this device.
          </Text>
          <TextInput
            value={address}
            onChangeText={setAddress}
            placeholder="you@example.com"
            placeholderTextColor={theme.textMuted}
            keyboardType="email-address"
            autoCapitalize="none"
            autoComplete="email"
            style={themedInput}
            accessibilityLabel="Email address"
          />
          <TouchableOpacity
            accessibilityRole="button"
            disabled={isSending || !isScoreApiConfigured()}
            onPress={() => void sendSignInLink()}
            style={[styles.button, (isSending || !isScoreApiConfigured()) && styles.disabled]}
          >
            <Text style={styles.buttonText}>
              {isSending ? "Sending..." : "Send sign-in link"}
            </Text>
          </TouchableOpacity>
          {!isScoreApiConfigured() && (
            <Text style={styles.error}>
              Account sign-in is unavailable until EXPO_PUBLIC_API_URL is configured.
            </Text>
          )}
        </>
      )}
      {message ? <Text style={styles.message}>{message}</Text> : null}
      {loadError ? <Text style={styles.error}>{loadError}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { alignItems: "flex-start", gap: 12, paddingBottom: 8 },
  heading: { fontSize: 16, fontWeight: "bold" },
  copy: { fontSize: 12, lineHeight: 18 },
  input: { width: "100%", minHeight: 34, borderWidth: 1, borderRadius: 0, paddingHorizontal: 8, fontSize: 12 },
  button: {
    minHeight: 30,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 12,
    backgroundColor: "#e5e5e5",
    borderWidth: 1,
    borderTopColor: "#fff",
    borderLeftColor: "#fff",
    borderRightColor: "#777",
    borderBottomColor: "#777",
    borderRadius: 0,
  },
  disabled: { opacity: 0.5 },
  buttonText: { color: "#111", fontSize: 12, fontWeight: "bold" },
  message: { color: "#217346", fontSize: 11 },
  error: { color: "#a12622", fontSize: 11 },
});
