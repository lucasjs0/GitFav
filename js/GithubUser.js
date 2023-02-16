// class that will fetch user in github API and return the data
export class GithubUser {
  static search(username) {
    const endpoint = `https://api.github.com/users/${username}`

    return fetch(endpoint)
    .then(data => data.json())
    .then(({ login, name, public_repos, followers}) => ({
      login,
      name,
      public_repos,
      followers
    }))

  }
}