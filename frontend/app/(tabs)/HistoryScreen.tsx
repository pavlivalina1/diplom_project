import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';

interface HistoryItem {
  id: number;
  type: string;
  class_name: string;
  recommendations: string;
  image_base64: string;
}

export default function HistoryScreen() {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [loading, setLoading] = useState(true); // для спінера при першому заході
  const [refreshing, setRefreshing] = useState(false); // для pull-to-refresh

  const fetchHistory = async () => {
    try {
      const res = await fetch("http://10.0.2.2:8000/history/");
      const data = await res.json();
      setHistory(data.reverse());
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  // ✅ Автоматичне оновлення при першому заході
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await fetchHistory();
      setLoading(false);
    };
    loadData();
  }, []);

  // ✅ Pull-to-refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchHistory();
    setRefreshing(false);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c2a87a" />
      </View>
    );
  }

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {history.map((item) => (
        <View key={item.id} style={styles.card}>
          <Image
            source={{ uri: `data:image/jpeg;base64,${item.image_base64}` }}
            style={styles.image}
          />
          <Text style={styles.label}>
            {item.type === 'disease'
              ? item.class_name === 'Здорова рослина'
                ? 'Вітаємо!'
                : 'Виявлене захворювання:'
              : 'Визначена стадія росту:'}
          </Text>
          <Text style={styles.text}>{item.class_name}</Text>

          <Text style={styles.label}>Рекомендації:</Text>
          <Text style={styles.text}>{item.recommendations}</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    alignItems: 'center',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  card: {
    marginTop: 20,
    backgroundColor: '#f5edda',
    padding: 10,
    paddingBottom: 20,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },
  image: {
    marginTop: 20,
    width: '90%',
    height: 280,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 10,
  },
  text: {
    fontSize: 20,
    marginTop: 10,
    textAlign: 'left',
    width: '100%',
    paddingLeft: 10,
  },
});
