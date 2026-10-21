// Funções Auxiliares do Painel
function loadPreset(values) {
    document.getElementById('numbersInput').value = values;
}

function generateRandomArray() {
    const randomNums = Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) - 20);
    document.getElementById('numbersInput').value = randomNums.join(', ');
}

function updateSpeedDisplay(value) {
    document.getElementById('speedValue').innerText = `${value} ms`;
}

function handleStartSort(event) {
    event.preventDefault();
    // Lógica de start da ordenação a ser implementada
    console.log("Iniciando execução...");
}

function togglePause() {
    console.log("Pausar/Continuar animação");
}
