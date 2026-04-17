import { useMemo, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, Pressable, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';
import { Send } from 'lucide-react-native';
import { mockMessages, type Message } from '@lib/mock-data';
import { relativeTimeDe } from '@lib/cn';

export default function ThreadScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const initial = useMemo(() => (id ? mockMessages[id] ?? [] : []), [id]);
  const [messages, setMessages] = useState<Message[]>(initial);
  const [draft, setDraft] = useState('');

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    const newMsg: Message = {
      id: `m_${Date.now()}`,
      threadId: id ?? 't',
      from: 'family',
      authorName: 'Sie',
      sentAt: new Date().toISOString(),
      body: text,
      read: true,
    };
    setMessages((prev) => [...prev, newMsg]);
    setDraft('');
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['bottom']}>
      <KeyboardAvoidingView className="flex-1" behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <FlatList
          data={messages}
          keyExtractor={(m) => m.id}
          contentContainerStyle={{ padding: 16, gap: 10 }}
          renderItem={({ item }) => (
            <View
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${item.from === 'family' ? 'self-end bg-brand-700' : 'self-start bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800'}`}
            >
              <Text className={`text-xs mb-1 ${item.from === 'family' ? 'text-brand-100' : 'text-gray-500'}`}>
                {item.authorName} · {relativeTimeDe(item.sentAt)}
              </Text>
              <Text className={item.from === 'family' ? 'text-white' : 'text-gray-900 dark:text-white'}>{item.body}</Text>
            </View>
          )}
        />
        <View className="flex-row items-end gap-2 p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-900">
          <TextInput
            className="flex-1 rounded-button border border-gray-200 dark:border-gray-700 px-4 py-3 text-gray-900 dark:text-white"
            placeholder="Nachricht schreiben…"
            placeholderTextColor="#9CA3AF"
            value={draft}
            onChangeText={setDraft}
            multiline
            accessibilityLabel="Nachricht verfassen"
          />
          <Pressable
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="Senden"
            disabled={!draft.trim()}
            className={`h-11 w-11 items-center justify-center rounded-button ${draft.trim() ? 'bg-brand-700' : 'bg-gray-300'}`}
          >
            <Send size={18} color="#fff" />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
