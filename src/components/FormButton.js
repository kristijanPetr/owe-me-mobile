import React from 'react';
import { Text, View, ActivityIndicator, TouchableOpacity } from 'react-native';

const FormButton = ({
  label,
  onPress,
  isLoading,
  containerStyle,
  textColor,
  backgroundColor,
  width,
  height,
  paddingLeft,
  borderRadius
}) => (
  <TouchableOpacity onPress={onPress}>
    <View
      style={[
        {
          backgroundColor: backgroundColor ? backgroundColor : '#717e8b',
          padding: 15,
          marginLeft: 10,
          marginRight: 10,
          marginTop: 10,
          borderRadius: borderRadius ? borderRadius : 4,
          width: width,
          height: height
        },
        { ...containerStyle }
      ]}
    >
      {isLoading ? (
        <View style={{ padding: 2 }}>
          <ActivityIndicator color="white" />
        </View>
      ) : (
        <Text
          style={{
            color: textColor ? textColor : '#fff',
            fontSize: 19,
            paddingLeft: paddingLeft ? paddingLeft : 10,
            textAlign: 'center',
            fontWeight: '300'
            // fontFamily: 'Roboto-Condensed-Regular'
          }}
        >
          {label}
        </Text>
      )}
    </View>
  </TouchableOpacity>
);

export default FormButton;
