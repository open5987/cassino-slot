# 🎰 cassino-slot — Caça-Níquel (fichas fictícias)

Primeiro jogo do projeto de estudo de cassino online. **Fichas fictícias, sem dinheiro real.**

> ⚠️ **Aviso legal:** este é um projeto educacional com saldo fictício. Cassino com
> dinheiro real no Brasil é atividade regulada (Lei 14.790/2023) e exige autorização
> federal. Nada aqui envolve aposta real.

## Como jogar

Abra o arquivo `index.html` no navegador (duplo clique já funciona). Escolha a aposta,
clique em **GIRAR** e tente alinhar 3 símbolos iguais.

## A matemática (o que dá pra aprender aqui)

- **RTP (Return to Player):** quanto o jogo devolve, em média, ao jogador.
- **Vantagem da casa:** `100% − RTP`. É o que garante o lucro do cassino no longo prazo.
- `simulacao_rtp.py` roda 5 milhões de giros e **prova** que o RTP real bate com o projetado.

```bash
python simulacao_rtp.py
```

Saída esperada: RTP em torno de **95,2%** (vantagem da casa ~4,8%).

## ⚠️ Regra de ouro (e limitação desta versão)

Nesta versão o **saldo e o sorteio ficam no navegador** (`localStorage` + `Math.random`).
Isso é **inseguro de propósito** — qualquer um pode editar o saldo pelo F12. Está assim
só para aprender. Num produto de verdade, **saldo e RNG vivem no servidor**, que é o
único dono do dinheiro. Essa é a próxima fase do projeto.
