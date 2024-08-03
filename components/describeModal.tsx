import { useState } from "react";
import Modal from "./Modal";
import { Picker } from "@react-native-picker/picker";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Card from "./Card";

const DescribeModal: React.FC = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [roastLevel, setRoastLevel] = useState(0);
  const [language, setLanguage] = useState("english");

  const handleGenerateRoast = () => {
    console.log("Generating roast...");
    console.log(
      "Description:",
      description,
      " Roast level:",
      roastLevel,
      "Language:",
      language
    );
  };
  return (
    <>
      <Card cardText="Describe your roast" onPress={() => setIsVisible(true)} />
      <Modal
        modalTitle="Describe your roast"
        isVisible={isVisible}
        onBackdropPress={() => setIsVisible(false)}
      >
        <TextInput
          placeholder="Enter a detailed description of the person"
          value={description}
          onChangeText={(text) => setDescription(text)}
          keyboardType="numbers-and-punctuation"
          multiline
          style={styles.describeInput}
          placeholderTextColor={"#fff"}
          numberOfLines={10}
        />
        <View style={styles.picketContainer}>
          <Picker
            dropdownIconColor={"#fff"}
            selectedValue={roastLevel}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setRoastLevel(itemValue)}
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
            onValueChange={(itemValue, itemIndex) => setLanguage(itemValue)}
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
          style={styles.generateButton}
          onPress={() => handleGenerateRoast()}
          activeOpacity={0.8}
        >
          <Text style={styles.buttonText}>Generate Roast</Text>
        </TouchableOpacity>
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
export default DescribeModal;
