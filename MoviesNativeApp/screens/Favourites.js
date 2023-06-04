import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import React, { useEffect, useState } from 'react';
import { collection, query, where, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { database, auth } from '../firebase-config';

export default function Favourites() {
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    const fetchFavorites = async () => {
      const userId = auth.currentUser.uid;

      const favoritesCollectionRef = collection(database, `USERS-MOVIE-APP/${userId}/Favorites`);
      const favoritesQuery = query(favoritesCollectionRef);

      const favoritesSnapshot = await getDocs(favoritesQuery);
      const favoritesData = favoritesSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));

      setFavorites(favoritesData);
    };

    fetchFavorites();
  }, []);

  const removeFromFavorites = async (favoriteId) => {
    const userId = auth.currentUser.uid;

    const favoriteRef = doc(database, `USERS-MOVIE-APP/${userId}/Favorites/${favoriteId}`);
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
      {favorites.length > 0 ? (
        <FlatList
          data={favorites}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContainer}
        />
      ) : (
        <Text>No favorites added yet</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  listContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
