import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { ANALYSIS_LINES, COLORS } from './lib';

export default function AnalyzingScreen() {
  const params = useLocalSearchParams();
  const fingerCm = typeof params.fingerCm === 'string' ? params.fingerCm : '7.1';
  const fit = typeof params.fit === 'string' ? params.fit : '정핏';
  const photoUri = typeof params.photoUri === 'string' ? params.photoUri : '';
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(id);
          return 100;
        }
        return Math.min(100, prev + 7);
      });
    }, 220);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    if (progress >= 100) {
      const t = setTimeout(() => {
        router.replace({ pathname: '/result', params: { fingerCm, fit, photoUri } });
      }, 450);
      return () => clearTimeout(t);
    }
  }, [progress, fingerCm, fit, photoUri]);

  const active = useMemo(() => Math.min(ANALYSIS_LINES.length - 1, Math.floor(progress / 22)), [progress]);

  return (
    <AppShell
      title="AI 분석 진행 중"
      subtitle="실제 모델 연동 전 단계의 발표용 프로토타입입니다. 모바일에서는 가볍게 동작하면서도, 관절 인식과 치수 계산이 진행되는 듯한 느낌을 주도록 구성했습니다."
    >
      <StepBadge step="STEP 3" label="관절 인식 및 치수 환산" />

      <View style={styles.viewer}>
        <View style={styles.bodyWrap}>
          <View style={styles.head} />
          <View style={styles.torso} />
          <View style={[styles.arm, { left: 88, transform: [{ rotate: '16deg' }] }]} />
          <View style={[styles.arm, { right: 88, transform: [{ rotate: '-16deg' }] }]} />
          <View style={[styles.leg, { left: 114 }]} />
          <View style={[styles.leg, { right: 114 }]} />
          {POINTS.map((style, idx) => <View key={idx} style={[styles.point, style]} />)}
          {LINES.map((style, idx) => <View key={idx} style={[styles.line, style]} />)}
          <View style={[styles.scanBar, { top: `${Math.max(6, progress * 0.8)}%` }]} />
        </View>
      </View>

      <View style={styles.progressBox}>
        <View style={styles.progressHeader}><Text style={styles.progressLabel}>분석 진행률</Text><Text style={styles.progressValue}>{progress}%</Text></View>
        <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
      </View>

      <View style={styles.lineList}>
        {ANALYSIS_LINES.map((line, idx) => {
          const done = idx < active;
          const current = idx === active;
          return (
            <View key={line} style={styles.lineRow}>
              <View style={[styles.dot, done && styles.dotDone, current && styles.dotCurrent]} />
              <Text style={[styles.lineText, current && styles.lineTextCurrent]}>{line}</Text>
            </View>
          );
        })}
      </View>

      <Pressable style={styles.skipButton} onPress={() => router.replace({ pathname: '/result', params: { fingerCm, fit, photoUri } })}>
        <Text style={styles.skipText}>바로 결과 보기</Text>
      </Pressable>
    </AppShell>
  );
}

const POINTS = [
  { top: 36, left: 146 }, { top: 92, left: 146 }, { top: 126, left: 96 }, { top: 126, left: 196 },
  { top: 178, left: 146 }, { top: 236, left: 146 }, { top: 262, left: 116 }, { top: 262, left: 176 },
  { top: 360, left: 116 }, { top: 360, left: 176 }
];
const LINES = [
  { top: 48, left: 151, width: 2, height: 54 },
  { top: 128, left: 110, width: 84, height: 2 },
  { top: 102, left: 151, width: 2, height: 140 },
  { top: 264, left: 124, width: 50, height: 2 },
  { top: 264, left: 124, width: 2, height: 98 },
  { top: 264, left: 174, width: 2, height: 98 }
];

const styles = StyleSheet.create({
  viewer: { height: 320, borderRadius: 24, backgroundColor: '#F8FAFF', borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  bodyWrap: { width: 300, height: 470, position: 'relative' },
  head: { position: 'absolute', top: 14, left: 124, width: 46, height: 46, borderRadius: 23, backgroundColor: '#BCCBEF' },
  torso: { position: 'absolute', top: 68, left: 118, width: 58, height: 124, borderRadius: 26, backgroundColor: '#D2DCF5' },
  arm: { position: 'absolute', top: 112, width: 18, height: 110, borderRadius: 12, backgroundColor: '#D2DCF5' },
  leg: { position: 'absolute', top: 198, width: 22, height: 190, borderRadius: 14, backgroundColor: '#C8D4F2' },
  point: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.mint, borderWidth: 2, borderColor: 'white' },
  line: { position: 'absolute', backgroundColor: 'rgba(59,100,230,0.45)', borderRadius: 999 },
  scanBar: { position: 'absolute', left: 18, right: 18, height: 3, backgroundColor: COLORS.primary },
  progressBox: { marginTop: 16, borderRadius: 18, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line, padding: 14 },
  progressHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { color: COLORS.text, fontWeight: '800' },
  progressValue: { color: COLORS.primary, fontWeight: '900' },
  track: { height: 10, borderRadius: 999, backgroundColor: '#DCE4FA', overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: COLORS.primary },
  lineList: { marginTop: 16 },
  lineRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  dot: { width: 10, height: 10, borderRadius: 5, backgroundColor: '#CBD5F3', marginRight: 10 },
  dotDone: { backgroundColor: COLORS.success },
  dotCurrent: { width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.primary },
  lineText: { color: COLORS.subtext, fontWeight: '700' },
  lineTextCurrent: { color: COLORS.text },
  skipButton: { marginTop: 'auto', height: 52, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center' },
  skipText: { color: COLORS.text, fontWeight: '800' }
});
