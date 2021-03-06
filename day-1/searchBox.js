class SearchBox {

  constructor(endpointUrl, label) {
    this._endpointUrl = endpointUrl;
    this._searchInput = document.createElement('input');
    this._searchBoxLabel = document.createElement('label');
    this._searchBoxLabel.innerText = label;
    this._api = new Ajax(endpointUrl);
  }

  parseSearch(searchText){
      const currentSearch = this._searchInput.value;
      if(!currentSearch) return;
      console.log(currentSearch);
      const parts = currentSearch.split(" ");
      // if any of the parts have a ':' in them, we'll 
      // pass them as arguments to the endpointUrl
      const args = {}
      const terms = [];
      for(let part of parts){
        let facets = part.split(':');
        if(facets.length > 1){
          args[facets[0]] = facets[1];
        } else {
            terms.push(part);
        }
      }
      return {
          args: args,
          // TODO: not using terms yet - was going to refine search
          // results but need to think through how I would filter
          // repolist from searchBox
          terms: terms
      }
  }

  on(name, callback){
      // todo: figure out how to cancel this event if it's fired again before X
    this._searchInput
        .addEventListener(name, 
          debounce( () => {
              let endpoint = this._endpointUrl;
              const parsedSearch = this.parseSearch();
              if(parsedSearch.args){
                  endpoint += '?'
                  const args = []
                  for(let key in parsedSearch.args){
                    args.push(key + '=' + parsedSearch.args[key]);
                  }
                  endpoint += args.join('&');
              }
              new Ajax(endpoint, 'e16c05f318bcd8d512ecd0fa16071b2be791e3a6')
                .then(callback)
                .get();
          }, 300)
        );
  }

  render() {
    this._searchBoxLabel.appendChild(this._searchInput);
    document.getElementById('searchBox').appendChild(this._searchBoxLabel);
  }

}
