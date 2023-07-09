import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image,Linking, Alert} from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc, getDoc } from 'firebase/firestore';
import { auth, database } from '../firebase-config';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { Avatar, Button, Card } from 'react-native-paper';
const LeftContent = props => <Avatar.Icon {...props} icon="movie" />;

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
  const [user, setUser] = useState(null);
  
  const firebaseAuth = getAuth();
  
  // this event listener to get the logged-in user status
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(firebaseAuth, currentUser => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

 //get the user's favorite movies from the database
  const getFavoriteMoviesFromCollection = async (user) => {
    
    if (!user) {
      console.log('User not logged in');
      return [];
    }
  
    try {
      const userFavoritesRef = collection(database, 'favorites');
      const userFavoritesQuery = query(
        userFavoritesRef,
        where('email', '==', user.email)
      );
  
      const userFavoritesSnapshot = await getDocs(userFavoritesQuery);

      if (userFavoritesSnapshot.empty) {
        console.log('No favorites found for the user');
        Alert.alert('Oops','No favorites found for the user❌');
        return [];
      }
  
      const userFavoritesDoc = userFavoritesSnapshot.docs[0];
      const moviesSnapshot = await getDocs(
        collection(userFavoritesDoc.ref, 'movies')
      );
    
      const favoriteMovies = moviesSnapshot.docs.map((doc) => doc.data());
      return favoriteMovies;
    } catch (error) {
      Alert.alert('Oops','Something went wrong❌');
      console.error(error);
      return [];
    }
  };
  

  const displayFavoriteMovies = async () => {
    if (!user) {
      Alert.alert('Oops','User not logged in❌');
      console.log('User not logged in');
      return;
    }
    const favoriteMovies = await getFavoriteMoviesFromCollection(user);
    setFavorites(favoriteMovies);
  };
  

  //if user is not logged in, return empty array && if user is logged in, return favorite movies
  useEffect(() => {
    if (user) {
      displayFavoriteMovies();
    }
  }, [user,favorites]);


  const removeFromFavorites = async (movie) => { //remove from favorites
    if (!user) {
      console.log('User not logged in');
      return;
    }

    try {
      const userFavoritesRef = collection(database, 'favorites');//get the favorites collection
      const userFavoritesQuery = query( userFavoritesRef, where('email', '==', user.email));//get the user's favorites
      const userFavoritesSnapshot = await getDocs(userFavoritesQuery);//get the user's favorites snapshot
      
      if (userFavoritesSnapshot.empty) {
        console.log('No favorites found for the user');
        Alert.alert('Oops','No favorites found for the user❌');
        return;
      }

      const userFavoritesDoc = userFavoritesSnapshot.docs[0];//get the user's favorites doc
      const moviesSnapshot = await getDocs(collection(userFavoritesDoc.ref, 'movies'));//get the user's movies snapshot
      const favoriteMovies = moviesSnapshot.docs.map((doc) => doc.data());//get the user's movies
      
      const movieIndex = favoriteMovies.findIndex((m) => m.id === movie.id);//get the index of the movie to be removed
      if (movieIndex === -1) {
        console.log('Movie not found in favorites');
        Alert.alert('Oops','Movie not found in favorites❗');
        return;
      }

      await deleteDoc(doc(userFavoritesDoc.ref, 'movies', moviesSnapshot.docs[movieIndex].id));//delete the movie from the user's favorites
      console.log('Movie removed from favorites');
      Alert.alert('Success','Movie removed from favorites✅');
    } catch (error) { 
      Alert.alert('Oops','Something went wrong❌');
      console.error(error);
    }
  };

  return (
    <View style={styles.main}>
      <Text style={styles.header}>My Favorites⭐</Text>
      
      {/* // Movies */}
      <View>
      <ScrollView horizontal={true}>
        {favorites.map((movie, index) => (movie.media_type  === 'movie') && (
          <View  key={index}>
              <Card style={styles.cardContainer}>
                    <Card.Title title={movie.title || movie.name} subtitle={movie.release_date || movie.first_air_date} left={LeftContent} />
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
                        <Card.Actions>
                          <Button style={styles.removeButton} onPress={() => removeFromFavorites(movie)}>Remove from Favorites</Button>
                        </Card.Actions>
              </Card>
          </View>
        ))}
      </ScrollView>
      <View>
        <Button onPress={() => signOut(auth)} style={styles.signOut}>
         <Text style={{color:"white", fontSize:15}}>Sign out</Text>
        </Button>
      </View>
    </View>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    backgroundColor: '#607D8B',
    flex: 1,
  },
  removeButton: {
    backgroundColor: 'red',
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
    width: 450,
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
    justifyContent: "center",
    alignItems: "center",
  },
});
