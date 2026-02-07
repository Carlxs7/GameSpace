# Space Defender

Jogo de nave espacial no navegador. Controle sua nave, destrua inimigos e marque o máximo de pontos sem perder as 3 vidas.

![Space Defender](https://img.shields.io/badge/Game-Space%20Defender-00f5d4?style=for-the-badge)

## Como jogar

1. Abra o arquivo `index.html` no navegador (Chrome, Firefox, Edge, etc.).
2. Clique em **Iniciar Jogo** na tela inicial.
3. Use os controles abaixo para jogar.

### Controles

| Ação     | Teclas                          |
|----------|----------------------------------|
| Mover ←  | `←` (seta esquerda) ou `A`      |
| Mover →  | `→` (seta direita) ou `D`       |
| Atirar   | `Espaço`                         |

### Regras

- Você tem **3 vidas**.
- Cada inimigo destruído vale **10 pontos**.
- Se um inimigo passar pela parte de baixo da tela ou encostar na sua nave, você perde uma vida.
- Ao perder as 3 vidas, o jogo termina — clique em **Jogar de novo** para reiniciar.

## Tecnologias

- **HTML5** — estrutura e canvas
- **CSS3** — layout, tema escuro e tipografia (Orbitron, Share Tech Mono)
- **JavaScript (vanilla)** — lógica do jogo, sem dependências

O jogo roda inteiramente no navegador, sem servidor nem instalação.

## Estrutura do projeto

```
GameSpace/
├── index.html   # Página principal e canvas
├── style.css    # Estilos e tema do jogo
├── game.js      # Lógica do jogo (player, inimigos, tiros, colisões)
└── README.md    # Este arquivo
```

## Autor

**DevCarlxs** • [GitHub @Carlxs7](https://github.com/Carlxs7)

---

Divirta-se!
