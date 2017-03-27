class RepoList {
  
  constructor() {
    this._list = document.createElement('ul');
  }

  removeChildren() {
    while (this._list.hasChildNodes()) {
        this._list.removeChild(this._list.lastChild);
    }
  }

  addChild(repoObj) {
    let li = document.createElement('li');
    let a = document.createElement('a');
    a.innerText = repoObj.name;
    a.href = repoObj.url;
    li.appendChild(a); 
    this._list.appendChild(li);
  }

  render(repos = []) {
    this.removeChildren();

    for(let a of repos) {
      this.addChild(a);
    }
    
    document.getElementById('repoListContainer').appendChild(this._list);
  }
}