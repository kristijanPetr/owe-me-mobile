import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  Image
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

let _swipable = null;

export const Separator = () => <View style={styles.separator} />;

const LeftActions = (progress, dragX) => {
  const scale = dragX.interpolate({
    inputRange: [0, 100],
    outputRange: [0, 1],
    extrapolate: 'clamp'
  });
  return (
    <View style={styles.leftAction}>
      <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
        Add to Cart
      </Animated.Text>
    </View>
  );
};

const RightActions = ({ progress, dragX, onPress }) => {
  const scale = dragX.interpolate({
    inputRange: [-100, 0],
    outputRange: [1, 0],
    extrapolate: 'clamp'
  });

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.rightAction}>
        <Animated.Text style={[styles.actionText, { transform: [{ scale }] }]}>
          Delete
        </Animated.Text>
      </View>
    </TouchableOpacity>
  );
};

const ListItem = ({ item, onSwipeFromLeft, onRightPress }) => (
  <Swipeable
    ref={ref => (_swipable = ref)}
    friction={2}
    renderLeftActions={LeftActions}
    onSwipeableLeftOpen={onSwipeFromLeft}
    renderRightActions={(progress, dragX) => (
      <RightActions
        progress={progress}
        dragX={dragX}
        onPress={() => {
          _swipable.close();
          // onRightPress(item);
          console.log(_swipable);
        }}
      />
    )}
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
          <Text style={[styles.text, { fontWeight: '700' }]}>{item.name}</Text>
          <Text style={[styles.text, { fontSize: 15, color: 'grey' }]}>
            Payment owe
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
          $250
        </Text>
        <Text>22/08/2019</Text>
      </View>
    </View>
  </Swipeable>
);

export default ListItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingHorizontal: 10,
    paddingVertical: 30,
    marginLeft: 10,
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  text: {
    color: '#4a4a4a',
    fontSize: 17
  },
  separator: {
    flex: 1,
    height: 1,
    // backgroundColor: '#e4e4e4',
    marginVertical: 7
  },
  leftAction: {
    backgroundColor: '#388e3c',
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
