const SERVER_URL = "https://listadecontatos.onrender.com";

document.addEventListener("DOMContentLoaded", loadFavorites);

async function loadFavorites() {
    try {
        let response = await fetch(`${SERVER_URL}/contacts`);
        let contacts = await response.json();

        let favoriteList = document.getElementById("favoriteList");
        favoriteList.innerHTML = "";

        contacts.forEach(contact => {
            if (contact.favorite) {
                let contactCard = `
                    <div class="col-md-4">
                        <div class="card mb-3 contact-card">
                            <div class="card-body">
                                <div class="d-flex justify-content-between">
                                    <h5 class="card-title">${contact.name}</h5>
                                    <div class="dropdown">
                                        <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown">⋮</button>
                                        <ul class="dropdown-menu">
                                            <li><button class="dropdown-item" onclick="openEditModal('${contact._id}', '${contact.name}', '${contact.number}', '${contact.address}', '${contact.email}')">Editar</button></li>
                                            <li><button class="dropdown-item text-warning" onclick="toggleFavorite('${contact._id}', false)">Retirar dos Favoritos</button></li>
                                            <li><button class="dropdown-item text-danger" onclick="deleteContact('${contact._id}')">Excluir</button></li>
                                        </ul>
                                    </div>
                                </div>
                                <p class="card-text">📞 ${contact.number || 'Não informado'}</p>
                                <p class="card-text">🏠 ${contact.address || 'Não informado'}</p>
                                <p class="card-text">✉️ ${contact.email || 'Não informado'}</p>
                            </div>
                        </div>
                    </div>`;
                favoriteList.innerHTML += contactCard;
            }
        });
    } catch (error) {
        console.error("Erro ao carregar favoritos:", error);
    }
}

async function toggleFavorite(id, isFavorite) {
    try {
        await fetch(`${SERVER_URL}/update-contact/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite: isFavorite })
        });
        loadFavorites();
    } catch (error) {
        console.error("Erro ao atualizar favorito:", error);
    }
}

async function deleteContact(id) {
    try {
        await fetch(`${SERVER_URL}/delete-contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id })
        });
        loadFavorites();
    } catch (error) {
        console.error("Erro ao excluir contato:", error);
    }
}

function openEditModal(id, name, number, address, email) {
    document.getElementById('editId').value = id;
    document.getElementById('editName').value = name;
    document.getElementById('editNumber').value = number;
    document.getElementById('editAddress').value = address;
    document.getElementById('editEmail').value = email;

    new bootstrap.Modal(document.getElementById('editContactModal')).show();
}

document.getElementById('editForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const id = document.getElementById('editId').value;

    const updatedContact = {
        name: document.getElementById('editName').value,
        number: document.getElementById('editNumber').value,
        address: document.getElementById('editAddress').value,
        email: document.getElementById('editEmail').value
    };

    let response = await fetch(`${SERVER_URL}/update-contact/${id}`, {
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