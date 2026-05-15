import React, { useState } from 'react';
import AppNavigator from '../navigation/AppNavigator';
import LoginScreen from '../screens/LoginScreen';
import { ChatProvider } from '../context/ChatContext';
import ChatModal from '../components/ChatModal';

export default function Index() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <ChatProvider>
      <AppNavigator />
      {/* @ts-ignore */}
      <ChatModal onCerrarSesion={() => setIsLoggedIn(false)} />
    </ChatProvider>
  );
}