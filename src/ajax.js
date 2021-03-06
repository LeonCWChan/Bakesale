const apiHost = 'https://bakesaleforgood.com'

export default {
  async fetchInitialDeals(){
    try {
      const response = await fetch(apiHost + '/api/deals');
      const responseJson = await response.json();
      return responseJson;
    } catch(error){
      console.error(error);
    }
  },
  async fetchDealDetail(dealID){
    try {
      const response = await fetch(apiHost + '/api/deals/' + dealID);
      const responseJson = await response.json();
      return responseJson;
    } catch(error){
      console.error(error);
    }
  },
  async fetchDealsSearchResults(searchTerm){
    try {
      const response = await fetch(apiHost + '/api/deals?searchTerm=' + searchTerm);
      const responseJson = await response.json();
      return responseJson;
    } catch(error){
      console.error(error);
    }
  },

};
