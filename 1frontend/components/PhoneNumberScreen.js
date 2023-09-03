// PhoneNumberScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button,  Text , StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AUTH_URL } from '../constants/constants';

const PhoneNumberScreen = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');

  const handleNext = async () => {
    try {
      const response = await axios.get(`${AUTH_URL}/check-phone/${phoneNumber}/`);
      if (response) {
        navigation.navigate('LoginScreen', { phoneNumber });
      } else {
        navigation.navigate('RegistrationScreen', { phoneNumber });
      }
    } catch (error) {
      if (error.response && error.response.status === 404) {
        navigation.navigate('RegistrationScreen', { phoneNumber });
      } else {
        console.log('Error:', error.message);
      }  
    }
  };

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Get Started</Text>
      <TextInput
        placeholder="Mobile Number"
        style={styles.input}
        onChangeText={(text) => setPhoneNumber(text)}
        keyboardType="phone-pad"
      />
      <Button title="Continue" onPress={handleNext} style={styles.button} />
    </View>
  );
};

export default PhoneNumberScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFF'
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 10,
  },
  button: {
    backgroundColor: '#007bff', // Set button background color
    borderRadius: 15, // Set button border radius
    padding: 10, // Set padding around the button text
  },
});