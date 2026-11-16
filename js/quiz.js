
document.addEventListener("DOMContentLoaded", () => {

    const questions = [
        {
            question: "Qu'est-ce que l'intelligence artificielle (IA) ?",
            answers: [
                "Une machine qui possède des émotions humaines",
                "Une technologie permettant aux machines d'effectuer des tâches intelligentes",
                "Un simple programme de calcul",
                "Un appareil utilisé uniquement dans les hôpitaux"
            ],
            correct: 1,
            explanation:
                "L'IA permet aux systèmes informatiques d'effectuer des tâches comme analyser des données, reconnaître des images et identifier des modèles."
        },

        {
            question: "Que signifie le Machine Learning ?",
            answers: [
                "L'apprentissage automatique à partir de données",
                "La réparation automatique des machines",
                "La création de robots physiques",
                "Le stockage des informations médicales"
            ],
            correct: 0,
            explanation:
                "Le Machine Learning est une branche de l'IA dans laquelle les algorithmes apprennent des modèles à partir de données."
        },

        {
            question: "Quelle est la relation entre le Deep Learning et le Machine Learning ?",
            answers: [
                "Ce sont deux technologies sans aucun lien",
                "Le Deep Learning est une branche du Machine Learning",
                "Le Machine Learning est une branche du Deep Learning",
                "Le Deep Learning fonctionne sans données"
            ],
            correct: 1,
            explanation:
                "Le Deep Learning est une sous-catégorie du Machine Learning. Il utilise des réseaux de neurones comportant plusieurs couches."
        },

        {
            question: "Pourquoi les données sont-elles importantes pour entraîner une IA médicale ?",
            answers: [
                "Elles permettent de décorer l'interface",
                "Elles remplacent les médecins",
                "Elles permettent au modèle d'apprendre des caractéristiques et des relations",
                "Elles empêchent toutes les erreurs"
            ],
            correct: 2,
            explanation:
                "Les données d'entraînement permettent au modèle d'apprendre des motifs. Leur qualité et leur diversité influencent ses performances."
        },

        {
            question: "Dans quel domaine l'IA peut-elle aider à analyser des images médicales ?",
            answers: [
                "L'imagerie médicale",
                "La météorologie",
                "La musique",
                "L'architecture uniquement"
            ],
            correct: 0,
            explanation:
                "L'IA peut assister l'analyse d'images comme les radiographies, les scanners et les IRM."
        },

        {
            question: "Pourquoi faut-il vérifier les résultats d'un système d'IA médicale ?",
            answers: [
                "Parce que l'IA est toujours inutile",
                "Parce que les systèmes peuvent commettre des erreurs",
                "Parce que les résultats sont toujours faux",
                "Parce que les ordinateurs ne peuvent pas traiter des images"
            ],
            correct: 1,
            explanation:
                "Un modèle peut produire des résultats incorrects ou biaisés. Une évaluation humaine et clinique reste essentielle."
        },

        {
            question: "Qu'est-ce qu'un biais algorithmique ?",
            answers: [
                "Une erreur dans la couleur de l'écran",
                "Une amélioration automatique des résultats",
                "Une tendance systématique pouvant défavoriser certains groupes",
                "Une méthode de stockage des fichiers"
            ],
            correct: 2,
            explanation:
                "Un biais algorithmique peut apparaître lorsque les données ou la conception du système entraînent des résultats injustement différents selon les groupes."
        },

        {
            question: "Quelle est une bonne pratique concernant les données médicales ?",
            answers: [
                "Les publier librement sur Internet",
                "Ignorer la confidentialité des patients",
                "Les protéger et limiter leur accès aux personnes autorisées",
                "Les partager sans aucune autorisation"
            ],
            correct: 2,
            explanation:
                "Les données médicales sont sensibles. Leur confidentialité, leur sécurité et leur utilisation responsable doivent être protégées."
        }
    ];

    const quizContainer = document.getElementById("quiz-container");
    const questionText = document.getElementById("question-text");
    const answersContainer = document.getElementById("answers-container");

    const questionCounter = document.getElementById("question-counter");
    const progressFill = document.getElementById("progress-fill");
    const progressTrack = document.getElementById("progress-track");

    const feedback = document.getElementById("feedback");
    const nextButton = document.getElementById("next-button");

    const resultScreen = document.getElementById("result-screen");
    const resultScore = document.getElementById("result-score");
    const resultMessage = document.getElementById("result-message");
    const resultIcon = document.getElementById("result-icon");

    const restartButton = document.getElementById("restart-button");

    let currentQuestion = 0;
    let score = 0;
    let answered = false;

    function displayQuestion() {

        answered = false;

        const question = questions[currentQuestion];

        questionText.textContent = question.question;

        questionCounter.textContent =
            `Question ${currentQuestion + 1} / ${questions.length}`;

        const progress = (currentQuestion / questions.length) * 100;

        progressFill.style.width = progress + "%";

        progressTrack.setAttribute(
            "aria-valuenow",
            String(currentQuestion)
        );

        answersContainer.innerHTML = "";
        feedback.className = "feedback";
        feedback.innerHTML = "";

        nextButton.disabled = true;

        nextButton.textContent =
            currentQuestion === questions.length - 1
                ? "Voir mon résultat →"
                : "Question suivante →";

        const letters = ["A", "B", "C", "D"];

        question.answers.forEach((answer, index) => {

            const button = document.createElement("button");

            button.className = "answer-option";
            button.type = "button";

            const letter = document.createElement("span");
            letter.className = "answer-letter";
            letter.textContent = letters[index];

            const text = document.createElement("span");
            text.textContent = answer;

            button.appendChild(letter);
            button.appendChild(text);

            button.addEventListener("click", () => {
                checkAnswer(index);
            });

            answersContainer.appendChild(button);

        });
    }

    function checkAnswer(selectedIndex) {

        if (answered) return;

        answered = true;

        const question = questions[currentQuestion];

        const buttons =
            answersContainer.querySelectorAll(".answer-option");

        buttons.forEach((button, index) => {

            button.disabled = true;

            if (index === question.correct) {
                button.classList.add("correct");
            }

            if (
                index === selectedIndex &&
                selectedIndex !== question.correct
            ) {
                button.classList.add("incorrect");
            }

        });

        const isCorrect = selectedIndex === question.correct;

        if (isCorrect) {
            score++;

            feedback.className = "feedback show good";

            feedback.innerHTML = `
                <strong>✓ Excellente réponse !</strong>
                <p>${question.explanation}</p>
            `;

        } else {

            feedback.className = "feedback show bad";

            feedback.innerHTML = `
                <strong>✕ Ce n'est pas la bonne réponse.</strong>
                <p>${question.explanation}</p>
            `;

        }

        nextButton.disabled = false;

    }

    function showResults() {

        quizContainer.style.display = "none";
        resultScreen.classList.add("show");

        resultScore.textContent =
            `${score} / ${questions.length}`;

        const percentage =
            (score / questions.length) * 100;

        if (percentage === 100) {

            resultIcon.textContent = "★";
            resultMessage.textContent =
                "Excellent ! Vous maîtrisez parfaitement les notions abordées dans ce quiz.";

        } else if (percentage >= 75) {

            resultIcon.textContent = "✦";
            resultMessage.textContent =
                "Très bon travail ! Vous avez acquis de solides connaissances sur l'IA médicale.";

        } else if (percentage >= 50) {

            resultIcon.textContent = "◈";
            resultMessage.textContent =
                "Bon début ! Continuez à explorer MediVision pour approfondir vos connaissances.";

        } else {

            resultIcon.textContent = "◆";
            resultMessage.textContent =
                "Ne vous découragez pas ! Revisitez les différentes sections du site, puis essayez à nouveau.";

        }

    }

    nextButton.addEventListener("click", () => {

        if (!answered) return;

        if (currentQuestion < questions.length - 1) {

            currentQuestion++;
            displayQuestion();

        } else {

            progressFill.style.width = "100%";

            progressTrack.setAttribute(
                "aria-valuenow",
                String(questions.length)
            );

            showResults();

        }

    });

    restartButton.addEventListener("click", () => {

        currentQuestion = 0;
        score = 0;
        answered = false;

        resultScreen.classList.remove("show");
        quizContainer.style.display = "block";

        displayQuestion();

    });

    displayQuestion();

});
