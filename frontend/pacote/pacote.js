const URL_API = 'http://localhost:3001';
const SILHUETA_URL = `${URL_API}/imagens/silhueta.png`;

let oQueEstaFazendo = '';
let pacote = null;
bloquearAtributos(true);

async function inicializar() {
    await carregarCategoria();
    await listar();
}

async function carregarCategoria() {
    const select = document.getElementById("selectId_categoria");
    try {
        const resposta = await fetch(`${URL_API}/categoria/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            select.innerHTML = '<option value="">-- Selecione uma categoria --</option>';
            data.categorias.forEach(c => {
                select.innerHTML += `<option value="${c.id_categoria}">${c.id_categoria} - ${c.nome_categoria}</option>`;
            });
        }
    } catch (erro) {
        select.innerHTML = '<option value="">Erro ao carregar categorias</option>';
    }
}

function carregarImagem(id) {
    const img = document.getElementById('imgPacote');
    if (!id) {
        img.src = SILHUETA_URL;
        return;
    }
    img.src = `${URL_API}/imagens/${id}.png?t=${new Date().getTime()}`;
    img.onerror = () => { img.src = SILHUETA_URL; };
}

function acionarUpload() {
    if (oQueEstaFazendo !== 'inserindo' && oQueEstaFazendo !== 'alterando') {
        mostrarAviso("Clique em Inserir ou Alterar primeiro para poder escolher uma imagem.");
        return;
    }
    document.getElementById('inputImagem').click();
}

function previewImagem() {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length > 0) {
        const url = URL.createObjectURL(inputFiles[0]);
        document.getElementById('imgPacote').src = url;
        mostrarAviso("Imagem escolhida! Clique em Salvar para concluir.");
    }
}

async function uploadImagemParaServidor(id) {
    const inputFiles = document.getElementById('inputImagem').files;
    if (inputFiles.length === 0) return;

    const formData = new FormData();
    formData.append('imagem', inputFiles[0]);

    try {
        await fetch(`${URL_API}/pacote/upload/${id}`, {
            method: 'POST',
            body: formData
        });
    } catch (erro) {
        console.error("Erro ao enviar imagem:", erro);
    }
}

async function procurePorChavePrimaria(chave) {
    try {
        const resposta = await fetch(`${URL_API}/pacote/${chave}`);
        const data = await resposta.json();
        return data.sucesso ? data.pacote : null;
    } catch (erro) {
        return null;
    }
}

async function procure() {
    const id_pacote = document.getElementById("inputId_pacote").value;
    if (isNaN(id_pacote) || !Number.isInteger(Number(id_pacote)) || id_pacote === "") {
        mostrarAviso("Precisa ser um número inteiro");
        return;
    }

    pacote = await procurePorChavePrimaria(id_pacote);
    oQueEstaFazendo = '';
    
    if (pacote) {
        mostrarDadospacote(pacote);
        carregarImagem(id_pacote);
        visibilidadeDosBotoes('inline', 'none', 'inline', 'inline', 'none');
        mostrarAviso("Achou no banco, pode alterar ou excluir");
    } else {
        limparAtributos();
        carregarImagem(null);
        visibilidadeDosBotoes('inline', 'inline', 'none', 'none', 'none');
        mostrarAviso("Não achou no banco, pode inserir");
    }
}

function inserir() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'inserindo';
    mostrarAviso("INSERINDO - Digite os atributos, escolha a imagem e clique em salvar");
}

function alterar() {
    bloquearAtributos(false);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'alterando';
    mostrarAviso("ALTERANDO - Digite os atributos, mude a imagem (opcional) e clique em salvar");
}

function excluir() {
    bloquearAtributos(true);
    visibilidadeDosBotoes('none', 'none', 'none', 'none', 'inline');
    oQueEstaFazendo = 'excluindo';
    mostrarAviso("EXCLUINDO - Clique em salvar para confirmar a exclusão");
}

async function salvar() {
    let id_pacote = document.getElementById("inputId_pacote").value;
    const nome_pacote = document.getElementById("inputDescricao_pacote").value;
    const id_categoria = document.getElementById("selectId_categoria").value || null;
    const preco_pacote = parseFloat(document.getElementById("inputpreco_pacote").value) || 0.0;
    const quantidade_estoque_pacote = parseInt(document.getElementById("inputQuantidade_estoque_pacote").value) || 0;
    
    const dadospacote = { id_pacote, nome_pacote, id_categoria, preco_pacote, quantidade_estoque_pacote };

    try {
        if (oQueEstaFazendo === 'inserindo') {
            await fetch(`${URL_API}/pacote`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadospacote) });
            await uploadImagemParaServidor(id_pacote);
            mostrarAviso("Inserido no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'alterando') {
            await fetch(`${URL_API}/pacote/${id_pacote}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(dadospacote) });
            await uploadImagemParaServidor(id_pacote);
            mostrarAviso("Alterado no Banco de Dados com sucesso!");
        } else if (oQueEstaFazendo === 'excluindo') {
            await fetch(`${URL_API}/pacote/${id_pacote}`, { method: 'DELETE' });
            carregarImagem(null);
            mostrarAviso("Excluído do Banco de Dados!");
        }

        visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
        limparAtributos();
        document.getElementById("inputId_pacote").value = "";
        listar();
    } catch (erro) {
        mostrarAviso("Erro ao efetuar operação no servidor.");
    }
}

async function listar() {
    try {
        const resposta = await fetch(`${URL_API}/pacote/listar`);
        const data = await resposta.json();
        if (data.sucesso) {
            let texto = "";
            for (let linha of data.pacotes) {
                const um = linha.id_categoria ? ` [${linha.id_categoria}]` : '';
                texto += `${linha.id_pacote} - ${linha.nome_pacote}${um} - Preço: R$ ${parseFloat(linha.preco_pacote).toFixed(2)}- Estoque: ${linha.quantidade_estoque_pacote} <br>`;
            }
            document.getElementById("outputSaida").innerHTML = texto || "Nenhum pacote cadastrado.";
        }
    } catch (erro) {
        document.getElementById("outputSaida").innerHTML = "Servidor offline.";
    }
}

function cancelarOperacao() {
    limparAtributos();
    carregarImagem(null);
    bloquearAtributos(true);
    visibilidadeDosBotoes('inline', 'none', 'none', 'none', 'none');
    mostrarAviso("Cancelou a operação");
}

function mostrarAviso(mensagem) {
    document.getElementById("divAviso").innerHTML = mensagem;
}

function mostrarDadospacote(p) {
    document.getElementById("inputId_pacote").value = p.id_pacote;
    document.getElementById("inputDescricao_pacote").value = p.nome_pacote;
    document.getElementById("selectId_categoria").value = p.id_categoria || "";
    document.getElementById("inputpreco_pacote").value = p.preco_pacote;
    document.getElementById("inputQuantidade_estoque_pacote").value = p.quantidade_estoque_pacote;
    
    bloquearAtributos(true);
}

function limparAtributos() {
    pacote = null;
    oQueEstaFazendo = '';
    document.getElementById("inputDescricao_pacote").value = "";
    document.getElementById("selectId_categoria").value = "";
    document.getElementById("inputpreco_pacote").value = "";
    document.getElementById("inputQuantidade_estoque_pacote").value = "";
    document.getElementById("inputImagem").value = "";
    bloquearAtributos(true);
}

function bloquearAtributos(soLeitura) {
    document.getElementById("inputId_pacote").readOnly = !soLeitura;
    document.getElementById("inputDescricao_pacote").readOnly = soLeitura;
    document.getElementById("selectId_categoria").disabled = soLeitura;
    document.getElementById("inputpreco_pacote").readOnly = soLeitura;
    document.getElementById("inputQuantidade_estoque_pacote").readOnly = soLeitura;
    
}

function visibilidadeDosBotoes(btP, btI, btA, btE, btS) {
    document.getElementById("btProcure").style.display = btP;
    document.getElementById("btInserir").style.display = btI;
    document.getElementById("btAlterar").style.display = btA;
    document.getElementById("btExcluir").style.display = btE;
    document.getElementById("btSalvar").style.display = btS;
    document.getElementById("btCancelar").style.display = btS;
}