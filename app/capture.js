import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { BULK_OPTIONS, COLORS } from './lib';

function GuideBody() {
  return (
    <View style={styles.guideCard}>
      <View style={styles.guidePhoneFrame}>
        <View style={styles.guideFigureWrap}>
          <View style={styles.figureHead} />
          <View style={styles.figureTorso} />
          <View style={[styles.figureArm, styles.leftArmUpper]} />
          <View style={[styles.figureArm, styles.rightArmUpper]} />
          <View style={[styles.figureArm, styles.leftForearm]} />
          <View style={[styles.figureArm, styles.rightForearm]} />
          <View style={[styles.figurePalm, styles.leftPalm]} />
          <View style={[styles.figurePalm, styles.rightPalm]} />
          <View style={[styles.figureLeg, styles.leftLeg]} />
          <View style={[styles.figureLeg, styles.rightLeg]} />
          <View style={styles.figureFootLeft} />
          <View style={styles.figureFootRight} />
        </View>
        <Text style={styles.guideBigText}>손바닥을 펴고 가이드에 맞춰{`\n`}전신 사진을 찍어주세요!</Text>
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
      subtitle="사람 아이콘 대신 전신 촬영 안내용 실루엣 화면으로 교체했습니다. 촬영 전 현재 착장의 부피감도 함께 선택해 결과 추천에 반영합니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <StepBadge step="STEP 2" label="촬영 또는 이미지 선택" />

        <GuideBody />

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>촬영 팁</Text>
          <Text style={styles.tip}>• 머리부터 발끝까지 한 화면에 모두 들어오게 촬영</Text>
          <Text style={styles.tip}>• 양손은 몸에서 조금 떨어뜨려 윤곽이 잘 보이도록 유지</Text>
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

const styles = StyleSheet.create({
  guideCard: { borderRadius: 24, backgroundColor: '#F7FAFF', borderWidth: 1, borderColor: COLORS.line, marginBottom: 14, padding: 16 },
  guidePhoneFrame: { borderRadius: 26, borderWidth: 2, borderColor: '#D4DDF8', backgroundColor: '#FBFCFF', paddingTop: 18, paddingHorizontal: 20, paddingBottom: 24, alignItems: 'center' },
  guideFigureWrap: { width: 230, height: 430, position: 'relative', marginTop: 8 },
  figureHead: { position: 'absolute', top: 18, left: 91, width: 48, height: 56, borderRadius: 28, backgroundColor: '#5F83B6' },
  figureTorso: { position: 'absolute', top: 78, left: 66, width: 98, height: 170, borderRadius: 46, backgroundColor: '#5F83B6' },
  figureArm: { position: 'absolute', backgroundColor: '#5F83B6', borderRadius: 22 },
  leftArmUpper: { top: 112, left: 34, width: 28, height: 116, transform: [{ rotate: '14deg' }] },
  rightArmUpper: { top: 112, right: 34, width: 28, height: 116, transform: [{ rotate: '-14deg' }] },
  leftForearm: { top: 212, left: 24, width: 26, height: 94, transform: [{ rotate: '16deg' }] },
  rightForearm: { top: 212, right: 24, width: 26, height: 94, transform: [{ rotate: '-16deg' }] },
  figurePalm: { position: 'absolute', width: 36, height: 22, borderRadius: 12, backgroundColor: '#5F83B6' },
  leftPalm: { top: 294, left: 10, transform: [{ rotate: '22deg' }] },
  rightPalm: { top: 294, right: 10, transform: [{ rotate: '-22deg' }] },
  figureLeg: { position: 'absolute', top: 234, width: 34, height: 158, borderRadius: 22, backgroundColor: '#5F83B6' },
  leftLeg: { left: 80 },
  rightLeg: { right: 80 },
  figureFootLeft: { position: 'absolute', left: 68, bottom: 14, width: 44, height: 18, borderRadius: 16, backgroundColor: '#5F83B6', transform: [{ rotate: '8deg' }] },
  figureFootRight: { position: 'absolute', right: 68, bottom: 14, width: 44, height: 18, borderRadius: 16, backgroundColor: '#5F83B6', transform: [{ rotate: '-8deg' }] },
  guideBigText: { marginTop: 14, color: '#111111', fontWeight: '900', fontSize: 22, lineHeight: 31, textAlign: 'center' },
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
