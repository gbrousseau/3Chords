import { View, Text, StyleSheet, Pressable, TextInput } from 'react-native';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { useState } from 'react';
import { useAuth } from '../../context/auth';

export default function ResetPasswordScreen() {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleResetPassword = async () => {
    try {
      await resetPassword(email);
      setSuccess(true);
      setError('');
    } catch (error: any) {
      setError(error.message);
    }
  };

  return (
    <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Reset Password</Text>
        <Text style={styles.subtitle}>
          Enter your email address to receive a password reset link
        </Text>

        {error ? <Text style={styles.error}>{error}</Text> : null}
        {success ? (
          <Text style={styles.success}>
            Password reset email sent! Check your inbox.
          </Text>
        ) : null}

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="#A5B4FC"
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          <Pressable style={styles.resetButton} onPress={handleResetPassword}>
            <Text style={styles.resetButtonText}>Send Reset Link</Text>
          </Pressable>
        </View>

        <Pressable onPress={() => router.back()} style={styles.backButton}>
          <Text style={styles.backButtonText}>Back to Sign In</Text>
        </Pressable>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontFamily: 'Inter-Bold',
    fontSize: 32,
    color: '#ffffff',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Inter-Regular',
    fontSize: 18,
    color: '#E0E7FF',
    marginBottom: 32,
    textAlign: 'center',
  },
  error: {
    color: '#FCA5A5',
    marginBottom: 16,
    textAlign: 'center',
  },
  success: {
    color: '#86EFAC',
    marginBottom: 16,
    textAlign: 'center',
  },
  form: {
    width: '100%',
    gap: 16,
  },
  input: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    color: '#ffffff',
    fontSize: 16,
  },
  resetButton: {
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  resetButtonText: {
    color: '#4F46E5',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
  backButton: {
    marginTop: 24,
    padding: 12,
  },
  backButtonText: {
    color: '#E0E7FF',
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
  },
}); 