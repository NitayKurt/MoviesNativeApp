import { StyleSheet, Text, TouchableOpacity, View, SafeAreaView } from 'react-native'
import React from 'react'
import Entypo from 'react-native-vector-icons/Entypo'



export default function About() {

const Nitay_link = 'https://github.com/NitayKurt';
const Eviatar_link = 'https://github.com/EviatarZilberman';

  const handleNavigation = (link) => {
    navigation.navigate(link);
  };


  return (
    <SafeAreaView style={styles.main}>
      <Text style={styles.text}>The application was created by Nitay Kurt and Eviatar Zilberman as a graduating project for
       'React-Native' course as part of practical software engeneering atudies in Ariel University, in 2023. We have started this project out of
        a vision, but also for the grade and other inspiration stuff...</Text>

      <TouchableOpacity style={styles.button} onPress={() => handleNavigation(Nitay_link)}>
          <Text style={styles.textbutton}>
            <Entypo name='linkedin-with-circle'
            style= {{color: 'white', fontSize: 30}} />
            Nitay Kurt Github</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button} onPress={() => handleNavigation(Eviatar_link)}>
          <Text style={styles.textbutton}>
          <Entypo name='linkedin-with-circle'
            style= {{color: 'white', fontSize: 30}} />
            Eviatar Zilberman Github</Text>
        </TouchableOpacity>
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
  },
  text: {
    fontSize: 20,
    lineHeight: 21,
    //fontWeight: 'bold',
    letterSpacing: 0.25,
    color: 'white',
    alignContent: 'center',
    marginBottom: 30,
  },
})