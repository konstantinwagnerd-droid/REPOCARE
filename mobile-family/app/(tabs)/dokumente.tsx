import { Alert, FlatList, Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { FileText, Lock, Download } from 'lucide-react-native';
import { Badge } from '@components/ui/Badge';
import { mockDocuments, type FamilyDocument } from '@lib/mock-data';
import { formatDateDe } from '@lib/cn';

const kindLabel: Record<FamilyDocument['kind'], string> = {
  pflegebericht: 'Pflegebericht',
  arztbericht: 'Arztbericht',
  medikamentenplan: 'Medikamentenplan',
  vorsorge: 'Vorsorge / Patientenverfügung',
};

export default function DokumenteScreen() {
  const open = (d: FamilyDocument) => {
    if (d.consentRequired && !d.consentGranted) {
      Alert.alert(
        'Freigabe erforderlich',
        'Für dieses Dokument liegt keine Einwilligung der Bewohner:in vor. Bitte sprechen Sie mit dem Pflegeteam.'
      );
      return;
    }
    Alert.alert('Dokument öffnen', `„${d.title}“ würde jetzt geöffnet (${d.sizeKb} KB).`);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50 dark:bg-gray-950" edges={['top']}>
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">Dokumente</Text>
        <Text className="text-sm text-gray-500 mt-1">
          Einsehbare Berichte (gemäß Consent).
        </Text>
      </View>
      <FlatList
        data={mockDocuments}
        keyExtractor={(d) => d.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16, gap: 10 }}
        renderItem={({ item }) => {
          const blocked = item.consentRequired && !item.consentGranted;
          return (
            <Pressable
              onPress={() => open(item)}
              accessibilityRole="button"
              accessibilityLabel={`${item.title}, ${kindLabel[item.kind]}, ${blocked ? 'gesperrt' : 'verfügbar'}`}
              className="flex-row items-center gap-3 rounded-card bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 p-4 active:opacity-80"
            >
              <View className={`w-10 h-10 rounded-full items-center justify-center ${blocked ? 'bg-gray-100 dark:bg-gray-800' : 'bg-brand-50 dark:bg-brand-800/40'}`}>
                {blocked ? <Lock size={18} color="#9CA3AF" /> : <FileText size={18} color="#0F766E" />}
              </View>
              <View className="flex-1">
                <Text className={`font-semibold ${blocked ? 'text-gray-400' : 'text-gray-900 dark:text-white'}`}>{item.title}</Text>
                <Text className="text-xs text-gray-500">{kindLabel[item.kind]} · {formatDateDe(item.date)} · {item.sizeKb} KB</Text>
              </View>
              {blocked ? <Badge tone="warning">Consent fehlt</Badge> : <Download size={18} color="#9CA3AF" />}
            </Pressable>
          );
        }}
      />
    </SafeAreaView>
  );
}
