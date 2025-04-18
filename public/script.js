//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
const SERVER_URL = "https://listadecontatos.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
    loadContacts();

    // Aplica a máscara nos campos de telefone
    formatPhone(document.getElementById('number'));       // Adicionar
    formatPhone(document.getElementById('editNumber'));   // Editar
});

async function loadContacts() {
    try {
        let response = await fetch(`${SERVER_URL}/contacts`);
        let contacts = await response.json();

        let contactList = document.getElementById("contactList");
        contactList.innerHTML = "";

        contacts.forEach(contact => {
            let contactCard = `
                <div class="col-md-4">
                    <div class="card mb-3 contact-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between align-items-start">
                                <h5 class="card-title">${contact.name}</h5>
                                <div class="dropdown">
                                    <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown">⋮</button>
                                    <ul class="dropdown-menu">
                                        <li>
                                            <button class="dropdown-item" onclick="toggleFavorite('${contact._id}', ${contact.favorite})">
                                                ${contact.favorite ? 'Remover dos Favoritos' : 'Adicionar aos Favoritos'}
                                            </button>
                                        </li>
                                        <li>
                                            <button class="dropdown-item" onclick="openEditModal('${contact._id}', '${contact.name}', '${contact.number}', '${contact.address}', '${contact.email}')">Editar</button>
                                        </li>
                                        <li>
                                            <button class="dropdown-item text-danger" onclick="deleteContact('${contact._id}')">Excluir</button>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <p class="card-text">📞 ${contact.number || 'Não informado'}</p>
                            <p class="card-text">🏠 ${contact.address || 'Não informado'}</p>
                            <p class="card-text">✉️ ${contact.email || 'Não informado'}</p>
                            ${contact.favorite ? '<span class="badge bg-warning text-dark">★ Favorito</span>' : ''}
                        </div>
                    </div>
                </div>`;
            contactList.innerHTML += contactCard;
        });
    } catch (error) {
        console.error("Erro ao carregar contatos:", error);
    }
}

document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    let contact = {
        name: document.getElementById('name').value,
        number: document.getElementById('number').value,
        address: document.getElementById('address').value,
        email: document.getElementById('email').value
    };

    let response = await fetch(`${SERVER_URL}/add-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contact)
    });

    if (response.ok) {
        loadContacts();
        document.getElementById('contactForm').reset();
        bootstrap.Modal.getInstance(document.getElementById('addContactModal')).hide();
    } else {
        console.error("Erro ao adicionar contato");
    }
});

async function deleteContact(id) {
    let response = await fetch(`${SERVER_URL}/delete-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    if (response.ok) {
        loadContacts(); // Atualiza a lista após excluir
    } else {
        console.error("Erro ao excluir contato");
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
        loadContacts();
        bootstrap.Modal.getInstance(document.getElementById('editContactModal')).hide();
    } else {
        console.error("Erro ao atualizar contato");
    }
});

// Favoritar/desfavoritar
async function toggleFavorite(id, currentStatus) {
    try {
        await fetch(`${SERVER_URL}/update-contact/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite: !currentStatus })
        });
        loadContacts(); // Recarrega a lista
    } catch (err) {
        console.error("Erro ao atualizar favorito:", err);
    }
}

// Função para formatar número de telefone
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
