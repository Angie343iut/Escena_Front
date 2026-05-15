import { Stack } from 'expo-router';
import { ChatProvider } from '../context/ChatContext';
import ChatModal from '../components/ChatModal';

export default function Layout() {
  return (
    <ChatProvider>
      <Stack screenOptions={{ headerShown: false }} />
      <ChatModal />
    </ChatProvider>
  );
}