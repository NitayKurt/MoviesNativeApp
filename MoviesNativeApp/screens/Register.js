import React, { useState } from 'react';
import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,Image } from 'react-native';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import {auth, database} from '../firebase-config';
import SelectDropdown from 'react-native-select-dropdown'
import ages from '../assets/ages';
import { Avatar } from 'react-native-paper';

const movieIcon = props => <Avatar.Icon {...props} icon="movie" />
export default function Register({ navigation }) {
  const[email, setEmail] = useState("");
  const[firstName, setFirstName] = useState("");
  const[lastName, setLastName] = useState("");
  const[password, setPassword] = useState("");
  const[age, setAge] = useState(0);
  const[users]= useState([]);

   //convert the JSON file to numbers for the select drop down: 
   const ageNumbers = ages.ages.map((age) => JSON.stringify(age.age));
  

  //create a new user in the database
   const createFavoritesCollection = async (userId) => {
    const favoritesCollectionRef = collection(database, `USERS-MOVIE-APP/${userId}/Favorites`);
    await setDoc(favoritesCollectionRef, {});
  };


  const onSubmit = () => {
    if (age < 18) {
      alert("You are too young for this app");
      setEmail(null);
      setFirstName(null);
      setLastName(null);
      setPassword(null);
      setAge(0);
      return;
    }

    if (email == '' || email == null ) {
      alert('Invalid email', 'Please enter a valid email address!');
      setEmail("");
      return;
    }

    if (firstName == '' || firstName == null ) {
      alert('Invalid First Name', 'Please enter a First Name!');
      setFirstName("");
      return;
    }
    if (lastName == '' || lastName == null ) {
      alert('Invalid Last Name', 'Please enter a Last Name!');
      setLastName("");
      return;
    }
    if(password == '' || password == null){
      alert('Invalid password', 'Please enter a valid password!');
      setPassword("");
      return;
    }
    createUserWithEmailAndPassword(auth, email, password)
    .then(async(userCredential) => {
      const user = userCredential.user;
      await addDoc(collection(database, "USERS-MOVIE-APP"), {
        uid: user.uid,
        email:email,
        firstName:firstName,
        lastName:lastName,
        age: age,
      });

      alert("Signup successfully!");
      navigation.navigate("Login");

    })
    .catch((err) => {
      console.log(err);
      alert(err)
    });
  
  }

  const registeredUser = () => {
    navigation.navigate("Login");
  }
 

  return (
    <SafeAreaView style={styles.container}>
      <Image source={require('../assets/movieIcon.png')} style={{width:100,height:100}}/>
      <Text style={{color:'white', fontSize: 30, fontWeight: 'bold', marginBottom: 20,}}>Welcome to Movie App</Text>
      <View style={styles.innerContainer}>
        <Text style={styles.title}>Register</Text>

        <TextInput
          style={styles.inputField}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        
        <TextInput
          style={styles.inputField}
          placeholder="First Name"
          value={firstName}
          onChangeText={setFirstName}
          autoCapitalize="none"
          keyboardType="default"
        />
      
        <TextInput
          style={styles.inputField}
          placeholder="Last Name"
          value={lastName}
          onChangeText={setLastName}
          autoCapitalize="none"
          keyboardType="default"
        />
    
        <TextInput
          style={styles.inputField}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
        />
        <SelectDropdown
          defaultButtonText='Select Your Age'
          buttonStyle={styles.inputField}
          data={ageNumbers}
          onSelect={(selectedItem, index) => {
            setAge(selectedItem)
          }}
          
        />

        <TouchableOpacity style={styles.button} onPress={onSubmit}>
          <Text style={styles.buttonText}>Sign Me Up</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.button1} onPress={registeredUser}>
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
    width: '100%',
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
