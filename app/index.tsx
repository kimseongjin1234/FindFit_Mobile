import React from 'react';
import { SafeAreaView, View, Text, Pressable, StyleSheet, StatusBar } from 'react-native';
import { router } from 'expo-router';

const COLORS = {
  bg: '#E8EEFF',
  card: '#FFFFFF',
  primary: '#4264D0',
  primaryDark: '#27449F',
  mint: '#7DC8B1',
  text: '#22325E',
  subtext: '#6A7AA5',
  border: '#D8E1FA',
  navy: '#51648B',
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

function RulerGraphic() {
  return (
    <View style={styles.measureArea}>
      <View style={styles.rulerBody}>
        {Array.from({ length: 19 }).map((_, i) => (
          <View
            key={i}
            style={[
              styles.tick,
              i % 5 === 0 ? styles.tickLong : i % 2 === 0 ? styles.tickMid : styles.tickShort,
              { top: 16 + i * 18 },
            ]}
          />
        ))}
        {['3', '4', '5', '6', '7', '8'].map((n, i) => (
          <Text key={n} style={[styles.rulerNumber, { top: 8 + i * 56 }]}>
            {n}
          </Text>
        ))}
      </View>

      <View style={styles.fingerWrap}>
        <View style={styles.fingerPalm} />
        <View style={styles.fingerIndex}>
          <View style={styles.nail} />
          <View style={[styles.knuckle, { top: 74 }]} />
          <View style={[styles.knuckle, { top: 122 }]} />
        </View>
        <View style={styles.thumb} />
        <View style={[styles.curledFinger, { left: 40, height: 92 }]} />
        <View style={[styles.curledFinger, { left: 72, height: 84 }]} />
      </View>
    </View>
  );
}

export default function HomeScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <Text style={styles.pageTitle}>FindFit 측정 방법</Text>
      <PhoneFrame>
        <View style={styles.headerBar}>
          <Text style={styles.time}>9:41</Text>
          <View style={styles.topIcons}>
            <View style={styles.signal} />
            <View style={styles.wifi} />
            <View style={styles.battery} />
          </View>
        </View>

        <View style={styles.innerHeader}>
          <Logo />
        </View>

        <View style={styles.photoCard}>
          <RulerGraphic />
        </View>

        <View style={styles.captionBox}>
          <Text style={styles.captionStrong}>검지를 자로 측정하여 길이를 확인하세요.</Text>
        </View>

        <Pressable style={styles.nextButton} onPress={() => router.push('/measure')}>
          <Text style={styles.nextButtonText}>다음</Text>
          <Text style={styles.arrow}>›</Text>
        </Pressable>

        <Text style={styles.helperText}>화면에 보이는 자를 이용하여 길이를 측정하세요.</Text>
      </PhoneFrame>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.bg,
    alignItems: 'center',
    paddingTop: 18,
  },
  pageTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: COLORS.primary,
    marginBottom: 14,
    letterSpacing: -0.7,
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
  headerBar: {
    height: 34,
    paddingTop: 8,
    paddingHorizontal: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  time: {
    fontSize: 17,
    fontWeight: '700',
    color: '#20253A',
  },
  topIcons: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  signal: {
    width: 14,
    height: 10,
    borderWidth: 2,
    borderColor: '#20253A',
    borderTopLeftRadius: 3,
    borderTopRightRadius: 3,
    borderBottomWidth: 0,
  },
  wifi: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: '#20253A',
    borderTopColor: 'transparent',
    borderLeftColor: 'transparent',
    transform: [{ rotate: '45deg' }],
  },
  battery: {
    width: 22,
    height: 11,
    borderRadius: 3,
    borderWidth: 2,
    borderColor: '#20253A',
  },
  innerHeader: {
    paddingTop: 10,
    paddingBottom: 12,
    alignItems: 'center',
  },
  logo: {
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -1.1,
  },
  photoCard: {
    marginHorizontal: 14,
    height: 402,
    borderTopWidth: 1,
    borderTopColor: '#DCE4FB',
    backgroundColor: COLORS.navy,
    overflow: 'hidden',
  },
  measureArea: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 18,
  },
  rulerBody: {
    width: 58,
    height: 286,
    backgroundColor: '#F3F6FB',
    borderRadius: 4,
    borderWidth: 2,
    borderColor: '#E0E6F1',
    position: 'relative',
  },
  tick: {
    position: 'absolute',
    left: 8,
    height: 2,
    backgroundColor: '#4A5577',
  },
  tickShort: { width: 14 },
  tickMid: { width: 20 },
  tickLong: { width: 28 },
  rulerNumber: {
    position: 'absolute',
    right: 8,
    fontSize: 14,
    fontWeight: '600',
    color: '#586480',
  },
  fingerWrap: {
    width: 132,
    height: 310,
    position: 'relative',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  fingerPalm: {
    position: 'absolute',
    bottom: 0,
    width: 130,
    height: 120,
    backgroundColor: '#F4D6C6',
    borderTopLeftRadius: 46,
    borderTopRightRadius: 46,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 30,
  },
  fingerIndex: {
    position: 'absolute',
    bottom: 94,
    width: 38,
    height: 188,
    backgroundColor: '#F4D6C6',
    borderRadius: 22,
    alignItems: 'center',
  },
  nail: {
    marginTop: 10,
    width: 23,
    height: 20,
    borderRadius: 8,
    backgroundColor: '#F7E5DC',
  },
  knuckle: {
    position: 'absolute',
    width: 30,
    height: 10,
    borderRadius: 10,
    backgroundColor: '#E3B8A7',
  },
  thumb: {
    position: 'absolute',
    left: 4,
    bottom: 62,
    width: 36,
    height: 82,
    backgroundColor: '#F0CEBF',
    borderRadius: 24,
    transform: [{ rotate: '-28deg' }],
  },
  curledFinger: {
    position: 'absolute',
    bottom: 72,
    width: 24,
    backgroundColor: '#F0CEBF',
    borderRadius: 18,
  },
  captionBox: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 10,
  },
  captionStrong: {
    fontSize: 19,
    lineHeight: 24,
    color: '#40557F',
    fontWeight: '700',
    textAlign: 'center',
  },
  nextButton: {
    marginHorizontal: 18,
    height: 58,
    borderRadius: 14,
    backgroundColor: COLORS.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '800',
  },
  arrow: {
    color: 'white',
    fontSize: 28,
    lineHeight: 30,
    marginTop: -2,
  },
  helperText: {
    marginTop: 10,
    fontSize: 13.5,
    color: '#9AA8CC',
    textAlign: 'center',
  },
});
