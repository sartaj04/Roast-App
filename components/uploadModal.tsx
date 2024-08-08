import { useEffect, useState } from "react";
import Card from "./Card";
import Modal from "./Modal";
import {
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import * as DocumentPicker from "expo-document-picker";
import RNFS from "react-native-fs";
import { getRoastByImage } from "@/api/getRoastByImage";
import { useMutation } from "@tanstack/react-query";

interface UploadModalProps {
  freeGenerates: number;
  setFreeGenerates: React.Dispatch<React.SetStateAction<number>>;
}

const UploadModal: React.FC<UploadModalProps> = ({
  freeGenerates,
  setFreeGenerates,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [roastLevel, setRoastLevel] = useState(0);
  const [language, setLanguage] = useState("english");
  const [image, setImage] = useState("");
  const [roast, setRoast] = useState("");
  const {
    data,
    mutate: imageRoastMutation,
    isPending,
    isSuccess,
    isError,
    error,
  } = useMutation({
    mutationFn: getRoastByImage,
  });
  const pickDocument = async () => {
    try {
      const result: DocumentPicker.DocumentPickerResult =
        await DocumentPicker.getDocumentAsync({
          type: "image/*",
          copyToCacheDirectory: true,
        });

      if (result.canceled === false) {
        //console.log("Document picked:", result);
        RNFS.readFile(result.assets[0].uri, "base64").then((data) => {
          setImage(`data:image/jpeg;base64,${data}`);
          setIsVisible(true);
        });
      } else {
        console.log("Document picking was cancelled.");
      }
    } catch (error) {
      console.error("Error picking document:", error);
    }
  };
  const handleGenerateRoast = () => {
    if (image === "") {
      alert("Please upload an image");
      return;
    }
    imageRoastMutation({ image, roastLevel, language });
  };
  useEffect(() => {
    if (isSuccess) {
      setRoast(data.data.choices[0].message.content);
      setFreeGenerates(freeGenerates - 1);
    }
    if (isError) {
      alert(`Error: ${error.message}`);
    }
  }, [isSuccess, isError]);
  const handleCloseModal = () => {
    setIsVisible(false);
    setRoastLevel(0);
    setLanguage("english");
    setImage("");
    setRoast("");
  };

  return (
    <>
      <Card
        cardText="Upload the photo of person you want to roast"
        onPress={() => pickDocument()}
        disabled={freeGenerates <= 0}
      />
      <Modal
        modalTitle="Upload the photo of person you want to roast"
        isVisible={isVisible}
        onBackdropPress={() => handleCloseModal()}
        isLoading={isPending}
      >
        {isPending ? (
          <Text
            style={{
              flex: 1,
              textAlign: "center",
              textAlignVertical: "center",
              color: "white",
            }}
          >
            Loading...
          </Text>
        ) : (
          <>
            {roast === "" ? (
              <>
                {image === "" ? null : (
                  <Image
                    source={{ uri: image }}
                    style={{
                      width: 200,
                      height: 200,
                      alignSelf: "center",
                    }}
                  />
                )}

                <View style={styles.picketContainer}>
                  <Picker
                    dropdownIconColor={"#fff"}
                    selectedValue={roastLevel}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      setRoastLevel(itemValue)
                    }
                  >
                    <Picker.Item label="Light Tease" value={0} />
                    <Picker.Item label="Good Ribbing" value={1} />
                    <Picker.Item label="Fiery Burn" value={2} />
                    <Picker.Item label="Scorching Hot" value={3} />
                  </Picker>
                </View>
                <View style={styles.picketContainer}>
                  <Picker
                    dropdownIconColor={"#fff"}
                    selectedValue={language}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) =>
                      setLanguage(itemValue)
                    }
                  >
                    <Picker.Item label="English" value="english" />
                    <Picker.Item
                      label="Hindi (Transliteration)"
                      value="hindi-transliteration"
                    />
                    <Picker.Item label="Hindi" value="hindi" />
                    <Picker.Item label="Telugu" value="telugu" />
                    <Picker.Item label="Bengali" value="bengali" />
                    <Picker.Item label="Gujarati" value="gujarati" />
                    <Picker.Item label="Kannada" value="kannada" />
                    <Picker.Item label="Malayalam" value="malayalam" />
                    <Picker.Item label="Marathi" value="marathi" />
                    <Picker.Item label="Punjabi" value="punjabi" />
                    <Picker.Item label="Tamil" value="tamil" />
                    <Picker.Item label="Urdu" value="urdu" />
                    <Picker.Item label="Arabic" value="arabic" />
                    <Picker.Item label="Spanish" value="spanish" />
                    <Picker.Item label="French" value="french" />
                    <Picker.Item label="German" value="german" />
                    <Picker.Item label="Italian" value="italian" />
                    <Picker.Item label="Portuguese" value="portuguese" />
                    <Picker.Item label="Dutch" value="dutch" />
                    <Picker.Item label="Russian" value="russian" />
                    <Picker.Item label="Swedish" value="swedish" />
                    <Picker.Item label="Danish" value="danish" />
                    <Picker.Item label="Norwegian" value="norwegian" />
                    <Picker.Item label="Finnish" value="finnish" />
                    <Picker.Item label="Greek" value="greek" />
                  </Picker>
                </View>
                <TouchableOpacity
                  style={[
                    styles.generateButton,
                    { opacity: freeGenerates <= 0 ? 0.7 : 1 },
                  ]}
                  onPress={() => handleGenerateRoast()}
                  activeOpacity={0.8}
                  disabled={freeGenerates <= 0}
                >
                  <Text style={styles.buttonText}>Generate Roast</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <Text
                  style={{
                    color: "#fff",
                    textAlign: "left",
                    marginBottom: 20,
                    fontSize: 20,
                    fontWeight: "bold",
                  }}
                >
                  Here is your roast!
                </Text>
                <TextInput
                  placeholder="Please wait for your roast!"
                  value={roast}
                  keyboardType="numbers-and-punctuation"
                  multiline
                  style={styles.describeInput}
                  placeholderTextColor={"#fff"}
                  numberOfLines={10}
                />
              </>
            )}
          </>
        )}
      </Modal>
    </>
  );
};
const styles = StyleSheet.create({
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
  generateButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: "white",
    textAlign: "center",
    fontSize: 15,
  },
});
export default UploadModal;
