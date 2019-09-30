import React from 'react';
import PropTypes from 'prop-types';
import {View, Text, TouchableOpacity, Image, StyleSheet, ImageBackground} from 'react-native';
import { priceDisplay } from '../util';

class DealItem extends React.Component {
  static propTypes = {
    deal: PropTypes.object.isRequired,
    onPress: PropTypes.func.isRequired,
  };
  handlePress = () => {
    this.props.onPress(this.props.deal.key);
  }
  render() {
    const { deal } = this.props;
    return (
      <TouchableOpacity style={styles.deal}
      onPress={this.handlePress}>
        <View style={{    borderColor: 'darkorange',
    borderWidth: 5,
    borderRadius: 0,}}>
        <ImageBackground
          source={{ uri:  deal.media[0] }}
          style={styles.image}>
        <Text
          style={{
            fontWeight: 'bold',
            color: 'white',
            backgroundColor: 'darkorange',
            position: 'absolute', 
            top: 0,
            right: 0, }}> {deal.cause.name} </Text>
        </ImageBackground>
        </View>
        <View style={{padding:'1%'}}>
          <Text style={{fontWeight: 'bold', fontSize: 18}}> {deal.title} </Text>
          <Text> {priceDisplay(deal.price)} </Text>
        </View>
      </TouchableOpacity>

    );
  }
}

const styles = StyleSheet.create({
  image: {
    width: '100%',
    height: 150,
  },
});

export default DealItem;
