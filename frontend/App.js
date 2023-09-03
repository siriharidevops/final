import React, { useContext, useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import RegistrationScreen from './components/RegistrationScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoginScreen from './components/LoginScreen';
import WelcomeScreen from './components/WelcomeScreen';
import Profile from './components/Profile';
import PhoneNumberScreen from './components/PhoneNumberScreen';
import AppLoading from 'expo-app-loading';
import { Colors } from './constants/styles';
import SetPasswordScreen from './components/SetPasswordScreen';
import { View, StyleSheet } from 'react-native';
import { AuthProvider, AuthContext } from './components/AuthContext';
import IconButton from './components/ui/IconButton';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import BottomTabNavigation from './components/BottomTabNavigation';
import { AxiosProvider } from './components/AxiosContext';



const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  
  


  // function Root(){

  //   const { user, isLoading } = useContext(AuthContext);
 
  // // if (isLoading) {
  // //   console.log("sssssssss",user)
  // //   return null; // Add a loading screen if needed
  // // }


  //   <NavigationContainer>
  //     <Stack.Navigator initialRouteName="RegistrationScreen">
        
  //       {user ? (
  //         <Stack.Screen name="HomeScreen" component={HomeScreen} options={{ title: 'Home' }} />

  //       ): (
  //         <>
  //           <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} options={{ title: 'Registration' }} />
  //          <Stack.Screen name="SetPasswordScreen" component={SetPasswordScreen} options={{ title: 'Set Password' }} />
  //          <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
  //         </>
  //       )}
  //     </Stack.Navigator>
  //   </NavigationContainer>

  // }



  function TabScreens() {
    const authCtx = useContext(AuthContext);
    return (
      <Tab.Navigator>
        <Tab.Screen
          name="Welcome"
          component={WelcomeScreen}
          
        />
        <Tab.Screen
          name="Profile"
          component={Profile}
          options={{
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person" color={color} size={size} />
            ),
            
          }}
        />
      </Tab.Navigator>
    );
  }

  function AuthStack() {
    const authCtx = useContext(AuthContext);
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: Colors.primary100 },
        }}
      >
        {/* <Stack.Screen name="LoginScreen" component={LoginScreen} /> */}
        
        <Stack.Screen name="PhoneNumberScreen" component={PhoneNumberScreen} />
        <Stack.Screen name="RegistrationScreen" component={RegistrationScreen} />
        <Stack.Screen name="LoginScreen" component={LoginScreen} options={{ title: 'Login' }} />
        
          
      </Stack.Navigator>
    );
  }
  
  function AuthenticatedStack() {
    const authCtx = useContext(AuthContext);
    return (
      <Stack.Navigator
        screenOptions={{
          headerStyle: { backgroundColor: Colors.primary500 },
          headerTintColor: 'white',
          contentStyle: { backgroundColor: Colors.primary100 },
        }}
      >
        
        <Stack.Screen name="Main" component={TabScreens} options={{
            headerRight: ({ tintColor }) => (
              <IconButton
                icon="exit"
                color={tintColor}
                size={24}
                onPress={authCtx.logout}
              />
            ),
          }}/> 
        {/* <Stack.Screen 
            name='Bottom Navigation'
            component={BottomTabNavigation}
            // options={{headerShown:false}}
          /> */}
        
        {/* <Stack.Screen name="Main" component={TabScreens} /> */}
        
      </Stack.Navigator>
    );
  }

  function Navigation() {
    const authCtx = useContext(AuthContext);
  
    return (
      <NavigationContainer>
        
         {!authCtx.isAuthenticated && <AuthStack />}
         {authCtx.isAuthenticated && <AuthenticatedStack />}
        
      
      </NavigationContainer>
    );
  }

  function Root() {
    const [isTryingLogin, setIsTryingLogin] = useState(true);
  
    const authCtx = useContext(AuthContext);
  
    useEffect(() => {
      async function fetchToken() {
        const storedToken = await AsyncStorage.getItem('access');
        const storedRefreshToken = await AsyncStorage.getItem('refresh');
  
        if (storedToken && storedRefreshToken) {
          authCtx.authenticate(storedToken,storedRefreshToken);
        }
  
        setIsTryingLogin(false);
      }
  
      fetchToken();
    }, []);
  
    if (isTryingLogin) {
      return <AppLoading />;
    }
  
    return <Navigation />;
  }



  return (
    <View style={styles.container}>
    <AuthProvider>
      <AxiosProvider>
    <Root />
    </AxiosProvider>
    </AuthProvider>
    </View>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f1f7f7', // Set your desired background color here
  },
});