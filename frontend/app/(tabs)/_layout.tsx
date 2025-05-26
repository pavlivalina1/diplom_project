import { Tabs } from 'expo-router';
import FontAwesome from '@expo/vector-icons/FontAwesome';

export default function Layout() {
  return (
    <Tabs  screenOptions={{ tabBarActiveTintColor: '#c2a87a', tabBarShowLabel: false }} >
      <Tabs.Screen name="HomeSCreen"  options={{
          tabBarIcon: ({ color }) => <FontAwesome size={30} name="home" color={color}/>, headerShown: false }}/>
      <Tabs.Screen name="ClassificationResultScreen"  options={{ headerShown: false,  href: null, }}/>
      <Tabs.Screen name="HistoryScreen"  options={{ headerShown: false, tabBarIcon: ({ color }) => <FontAwesome size={30} name="history" color={color}/> }}/>
      <Tabs.Screen name="InfoScreen"  options={{ headerShown: false, tabBarIcon: ({ color }) => <FontAwesome size={30} name="info" color={color}/> }}/>
    </Tabs>
  );
}
