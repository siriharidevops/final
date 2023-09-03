import React, {useContext, useState } from 'react';
import { View, TextInput, Button, Alert, Text , StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from './AuthContext';



const RegistrationScreen = ({ route, navigation}) => {

  const authCtx = useContext(AuthContext);
  const { phoneNumber } = route.params;
  const [name, setName] = useState('');
  // const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async() => {
    // Perform registration logic here
    console.log('Name:', name);
    console.log('Phone Number:', phoneNumber);
    console.log('Password:', password);
    console.log('Confirm Password:', confirmPassword);

    // Make API request
    const response = await axios.post('http://192.168.0.106:8000/user/register/', {
      name: name,
      phone_number: phoneNumber,
      password1: password,
      password2: confirmPassword,
    })
    .then(response => {
      console.log('Registration successful');
      authCtx.authenticate(response.data.access,response.data.refresh);
      navigation.navigate('Welcome'); 
      // Handle successful registration
    })
    .catch(error => {
      console.log('Registration failed:', error);
      // Handle registration error
    });
  };

  return (
    <View style={styles.container}>

      <Text> Registration for {phoneNumber}</Text>
      <TextInput
        style={styles.input}
        placeholder="Name"
        onChangeText={(text) => setName(text)}
        value={name}
      />
      
      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <TextInput
        style={styles.input}
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={(text) => setConfirmPassword(text)}
        value={confirmPassword}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default RegistrationScreen;
// const RegistrationScreen = ({ navigation }) => {
//   const [phoneNumber, setPhoneNumber] = useState('');
 

//   const handleRegisterLogin = async () => {
//      console.log("phone nmer",phoneNumber)
//     try {
//       const response = await axios.get(`http://192.168.0.106:8000/user/check-phone/${phoneNumber}/`).catch(err => console.log('Login: ', err));
//       // console.log("phone nmer1",response)
//       if (response.data.exists) {
//         // Phone number exists, navigate to LoginScreen
//         navigation.navigate('LoginScreen', { phoneNumber });
//       } else {
//         // Phone number doesn't exist, navigate to SetPasswordScreen
//         navigation.navigate('SetPasswordScreen', { phoneNumber });
//       }
//     } catch (error) {
//       Alert.alert('Error', 'An error occurred while processing your request.');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={{ fontSize: 24, marginBottom: 20 }}>Get Started</Text>
//       <TextInput
//         placeholder="Mobile Number"
//         style={styles.input}
//         onChangeText={(text) => setPhoneNumber(text)}
//         keyboardType="phone-pad"
//       />
//       <Button title="Continue" onPress={handleRegisterLogin} style={styles.button} />
//     </View>
//   );
// };

// export default RegistrationScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     padding: 20,
//     backgroundColor: '#FFF'
//   },
//   input: {
//     width: '100%',
//     height: 40,
//     borderColor: 'gray',
//     borderWidth: 1,
//     marginBottom: 10,
//     paddingLeft: 10,
//     borderRadius: 10,
//   },
//   button: {
//     backgroundColor: '#007bff', // Set button background color
//     borderRadius: 15, // Set button border radius
//     padding: 10, // Set padding around the button text
//   },
// });