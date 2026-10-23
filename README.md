# 🚀 Laboratório Interativo de Algoritmos de Ordenação

Visualizador interativo e animado de algoritmos de ordenação, desenvolvido para a disciplina de **Estrutura de Dados** do Curso Técnico em Informática.

Feito com **HTML, CSS e JavaScript puro** (sem frameworks e sem etapa de build), o projeto roda direto no navegador e está pronto para ser publicado no **GitHub Pages**.

## ✨ Funcionalidades

- **Entrada flexível:** digite números separados por vírgula ou espaço (positivos, negativos, decimais com ponto e repetidos), com limite de 50 itens.
- **Exemplos rápidos:** sequências prontas e um gerador de 12 números aleatórios.
- **Três algoritmos:** Bubble Sort, Selection Sort e Insertion Sort.
- **Sentido da ordenação:** crescente ou decrescente.
- **Animação em tempo real:** gráfico de barras com linha de zero (valores negativos crescem para baixo).
- **Velocidade ajustável:** de 50 ms a 1000 ms por passo, inclusive durante a execução.
- **Pausar e retomar** a animação a qualquer momento.
- **Estatísticas:** total de comparações, total de trocas e tempo decorrido.
- **Guia técnico** com a descrição e a complexidade de cada algoritmo.

## 🎨 Legenda de cores

| Cor | Significado |
|-----|-------------|
| 🟣 Roxo | Estado normal |
| 🟡 Amarelo | Elemento sendo comparado |
| 🔵 Ciano | Menor/maior elemento atual (Selection Sort) ou elemento sendo inserido (Insertion Sort) |
| 🩷 Rosa | Troca (swap) |
| 🟢 Verde | Elemento já ordenado |

## 🧠 Algoritmos implementados

| Algoritmo | Ideia principal | Complexidade (pior caso) |
|-----------|-----------------|--------------------------|
| **Bubble Sort** | Compara pares adjacentes e troca os que estão fora de ordem; o maior elemento "flutua" para o fim a cada passagem. | O(n²) |
| **Selection Sort** | Seleciona o menor (ou maior) elemento da parte não ordenada e o coloca na primeira posição livre. | O(n²) |
| **Insertion Sort** | Constrói a lista ordenada item a item, deslocando os maiores para inserir o elemento na posição correta. | O(n²) |

> **Observação:** no Insertion Sort, cada deslocamento de elemento é contado como uma troca no painel de estatísticas.

## ▶️ Como usar

1. Digite uma sequência de números ou escolha um exemplo rápido.
2. Selecione o algoritmo e o sentido da ordenação.
3. Ajuste a velocidade da animação.
4. Clique em **🚀 Executar Ordenação** e acompanhe o gráfico e as estatísticas.
5. Use **⏸️ Pausar** para observar um passo com calma.

Durante a execução, os campos de entrada e os botões de exemplo ficam desabilitados para evitar execuções simultâneas.

## 💻 Executando localmente

Não há dependências para instalar. Basta clonar o repositório e abrir o `index.html` no navegador:

```bash
git clone https://github.com/<seu-usuario>/laboratorio-ordenacao.git
cd laboratorio-ordenacao
# abra o index.html no navegador (duplo clique ou:)
python3 -m http.server 8000   # opcional, e acesse http://localhost:8000
```

> O Tailwind CSS e as fontes do Google são carregados por CDN, portanto é necessária conexão com a internet.

## 🌐 Publicando no GitHub Pages

1. Envie os arquivos para um repositório no GitHub.
2. Vá em **Settings → Pages**.
3. Em **Build and deployment**, escolha **Deploy from a branch**.
4. Selecione a branch `main` e a pasta `/ (root)`, e clique em **Save**.
5. Após alguns instantes, o site estará disponível em `https://<seu-usuario>.github.io/laboratorio-ordenacao/`.

## 📁 Estrutura do projeto

```
laboratorio-ordenacao/
├── index.html   # Estrutura da página e painel de controle
├── style.css    # Estilos customizados (efeito glass, brilho dos botões)
├── script.js    # Lógica, animação e algoritmos de ordenação
└── README.md
```

## 🛠️ Tecnologias

- HTML5
- CSS3
- JavaScript (ES6+, `async/await`)
- [Tailwind CSS](https://tailwindcss.com/) via CDN
- [Google Fonts](https://fonts.google.com/) (Inter e Poppins)

## 🗺️ Próximos passos

- [ ] Implementar o **Quick Sort** com visualização do pivô e das partições.
- [ ] Implementar o **Merge Sort** com visualização da divisão e da intercalação.
- [ ] Adicionar execução passo a passo (avançar/voltar).
- [ ] Permitir comparar dois algoritmos lado a lado.
