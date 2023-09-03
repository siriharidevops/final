import React, { useEffect, useContext, useState } from 'react';
import { StyleSheet, View, TextInput, Button, Alert, Text, TouchableOpacity  } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { AuthContext } from './AuthContext';
import { AxiosContext } from './AxiosContext';

const Profile = ({ route, navigation }) => {

  const authCtx = useContext(AuthContext);
  const axiosContext = useContext(AxiosContext);
  const [refresh, setRefresh] = useState(false);
  const [userDetails, setUserDetails ] = useState(null);

  const fetchData = async () => {
    try {
      
      const response = await axiosContext.authAxios.get('/details/',{headers: {
        Authorization: `Bearer ${authCtx.access}`,
        'Content-Type': 'application/json',
      },})
      // console.log(response)
      setUserDetails(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    

    fetchData();
    
  }, []);

  // const handleDetail = async () => {
  //   try {
  //     // const response = await axios.get('http://192.168.0.106:8000/user/details/');
  //     const response = await axiosContext.authAxios.get('/details/')
  //     console.log(response)
  //     if (response.data) {
        
  //       navigation.navigate('Welcome'); // Navigate to your main app screen
  //     } else {
  //       Alert.alert('Error', 'Invalid credentials.');
  //     }
  //   } catch (error) {
  //     Alert.alert('Error', 'An error occurred while processing your request.');
  //   }
  // };
  const handleRefresh = () => {
    // Set the refresh state variable to trigger the useEffect hook
    setRefresh(!refresh);
  };

  return (
   <View style={styles.container}>
    <TouchableOpacity onPress={handleRefresh}>
    <Button title="Refresh Data" onPress={fetchData} />
      </TouchableOpacity>
         {userDetails && (
           <View>
             <Text>Name: {userDetails.name}</Text>
             <Text>Phone Number: {userDetails.phone_number}</Text>
           </View>
         )}
       </View>
  );
};

const styles = StyleSheet.create({
     container: {
       flex: 1,
       justifyContent: 'center',
       alignItems: 'center',
     },
   });

export default Profile;
