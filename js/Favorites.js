import { GithubUser } from "./GithubUser.js"

// class that will contain the logic
// how data will be structured
export class Favorites {
  constructor(root) {
    this.root = document.querySelector(root)
    this.load()
  }

  load() {
    this.entries = JSON.parse(localStorage.getItem('@gitfav:')) || []
  }

  save() {
    localStorage.setItem('@gitfav:', JSON.stringify(this.entries))
  }

  async add(username) {
    try {

      const userExists = this.entries.find(entry => entry.login === username)

      if(userExists) {
        throw new Error('Usuário já cadastrado!')
      }

      const user = await GithubUser.search(username)

      if(user.login === undefined) {
        throw new Error('Usuário não encontrado!')
      }

      this.entries = [user, ...this.entries]
      this.update()
      this.save()

    } catch(error) {
      alert(error.message)
    }
  }

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    
    this.entries = filteredEntries
    this.update()
    this.save()
  }
}

// class that will create the HTML view and events
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
    this.onAdd()
  }


  handleSearch() {
    const { value } = this.root.querySelector('.search input')

    this.add(value)
  }

  onAdd() {
    const favButton = this.root.querySelector('.search button')
    favButton.onclick = () => {
      this.handleSearch()
    }

    const input = this.root.querySelector('.search input')
    input.addEventListener('keydown', (event) => {
      if(event.key === 'Enter') {
        this.handleSearch()
      }
    })
  }

  update() {
    this.removeAllTr()

    this.entries.forEach( user => {
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user a').href = `https://github.com/${user.login}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = `/${user.login}`
      row.querySelector('.repositories').textContent = user.public_repos
      row.querySelector('.followers').textContent = user.followers

      row.querySelector('.remove').onclick = () => {
        const isOk = confirm('Tem certeza que deseja deletar essa linha?')
        if(isOk) {
          this.delete(user)
        }
      }

      this.tbody.append(row)
    })
    
    this.noUserDisplay()
  }

  createRow() {
    const tr = document.createElement('tr')

    tr.innerHTML = `
      <td class="user">
        <img src="https://github.com/Lucasjs0.png" alt="Foto do perfil github">
        <a href="https://github.com/Lucasjs0" target="_blank">
          <p>Lucas Janaudis Soares</p>
          <span>/Lucasjs0</span>
        </a>
      </td>
      <td class="repositories">
        21
      </td>
      <td class="followers">
        17
      </td>
      <td>
        <button class="remove">Remover</button>
      </td>
    `
    return tr
  }

  removeAllTr() {
    this.tbody.querySelectorAll('tr')
      .forEach((tr) => {
        tr.remove()
      })
  }

  noUserDisplay() {
    if(this.entries.length == 0) {
      this.root.querySelector('.no-user').classList.remove('hide')
    } else {
      this.root.querySelector('.no-user').classList.add('hide')
    }
  }

}