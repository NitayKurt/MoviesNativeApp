import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity} from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useState } from 'react';
import { auth, database } from '../firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, doc } from 'firebase/firestore';

const LeftContent = props => <Avatar.Icon {...props} icon="movie" />;

export default function Home() {
  const [searchItem, setSearchItem] = useState('');
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);

  // Add this line to initialize the Firebase Auth instance
  const firebaseAuth = getAuth();

  // Add an onAuthStateChanged event listener to get the logged-in user
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const getMoviesFromApi = async () => {
    try {
      let response = await fetch(`http://www.omdbapi.com/?s=${searchItem.toLocaleLowerCase()}&apikey=4a3b711b`);
      let json = await response.json();
      setData(json.Search);
      console.log(data)
      setSearchItem('');
    } catch (error) {
      console.error(error);
    }
  };

  const addToFav = async (movie) => {
    if (!user) {
      console.log('User not logged in');
      return;
    }
  
    try {
      console.log(`first`);
      const favoritesRef = collection(database, 'favorites');
      const favoriteDoc = doc(favoritesRef, user.uid);
  
      await addDoc(favoriteDoc, movie);
      alert(`${movie.Title} added to favorites`);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <SafeAreaView style={styles.main}>
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.inputField}
          placeholder="Movie Name"
          value={searchItem}
          onChangeText={text => setSearchItem(text)}
        />
        <TouchableOpacity style={styles.searchButton} onPress={getMoviesFromApi}>
          <Text style={styles.searchButtonText}>Search</Text>
        </TouchableOpacity>
      </View>
    <ScrollView vertical={true}>

      {/* // Movies */}
      <View>
      <Text style={styles.header}>Movies</Text>
      <ScrollView horizontal={true}>
        {data.map((movie, index) => (movie.Type === 'movie') && (
          <View style={styles.cardContainer} key={index}>
            <Card>
              <Card.Title title={movie.Title} subtitle={movie.Year} left={LeftContent} />
              <Card.Content>
                <ScrollView horizontal={false}>
                  <Text variant="bodyMedium">Type: {movie.Type}</Text>
                  <Text variant="bodyMedium">Description: {movie.Plot}</Text>
                  <Text variant="bodyMedium">Rate: {movie.Rate}</Text>
                </ScrollView>
              </Card.Content>
              <Card.Cover source={{ uri: movie.Poster }}></Card.Cover>
              <Card.Actions>
                <Button style={styles.webButton} onPress={() => console.log('Move to website')}>
                  Move to website
                </Button>
                <Button style={styles.favButton} onPress={() => addToFav(movie)}>
                  Add To Favorites
                </Button>
              </Card.Actions>
            </Card>
          </View>
        ))}
      </ScrollView>
      </View> 

     {/* //series */}
     <View>
      <Text style={styles.header}>Series</Text>
      <ScrollView horizontal={true}>
        {data.map((series, index) => (series.Type === 'series') && (
          <View style={styles.cardContainer} key={index}>
            <Card>
              <Card.Title title={series.Title} subtitle={series.Year} left={LeftContent} />
              <Card.Content>
                <ScrollView horizontal={false}>
                  <Text variant="bodyMedium">Type: {series.Type}</Text>
                  <Text variant="bodyMedium">Description: {series.Plot}</Text>
                  <Text variant="bodyMedium">Rate: {series.Rate}</Text>
                </ScrollView>
              </Card.Content>
              <Card.Cover source={{ uri: series.Poster }}></Card.Cover>
              <Card.Actions>
                <Button style={styles.webButton} onPress={() => console.log('Move to website')}>
                  Move to website
                </Button>
                <Button style={styles.favButton} onPress={() => addToFav(series)}>
                  Add To Favorites
                </Button>
              </Card.Actions>
            </Card>
          </View>
        ))}
      </ScrollView>
      </View>

    </ScrollView>
      <View>
        <Button onPress={() => signOut(auth)} style={styles.signOut}>
         <Text style={{color:"white", fontSize:15}}>Sign out</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#005f73',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  inputField: {
    flex: 1,
    height: 40,
    backgroundColor: 'white',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  searchButton: {
    marginLeft: 10,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: 'gold',
    borderRadius: 5,
  },
  searchButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  favButton: {
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 10,
    marginLeft: 10,
  },
  webButton: {
    backgroundColor: 'gold',
    color: 'white',
    borderRadius: 10,
    marginLeft: 10,
  },
  signOut: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 20,
    borderRadius: 10,
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  cardContainer: {
    marginLeft: 10,
  },
  header:{
    color:"white",
     fontSize:20,
    fontWeight:"bold",
    textAlign:"center",

  },

});
