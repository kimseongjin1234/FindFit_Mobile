import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { COLORS, FIT_OPTIONS } from './lib';

export default function HomeScreen() {
  const [fingerCm, setFingerCm] = useState('7.1');
  const [fit, setFit] = useState('정핏');

  const valid = useMemo(() => {
    const n = Number(fingerCm);
    return Number.isFinite(n) && n >= 5 && n <= 9.5;
  }, [fingerCm]);

  const next = () => {
    if (!valid) {
      Alert.alert('입력 확인', '검지 길이는 5.0cm ~ 9.5cm 범위로 입력해 주세요.');
      return;
    }
    router.push({ pathname: '/capture', params: { fingerCm, fit } });
  };

  return (
    <AppShell
      title="사이즈 측정 시작"
      subtitle="검지 실측값을 기준 값으로 사용하고, 촬영 이미지를 바탕으로 체형 분석 데모를 진행합니다. Android 빌드에서 무리 없이 돌도록 기본 구성은 최대한 단순하게 잡았습니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <StepBadge step="STEP 1" label="검지 기준값 입력" />

        <View style={styles.figureCard}>
          <View style={styles.ruler}>
            {Array.from({ length: 11 }).map((_, i) => <View key={i} style={[styles.tick, { top: i * 24 + 10, width: i % 5 === 0 ? 24 : 14 }]} />)}
          </View>
          <View style={styles.fingerWrap}>
            <View style={styles.fingerPalm} />
            <View style={styles.finger} />
            <View style={styles.captionBubble}><Text style={styles.captionBubbleText}>검지 길이 실측</Text></View>
          </View>
        </View>

        <Text style={styles.label}>검지 길이 (cm)</Text>
        <TextInput
          value={fingerCm}
          onChangeText={setFingerCm}
          keyboardType="decimal-pad"
          placeholder="예: 7.1"
          placeholderTextColor="#94A1C8"
          style={styles.input}
        />
        <Text style={styles.help}>실제 실측값을 입력하면 이후 단계에서 치수 환산 기준으로 사용됩니다.</Text>

        <Text style={[styles.label, { marginTop: 16 }]}>선호 핏</Text>
        <View style={styles.fitRow}>
          {FIT_OPTIONS.map((option) => {
            const selected = fit === option;
            return (
              <Pressable key={option} onPress={() => setFit(option)} style={[styles.fitChip, selected && styles.fitChipSelected]}>
                <Text style={[styles.fitChipText, selected && styles.fitChipTextSelected]}>{option}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.bulletBox}>
          <Text style={styles.bulletTitle}>발표용 데모 포인트</Text>
          <Text style={styles.bullet}>• 사진 업로드 후 AI가 몸 구조를 인식하는 듯한 단계별 화면 제공</Text>
          <Text style={styles.bullet}>• 검지 길이를 기준으로 신체 치수를 환산한 듯한 결과 카드 표시</Text>
          <Text style={styles.bullet}>• 의류 사이트 매칭 느낌의 추천 리스트 출력</Text>
        </View>
      </ScrollView>

      <Pressable style={[styles.nextButton, !valid && styles.nextDisabled]} onPress={next}>
        <Text style={styles.nextText}>촬영 가이드로 이동</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  figureCard: { flexDirection: 'row', backgroundColor: COLORS.soft, borderRadius: 22, borderWidth: 1, borderColor: COLORS.line, padding: 18, marginBottom: 16, alignItems: 'center', justifyContent: 'space-between' },
  ruler: { width: 46, height: 260, borderRadius: 14, backgroundColor: '#F1E4B0', position: 'relative', justifyContent: 'center' },
  tick: { position: 'absolute', right: 8, height: 2, backgroundColor: '#6E5C26' },
  fingerWrap: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  fingerPalm: { width: 120, height: 110, borderRadius: 28, backgroundColor: '#F8C6AF' },
  finger: { position: 'absolute', top: 12, width: 34, height: 170, borderRadius: 22, backgroundColor: '#F6B89C' },
  captionBubble: { position: 'absolute', bottom: 10, backgroundColor: '#132451', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 999 },
  captionBubbleText: { color: 'white', fontWeight: '800', fontSize: 12 },
  label: { color: COLORS.text, fontWeight: '800', fontSize: 16, marginBottom: 8 },
  input: { height: 54, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', paddingHorizontal: 16, fontSize: 17, color: COLORS.text, fontWeight: '700' },
  help: { color: COLORS.subtext, marginTop: 8, fontSize: 13, lineHeight: 18 },
  fitRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 },
  fitChip: { flex: 1, height: 46, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  fitChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  fitChipText: { color: COLORS.text, fontWeight: '800' },
  fitChipTextSelected: { color: 'white' },
  bulletBox: { borderRadius: 18, padding: 14, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line },
  bulletTitle: { color: COLORS.text, fontWeight: '900', marginBottom: 8 },
  bullet: { color: COLORS.subtext, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  nextButton: { marginTop: 14, height: 56, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  nextDisabled: { opacity: 0.55 },
  nextText: { color: 'white', fontWeight: '900', fontSize: 17 }
});
