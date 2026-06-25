// ============================================================
// Dragão da Sorte — caça-níquel temático (fichas fictícias)
// ============================================================
// Tema próprio (não usa marca de terceiros). Mecânica inspirada
// em slots populares: Wild que substitui símbolos + multiplicador.
//
// REGRA DE OURO (de novo!): saldo e sorteio vivem no NAVEGADOR.
// Isso é INSEGURO de propósito — só pra aprender. Em produto real,
// saldo e RNG ficam no SERVIDOR. Estes números batem com simulacao_rtp.py.
// ============================================================

// Símbolos do rolo: PESO = frequência; BASE = pagamento de 3 iguais.
const SIMBOLOS = [
  { id: "moeda",    emoji: "🪙", peso: 34, base: 6 },
  { id: "lanterna", emoji: "🏮", peso: 27, base: 9 },
  { id: "envelope", emoji: "🧧", peso: 20, base: 14 },
  { id: "saco",     emoji: "💰", peso: 12, base: 27 },
  { id: "jade",     emoji: "💎", peso: 5,  base: 70 },
  { id: "dragao",   emoji: "🐉", peso: 2,  base: 0 }, // WILD
];

const WILD = "dragao";
const MULT_POR_WILD = 2; // 1 dragão = ×2, 2 dragões = ×4
const JACKPOT = 350;     // 3 dragões
const SALDO_INICIAL = 100;
const APOSTAS = [1, 5, 10];

const EMOJI = Object.fromEntries(SIMBOLOS.map(s => [s.id, s.emoji]));
const BASE = Object.fromEntries(SIMBOLOS.map(s => [s.id, s.base]));
const TOTAL_PESO = SIMBOLOS.reduce((soma, s) => soma + s.peso, 0);

let saldo = carregarSaldo();
let indiceAposta = 1;
let girando = false;

// ---- Persistência ----
function carregarSaldo() {
  const salvo = Number(localStorage.getItem("saldoDragao"));
  return Number.isFinite(salvo) && salvo > 0 ? salvo : SALDO_INICIAL;
}
function salvarSaldo() {
  localStorage.setItem("saldoDragao", String(saldo));
}

// ---- Sorteio com PESOS (símbolos raros aparecem menos) ----
function sortearSimbolo() {
  let r = Math.random() * TOTAL_PESO;
  for (const s of SIMBOLOS) {
    if (r < s.peso) return s.id;
    r -= s.peso;
  }
  return SIMBOLOS[SIMBOLOS.length - 1].id;
}

// ---- Cálculo do prêmio (espelha premio() de simulacao_rtp.py) ----
function calcularPremio(rolos, aposta) {
  const wilds = rolos.filter(s => s === WILD).length;
  if (wilds === 3) return JACKPOT * aposta;
  const normais = rolos.filter(s => s !== WILD);
  const todosIguais = normais.every(s => s === normais[0]);
  if (todosIguais) {
    return BASE[normais[0]] * (MULT_POR_WILD ** wilds) * aposta;
  }
  return 0;
}

// ---- Giro com animação ----
function girar() {
  if (girando) return;
  const aposta = APOSTAS[indiceAposta];
  if (aposta > saldo) { mostrarMensagem("Saldo insuficiente para essa aposta 😬"); return; }

  girando = true;
  saldo -= aposta;
  mostrarMensagem("Girando...");
  atualizarTela();

  const resultado = [sortearSimbolo(), sortearSimbolo(), sortearSimbolo()];
  animarRolos(resultado, () => finalizarGiro(resultado, aposta));
}

function animarRolos(resultado, aoTerminar) {
  const elementos = [0, 1, 2].map(i => document.getElementById("rolo" + i));
  const ids = SIMBOLOS.map(s => s.id);
  elementos.forEach(e => e.classList.remove("vitoria"));
  const giros = elementos.map(e =>
    setInterval(() => {
      e.textContent = EMOJI[ids[Math.floor(Math.random() * ids.length)]];
    }, 60)
  );
  // os rolos param em sequência (cria antecipação)
  resultado.forEach((simId, i) => {
    setTimeout(() => {
      clearInterval(giros[i]);
      elementos[i].textContent = EMOJI[simId];
      if (i === resultado.length - 1) aoTerminar();
    }, 500 + i * 350);
  });
}

function finalizarGiro(resultado, aposta) {
  const premio = calcularPremio(resultado, aposta);
  const wilds = resultado.filter(s => s === WILD).length;

  if (premio > 0) {
    saldo += premio;
    if (wilds === 3) {
      mostrarMensagem(`🐉🐉🐉 JACKPOT DO DRAGÃO! +${premio} fichas!`);
    } else if (wilds > 0) {
      mostrarMensagem(`🐉 Dragão ×${MULT_POR_WILD ** wilds}! +${premio} fichas!`);
    } else {
      mostrarMensagem(`🎉 Você ganhou ${premio} fichas!`);
    }
    [0, 1, 2].forEach(i => document.getElementById("rolo" + i).classList.add("vitoria"));
  } else {
    mostrarMensagem("Não foi dessa vez. Gire de novo!");
  }

  girando = false;
  atualizarTela();
  salvarSaldo();
}

// ---- Interface ----
function mostrarMensagem(txt) { document.getElementById("mensagem").textContent = txt; }

function atualizarTela() {
  document.getElementById("saldo").textContent = saldo;
  document.getElementById("valorAposta").textContent = APOSTAS[indiceAposta];
  document.getElementById("girar").disabled = girando || APOSTAS[indiceAposta] > saldo;
}

function mudarAposta(delta) {
  if (girando) return;
  const novo = indiceAposta + delta;
  if (novo >= 0 && novo < APOSTAS.length) { indiceAposta = novo; atualizarTela(); }
}

function resetar() {
  if (girando) return;
  saldo = SALDO_INICIAL;
  salvarSaldo();
  atualizarTela();
  mostrarMensagem("Saldo resetado para 100 🪙");
}

// ---- RTP exato por enumeração (espelha rtp_exato() do Python) ----
function rtpExato() {
  const ids = SIMBOLOS.map(s => s.id);
  const prob = id => SIMBOLOS.find(s => s.id === id).peso / TOTAL_PESO;
  let rtp = 0;
  for (const a of ids) for (const b of ids) for (const c of ids) {
    rtp += prob(a) * prob(b) * prob(c) * calcularPremio([a, b, c], 1);
  }
  return rtp;
}

// ---- Tabela de pagamentos ----
function adicionarLinha(tbody, esquerda, direita) {
  const tr = document.createElement("tr");
  const c1 = document.createElement("td");
  c1.textContent = esquerda;
  const c2 = document.createElement("td");
  c2.textContent = direita;
  tr.append(c1, c2);
  tbody.appendChild(tr);
}

function montarTabela() {
  const tbody = document.getElementById("tabelaPagamentos");
  for (const s of SIMBOLOS) {
    if (s.id === WILD) continue;
    adicionarLinha(tbody, `${s.emoji} ${s.emoji} ${s.emoji}`, `${s.base}×`);
  }
  adicionarLinha(tbody, "🐉 substitui qualquer símbolo", "Wild");
  adicionarLinha(tbody, "🐉 na vitória multiplica", `×${MULT_POR_WILD} cada`);
  adicionarLinha(tbody, "🐉🐉🐉 jackpot", `${JACKPOT}×`);

  const rtp = rtpExato();
  document.getElementById("rtp").textContent =
    `RTP: ${(rtp * 100).toFixed(1)}% — vantagem da casa: ${((1 - rtp) * 100).toFixed(1)}%`;
}

// ---- Liga tudo ----
document.getElementById("girar").addEventListener("click", girar);
document.getElementById("mais").addEventListener("click", () => mudarAposta(1));
document.getElementById("menos").addEventListener("click", () => mudarAposta(-1));
document.getElementById("reset").addEventListener("click", resetar);

montarTabela();
atualizarTela();
