//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
const SERVER_URL = "https://listadecontatos.onrender.com";
let isSorted = false; // Controla o estado da ordenação
let originalContacts = []; // Armazena os contatos na ordem original

document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();

    const sortBtn = document.getElementById('sortAlphaBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            isSorted = !isSorted;
            renderContacts();
            sortBtn.textContent = isSorted ? "↻ Ordem Original" : "Ordenar A-Z";
        });
    }
});

let currentFavorites = [];

async function loadFavorites() {
    try {
        const response = await fetch(`${SERVER_URL}/favorites`);
        currentFavorites = await response.json();
        renderFavorites(currentFavorites);
    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
    }
}

function renderFavorites(favorites) {
    const favoriteList = document.getElementById("favoriteList");
    favoriteList.innerHTML = "";

    favorites.forEach(contact => {
        const contactCard = `
            <div class="col-md-4">
                <div class="card mb-3 contact-card">
                    <div class="card-body">
                        <div class="d-flex justify-content-between">
                            <h5 class="card-title">${contact.name}</h5>
                            <div class="dropdown">
                                <button class="btn btn-light btn-sm" data-bs-toggle="dropdown">⋮</button>
                                <ul class="dropdown-menu">
                                    <li><button class="dropdown-item" onclick="openEditModal('${contact._id}', '${contact.name}', '${contact.number}', '${contact.address}', '${contact.email}')">Editar</button></li>
                                    <li><button class="dropdown-item text-danger" onclick="deleteContact('${contact._id}')">Excluir</button></li>
                                    <li><button class="dropdown-item" onclick="toggleFavorite('${contact._id}')">Remover dos Favoritos</button></li>
                                </ul>
                            </div>
                        </div>
                        <p class="card-text">📞 ${contact.number || 'Não informado'}</p>
                        <p class="card-text">🏠 ${contact.address || 'Não informado'}</p>
                        <p class="card-text">✉️ ${contact.email || 'Não informado'}</p>
                    </div>
                </div>
            </div>
        `;
        favoriteList.innerHTML += contactCard;
    });
}

function sortFavoritesAlphabetically() {
    const sorted = [...currentFavorites].sort((a, b) => a.name.localeCompare(b.name));
    renderFavorites(sorted);
}

function openEditModal(id, name, number, address, email) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editNumber').value = number;
    document.getElementById('editAddress').value = address;
    document.getElementById('editEmail').value = email;
    new bootstrap.Modal(document.getElementById('editContactModal')).show();
}

document.getElementById('editForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const id = document.getElementById('editId').value;

    const updatedContact = {
        name: document.getElementById('editName').value,
        number: document.getElementById('editNumber').value,
        address: document.getElementById('editAddress').value,
        email: document.getElementById('editEmail').value
    };

    const response = await fetch(`${SERVER_URL}/update-contact/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedContact)
    });

    if (response.ok) {
        loadFavorites();
        bootstrap.Modal.getInstance(document.getElementById('editContactModal')).hide();
    } else {
        console.error("Erro ao atualizar contato");
    }
});

async function deleteContact(id) {
    const response = await fetch(`${SERVER_URL}/delete-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    if (response.ok) {
        loadFavorites();
    } else {
        console.error("Erro ao excluir contato");
    }
}

async function toggleFavorite(id) {
    const response = await fetch(`${SERVER_URL}/toggle-favorite/${id}`, {
        method: 'PUT'
    });

    if (response.ok) {
        loadFavorites();
    } else {
        console.error("Erro ao remover dos favoritos");
    }
}