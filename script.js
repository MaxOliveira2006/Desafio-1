
// DADOS DA CONTA


const conta = {
    nome: "Carlos Oliveira",
    saldo: 5000,

    descontar(valor) {
        this.saldo = this.saldo - valor;
    }
};

const transferencias = [];



// ELEMENTOS DO HTML


const form = document.querySelector("#formTransferencia");
const tipoChave = document.querySelector("#tipoChave");
const chavePix = document.querySelector("#chavePix");
const valorTransferencia = document.querySelector("#valorTransferencia");

const saldoConta = document.querySelector("#saldoConta");
const ultimaAtividade = document.querySelector("#ultimaAtividade");
const mensagem = document.querySelector("#mensagem");

const quantidadeTransferencias =
    document.querySelector("#quantidadeTransferencias");

const estadoHistorico =
    document.querySelector("#estadoHistorico");

const listaTransferencias =
    document.querySelector("#listaTransferencias");



// VALIDAR VALOR


function validarValor(valor) {

    if (typeof valor !== "number" || isNaN(valor)) {
        throw new TypeError("O valor deve ser numérico.");
    }

    if (valor <= 0) {
        throw new Error("O valor deve ser maior que zero.");
    }

    if (valor > conta.saldo) {
        throw new Error("Saldo insuficiente.");
    }
}



// VALIDAR CHAVE PIX


function validarChavePix(tipo, chave) {

    let valida = false;

    switch (tipo) {

        case "cpf_cnpj":

            let documento = chave
                .replaceAll(".", "")
                .replaceAll("-", "")
                .replaceAll("/", "");

            valida =
                documento.length === 11 ||
                documento.length === 14;

            break;


        case "email":

            valida =
                chave.includes("@") &&
                chave.includes(".");

            break;


        case "celular":

            let celular = chave
                .replaceAll("(", "")
                .replaceAll(")", "")
                .replaceAll("-", "")
                .replaceAll(" ", "");

            valida =
                celular.length === 10 ||
                celular.length === 11;

            break;


        case "aleatoria":

            valida = chave.length >= 10;

            break;


        default:

            throw new Error("Selecione o tipo da chave Pix.");
    }


    if (valida === false) {
        throw new Error("Chave Pix inválida.");
    }
}



// CRIAR TRANSFERÊNCIA


function criarTransferencia(tipo, chave, valor) {

    return {
        tipo: tipo,
        chave: chave,
        valor: valor,
        data: new Date()
    };
}



// REALIZAR TRANSFERÊNCIA


function realizarTransferencia(conta, tipo, chave, valor) {

    validarValor(valor);
    validarChavePix(tipo, chave);

    conta.descontar(valor);

    const transferencia =
        criarTransferencia(tipo, chave, valor);

    transferencias.push(transferencia);

    return transferencia;
}



// MOSTRAR MENSAGEM


function mostrarMensagem(texto, tipo) {

    mensagem.textContent = texto;

    mensagem.className = "message " + tipo;

    mensagem.hidden = false;
}



// ATUALIZAR HISTÓRICO


function atualizarHistorico() {

    listaTransferencias.textContent = "";

    for (const transferencia of transferencias) {

        const { tipo, chave, valor, data } = transferencia;

        const item = document.createElement("div");
        item.className = "history-item";


        const principal = document.createElement("div");
        principal.className = "history-main";


        const chaveElemento = document.createElement("p");
        chaveElemento.className = "history-key";
        chaveElemento.textContent = chave;


        const dados = document.createElement("p");
        dados.className = "history-meta";

        dados.textContent =
            tipo + " - " + data.toLocaleDateString("pt-BR");


        const valorElemento = document.createElement("div");
        valorElemento.className = "history-value";

        valorElemento.textContent =
            valor.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });


        principal.appendChild(chaveElemento);
        principal.appendChild(dados);

        item.appendChild(principal);
        item.appendChild(valorElemento);

        listaTransferencias.appendChild(item);
    }


    estadoHistorico.hidden =
        transferencias.length > 0 ? true : false;


    quantidadeTransferencias.textContent =
        transferencias.length + " operações";
}



//  LAÇOS 


// FOR-IN
function mostrarPropriedades(transferencia) {

    for (const propriedade in transferencia) {
        console.log(
            propriedade,
            transferencia[propriedade]
        );
    }
}


// FOR-OF + CONTINUE
function analisarHistorico() {

    for (const transferencia of transferencias) {

        if (transferencia.valor <= 0) {
            continue;
        }

        console.log(
            "Transferência:",
            transferencia.valor
        );
    }
}


// WHILE + BREAK
function testarValores() {

    const valores = [100, 200, -50];

    let i = 0;

    while (i < valores.length) {

        if (valores[i] <= 0) {
            break;
        }

        console.log("Valor de teste:", valores[i]);

        i++;
    }
}


// DO-WHILE
function testeDoWhile() {

    let i = 0;

    do {

        console.log("Teste do-while");

        i++;

    } while (i < 1);
}



// FORMULÁRIO


form.addEventListener("submit", function (event) {

    event.preventDefault();

    const tipo = tipoChave.value;
    const chave = chavePix.value;
    const valor = Number(valorTransferencia.value);


    try {

        const transferencia =
            realizarTransferencia(
                conta,
                tipo,
                chave,
                valor
            );


        saldoConta.textContent =
            conta.saldo.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL"
            });


        ultimaAtividade.textContent =
            "Transferência realizada em " +
            transferencia.data.toLocaleDateString("pt-BR");


        atualizarHistorico();


        mostrarMensagem(
            "Transferência realizada com sucesso.",
            "success"
        );


        mostrarPropriedades(transferencia);
        analisarHistorico();


    } catch (error) {

        mostrarMensagem(
            error.message,
            "error"
        );


    } finally {

        console.log(
            "Tentativa de transferência finalizada."
        );
    }
});



