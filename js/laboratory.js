
document.addEventListener("DOMContentLoaded", () => {

    const sampleButtons = document.querySelectorAll(".sample-button");
    const sampleDescription = document.getElementById("sample-description");
    const analyzeButton = document.getElementById("analyze-button");

    const resultPlaceholder = document.getElementById("result-placeholder");
    const resultContent = document.getElementById("result-content");

    const resultStatus = document.getElementById("result-status");
    const resultTitle = document.getElementById("result-title");
    const resultDescription = document.getElementById("result-description");

    const confidenceValue = document.getElementById("confidence-value");
    const confidenceFill = document.getElementById("confidence-fill");

    if (
        !sampleButtons.length ||
        !sampleDescription ||
        !analyzeButton ||
        !resultPlaceholder ||
        !resultContent
    ) return;


    /* =========================================
       STYLES
       ========================================= */

    const style = document.createElement("style");

    style.textContent = `
        .ai-processing {
            width: 100%;
            padding: 15px 5px;
            animation: processingAppear .5s ease both;
        }

        @keyframes processingAppear {
            from { opacity: 0; transform: translateY(15px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .processing-header {
            display: flex;
            align-items: center;
            justify-content: space-between;
            margin-bottom: 22px;
        }

        .processing-label {
            color: var(--cyan);
            font-size: 10px;
            font-weight: 700;
            letter-spacing: 1.5px;
        }

        .processing-indicator {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background: var(--cyan);
            box-shadow: 0 0 12px var(--cyan);
            animation: processingPulse 1s infinite;
        }

        @keyframes processingPulse {
            50% { opacity: .3; transform: scale(.7); }
        }

        .processing-visual {
            display: grid;
            place-items: center;
            min-height: 120px;
            margin-bottom: 22px;
            overflow: hidden;
            border: 1px solid rgba(100,216,240,.18);
            border-radius: 12px;
            background:
                radial-gradient(circle, rgba(37,143,208,.17), transparent 65%),
                #071827;
        }

        .neural-network {
            width: 100%;
            max-width: 290px;
            height: 115px;
        }

        .neural-line {
            stroke: rgba(100,216,240,.3);
            stroke-width: 1.5;
            stroke-dasharray: 5 5;
            animation: neuralFlow 1.5s linear infinite;
        }

        .neural-node {
            fill: #64d8f0;
            filter: drop-shadow(0 0 5px #36b9e9);
            animation: nodePulse 1.5s ease-in-out infinite alternate;
        }

        @keyframes neuralFlow {
            to { stroke-dashoffset: -20; }
        }

        @keyframes nodePulse {
            from { opacity: .4; }
            to { opacity: 1; }
        }

        .processing-steps {
            display: grid;
            gap: 12px;
        }

        .processing-step {
            display: flex;
            align-items: center;
            gap: 12px;
            padding: 12px;
            border: 1px solid rgba(100,216,240,.1);
            border-radius: 9px;
            background: rgba(4,17,29,.45);
            opacity: .4;
            transition: .35s ease;
        }

        .processing-step.active {
            opacity: 1;
            border-color: rgba(100,216,240,.55);
            background: rgba(37,143,208,.12);
            box-shadow: 0 0 18px rgba(37,143,208,.1);
        }

        .processing-step.completed {
            opacity: .8;
            border-color: rgba(100,216,240,.25);
        }

        .processing-number {
            display: grid;
            place-items: center;
            width: 28px;
            height: 28px;
            flex-shrink: 0;
            border-radius: 50%;
            background: rgba(100,216,240,.1);
            color: var(--cyan);
            font-size: 11px;
            font-weight: 700;
        }

        .processing-step.active .processing-number {
            background: var(--cyan);
            color: #04111d;
            box-shadow: 0 0 12px rgba(100,216,240,.5);
        }

        .processing-step h4 {
            color: var(--white);
            font-size: 11px;
            margin-bottom: 4px;
        }

        .processing-step p {
            color: var(--muted);
            font-size: 10px;
        }

        .processing-progress {
            height: 4px;
            margin-top: 20px;
            overflow: hidden;
            border-radius: 10px;
            background: #04111d;
        }

        .processing-progress-fill {
            width: 0;
            height: 100%;
            background: linear-gradient(90deg, #258fd0, #64d8f0);
            box-shadow: 0 0 12px var(--cyan);
            transition: width 1s ease;
        }

        .processing-footer {
            display: flex;
            justify-content: space-between;
            margin-top: 9px;
            color: var(--muted);
            font-size: 10px;
        }

        @media (prefers-reduced-motion: reduce) {
            .ai-processing *,
            .ai-processing *::before {
                animation: none !important;
                transition: none !important;
            }
        }
    `;

    document.head.appendChild(style);


    /* =========================================
       SAMPLE DATA
       ========================================= */

    const samples = {
        "sample-a": {
            selection: "Échantillon A sélectionné. Prêt pour l'analyse.",
            title: "Motif de type A",
            description:
                "Dans cette simulation, le modèle associe cet échantillon à la catégorie A à partir de caractéristiques visuelles fictives.",
            confidence: 94
        },

        "sample-b": {
            selection: "Échantillon B sélectionné. Prêt pour l'analyse.",
            title: "Motif de type B",
            description:
                "Dans cette simulation, le modèle associe cet échantillon à la catégorie B à partir de caractéristiques visuelles fictives.",
            confidence: 87
        },

        "sample-c": {
            selection: "Échantillon C sélectionné. Prêt pour l'analyse.",
            title: "Motif de type C",
            description:
                "Dans cette simulation, le modèle associe cet échantillon à la catégorie C à partir de caractéristiques visuelles fictives.",
            confidence: 91
        }
    };


    let selectedSample = "sample-a";
    let analysisInProgress = false;
    let analysisTimers = [];
    let analysisVersion = 0;


    /* =========================================
       TIMER CONTROL
       ========================================= */

    function clearAnalysisTimers() {
        analysisTimers.forEach(timer => clearTimeout(timer));
        analysisTimers = [];
    }


    /* =========================================
       RESET INTERFACE
       ========================================= */

    function resetResult() {

        analysisVersion++;

        clearAnalysisTimers();

        analysisInProgress = false;

        analyzeButton.disabled = false;
        analyzeButton.textContent = "Analyser";

        resultContent.classList.remove("visible");

        resultPlaceholder.style.display = "grid";

        // إزالة الشبكة العصبية والمراحل السابقة بالكامل
        resultPlaceholder.innerHTML = `
            <div>
                <div class="placeholder-icon">⌁</div>
                <p>Sélectionnez un échantillon puis lancez l'analyse.</p>
            </div>
        `;

        confidenceFill.style.width = "0%";
        confidenceValue.textContent = "0 %";
    }


    /* =========================================
       PROCESSING INTERFACE
       ========================================= */

    function showProcessingInterface() {

        resultPlaceholder.innerHTML = `

            <div class="ai-processing">

                <div class="processing-header">
                    <span class="processing-label">
                        SYSTÈME D'ANALYSE IA
                    </span>
                    <span class="processing-indicator"></span>
                </div>

                <div class="processing-visual">

                    <svg class="neural-network"
                         viewBox="0 0 290 115"
                         role="img"
                         aria-label="Illustration d'un réseau neuronal">

                        <g class="neural-line" fill="none">
                            <path d="M35 25 L130 20 L255 35"/>
                            <path d="M35 25 L130 58 L255 35"/>
                            <path d="M35 58 L130 20 L255 75"/>
                            <path d="M35 58 L130 58 L255 75"/>
                            <path d="M35 90 L130 58 L255 35"/>
                            <path d="M35 90 L130 95 L255 75"/>
                            <path d="M130 20 L255 75"/>
                            <path d="M130 95 L255 35"/>
                        </g>

                        <g>
                            <circle class="neural-node" cx="35" cy="25" r="5"/>
                            <circle class="neural-node" cx="35" cy="58" r="5"/>
                            <circle class="neural-node" cx="35" cy="90" r="5"/>
                            <circle class="neural-node" cx="130" cy="20" r="5"/>
                            <circle class="neural-node" cx="130" cy="58" r="6"/>
                            <circle class="neural-node" cx="130" cy="95" r="5"/>
                            <circle class="neural-node" cx="255" cy="35" r="5"/>
                            <circle class="neural-node" cx="255" cy="75" r="5"/>
                        </g>

                    </svg>

                </div>

                <div class="processing-steps">

                    <div class="processing-step active" id="process-step-1">
                        <span class="processing-number">01</span>
                        <div>
                            <h4>Acquisition des données</h4>
                            <p>Réception de l'échantillon virtuel...</p>
                        </div>
                    </div>

                    <div class="processing-step" id="process-step-2">
                        <span class="processing-number">02</span>
                        <div>
                            <h4>Analyse neuronale</h4>
                            <p>Traitement des caractéristiques...</p>
                        </div>
                    </div>

                    <div class="processing-step" id="process-step-3">
                        <span class="processing-number">03</span>
                        <div>
                            <h4>Génération du résultat</h4>
                            <p>Préparation de la classification...</p>
                        </div>
                    </div>

                </div>

                <div class="processing-progress">
                    <div class="processing-progress-fill"
                         id="processing-progress-fill"></div>
                </div>

                <div class="processing-footer">
                    <span id="processing-message">Initialisation...</span>
                    <strong id="processing-percentage">0 %</strong>
                </div>

            </div>
        `;
    }


    /* =========================================
       UPDATE STAGE
       ========================================= */

    function updateProcessingStage(stage, percentage, message) {

        for (let i = 1; i <= 3; i++) {

            const step = document.getElementById("process-step-" + i);

            if (!step) continue;

            step.classList.remove("active", "completed");

            if (i < stage) step.classList.add("completed");

            if (i === stage) step.classList.add("active");
        }

        const progress = document.getElementById("processing-progress-fill");
        const percentageText = document.getElementById("processing-percentage");
        const messageText = document.getElementById("processing-message");

        if (progress) progress.style.width = percentage + "%";

        if (percentageText) percentageText.textContent = percentage + " %";

        if (messageText) messageText.textContent = message;
    }


    /* =========================================
       SELECT SAMPLE
       ========================================= */

    sampleButtons.forEach(button => {

        button.addEventListener("click", () => {

            if (analysisInProgress) return;

            selectedSample = button.dataset.sample;

            sampleButtons.forEach(item => {

                const isSelected = item === button;

                item.classList.toggle("selected", isSelected);

                item.setAttribute("aria-pressed", String(isSelected));
            });

            sampleDescription.textContent =
                samples[selectedSample].selection;

            // مسح كل ما يخص التحليل السابق فور اختيار عينة جديدة
            resetResult();
        });

    });


    /* =========================================
       ANALYZE
       ========================================= */

    analyzeButton.addEventListener("click", () => {

        if (analysisInProgress) return;

        const sample = samples[selectedSample];

        if (!sample) return;

        analysisInProgress = true;

        const currentVersion = ++analysisVersion;

        clearAnalysisTimers();

        analyzeButton.disabled = true;
        analyzeButton.textContent = "Analyse en cours...";

        resultContent.classList.remove("visible");

        resultPlaceholder.style.display = "grid";

        showProcessingInterface();

        updateProcessingStage(1, 10, "Réception des données...");


        analysisTimers.push(setTimeout(() => {

            if (currentVersion !== analysisVersion) return;

            updateProcessingStage(
                2,
                45,
                "Analyse des caractéristiques..."
            );

        }, 1100));


        analysisTimers.push(setTimeout(() => {

            if (currentVersion !== analysisVersion) return;

            updateProcessingStage(
                3,
                80,
                "Génération de la classification..."
            );

        }, 2300));


        analysisTimers.push(setTimeout(() => {

            if (currentVersion !== analysisVersion) return;

            updateProcessingStage(
                3,
                100,
                "Simulation terminée."
            );

            analysisTimers.push(setTimeout(() => {

                if (currentVersion !== analysisVersion) return;

                resultPlaceholder.style.display = "none";

                resultStatus.textContent = "ANALYSE TERMINÉE";
                resultTitle.textContent = sample.title;
                resultDescription.textContent = sample.description;

                confidenceValue.textContent = sample.confidence + " %";

                resultContent.classList.add("visible");

                requestAnimationFrame(() => {
                    confidenceFill.style.width = sample.confidence + "%";
                });

                analyzeButton.disabled = false;
                analyzeButton.textContent = "Analyser à nouveau";

                analysisInProgress = false;

                clearAnalysisTimers();

            }, 500));

        }, 3500));

    });

});
