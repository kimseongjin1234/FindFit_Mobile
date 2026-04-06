import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { COLORS, formatCalibrationLabel, getDpPerCm } from './lib';

function FingerDemo() {
  const dpPerCm = getDpPerCm();
  return (
    <View style={styles.figureCard}>
      <View style={styles.rulerWrap}>
        <View style={styles.rulerBody}>
          {Array.from({ length: 8 }).map((_, i) => (
            <View key={i} style={[styles.cmBand, { height: dpPerCm }]}> 
              <Text style={styles.cmNumber}>{i + 1}</Text>
              <View style={styles.tickStack}>
                <View style={[styles.tick, { width: 24 }]} />
                <View style={[styles.tick, { width: 12 }]} />
              </View>
            </View>
          ))}
        </View>
        <Text style={styles.rulerCaption}>실측 자</Text>
      </View>

      <View style={styles.fingerDemoWrap}>
        <View style={styles.fingerPhotoCard}>
          <View style={styles.handPalm} />
          <View style={styles.handFinger} />
          <View style={styles.nail} />
          <View style={styles.fingerLengthTag}><Text style={styles.fingerLengthTagText}>검지 길이 기준</Text></View>
          <Text style={styles.fingerHint}>손가락 끝부터 손바닥 시작점까지를 재주세요.</Text>
        </View>
        <Text style={styles.calibrationLabel}>{formatCalibrationLabel()}</Text>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [fingerCm, setFingerCm] = useState('7.1');

  const valid = useMemo(() => {
    const n = Number(fingerCm);
    return Number.isFinite(n) && n >= 5 && n <= 9.5;
  }, [fingerCm]);

  const next = () => {
    if (!valid) {
      Alert.alert('입력 확인', '검지 길이는 5.0cm ~ 9.5cm 범위로 입력해 주세요.');
      return;
    }
    router.push({ pathname: '/capture', params: { fingerCm } });
  };

  return (
    <AppShell
      title="사이즈 측정 시작"
      subtitle="검지 실측값을 기준으로 전신 사진 속 비율을 보정합니다. 실제 기기 화면 밀도를 반영한 실측 자 UI를 넣어 발표 때 더 서비스답게 보이도록 다듬었습니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <StepBadge step="STEP 1" label="검지 기준값 입력" />

        <FingerDemo />

        <Text style={styles.label}>검지 길이 (cm)</Text>
        <TextInput
          value={fingerCm}
          onChangeText={setFingerCm}
          keyboardType="decimal-pad"
          placeholder="예: 7.1"
          placeholderTextColor="#94A1C8"
          style={styles.input}
        />
        <Text style={styles.help}>입력한 값은 관절 포인트 간 픽셀 거리를 실제 cm로 환산할 때 기준 길이로 사용됩니다.</Text>

        <View style={styles.bulletBox}>
          <Text style={styles.bulletTitle}>발표용 데모 포인트</Text>
          <Text style={styles.bullet}>• 기기 화면 밀도 기준으로 1cm 단위를 나눈 실측 자 UI 제공</Text>
          <Text style={styles.bullet}>• 촬영 단계에서 현재 착장 부피감 선택 후 결과 매칭에 반영</Text>
          <Text style={styles.bullet}>• 결과 화면에서 부위별 치수와 추천 상품을 한 흐름으로 확인</Text>
        </View>
      </ScrollView>

      <Pressable style={[styles.nextButton, !valid && styles.nextDisabled]} onPress={next}>
        <Text style={styles.nextText}>촬영 가이드로 이동</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  figureCard: { flexDirection: 'row', backgroundColor: COLORS.soft, borderRadius: 22, borderWidth: 1, borderColor: COLORS.line, padding: 16, marginBottom: 16 },
  rulerWrap: { width: 82, alignItems: 'center' },
  rulerBody: { width: 62, borderRadius: 18, backgroundColor: '#F1E4B0', paddingVertical: 8, paddingHorizontal: 10, borderWidth: 1, borderColor: '#E2D4A0' },
  cmBand: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  cmNumber: { color: '#6E5C26', fontSize: 11, fontWeight: '800' },
  tickStack: { alignItems: 'flex-end' },
  tick: { height: 2, borderRadius: 2, backgroundColor: '#6E5C26', marginVertical: 2 },
  rulerCaption: { marginTop: 8, color: COLORS.subtext, fontSize: 11, fontWeight: '700' },
  fingerDemoWrap: { flex: 1, marginLeft: 14 },
  fingerPhotoCard: { height: 300, borderRadius: 22, backgroundColor: '#F3F6FF', borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden', alignItems: 'center', justifyContent: 'center' },
  handPalm: { position: 'absolute', bottom: 34, width: 160, height: 110, borderRadius: 40, backgroundColor: '#F2C4AF' },
  handFinger: { position: 'absolute', bottom: 108, width: 50, height: 158, borderRadius: 28, backgroundColor: '#F5CAB3' },
  nail: { position: 'absolute', top: 36, width: 36, height: 24, borderRadius: 16, backgroundColor: '#F9E8E1' },
  fingerLengthTag: { position: 'absolute', top: 122, backgroundColor: 'rgba(16,32,72,0.92)', paddingHorizontal: 14, paddingVertical: 8, borderRadius: 999 },
  fingerLengthTagText: { color: 'white', fontWeight: '900', fontSize: 12 },
  fingerHint: { position: 'absolute', bottom: 14, left: 14, right: 14, color: COLORS.subtext, textAlign: 'center', fontWeight: '700', lineHeight: 18 },
  calibrationLabel: { marginTop: 8, color: COLORS.primary, fontSize: 11.5, fontWeight: '800', textAlign: 'center' },
  label: { color: COLORS.text, fontWeight: '800', fontSize: 16, marginBottom: 8 },
  input: { height: 54, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', paddingHorizontal: 16, fontSize: 17, color: COLORS.text, fontWeight: '700' },
  help: { color: COLORS.subtext, marginTop: 8, fontSize: 13, lineHeight: 18, marginBottom: 16 },
  bulletBox: { borderRadius: 18, padding: 14, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line },
  bulletTitle: { color: COLORS.text, fontWeight: '900', marginBottom: 8 },
  bullet: { color: COLORS.subtext, fontWeight: '700', lineHeight: 20, marginBottom: 4 },
  nextButton: { marginTop: 14, height: 56, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  nextDisabled: { opacity: 0.55 },
  nextText: { color: 'white', fontWeight: '900', fontSize: 17 }
});
