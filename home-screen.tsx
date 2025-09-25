import type { NavigationProp } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity } from 'react-native';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation<NavigationProp<any>>();
    
    return (
        <ImageBackground
        source={require('./blue-background.png')}
        style={styles.background}>
        <ScrollView>
          <Text style={styles.logo}>Freestyle AI </Text>
                <TouchableOpacity style={styles.getStarted} onPress={() => navigation.navigate('Upload')}>
                    <Text style={styles.getStartedText}>Get Started</Text>
                </TouchableOpacity>
        </ScrollView>
      </ImageBackground>
    )
}


const styles = StyleSheet.create({
  background: {
    width: '100%',
    height: '100%',
  },
  text: {
    color: '#ffffffff',
    fontSize: 25,
    fontWeight: 'bold',
    justifyContent: 'center',
    alignSelf: 'center',
    marginTop: 10,
  },
  logo: {
    color: '#ffffffff',
    fontSize: 60,
    fontWeight: 'bold',
    margin: 'auto',
    marginTop: 80
  },
  getStarted: {
    backgroundColor: '#ffffffff',
    alignSelf: 'center',
    padding: 20,
    marginTop: 100,
    borderRadius: 30,
  },
  getStartedText: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 27,
    color: '#0A304C'
  }
});

export default HomeScreen;

