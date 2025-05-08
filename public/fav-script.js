//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
const SERVER_URL = "https://listadecontatos.onrender.com";
let isSorted = false;
let originalFavorites = [];

document.addEventListener("DOMContentLoaded", () => {
    loadFavorites();

    const sortBtn = document.getElementById('sortAlphaBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            isSorted = !isSorted;
            renderFavorites();
            sortBtn.textContent = isSorted ? "↻ Ordem Original" : "Ordenar A-Z";
        });
    }

    formatPhone(document.getElementById('editNumber'));
});

async function loadFavorites() {
    try {
        const response = await fetch(`${SERVER_URL}/favorites`);
        originalFavorites = await response.json();
        renderFavorites();
    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
        showToast("Erro ao carregar favoritos", "danger");
    }
}

function renderFavorites() {
    const favoriteList = document.getElementById("favoriteList");
    favoriteList.innerHTML = "";

    let favorites = [...originalFavorites];

    if (isSorted) {
        favorites.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }

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
        name: document.getElementById('editName').value.trim(),
        number: document.getElementById('editNumber').value.trim(),
        address: document.getElementById('editAddress').value.trim(),
        email: document.getElementById('editEmail').value.trim()
    };

    const campos = [
        updatedContact.name,
        updatedContact.number,
        updatedContact.address,
        updatedContact.email
    ];
    const algumPreenchido = campos.some(campo => campo.trim() !== "");
    
    if (!algumPreenchido) {
        showToast("Preencha pelo menos um campo para atualizar!", "danger");
        return;
    }

    try {
        const response = await fetch(`${SERVER_URL}/update-contact/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact)
        });

        if (response.ok) {
            loadFavorites();
            bootstrap.Modal.getInstance(document.getElementById('editContactModal')).hide();
            showToast("Contato atualizado com sucesso", "success");
        } else {
            showToast("Erro ao atualizar contato", "danger");
        }
    } catch (err) {
        console.error("Erro ao atualizar contato:", err);
        showToast("Erro ao atualizar contato", "danger");
    }
});

async function deleteContact(id) {
    try {
        const response = await fetch(`${SERVER_URL}/delete-contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });

        if (response.ok) {
            loadFavorites();
            showToast("Contato excluído com sucesso", "success");
        } else {
            showToast("Erro ao excluir contato", "danger");
        }
    } catch (err) {
        console.error("Erro ao excluir contato:", err);
        showToast("Erro ao excluir contato", "danger");
    }
}

async function toggleFavorite(id) {
    try {
        const response = await fetch(`${SERVER_URL}/toggle-favorite/${id}`, {
            method: 'PUT'
        });

        if (response.ok) {
            loadFavorites();
            showToast("Contato removido dos favoritos", "success");
        } else {
            showToast("Erro ao atualizar favorito", "danger");
        }
    } catch (err) {
        console.error("Erro ao atualizar favorito:", err);
        showToast("Erro ao atualizar favorito", "danger");
    }
}

function formatPhone(input) {
    input.addEventListener('input', function (e) {
        let value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) value = value.slice(0, 11);

        let formatted = '';
        if (value.length > 0) formatted += '(' + value.substring(0, 2);
        if (value.length >= 3) formatted += ') ' + value.substring(2, 7);
        if (value.length >= 8) formatted += '-' + value.substring(7, 11);

        e.target.value = formatted;
    });
}

function showToast(message, type = "info") {
    const toastContainer = document.getElementById('toast-container') || createToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${type} border-0 show`;
    toast.setAttribute('role', 'alert');
    toast.style.marginBottom = '10px';
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${message}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);

    setTimeout(() => {
        toast.remove();
    }, 4000);
}

function createToastContainer() {
    const container = document.createElement('div');
    container.id = 'toast-container';
    container.style.position = 'fixed';
    container.style.bottom = '20px';
    container.style.right = '20px';  // Mantido igual ao script.js
    container.style.zIndex = '9999';
    container.style.maxWidth = '300px';
    document.body.appendChild(container);
    return container;
}