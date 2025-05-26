import React from 'react';
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity } from 'react-native';
import { useGlobalSearchParams } from 'expo-router'; // Для отримання параметрів з URL
import { useRouter } from 'expo-router'; // Для навігації

export default function ClassificationResult() {
  const { imageUri, resultDisease, resultStage, recommendation } = useGlobalSearchParams<{
    imageUri: string;
    resultDisease: string;
    resultStage: string;
    recommendation: string;
  }>();  // Отримуємо параметри з URL

  const router = useRouter(); // Хук для навігації

  // Логіка для визначення, чи повернувся параметр для захворювання або стадії росту
  const isDiseaseResult = !!resultDisease?.length;
  const result = isDiseaseResult ? resultDisease : resultStage;  // Вибір між захворюванням або стадією росту

  // Функція для повернення на головну сторінку
  const goToHome = () => {
    router.navigate(`./HomeSCreen`); // Це поверне користувача на головну сторінку
  };

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <View style={styles.resultCard}>
        {/* Зображення, вирівняне по центру */}
        <Image source={{ uri: imageUri }} style={styles.imagePreview} />
        
        {/* Текстовий контент, вирівняний по лівому краю */}
        <Text style={styles.resultTitle}>
          {isDiseaseResult ? (resultDisease == 'Здорова рослина' ? 'Вітаємо!' : 'Виявлене захворювання:') : 'Визначена стадія росту:'}
        </Text>
        
        <Text style={styles.resultText}>{result}</Text>
        
        <Text style={styles.recommendation}>Рекомендації:</Text>
        <Text style={styles.text}>{recommendation}</Text>
        {/* <Text style={styles.text}>- Регулярне спостереження за рослинами</Text>
        <Text style={styles.text}>- Збереження оптимальних умов для росту</Text> */}
        
        {/* Кнопка для повернення на головну сторінку */}
        <TouchableOpacity style={styles.button} onPress={goToHome}>
          <Text style={styles.buttonText}>Повернутися на головну</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
  },
  resultCard: {
    marginTop: 20,
    backgroundColor: '#f5edda',
    padding: 10,
    borderRadius: 12,
    width: '100%',
    alignItems: 'center',
    elevation: 4,
  },
  imagePreview: {
    marginTop: 20,
    width: '90%',
    height: 280,
    resizeMode: 'cover',
    borderRadius: 8,
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    textAlign: 'left', // Вирівнюємо текст по лівому краю
    width: '100%', // Задаємо ширину для коректного вирівнювання
    paddingLeft: 10, // Додаємо відступ зліва
  },
  resultText: {
    fontSize: 20,
    marginTop: 10,
    textAlign: 'left', // Вирівнюємо текст по лівому краю
    width: '100%', // Задаємо ширину для коректного вирівнювання
    paddingLeft: 10, // Додаємо відступ зліва
  },
  recommendation: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'left', // Вирівнюємо по лівому краю
    width: '100%',
    paddingLeft: 10,
  },
  text: {
    fontSize: 18,
    marginVertical: 5,
    textAlign: 'left', // Вирівнюємо текст по лівому краю
    width: '100%',
    paddingLeft: 10,
  },
  button: {
    backgroundColor: '#c2a87a',
    padding: 15,
    borderRadius: 8,
    marginVertical: 20,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 18,
  },
});
