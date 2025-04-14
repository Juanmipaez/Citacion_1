const citations = [
    {
        format: "APA",
        correct: ["Orwell, G.", "(1949).", "1984.", "Secker & Warburg."],
        explanation: "En APA: Apellido, Inicial. (Año). Título en cursiva. Editorial."
    },
    {
        format: "IEEE",
        correct: ["G. Orwell,", "1984,", "Secker & Warburg,", "1949."],
        explanation: "En IEEE: Inicial. Apellido, Título en cursiva, Editorial, Año."
    },
    {
        format: "Vancouver",
        correct: ["Orwell G.", "1984.", "Secker & Warburg;", "1949."],
        explanation: "En Vancouver: Apellido Inicial. Título. Editorial; Año."
    },
    {
        format: "Chicago",
        correct: ["Orwell, George.", "1984.", "London:", "Secker & Warburg,", "1949."],
        explanation: "En Chicago: Apellido, Nombre. Título. Ciudad: Editorial, Año."
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
let draggedElement = null;
  
function shuffle(array) {
    return array.sort(() => Math.random() - 0.5);
}

function createDraggableElement(text) {
    const el = document.createElement('div');
    el.className = 'draggable';
    el.draggable = true;
    el.textContent = text;

    el.addEventListener('dragstart', (e) => {
        draggedElement = el;
        e.dataTransfer.setData("text/plain", text);
        setTimeout(() => {
        el.style.opacity = "0.5";
    }, 0);
    });

    el.addEventListener('dragend', () => {
        draggedElement = null;
        el.style.opacity = "1";
    });

    return el;
}

function allowDropZones(dropzone) {
    dropzone.addEventListener("dragover", (e) => {
        e.preventDefault();
        const afterElement = getDragAfterElement(dropzone, e.clientX);
        if (afterElement == null) {
        dropzone.appendChild(draggedElement);
    } else {
        dropzone.insertBefore(draggedElement, afterElement);
    }
    });

    dropzone.addEventListener("drop", (e) => {
        e.preventDefault();
    });
}

function getDragAfterElement(container, x) {
    const draggableElements = [...container.querySelectorAll(".draggable:not(.dragging)")];
    return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = x - box.left - box.width / 2;
        if (offset < 0 && offset > closest.offset) {
        return { offset: offset, element: child };
    } 
    else {
        return closest;
    }
    }, { offset: Number.NEGATIVE_INFINITY }).element;
}

function loadCitation() {
    const random = citations[Math.floor(Math.random() * citations.length)];
    currentCitation = random;

    document.getElementById("formatDisplay").textContent = `Formato: ${random.format}`;
    document.getElementById("feedback").textContent = "";

    const draggableContainer = document.getElementById("draggableContainer");
    const dropzone = document.getElementById("dropzone");
    draggableContainer.innerHTML = "";
    dropzone.innerHTML = "";

    const shuffled = shuffle([...random.correct]);
    shuffled.forEach(text => {
        draggableContainer.appendChild(createDraggableElement(text));
    });

    allowDropZones(draggableContainer);
    allowDropZones(dropzone);
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

    const feedback = document.getElementById("feedback");
    feedback.textContent = "Esta era la forma correcta. " + currentCitation.explanation;
    feedback.style.color = "#00796b";
}

window.onload = loadCitation;
