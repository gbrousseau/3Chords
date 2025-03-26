import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Link, router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Mail } from 'lucide-react-native';

WebBrowser.maybeCompleteAuthSession();

export default function AuthScreen() {
  const [googleRequest, googleResponse, googlePromptAsync] =
    Google.useAuthRequest({
      androidClientId: '85339006592-e3gltpi9kunsa2mfff3sam9elm1p3a2d.apps.googleusercontent.com',
      iosClientId: '85339006592-oe2n2n96tps7j6nve4elsqq0ah488rso.apps.googleusercontent.com',
      webClientId: '85339006592-e3gltpi9kunsa2mfff3sam9elm1p3a2d.apps.googleusercontent.com'
    });

  useEffect(() => {
    if (googleResponse?.type === 'success') {
      const { authentication } = googleResponse;
      // Handle successful Google authentication
      console.log(authentication);
    }
  }, [googleResponse]);

  return (
    <LinearGradient colors={['#4F46E5', '#7C3AED']} style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>
          Sign in to continue your coaching journey
        </Text>

        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.socialButton}
            onPress={() => googlePromptAsync()}
            disabled={!googleRequest}
          >
            <View style={styles.socialIcon}>
              <Text style={styles.googleIcon}>G</Text>
            </View>
            <Text style={styles.buttonText}>Continue with Google</Text>
          </Pressable>

          <Link href="/(auth)/welcome" asChild>
            <Pressable style={styles.socialButton}>
              <Mail size={24} color="#4F46E5" />
              <Text style={styles.buttonText}>Continue with Email</Text>
            </Pressable>
          </Link>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account?</Text>
          <Pressable onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.signupText}>Sign up</Text>
          </Pressable>
        </View>
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
    marginBottom: 48,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 16,
  },
  socialButton: {
    backgroundColor: '#ffffff',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    borderRadius: 12,
    gap: 12,
  },
  socialIcon: {
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  googleIcon: {
    fontFamily: 'Inter-Bold',
    fontSize: 18,
    color: '#4F46E5',
  },
  buttonText: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    color: '#4F46E5',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 32,
    gap: 8,
  },
  footerText: {
    fontFamily: 'Inter-Regular',
    color: '#E0E7FF',
  },
  signupText: {
    fontFamily: 'Inter-SemiBold',
    color: '#ffffff',
    padding: 10,
  },
});