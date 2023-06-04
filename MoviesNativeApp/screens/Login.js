import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Register from './Register';
import { signInWithEmailAndPassword } from "firebase/auth";
import {auth} from '../firebase-config';
import Home from './Home';

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const onSubmit = () => {
    if (email == '' || email == null ) {
      alert('Invalid email', 'Please enter a valid email address');
      setEmail("");
      return;
    }
    if(password == '' || password == null){
      alert('Invalid password', 'Please enter a valid password');
      setPassword("");
      return;
    }
    
    console.log(`Login Success ,Email: ${email}, Password: ${password}`);
    signInWithEmailAndPassword(auth, email, password)
    .then(() => {
      alert("Login successfully!");
      setEmail("");
      setPassword("");
      navigation.navigate("Home");
    })
    .catch((err) => {
      console.log(err)
      alert(err);

    });
  
  }


  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/movieIcon.png')} style={{width:100,height:100}}/>
      <Text style={{color:'white', fontSize: 30, fontWeight: 'bold', marginBottom: 20,}}>Welcome to Movie App</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Login</Text>

        <TextInput
          style={styles.inputField}
          placeholder='Email'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={styles.inputField}
          placeholder='Password'
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Log Me In</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={handleRegister}>
          <Text style={styles.buttonText}>Not Registered yet ?</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#005f73',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerContainer: {
    width: '80%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'white',
  },
  inputField: {
    backgroundColor: 'white',
    borderRadius: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
    height: 40,
  },
  button: {
    backgroundColor: 'green',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  button1: {
    backgroundColor: 'orange',
    borderRadius: 10,
    paddingVertical: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
