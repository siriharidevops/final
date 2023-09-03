import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const SetPasswordScreen = ({ route, navigation }) => {
  const { phoneNumber } = route.params;
  const [password, setPassword] = useState('');

  const handleSetPassword = async () => {
    try {
      await axios.post('YOUR_API_ENDPOINT/register', { phoneNumber, password });
      await AsyncStorage.setItem('phoneNumber', phoneNumber);
      navigation.navigate('HomeScreen'); // Navigate to your main app screen
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your request.');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="Set your password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Set Password" onPress={handleSetPassword} />
    </View>
  );
};

export default SetPasswordScreen;
