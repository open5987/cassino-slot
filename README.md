# 🐉 Dragão da Sorte — caça-níquel temático (fichas fictícias)

Segundo jogo do projeto de estudo. Tema **próprio** (não usa marca de terceiros),
inspirado nas mecânicas de slots populares: **Wild + multiplicador**.
**Fichas fictícias, sem dinheiro real.**

> ⚠️ **Aviso legal:** projeto educacional com saldo fictício. Cassino com dinheiro real
> no Brasil é atividade regulada (Lei 14.790/2023) e exige autorização federal. Hospedar
> o servidor no exterior **não** torna legal atender jogadores brasileiros.

## Como jogar

Abra `index.html` no navegador. Ajuste a aposta e clique em **GIRAR**. Alinhe 3 símbolos
iguais na linha. O 🐉 (Dragão) é **Wild**: substitui qualquer símbolo e, quando participa
de uma vitória, **multiplica** o prêmio (×2 por dragão). Três dragões = **jackpot**.

## Novidades em relação ao caça-níquel anterior

- 🐉 **Símbolo Wild** que substitui qualquer outro
- ✖️ **Multiplicador** quando o dragão participa da vitória
- ⚖️ **Rolos com pesos** (símbolos raros pagam mais) — como em slots de verdade
- 🎞️ **Animação** de giro com parada sequencial (antecipação) e brilho na vitória

## A matemática

- **RTP ~94,7%** → **vantagem da casa ~5,3%**
- `simulacao_rtp.py` calcula o RTP **exato** enumerando as 216 combinações e confere com
  uma simulação de Monte Carlo de 2 milhões de giros.

```bash
python simulacao_rtp.py
```

## ⚠️ Regra de ouro (limitação proposital)

Saldo e sorteio vivem no **navegador** (`localStorage` + `Math.random`) — inseguro de
propósito, só pra aprender. Num produto real, saldo e RNG vivem no **servidor**, dono
único do dinheiro. Essa é a próxima fase.
