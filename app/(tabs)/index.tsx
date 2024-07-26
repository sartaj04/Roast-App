import React, { useState } from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  useColorScheme,
} from 'react-native';
import axios from 'axios';
import DocumentPicker, { pick } from 'react-native-document-picker';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';
import LinearGradient from 'react-native-linear-gradient';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [description, setDescription] = useState('');
  const [roastLevel, setRoastLevel] = useState(0); // Default to "mild"
  const [language, setLanguage] = useState('en'); // Default to English
  const [roastResult, setRoastResult] = useState('');
  const [freeGenerates, setFreeGenerates] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isImageModalVisible, setIsImageModalVisible] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);

  const backgroundStyle = {
    backgroundColor: '#2C2C2E',
  };

  const handleGenerateRoast = async () => {
    if (freeGenerates <= 0) {
      Alert.alert('Limit Reached', 'You have used all your free generates.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('description', description);
      formData.append('roast_level', roastLevel.toString());
      formData.append('language', language);

      const response = await axios.post('http://10.0.2.2:8003/generate-roast', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRoastResult(response.data.roast);
      setFreeGenerates(freeGenerates - 1);
      setIsModalVisible(false); // Close the modal after generating the roast
    } catch (error) {
      console.error('Error generating roast:', error);
      Alert.alert('Error', 'Something went wrong! Please try again.');
    }
  };

  const handleFilePicker = async () => {
    if (freeGenerates <= 0) {
      Alert.alert('Limit Reached', 'You have used all your free generates.');
      return;
    }

    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.images],
      });

      setSelectedFile(res[0]);
      setIsImageModalVisible(true);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error picking file:', err);
        Alert.alert('Error', 'Something went wrong! Please try again.');
      }
    }
  };

  const handleGenerateRoastFromImage = async () => {
    if (freeGenerates <= 0) {
      Alert.alert('Limit Reached', 'You have used all your free generates.');
      return;
    }

    if (!selectedFile) {
      Alert.alert('No File Selected', 'Please select a file first.');
      return;
    }

    try {
      const file = {
        uri: selectedFile.uri,
        type: selectedFile.type,
        name: selectedFile.name,
      };

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
      formData.append('roast_level', roastLevel.toString());
      formData.append('language', language);

      const response = await axios.post('http://10.0.2.2:8003/generate-roast-from-image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRoastResult(response.data.roast);
      setFreeGenerates(freeGenerates - 1);
      setIsImageModalVisible(false); // Close the modal after generating the roast
    } catch (err) {
      console.error('Error generating roast from image:', err);
      Alert.alert('Error', 'Something went wrong! Please try again.');
    }
  };

  return (
    <LinearGradient
      colors={['#a10303', '#4a0404']}
      style={styles.gradient}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      angle={90}
    >
      <SafeAreaView style={styles.container}>
        <StatusBar
          barStyle={isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="#000000"
        />
        <View style={styles.header}>
          <Text style={styles.logoText}>Roast Master</Text>
        </View>
        <View style={styles.cardContainer}>
          <TouchableOpacity style={styles.card} onPress={handleFilePicker} activeOpacity={0.7}>
            <Text style={styles.cardText}>Upload Image</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.card} onPress={() => setIsModalVisible(true)} activeOpacity={0.7}>
            <Text style={styles.cardText}>Describe a person to roast</Text>
          </TouchableOpacity>
        </View>
        {roastResult ? (
          <View style={styles.resultContainer}>
            <Text style={styles.roastText}>{roastResult}</Text>
            <Text style={styles.freeGeneratesText}>Free Generates Left: {freeGenerates}</Text>
          </View>
        ) : null}

        <Modal isVisible={isModalVisible} swipeDirection={"down"} coverScreen collapsable onBackdropPress={()=>setIsModalVisible(false)} style={styles.modalContainer}
          presentationStyle='overFullScreen'>
           <View style={styles.modalContent}>
           <Text style={styles.modalTitle}>Describe a person to roast</Text>
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
             <Picker.Item label="Hindi (Transliteration)" value="hindi-transliteration" />
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
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRoast}>
              <Text style={styles.buttonText}>Generate Roast</Text>
            </TouchableOpacity>
            </View>
           
          
        </Modal>

        <Modal isVisible={isImageModalVisible} swipeDirection={"up"} coverScreen collapsable onBackdropPress={()=>setIsImageModalVisible(false)} style={styles.modalContainer}
          presentationStyle='overFullScreen' onSwipeComplete={()=>setIsImageModalVisible(false)}>
            <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Upload an image to roast</Text>
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
              <Picker.Item label="Hindi (Transliteration)" value="hindi-transliteration" />
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
            <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRoastFromImage}>
              <Text style={styles.buttonText}>Generate Roast</Text>
            </TouchableOpacity>
            
            </View>
          
        </Modal>
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
    justifyContent: 'center',
    padding: 20,
    
  },
  header: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logoText: {
    fontSize: 28,
    fontWeight: '800',
    color: 'white',
    textAlign: 'center',
    textTransform: 'uppercase',
  },
  cardContainer: {
    flex: 6,
    flexDirection: 'column',
    justifyContent: 'space-around',
    marginVertical: 0,
  },
  card: {
    flex: 1,
    backgroundColor: '#1C1C1E',
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    marginVertical: 10,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardText: {
    color: '#fff',
    fontSize: 18,
    textAlign: 'center',
  },
  resultContainer: {
    flex: 4,
    padding: 20,
    backgroundColor: '#1C1C1E',
    borderRadius: 10,
    marginVertical: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  roastText: {
    color: '#fff',
    fontSize: 16,
    marginBottom: 10,
  },
  freeGeneratesText: {
    color: '#fff',
    fontSize: 14,
  },
  generateButton: {
    backgroundColor: '#007BFF',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical:50,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    margin: 0,
    padding: 0,
    width: "100%",
  },
  modalContent:{
    width: "100%",
    flex: 0.875,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: '#1C1C1E',
    padding: 20, 
    paddingTop: 50,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 20,
    marginBottom:30,
    fontWeight: 'bold',
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
    width: '100%',
    color: '#fff',
    backgroundColor: '#1C1C1E',
    
  },
});

export default App;
