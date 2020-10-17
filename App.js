import { StatusBar } from 'expo-status-bar';
import React, { Component } from 'react';
import { View, Text } from 'react-native';

import * as firebase from 'firebase'

const firebaseConfig = {
  apiKey: "AIzaSyBSGU0lGm7hLbCDdWACueMG5eOwblfn5Rw",
  authDomain: "instagram-dev-15b09.firebaseapp.com",
  databaseURL: "https://instagram-dev-15b09.firebaseio.com",
  projectId: "instagram-dev-15b09",
  storageBucket: "instagram-dev-15b09.appspot.com",
  messagingSenderId: "76760740428",
  appId: "1:76760740428:web:3318b635e4571388057ae9"
};

if (firebase.apps.length === 0) {
  firebase.initializeApp(firebaseConfig)
}

import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'

import LandingScreen from './components/auth/Landing'
import RegisterScreen from './components/auth/Register'

const Stack = createStackNavigator()

export class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loaded: false,
    }
  }

  componentDidMount() {
    firebase.auth().onAuthStateChanged((user) => {
      if (!user) {
        this.setState({
          loggedIn: false,
          loaded: true,
        })
      } else {
        this.setState({
          loggedIn: true,
          loaded: true,
        })
      }
    })
  }

  render() {
    const { loggedIn, loaded } = this.state;
    if (!loaded) {
      return (
        <View style={{ flex: 1, justifyContent: 'center' }}>
          <Text>Loading</Text>
        </View>
      )
    }

    if (!loggedIn) {
      return (
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Landing">
            <Stack.Screen name="Landing" component={LandingScreen} options={{ headerShown: false }} />
            <Stack.Screen name="Register" component={RegisterScreen} options={{ headerShown: false }} />
          </Stack.Navigator>
        </NavigationContainer>
      );
    }

    return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>User is logged in</Text>
      </View>
    )
  }
}

export default App