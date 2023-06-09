import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'



export default function About() {

const Nitay_link = 'https://github.com/NitayKurt';
const Eviatar_link = 'https://github.com/EviatarZilberman';

  const handleNavigation = (link) => {
    navigation.navigate(link);
  };


  return (
    <View>
      <Text>About Our Application</Text>
      <Text>The application was created by Nitay Kurt and Eviatar Zilberman as a graduating project for 'React-Native' courseint practical software engeneering atudies in Ariel University, in 2023</Text>

      <TouchableOpacity style={styles.button} onPress={(Nitay_link) => handleNavigation(Nitay_link)}>
          <Text style={styles.buttonText}>Nitay Kurt Github</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={(Eviatar_link) => handleNavigation(Eviatar_link)}>
          <Text style={styles.buttonText}>Eviatar Zilberman Github</Text>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({})