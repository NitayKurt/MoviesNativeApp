import * as React from 'react';
import { SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native'
import { Avatar, Button, Card, Searchbar } from 'react-native-paper';
import { useState } from 'react';

const LeftContent = props => <Avatar.Icon {...props} icon="movie" />

export default function Home() {

  const [data, setData] = useState([]);

  const getMoviesFromApi = async () => {
    try {
      let response = await fetch(
        'http://www.omdbapi.com/?apikey=6a3c2a1c&s=batman',
      );
      let json = await response.json();
      setData(json.Search);
      console.log(data)
      return json.Search;
    } catch (error) {
      console.error(error);
    }
  }
  const just = () =>{
    console.log(`pressed`)
  }


  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Searchbar collapsable={true} onEndEditing={getMoviesFromApi}></Searchbar>
      <ScrollView>
        <Card>
          <Card.Title title={"Movie Name"} subtitle={"YEAR"} left={LeftContent} />
            <Card.Content>
              <Text variant="titleLarge">Description</Text>
              <Text variant="bodyMedium">Rate</Text>
            </Card.Content>
          <Card.Cover source={{ uri: 'https://picsum.photos/700' }} ></Card.Cover>
        <Card.Actions>
            <Button>Move to website</Button>
            <Button style={styles.favBotton} onPress={just}>Add To Favourites</Button>
        </Card.Actions>
      </Card>
      </ScrollView>
  </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  favBotton:{
    backgroundColor:"green",
    color:"white",
    borderRadius:10,
    marginLeft:10,
    
  },
})