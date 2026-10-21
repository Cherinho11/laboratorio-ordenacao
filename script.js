// Aguarda o HTML carregar completamente antes de executar o script
document.addEventListener('DOMContentLoaded', () => {
    console.log("Laboratório Cósmico carregado com sucesso!");
});

// Funções Auxiliares do Painel
function loadPreset(values) {
    const inputField = document.getElementById('numbersInput');
    if (inputField) {
        inputField.value = values;
        console.log("Preset carregado:", values);
    } else {
        console.error("Elemento 'numbersInput' não encontrado!");
    }
}

function generateRandomArray() {
    const randomNums = Array.from({ length: 12 }, () => Math.floor(Math.random() * 90) - 20);
    const inputField = document.getElementById('numbersInput');
    if (inputField) {
        inputField.value = randomNums.join(', ');
        console.log("Array aleatório gerado:", inputField.value);
    } else {
        console.error("Elemento 'numbersInput' não encontrado!");
    }
}

function updateSpeedDisplay(value) {
    const speedDisplay = document.getElementById('speedValue');
    if (speedDisplay) {
        speedDisplay.innerText = `${value} ms`;
    }
}

function handleStartSort(event) {
    event.preventDefault();
    console.log("Iniciando execução...");
    // Aqui entrará a lógica de ordenação no futuro
}

function togglePause() {
    console.log("Pausar/Continuar animação");
}
