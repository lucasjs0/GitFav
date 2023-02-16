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

  delete(user) {
    const filteredEntries = this.entries
      .filter(entry => entry.login !== user.login)
    
    this.entries = filteredEntries
    this.update()

  }
}

// class that will create the HTML view and events
export class FavoritesView extends Favorites {
  constructor(root) {
    super(root)

    this.tbody = this.root.querySelector('table tbody')

    this.update()
  }

  update() {
    this.removeAllTr()

    this.entries.forEach(user => {
      const row = this.createRow()
      
      row.querySelector('.user img').src = `https://github.com/${user.login}.png`
      row.querySelector('.user img').alt = `Imagem de ${user.name}`
      row.querySelector('.user p').textContent = user.name
      row.querySelector('.user span').textContent = user.login
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

}