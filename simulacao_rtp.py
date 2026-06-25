"""Simulacao de RTP do caca-niquel.

Prova, rodando 5 milhoes de giros, que o RTP (retorno ao jogador) e a
vantagem da casa batem com o que foi projetado na tabela de pagamentos.

A tabela aqui DEVE ser igual a de script.js.
"""

import random

# Mesmos 5 simbolos de script.js (aqui por nome, para o terminal).
SIMBOLOS = ["cereja", "limao", "sino", "diamante", "sete"]

PAGAMENTOS = {
    "cereja": 8,
    "limao": 12,
    "sino": 20,
    "diamante": 35,
    "sete": 44,
}


def rtp_teorico():
    """RTP exato calculado pela matematica (aposta de referencia = 1).

    Cada rolo sorteia 1 entre N simbolos de forma uniforme, entao a
    chance de uma trinca especifica e (1/N)^3. O RTP e a soma, sobre
    todos os simbolos, de (probabilidade da trinca) * (pagamento).
    """
    n = len(SIMBOLOS)
    prob_trinca_especifica = 1 / (n ** 3)
    return prob_trinca_especifica * sum(PAGAMENTOS.values())


def simular(giros, aposta=1, seed=None):
    """Roda 'giros' rodadas e devolve o RTP empirico (devolvido/apostado)."""
    rng = random.Random(seed)
    apostado = 0
    devolvido = 0
    for _ in range(giros):
        apostado += aposta
        rolos = [rng.choice(SIMBOLOS) for _ in range(3)]
        if rolos[0] == rolos[1] == rolos[2]:
            devolvido += PAGAMENTOS[rolos[0]] * aposta
    return devolvido / apostado


def main():
    giros = 5_000_000
    teorico = rtp_teorico()
    empirico = simular(giros, seed=42)

    print(f"Giros simulados:   {giros:,}")
    print(f"RTP teorico:       {teorico * 100:.2f}%")
    print(f"RTP empirico:      {empirico * 100:.2f}%")
    print(f"Vantagem da casa:  {(1 - teorico) * 100:.2f}%")

    tolerancia = 0.01
    diferenca = abs(empirico - teorico)
    if diferenca > tolerancia:
        print(f"ERRO: diferenca {diferenca:.4f} acima da tolerancia {tolerancia}")
        raise SystemExit(1)
    print("OK: RTP empirico bate com o teorico.")


if __name__ == "__main__":
    main()
