import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { COLORS, formatCalibrationLabel, getApiBase, getDpPerCm } from './lib';

function RulerDemo() {
  const dpPerCm = getDpPerCm();
  const wholeCm = 9;

  return (
    <View style={styles.rulerCard}>
      <View style={styles.rulerHeader}>
        <Text style={styles.rulerTitle}>화면에 손가락을 직접 대고 길이를 확인하세요</Text>
        <Text style={styles.rulerSubtitle}>0cm부터 시작하는 실측 자로 검지 길이를 재서 아래에 입력합니다.</Text>
      </View>

      <View style={styles.rulerStage}>
        <View style={styles.sideLabels}>
          {Array.from({ length: wholeCm + 1 }).map((_, i) => (
            <Text key={`left-${i}`} style={[styles.sideLabel, { top: wholeCm * dpPerCm - i * dpPerCm - 9 }]}>{i}cm</Text>
          ))}
        </View>

        <View style={[styles.centerRuler, { height: wholeCm * dpPerCm + 2 }]}> 
          {Array.from({ length: wholeCm * 10 + 1 }).map((_, i) => {
            const isCm = i % 10 === 0;
            const isHalf = i % 5 === 0;
            const bottom = i * (dpPerCm / 10);
            return (
              <View
                key={i}
                style={[
                  styles.rulerTick,
                  {
                    bottom,
                    width: isCm ? 36 : isHalf ? 24 : 14,
                    backgroundColor: isCm ? '#475982' : '#7684A8'
                  }
                ]}
              />
            );
          })}
        </View>

        <View style={styles.sideLabels}>
          {Array.from({ length: wholeCm + 1 }).map((_, i) => (
            <Text key={`right-${i}`} style={[styles.sideLabel, { top: wholeCm * dpPerCm - i * dpPerCm - 9 }]}>{i}cm</Text>
          ))}
        </View>
      </View>

      <View style={styles.scaleInfoRow}>
        <View style={styles.infoPill}><Text style={styles.infoPillText}>{formatCalibrationLabel()}</Text></View>
        <View style={styles.infoPill}><Text style={styles.infoPillText}>1mm 보조 눈금 포함</Text></View>
      </View>
    </View>
  );
}

export default function HomeScreen() {
  const [fingerCm, setFingerCm] = useState('7.1');
  const apiBase = useMemo(() => getApiBase(), []);

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
      subtitle="검지 실측값을 기준으로 전신 사진 속 비율을 보정합니다. 손가락 도형 대신 실제 자 중심 화면으로 정리하고, API 주소도 로컬이 아닌 배포 서버 기준으로 연결되도록 구성했습니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <StepBadge step="STEP 1" label="검지 기준값 입력" />

        <RulerDemo />

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
          <Text style={styles.bulletTitle}>연결 정보</Text>
          <Text style={styles.bullet}>• API 기본 주소: {apiBase}</Text>
          <Text style={styles.bullet}>• 환경변수 `EXPO_PUBLIC_API_BASE_URL` 설정 시 자동으로 해당 주소를 우선 사용</Text>
          <Text style={styles.bullet}>• 결과 화면에서는 선택한 핏과 착장 부피감에 따라 추천 카드가 함께 바뀝니다</Text>
        </View>
      </ScrollView>

      <Pressable style={[styles.nextButton, !valid && styles.nextDisabled]} onPress={next}>
        <Text style={styles.nextText}>촬영 가이드로 이동</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  rulerCard: { backgroundColor: COLORS.soft, borderRadius: 22, borderWidth: 1, borderColor: COLORS.line, padding: 16, marginBottom: 16 },
  rulerHeader: { marginBottom: 14 },
  rulerTitle: { color: COLORS.text, fontWeight: '900', fontSize: 16, marginBottom: 4 },
  rulerSubtitle: { color: COLORS.subtext, fontWeight: '700', lineHeight: 19 },
  rulerStage: { flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', paddingVertical: 8 },
  sideLabels: { width: 56, position: 'relative' },
  sideLabel: { position: 'absolute', color: COLORS.text, fontWeight: '800', fontSize: 13 },
  centerRuler: { width: 48, borderRadius: 24, backgroundColor: '#EFF4FF', borderWidth: 1, borderColor: '#D9E3FB', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  rulerTick: { position: 'absolute', height: 2.4, borderRadius: 999 },
  scaleInfoRow: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 },
  infoPill: { backgroundColor: '#FFFFFF', borderRadius: 999, borderWidth: 1, borderColor: COLORS.line, paddingHorizontal: 10, paddingVertical: 7, marginRight: 8, marginTop: 8 },
  infoPillText: { color: COLORS.subtext, fontWeight: '800', fontSize: 11.5 },
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
