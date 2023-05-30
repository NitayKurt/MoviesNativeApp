import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import Register from './Register';


export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');



  const handleSubmit = () => {
    if (email && password) {
      // Perform your login logic here
      console.log(`Login successful , email:${email} password:${password}`);
      alert(`Login successful`);
    } else {
      alert('Please fill in all fields');
    }
  };


  const handleRegister = () => {
    navigation.navigate('Register');
  };

  return (
    <SafeAreaView style={styles.container}>
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

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
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
