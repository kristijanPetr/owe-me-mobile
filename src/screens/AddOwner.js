import React, { Component } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  AsyncStorage,
  TouchableOpacity
} from 'react-native';
import { TextInput, ScrollView } from 'react-native-gesture-handler';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import { Feather } from '@expo/vector-icons';
import FormButton from '../components/FormButton';
import NavigationService from '../utils/NavigationService';

const STORAGE_KEY = 'oweme:data';

class AddOwner extends Component {
  static navigationOptions = ({ navigation }) => {
    const { navigate, state } = navigation;

    return {
      title: 'Add Entry',
      headerBackTitle: 'Back'
    };
  };

  constructor(props) {
    super(props);
    this.state = {
      avatar: null,
      name: '',
      purpose: '',
      days: '',
      amount: '',
      isLoading: false
    };
  }

  async componentDidMount() {
    let data = await AsyncStorage.getItem(STORAGE_KEY);

    let print_data = data
      ? JSON.parse(data).active.map(item => {
          return {
            ...item,
            avatar: item.avatar.slice(0, 50)
          };
        })
      : [];
  }

  getFormattedDate = () => {
    let date = new Date();
    let year = date.getFullYear();

    let month = (1 + date.getMonth()).toString();
    month = month.length > 1 ? month : '0' + month;

    let day = date.getDate().toString();
    day = day.length > 1 ? day : '0' + day;

    return day + '/' + month + '/' + year;
  };

  uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = (Math.random() * 16) | 0,
        v = c == 'x' ? r : (r & 0x3) | 0x8;
      return v.toString(16);
    });
  }

  _onSubmit = async () => {
    const { name, purpose, avatar, amount } = this.state;
    await this.setState({ isLoading: true });
    await setTimeout(async () => {
      let data = await AsyncStorage.getItem(STORAGE_KEY);
      let form_data = {
        id: this.uuidv4(),
        name,
        purpose,
        amount,
        avatar,
        date: this.getFormattedDate()
      };
      if (data === null) {
        let new_data = {
          active: [form_data],
          past: []
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(new_data));
      } else {
        let parsed_data = JSON.parse(data);

        let new_data = {
          active: parsed_data.active
            ? [...parsed_data.active, form_data]
            : [form_data],
          past: parsed_data.past || []
        };
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(new_data));
      }
      console.log('saved');
      await this.setState({ isLoading: false });
      NavigationService.goBack();
    }, 1000);
  };

  _renderProfileImage = () => {
    const { avatar } = this.state;
    return (
      <View
        style={{
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <View>
          <Image
            source={
              avatar ? { uri: avatar } : require('../../assets/portrait.png')
            }
            style={{ width: 128, height: 128, borderRadius: 64 }}
          />
          <View style={{ position: 'absolute', bottom: -7, right: 0 }}>
            <TouchableOpacity
              style={{
                padding: 15,
                backgroundColor: '#15d97e',
                borderRadius: 50
              }}
              onPress={this._pickImage}
            >
              <Feather name="camera" size={19} color={'#fff'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  };

  _pickImage = async () => {
    const { status: cameraRollPerm } = await Permissions.askAsync(
      Permissions.CAMERA_ROLL
    );

    if (cameraRollPerm === 'granted') {
      let result = await ImagePicker.launchImageLibraryAsync({
        base64: true,
        allowsEditing: true,
        aspect: [4, 3],
        // allowsMultipleSelection: true,
        quality: 0.1
      });

      if (!result.cancelled) {
        await this.setState({
          avatar: `data:image/jpg;base64,${result.base64}`
        });
      }
    } else {
      alert('No Camera Permission allowed!');
    }
  };

  _onChangeValue = (key, value) => {
    this.setState({
      [key]: value
    });
  };

  renderInputWithBtn = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'row' }}>
        <TextInput
          placeholder="Amount"
          style={styles.textInput}
          keyboardType="numeric"
          returnKeyType="done"
          value={''}
          onChangeText={text => this._onChangeValue('amount', text)}
        />
        <TouchableOpacity
          style={{ alignItems: 'center', justifyContent: 'center' }}
          //  onPress = {()=>{this._fetchResults()}}
          underlayColor="transparent"
        >
          <View>
            <Feather name="search" size={19} color={'grey'} />
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    const { isLoading, name, purpose, amount } = this.state;
    return (
      <View style={{ flex: 1, paddingTop: 15 }}>
        <ScrollView style={{ flex: 1, paddingHorizontal: 10 }}>
          {this._renderProfileImage()}

          <TextInput
            placeholder="Name"
            style={styles.textInput}
            value={name}
            onChangeText={text => this._onChangeValue('name', text)}
          />
          <TextInput
            placeholder="Amount"
            style={styles.textInput}
            keyboardType="numeric"
            returnKeyType="done"
            value={amount}
            onChangeText={text => this._onChangeValue('amount', text)}
          />

          <TextInput
            placeholder="Purpose"
            style={styles.textInput}
            value={purpose}
            onChangeText={text => this._onChangeValue('purpose', text)}
          />

          <FormButton
            backgroundColor={'#15d97e'}
            onPress={this._onSubmit}
            label="Save"
            isLoading={isLoading}
            containerStyle={{ marginTop: 20 }}
          />
        </ScrollView>
      </View>
    );
  }
}

export default AddOwner;

const styles = StyleSheet.create({
  textInput: {
    height: 60,
    padding: 5,
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    backgroundColor: '#eee',
    borderRadius: 5
  },
  passwordContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 10
  },
  inputStyle: {
    flex: 1
  }
});
