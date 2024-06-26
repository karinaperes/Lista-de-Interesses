document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('btn-add').addEventListener('click', addItem);
    document.getElementById('btn-clear').addEventListener('click', clearList);
    document.getElementById('item-input').addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            addItem();
        }
    });

    loadLista()
    noticiaPatrocinada()
    setInterval(noticiaPatrocinada, 1000)
});

function addItem() {
    const itemInput = document.getElementById('item-input')
    const item = itemInput.value

    if (item !== '') {
        addItemLista(item)
        saveItem(item)
        itemInput.value = ''
    } else {
        alert('Insira um interesse')
    }
}

function addItemLista(item) {
    const lista = document.getElementById('lista')
    const novoItem = document.createElement('li')    
    const checkbox = document.createElement('input')

    checkbox.type = 'checkbox'
    checkbox.className = 'checkbox'

    checkbox.addEventListener('change', function() {
        if (checkbox.checked) {
            novoItem.classList.add('riscado');
        } else {
            novoItem.classList.remove('riscado');
        }
    })

    const itemText = document.createElement('span')
    itemText.textContent = item

    const deleteButton = document.createElement('button')
    deleteButton.textContent = 'Excluir'
    deleteButton.className = 'btn-delete'
    deleteButton.addEventListener('click', function() {
        deleteItem(item, novoItem)
    })

    novoItem.appendChild(checkbox)
    novoItem.appendChild(itemText)
    novoItem.appendChild(deleteButton)
    lista.appendChild(novoItem)
}

function saveItem(item) {
    let itens = localStorage.getItem('itens') ? JSON.parse(localStorage.getItem('itens')) : []
    itens.push(item)
    localStorage.setItem('itens', JSON.stringify(itens))
}

function loadLista() {
    let itens = localStorage.getItem('itens') ? JSON.parse(localStorage.getItem('itens')) : []
    itens.forEach(item => {
        addItemLista(item)
    })
}

function clearList() {
    localStorage.removeItem('itens')
    document.getElementById('lista').innerHTML = ''
}

function deleteItem(item, itemElement) {
    let itens = JSON.parse(localStorage.getItem('itens')) || [];
    localStorage.setItem('itens', JSON.stringify(itens.filter(i => i !== item)));
    itemElement.remove();
}

async function noticiaPatrocinada() {
    const url = 'https://servicodados.ibge.gov.br/api/v3/noticias/?tipo=release'
    const noticiaPatrocinadaElement = document.getElementById('noticia-patrocinada')

    try {
        const response = await fetch(url)
        const data = await response.json()
        const noticia = data.items[0]

        if (noticia) {
            noticiaPatrocinadaElement.innerHTML = `<a href="${noticia.link}" target="_blank">${noticia.titulo}</a>`
        } else {
            noticiaPatrocinadaElement.textContent = 'Nenhuma notícia disponível no momento.'
        }
        
    } catch (error) {
        console.error('Erro ao buscar notícias:', error)
        noticiaPatrocinadaElement.textContent = 'Erro ao carregar notícia.'
    }
}
