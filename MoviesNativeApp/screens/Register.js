import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function Register({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = () => {
    if (email && password && confirmPassword) {
      if (password === confirmPassword) {
        // Perform your register logic here
        console.log(`Registration successful , email:${email} password:${password}`);
        alert('Registration successful');
      } else {
       alert('Passwords do not match');
      }
    } else {
      alert('Please fill in all fields');
    }
  };


  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register</Text>

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

        <TextInput
          style={styles.inputField}
          placeholder='Confirm Password'
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Submit</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={handleLogin}>
          <Text style={styles.buttonText}>Already Registered?</Text>
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
  loginButton: {
    marginTop: 10,
    alignSelf: 'center',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 16,
  },
});
