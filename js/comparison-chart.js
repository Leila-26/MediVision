
document.addEventListener("DOMContentLoaded", () => {

    const resultContent = document.getElementById("result-content");
    const resultTitle = document.getElementById("result-title");

    if (!resultContent || !resultTitle) return;


    /* =========================================
       CHART STYLES
       ========================================= */

    const style = document.createElement("style");

    style.textContent = `

        .comparison-chart {
            width: 100%;
            margin-top: 25px;
            padding: 20px;
            border: 1px solid rgba(100,216,240,.16);
            border-radius: 14px;
            background: linear-gradient(
                145deg,
                rgba(18,51,77,.75),
                rgba(4,17,29,.9)
            );
            animation: chartAppear .7s ease both;
        }

        @keyframes chartAppear {
            from {
                opacity: 0;
                transform: translateY(18px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .chart-heading {
            margin-bottom: 8px;
            color: var(--white);
            font-size: 15px;
            font-weight: 700;
        }

        .chart-subheading {
            margin-bottom: 25px;
            color: var(--muted);
            font-size: 11px;
            line-height: 1.6;
        }

        .chart-row {
            display: grid;
            grid-template-columns: 75px 1fr 42px;
            align-items: center;
            gap: 10px;
            margin-bottom: 20px;
        }

        .chart-category {
            color: var(--text);
            font-size: 11px;
            font-weight: 600;
        }

        .chart-track {
            height: 11px;
            overflow: hidden;
            border-radius: 20px;
            background: rgba(4,17,29,.9);
        }

        .chart-fill {
            width: 0;
            height: 100%;
            border-radius: 20px;
            background: linear-gradient(
                90deg,
                #258fd0,
                #64d8f0
            );
            box-shadow: 0 0 12px rgba(100,216,240,.35);
            transition: width 1.3s cubic-bezier(.2,.8,.2,1);
        }

        .chart-row.best .chart-fill {
            background: linear-gradient(
                90deg,
                #258fd0,
                #64d8f0,
                #a1f1ff
            );
            box-shadow: 0 0 16px rgba(100,216,240,.5);
        }

        .chart-value {
            color: var(--cyan);
            font-size: 11px;
            font-weight: 700;
            text-align: right;
        }

        .chart-note {
            margin-top: 22px;
            padding-top: 13px;
            border-top: 1px solid rgba(100,216,240,.12);
            color: var(--muted);
            font-size: 10px;
            line-height: 1.7;
        }

        .chart-note strong {
            color: var(--cyan);
        }

        @media (max-width: 400px) {
            .comparison-chart {
                padding: 14px;
            }

            .chart-row {
                grid-template-columns: 65px 1fr 38px;
                gap: 7px;
            }
        }

        @media (prefers-reduced-motion: reduce) {
            .comparison-chart,
            .chart-fill {
                animation: none !important;
                transition: none !important;
            }
        }

    `;

    document.head.appendChild(style);


    /* =========================================
       EDUCATIONAL SIMULATED DATA
       ========================================= */

    const comparisonData = {

        A: [
            { name: "Catégorie A", value: 94 },
            { name: "Catégorie B", value: 4 },
            { name: "Catégorie C", value: 2 }
        ],

        B: [
            { name: "Catégorie A", value: 6 },
            { name: "Catégorie B", value: 87 },
            { name: "Catégorie C", value: 7 }
        ],

        C: [
            { name: "Catégorie A", value: 3 },
            { name: "Catégorie B", value: 6 },
            { name: "Catégorie C", value: 91 }
        ]

    };


    /* =========================================
       CREATE CHART
       ========================================= */

    let chartContainer = null;

    function createChart() {

        if (chartContainer) return;

        chartContainer = document.createElement("section");

        chartContainer.className = "comparison-chart";

        chartContainer.innerHTML = `

            <h3 class="chart-heading">
                Comparaison des catégories
            </h3>

            <p class="chart-subheading">
                Répartition simulée des scores pour chaque catégorie.
            </p>

            <div class="chart-bars" id="chart-bars"></div>

            <p class="chart-note">
                <strong>Note pédagogique :</strong>
                ces valeurs sont fictives et servent uniquement
                à illustrer une comparaison entre plusieurs catégories.
                Elles ne proviennent pas d'un véritable modèle d'IA.
            </p>

        `;

        resultContent.appendChild(chartContainer);
    }


    /* =========================================
       UPDATE CHART
       ========================================= */

    function updateChart() {

        const title = resultTitle.textContent.trim();

        let sampleType = null;

        if (title.includes("type A")) sampleType = "A";
        if (title.includes("type B")) sampleType = "B";
        if (title.includes("type C")) sampleType = "C";

        if (!sampleType) return;

        createChart();

        const barsContainer =
            chartContainer.querySelector("#chart-bars");

        const values = comparisonData[sampleType];

        const highestValue = Math.max(
            ...values.map(item => item.value)
        );

        barsContainer.innerHTML = "";

        values.forEach(item => {

            const row = document.createElement("div");

            row.className = "chart-row";

            if (item.value === highestValue) {
                row.classList.add("best");
            }

            row.innerHTML = `

                <span class="chart-category">
                    ${item.name}
                </span>

                <div class="chart-track">
                    <div class="chart-fill"></div>
                </div>

                <span class="chart-value">
                    ${item.value}%
                </span>

            `;

            barsContainer.appendChild(row);

            const fill = row.querySelector(".chart-fill");

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    fill.style.width = item.value + "%";
                });
            });

        });

    }


    /* =========================================
       WATCH FOR NEW RESULTS
       ========================================= */

    const observer = new MutationObserver(() => {

        if (resultContent.classList.contains("visible")) {
            updateChart();
        }

    });

    observer.observe(resultContent, {
        attributes: true,
        attributeFilter: ["class"]
    });

});
