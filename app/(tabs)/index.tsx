import React, { useState } from "react";
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import LinearGradient from "react-native-linear-gradient";
import DescribeModal from "@/components/describeModal";
import UploadModal from "@/components/uploadModal";

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const [freeGenerates, setFreeGenerates] = useState(5);

  return (
    <LinearGradient
      colors={["#CA080C", "#5B0000"]}
      style={styles.gradient}
      angle={0}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? "light-content" : "dark-content"}
          backgroundColor="#000000"
        />
        <View style={styles.header}>
          <Text style={styles.logoText}>Roast Master</Text>
        </View>
        {freeGenerates <= 0 ? (
          <View style={{ marginBottom: 10 }}>
            <Text style={{ fontSize: 15, color: "white" }}>
              Please buy tokens to generate more roasts.
            </Text>
          </View>
        ) : null}
        <View style={styles.cardContainer}>
          <UploadModal
            freeGenerates={freeGenerates}
            setFreeGenerates={setFreeGenerates}
          />
          <DescribeModal
            freeGenerates={freeGenerates}
            setFreeGenerates={setFreeGenerates}
          />
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
  },
  header: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 5,
  },
  logoText: {
    fontSize: 28,
    fontWeight: "800",
    color: "white",
    textAlign: "center",
    textTransform: "uppercase",
  },
  cardContainer: {
    flex: 6,
    flexDirection: "column",
    justifyContent: "space-around",
    marginVertical: 0,
  },
  card: {
    flex: 1,
    backgroundColor: "#1C1C1E",
    borderRadius: 15,
    width: "100%",
    justifyContent: "center",
    marginVertical: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
  },
  resultContainer: {
    flex: 4,
    padding: 20,
    backgroundColor: "#1C1C1E",
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roastText: {
    color: "#fff",
    fontSize: 16,
    marginBottom: 10,
  },
  freeGeneratesText: {
    color: "#fff",
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 50,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    padding: 0,
    width: "100%",
  },
  modalTitle: {
    color: "#fff",
    fontSize: 20,
    marginBottom: 30,
    fontWeight: "bold",
  },
  describeInput: {
    padding: 20,
    height: 200,
    textAlign: "left",
    textAlignVertical: "top",
    borderWidth: 1,
    borderColor: "#fff",
    borderRadius: 10,
    color: "#fff",
  },
  picketContainer: {
    marginVertical: 10,
    borderBottomWidth: 1,
    borderColor: "#fff",
  },
  picker: {
    width: "100%",
    color: "#fff",
    backgroundColor: "#1C1C1E",
  },
});

export default App;
