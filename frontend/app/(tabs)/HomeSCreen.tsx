import { useFonts } from "expo-font";
import * as ImagePicker from "expo-image-picker";
import { useRouter } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect, useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ActivityIndicator,
} from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const [diseaseImageUri, setDiseaseImageUri] = useState<string | null>(null); // Для збереження URI зображення для захворювання
  const [growthStageImageUri, setGrowthStageImageUri] = useState<string | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [loaded, error] = useFonts({
    "AmaticSC-Regular": require("../../assets/fonts/AmaticSC-Regular.ttf"),
    "AmaticSC-Bold": require("../../assets/fonts/AmaticSC-Bold.ttf"),
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  const handleImage = async (imageUri: string, type: string) => {
    setIsLoading(true);
    const filename = imageUri.split("/").pop();
    const match = /\.(\w+)$/.exec(filename ?? "");
    const filetype = match ? `image/${match[1]}` : `image`;

    const formData = new FormData();
    formData.append("file", {
      uri: imageUri,
      name: filename,
      type: filetype,
    } as any);

    const endpoint =
      type === "disease"
        ? "http://10.0.2.2:8000/predict/disease"
        : "http://10.0.2.2:8000/predict/growth";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });

      const result = await response.json();

      const encodedURI = encodeURIComponent(imageUri);
      const encodedResult = encodeURIComponent(result.predicted_class);
      const encodedRecommendation = encodeURIComponent(result.recommendation);

      const target = `./ClassificationResultScreen?imageUri=${encodedURI}${
        type === "disease"
          ? `&resultDisease=${encodedResult}&resultStage=`
          : `&resultDisease=&resultStage=${encodedResult}`
      }&recommendation=${encodedRecommendation}`;

      router.navigate(target);
    } catch (error) {
      console.error("❌ Error sending image:", error);
      Alert.alert("Помилка", "Не вдалося з’єднатися з сервером");
    } finally {
      setIsLoading(false);
    }
  };

  // Function to choose between camera and gallery
  const chooseImageSource = (type: string) => {
    Alert.alert(
      "Оберіть джерело зображення",
      "Оберіть, чи хочете зробити фото або вибрати з галереї.",
      [
        {
          text: "Скасувати",
          style: "cancel",
        },
        {
          text: "Зробити фото",
          onPress: () => handleCameraPick(type),
        },
        {
          text: "Вибрати з галереї",
          onPress: () => handleGalleryPick(type),
        },
      ]
    );
  };

  // Function to open the camera
  const handleCameraPick = async (type: string) => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      await handleImage(imageUri, type);
    }
  };

  // Function to pick an image from the gallery
  const handleGalleryPick = async (type: string) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
      base64: true,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      await handleImage(imageUri, type);
    }
  };
  if (isLoading) {
      return (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#c2a87a" />
        </View>
      );
    }

  return (
    <ScrollView contentContainerStyle={styles.scroll}>
      <StatusBar barStyle={"dark-content"} backgroundColor="#fdfaf3" />

      {/* Header */}
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/sunflower.png")} // Додайте логотип соняшника у assets
          style={styles.logo}
        />
        <Text style={styles.title}>SunAI</Text>
      </View>

      {/* Card with buttons */}
      <View style={styles.card}>
        <Text style={styles.cardTitle}>
          Технології, що допомагають зростати 🌱
        </Text>

        {/* Кнопка для відкриття вікна вибору джерела зображення для визначення захворювання */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => chooseImageSource("disease")}
        >
          <Text style={styles.buttonText}>Визначити захворювання</Text>
        </TouchableOpacity>

        {/* Кнопка для відкриття вікна вибору джерела зображення для визначення стадії росту */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => chooseImageSource("growth")}
        >
          <Text style={styles.buttonText}>Визначити стадію росту</Text>
        </TouchableOpacity>
      </View>
      {isLoading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#c2a87a" />
        </View>
      )}

      {/* How it works */}
      <View style={styles.howItWorks}>
        <Text style={styles.text}>
          <Text style={styles.subtitle}>SunAI</Text> – ваш помічник у
          вирощуванні здорового соняшника!
        </Text>
        <Text style={styles.subtitle}>Як це працює?</Text>
        <Text style={styles.text}>1. Оберіть тип аналізу</Text>
        <Text style={styles.text}>
          🔍 Визначення стадії росту — дізнайтеся, на якому етапі розвитку
          знаходиться рослина.
        </Text>
        <Text style={styles.text}>
          🦠 Діагностика захворювань — отримайте аналіз за фото.
        </Text>
        <Text style={styles.text}>2. Зробіть фото або оберіть з галереї</Text>
        <Text style={styles.text}>
          3. Отримайте миттєвий результат прямо на екрані
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scroll: {
    padding: 16,
    alignItems: "center",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 20,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 90,
    height: 90,
    resizeMode: "contain",
    marginRight: 10,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#222",
  },
  card: {
    backgroundColor: "#f5edda",
    padding: 20,
    borderRadius: 12,
    marginTop: 20,
    alignItems: "center",
    elevation: 4,
    width: "100%",
  },
  cardTitle: {
    fontSize: 40,
    marginBottom: 16,
    textAlign: "left",
    fontFamily: "AmaticSC-Bold",
  },
  button: {
    backgroundColor: "#c2a87a",
    paddingVertical: 15,
    paddingHorizontal: 20,
    borderRadius: 8,
    marginVertical: 8,
    width: "90%",
  },
  buttonText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 18,
  },
  imagePreview: {
    marginTop: 20,
    width: 200,
    height: 200,
    resizeMode: "cover",
    borderRadius: 8,
  },
  howItWorks: {
    marginTop: 30,
    width: "100%",
  },
  subtitle: {
    fontSize: 30,
    fontFamily: "AmaticSC-Bold",
    marginBottom: 10,
    paddingHorizontal: 12,
    textAlign: "left",
  },
  text: {
    fontFamily: "AmaticSC-Regular",
    fontSize: 30,
    marginBottom: 6,
    paddingHorizontal: 12,
  },
  loaderContainer: {
    marginTop: 20,
    padding: 10,
  },
  loadingText: {
    fontSize: 18,
    fontStyle: "italic",
    color: "#555",
  },
});
