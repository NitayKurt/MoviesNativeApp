import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image,Linking} from 'react-native';
import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { auth, database } from '../firebase-config';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { Avatar, Button, Card } from 'react-native-paper';
const LeftContent = props => <Avatar.Icon {...props} icon="movie" />;

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);
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
        return [];
      }
  
      const userFavoritesDoc = userFavoritesSnapshot.docs[0];
      const moviesSnapshot = await getDocs(
        collection(userFavoritesDoc.ref, 'movies')
      );
  
      const favoriteMovies = moviesSnapshot.docs.map((doc) => doc.data());
      return favoriteMovies;
    } catch (error) {
      console.error(error);
      return [];
    }
  };
  

  const displayFavoriteMovies = async () => {
    if (!user) {
      console.log('User not logged in');
      return;
    }
    const favoriteMovies = await getFavoriteMoviesFromCollection(user);
    setFavorites(favoriteMovies);
    // You can further process or display the favorite movies as needed
  };
  


  useEffect(() => {
    if (user) {
      displayFavoriteMovies();
    }
  }, [user]);

  const removeFromFavorites = async (favoriteId) => {
    if (!auth.currentUser) {
      console.log('User not logged in');
      return;
    }

    const userId = auth.currentUser.uid;
    const favoriteRef = doc(database, `USERS-MOVIE-APP/${userId}/favorites/${favoriteId}`);
    await deleteDoc(favoriteRef);

    const updatedFavorites = favorites.filter((favorite) => favorite.id !== favoriteId);
    setFavorites(updatedFavorites);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => removeFromFavorites(item.id)}>
      <Text>{item.title}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Favorites</Text>
      
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
                          <Button style={styles.webButton} onPress={() => Linking.openURL(`https://www.themoviedb.org/${movie.media_type}/${movie.id}`)}>Move to website</Button>

                          <Button style={styles.favButton} onPress={() => addToFav(movie)}>Add To Favorites</Button>
                        </Card.Actions>
              </Card>
          </View>
        ))}
      </ScrollView>
    </View>
    </View>
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
