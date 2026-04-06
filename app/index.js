import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { router } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { COLORS, formatCalibrationLabel, getDpPerCm, getSavedMeasurements } from './lib';

function RulerDemo() {
  const dpPerCm = getDpPerCm();
  const wholeCm = 9;

  return (
    <View style={styles.rulerCard}>
      <View style={styles.rulerTopRow}>
        <Text style={styles.rulerTitle}>실측 자 기준 입력</Text>
        <View style={styles.pill}><Text style={styles.pillText}>{formatCalibrationLabel()}</Text></View>
      </View>
      <Text style={styles.rulerSubtitle}>화면에 검지를 직접 대고 0cm부터 길이를 확인한 뒤 값을 입력하세요.</Text>

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
                    width: isCm ? 38 : isHalf ? 24 : 14,
                    backgroundColor: isCm ? '#4C628E' : '#8A99B8',
                  },
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
      title="나만의 핏 FindFit"
      subtitle="깔끔한 개인 맞춤형 흐름으로 다시 정리했습니다. 측정 시작 → 사진 촬영 → AI 분석 → 결과 저장 → 날짜별 기록 확인까지 한 화면 구조로 이어집니다."
      footer={
        <Pressable style={[styles.nextButton, !valid && styles.nextDisabled]} onPress={next}>
          <Text style={styles.nextText}>사진 촬영 단계로 이동</Text>
        </Pressable>
      }
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 8 }}>
        <StepBadge step="STEP 1" label="검지 기준값 입력" />

        <View style={styles.heroRow}>
          <View style={styles.heroCard}>
            <Text style={styles.heroMetric}>1</Text>
            <Text style={styles.heroLabel}>실측 자 확인</Text>
            <Text style={styles.heroHelp}>0cm부터 검지 길이를 측정</Text>
          </View>
          <View style={styles.heroCard}>
            <Text style={styles.heroMetric}>2</Text>
            <Text style={styles.heroLabel}>전신 사진 촬영</Text>
            <Text style={styles.heroHelp}>가이드에 맞춰 한 장으로 분석</Text>
          </View>
          <View style={[styles.heroCard, { marginRight: 0 }]}>
            <Text style={styles.heroMetric}>3</Text>
            <Text style={styles.heroLabel}>결과 저장</Text>
            <Text style={styles.heroHelp}>날짜별 기록과 그래프로 확인</Text>
          </View>
        </View>

        <RulerDemo />

        <Text style={styles.label}>검지 길이 (cm)</Text>
        <View style={styles.inputRow}>
          <TextInput
            value={fingerCm}
            onChangeText={setFingerCm}
            keyboardType="decimal-pad"
            placeholder="예: 7.1"
            placeholderTextColor="#94A1C8"
            style={styles.input}
          />
          <View style={styles.cmBox}><Text style={styles.cmText}>cm</Text></View>
        </View>
        <Text style={styles.help}>실측값은 사진 속 신체 비율을 실제 cm로 환산하는 기준 길이로 사용됩니다.</Text>

        <View style={styles.infoGrid}>
          <View style={styles.infoCard}><Text style={styles.infoTitle}>치수 저장</Text><Text style={styles.infoCopy}>로그인 후 결과를 저장하면 기록 화면에 자동 누적됩니다.</Text></View>
          <View style={[styles.infoCard, { marginRight: 0 }]}><Text style={styles.infoTitle}>날짜별 확인</Text><Text style={styles.infoCopy}>최근 기록을 날짜별로 모아 그래프와 리스트로 확인할 수 있습니다.</Text></View>
        </View>
      </ScrollView>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', marginBottom: 16 },
  heroCard: { flex: 1, marginRight: 8, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, borderRadius: 18, padding: 12 },
  heroMetric: { color: COLORS.primary, fontWeight: '900', fontSize: 18 },
  heroLabel: { color: COLORS.text, fontWeight: '900', fontSize: 14, marginTop: 8 },
  heroHelp: { color: COLORS.subtext, fontWeight: '700', lineHeight: 18, marginTop: 6, fontSize: 12.5 },
  rulerCard: { backgroundColor: '#F7FAFF', borderRadius: 22, borderWidth: 1, borderColor: COLORS.line, padding: 16, marginBottom: 16 },
  rulerTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  rulerTitle: { color: COLORS.text, fontWeight: '900', fontSize: 17 },
  pill: { paddingHorizontal: 10, paddingVertical: 6, backgroundColor: '#FFFFFF', borderRadius: 999, borderWidth: 1, borderColor: COLORS.line },
  pillText: { color: COLORS.subtext, fontSize: 11.5, fontWeight: '800' },
  rulerSubtitle: { color: COLORS.subtext, fontWeight: '700', lineHeight: 19, marginBottom: 14 },
  rulerStage: { flexDirection: 'row', justifyContent: 'center', alignItems: 'stretch', paddingVertical: 8 },
  sideLabels: { width: 56, position: 'relative' },
  sideLabel: { position: 'absolute', color: COLORS.text, fontWeight: '800', fontSize: 13 },
  centerRuler: { width: 52, borderRadius: 26, backgroundColor: '#EFF4FF', borderWidth: 1, borderColor: '#D9E3FB', alignItems: 'center', justifyContent: 'center', position: 'relative' },
  rulerTick: { position: 'absolute', height: 2.2, borderRadius: 999 },
  label: { color: COLORS.text, fontWeight: '800', fontSize: 16, marginBottom: 8 },
  inputRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 4 },
  input: { flex: 1, height: 56, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', paddingHorizontal: 16, fontSize: 18, color: COLORS.text, fontWeight: '700' },
  cmBox: { height: 56, paddingHorizontal: 18, justifyContent: 'center' },
  cmText: { color: COLORS.text, fontWeight: '900', fontSize: 20 },
  help: { color: COLORS.subtext, marginTop: 6, fontSize: 13, lineHeight: 18, marginBottom: 16 },
  infoGrid: { flexDirection: 'row' },
  infoCard: { flex: 1, borderRadius: 18, padding: 14, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, marginRight: 8 },
  infoTitle: { color: COLORS.text, fontWeight: '900', marginBottom: 8 },
  infoCopy: { color: COLORS.subtext, fontWeight: '700', lineHeight: 19, fontSize: 12.5 },
  nextButton: { height: 56, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  nextDisabled: { opacity: 0.55 },
  nextText: { color: 'white', fontWeight: '900', fontSize: 17 },
});
