import { View, Text } from 'react-native'
import React from 'react'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Home } from "./Home"
import { Search } from "./Search"
import { Profile } from "./Profile"
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../constants/index";

const Tab = createBottomTabNavigator();

const screenOptions = {
    tabBarShowLabel: false,
    tabBarHideOnKeyboard: true,
    headerShown: false,
    tabBarStyle: {
      position: "absolute",
      bottom: 0,
      right: 0,
      elevation: 0,
      height: 70,
    },
  };

  
const BottomTabNavigation = () => {
  return (
    <Tab.Navigator screenOptions={screenOptions}>
        <Tab.Screen
         name='Home'
         component={Home}
         options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Ionicons
                  name={focused ? "home" : "home-outline"}
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray2}
                />
              );
            },
          }}
         />
        <Tab.Screen 
         name='Search'
         options={{
            tabBarIcon: ({ focused }) => {
              return (
                <Ionicons
                  name={"search-sharp"}
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray2}
                />
              );
            },
          }}
         component={Search}/>
        <Tab.Screen 
         name='Profile'
         options={{
            tabBarIcon: ({ focused }) => {
              return (
                <View>
                <Ionicons
                  name={focused ? "person":"person-outline"}
                  size={24}
                  color={focused ? COLORS.primary : COLORS.gray2}
                />
                <Text>Profile</Text>
                </View>
              );
            },
          }}
         component={Profile}/>
    </Tab.Navigator>
  )
}

export default BottomTabNavigation