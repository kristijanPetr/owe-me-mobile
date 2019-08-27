import React from 'react';
import {
  StyleSheet,
  Image,
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

class History extends React.Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate, state } = navigation;

    return {
      title: 'History'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: false,
      refreshing: false,
      past: []
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
      if (parsed_data.past) {
        await this.setState({ past: parsed_data.past });
      }
    }

    this.setState({ refreshing: false });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true }, this._fetchUserData);
  };

  _renderItem = item => {
    return (
      <View style={styles.containerItem}>
        <View
          style={{
            flex: 1,
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'flex-start'
          }}
        >
          <Image
            source={{ uri: item.avatar }}
            style={{
              width: 64,
              height: 64,
              borderRadius: 32,
              borderWidth: 1,
              borderColor: '#ebedee'
            }}
          />
          <View style={{ paddingLeft: 10 }}>
            <Text style={[styles.text, { fontWeight: '700' }]}>
              {item.name}
            </Text>
            <Text style={[styles.text, { fontSize: 15, color: 'grey' }]}>
              {item.purpose}
            </Text>
          </View>
        </View>
        <View>
          <Text
            style={{
              textAlign: 'center',
              marginBottom: 7,
              color: '#15d97e',
              fontWeight: 'bold'
            }}
          >
            +${item.amount}
          </Text>
          <Text>{item.date}</Text>
        </View>
      </View>
    );
  };

  render() {
    if (this.state.past.length === 0) {
      return (
        <View
          style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center'
          }}
        >
          <Text style={styles.headingTest}> No Past Data!</Text>
        </View>
      );
    }
    return (
      <View style={styles.container}>
        <FlatList
          refreshing={this.state.refreshing}
          onRefresh={this._onRefresh}
          contentContainerStyle={{ marginTop: 10 }}
          data={this.state.past}
          keyExtractor={(item, index) => item.id}
          renderItem={({ item }) => this._renderItem(item)}
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

export default History;

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
  },
  containerItem: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 15,
    // marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    color: '#4a4a4a',
    fontSize: 17
  },

  leftAction: {
    backgroundColor: '#15d97e',
    justifyContent: 'center',
    flex: 1
  },
  rightAction: {
    backgroundColor: '#dd2c00',
    justifyContent: 'center',
    flex: 1,
    alignItems: 'flex-end'
  },
  actionText: {
    color: '#fff',
    fontWeight: '600',
    padding: 20
  }
});
