/**
 * ============================================================================
 * PROJETO INTEGRADOR: LABORATÓRIO INTERATIVO DE ALGORITMOS DE ORDENAÇÃO
 * Curso Técnico em Informática - Disciplina: Estrutura de Dados
 * Arquivo: script.js
 * 
 * OBJETIVO DO SCRIPT:
 * - Capturar e validar dados numéricos informados pelo visitante[cite: 4, 8].
 * - Processar a ordenação utilizando algoritmos implementados puramente em 
 *   JavaScript (sem o uso do método nativo Array.sort() na lógica principal)[cite: 6].
 * - Exibir métricas detalhadas (comparações, trocas e tempo de execução)[cite: 7].
 * - Garantir a interatividade da página sem recarregamento (Eventos do DOM)[cite: 4, 8].
 * ============================================================================
 */

'use strict'; // Ativa o modo estrito do JavaScript para evitar erros silenciosos de sintaxe

// ============================================================================
// SEÇÃO 1: IMPLEMENTAÇÃO DOS ALGORITMOS DE ORDENAÇÃO (LÓGICA PURA)
// ============================================================================

/**
 * Algoritmo 1: Bubble Sort (Ordenação por Bolha)
 * - Como funciona: Compara elementos adjacentes em pares e os faz "flutuar" para a posição correta[cite: 6].
 * - Tratamento: Funciona perfeitamente com números negativos, positivos e duplicados.
 * 
 * @param {Array<number>} vetorOriginal - O vetor de números brutos.
 * @param {string} sentido - 'crescente' ou 'decrescente'.
 * @returns {Object} Objeto contendo o vetor ordenado, número de comparações e trocas.
 */
function executarBubbleSort(vetorOriginal, sentido = 'crescente') {
    // Cria uma cópia rasa do vetor para evitar efeitos colaterais nos dados originais[cite: 7]
    const vetor = [...vetorOriginal];
    const tamanho = vetor.length;
    let comparacoes = 0;
    let trocas = 0;

    // Laço externo para controlar as passagens (percorre o vetor N-1 vezes)
    for (let i = 0; i < tamanho - 1; i++) {
        let houveTroca = false; // Otimização: se nenhuma troca ocorrer, o vetor já está ordenado

        // Laço interno para realizar as comparações adjacentes
        for (let j = 0; j < tamanho - 1 - i; j++) {
            comparacoes++;

            // Define a condição condicional com base no sentido escolhido pelo usuário
            const condicaoTroca = sentido === 'crescente' 
                ? vetor[j] > vetor[j + 1] 
                : vetor[j] < vetor[j + 1];

            if (condicaoTroca) {
                // Mecanismo de Swap (Troca posicional na memória) utilizando desestruturação[cite: 7]
                [vetor[j], vetor[j + 1]] = [vetor[j + 1], vetor[j]];
                trocas++;
                houveTroca = true;
            }
        }

        // Interrompe o loop antecipadamente se a lista já estiver totalmente ordenada
        if (!houveTroca) {
            break;
        }
    }

    return { vetorOrdenado: vetor, comparacoes, trocas };
}

/**
 * Algoritmo 2: Selection Sort (Ordenação por Seleção)
 * - Como funciona: Varre a lista repetidamente buscando o menor (ou maior) elemento 
 *   e o posiciona no início da sublista não ordenada[cite: 6].
 * 
 * @param {Array<number>} vetorOriginal - O vetor de números brutos.
 * @param {string} sentido - 'crescente' ou 'decrescente'.
 * @returns {Object} Objeto contendo o vetor ordenado, número de comparações e trocas.
 */
function executarSelectionSort(vetorOriginal, sentido = 'crescente') {
    const vetor = [...vetorOriginal];
    const tamanho = vetor.length;
    let comparacoes = 0;
    let trocas = 0;

    for (let i = 0; i < tamanho - 1; i++) {
        let indiceExtremo = i; // Assume inicialmente que o atual é o menor/maior

        for (let j = i + 1; j < tamanho; j++) {
            comparacoes++;

            // Critério de comparação para encontrar o elemento extremo
            const encontrarNovoExtremo = sentido === 'crescente'
                ? vetor[j] < vetor[indiceExtremo]
                : vetor[j] > vetor[indiceExtremo];

            if (encontrarNovoExtremo) {
                indiceExtremo = j;
            }
        }

        // Se o índice extremo mudou, realiza a troca com a posição 'i'
        if (indiceExtremo !== i) {
            [vetor[i], vetor[indiceExtremo]] = [vetor[indiceExtremo], vetor[i]];
            trocas++;
        }
    }

    return { vetorOrdenado: vetor, comparacoes, trocas };
}

/**
 * Algoritmo 3: Insertion Sort (Ordenação por Inserção)
 * - Como funciona: Constrói a lista ordenada final um item por vez, inserindo 
 *   cada elemento novo na sua posição correta dentro da sublista anterior[cite: 6].
 * 
 * @param {Array<number>} vetorOriginal - O vetor de números brutos.
 * @param {string} sentido - 'crescente' ou 'decrescente'.
 * @returns {Object} Objeto contendo o vetor ordenado, número de comparações e trocas.
 */
function executarInsertionSort(vetorOriginal, sentido = 'crescente') {
    const vetor = [...vetorOriginal];
    const tamanho = vetor.length;
    let comparacoes = 0;
    let trocas = 0;

    for (let i = 1; i < tamanho; i++) {
        let pivo = vetor[i];
        let j = i - 1;

        // Desloca os elementos maiores/menores para a direita para abrir espaço para o pivô
        while (j >= 0) {
            comparacoes++;
            const condicaoDeslocamento = sentido === 'crescente'
                ? vetor[j] > pivo
                : vetor[j] < pivo;

            if (condicaoDeslocamento) {
                vetor[j + 1] = vetor[j];
                trocas++;
                j--;
            } else {
                break;
            }
        }

        vetor[j + 1] = pivo;
    }

    return { vetorOrdenado: vetor, comparacoes, trocas };
}


// ============================================================================
// SEÇÃO 2: VALIDAÇÃO RIGOROSA E FLEXIBILIDADE DE ENTRADA
// ============================================================================

/**
 * Processa a string inserida pelo usuário, aceitando entradas flexíveis 
 * (separadas por vírgulas, espaços ou ambos)[cite: 4] e tratando erros rigorosamente.
 * 
 * @param {string} textoBruto - Texto digitado no campo HTML.
 * @returns {Object} Retorna um array de números válidos ou uma mensagem de erro detalhada.
 */
function processarEValidarEntrada(textoBruto) {
    // 1. Tratamento para campo vazio ou nulo (Caso básico exigido)[cite: 4, 14]
    if (!textoBruto || textoBruto.trim() === '') {
        return {
            sucesso: false,
            dados: null,
            mensagemErro: 'Atenção: A sequência numérica não pode estar vazia. Por favor, informe os números.'
        };
    }

    // 2. Normalização: Substitui vírgulas e múltiplos espaços por um único espaço padrão
    const textoNormalizado = textoBruto.replace(/,/g, ' ').trim();
    
    // Divide a string em pedaços usando os espaços em branco como delimitadores
    const tokens = textoNormalizado.split(/\s+/);
    const numerosConvertidos = [];

    // 3. Validação individual de cada token informado
    for (const token of tokens) {
        // Converte o token para número decimal (suporta números negativos, inteiros e decimais)
        const numero = Number(token);

        // Verifica se o resultado da conversão é um número válido (NaN = Not a Number)
        if (isNaN(numero)) {
            return {
                sucesso: false,
                dados: null,
                mensagemErro: `Erro de validação: O valor "${token}" inserido não é um número válido. Verifique se há letras ou caracteres indesejados.`
            };
        }

        numerosConvertidos.push(numero);
    }

    return {
        sucesso: true,
        dados: numerosConvertidos,
        mensagemErro: null
    };
}


// ============================================================================
// SEÇÃO 3: ROTINA DE TESTE AUTOMATIZADO / GABARITO (REGRA CRUCIAL)
// ============================================================================

/**
 * Realiza a conferência de gabarito utilizando o método nativo do JS (Array.sort()).
 * O guia do projeto restringe o uso do sort() nativo exclusivamente para esta conferência de teste[cite: 6].
 * 
 * @param {Array<number>} original - Vetor original fornecido.
 * @param {Array<number>} resultadoCustomizado - Vetor gerado pelo algoritmo próprio.
 * @param {string} sentido - 'crescente' ou 'decrescente'.
 * @returns {boolean} Retorna true se o resultado conferir perfeitamente com o nativo.
 */
function conferirComGabaritoNativo(original, resultadoCustomizado, sentido) {
    // Cria o gabarito utilizando o método nativo com função comparadora de segurança
    const gabaritoNativo = [...original].sort((a, b) => {
        return sentido === 'crescente' ? a - b : b - a;
    });

    // Compara se o tamanho e cada elemento coincidem exatamente
    if (gabaritoNativo.length !== resultadoCustomizado.length) return false;

    return gabaritoNativo.every((valor, indice) => valor === resultadoCustomizado[indice]);
}


// ============================================================================
// SEÇÃO 4: MANIPULAÇÃO DO DOM E EVENTOS DA INTERFACE (SINGLE PAGE)
// ============================================================================

// Garante que o script só execute após o carregamento completo do documento HTML
document.addEventListener('DOMContentLoaded', () => {
    // Captura de referências dos elementos estruturais da interface (HTML)
    const formularioOrdenacao = document.getElementById('sort-form');
    const inputSequencia = document.getElementById('input-numeros');
    const selectAlgoritmo = document.getElementById('select-algoritmo');
    const selectSentido = document.getElementById('select-ordem');
    
    // Contêineres de feedback visual e resultados
    const containerErro = document.getElementById('container-erro');
    const containerResultados = document.getElementById('container-resultados');
    const campoOriginal = document.getElementById('txt-original');
    const campoOrdenado = document.getElementById('txt-ordenado');
    const campoComparacoes = document.getElementById('txt-comparacoes');
    const campoTrocas = document.getElementById('txt-trocas');
    const campoStatusGabarito = document.getElementById('txt-status-gabarito');

    /**
     * Função auxiliar para ocultar mensagens anteriores e limpar a tela.
     */
    function resetarInterfaceVisual() {
        if (containerErro) containerErro.style.display = 'none';
        if (containerResultados) containerResultados.style.display = 'none';
    }

    /**
     * Função auxiliar para exibir mensagens de erro amigáveis ao usuário[cite: 4].
     */
    function mostrarErro(mensagem) {
        if (containerErro) {
            containerErro.textContent = mensagem;
            containerErro.style.display = 'block';
        } else {
            alert(mensagem);
        }
    }

    // Escuta o evento de submissão do formulário (botão de ordenar clicado)
    if (formularioOrdenacao) {
        formularioOrdenacao.addEventListener('submit', (evento) => {
            // Impede o recarregamento padrão da página do navegador (Requisito essencial)[cite: 4]
            evento.preventDefault();

            // Limpa estados anteriores
            resetarInterfaceVisual();

            // 1. Obtém os valores dos campos da interface
            const textoDigitado = inputSequencia.value;
            const algoritmoEscolhido = selectAlgoritmo.value;
            const sentidoEscolhido = selectSentido.value;

            // 2. Executa a validação rigorosa dos dados informados
            const validacao = processarEValidarEntrada(textoDigitado);

            if (!validacao.sucesso) {
                mostrarErro(validacao.mensagemErro);
                return; // Interrompe a execução caso haja erro
            }

            const vetorDados = validacao.dados;
            let resultadoProcessamento;

            // 3. Direciona para o algoritmo selecionado na interface[cite: 4]
            switch (algoritmoEscolhido) {
                case 'bubble':
                    resultadoProcessamento = executarBubbleSort(vetorDados, sentidoEscolhido);
                    break;
                case 'selection':
                    resultadoProcessamento = executarSelectionSort(vetorDados, sentidoEscolhido);
                    break;
                case 'insertion':
                    resultadoProcessamento = executarInsertionSort(vetorDados, sentidoEscolhido);
                    break;
                default:
                    resultadoProcessamento = executarBubbleSort(vetorDados, sentidoEscolhido);
                    break;
            }

            // 4. Executa a conferência de gabarito automatizada (Regra crucial de projeto)[cite: 6]
            const gabaritoValido = conferirComGabaritoNativo(
                vetorDados, 
                resultadoProcessamento.vetorOrdenado, 
                sentidoEscolhido
            );

            // 5. Exibe os resultados na interface (Lado a lado: original e ordenado)[cite: 4]
            if (campoOriginal) campoOriginal.textContent = vetorDados.join(', ');
            if (campoOrdenado) campoOrdenado.textContent = resultadoProcessamento.vetorOrdenado.join(', ');
            if (campoComparacoes) campoComparacoes.textContent = resultadoProcessamento.comparacoes;
            if (campoTrocas) campoTrocas.textContent = resultadoProcessamento.trocas;

            if (campoStatusGabarito) {
                campoStatusGabarito.textContent = gabaritoValido
                    ? '✓ Conferência de Gabarito (Array.sort()): Validado e Correto!'
                    : '⚠️ Aviso: Divergência detectada na conferência de gabarito.';
            }

            // Torna o bloco de resultados visível na tela
            if (containerResultados) {
                containerResultados.style.display = 'block';
            }
        });
    }
});
