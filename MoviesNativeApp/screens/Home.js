import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image,Linking} from 'react-native';
import { Avatar, Button, Card} from 'react-native-paper';
import { useState } from 'react';
import { auth, database } from '../firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, addDoc, doc,getDocs, query, where } from 'firebase/firestore';
import axios from 'axios';
import {API_KEY_MOVIE_TMDB } from '@env';


const LeftContent = props => <Avatar.Icon {...props} icon="movie" />;

export default function Home() {
  const [searchItem, setSearchItem] = useState('');
  const [data, setData] = useState([]);
  const [user, setUser] = useState(null);
  const firebaseAuth = getAuth();

  // this event listener to get the logged-in user status
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const getMoviesFromApi = (searchItem) => { 
    const url = `https://api.themoviedb.org/3/search/multi?api_key=${API_KEY_MOVIE_TMDB}&query=${searchItem.toString()}`;
  
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
            console.log('URL:', `https://www.themoviedb.org/${result.media_type}/${result.id}`); 
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
  
  
  // Add to favorites
  const addToFav = async (movie) => {
    if (!user) {
      console.log('User not logged in');
      return;
    }
  
    try {
      const userFavoritesRef = collection(database, 'favorites');
      const userFavoritesQuery = query(//query is used to get the data from the database
        userFavoritesRef,
        where('email', '==', user.email)
      );
  
      const userFavoritesSnapshot = await getDocs(userFavoritesQuery);
  
      if (userFavoritesSnapshot.empty) {
        // No existing favorites collection for the user, create a new one
        const newUserFavoritesRef = await addDoc(userFavoritesRef, {
          email: user.email,
        });
  
        await addDoc(collection(newUserFavoritesRef, 'movies'), movie);
      } else {
        // User already has a favorites collection, add movie to it
        const userFavoritesDoc = userFavoritesSnapshot.docs[0];
        await addDoc(collection(userFavoritesDoc.ref, 'movies'), movie);
      }
  
      alert(`${movie.title} added to favorites`);
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
        <TouchableOpacity style={styles.searchButton} onPress={() => getMoviesFromApi(searchItem)}>
        <Text style={styles.searchButtonText}>Search🔎️</Text>
        </TouchableOpacity>
      </View>

    <ScrollView vertical={true}>
      {/* // Movies */}
      <View>
      <Text style={styles.header}>Movies🎬</Text>
      <ScrollView horizontal={true}>
        {data.map((movie, index) => (movie.media_type  === 'movie') && (
          <View  key={index}>
              <Card style={styles.cardContainer}>
                    <Card.Title titleStyle={styles.cardTitle} subtitleStyle={styles.cardTitle} theme={{ colors: { text: 'white'} }} title={movie.title || movie.name} subtitle={movie.release_date || movie.first_air_date} left={LeftContent} />
                      <Card.Content>
                        <View style={styles.textContainer}>
                          <Text style={styles.infoText}>
                          <Text style={styles.boldText}>Type:</Text> {movie.media_type}</Text>

                          <Text style={styles.infoText}>
                          <Text style={styles.boldText}>Rating:</Text> {movie.vote_average}✨</Text>

                          <Text style={styles.descriptionText} numberOfLines={3}>
                          <Text style={{fontWeight:"bold"}}>Description:</Text>{movie.overview}</Text>
                        </View>
                        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${movie.poster_path}` }} style={styles.image} />
                      </Card.Content>
                        <Card.Actions style={styles.cardActions}>
                          <Button style={styles.webButton} onPress={() => Linking.openURL(`https://www.themoviedb.org/${movie.media_type}/${movie.id}`)}>Move to website🌐</Button>

                          <Button style={styles.favButton} onPress={() => addToFav(movie)}>Add To Favorites⭐</Button>
                        </Card.Actions>
              </Card>
          </View>
        ))}
      </ScrollView>
      </View> 

     {/* //series */}
     <View>
      <Text style={styles.header}>Series📹</Text>
      <ScrollView horizontal={true}>
        {data.map((series, index) => (series.media_type  === 'tv') && (
          <View  key={index}>
              <Card style={styles.cardContainer}>
                      <Card.Content>
                      <View style={styles.titleContainer}>
                        <Card.Title titleStyle={styles.cardTitle} subtitleStyle={styles.cardTitle} theme={{ colors: { text: 'white'} }}  title={series.title || series.name}  subtitle={series.release_date || series.first_air_date} left={LeftContent} />
                        </View>
                        <View style={styles.textContainer}>
                          <Text style={styles.infoText}>
                          <Text style={styles.boldText}>Type:</Text> {series.media_type}</Text>

                          <Text style={styles.infoText}>
                          <Text style={styles.boldText}>Rating:</Text> {series.vote_average}✨</Text>

                          <Text style={styles.descriptionText} numberOfLines={3}>
                          <Text style={{fontWeight:"bold"}}>Description:</Text>{series.overview}</Text>
                        </View>
                        <Image source={{ uri: `https://image.tmdb.org/t/p/w500${series.poster_path}` }} style={styles.image} />
                      </Card.Content>
                      <Card.Actions style={styles.cardActions}>
                      <Button style={styles.webButton} onPress={() => Linking.openURL(`https://www.themoviedb.org/${series.media_type}/${series.id}`)}>Move to website🌐</Button>

                      <Button style={styles.favButton} onPress={() => addToFav(series)}>Add To Favorites⭐</Button>
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
    backgroundColor: '#607D8B',
    flex: 1,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
    marginBottom: 10,
    top: 10,
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
  signOut: {
    backgroundColor: 'red',
    color: 'white',
    fontSize: 20,
    borderRadius: 10,
    width: 100,
    alignSelf: 'center',
    alignItems: 'center',
  },
  
  header:{
    color:"white",
    fontSize:20,
    fontWeight:"bold",
    textAlign:"center",
    
  },
  cardContainer: {
    backgroundColor:'black',
    color:'white',
    borderRadius: 10,
    marginHorizontal: 10,
    marginBottom: 20,
    width: 450,
  },
  titleContainer: {
    backgroundColor: 'black',
    color: 'white',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  cardTitle:{
    color: 'white', // Modified card title color
    fontSize: 20,
    backgroundColor: 'black',
    alignContent: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  textContainer: {
    color:'white',
    marginBottom: 10,
  },
  boldText: {
    fontWeight: "bold",
  },
  infoText: {
    color:'white',
    fontSize: 16,
    marginBottom: 5,
  },
  descriptionText: {
    color:'white',
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
    justifyContent: "center",
    alignItems: "center",
  },
  webButton: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    borderRadius: 10,
    marginLeft: 10,
  },
  favButton: {
    backgroundColor: 'black',
    borderColor: 'white',
    borderWidth: 1,
    color: 'white',
    borderRadius: 10,
    marginLeft: 10,
  },
  cardActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 50,
  },
});
