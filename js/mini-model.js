
document.addEventListener("DOMContentLoaded", () => {

    /* =========================================
       1. INITIAL TRAINING DATA
       Données synthétiques uniquement
       ========================================= */

    let trainingData = [
        { features: [85, 20, 30], label: "A" },
        { features: [90, 25, 35], label: "A" },
        { features: [78, 30, 25], label: "A" },

        { features: [25, 85, 30], label: "B" },
        { features: [30, 90, 35], label: "B" },
        { features: [20, 78, 25], label: "B" },

        { features: [30, 25, 85], label: "C" },
        { features: [35, 30, 90], label: "C" },
        { features: [25, 20, 78], label: "C" }
    ];

    const categories = ["A", "B", "C"];

    let centroids = {};
    let modelTrained = false;


    /* =========================================
       2. CREATE INTERFACE
       ========================================= */

    const style = document.createElement("style");

    style.textContent = `

        .ml-lab {
            width: min(1100px, 94%);
            margin: 55px auto;
            padding: 28px;
            color: var(--text, #dceaf5);
            background: linear-gradient(145deg, #0c2438, #071827);
            border: 1px solid rgba(100,216,240,.18);
            border-radius: 18px;
            font-family: "DM Sans", sans-serif;
        }

        .ml-lab * {
            box-sizing: border-box;
        }

        .ml-header {
            margin-bottom: 28px;
        }

        .ml-tag {
            color: #64d8f0;
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 2px;
        }

        .ml-header h2 {
            margin: 12px 0;
            color: #f4f8fc;
            font-size: clamp(21px, 4vw, 30px);
        }

        .ml-header p {
            color: #91aabe;
            font-size: 13px;
            line-height: 1.7;
        }

        .ml-grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 18px;
        }

        .ml-panel {
            padding: 20px;
            border: 1px solid rgba(100,216,240,.13);
            border-radius: 13px;
            background: rgba(4,17,29,.55);
        }

        .ml-panel h3 {
            margin: 0 0 10px;
            color: #f4f8fc;
            font-size: 15px;
        }

        .ml-description {
            margin-bottom: 20px;
            color: #91aabe;
            font-size: 11px;
            line-height: 1.6;
        }

        .ml-field {
            margin-bottom: 19px;
        }

        .ml-field label {
            display: flex;
            justify-content: space-between;
            gap: 10px;
            margin-bottom: 9px;
            color: #dceaf5;
            font-size: 12px;
        }

        .ml-field output {
            color: #64d8f0;
            font-weight: 700;
        }

        .ml-field input[type="range"] {
            width: 100%;
            accent-color: #36b9e9;
            cursor: pointer;
        }

        .ml-field select {
            width: 100%;
            padding: 11px;
            border: 1px solid rgba(100,216,240,.2);
            border-radius: 8px;
            background: #071827;
            color: #f4f8fc;
            font: inherit;
        }

        .ml-button {
            width: 100%;
            padding: 12px 16px;
            border: 0;
            border-radius: 8px;
            background: linear-gradient(90deg, #258fd0, #36b9e9);
            color: #04111d;
            font-size: 12px;
            font-weight: 700;
            cursor: pointer;
            transition: .25s ease;
        }

        .ml-button:hover {
            filter: brightness(1.15);
            transform: translateY(-2px);
        }

        .ml-button:disabled {
            opacity: .5;
            cursor: not-allowed;
            transform: none;
        }

        .ml-secondary {
            margin-top: 10px;
            border: 1px solid rgba(100,216,240,.3);
            background: transparent;
            color: #64d8f0;
        }

        .ml-status {
            margin-top: 16px;
            padding: 12px;
            border-radius: 8px;
            background: rgba(100,216,240,.07);
            color: #91aabe;
            font-size: 11px;
            line-height: 1.7;
        }

        .ml-status strong {
            color: #64d8f0;
        }

        .ml-example-list {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 8px;
            margin: 16px 0;
        }

        .ml-example-count {
            padding: 11px 5px;
            border: 1px solid rgba(100,216,240,.13);
            border-radius: 8px;
            text-align: center;
            background: rgba(18,51,77,.35);
        }

        .ml-example-count strong {
            display: block;
            margin-bottom: 5px;
            color: #64d8f0;
            font-size: 19px;
        }

        .ml-example-count span {
            color: #91aabe;
            font-size: 10px;
        }

        .ml-result {
            display: none;
            margin-top: 20px;
            padding: 18px;
            border: 1px solid rgba(100,216,240,.25);
            border-radius: 11px;
            background: rgba(37,143,208,.09);
            animation: mlReveal .5s ease both;
        }

        .ml-result.visible {
            display: block;
        }

        @keyframes mlReveal {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .ml-result-label {
            color: #91aabe;
            font-size: 10px;
            letter-spacing: 1px;
        }

        .ml-result h3 {
            margin: 10px 0;
            color: #64d8f0;
            font-size: 26px;
        }

        .ml-distances {
            display: grid;
            gap: 10px;
            margin-top: 16px;
        }

        .ml-distance-row {
            display: grid;
            grid-template-columns: 75px 1fr 45px;
            align-items: center;
            gap: 8px;
            font-size: 10px;
        }

        .ml-distance-track {
            height: 7px;
            overflow: hidden;
            border-radius: 10px;
            background: #04111d;
        }

        .ml-distance-fill {
            height: 100%;
            width: 0;
            border-radius: 10px;
            background: #36b9e9;
            transition: width .8s ease;
        }

        .ml-distance-row.best {
            color: #64d8f0;
            font-weight: 700;
        }

        .ml-disclaimer {
            margin-top: 22px;
            padding: 13px;
            border-left: 3px solid #36b9e9;
            background: rgba(100,216,240,.05);
            color: #91aabe;
            font-size: 10px;
            line-height: 1.8;
        }

        @media(max-width: 700px) {
            .ml-grid {
                grid-template-columns: 1fr;
            }

            .ml-lab {
                padding: 18px;
            }
        }

        @media(prefers-reduced-motion: reduce) {
            .ml-lab *,
            .ml-lab *::before {
                animation: none !important;
                transition: none !important;
            }
        }

    `;

    document.head.appendChild(style);


    const section = document.createElement("section");

    section.className = "ml-lab";

    section.innerHTML = `

        <div class="ml-header">

            <span class="ml-tag">
                MACHINE LEARNING EXPERIENCE
            </span>

            <h2>Entraînez votre propre modèle d'IA</h2>

            <p>
                Ajoutez des exemples, entraînez le classificateur,
                puis testez-le avec de nouvelles données.
            </p>

        </div>

        <div class="ml-grid">

            <div class="ml-panel">

                <h3>01. Entraînement du modèle</h3>

                <p class="ml-description">
                    Créez des exemples en leur attribuant une catégorie.
                    Le modèle apprendra à partir de ces données.
                </p>

                <div class="ml-field">
                    <label for="ml-label">
                        Catégorie de l'exemple
                    </label>

                    <select id="ml-label">
                        <option value="A">Catégorie A</option>
                        <option value="B">Catégorie B</option>
                        <option value="C">Catégorie C</option>
                    </select>
                </div>

                <div class="ml-field">
                    <label for="ml-train-1">
                        Intensité du signal
                        <output id="ml-train-1-value">50</output>
                    </label>
                    <input id="ml-train-1"
                           type="range" min="0" max="100" value="50">
                </div>

                <div class="ml-field">
                    <label for="ml-train-2">
                        Texture
                        <output id="ml-train-2-value">50</output>
                    </label>
                    <input id="ml-train-2"
                           type="range" min="0" max="100" value="50">
                </div>

                <div class="ml-field">
                    <label for="ml-train-3">
                        Densité
                        <output id="ml-train-3-value">50</output>
                    </label>
                    <input id="ml-train-3"
                           type="range" min="0" max="100" value="50">
                </div>

                <button class="ml-button" id="ml-add-example">
                    Ajouter cet exemple
                </button>

                <div class="ml-example-list">

                    <div class="ml-example-count">
                        <strong id="ml-count-a">0</strong>
                        <span>Classe A</span>
                    </div>

                    <div class="ml-example-count">
                        <strong id="ml-count-b">0</strong>
                        <span>Classe B</span>
                    </div>

                    <div class="ml-example-count">
                        <strong id="ml-count-c">0</strong>
                        <span>Classe C</span>
                    </div>

                </div>

                <button class="ml-button ml-secondary"
                        id="ml-train-model">
                    Entraîner le modèle
                </button>

                <div class="ml-status" id="ml-training-status"
                     aria-live="polite">
                    Le modèle possède des exemples initiaux.
                    Tu peux en ajouter puis lancer l'entraînement.
                </div>

            </div>


            <div class="ml-panel">

                <h3>02. Tester le modèle</h3>

                <p class="ml-description">
                    Modifie les caractéristiques d'un nouvel exemple.
                    Le modèle cherchera la catégorie la plus proche.
                </p>

                <div class="ml-field">
                    <label for="ml-test-1">
                        Intensité du signal
                        <output id="ml-test-1-value">50</output>
                    </label>
                    <input id="ml-test-1"
                           type="range" min="0" max="100" value="50">
                </div>

                <div class="ml-field">
                    <label for="ml-test-2">
                        Texture
                        <output id="ml-test-2-value">50</output>
                    </label>
                    <input id="ml-test-2"
                           type="range" min="0" max="100" value="50">
                </div>

                <div class="ml-field">
                    <label for="ml-test-3">
                        Densité
                        <output id="ml-test-3-value">50</output>
                    </label>
                    <input id="ml-test-3"
                           type="range" min="0" max="100" value="50">
                </div>

                <button class="ml-button" id="ml-predict" disabled>
                    Classifier le nouvel exemple
                </button>

                <div class="ml-result" id="ml-prediction"
                     aria-live="polite">

                    <span class="ml-result-label">
                        RÉSULTAT DU MODÈLE
                    </span>

                    <h3 id="ml-prediction-title">Catégorie A</h3>

                    <p id="ml-prediction-description"></p>

                    <div class="ml-distances" id="ml-distances"></div>

                </div>

                <div class="ml-status">
                    <strong>Algorithme :</strong>
                    Nearest Centroid Classifier.
                    <br>
                    Le modèle compare le nouvel exemple
                    aux centres calculés à partir des données
                    d'entraînement.
                </div>

            </div>

        </div>

        <div class="ml-disclaimer">
            <strong>Expérience pédagogique :</strong>
            les données sont synthétiques et ne représentent
            aucun patient. Ce modèle démontre un principe
            de classification automatique. Il ne constitue
            pas un outil de diagnostic médical.
        </div>

    `;


    const main = document.querySelector("main");

    if (main) {
        main.appendChild(section);
    } else {
        document.body.appendChild(section);
    }


    /* =========================================
       3. ELEMENTS
       ========================================= */

    const get = id => document.getElementById(id);

    const trainingStatus = get("ml-training-status");
    const predictButton = get("ml-predict");
    const predictionPanel = get("ml-prediction");


    /* =========================================
       4. SLIDER OUTPUTS
       ========================================= */

    function connectSlider(id, outputId) {

        const slider = get(id);
        const output = get(outputId);

        slider.addEventListener("input", () => {
            output.textContent = slider.value;
        });

    }

    [1, 2, 3].forEach(number => {

        connectSlider(
            "ml-train-" + number,
            "ml-train-" + number + "-value"
        );

        connectSlider(
            "ml-test-" + number,
            "ml-test-" + number + "-value"
        );

    });


    function readFeatures(prefix) {

        return [1, 2, 3].map(number =>
            Number(get(prefix + number).value)
        );

    }


    /* =========================================
       5. EXAMPLE COUNTS
       ========================================= */

    function updateCounts() {

        categories.forEach(category => {

            const count = trainingData.filter(
                item => item.label === category
            ).length;

            get("ml-count-" + category.toLowerCase())
                .textContent = count;

        });

    }

    updateCounts();


    /* =========================================
       6. ADD TRAINING EXAMPLE
       ========================================= */

    get("ml-add-example").addEventListener("click", () => {

        const label = get("ml-label").value;
        const features = readFeatures("ml-train-");

        trainingData.push({
            features,
            label
        });

        modelTrained = false;
        centroids = {};

        predictButton.disabled = true;
        predictionPanel.classList.remove("visible");

        trainingStatus.innerHTML =
            "<strong>Nouvel exemple ajouté.</strong> " +
            "Entraîne à nouveau le modèle pour prendre en compte ces données.";

        updateCounts();

    });


    /* =========================================
       7. TRAIN MODEL
       ========================================= */

    function trainModel() {

        const newCentroids = {};

        for (const category of categories) {

            const examples = trainingData.filter(
                item => item.label === category
            );

            if (examples.length === 0) {
                return false;
            }

            newCentroids[category] = [0, 0, 0];

            examples.forEach(example => {

                example.features.forEach((value, index) => {

                    newCentroids[category][index] += value;

                });

            });

            newCentroids[category] =
                newCentroids[category].map(
                    value => value / examples.length
                );

        }

        centroids = newCentroids;
        modelTrained = true;

        return true;

    }


    get("ml-train-model").addEventListener("click", () => {

        trainingStatus.textContent = "Entraînement en cours...";

        predictButton.disabled = true;

        window.setTimeout(() => {

            const success = trainModel();

            if (!success) {

                trainingStatus.textContent =
                    "Ajoute au moins un exemple dans chaque catégorie.";

                return;
            }

            trainingStatus.innerHTML =
                "<strong>Modèle entraîné avec succès !</strong> " +
                "Les trois centres de catégories ont été calculés. " +
                "Tu peux maintenant tester de nouvelles données.";

            predictButton.disabled = false;

        }, 500);

    });


    /* =========================================
       8. EUCLIDEAN DISTANCE
       ========================================= */

    function calculateDistance(pointA, pointB) {

        let sum = 0;

        for (let i = 0; i < pointA.length; i++) {

            sum += Math.pow(
                pointA[i] - pointB[i],
                2
            );

        }

        return Math.sqrt(sum);

    }


    /* =========================================
       9. CLASSIFICATION
       ========================================= */

    predictButton.addEventListener("click", () => {

        if (!modelTrained) return;

        const newExample = readFeatures("ml-test-");

        const distances = categories.map(category => ({

            category,

            distance: calculateDistance(
                newExample,
                centroids[category]
            )

        }));

        distances.sort((a, b) => a.distance - b.distance);

        const winner = distances[0];

        get("ml-prediction-title").textContent =
            "Catégorie " + winner.category;

        get("ml-prediction-description").textContent =
            "Le modèle a classé cet exemple dans la catégorie " +
            winner.category +
            " car son centre est le plus proche parmi les trois catégories.";

        const distanceContainer = get("ml-distances");

        distanceContainer.innerHTML = "";

        const maxDistance = Math.max(
            ...distances.map(item => item.distance),
            1
        );

        distances.forEach(item => {

            const row = document.createElement("div");

            row.className = "ml-distance-row";

            if (item.category === winner.category) {
                row.classList.add("best");
            }

            const width =
                (item.distance / maxDistance) * 100;

            row.innerHTML = `

                <span>Classe ${item.category}</span>

                <div class="ml-distance-track">
                    <div class="ml-distance-fill"></div>
                </div>

                <span>${item.distance.toFixed(1)}</span>

            `;

            distanceContainer.appendChild(row);

            requestAnimationFrame(() => {

                row.querySelector(".ml-distance-fill")
                    .style.width = width + "%";

            });

        });

        predictionPanel.classList.remove("visible");

        requestAnimationFrame(() => {
            predictionPanel.classList.add("visible");
        });

    });


    /* =========================================
       10. INITIAL TRAINING
       ========================================= */

    trainModel();

    trainingStatus.innerHTML =
        "<strong>Modèle prêt !</strong> " +
        "Un premier entraînement a été effectué à partir des exemples initiaux.";

    predictButton.disabled = false;

});
