var repoList = new RepoList();
var githubSearchUrl = 'https://api.github.com/users/elgreg/repos';
var searchBox = new SearchBox(githubSearchUrl, 'Search repos: ');

searchBox.render();
searchBox.on('keyup', repoList.render.bind(repoList));

// Initial result
new Ajax(githubSearchUrl, '7531f7a87987c6ceeb60b2a66c5035')
  .then((data) => {
    repoList.render(data);
    return data;
  })
  .catch(e => console.log(e))
  .get();
