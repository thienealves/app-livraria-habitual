import React from 'react';
import { StatusBar } from 'expo-status-bar';

import 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import Login from './screens/Login';
import Cadastro from './screens/Cadastro';
import Home from './screens/Home';

const { Navigator, Screen } = createStackNavigator();

export default function Routes({ logado }) {
  return (
      <NavigationContainer>
        <StatusBar style="auto" />
        <Navigator headerMode initialRouteName={logado ? "Home" : "Login"}>
            <Screen name="Login" component={Login} />
            <Screen name="Cadastro" component={Cadastro} />
            <Screen name="Home" component={Home} />
        </Navigator>
      </NavigationContainer>
  );
}