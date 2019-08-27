import React, { Component } from 'react';

import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

class ListItem1 extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this._swipable = null;
  }

  _renderLeftActions = (progress, dragX, onPress, item) => {
    const scale = dragX.interpolate({
      inputRange: [0, 100],
      outputRange: [0, 1],
      extrapolate: 'clamp'
    });
    return (
      <TouchableOpacity
        onPress={() => {
          this._swipable.close();
          onPress(item);
        }}
      >
        <View style={styles.leftAction}>
          <Animated.Text
            style={[styles.actionText, { transform: [{ scale }] }]}
          >
            Returned
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  _renderRightActions = (progress, dragX, onPress, item) => {
    const scale = dragX.interpolate({
      inputRange: [-100, 0],
      outputRange: [1, 0],
      extrapolate: 'clamp'
    });

    return (
      <TouchableOpacity
        onPress={() => {
          this._swipable.close();
          onPress(item);
        }}
      >
        <View style={styles.rightAction}>
          <Animated.Text
            style={[styles.actionText, { transform: [{ scale }] }]}
          >
            Delete
          </Animated.Text>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { item, onLeftPress, onRightPress } = this.props;
    return (
      <Swipeable
        ref={ref => (this._swipable = ref)}
        friction={2}
        renderLeftActions={(progress, dragX) =>
          this._renderLeftActions(progress, dragX, onLeftPress, item)
        }
        // onSwipeableLeftOpen={onSwipeFromLeft}
        renderRightActions={(progress, dragX) =>
          this._renderRightActions(progress, dragX, onRightPress, item)
        }
      >
        <View style={styles.container}>
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
                color: 'red',
                fontWeight: 'bold'
              }}
            >
              -${item.amount}
            </Text>
            <Text>{item.date}</Text>
          </View>
        </View>
      </Swipeable>
    );
  }
}

export default ListItem1;

const styles = StyleSheet.create({
  container: {
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
