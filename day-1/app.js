var repoList = new RepoList();
var githubSearchUrl = 'https://api.github.com/users/elgreg/repos';
var searchBox = new SearchBox(githubSearchUrl, 'Search repos: ');

searchBox.render();
searchBox.on('keyup', repoList.render.bind(repoList));

// Initial result
// TODO: there should be a way to avoid calling this again in the searchBox event
new Ajax(githubSearchUrl, 'e16c05f318bcd8d512ecd0fa16071b2be791e3a6')
  .then((data) => {
    repoList.render(data);
    return data;
  })
  .catch(e => console.log(e))
  .get();
