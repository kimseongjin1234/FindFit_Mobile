import React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet } from 'react-native';
import { router } from 'expo-router';

const COLORS = {
  bg: '#E8EEFF',
  card: '#FFFFFF',
  primary: '#4264D0',
  mint: '#7DC8B1',
  text: '#22325E',
  subtext: '#6A7AA5',
  border: '#D8E1FA',
  photoBg: '#C8D7FB',
  floor: '#7383A9',
  yellow: '#F2D55B',
  cyan: '#72C8EC',
};

function Logo() {
  return (
    <Text style={styles.logo}>
      <Text style={{ color: COLORS.primary }}>Find</Text>
      <Text style={{ color: COLORS.mint }}>Fit</Text>
    </Text>
  );
}

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <View style={styles.phoneShadow}>
      <View style={styles.phoneOuter}>
        <View style={styles.notch} />
        <View style={styles.screen}>{children}</View>
      </View>
    </View>
  );
}

function Dot({ left, top, color = COLORS.yellow }: { left: number; top: number; color?: string }) {
  return <View style={[styles.dot, { left, top, backgroundColor: color }]} />;
}

function GuideFigure() {
  return (
    <View style={styles.photoArea}>
      <View style={styles.guideRect} />
      <View style={styles.guideMidLine} />
      <View style={styles.guideLowerLine} />
      <View style={styles.figure}>
        <View style={styles.hair} />
        <View style={styles.head} />
        <View style={styles.neck} />
        <View style={styles.torso} />
        <View style={[styles.arm, { left: 16, transform: [{ rotate: '10deg' }] }]} />
        <View style={[styles.arm, { right: 16, transform: [{ rotate: '-10deg' }] }]} />
        <View style={[styles.forearm, { left: 8, top: 176, transform: [{ rotate: '4deg' }] }]} />
        <View style={[styles.forearm, { right: 8, top: 176, transform: [{ rotate: '-4deg' }] }]} />
        <View style={styles.waist} />
        <View style={[styles.leg, { left: 58 }]} />
        <View style={[styles.leg, { right: 58 }]} />
        <View style={[styles.shoe, { left: 44 }]} />
        <View style={[styles.shoe, { right: 44 }]} />
        <Dot left={88} top={82} />
        <Dot left={56} top={99} />
        <Dot left={121} top={99} />
        <Dot left={88} top={114} />
        <Dot left={40} top={148} />
        <Dot left={138} top={148} />
        <Dot left={72} top={186} color={COLORS.cyan} />
        <Dot left={106} top={186} color={COLORS.cyan} />
        <Dot left={61} top={282} color={COLORS.cyan} />
        <Dot left={117} top={282} color={COLORS.cyan} />
      </View>
    </View>
  );
}

export default function MeasureScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <PhoneFrame>
        <View style={styles.topRow}>
          <Text style={styles.backArrow}>‹</Text>
          <View style={styles.logoWrap}><Logo /></View>
          <View style={styles.infoCircle}><Text style={styles.infoText}>i</Text></View>
        </View>

        <Text style={styles.screenTitle}>전신촬영 가이드</Text>
        <View style={styles.subtitleBand}>
          <Text style={styles.subtitle}>정면에서 전신이 보이게 촬영해 주세요.</Text>
        </View>

        <GuideFigure />

        <Pressable style={styles.captureButton} onPress={() => router.push('/result')}>
          <View style={styles.captureInner} />
        </Pressable>
      </PhoneFrame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  phoneShadow: {
    shadowColor: '#6E84C7',
    shadowOpacity: 0.26,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  phoneOuter: {
    width: 332,
    height: 676,
    borderRadius: 36,
    backgroundColor: '#111419',
    padding: 6,
  },
  screen: {
    flex: 1,
    borderRadius: 31,
    backgroundColor: '#F8FAFF',
    overflow: 'hidden',
  },
  notch: {
    position: 'absolute',
    top: 8,
    left: '50%',
    marginLeft: -58,
    width: 116,
    height: 22,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: '#111419',
    zIndex: 5,
  },
  topRow: {
    paddingTop: 44,
    paddingHorizontal: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backArrow: {
    color: '#8D97B5',
    fontSize: 34,
    lineHeight: 34,
    width: 28,
  },
  logoWrap: { flex: 1, alignItems: 'center' },
  logo: {
    fontSize: 30,
    fontWeight: '900',
    letterSpacing: -1,
  },
  infoCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoText: { color: 'white', fontWeight: '800' },
  screenTitle: {
    marginTop: 10,
    textAlign: 'center',
    color: COLORS.text,
    fontSize: 21,
    fontWeight: '800',
  },
  subtitleBand: {
    marginTop: 14,
    backgroundColor: '#AABCE9',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  subtitle: {
    color: 'white',
    fontSize: 14.5,
    fontWeight: '600',
    textAlign: 'center',
  },
  photoArea: {
    flex: 1,
    marginHorizontal: 18,
    marginTop: 14,
    marginBottom: 20,
    borderRadius: 24,
    backgroundColor: COLORS.photoBg,
    overflow: 'hidden',
    alignItems: 'center',
  },
  guideRect: {
    position: 'absolute',
    top: 28,
    width: 196,
    height: 404,
    borderColor: 'white',
    borderWidth: 3,
    borderRadius: 8,
  },
  guideMidLine: {
    position: 'absolute',
    top: 208,
    width: 196,
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  guideLowerLine: {
    position: 'absolute',
    top: 338,
    width: 196,
    borderTopWidth: 2,
    borderColor: 'rgba(255,255,255,0.75)',
  },
  figure: {
    position: 'absolute',
    top: 44,
    width: 178,
    height: 434,
    alignItems: 'center',
  },
  hair: {
    position: 'absolute',
    top: 10,
    width: 56,
    height: 28,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    borderBottomLeftRadius: 14,
    borderBottomRightRadius: 14,
    backgroundColor: '#111722',
  },
  head: {
    position: 'absolute',
    top: 24,
    width: 46,
    height: 56,
    borderRadius: 24,
    backgroundColor: '#F2D0BC',
  },
  neck: {
    position: 'absolute',
    top: 74,
    width: 16,
    height: 16,
    backgroundColor: '#F2D0BC',
    borderRadius: 8,
  },
  torso: {
    position: 'absolute',
    top: 84,
    width: 88,
    height: 112,
    borderRadius: 18,
    backgroundColor: '#667B96',
  },
  arm: {
    position: 'absolute',
    top: 96,
    width: 22,
    height: 96,
    borderRadius: 14,
    backgroundColor: '#667B96',
  },
  forearm: {
    position: 'absolute',
    width: 18,
    height: 98,
    borderRadius: 14,
    backgroundColor: '#F2D0BC',
  },
  waist: {
    position: 'absolute',
    top: 188,
    width: 74,
    height: 34,
    borderRadius: 12,
    backgroundColor: '#445E83',
  },
  leg: {
    position: 'absolute',
    top: 214,
    width: 30,
    height: 172,
    borderRadius: 16,
    backgroundColor: '#516E9E',
  },
  shoe: {
    position: 'absolute',
    top: 380,
    width: 38,
    height: 18,
    borderRadius: 10,
    backgroundColor: '#EFF4FB',
  },
  dot: {
    position: 'absolute',
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  captureButton: {
    alignSelf: 'center',
    width: 84,
    height: 84,
    borderRadius: 42,
    borderWidth: 5,
    borderColor: 'white',
    backgroundColor: 'rgba(73,108,205,0.65)',
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  captureInner: {
    width: 62,
    height: 62,
    borderRadius: 31,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
  },
});
