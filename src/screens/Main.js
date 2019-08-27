import React from 'react';
import {
  StyleSheet,
  SafeAreaView,
  View,
  Text,
  AsyncStorage,
  FlatList
} from 'react-native';
import ListItem from '../components/ListItem1';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { MaterialIcons } from '@expo/vector-icons';
import NavigationService from '../utils/NavigationService';

const STORAGE_KEY = 'oweme:data';

export default class App extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate, state } = navigation;

    return {
      title: 'My Account',

      headerRight: (
        <TouchableOpacity
          hitSlop={{ top: 25, bottom: 25, left: 25, right: 25 }}
          onPress={() => NavigationService.navigate('AddOwner')}
        >
          <MaterialIcons
            name="playlist-add-check"
            size={25}
            color="#333"
            style={{
              marginRight: 10
            }}
          />
        </TouchableOpacity>
      )
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      refreshing: false,
      active: []
    };
  }

  async componentDidMount() {
    this.props.navigation.addListener('willFocus', (...props) => {
      this._fetchUserData();
    });
    this._fetchUserData();
  }

  _fetchUserData = async () => {
    let data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      let parsed_data = JSON.parse(data);
      if (parsed_data.active) {
        await this.setState({ active: parsed_data.active });
      }
    }

    this.setState({ refreshing: false });
  };

  _onRefresh = () => {
    console.log('is refreshing');
    this.setState({ refreshing: true }, this._fetchUserData);
  };

  _markCompleted = async item => {
    let data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      let parsed_data = JSON.parse(data);
      let filtered_active = parsed_data.active.filter(
        user => user.id !== item.id
      );
      let new_data = {
        active: filtered_active,
        past: parsed_data.past ? [...parsed_data.past, item] : [item]
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(new_data));
      this.setState({ active: filtered_active });
    }
  };

  _removeItem = async item => {
    let data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      let parsed_data = JSON.parse(data);
      let filtered_active = parsed_data.active.filter(
        user => user.id !== item.id
      );
      let new_data = {
        active: filtered_active,
        past: parsed_data.past || []
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(new_data));
      this.setState({ active: filtered_active });
    }
  };

  render() {
    if (this.state.active.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Text style={styles.headingTest}> No Data!</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          style={{ flex: 1 }}
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          contentContainerStyle={{ marginTop: 10 }}
          data={this.state.active}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => (
            <ListItem
              item={item}
              //   onSwipeFromLeft={() => alert('swiped from left!')}
              onLeftPress={item => {
                console.log('pressed left!', item.id);
                this._markCompleted(item);
              }}
              onRightPress={item => {
                this._removeItem(item);
              }}
            />
          )}
          ItemSeparatorComponent={() => (
            <View
              style={{
                flex: 1,
                height: 1
              }}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ebedee'
  },
  heading: {
    // position: 'absolute',
    // flex: 1,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'center',
    zIndex: 100,
    // left: 0,
    // right: 0,
    height: 80,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,

    elevation: 3
  },
  headingTest: {
    fontSize: 21,
    color: 'black',
    fontWeight: '500'
  },

  modalContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center'
    // paddingBottom: 18,
    // position: 'absolute',
    // bottom: 0,
    // height: Dimensions.get('screen').height / 2,
  }
});
