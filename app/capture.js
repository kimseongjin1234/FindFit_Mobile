import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { BULK_OPTIONS, COLORS } from './lib';

function GuideBody() {
  return (
    <View style={styles.guideCard}>
      <View style={styles.referenceStage}>
        <View style={styles.silhouetteWrap}>
          <View style={styles.head} />
          <View style={styles.neck} />
          <View style={styles.shoulderBlock} />
          <View style={styles.torso} />

          <View style={[styles.upperArm, styles.leftUpperArm]} />
          <View style={[styles.upperArm, styles.rightUpperArm]} />
          <View style={[styles.foreArm, styles.leftForeArm]} />
          <View style={[styles.foreArm, styles.rightForeArm]} />

          <View style={[styles.palm, styles.leftPalm]} />
          <View style={[styles.palm, styles.rightPalm]} />
          <View style={[styles.finger, styles.leftFinger1]} />
          <View style={[styles.finger, styles.leftFinger2]} />
          <View style={[styles.finger, styles.leftFinger3]} />
          <View style={[styles.finger, styles.leftFinger4]} />
          <View style={[styles.finger, styles.rightFinger1]} />
          <View style={[styles.finger, styles.rightFinger2]} />
          <View style={[styles.finger, styles.rightFinger3]} />
          <View style={[styles.finger, styles.rightFinger4]} />

          <View style={[styles.hip, styles.leftHip]} />
          <View style={[styles.hip, styles.rightHip]} />
          <View style={[styles.thigh, styles.leftThigh]} />
          <View style={[styles.thigh, styles.rightThigh]} />
          <View style={[styles.calf, styles.leftCalf]} />
          <View style={[styles.calf, styles.rightCalf]} />
          <View style={[styles.foot, styles.leftFoot]} />
          <View style={[styles.foot, styles.rightFoot]} />
        </View>

        <Text style={styles.referenceCaption}>손바닥을 펴고 가이드에 맞춰{`\n`}전신 사진을 찍어주세요!</Text>

        <View style={styles.cameraAction}>
          <View style={styles.cameraOuter}>
            <View style={styles.cameraInner}>
              <View style={styles.cameraTop} />
              <View style={styles.cameraLens} />
            </View>
          </View>
        </View>
      </View>
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
      subtitle="참고 이미지처럼 중앙 전신 실루엣과 하단 촬영 버튼이 보이도록 가이드 영역을 다시 구성했습니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <StepBadge step="STEP 2" label="촬영 또는 이미지 선택" />

        <GuideBody />

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>촬영 팁</Text>
          <Text style={styles.tip}>• 머리부터 발끝까지 한 화면에 모두 들어오게 촬영</Text>
          <Text style={styles.tip}>• 손바닥을 펴고 양팔을 몸에서 조금 떨어뜨려 윤곽이 보이게 유지</Text>
          <Text style={styles.tip}>• 밝은 배경에서 정면 자세를 유지하면 치수 결과가 더 안정적으로 보입니다</Text>
        </View>

        <Text style={styles.sectionLabel}>현재 착장 부피감</Text>
        <View style={styles.bulkRow}>
          {BULK_OPTIONS.map((item, index) => {
            const selected = bulk === item;
            return (
              <Pressable
                key={item}
                style={[styles.bulkChip, selected && styles.bulkChipSelected, index === BULK_OPTIONS.length - 1 && { marginRight: 0 }]}
                onPress={() => setBulk(item)}
              >
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

const SIL = '#5F83B6';

const styles = StyleSheet.create({
  guideCard: { borderRadius: 24, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, marginBottom: 14, padding: 14 },
  referenceStage: { borderRadius: 28, backgroundColor: '#FBFCFF', borderWidth: 1, borderColor: '#D8E2F7', paddingTop: 18, paddingBottom: 16, alignItems: 'center' },
  silhouetteWrap: { width: 240, height: 470, position: 'relative' },
  head: { position: 'absolute', top: 10, left: 95, width: 50, height: 60, borderRadius: 28, backgroundColor: SIL },
  neck: { position: 'absolute', top: 62, left: 110, width: 20, height: 18, borderRadius: 8, backgroundColor: SIL },
  shoulderBlock: { position: 'absolute', top: 78, left: 60, width: 120, height: 40, borderRadius: 24, backgroundColor: SIL },
  torso: { position: 'absolute', top: 100, left: 72, width: 96, height: 180, borderTopLeftRadius: 46, borderTopRightRadius: 46, borderBottomLeftRadius: 28, borderBottomRightRadius: 28, backgroundColor: SIL },
  upperArm: { position: 'absolute', width: 28, height: 112, borderRadius: 16, backgroundColor: SIL },
  leftUpperArm: { top: 120, left: 32, transform: [{ rotate: '14deg' }] },
  rightUpperArm: { top: 120, right: 32, transform: [{ rotate: '-14deg' }] },
  foreArm: { position: 'absolute', width: 28, height: 108, borderRadius: 16, backgroundColor: SIL },
  leftForeArm: { top: 215, left: 18, transform: [{ rotate: '14deg' }] },
  rightForeArm: { top: 215, right: 18, transform: [{ rotate: '-14deg' }] },
  palm: { position: 'absolute', width: 22, height: 44, borderRadius: 11, backgroundColor: SIL },
  leftPalm: { top: 312, left: 6, transform: [{ rotate: '6deg' }] },
  rightPalm: { top: 312, right: 6, transform: [{ rotate: '-6deg' }] },
  finger: { position: 'absolute', width: 5, height: 30, borderRadius: 3, backgroundColor: SIL },
  leftFinger1: { top: 324, left: 0, transform: [{ rotate: '20deg' }] },
  leftFinger2: { top: 328, left: 8, transform: [{ rotate: '9deg' }] },
  leftFinger3: { top: 330, left: 15 },
  leftFinger4: { top: 330, left: 22, transform: [{ rotate: '-8deg' }] },
  rightFinger1: { top: 324, right: 0, transform: [{ rotate: '-20deg' }] },
  rightFinger2: { top: 328, right: 8, transform: [{ rotate: '-9deg' }] },
  rightFinger3: { top: 330, right: 15 },
  rightFinger4: { top: 330, right: 22, transform: [{ rotate: '8deg' }] },
  hip: { position: 'absolute', top: 260, width: 34, height: 48, borderRadius: 18, backgroundColor: SIL },
  leftHip: { left: 84 },
  rightHip: { right: 84 },
  thigh: { position: 'absolute', top: 298, width: 34, height: 108, borderRadius: 18, backgroundColor: SIL },
  leftThigh: { left: 82 },
  rightThigh: { right: 82 },
  calf: { position: 'absolute', top: 390, width: 32, height: 98, borderRadius: 18, backgroundColor: SIL },
  leftCalf: { left: 83 },
  rightCalf: { right: 83 },
  foot: { position: 'absolute', bottom: 4, width: 42, height: 18, borderRadius: 14, backgroundColor: SIL },
  leftFoot: { left: 68, transform: [{ rotate: '8deg' }] },
  rightFoot: { right: 68, transform: [{ rotate: '-8deg' }] },
  referenceCaption: { marginTop: 8, color: '#111111', fontWeight: '900', fontSize: 20, lineHeight: 29, textAlign: 'center', letterSpacing: -0.6 },
  cameraAction: { marginTop: 14, alignItems: 'center', justifyContent: 'center' },
  cameraOuter: { width: 88, height: 88, borderRadius: 44, borderWidth: 5, borderColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  cameraInner: { width: 46, height: 36, borderRadius: 10, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  cameraTop: { position: 'absolute', top: -6, left: 10, width: 12, height: 6, borderTopLeftRadius: 4, borderTopRightRadius: 4, backgroundColor: COLORS.primary },
  cameraLens: { width: 18, height: 18, borderRadius: 9, borderWidth: 3, borderColor: 'white' },
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
