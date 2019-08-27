import React from 'react';
import {
  createStackNavigator,
  createBottomTabNavigator,
  createAppContainer
} from 'react-navigation';
// import StackViewStyleInterpolator from 'react-navigation-stack/dist/views/StackView/StackViewStyleInterpolator';
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
  SimpleLineIcons
} from '@expo/vector-icons';

import Main from './screens/Main';
import AddOwner from './screens/AddOwner';
import History from './screens/History';

const HistoryStack = createStackNavigator({
  History: {
    screen: History
  }
});

const MainStack = createStackNavigator(
  {
    Home: { screen: Main },
    AddOwner: { screen: AddOwner }
    // Listing: { screen: BuildListingTabNavigator }
    // Map: { screen: MapStack }
  },
  {
    // initialRouteName: 'AddOwner',
    // transparentCard: true,
    mode: 'modal',
    navigationOptions: {
      gesturesEnabled: false
    },
    navigationOptions: {
      // header: null,

      headerStyle: {
        backgroundColor: 'grey'
      }
    }
  }
);

const BuildListingTabNavigator = createBottomTabNavigator(
  {
    Main: {
      screen: MainStack,
      navigationOptions: {
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <SimpleLineIcons
              name="wallet"
              size={23}
              color={focused ? '#15d97e' : '#dddee3'}
            />
          );
        },
        tabBarLabel: 'Main'
        //   tabBarOnPress: onNormalTabbarPress
      }
    },
    History: {
      screen: HistoryStack,
      navigationOptions: {
        headerTitle: 'Test',
        tabBarIcon: ({ focused, tintColor }) => {
          return (
            <MaterialIcons
              name="history"
              size={27}
              color={focused ? '#15d97e' : '#dddee3'}
            />
          );
        }

        //   tabBarOnPress: onNormalTabbarPress
      }
    }
  },
  {
    navigationOptions: {},
    // initialRouteName: 'Features',
    tabBarOptions: {
      showLabel: false,
      upperCaseLabel: true,
      activeTintColor: 'grey',
      inactiveTintColor: 'grey'
      //   labelStyle: {
      //     fontSize: 15
      //     // fontFamily: appFonts.PingFang_SC
      //   },

      //   activeBackgroundColor: '#fff'
    }
  }
);

// const AppContainer = createAppContainer(AppSwitchNavigator);
export default createAppContainer(BuildListingTabNavigator);
