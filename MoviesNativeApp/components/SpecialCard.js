import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Image,Linking} from 'react-native';
import { Avatar, Button, Card } from 'react-native-paper';
import { useState } from 'react';

const LeftContent = props => <Avatar.Icon {...props} icon="movie" />;

export default function SpecialCard({movie}) {
  return (
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
  )
}

const styles = StyleSheet.create({})