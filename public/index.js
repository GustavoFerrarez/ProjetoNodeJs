listar();

function novo() {
    document.getElementById("conteudo").style.display = "none";
    document.getElementById("formulario").style.display = "block";
    
    document.getElementById("txtid").value = "";
    document.getElementById("txtnome").value = "";
    document.getElementById("txttelefone").value = "";
    document.getElementById("txtemail").value = "";
}

function cancelar() {
    document.getElementById("conteudo").style.display = "block";
    document.getElementById("formulario").style.display = "none";
}

function salvar() {
    const id = document.getElementById("txtid").value;

    if (id === "") {
        inserir();
    } else {
        atualizar();
    }
}

async function listar() {
    document.getElementById("conteudo").innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Carregando...</span>
            </div>
            <p class="mt-2 text-muted">Carregando dados...</p>
        </div>
    `;

    const resp = await fetch("/pessoa");
    const dados = await resp.json();

    let html = `
        <div class="d-flex justify-content-between align-items-center mb-4">
            <div>
                <h2 class="mb-1">
                    <i class="bi bi-list-ul me-2"></i>
                    Lista de Pessoas
                </h2>
                <small class="text-muted">${dados.length} registro(s) encontrado(s)</small>
            </div>
            <button class="btn btn-primary px-4 py-2" onclick="novo()">
                <i class="bi bi-plus-lg me-1"></i> Novo Cadastro
            </button>
        </div>
    `;

    if (dados.length === 0) {
        html += `
            <div class="empty-state">
                <i class="bi bi-inbox"></i>
                <h4>Nenhuma pessoa cadastrada</h4>
                <p>Clique em "Novo Cadastro" para adicionar a primeira pessoa.</p>
            </div>
        `;
    } else {
        html += `
        <div class="table-responsive">
            <table class="table table-hover align-middle">
                <thead>
                    <tr>
                        <th><i class="bi bi-person me-1"></i> Nome</th>
                        <th><i class="bi bi-telephone me-1"></i> Telefone</th>
                        <th><i class="bi bi-envelope me-1"></i> Email</th>
                        <th class="text-center"><i class="bi bi-gear me-1"></i> Ações</th>
                    </tr>
                </thead>
                <tbody>
        `;

        for (let i = 0; i < dados.length; i++) {
            html += `
                <tr>
                    <td class="fw-medium">${dados[i].nome}</td>
                    <td>${dados[i].telefone}</td>
                    <td>${dados[i].email}</td>
                    <td class="text-center">
                        <div class="d-flex justify-content-center gap-2">
                            <button class="btn btn-warning btn-sm" onclick="editar(${dados[i].idpessoa})" title="Editar">
                                <i class="bi bi-pencil me-1"></i> Editar
                            </button>
                            <button class="btn btn-danger btn-sm" onclick="excluir(${dados[i].idpessoa})" title="Excluir">
                                <i class="bi bi-trash me-1"></i> Excluir
                            </button>
                        </div>
                    </td>
                </tr>
            `;
        }
        html += "</tbody></table></div>";
    }

    document.getElementById("conteudo").innerHTML = html;
}

async function inserir() {  
    document.getElementById("conteudo").innerHTML = `
        <div class="text-center py-4">
            <div class="spinner-border text-primary" role="status">
                <span class="visually-hidden">Salvando...</span>
            </div>
            <p class="mt-2 text-muted">Salvando dados...</p>
        </div>
    `;

    const novoObj = {
        nome: document.getElementById("txtnome").value,
        telefone: document.getElementById("txttelefone").value,
        email: document.getElementById("txtemail").value
    };

    await fetch("/pessoa", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(novoObj)
    });

    document.getElementById("conteudo").style.display = "block";
    document.getElementById("formulario").style.display = "none";
    
    listar();
}

async function atualizar() {
    const id = document.getElementById("txtid").value;

    const dados = {
        nome: document.getElementById("txtnome").value,
        telefone: document.getElementById("txttelefone").value,
        email: document.getElementById("txtemail").value
    };

    await fetch("/pessoa/" + id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(dados)
    });

    document.getElementById("conteudo").style.display = "block";
    document.getElementById("formulario").style.display = "none";

    listar();
}

async function editar(id) {
    const resp = await fetch("/pessoa/" + id);
    const dados = await resp.json();

    document.getElementById("txtid").value = dados.idpessoa;
    document.getElementById("txtnome").value = dados.nome;
    document.getElementById("txttelefone").value = dados.telefone;
    document.getElementById("txtemail").value = dados.email;

    document.getElementById("conteudo").style.display = "none";
    document.getElementById("formulario").style.display = "block";
}

async function excluir(id) {
    if (!confirm("Tem certeza que deseja excluir esta pessoa?\n\nEsta ação não pode ser desfeita.")) return;

    await fetch("/pessoa/" + id, {
        method: "DELETE"
    });

    listar();
}
