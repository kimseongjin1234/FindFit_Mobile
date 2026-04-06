import React, { useEffect, useRef, useState } from 'react';
import { Alert, Animated, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { BULK_OPTIONS, COLORS } from './lib';

function GuideBody() {
  const pulse = useRef(new Animated.Value(0.45)).current;

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulse, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(pulse, { toValue: 0.45, duration: 700, useNativeDriver: true })
      ])
    ).start();
  }, [pulse]);

  const points = [
    { top: 30, left: 127 }, { top: 88, left: 127 }, { top: 118, left: 82 }, { top: 118, left: 172 },
    { top: 188, left: 127 }, { top: 250, left: 127 }, { top: 280, left: 96 }, { top: 280, left: 158 },
    { top: 380, left: 96 }, { top: 380, left: 158 }, { top: 452, left: 88 }, { top: 452, left: 166 }
  ];

  return (
    <View style={styles.guideCard}>
      <View style={styles.scanFrame} />
      <Animated.View style={[styles.scanBar, { opacity: pulse }]} />
      <View style={styles.guideHead} />
      <View style={styles.guideTorso} />
      <View style={[styles.guideArm, { left: 74, transform: [{ rotate: '17deg' }] }]} />
      <View style={[styles.guideArm, { right: 74, transform: [{ rotate: '-17deg' }] }]} />
      <View style={[styles.guideLeg, { left: 104 }]} />
      <View style={[styles.guideLeg, { right: 104 }]} />
      {points.map((p, i) => (
        <Animated.View key={i} style={[styles.guidePoint, p, { opacity: pulse }]} />
      ))}
      <View style={styles.cameraHint}><Text style={styles.cameraHintText}>머리부터 발끝까지 프레임 안에 맞춰주세요</Text></View>
    </View>
  );
}

export default function CaptureScreen() {
  const params = useLocalSearchParams();
  const fingerCm = typeof params.fingerCm === 'string' ? params.fingerCm : '7.1';
  const [photoUri, setPhotoUri] = useState(null);
  const [bulk, setBulk] = useState('보통');

  const pickImage = async (fromCamera) => {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permission.granted) {
      Alert.alert('권한 필요', fromCamera ? '카메라 권한을 허용해 주세요.' : '사진 접근 권한을 허용해 주세요.');
      return;
    }

    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ allowsEditing: true, aspect: [3, 4], quality: 0.9 })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, allowsEditing: true, aspect: [3, 4], quality: 0.9 });

    if (!result.canceled && result.assets && result.assets[0]) {
      setPhotoUri(result.assets[0].uri);
    }
  };

  return (
    <AppShell
      title="전신 촬영 가이드"
      subtitle="정면 전신 이미지를 넣으면 다음 단계에서 관절 포인트와 치수 환산이 진행되는 화면으로 이어집니다. 현재 착장 부피감도 함께 선택해 의류 추천 결과에 반영합니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <StepBadge step="STEP 2" label="촬영 또는 이미지 선택" />

        <GuideBody />

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>촬영 팁</Text>
          <Text style={styles.tip}>• 머리부터 발끝까지 한 화면에 모두 들어오게 촬영</Text>
          <Text style={styles.tip}>• 어두운 그림자보다 몸 윤곽이 잘 보이는 배경 권장</Text>
          <Text style={styles.tip}>• 몸이 기울지 않도록 정면 자세를 유지하면 결과가 더 안정적으로 보입니다</Text>
        </View>

        <Text style={styles.sectionLabel}>현재 착장 부피감</Text>
        <View style={styles.bulkRow}>
          {BULK_OPTIONS.map((item) => {
            const selected = bulk === item;
            return (
              <Pressable key={item} style={[styles.bulkChip, selected && styles.bulkChipSelected]} onPress={() => setBulk(item)}>
                <Text style={[styles.bulkChipText, selected && styles.bulkChipTextSelected]}>{item}</Text>
              </Pressable>
            );
          })}
        </View>

        <View style={styles.actionRow}>
          <Pressable style={styles.secondaryButton} onPress={() => pickImage(true)}>
            <Text style={styles.secondaryText}>카메라 촬영</Text>
          </Pressable>
          <Pressable style={styles.primaryButton} onPress={() => pickImage(false)}>
            <Text style={styles.primaryText}>갤러리 선택</Text>
          </Pressable>
        </View>

        <View style={styles.previewCard}>
          {photoUri ? (
            <Image source={{ uri: photoUri }} style={styles.previewImage} resizeMode="cover" />
          ) : (
            <View style={styles.previewEmpty}>
              <Text style={styles.previewEmptyTitle}>선택된 이미지 미리보기</Text>
              <Text style={styles.previewEmptyText}>촬영 또는 갤러리 선택 후 여기에 표시됩니다.</Text>
            </View>
          )}
        </View>
      </ScrollView>

      <Pressable
        style={[styles.nextButton, !photoUri && styles.nextDisabled]}
        onPress={() => photoUri ? router.push({ pathname: '/analyzing', params: { fingerCm, bulk, photoUri } }) : Alert.alert('사진 필요', '촬영 또는 이미지 선택 후 진행해 주세요.')}
      >
        <Text style={styles.nextText}>AI 분석 시작</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  guideCard: { height: 370, borderRadius: 24, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, marginBottom: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  scanFrame: { position: 'absolute', top: 20, bottom: 20, left: 44, right: 44, borderWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(59,100,230,0.35)', borderRadius: 22 },
  scanBar: { position: 'absolute', left: 56, right: 56, top: 150, height: 3, backgroundColor: COLORS.primary },
  guideHead: { position: 'absolute', top: 42, width: 58, height: 58, borderRadius: 29, backgroundColor: '#B9C8ED' },
  guideTorso: { position: 'absolute', top: 108, width: 82, height: 132, borderRadius: 34, backgroundColor: '#C9D6F5' },
  guideArm: { position: 'absolute', top: 154, width: 26, height: 126, borderRadius: 18, backgroundColor: '#D3DDF6' },
  guideLeg: { position: 'absolute', top: 252, width: 30, height: 186, borderRadius: 18, backgroundColor: '#C7D4F3' },
  guidePoint: { position: 'absolute', width: 12, height: 12, borderRadius: 6, backgroundColor: COLORS.mint, borderWidth: 2, borderColor: 'white' },
  cameraHint: { position: 'absolute', bottom: 18, backgroundColor: 'rgba(16,32,72,0.84)', borderRadius: 999, paddingHorizontal: 14, paddingVertical: 8 },
  cameraHintText: { color: 'white', fontWeight: '800', fontSize: 12 },
  tipBox: { borderRadius: 18, padding: 14, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line, marginBottom: 14 },
  tipTitle: { color: COLORS.text, fontWeight: '900', marginBottom: 8 },
  tip: { color: COLORS.subtext, fontWeight: '700', lineHeight: 19, marginBottom: 4 },
  sectionLabel: { color: COLORS.text, fontWeight: '800', fontSize: 16, marginBottom: 8 },
  bulkRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  bulkChip: { flex: 1, height: 46, borderRadius: 14, borderWidth: 1, borderColor: COLORS.line, backgroundColor: '#F8FAFF', alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  bulkChipSelected: { backgroundColor: COLORS.primary, borderColor: COLORS.primary },
  bulkChipText: { color: COLORS.text, fontWeight: '800' },
  bulkChipTextSelected: { color: 'white' },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  secondaryButton: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  secondaryText: { color: COLORS.text, fontWeight: '800' },
  primaryButton: { flex: 1, height: 52, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: 'white', fontWeight: '900' },
  previewCard: { height: 220, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden', backgroundColor: '#F8FAFF' },
  previewImage: { width: '100%', height: '100%' },
  previewEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24 },
  previewEmptyTitle: { color: COLORS.text, fontWeight: '800', marginBottom: 6 },
  previewEmptyText: { color: COLORS.subtext, fontWeight: '700', textAlign: 'center' },
  nextButton: { marginTop: 14, height: 56, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  nextDisabled: { opacity: 0.55 },
  nextText: { color: 'white', fontWeight: '900', fontSize: 17 }
});
