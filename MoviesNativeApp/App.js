// import { StatusBar } from 'expo-status-bar';
// import { StyleSheet, Text, View } from 'react-native';
// import { NavigationContainer } from '@react-navigation/native';
// import { createStackNavigator } from "@react-navigation/stack";
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
// import { onAuthStateChanged } from "firebase/auth";
// import { auth } from "./firebase-config";
// import Ionicons from 'react-native-vector-icons/Ionicons';

// import Home from './screens/Home';
// import Favourites from './screens/Favourites';
// import About from './screens/About';
// import Login from './screens/Login';
// import Register from './screens/Register';

// export default function App() {
//   const [user, setUser] = useState(null);
//   const Tab = createBottomTabNavigator();

//   //Screen names
//   const homeName= 'Home';
//   const favouritesName= 'Favourites';
//   const aboutName= 'About';



//   return (
//     <NavigationContainer>
//       <Tab.Navigator screenOptions={({route})=>({
//         tabBarIcon:({focused, color, size})=>{
//           let iconName;
//           if(route.name===homeName){
//             iconName=focused?'home':'home-outline';
//           }
//           else if(route.name===favouritesName){
//             iconName=focused?'heart':'heart-outline';
//           }  
//           return <Ionicons name={iconName} size={size} color={color} />;
//         }
//       })}>


//         <Tab.Screen name="Home" component={Home} options={{tabBarActiveBackgroundColor:"aqua"}}  />
//         <Tab.Screen name="Favourites" component={Favourites} options={{tabBarActiveBackgroundColor:"aqua"}}/>
//         <Tab.Screen name="About" component={About} options={{tabBarActiveBackgroundColor:"aqua"}}/>
//         <Tab.Screen name="Login" component={Login} options={{tabBarActiveBackgroundColor:"aqua"}}/>
//         <Tab.Screen name="Register" component={Register} options={{tabBarActiveBackgroundColor:"aqua"}}/>
//       </Tab.Navigator>
//     </NavigationContainer>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
// });
import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
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
            tabBarIcon: ({ focused, color, size }) => {
              let iconName;
              if (route.name === homeName) {
                iconName = focused ? 'home' : 'home-outline';
              } else if (route.name === favouritesName) {
                iconName = focused ? 'heart' : 'heart-outline';
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            }
          })}
        >
      
      
          <Tab.Screen name={homeName} component={Home} options={{ tabBarActiveBackgroundColor: "aqua" }} />
          <Tab.Screen name={favouritesName} component={Favourites} options={{ tabBarActiveBackgroundColor: "aqua" }} />
          <Tab.Screen name={aboutName} component={About} options={{ tabBarActiveBackgroundColor: "aqua" }} />
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
