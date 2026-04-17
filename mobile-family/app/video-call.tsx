import { Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Video, Mic, PhoneOff } from 'lucide-react-native';
import { router } from 'expo-router';
import { Button } from '@components/ui/Button';

export default function VideoCallStub() {
  return (
    <SafeAreaView className="flex-1 bg-gray-900" edges={['bottom']}>
      <View className="flex-1 items-center justify-center">
        <View className="w-24 h-24 rounded-full bg-brand-700 items-center justify-center mb-6">
          <Video size={48} color="#fff" />
        </View>
        <Text className="text-white text-xl font-semibold">Videoanruf wird vorbereitet …</Text>
        <Text className="text-gray-400 text-sm mt-2 text-center px-8">
          In der Live-Version wird hier eine WebRTC-Verbindung zum Pflegeteam aufgebaut.
        </Text>
      </View>
      <View className="flex-row gap-4 p-6 justify-center">
        <View className="w-14 h-14 rounded-full bg-gray-700 items-center justify-center">
          <Mic size={22} color="#fff" />
        </View>
        <View className="w-14 h-14 rounded-full bg-gray-700 items-center justify-center">
          <Video size={22} color="#fff" />
        </View>
      </View>
      <View className="p-6">
        <Button
          label="Auflegen"
          variant="danger"
          icon={<PhoneOff size={18} color="#fff" />}
          onPress={() => router.back()}
          fullWidth
          size="lg"
        />
      </View>
    </SafeAreaView>
  );
}
