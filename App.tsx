import * as React from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts } from 'expo-font';
// deep imports: the package root would bundle every weight (~60MB) instead of just these five
import { ShipporiMincho_500Medium } from '@expo-google-fonts/shippori-mincho/500Medium';
import { ShipporiMincho_700Bold } from '@expo-google-fonts/shippori-mincho/700Bold';
import { ZenKakuGothicNew_400Regular } from '@expo-google-fonts/zen-kaku-gothic-new/400Regular';
import { ZenKakuGothicNew_500Medium } from '@expo-google-fonts/zen-kaku-gothic-new/500Medium';
import { ZenKakuGothicNew_700Bold } from '@expo-google-fonts/zen-kaku-gothic-new/700Bold';
import { FadeIn } from './src/components/FadeIn';
import { TabBar, type TabKey } from './src/components/TabBar';
import { CompareScreen } from './src/screens/CompareScreen';
import { DashboardScreen } from './src/screens/DashboardScreen';
import { ListScreen, type ListFilter } from './src/screens/ListScreen';
import { SettingsScreen } from './src/screens/SettingsScreen';
import { WelcomeScreen } from './src/screens/WelcomeScreen';
import { useHydrated, useStore } from './src/store';
import { colors } from './src/theme';

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    ShipporiMincho_500Medium,
    ShipporiMincho_700Bold,
    ZenKakuGothicNew_400Regular,
    ZenKakuGothicNew_500Medium,
    ZenKakuGothicNew_700Bold,
  });
  const hydrated = useHydrated();
  const hasData = useStore((s) => s.snapshots.length > 0);
  const [tab, setTab] = React.useState<TabKey>('home');
  const [filter, setFilter] = React.useState<ListFilter>('notFollowingBack');

  // Never wait forever: after 6 seconds we open the app anyway (system font / empty data).
  const [gaveUp, setGaveUp] = React.useState(false);
  React.useEffect(() => {
    const t = setTimeout(() => setGaveUp(true), 6000);
    return () => clearTimeout(t);
  }, []);

  // wait for fonts and for saved data, so the user never sees the Welcome screen flash on launch
  const ready = (fontsLoaded || !!fontError || gaveUp) && (hydrated || gaveUp);
  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={colors.shu} />
        <Text style={styles.status}>
          fonts: {fontsLoaded ? 'ok' : fontError ? 'error' : 'loading'}  ·  saved data: {hydrated ? 'ok' : 'loading'}
        </Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      {!hasData ? (
        <WelcomeScreen />
      ) : (
        <View style={styles.root}>
          {/* key={tab} remounts the wrapper, so every tab change plays the fade-in */}
          <FadeIn key={tab} style={styles.body}>
            {tab === 'home' && (
              <DashboardScreen
                onOpenList={(f) => {
                  setFilter(f);
                  setTab('list');
                }}
              />
            )}
            {tab === 'list' && <ListScreen filter={filter} onFilterChange={setFilter} />}
            {tab === 'compare' && <CompareScreen />}
            {tab === 'settings' && <SettingsScreen />}
          </FadeIn>
          <TabBar active={tab} onChange={setTab} />
        </View>
      )}
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.sumi },
  body: { flex: 1 },
  loading: { flex: 1, backgroundColor: colors.sumi, alignItems: 'center', justifyContent: 'center' },
  status: { color: colors.washi3, fontSize: 12, marginTop: 16 },
});
