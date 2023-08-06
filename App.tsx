/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';
import Home from './src/modules/Home';

function App(): JSX.Element {
  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle={'dark-content'} backgroundColor={'white'} />
      <Home></Home>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f5f5f5',
  },
});

export default App;
