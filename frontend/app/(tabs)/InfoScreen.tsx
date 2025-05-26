import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  LayoutAnimation,
  Platform,
  UIManager,
  Image,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const AccordionItem = ({ title, icon, children }: any) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };

  return (
    <View style={styles.accordionItem}>
      <TouchableOpacity onPress={toggleExpand} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>
          {icon} {title}
        </Text>
        <FontAwesome
          name={expanded ? "chevron-up" : "chevron-down"}
          size={20}
          color="#333"
        />
      </TouchableOpacity>
      {expanded && <View style={styles.accordionContent}>{children}</View>}
    </View>
  );
};

export default function AboutSunflowerScreen() {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Image
          source={require("../../assets/images/sunflower.png")}
          style={styles.logo}
        />
        <Text style={styles.title}>SunAI</Text>
      </View>

      <Text style={styles.heading}>ПРО СОНЯШНИК</Text>
      <Text style={styles.description}>
        🌻 <Text style={styles.description}>Соняшник (Helianthus l.)</Text> —
        рід рослин родини айстрових. Містить приблизно 54 види, родом із
        Північної Америки.
      </Text>

      <AccordionItem title="ЦІКАВІ ФАКТИ" icon="💡">
        <Text>
          - Соняшник повертається за сонцем - Це одна з головних олійних культур
        </Text>
      </AccordionItem>

      <AccordionItem title="НАЙПОШИРЕНІШІ ЗАХВОРЮВАННЯ" icon="🌿">
        <Text>
          • Сіра гниль (Botrytis cinerea){"\n"}
          Викликає загнивання кошиків і стебел, особливо в умовах підвищеної
          вологості. Проявляється сірим нальотом і швидким ураженням тканин.
          {"\n\n"}• Несправжня борошниста роса (Plasmopara halstedii){"\n"}
          Поширене грибкове захворювання, що призводить до хлорозу, відставання
          в рості, деформації листків та зрештою – загибелі рослини.{"\n\n"}•
          Біла гниль (Sclerotinia sclerotiorum){"\n"}
          Вражає кореневу шийку, стебло та кошик. Уражені ділянки вкриваються
          білим ватоподібним міцелієм з чорними склероціями.{"\n\n"}• Іржа
          (Puccinia helianthi){"\n"}
          Уражає листки, стебла та черешки. Характеризується появою іржавих
          подушечок зі спорами. Ускладнює фотосинтез та послаблює рослину.
          {"\n\n"}• Фомоз (Phoma macdonaldii){"\n"}
          Проявляється темними плямами на листках та стеблах. На пізніх етапах
          викликає гниль кореня та вилягання рослини.{"\n\n"}• Склеротиніоз
          кошика{"\n"}
          Зовні проявляється у вигляді побуріння, в’янення кошика та утворення
          твердих склероцій усередині. Значно знижує врожайність та якість
          насіння.
        </Text>
      </AccordionItem>

      <AccordionItem title="ПОРАДИ ЩОДО ВИРОЩУВАННЯ" icon="🪴">
        <Text>
          - Сійте на сонячному місці - Регулярно поливайте на ранніх етапах
        </Text>
      </AccordionItem>

      <AccordionItem title="СТАДІЇ РОСТУ" icon="📈">
        <Text>- Від проростання до цвітіння і дозрівання</Text>
      </AccordionItem>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#333",
  },
  menu: {
    marginLeft: "auto",
  },
  heading: {
    fontSize: 40,
    marginBottom: 10,
    textAlign: "center",
    fontFamily: "AmaticSC-Bold",
  },
  description: {
    fontSize: 34,
    marginBottom: 20,
    textAlign: "left",
    color: "#333",
    fontFamily: "AmaticSC-Regular",
  },
  accordionItem: {
    backgroundColor: "#f5edda",
    borderRadius: 10,
    padding: 20,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  accordionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  accordionTitle: {
    fontSize: 28,
    fontFamily: "AmaticSC-Bold",
  },
  accordionContent: {
    marginTop: 10,
  },
});
