import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
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
import DocumentPicker from 'react-native-document-picker';
import Modal from 'react-native-modal';
import { Picker } from '@react-native-picker/picker';

import {
  Colors,
} from 'react-native/Libraries/NewAppScreen';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [description, setDescription] = useState('');
  const [roastLevel, setRoastLevel] = useState(0); // Default to "mild"
  const [language, setLanguage] = useState('en'); // Default to English
  const [roastResult, setRoastResult] = useState('');
  const [freeGenerates, setFreeGenerates] = useState(5);
  const [isModalVisible, setIsModalVisible] = useState(false);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
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
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
      });

      const file = {
        uri: res.uri,
        type: res.type,
        name: res.name,
      };

      const formData = new FormData();
      formData.append('file', {
        uri: file.uri,
        type: file.type,
        name: file.name,
      });
      formData.append('roast_level', roastLevel.toString());
      formData.append('language', language);

      const response = await axios.post('http://10.0.2.2:8003/generate-roast', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setRoastResult(response.data.roast);
      setFreeGenerates(freeGenerates - 1);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        console.log('User cancelled the picker');
      } else {
        console.error('Error picking file:', err);
        Alert.alert('Error', 'Something went wrong! Please try again.');
      }
    }
  };

  return (
    <SafeAreaView style={[backgroundStyle, styles.container]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.header}>
        <Text style={styles.logoText}>RoastGPT</Text>
        <TouchableOpacity style={styles.icon}>
          <Text style={styles.iconText}>Icon</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.cardContainer}>
        <TouchableOpacity style={styles.card} onPress={handleFilePicker}>
          <Text style={styles.cardText}>Upload Image</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.card} onPress={() => setIsModalVisible(true)}>
          <Text style={styles.cardText}>Describe a person to roast</Text>
        </TouchableOpacity>
      </View>
      {roastResult ? (
        <View style={styles.resultContainer}>
          <Text style={styles.roastText}>{roastResult}</Text>
          <Text style={styles.freeGeneratesText}>Free Generates Left: {freeGenerates}</Text>
        </View>
      ) : null}
      <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRoast}>
        <Text style={styles.buttonText}>Generate Response</Text>
      </TouchableOpacity>

      <Modal isVisible={isModalVisible}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Describe a person to roast</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter description"
            value={description}
            onChangeText={setDescription}
          />
          <Picker
            selectedValue={roastLevel}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setRoastLevel(itemValue)}
          >
            <Picker.Item label="Light Tease" value={0} />
            <Picker.Item label="Good Ribbing" value={1} />
            <Picker.Item label="Fiery Burn" value={2} />
            <Picker.Item label="Scorching Hot" value={3} />
          </Picker>
          <Picker
            selectedValue={language}
            style={styles.picker}
            onValueChange={(itemValue, itemIndex) => setLanguage(itemValue)}
          >
            <Picker.Item label="English" value="en" />
            <Picker.Item label="Hindi (Transliteration)" value="hi-translit" />
            <Picker.Item label="Urdu" value="ur" />
            <Picker.Item label="Telugu" value="te" />
            <Picker.Item label="Spanish" value="es" />
          </Picker>
          <TouchableOpacity style={styles.generateButton} onPress={handleGenerateRoast}>
            <Text style={styles.buttonText}>Generate Roast</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={() => setIsModalVisible(false)}>
            <Text style={styles.buttonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
    backgroundColor: '#141414',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  logoText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  icon: {
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    color: '#fff',
  },
  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
  },
  card: {
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    width: '45%',
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardText: {
    color: '#fff',
    textAlign: 'center',
  },
  resultContainer: {
    padding: 20,
    backgroundColor: '#1c1c1c',
    borderRadius: 10,
    marginVertical: 20,
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
    marginVertical: 10,
  },
  cancelButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalContent: {
    backgroundColor: '#1c1c1c',
    padding: 20,
    borderRadius: 10,
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 8,
    marginBottom: 16,
    color: '#fff',
    width: '100%',
  },
  picker: {
    height: 50,
    width: '100%',
    color: '#fff',
    backgroundColor: '#1c1c1c',
    marginBottom: 16,
  },
});

export default App;
