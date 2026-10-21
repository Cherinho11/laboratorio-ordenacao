// Variáveis de controle global da animação
let isPaused = false;
let animationTimeout = null;

// Atualiza o display da velocidade da animação
function updateSpeedDisplay(value) {
    const speedValueSpan = document.getElementById('speedValue');
    if (speedValueSpan) {
        speedValueSpan.textContent = value + " ms";
    }
}

// Carrega exemplos rápidos para o input de números
function loadPreset(sequence) {
    const input = document.getElementById('numbersInput');
    if (input) {
        input.value = sequence;
        hideError();
        renderInitialBars(parseInput(sequence));
    }
}

// Gera um array aleatório de 12 itens
function generateRandomArray() {
    const randomNumbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 99) - 10);
    const input = document.getElementById('numbersInput');
    if (input) {
        input.value = randomNumbers.join(', ');
        hideError();
        renderInitialBars(randomNumbers);
    }
}

// Exibe mensagens de erro no painel
function showError(message) {
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');
    if (errorBox && errorMessage) {
        errorMessage.textContent = message;
        errorBox.classList.remove('hidden');
    }
}

// Oculta mensagens de erro
function hideError() {
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
        errorBox.classList.add('hidden');
    }
}

// Converte a string do input em um array de números
function parseInput(inputStr) {
    return inputStr
        .split(',')
        .map(item => parseInt(item.trim(), 10))
        .filter(num => !isNaN(num));
}

// Renderiza as barras iniciais no visualizador
function renderInitialBars(arr) {
    const container = document.getElementById('visualizerContainer');
    const emptyText = document.getElementById('emptyVisualizerText');
    if (!container) return;

    if (emptyText) emptyText.style.display = 'none';

    // Limpa apenas as barras anteriores, mantendo o elemento de aviso se necessário
    const existingBars = container.querySelectorAll('.bar-wrapper');
    existingBars.forEach(bar => bar.remove());

    if (arr.length === 0) return;

    const maxVal = Math.max(...arr.map(Math.abs), 1);

    arr.forEach((value, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'bar-wrapper flex flex-col items-center justify-end h-full';
        wrapper.style.height = '200px';

        const bar = document.createElement('div');
        bar.className = 'w-6 sm:w-8 rounded-t-lg bg-cosmic-purple transition-all duration-150 flex items-center justify-center text-[10px] font-mono font-bold text-white shadow-[0_0_10px_rgba(139,92,246,0.3)]';
        
        // Altura proporcional baseada no maior valor
        const heightPercent = Math.max(Math.abs(value) / maxVal * 150, 24);
        bar.style.height = `${heightPercent}px`;
        bar.textContent = value;
        bar.id = `bar-${index}`;

        wrapper.appendChild(bar);
        container.appendChild(wrapper);
    });
}

// Função para pausar/retomar
function togglePause() {
    isPaused = !isPaused;
    const btnPause = document.getElementById('btnPause');
    if (btnPause) {
        btnPause.textContent = isPaused ? "▶️ Retomar" : "⏸️ Pausar";
    }
}

// Função principal de execução da ordenação
async function handleStartSort(event) {
    event.preventDefault();
    hideError();

    const inputVal = document.getElementById('numbersInput').value;
    const array = parseInput(inputVal);

    if (array.length === 0) {
        showError("Por favor, insira uma sequência numérica válida separada por vírgulas.");
        return;
    }

    renderInitialBars(array);

    const algorithm = document.getElementById('algorithmSelect').value;
    const order = document.getElementById('orderSelect').value;
    const isAscending = order === 'asc';

    // Habilitar botão de pausa e desabilitar formulário durante execução
    const btnPause = document.getElementById('btnPause');
    btnPause.disabled = false;
    isPaused = false;
    btnPause.textContent = "⏸️ Pausar";

    // Resetar estatísticas
    let comparisons = 0;
    let swaps = 0;
    const startTime = performance.now();

    document.getElementById('statComparisons').textContent = comparisons;
    document.getElementById('statSwaps').textContent = swaps;
    document.getElementById('statTime').textContent = "0 ms";

    // Executa o algoritmo escolhido
    if (algorithm === 'bubble') {
        await bubbleSort(array, isAscending, () => { comparisons++; }, () => { swaps++; });
    } else if (algorithm === 'selection') {
        await selectionSort(array, isAscending, () => { comparisons++; }, () => { swaps++; });
    } else if (algorithm === 'insertion') {
        await insertionSort(array, isAscending, () => { comparisons++; }, () => { swaps++; });
    } else {
        // Fallback genérico caso selecione outro ainda em expansão
        await bubbleSort(array, isAscending, () => { comparisons++; }, () => { swaps++; });
    }

    const endTime = performance.now();
    const totalTime = Math.round(endTime - startTime);

    document.getElementById('statTime').textContent = `${totalTime} ms`;
    btnPause.disabled = true;
}

// Função auxiliar de espera baseada no slider de velocidade
async function sleep() {
    const speed = parseInt(document.getElementById('speedRange').value, 10) || 300;
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    await new Promise(resolve => setTimeout(resolve, speed));
}

// Atualiza a visualização das barras no DOM durante a ordenação
function updateBarVisual(index, value, className) {
    const bar = document.getElementById(`bar-${index}`);
    if (bar) {
        bar.textContent = value;
        bar.className = `w-6 sm:w-8 rounded-t-lg transition-all duration-150 flex items-center justify-center text-[10px] font-mono font-bold text-white ${className}`;
    }
}

// --- ALGORITMOS DE ORDENAÇÃO ---

async function bubbleSort(arr, isAscending, onCompare, onSwap) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            onCompare();
            document.getElementById('statComparisons').textContent++;

            updateBarVisual(j, arr[j], 'bg-cosmic-yellow shadow-[0_0_12px_rgba(250,204,21,0.5)]');
            updateBarVisual(j + 1, arr[j + 1], 'bg-cosmic-yellow shadow-[0_0_12px_rgba(250,204,21,0.5)]');
            await sleep();

            let condition = isAscending ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1];
            if (condition) {
                onSwap();
                document.getElementById('statSwaps').textContent++;

                let temp = arr[j];
                arr[j] = arr[j + 1];
                arr[j + 1] = temp;

                updateBarVisual(j, arr[j], 'bg-cosmic-magenta shadow-[0_0_12px_rgba(236,72,153,0.5)]');
                updateBarVisual(j + 1, arr[j + 1], 'bg-cosmic-magenta shadow-[0_0_12px_rgba(236,72,153,0.5)]');
                await sleep();
            }

            updateBarVisual(j, arr[j], 'bg-cosmic-purple');
            updateBarVisual(j + 1, arr[j + 1], 'bg-cosmic-purple');
        }
        updateBarVisual(len - i - 1, arr[len - i - 1], 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]');
    }
}

async function selectionSort(arr, isAscending, onCompare, onSwap) {
    let len = arr.length;
    for (let i = 0; i < len; i++) {
        let minOrMaxIdx = i;
        for (let j = i + 1; j < len; j++) {
            onCompare();
            document.getElementById('statComparisons').textContent++;

            updateBarVisual(j, arr[j], 'bg-cosmic-yellow shadow-[0_0_12px_rgba(250,204,21,0.5)]');
            await sleep();

            let condition = isAscending ? arr[j] < arr[minOrMaxIdx] : arr[j] > arr[minOrMaxIdx];
            if (condition) {
                minOrMaxIdx = j;
            }
            updateBarVisual(j, arr[j], 'bg-cosmic-purple');
        }

        if (minOrMaxIdx !== i) {
            onSwap();
            document.getElementById('statSwaps').textContent++;

            let temp = arr[i];
            arr[i] = arr[minOrMaxIdx];
            arr[minOrMaxIdx] = temp;
        }

        updateBarVisual(i, arr[i], 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]');
    }
}

async function insertionSort(arr, isAscending, onCompare, onSwap) {
    let len = arr.length;
    for (let i = 1; i < len; i++) {
        let key = arr[i];
        let j = i - 1;

        updateBarVisual(i, arr[i], 'bg-cosmic-yellow shadow-[0_0_12px_rgba(250,204,21,0.5)]');
        await sleep();

        while (j >= 0 && (isAscending ? arr[j] > key : arr[j] < key)) {
            onCompare();
            document.getElementById('statComparisons').textContent++;
            onSwap();
            document.getElementById('statSwaps').textContent++;

            arr[j + 1] = arr[j];
            updateBarVisual(j + 1, arr[j + 1], 'bg-cosmic-magenta shadow-[0_0_12px_rgba(236,72,153,0.5)]');
            j--;
            await sleep();
        }
        arr[j + 1] = key;
        updateBarVisual(j + 1, key, 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]');
    }
    // Marca todos como ordenados ao final
    for (let k = 0; k < len; k++) {
        updateBarVisual(k, arr[k], 'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]');
    }
}

// Inicializa a visualização com o valor padrão ao carregar a página
window.onload = function() {
    loadPreset(document.getElementById('numbersInput').value);
};
