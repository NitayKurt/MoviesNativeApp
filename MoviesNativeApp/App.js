import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase-config";
import Ionicons from 'react-native-vector-icons/Ionicons';

import Home from './screens/Home';
import Favourites from './screens/Favourites';
import About from './screens/About';
import Login from './screens/Login';
import Register from './screens/Register';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

export default function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {//check if user is logged in
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    // Cleanup subscription
    return unsubscribe;
  }, []);

  
  // Screen names
  const homeName = 'Home';
  const favouritesName = 'Favourites';
  const aboutName = 'About';
  const loginName = 'Login';
  const registerName = 'Register';

  return (
    <NavigationContainer>
      {user ? (//if user is logged in
        <Tab.Navigator 
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === homeName) {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === favouritesName)  {
                iconName = focused ? 'heart' : 'heart-outline';
              } else if (route.name === aboutName) { 
                iconName = focused ? 'information-circle' : 'information-circle-outline';
              }
              return <Ionicons name={iconName} size={size} color={'white'} selectionColor={'white'} />;
            }
            ,
            tabBarActiveTintColor: 'white', // Set active tab text color to white
          })}
        >
      
      
          <Tab.Screen name={homeName} component={Home} options={{ tabBarActiveBackgroundColor: "#00BCD4" }} />
          <Tab.Screen name={favouritesName} component={Favourites} options={{ tabBarActiveBackgroundColor: "#00BCD4" }} />
          <Tab.Screen name={aboutName} component={About} options={{ tabBarActiveBackgroundColor: "#00BCD4" }} />
        </Tab.Navigator>
      ) : (//if user is not logged in
        <Stack.Navigator initialRouteName={loginName}>
          <Stack.Screen name={loginName} component={Login} options={{ headerShown: false }} />
          <Stack.Screen name={registerName} component={Register} options={{ headerShown: false }} />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
