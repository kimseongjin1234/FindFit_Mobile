import React, { useEffect, useMemo, useState } from 'react';
import { SafeAreaView, StyleSheet, Text, View, Pressable } from 'react-native';
import { router, usePathname } from 'expo-router';
import { COLORS, getSavedMeasurements, getSavedUser } from '../app/lib';

const TABS = [
  { key: 'home', label: '홈', route: '/', icon: '⌂' },
  { key: 'history', label: '기록', route: '/history', icon: '◫' },
  { key: 'search', label: '검색', route: '/search', icon: '⌕' },
  { key: 'account', label: '계정', route: '/account', icon: '◌' },
];

export function AppShell({ title, subtitle, children, footer }) {
  const pathname = usePathname();
  const [user, setUser] = useState(null);
  const [recordCount, setRecordCount] = useState(0);

  useEffect(() => {
    Promise.all([getSavedUser(), getSavedMeasurements()])
      .then(([savedUser, rows]) => {
        setUser(savedUser);
        setRecordCount(rows.length);
      })
      .catch(() => {
        setUser(null);
        setRecordCount(0);
      });
  }, [pathname]);

  const summaryText = useMemo(() => {
    if (!user) return '로그인 후 결과 저장';
    if (!recordCount) return `${user.name} 님, 첫 측정을 시작해보세요`;
    return `${user.name} 님 · 저장 ${recordCount}건`;
  }, [user, recordCount]);

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.headerShell}>
        <View>
          <Text style={styles.logo}>
            <Text style={{ color: COLORS.primary }}>Find</Text>
            <Text style={{ color: COLORS.mint }}>Fit</Text>
          </Text>
          <Text style={styles.summaryText}>{summaryText}</Text>
        </View>

        <Pressable
          style={styles.headerBadge}
          onPress={() => router.push(user ? '/account' : '/login')}
        >
          <Text style={styles.headerBadgeText}>{user ? '내 계정' : '로그인'}</Text>
        </Pressable>
      </View>

      <View style={styles.card}>
        <View style={styles.titleWrap}>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>

        <View style={styles.content}>{children}</View>

        {footer ? <View style={styles.footerWrap}>{footer}</View> : null}
      </View>

      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const active = pathname === tab.route;
          const isWide = tab.key === 'history' || tab.key === 'search';

          return (
            <Pressable
              key={tab.key}
              style={[styles.tabButton, isWide && styles.tabButtonWide]}
              onPress={() => router.replace(tab.route)}
            >
              <View
                style={[
                  styles.tabIconWrap,
                  isWide && styles.tabIconWrapWide,
                  active && styles.tabIconWrapActive,
                ]}
              >
                <Text
                  style={[
                    styles.tabIcon,
                    isWide && styles.tabIconWide,
                    active && styles.tabIconActive,
                  ]}
                >
                  {tab.icon}
                </Text>
              </View>

              <Text
                style={[
                  styles.tabLabel,
                  isWide && styles.tabLabelWide,
                  active && styles.tabLabelActive,
                ]}
              >
                {tab.label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

export function StepBadge({ step, label }) {
  return (
    <View style={styles.stepRow}>
      <View style={styles.stepPill}>
        <Text style={styles.stepText}>{step}</Text>
      </View>
      <Text style={styles.stepLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#EEF3FF',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 14,
  },
  headerShell: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 6,
    marginBottom: 10,
  },
  logo: {
    fontSize: 31,
    fontWeight: '900',
    letterSpacing: -1.1,
  },
  summaryText: {
    color: COLORS.subtext,
    fontSize: 12.5,
    fontWeight: '700',
    marginTop: 1,
  },
  headerBadge: {
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: '#FFFFFF',
    borderRadius: 999,
    borderWidth: 1,
    borderColor: COLORS.line,
  },
  headerBadgeText: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 12.5,
  },
  card: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 28,
    borderWidth: 1,
    borderColor: COLORS.line,
    overflow: 'hidden',
  },
  titleWrap: {
    paddingHorizontal: 18,
    paddingTop: 18,
    paddingBottom: 6,
  },
  title: {
    color: COLORS.text,
    fontSize: 28,
    fontWeight: '900',
    letterSpacing: -0.7,
  },
  subtitle: {
    color: COLORS.subtext,
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  content: {
    flex: 1,
    paddingHorizontal: 18,
    paddingBottom: 8,
  },
  footerWrap: {
    paddingHorizontal: 18,
    paddingBottom: 18,
  },
  tabBar: {
    marginTop: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: COLORS.line,
    paddingHorizontal: 8,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tabButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
  },
  tabButtonWide: {
    paddingVertical: 7,
  },
  tabIconWrap: {
    width: 52,
    height: 42,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabIconWrapWide: {
    width: 58,
    height: 46,
    borderRadius: 17,
  },
  tabIconWrapActive: {
    backgroundColor: COLORS.primarySoft,
  },
  tabIcon: {
    fontSize: 22,
    color: COLORS.subtext,
    fontWeight: '800',
  },
  tabIconWide: {
    fontSize: 25,
  },
  tabIconActive: {
    color: COLORS.primary,
  },
  tabLabel: {
    marginTop: 5,
    color: COLORS.subtext,
    fontSize: 12.5,
    fontWeight: '800',
  },
  tabLabelWide: {
    fontSize: 13.5,
  },
  tabLabelActive: {
    color: COLORS.primary,
  },
  stepRow: {
    marginBottom: 14,
  },
  stepPill: {
    alignSelf: 'flex-start',
    backgroundColor: COLORS.primarySoft,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 7,
    marginBottom: 8,
  },
  stepText: {
    color: COLORS.primary,
    fontWeight: '800',
    fontSize: 12,
  },
  stepLabel: {
    color: COLORS.text,
    fontWeight: '800',
    fontSize: 17,
  },
});