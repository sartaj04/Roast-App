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

const encodeImageToBase64 = async (uri: string): Promise<string> => {
  const response = await fetch(uri);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(",")[1]; // Extract base64 part
      console.log("Base64 Data Preview:", base64Data.slice(0, 50)); // Log first 50 characters
      resolve(base64Data);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === "dark";
  const [roastResult, setRoastResult] = useState("");
  const [freeGenerates, setFreeGenerates] = useState(5);

  // const handleGenerateRoastFromImage = async () => {
  //   if (freeGenerates <= 0) {
  //     Alert.alert("Limit Reached", "You have used all your free generates.");
  //     return;
  //   }

  //   if (!selectedFile) {
  //     Alert.alert("No File Selected", "Please select a file first.");
  //     return;
  //   }

  //   try {
  //     const base64Image = await encodeImageToBase64(selectedFile.uri);
  //     console.log("Base64 Image Length:", base64Image.length);

  //     const roastLevelText = [
  //       "a light tease",
  //       "a good ribbing",
  //       "a fiery burn",
  //       "scorching hot",
  //     ];
  //     const prompt = `Create a fun, sassy roast of 250 characters for this image. Make it ${roastLevelText[roastLevel]}. Write the roast in ${language}.`;

  //     const payload = {
  //       model: "gpt-4o-mini", // Ensure you have access to this model
  //       messages: [
  //         {
  //           role: "user",
  //           content: [
  //             { type: "text", text: prompt },
  //             {
  //               type: "image_url",
  //               image_url: { url: `data:image/jpeg;base64,${base64Image}` },
  //             },
  //           ],
  //         },
  //       ],
  //       max_tokens: 300,
  //       temperature: 0.7,
  //     };

  //     console.log("Payload:", JSON.stringify(payload, null, 2));

  //     const response = await axios.post(
  //       "https://api.openai.com/v1/chat/completions",
  //       payload,
  //       {
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${openAI_APIKey}`,
  //         },
  //       }
  //     );

  //     console.log("Response:", response.data);

  //     const choices = response.data.choices;
  //     if (choices && choices.length > 0) {
  //       setRoastResult(choices[0].message.content.trim());
  //       setFreeGenerates(freeGenerates - 1);
  //       setIsImageModalVisible(false); // Close the modal after generating the roast
  //     } else {
  //       setRoastResult("No response from API.");
  //     }
  //   } catch (err) {
  //     console.error("Error generating roast from image:", err);

  //     if (err.response) {
  //       console.log("Data:", err.response.data);
  //       console.log("Status:", err.response.status);
  //       console.log("Headers:", err.response.headers);
  //       Alert.alert(
  //         "Error",
  //         `API responded with status: ${err.response.status}`
  //       );
  //     } else if (err.request) {
  //       console.log("Request:", err.request);
  //       Alert.alert("Error", "No response from API server.");
  //     } else {
  //       console.log("Error Message:", err.message);
  //       Alert.alert(
  //         "Error",
  //         "Failed to make request. Check console for details."
  //       );
  //     }
  //   }
  // };
  return (
    <LinearGradient
      colors={["#a10303", "#4a0404"]}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      angle={90}
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
        {roastResult ? (
          <View style={styles.resultContainer}>
            <Text style={styles.roastText}>{roastResult}</Text>
            <Text style={styles.freeGeneratesText}>
              Free Generates Left: {freeGenerates}
            </Text>
          </View>
        ) : null}
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
