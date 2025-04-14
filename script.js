const citations = [
    {
        format: "APA",
        correct: ["Orwell, G.", "(1949).", "1984.", "Secker & Warburg."],
        explanation: "APA: Apellido, Inicial. (Año). Título en cursiva. Editorial."
    },
    {
        format: "IEEE",
        correct: ["G. Orwell,", "1984,", "Secker & Warburg,", "1949."],
        explanation: "IEEE: Inicial. Apellido, Título en cursiva, Editorial, Año."
    },
    {
        format: "Vancouver",
        correct: ["Orwell G.", "1984.", "Secker & Warburg;", "1949."],
        explanation: "Vancouver: Apellido Inicial. Título. Editorial; Año."
    },
    {
        format: "Chicago",
        correct: ["Orwell, George.", "1984.", "London:", "Secker & Warburg,", "1949."],
        explanation: "Chicago: Apellido, Nombre. Título. Ciudad: Editorial, Año."
    },
    {
        format: "APA",
        correct: ["Hawking, S.", "(1988).", "A Brief History of Time.", "Bantam Books."],
        explanation: "APA: Apellido, Inicial. (Año). Título en cursiva. Editorial."
    },
    {
        format: "IEEE",
        correct: ["S. Hawking,", "A Brief History of Time,", "Bantam Books,", "1988."],
        explanation: "IEEE: Inicial. Apellido, Título, Editorial, Año."
    },
    {
        format: "Vancouver",
        correct: ["Hawking S.", "A Brief History of Time.", "Bantam Books;", "1988."],
        explanation: "Vancouver: Apellido Inicial. Título. Editorial; Año."
    },
    {
        format: "Chicago",
        correct: ["Hawking, Stephen.", "A Brief History of Time.", "New York:", "Bantam Books,", "1988."],
        explanation: "Chicago: Apellido, Nombre. Título. Ciudad: Editorial, Año."
    },
    {
        format: "APA",
        correct: ["Rowling, J. K.", "(1997).", "Harry Potter and the Philosopher's Stone.", "Bloomsbury."],
        explanation: "APA: Apellido, Inicial. (Año). Título. Editorial."
    },
    {
        format: "Chicago",
        correct: ["Rowling, J.K.", "Harry Potter and the Philosopher's Stone.", "London:", "Bloomsbury,", "1997."],
        explanation: "Chicago: Apellido, Nombre. Título. Ciudad: Editorial, Año."
    }
];

let currentCitation = null;

function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createDraggableElement(text) {
    const el = document.createElement('div');
    el.className = 'draggable';
    el.textContent = text;
    return el;
}

function loadCitation() {
    const random = citations[Math.floor(Math.random() * citations.length)];
    currentCitation = random;

    document.getElementById("formatDisplay").textContent = `Formato: ${random.format}`;
    document.getElementById("feedback").textContent = "";

    const draggableContainer = document.getElementById("draggableContainer");
    const dropzone = document.getElementById("dropzone");

    // Destroy existing Sortables to avoid conflict
    if (Sortable.get(draggableContainer)) Sortable.get(draggableContainer).destroy();
    if (Sortable.get(dropzone)) Sortable.get(dropzone).destroy();

    draggableContainer.innerHTML = "";
    dropzone.innerHTML = "";

    const shuffled = shuffle([...random.correct]);
    shuffled.forEach(text => {
        draggableContainer.appendChild(createDraggableElement(text));
    });

    // Reinitialize Sortable (mobile + PC)
    Sortable.create(draggableContainer, {
        group: 'shared',
        animation: 150,
        sort: false
    });

    Sortable.create(dropzone, {
        group: 'shared',
        animation: 150,
        sort: true
    });
}

function checkAnswer() {
    const userAnswer = Array.from(document.getElementById("dropzone").children)
        .map(el => el.textContent);

    if (userAnswer.length !== currentCitation.correct.length) {
        document.getElementById("feedback").textContent = "Aún no has completado toda la cita.";
        return;
    }

    const isCorrect = JSON.stringify(userAnswer) === JSON.stringify(currentCitation.correct);
    const feedback = document.getElementById("feedback");
    feedback.textContent = isCorrect ? "¡Correcto! 🎉" : "Hay errores. Intenta reorganizar.";
    feedback.style.color = isCorrect ? "green" : "red";
}

function showAnswer() {
    const dropzone = document.getElementById("dropzone");
    dropzone.innerHTML = "";
    currentCitation.correct.forEach(text => {
        dropzone.appendChild(createDraggableElement(text));
    });

    Sortable.create(dropzone, {
        group: 'shared',
        animation: 150,
        sort: true
    });

    const feedback = document.getElementById("feedback");
    feedback.textContent = "Esta era la forma correcta. " + currentCitation.explanation;
    feedback.style.color = "#00796b";
}

window.onload = loadCitation;
