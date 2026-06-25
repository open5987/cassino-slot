// ============================================================
// Caça-Níquel — lógica do jogo (fichas fictícias)
// ============================================================
// ATENÇÃO (regra de ouro de cassino): aqui o saldo e o sorteio
// vivem no NAVEGADOR. Isso é INSEGURO de propósito — serve só
// para aprender. Qualquer pessoa pode abrir o F12 e mudar o
// saldo. Num produto real, saldo e RNG ficam no SERVIDOR, que
// é o único dono do dinheiro.
// ============================================================

// Símbolos dos rolos (sorteio uniforme entre eles).
const SIMBOLOS = ["🍒", "🍋", "🔔", "💎", "7️⃣"];

// Tabela de pagamentos: 3 iguais paga (multiplicador × aposta).
// IMPORTANTE: deve ser igual à de simulacao_rtp.py.
const PAGAMENTOS = {
  "🍒": 8,
  "🍋": 12,
  "🔔": 20,
  "💎": 35,
  "7️⃣": 44,
};

const SALDO_INICIAL = 100;
const APOSTAS = [1, 5, 10];

let saldo = carregarSaldo();
let indiceAposta = 1; // começa na aposta de 5

// ---- Persistência simples (localStorage) ----
function carregarSaldo() {
  const salvo = Number(localStorage.getItem("saldo"));
  return Number.isFinite(salvo) && salvo > 0 ? salvo : SALDO_INICIAL;
}
function salvarSaldo() {
  localStorage.setItem("saldo", String(saldo));
}

// ---- Sorteia um símbolo (RNG) ----
function sortearSimbolo() {
  const i = Math.floor(Math.random() * SIMBOLOS.length);
  return SIMBOLOS[i];
}

// ---- Calcula o prêmio de um resultado ----
function calcularPremio(rolos, aposta) {
  const [a, b, c] = rolos;
  if (a === b && b === c) {
    return PAGAMENTOS[a] * aposta;
  }
  return 0;
}

// ---- Ação de girar ----
function girar() {
  const aposta = APOSTAS[indiceAposta];
  if (aposta > saldo) {
    mostrarMensagem("Saldo insuficiente para essa aposta 😬");
    return;
  }

  saldo -= aposta; // a aposta sai primeiro

  const resultado = [sortearSimbolo(), sortearSimbolo(), sortearSimbolo()];
  document.getElementById("rolo0").textContent = resultado[0];
  document.getElementById("rolo1").textContent = resultado[1];
  document.getElementById("rolo2").textContent = resultado[2];

  const premio = calcularPremio(resultado, aposta);
  if (premio > 0) {
    saldo += premio;
    mostrarMensagem(`🎉 Você ganhou ${premio} fichas!`);
  } else {
    mostrarMensagem("Não foi dessa vez. Gire de novo!");
  }

  atualizarTela();
  salvarSaldo();
}

// ---- Interface ----
function mostrarMensagem(txt) {
  document.getElementById("mensagem").textContent = txt;
}

function atualizarTela() {
  document.getElementById("saldo").textContent = saldo;
  document.getElementById("valorAposta").textContent = APOSTAS[indiceAposta];
  document.getElementById("girar").disabled = APOSTAS[indiceAposta] > saldo;
}

function mudarAposta(delta) {
  const novo = indiceAposta + delta;
  if (novo >= 0 && novo < APOSTAS.length) {
    indiceAposta = novo;
    atualizarTela();
  }
}

function resetar() {
  saldo = SALDO_INICIAL;
  salvarSaldo();
  atualizarTela();
  mostrarMensagem("Saldo resetado para 100 🪙");
}

// ---- RTP teórico (para exibir e ensinar) ----
function rtpTeorico() {
  const n = SIMBOLOS.length;
  const probTrincaEspecifica = 1 / (n * n * n);
  let soma = 0;
  for (const s of SIMBOLOS) soma += PAGAMENTOS[s];
  return probTrincaEspecifica * soma;
}

// ---- Monta a tabela de pagamentos na tela ----
function montarTabela() {
  const tbody = document.getElementById("tabelaPagamentos");
  for (const s of SIMBOLOS) {
    const tr = document.createElement("tr");
    const combo = document.createElement("td");
    combo.textContent = `${s} ${s} ${s}`;
    const valor = document.createElement("td");
    valor.textContent = `${PAGAMENTOS[s]}×`;
    tr.append(combo, valor);
    tbody.appendChild(tr);
  }
  const rtp = rtpTeorico();
  document.getElementById("rtp").textContent =
    `RTP teórico: ${(rtp * 100).toFixed(1)}% — vantagem da casa: ${((1 - rtp) * 100).toFixed(1)}%`;
}

// ---- Liga os botões ----
document.getElementById("girar").addEventListener("click", girar);
document.getElementById("mais").addEventListener("click", () => mudarAposta(1));
document.getElementById("menos").addEventListener("click", () => mudarAposta(-1));
document.getElementById("reset").addEventListener("click", resetar);

montarTabela();
atualizarTela();
