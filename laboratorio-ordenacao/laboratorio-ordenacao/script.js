// ============================================================
// Laboratório Interativo de Algoritmos de Ordenação
// ============================================================

// --- Estado global ---
let isPaused = false;
let isRunning = false;

const MAX_ITEMS = 50;

// Classes de cor usadas nas barras
const COLORS = {
    default: 'bg-cosmic-purple shadow-[0_0_10px_rgba(139,92,246,0.3)]',
    compare: 'bg-cosmic-yellow shadow-[0_0_12px_rgba(250,204,21,0.5)]',
    swap:    'bg-cosmic-magenta shadow-[0_0_12px_rgba(236,72,153,0.5)]',
    sorted:  'bg-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.5)]',
    target:  'bg-cosmic-cyan shadow-[0_0_12px_rgba(6,182,212,0.5)]'
};

// Geometria do gráfico (em pixels)
const CHART_HEIGHT = 240;   // altura total da área do gráfico
const LABEL_SPACE = 20;     // espaço reservado para os rótulos acima/abaixo
let chartScale = { unit: 0, zeroY: CHART_HEIGHT - LABEL_SPACE };

// ------------------------------------------------------------
// Interface: velocidade, erros, entrada
// ------------------------------------------------------------

function updateSpeedDisplay(value) {
    const speedValueSpan = document.getElementById('speedValue');
    if (speedValueSpan) {
        speedValueSpan.textContent = value + ' ms';
    }
}

function showError(message) {
    const errorBox = document.getElementById('errorBox');
    const errorMessage = document.getElementById('errorMessage');
    if (errorBox && errorMessage) {
        errorMessage.textContent = message;
        errorBox.classList.remove('hidden');
    }
}

function hideError() {
    const errorBox = document.getElementById('errorBox');
    if (errorBox) {
        errorBox.classList.add('hidden');
    }
}

// Converte o texto do input em números. Aceita vírgula, ponto e vírgula
// ou espaço como separadores. Retorna os valores válidos e os inválidos.
function parseInput(inputStr) {
    const tokens = inputStr.split(/[\s,;]+/).filter(token => token !== '');
    const values = [];
    const invalid = [];

    tokens.forEach(token => {
        if (/^[+-]?\d+(\.\d+)?$/.test(token)) {
            values.push(Number(token));
        } else {
            invalid.push(token);
        }
    });

    return { values, invalid };
}

function loadPreset(sequence) {
    if (isRunning) return;
    const input = document.getElementById('numbersInput');
    if (input) {
        input.value = sequence;
        hideError();
        renderInitialBars(parseInput(sequence).values);
    }
}

function generateRandomArray() {
    if (isRunning) return;
    const randomNumbers = Array.from({ length: 12 }, () => Math.floor(Math.random() * 99) - 10);
    const input = document.getElementById('numbersInput');
    if (input) {
        input.value = randomNumbers.join(', ');
        hideError();
        renderInitialBars(randomNumbers);
    }
}

// Habilita/desabilita os controles enquanto a ordenação roda
function setControlsDisabled(disabled) {
    ['numbersInput', 'algorithmSelect', 'orderSelect', 'btnExecute'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = disabled;
    });
    document.querySelectorAll('.preset-btn').forEach(btn => { btn.disabled = disabled; });

    const btnExecute = document.getElementById('btnExecute');
    if (btnExecute) {
        btnExecute.textContent = disabled ? '⏳ Ordenando...' : '🚀 Executar Ordenação';
    }
}

// ------------------------------------------------------------
// Visualização das barras
// ------------------------------------------------------------

// Calcula a escala do gráfico. Barras positivas crescem para cima a partir
// da linha de zero e as negativas crescem para baixo.
function computeScale(arr) {
    const posMax = Math.max(0, ...arr);
    const negMax = Math.max(0, -Math.min(...arr));
    const available = CHART_HEIGHT - 2 * LABEL_SPACE;
    const range = posMax + negMax;
    const unit = range === 0 ? 0 : available / range;

    chartScale = { unit, zeroY: LABEL_SPACE + posMax * unit };
}

function renderInitialBars(arr) {
    const container = document.getElementById('barsRow');
    const emptyText = document.getElementById('emptyVisualizerText');
    if (!container) return;

    container.innerHTML = '';

    if (arr.length === 0) {
        if (emptyText) emptyText.style.display = '';
        return;
    }
    if (emptyText) emptyText.style.display = 'none';

    computeScale(arr);

    arr.forEach((value, index) => {
        const wrapper = document.createElement('div');
        wrapper.className = 'relative w-6 sm:w-8 shrink-0';
        wrapper.style.height = `${CHART_HEIGHT}px`;

        // Linha de referência do zero
        const zeroLine = document.createElement('div');
        zeroLine.className = 'absolute inset-x-0 h-px bg-purple-400/30';
        zeroLine.style.top = `${chartScale.zeroY}px`;

        const bar = document.createElement('div');
        bar.id = `bar-${index}`;

        const label = document.createElement('span');
        label.id = `label-${index}`;
        label.className = 'absolute left-1/2 -translate-x-1/2 text-[10px] leading-[14px] font-mono font-bold text-purple-100 whitespace-nowrap transition-all duration-150';

        wrapper.appendChild(zeroLine);
        wrapper.appendChild(bar);
        wrapper.appendChild(label);
        container.appendChild(wrapper);

        updateBarVisual(index, value, COLORS.default);
    });
}

// Atualiza valor, altura, posição e cor de uma barra
function updateBarVisual(index, value, colorClass) {
    const bar = document.getElementById(`bar-${index}`);
    const label = document.getElementById(`label-${index}`);
    if (!bar || !label) return;

    const { unit, zeroY } = chartScale;
    const negative = value < 0;
    const height = value === 0 ? 0 : Math.max(Math.abs(value) * unit, 3);

    bar.className = `absolute inset-x-0 transition-all duration-150 ${negative ? 'rounded-b-lg' : 'rounded-t-lg'} ${colorClass}`;
    bar.style.height = `${height}px`;
    bar.style.top = `${negative ? zeroY : zeroY - height}px`;

    label.textContent = value;
    label.style.top = `${negative ? zeroY + height + 2 : zeroY - height - 16}px`;
}

// ------------------------------------------------------------
// Controle da animação
// ------------------------------------------------------------

function togglePause() {
    isPaused = !isPaused;
    const btnPause = document.getElementById('btnPause');
    if (btnPause) {
        btnPause.textContent = isPaused ? '▶️ Retomar' : '⏸️ Pausar';
    }
}

// Espera conforme o slider de velocidade (respeitando a pausa)
async function sleep() {
    const speed = parseInt(document.getElementById('speedRange').value, 10) || 300;
    while (isPaused) {
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    await new Promise(resolve => setTimeout(resolve, speed));
}

// ------------------------------------------------------------
// Execução
// ------------------------------------------------------------

async function handleStartSort(event) {
    event.preventDefault();
    if (isRunning) return;
    hideError();

    const { values: array, invalid } = parseInput(document.getElementById('numbersInput').value);

    if (invalid.length > 0) {
        showError(`Valor(es) inválido(s): ${invalid.slice(0, 5).join(', ')}. Use apenas números separados por vírgula ou espaço.`);
        return;
    }
    if (array.length === 0) {
        showError('Por favor, insira uma sequência numérica válida separada por vírgulas ou espaços.');
        return;
    }
    if (array.length > MAX_ITEMS) {
        showError(`Limite de ${MAX_ITEMS} números excedido (você inseriu ${array.length}).`);
        return;
    }

    const algorithms = {
        bubble: bubbleSort,
        selection: selectionSort,
        insertion: insertionSort
    };
    const sortFn = algorithms[document.getElementById('algorithmSelect').value];
    if (!sortFn) {
        showError('Algoritmo não disponível.');
        return;
    }
    const isAscending = document.getElementById('orderSelect').value === 'asc';

    renderInitialBars(array);

    // Estado da execução
    isRunning = true;
    isPaused = false;
    setControlsDisabled(true);
    const btnPause = document.getElementById('btnPause');
    btnPause.disabled = false;
    btnPause.textContent = '⏸️ Pausar';

    // Estatísticas (fonte única de verdade: estas variáveis)
    let comparisons = 0;
    let swaps = 0;
    const statComparisons = document.getElementById('statComparisons');
    const statSwaps = document.getElementById('statSwaps');
    const statTime = document.getElementById('statTime');

    statComparisons.textContent = 0;
    statSwaps.textContent = 0;
    statTime.textContent = '0 ms';

    const onCompare = () => { comparisons++; statComparisons.textContent = comparisons; };
    const onSwap = () => { swaps++; statSwaps.textContent = swaps; };

    const startTime = performance.now();
    try {
        await sortFn(array, isAscending, onCompare, onSwap);
    } finally {
        statTime.textContent = `${Math.round(performance.now() - startTime)} ms`;
        isRunning = false;
        isPaused = false;
        btnPause.disabled = true;
        btnPause.textContent = '⏸️ Pausar';
        setControlsDisabled(false);
    }
}

// ------------------------------------------------------------
// Algoritmos de ordenação
// ------------------------------------------------------------

async function bubbleSort(arr, isAscending, onCompare, onSwap) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        for (let j = 0; j < len - i - 1; j++) {
            onCompare();
            updateBarVisual(j, arr[j], COLORS.compare);
            updateBarVisual(j + 1, arr[j + 1], COLORS.compare);
            await sleep();

            const outOfOrder = isAscending ? arr[j] > arr[j + 1] : arr[j] < arr[j + 1];
            if (outOfOrder) {
                onSwap();
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];

                updateBarVisual(j, arr[j], COLORS.swap);
                updateBarVisual(j + 1, arr[j + 1], COLORS.swap);
                await sleep();
            }

            updateBarVisual(j, arr[j], COLORS.default);
            updateBarVisual(j + 1, arr[j + 1], COLORS.default);
        }
        updateBarVisual(len - i - 1, arr[len - i - 1], COLORS.sorted);
    }
}

async function selectionSort(arr, isAscending, onCompare, onSwap) {
    const len = arr.length;
    for (let i = 0; i < len; i++) {
        let targetIdx = i; // índice do menor (ou maior) elemento encontrado até agora
        updateBarVisual(targetIdx, arr[targetIdx], COLORS.target);

        for (let j = i + 1; j < len; j++) {
            onCompare();
            updateBarVisual(j, arr[j], COLORS.compare);
            await sleep();

            const isBetter = isAscending ? arr[j] < arr[targetIdx] : arr[j] > arr[targetIdx];
            if (isBetter) {
                updateBarVisual(targetIdx, arr[targetIdx], COLORS.default);
                targetIdx = j;
                updateBarVisual(targetIdx, arr[targetIdx], COLORS.target);
            } else {
                updateBarVisual(j, arr[j], COLORS.default);
            }
        }

        if (targetIdx !== i) {
            onSwap();
            [arr[i], arr[targetIdx]] = [arr[targetIdx], arr[i]];

            updateBarVisual(i, arr[i], COLORS.swap);
            updateBarVisual(targetIdx, arr[targetIdx], COLORS.swap);
            await sleep();

            updateBarVisual(targetIdx, arr[targetIdx], COLORS.default);
        }

        updateBarVisual(i, arr[i], COLORS.sorted);
    }
}

// Obs.: no Insertion Sort, cada deslocamento de elemento é contado como uma troca.
async function insertionSort(arr, isAscending, onCompare, onSwap) {
    const len = arr.length;
    for (let i = 1; i < len; i++) {
        const key = arr[i];
        let j = i - 1;

        updateBarVisual(i, key, COLORS.target);
        await sleep();

        while (j >= 0) {
            onCompare();
            updateBarVisual(j, arr[j], COLORS.compare);
            await sleep();

            const outOfOrder = isAscending ? arr[j] > key : arr[j] < key;
            if (!outOfOrder) break;

            onSwap();
            arr[j + 1] = arr[j];
            updateBarVisual(j + 1, arr[j + 1], COLORS.swap);
            j--;
        }

        arr[j + 1] = key;

        // Redesenha o trecho já tratado para não sobrar valores duplicados na tela
        for (let k = 0; k <= i; k++) {
            updateBarVisual(k, arr[k], k === j + 1 ? COLORS.target : COLORS.default);
        }
        await sleep();
    }

    // Ao final, tudo está ordenado
    for (let k = 0; k < len; k++) {
        updateBarVisual(k, arr[k], COLORS.sorted);
    }
}

// Inicializa a visualização com o valor padrão ao carregar a página
window.onload = function () {
    loadPreset(document.getElementById('numbersInput').value);
};
