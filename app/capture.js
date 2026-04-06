import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { router, useLocalSearchParams } from 'expo-router';
import { AppShell, StepBadge } from '../components/AppShell';
import { COLORS } from './lib';

function GuideBody() {
  const points = [
    { top: 24, left: 118 }, { top: 74, left: 118 }, { top: 104, left: 72 }, { top: 104, left: 164 },
    { top: 168, left: 118 }, { top: 230, left: 118 }, { top: 256, left: 90 }, { top: 256, left: 146 },
    { top: 356, left: 90 }, { top: 356, left: 146 }, { top: 444, left: 82 }, { top: 444, left: 154 }
  ];
  return (
    <View style={styles.guideCard}>
      <View style={styles.guideHead} />
      <View style={styles.guideTorso} />
      <View style={[styles.guideArm, { left: 64, transform: [{ rotate: '15deg' }] }]} />
      <View style={[styles.guideArm, { right: 64, transform: [{ rotate: '-15deg' }] }]} />
      <View style={[styles.guideLeg, { left: 94 }]} />
      <View style={[styles.guideLeg, { right: 94 }]} />
      <View style={styles.guideBox} />
      {points.map((p, i) => <View key={i} style={[styles.guidePoint, p]} />)}
    </View>
  );
}

export default function CaptureScreen() {
  const params = useLocalSearchParams();
  const fingerCm = typeof params.fingerCm === 'string' ? params.fingerCm : '7.1';
  const fit = typeof params.fit === 'string' ? params.fit : '정핏';
  const [photoUri, setPhotoUri] = useState(null);

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
      subtitle="정면에서 전신이 들어오도록 촬영하거나 이미지를 선택하면, 다음 단계에서 AI 관절 인식과 치수 추정이 진행되는 듯한 데모를 보여줍니다."
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 10 }}>
        <StepBadge step="STEP 2" label="촬영 또는 이미지 선택" />

        <GuideBody />

        <View style={styles.tipBox}>
          <Text style={styles.tipTitle}>촬영 팁</Text>
          <Text style={styles.tip}>• 머리부터 발끝까지 한 화면에 들어오게 촬영</Text>
          <Text style={styles.tip}>• 밝은 배경보다 사람 윤곽이 잘 보이는 배경 권장</Text>
          <Text style={styles.tip}>• 몸이 심하게 기울지 않도록 정면 자세 유지</Text>
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
            <View style={styles.previewEmpty}><Text style={styles.previewEmptyText}>선택된 사진이 여기에 표시됩니다.</Text></View>
          )}
        </View>
      </ScrollView>

      <Pressable
        style={[styles.nextButton, !photoUri && styles.nextDisabled]}
        onPress={() => photoUri ? router.push({ pathname: '/analyzing', params: { fingerCm, fit, photoUri } }) : Alert.alert('사진 필요', '촬영 또는 이미지 선택 후 진행해 주세요.')}
      >
        <Text style={styles.nextText}>AI 분석 시작</Text>
      </Pressable>
    </AppShell>
  );
}

const styles = StyleSheet.create({
  guideCard: { height: 310, borderRadius: 22, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line, marginBottom: 14, alignItems: 'center', justifyContent: 'center', overflow: 'hidden' },
  guideHead: { position: 'absolute', top: 18, width: 42, height: 42, borderRadius: 21, backgroundColor: '#B9C8ED' },
  guideTorso: { position: 'absolute', top: 64, width: 62, height: 114, borderRadius: 26, backgroundColor: '#CCD8F3' },
  guideArm: { position: 'absolute', top: 96, width: 18, height: 92, borderRadius: 12, backgroundColor: '#CCD8F3' },
  guideLeg: { position: 'absolute', top: 184, width: 20, height: 140, borderRadius: 12, backgroundColor: '#C4D1F0' },
  guideBox: { position: 'absolute', top: 12, bottom: 12, left: 42, right: 42, borderWidth: 2, borderColor: 'rgba(61,99,221,0.45)', borderRadius: 18, borderStyle: 'dashed' },
  guidePoint: { position: 'absolute', width: 10, height: 10, borderRadius: 5, backgroundColor: COLORS.mint, borderWidth: 2, borderColor: 'white' },
  tipBox: { borderRadius: 18, padding: 14, backgroundColor: COLORS.soft, borderWidth: 1, borderColor: COLORS.line, marginBottom: 14 },
  tipTitle: { color: COLORS.text, fontWeight: '900', marginBottom: 8 },
  tip: { color: COLORS.subtext, fontWeight: '700', lineHeight: 19, marginBottom: 4 },
  actionRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 14 },
  secondaryButton: { flex: 1, height: 52, borderRadius: 16, borderWidth: 1, borderColor: COLORS.line, alignItems: 'center', justifyContent: 'center', marginRight: 8 },
  secondaryText: { color: COLORS.text, fontWeight: '800' },
  primaryButton: { flex: 1, height: 52, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  primaryText: { color: 'white', fontWeight: '900' },
  previewCard: { height: 200, borderRadius: 20, borderWidth: 1, borderColor: COLORS.line, overflow: 'hidden', backgroundColor: '#F8FAFF' },
  previewImage: { width: '100%', height: '100%' },
  previewEmpty: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  previewEmptyText: { color: COLORS.subtext, fontWeight: '700' },
  nextButton: { marginTop: 14, height: 56, borderRadius: 16, backgroundColor: COLORS.primary, alignItems: 'center', justifyContent: 'center' },
  nextDisabled: { opacity: 0.55 },
  nextText: { color: 'white', fontWeight: '900', fontSize: 17 }
});
