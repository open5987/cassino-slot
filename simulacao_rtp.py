"""Matematica do caca-niquel 'Dragao da Sorte'.

Mecanica (1 linha, 3 rolos, rolos com PESOS diferentes):
  - Simbolos normais pagam quando saem 3 iguais.
  - O Dragao (WILD) substitui qualquer simbolo para fechar a trinca.
  - Cada Dragao na linha multiplica o premio (1 dragao = x2, 2 = x4).
  - Tres dragoes = JACKPOT.

Como o premio depende de wilds/multiplicadores, o RTP e calculado de
forma EXATA enumerando todas as 6^3 = 216 combinacoes, cada uma pesada
pela sua probabilidade. Uma simulacao de Monte Carlo confirma o numero.

Esta tabela DEVE ser igual a de script.js.
"""

import itertools
import random

# Peso de cada simbolo em cada rolo (quanto maior, mais comum).
PESOS = {
    "moeda": 34,
    "lanterna": 27,
    "envelope": 20,
    "saco": 12,
    "jade": 5,
    "dragao": 2,  # WILD, raro
}

# Pagamento de 3 iguais (multiplicador da aposta), sem contar wild.
BASE = {
    "moeda": 6,
    "lanterna": 9,
    "envelope": 14,
    "saco": 27,
    "jade": 70,
}

WILD = "dragao"
MULT_POR_WILD = 2   # 1 dragao na linha -> x2, 2 dragoes -> x4
JACKPOT = 350       # tres dragoes

SIMBOLOS = list(PESOS.keys())
TOTAL_PESO = sum(PESOS.values())


def premio(rolos, aposta=1):
    """Premio de um resultado de 3 rolos (lista de simbolos)."""
    w = rolos.count(WILD)
    if w == 3:
        return JACKPOT * aposta
    normais = [s for s in rolos if s != WILD]
    # trinca (com wilds substituindo) so existe se os normais forem iguais
    if len(set(normais)) == 1:
        simbolo = normais[0]
        return BASE[simbolo] * (MULT_POR_WILD ** w) * aposta
    return 0


def prob(simbolo):
    return PESOS[simbolo] / TOTAL_PESO


def rtp_exato():
    """RTP exato: soma, sobre as 216 combinacoes, de prob * premio."""
    rtp = 0.0
    for combo in itertools.product(SIMBOLOS, repeat=3):
        p = prob(combo[0]) * prob(combo[1]) * prob(combo[2])
        rtp += p * premio(list(combo), 1)
    return rtp


def simular(giros, seed=42):
    """RTP empirico por Monte Carlo (rolos sorteados pelos pesos)."""
    rng = random.Random(seed)
    pesos = [PESOS[s] for s in SIMBOLOS]
    apostado = devolvido = 0
    for _ in range(giros):
        apostado += 1
        rolos = rng.choices(SIMBOLOS, weights=pesos, k=3)
        devolvido += premio(rolos, 1)
    return devolvido / apostado


def main():
    exato = rtp_exato()
    giros = 2_000_000
    emp = simular(giros)

    print(f"RTP exato (enumeracao):  {exato * 100:.2f}%")
    print(f"RTP empirico ({giros:,}): {emp * 100:.2f}%")
    print(f"Vantagem da casa:        {(1 - exato) * 100:.2f}%")

    if abs(emp - exato) > 0.01:
        print("ERRO: simulacao nao bate com a enumeracao")
        raise SystemExit(1)
    print("OK: enumeracao e simulacao batem.")


if __name__ == "__main__":
    main()
