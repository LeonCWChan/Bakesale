import React from 'react';

import {View, Text, Animated, Easing, Dimensions, StyleSheet} from 'react-native';
import ajax from '../ajax';
import DealList from './DealList';
import DealDetail from './DealDetail';
import SearchBar from './SearchBar';

class App extends React.Component {
  titleXPos = new Animated.Value(0);
  state = {
    deals: [],
    dealsFromSearch: [],
    currentDealId: null,
    activeSearchTerm: '',
  };
  animateTitle = (direction = 1) => {
    const width = Dimensions.get('window').width - 150;
    Animated.timing(
      this.titleXPos,
      {toValue: direction * (width / 2),
      duration: 1000,
      easing: Easing.ease,
      }
    ).start(({ finished }) => {
      if (finished){
        this.animateTitle(-1 * direction);
      };
    });
  };
  async componentDidMount(){
    this.animateTitle();
    const deals = await ajax.fetchInitialDeals();
    this.setState({ deals });
  }

  searchDeals = async (searchTerm) => {
    let dealsFromSearch = [];
    if (searchTerm) {
      dealsFromSearch = await ajax.fetchDealsSearchResults(searchTerm);
    }
    this.setState({dealsFromSearch, activeSearchTerm: searchTerm});
  }

  setCurrentDeal = (dealID) => {
    this.setState(
      {currentDealId: dealID}
    );
  };

  unsetCurrentDeal = () => {
    this.setState(
      {currentDealId: null}
    );
  };

  currentDeal = () => {
    return this.state.deals.find(
    (deal) => deal.key === this.state.currentDealId
    );
  }

  render(){
      if (this.state.currentDealId) {
        return <View style={styles.main}><DealDetail initDealData={this.currentDeal()}
        onBack={this.unsetCurrentDeal} /></View>
      }

      const dealsToDisplay = this.state.dealsFromSearch.length > 0
      ? this.state.dealsFromSearch
      : this.state.deals;

      if (dealsToDisplay.length > 0){
        return (
          <View style={styles.main}>
            <View style={{borderBottomColor:'grey', borderBottomWidth: 0.3}}>
              <Text style={{color:'darkorange', fontSize:18,fontWeight: 'bold', textAlign:'center', marginTop:'2.5%', marginBottom:'2%'}}> The BakeSale App</Text>
            </View>
            <SearchBar searchDeals={this.searchDeals} initialSearchTerm={this.state.activeSearchTerm} />
            <DealList deals={dealsToDisplay} onItemPress={this.setCurrentDeal}/>
          </View>
        );
      }
      return (
        <Animated.View style={[styles.container, {left: this.titleXPos }]}>
        <Text style={styles.header}> BakeSale </Text>
        </Animated.View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  main: {
    marginTop: '10%',
  },
  header: {
    fontSize: 40,
  },
});

export default App;
