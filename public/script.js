//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
//O SITE ESTÁ RODANDO NA HOST ONRENDER COM O BANCO DE DADOS MONGODB:   https://listadecontatos.onrender.com/
const SERVER_URL = "https://listadecontatos.onrender.com";
let isSorted = false; // Controla o estado da ordenação
let originalContacts = []; // Armazena os contatos na ordem original

document.addEventListener("DOMContentLoaded", () => {
    loadContacts();

    // Aplica a máscara nos campos de telefone
    formatPhone(document.getElementById('number'));       // Adicionar
    formatPhone(document.getElementById('editNumber'));   // Editar

    // Botão de ordenação A-Z / ordem original
    const sortBtn = document.getElementById('sortAlphaBtn');
    if (sortBtn) {
        sortBtn.addEventListener('click', () => {
            isSorted = !isSorted;
            renderContacts();
            sortBtn.textContent = isSorted ? "↻ Ordem Original" : "Ordenar A-Z";
        });
    }
});

async function loadContacts() {
    try {
        let response = await fetch(`${SERVER_URL}/contacts`);
        let contacts = await response.json();

        originalContacts = contacts;
        renderContacts();
    } catch (error) {
        console.error("Erro ao carregar contatos:", error);
    }
}

function renderContacts() {
    let contacts = [...originalContacts]; // Faz uma cópia da lista

    if (isSorted) {
        contacts.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'));
    }

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
}

document.getElementById('contactForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    let name = document.getElementById('name').value.trim();
    let number = document.getElementById('number').value.trim();
    let address = document.getElementById('address').value.trim();
    let email = document.getElementById('email').value.trim();

    if (!name || !number || !address || !email) {
        alert("Por favor, preencha todos os campos.");
        return;
    }

    let contact = { name, number, address, email };

    try {
        let response = await fetch(`${SERVER_URL}/add-contact`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(contact)
        });

        if (response.ok) {
            loadContacts();
            document.getElementById('contactForm').reset();
            bootstrap.Modal.getInstance(document.getElementById('addContactModal')).hide();
            alert("Contato salvo com sucesso!");
        } else {
            let errorData = await response.json();
            alert("Erro ao salvar contato: " + (errorData.message || "Erro desconhecido."));
        }
    } catch (err) {
        console.error("Erro ao adicionar contato:", err);
        alert("Erro ao salvar contato. Verifique sua conexão ou tente novamente mais tarde.");
    }
});

async function deleteContact(id) {
    let response = await fetch(`${SERVER_URL}/delete-contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id })
    });

    if (response.ok) {
        loadContacts();
    } else {
        console.error("Erro ao excluir contato");
        alert("Erro ao excluir contato.");
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
    const name = document.getElementById('editName').value.trim();
    const number = document.getElementById('editNumber').value.trim();
    const address = document.getElementById('editAddress').value.trim();
    const email = document.getElementById('editEmail').value.trim();

    if (!name || !number || !address || !email) {
        alert("Por favor, preencha todos os campos para editar o contato.");
        return;
    }

    const updatedContact = { name, number, address, email };

    try {
        let response = await fetch(`${SERVER_URL}/update-contact/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedContact)
        });

        if (response.ok) {
            loadContacts();
            bootstrap.Modal.getInstance(document.getElementById('editContactModal')).hide();
            alert("Contato atualizado com sucesso!");
        } else {
            let errorData = await response.json();
            alert("Erro ao atualizar contato: " + (errorData.message || "Erro desconhecido."));
        }
    } catch (err) {
        console.error("Erro ao atualizar contato:", err);
        alert("Erro ao atualizar contato. Verifique sua conexão.");
    }
});

async function toggleFavorite(id, currentStatus) {
    try {
        await fetch(`${SERVER_URL}/update-contact/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ favorite: !currentStatus })
        });
        loadContacts();
    } catch (err) {
        console.error("Erro ao atualizar favorito:", err);
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