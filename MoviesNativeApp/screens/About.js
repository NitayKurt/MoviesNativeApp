import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView, Image,Linking } from 'react-native'
import React, { useState, useEffect } from 'react';
import Entypo from 'react-native-vector-icons/Entypo'
import { auth } from '../firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';

export default function About() {
  const [user, setUser] = useState(null);
  const firebaseAuth = getAuth();

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);



  return (
    <SafeAreaView style={styles.main}>
            <Image source={require('../assets/movieIcon.png')} style={{width:100,height:100, marginBottom: 10, marginTop: 10}}/>
      <Text style={styles.text}>The application was created by Nitay Kurt and Eviatar Zilberman as a graduating project for
       'React-Native' course as part of practical software engeneering atudies in Ariel University, in 2023. We have started this project out of
        a vision, but also for the grade and other inspiration stuff...</Text>


      <View style={styles.view}>
              <TouchableOpacity style={styles.button} onPress={() => Linking.openURL(`https://github.com/NitayKurt`)}>
              
          <Text style={styles.textbutton}>
            <Entypo name='github'
            style= {{color: 'white', fontSize: 30}} />
            Nitay Kurt Github</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.linkedin.com/in/nitay-kurt/')}>
          <Text style={styles.textbutton}>
            <Entypo name='linkedin-with-circle'
            style= {{color: 'white', fontSize: 30}} />
            Nitay Kurt Linkedin</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://github.com/EviatarZilberman')}>
          <Text style={styles.textbutton}>
          <Entypo name='github'
            style= {{color: 'white', fontSize: 30}} />
            Eviatar Zilberman Github</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => Linking.openURL('https://www.linkedin.com/in/eviatar-zilberman-a849891b2/')}>
          <Text style={styles.textbutton}>
            <Entypo name='linkedin-with-circle'
            style= {{color: 'white', fontSize: 30}} />
            Eviatar Zilberman Linkedin</Text>
        </TouchableOpacity>
        </View>
        
         <View style={styles.signOutContainer}>
         <TouchableOpacity style={styles.signOutButton} onPress={() => signOut(auth)}>
           <Text style={styles.signOutText}>Sign out</Text>
         </TouchableOpacity>
       </View>

    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  button: {
    marginTop: 15,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 4,
    elevation: 3,
    backgroundColor: 'black',
    width: 400,
  },
  textbutton: {
    fontSize: 16,
    lineHeight: 21,
    fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    alignContent: 'center',
  },
  main:{
    backgroundColor:"#005f73",
    flex:1,
    alignItems: 'center',
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    //fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    alignContent: 'center',
    marginBottom: 15,
    marginLeft: 100,
    marginRight: 100,
  },
  signOutContainer: {
    position: 'absolute',
    bottom: 20,
    alignItems: 'center',
    width: '100%',
  },
  signOutButton: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 20,
    borderRadius: 10,
    width: 120,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  signOutText: {
    color: 'white',
    fontSize: 18,
    
  },
  view: {
    borderColor: 'black',
    alignItems: 'center',
  }
})