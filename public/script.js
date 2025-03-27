const SERVER_URL = "https://listadecontatos.onrender.com"; // Substitua pela URL correta

document.addEventListener("DOMContentLoaded", loadContacts);

async function loadContacts() {
    try {
        let response = await fetch(`${SERVER_URL}/contacts`);
        let contacts = await response.json();
        console.log("Contatos carregados:", contacts); // Debug

        let contactList = document.getElementById("contactList");
        contactList.innerHTML = ""; // Limpa a lista antes de preencher

        contacts.forEach(contact => {
            let contactCard = `
                <div class="col-md-4">
                    <div class="card mb-3 contact-card">
                        <div class="card-body">
                            <div class="d-flex justify-content-between">
                                <h5 class="card-title">${contact.name}</h5>
                                <div class="dropdown">
                                    <button class="btn btn-light btn-sm" type="button" data-bs-toggle="dropdown">⋮</button>
                                    <ul class="dropdown-menu">
                                        <li><button class="dropdown-item text-danger" onclick="deleteContact(this, '${contact.name}')">Excluir</button></li>
                                    </ul>
                                </div>
                            </div>
                            <p class="card-text">📞 ${contact.number || 'Não informado'}</p>
                            <p class="card-text">🏠 ${contact.address || 'Não informado'}</p>
                            <p class="card-text">✉️ ${contact.email || 'Não informado'}</p>
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
        loadContacts(); // Recarrega a lista após adicionar contato
        document.getElementById('contactForm').reset();
        let modal = new bootstrap.Modal(document.getElementById('addContactModal'));
        modal.hide();
    } else {
        console.error("Erro ao adicionar contato");
    }
});

async function deleteContact(button, name) {
    let response = await fetch(`${SERVER_URL}/delete-contact`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name })
    });

    if (response.ok) {
        loadContacts(); // Atualiza a lista após excluir
    } else {
        console.error("Erro ao excluir contato");
    }
}
