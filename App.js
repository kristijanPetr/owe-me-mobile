import { AppLoading, SplashScreen } from 'expo';

import React, { Component } from 'react';
import {
  AppState,
  ActivityIndicator,
  View,
  Image,
  StatusBar,
  Platform
} from 'react-native';

import RegisterScreens from './src/RegisterScreens';
import NavigationService from './src/utils/NavigationService';

// import NavigationService from './src/utils/NavigationService';

console.warn = () => {};
console.disableYellowBox = true;

if (!__DEV__) {
  console.log = () => {};
}

export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isLoading: false,
      isReady: false,
      isOnline: true,
      appState: AppState.currentState,
      isSplashReady: false
    };
  }

  componentDidMount() {
    SplashScreen.preventAutoHide();
    AppState.addEventListener('change', this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener('change', this._handleAppStateChange);
  }

  _handleAppStateChange = nextAppState => {
    console.log('nextAppState', nextAppState);
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === 'active'
    ) {
      console.log('App has come to the foreground!');
    }
    this.setState({ appState: nextAppState });
  };

  render() {
    return (
      <React.Fragment>
        {Platform.OS === 'ios' && <StatusBar barStyle="dark-content" />}
        <RegisterScreens
          ref={navigatorRef => {
            NavigationService.setTopLevelNavigator(navigatorRef);
          }}
        />
      </React.Fragment>
    );
  }
}
