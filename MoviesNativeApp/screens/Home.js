import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image} from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useState } from 'react';
import { auth, database } from '../firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, doc } from 'firebase/firestore';
import axios from 'axios';
import {API_KEY_MOVIE_TMDB,TOKEN_MOVIE_TMDB } from '@env';

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

  
  function getMoviesFromApi(searchItem) {
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY_MOVIE_TMDB}&query=${searchItem}`;
  
    axios.get(url)
      .then(response => {
        const results = response.data.results;
  
        if (results) {
          const filteredResults = results.filter(result => result.media_type === 'movie' || result.media_type === 'tv');
          setData(filteredResults);
          setSearchItem('');
          console.log(filteredResults);
          filteredResults.forEach(result => {
            console.log('Title:', result.title || result.name);
            console.log('Release Date:', result.release_date || result.first_air_date);
            console.log('Overview:', result.overview);
            console.log(`https://image.tmdb.org/t/p/w500${result.poster_path}`);
            console.log('Type:', result.media_type);
            console.log('----------------------');
          });
        } else {
          console.log('No results found!');
        }
      })
      .catch(error => {
        console.log('Error:', error.message);
      });
  }
  
  

  // const getMoviesFromApi = async () => {
  //   try {
  //     let response = await fetch(`http://www.omdbapi.com/?s=${searchItem.toLocaleLowerCase()}&apikey=4a3b711b`);
  //     let json = await response.json();
  //     setData(json.Search);
  //     console.log(data)
  //     setSearchItem('');
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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
        {data.map((movie, index) => (movie.media_type  === 'movie') && (
          <View  key={index}>
              <Card style={styles.cardContainer}>
  <Card.Title title={movie.title || movie.name} subtitle={movie.release_date || movie.first_air_date} left={LeftContent} />
  <Card.Content>
    <View style={styles.textContainer}>
      <Text style={styles.infoText}>
        <Text style={styles.boldText}>Type:</Text> {movie.media_type}
      </Text>
      <Text style={styles.descriptionText} numberOfLines={3}>
      <Text style={{fontWeight:"bold"}}>Description:</Text>{movie.overview}
      </Text>
      <Text style={styles.infoText}>
        <Text style={styles.boldText}>Rating:</Text> {movie.vote_average}
      </Text>
    </View>
    <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.image} />
  </Card.Content>
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
        {data.map((series, index) => (series.media_type === 'tv') && (
          <View  key={index}>
            <Card >
              <Card.Title title={series.title || series.name} subtitle={series.release_date || series.first_air_date} left={LeftContent} />
              <Card.Content style={styles.cardContainer}>
                <ScrollView horizontal={false}>
                  <Text variant="bodyMedium"><Text style={{fontWeight:"bold"}}>Type:</Text>{series.media_type}</Text>
                  <Text variant="bodyMedium" numberOfLines={3} ><Text style={{fontWeight:"bold"}}>Description:</Text> {series.overview}</Text>
                  <Text variant="bodyMedium"><Text style={{fontWeight:"bold"}}>Rate:</Text> {series.vote_average}</Text>
                  <Image source={{uri: `https://image.tmdb.org/t/p/w500${series.poster_path}`}} style={{width: 300, height: 200}} />
                </ScrollView>
              </Card.Content>
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
  favButton1: {
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
  cardContainer: {
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
  },
  textContainer: {
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  infoText: {
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    fontSize: 14,
    marginBottom: 10,
    flexWrap: 'wrap',
    lineHeight: 20,
  },
  image: {
    width: 300,
    height: 200,
    resizeMode: "cover",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  webButton: {
    backgroundColor: 'gold',
    color: 'white',
    borderRadius: 10,
    marginLeft: 10,
  },
  favButton: {
    backgroundColor: 'green',
    color: 'white',
    borderRadius: 10,
    marginLeft: 10,
  },
});
