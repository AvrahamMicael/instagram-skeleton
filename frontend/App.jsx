import { Component } from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack'
import LandingPage from './pages/auth/Landing';
import Register from './pages/auth/Register';
import Login from './pages/auth/Login';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import {
  FIREBASE_API_KEY,
  FIREBASE_AUTH_DOMAIN,
  FIREBASE_PROJECT_ID,
  FIREBASE_STORAGE_BUCKET,
  FIREBASE_MESSAGING_SENDER_ID,
  FIREBASE_APP_ID,
  FIREBASE_MEASUREMENT_ID,
} from '@env';
import { configureStore } from '@reduxjs/toolkit';
import combinedReducers from './redux/reducers/index';
import { Provider } from 'react-redux';
import MainScreen from './pages/main/Main';
import AddScreen from './pages/main/Add';
import SaveScreen from './pages/main/Save';
import CommentsScreen from './pages/main/Comments';

firebase.initializeApp({
  apiKey: FIREBASE_API_KEY,
  authDomain: FIREBASE_AUTH_DOMAIN,
  projectId: FIREBASE_PROJECT_ID,
  storageBucket: FIREBASE_STORAGE_BUCKET,
  messagingSenderId: FIREBASE_MESSAGING_SENDER_ID,
  appId: FIREBASE_APP_ID,
  measurementId: FIREBASE_MEASUREMENT_ID,
});

const store = configureStore({ reducer: combinedReducers });

const Stack = createStackNavigator();

export class App extends Component
{
  constructor(props)
  {
    super(props);
    this.state ={
      loaded: false,
    };
  }

  componentDidMount()
  {
    firebase.auth()
      .onAuthStateChanged(user => {
        this.setState({
          loggedIn: !!user,
          loaded: true,
        });
      });
  }

  render()
  {
    const { loggedIn, loaded } = this.state;
    if(!loaded) return (
      <View style={{ flex: 1, justifyContent: 'center' }}>
        <Text>Loading</Text>
      </View>
    );

    if(!loggedIn) return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Landing">
          <Stack.Screen
            name="Landing"
            component={ LandingPage }
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={ Register }
          />
          <Stack.Screen
            name="Login"
            component={ Login }
          />
        </Stack.Navigator>
      </NavigationContainer>
    );

    return (
      <Provider store={ store }>
        <NavigationContainer>
          <Stack.Navigator initialRouteName='Main'>
            <Stack.Screen
              name='Main'
              component={ MainScreen }
              options={{ headerShown: false }}
            />
            <Stack.Screen
              name='Add'
              component={ AddScreen }
            />
            <Stack.Screen
              name='Save'
              component={ SaveScreen }
            />
            <Stack.Screen
              name='Comments'
              component={ CommentsScreen }
            />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
};

export default App;
