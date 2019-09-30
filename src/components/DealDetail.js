import React from 'react';
import PropTypes from 'prop-types';
import {ScrollView, View, Text, Linking, Button, TouchableOpacity,Image, PanResponder, Animated, Dimensions, StyleSheet} from 'react-native';
import { priceDisplay } from '../util';
import ajax from '../ajax';

class DealDetail extends React.Component {
  imageXPos = new Animated.Value(0);
  imgPanResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (evt, gs) => {
      this.imageXPos.setValue(gs.dx);
    },
    onPanResponderRelease: (evt, gs) => {
      this.width = Dimensions.get('window').width;
      if(Math.abs(gs.dx) > this.width * 0.4){
        const direction = Math.sign(gs.dx);
        // -1 for left, 1 for right
        Animated.timing(this.imageXPos, {
          toValue: direction * this.width,
          duration: 250,
        }).start(() => this.handleSwipe(-1 * direction));
      }else{
        // less than 40% swipe, reset
        Animated.spring(this.imageXPos, {
          toValue: 0,
        }).start();
      }
    },
  });

  handleSwipe = (indexDirection) => {
    // if outbound index no image then ignore
    if (!this.state.deal.media[this.state.imageIndex + indexDirection]){
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
      return;
    }
    this.setState((prevState) => ({
      imageIndex: prevState.imageIndex + indexDirection
    }), () => {
      // animation for next img
      this.imageXPos.setValue(indexDirection * this.width);
      Animated.spring(this.imageXPos, {
        toValue: 0,
      }).start();
    });
  }

  static propTypes = {
    initDealData: PropTypes.object.isRequired,
    onBack: PropTypes.func.isRequired,
  };
  state = {
    deal: this.props.initDealData,
    imageIndex: 0,
  };
  async componentDidMount(){
    const fullDeal = await ajax.fetchDealDetail(this.state.deal.key)
    this.setState({deal: fullDeal,});
  }
  openDealUrl = () => {
    Linking.openURL(this.state.deal.url);
  }
  render() {
    const { deal } = this.state;
    return (
      <View style={styles.container}>
        <View style={{borderBottomColor:'grey', borderBottomWidth: 0.3}}>
              <Text style={{color:'darkorange', fontSize:18,fontWeight: 'bold', textAlign:'center', marginTop:'2.5%', marginBottom:'2%'}}> The BakeSale App</Text>
            </View>
      <TouchableOpacity onPress={this.props.onBack}>
        <Text style={{margin:'1%', color:'cornflowerblue', fontWeight:'bold'}}> {'< BACK'} </Text>
      </TouchableOpacity>
        <Animated.Image
        {...this.imgPanResponder.panHandlers}
          source={{uri: deal.media[this.state.imageIndex] }}
          style={[styles.image, {left: this.imageXPos}]}
        />
        <View style={{padding:'2%'}}>
          <Text style={{fontWeight:'bold', fontSize:16,}}> {deal.title} </Text>
          <View style={{flexDirection: 'row'}}>
          <Text> {deal.cause.name} </Text>
          <Text style={{position:'absolute',right:0, fontSize:18, color:'darkorange'}}> {priceDisplay(deal.price)} </Text>
          </View>
        </View>
        <ScrollView>
        {deal.user && (
           <View style={{flexDirection: 'row', marginBottom:'1.5%', paddingBottom:'1.5%', borderColor:'gainsboro', borderBottomWidth:3}}>
            <Image source={{uri: deal.user.avatar}} style={styles.avatar} />
            <Text style={{fontSize:19}}> {deal.user.name}</Text>
          </View>
        )}
          <Text>{deal.description}</Text>
        </ScrollView>
        <Button title='BUY' onPress={this.openDealUrl} />
      </View>

    );
  }
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: '10%',
  },
  image: {
    width: '100%',
    height: 150,
  },
  avatar: {
    width: 60,
    height: 60,
  },
});

export default DealDetail;
