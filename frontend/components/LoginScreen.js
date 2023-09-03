import React, { useContext, useState } from 'react';
import { View, TextInput, Button, Alert, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { AxiosContext } from './AxiosContext';
import { AUTH_URL } from '../constants/constants';

const LoginScreen = ({ route, navigation }) => {
  const axiosContext = useContext(AxiosContext);
  const { phoneNumber } = route.params;
  const [password, setPassword] = useState('');

  const authCtx = useContext(AuthContext);

  const handleLogin = async () => {
    console.log({phoneNumber})
    try {
      // const response = await axios.post(`${AUTH_URL}/login/`, { phone_number: phoneNumber, password:password });
      const response = await axiosContext.publicAxios.post('/login/', { phone_number: phoneNumber, password:password });
      authCtx.authenticate(response.data.access,response.data.refresh);
      axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.access}`;
      console.log(response.data)
      // if (response.data) {
        
      //   navigation.navigate('Welcome'); // Navigate to your main app screen
      // } else {
      //   Alert.alert('Error', 'Invalid credentials.');
      // }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while processing your request.');
    }
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Enter password for {phoneNumber}</Text>
      <TextInput
        placeholder="Enter your password"
        style={{
          width: '80%',
          height: 40,
          borderColor: 'gray',
          borderWidth: 1,
          padding: 10,
          marginBottom: 20,
        }}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

export default LoginScreen;
