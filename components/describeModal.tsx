import { useEffect, useState } from "react";
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
import { useMutation } from "@tanstack/react-query";
import { getRoastByDesc } from "@/api/getRoastByDesc";

interface DescribeModalProps {
  freeGenerates: number;
  setFreeGenerates: React.Dispatch<React.SetStateAction<number>>;
}

const DescribeModal: React.FC<DescribeModalProps> = ({
  freeGenerates,
  setFreeGenerates,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [description, setDescription] = useState("");
  const [roastLevel, setRoastLevel] = useState(0);
  const [language, setLanguage] = useState("english");
  const [roastResult, setRoastResult] = useState("");
  const {
    data,
    isSuccess,
    isError,
    error,
    isPending,
    mutate: descRostMutate,
  } = useMutation({
    mutationFn: getRoastByDesc,
  });

  const handleGenerateRoast = () => {
    if (!description) {
      alert("Please enter a description");
      return;
    }
    if (description.length < 10) {
      alert("Description should be atleast 10 characters long");
      return;
    }
    if (roastLevel < 0 || roastLevel > 3) {
      alert("Invalid roast level");
      return;
    }
    if (!language) {
      alert("Please select a language");
      return;
    }
    descRostMutate({ description, roastLevel, language });
  };
  const handleCloseModal = () => {
    setIsVisible(false);
    setDescription("");
    setRoastLevel(0);
    setLanguage("english");
    setRoastResult("");
  };
  useEffect(() => {
    if (isSuccess) {
      setRoastResult(data.data.choices[0].message.content);
      setFreeGenerates(freeGenerates - 1);
    }
    if (isError) {
      console.error(error);
      alert(`Error: ${error.message}`);
    }
  }, [isSuccess, isError]);
  return (
    <>
      <Card
        cardText="Describe your roast"
        onPress={() => setIsVisible(true)}
        disabled={freeGenerates <= 0}
      />
      <Modal
        modalTitle="Describe your roast"
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
            {roastResult === "" ? (
              <>
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
                  value={roastResult}
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
export default DescribeModal;
