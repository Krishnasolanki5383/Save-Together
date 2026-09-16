import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../services/authContext';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="request/[id]" options={{ headerShown: true, title: 'Request Details' }} />
          <Stack.Screen name="poll/[id]" options={{ headerShown: true, title: 'Society Poll' }} />
          <Stack.Screen name="society/qr" options={{ headerShown: true, title: 'Society QR Code' }} />
          <Stack.Screen name="society/admin" options={{ headerShown: true, title: 'Admin Dashboard' }} />
          <Stack.Screen name="society/savings" options={{ headerShown: true, title: 'Society Savings' }} />
          <Stack.Screen name="activity/my-activities" options={{ headerShown: true, title: 'My Activities' }} />
        </Stack>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
