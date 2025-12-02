// ==================== ÉTAPE 7 : SÉLECTION DE LIGNE ET PANNEAUX DE DÉTAILS ====================

// Variables d'état pour les lignes sélectionnées
let selectedFundingPair = null;
let selectedPricePair = null;

// ==================== FONCTION POUR METTRE À JOUR LE PANNEAU FUNDING ====================
function updateFundingDetails(row) {
    const panel = document.getElementById("funding-details-panel");
    if (!panel) return;

    if (!row) {
        panel.innerHTML = "<div style='text-align:center; color:#6b7280;'>Select a pair to view detailed funding data.</div>";
        return;
    }

    const exchanges = row.exchanges || {};

    // Extraire les valeurs numériques valides
    const values = Object.entries(exchanges)
        .filter(([exId, v]) => typeof v === "number" && !isNaN(v))
        .map(([exId, v]) => ({ exchange: exId, value: v }));

    let avg = 0;
    let min = null;
    let max = null;

    if (values.length > 0) {
        const sum = values.reduce((acc, x) => acc + x.value, 0);
        avg = sum / values.length;
        min = values.reduce((acc, x) => (acc === null || x.value < acc.value ? x : acc), null);
        max = values.reduce((acc, x) => (acc === null || x.value > acc.value ? x : acc), null);
    }

    // Construction du contenu HTML
    panel.innerHTML = `
        <div class="details-header">
            <div class="details-title">${row.pair}</div>
            <div class="details-subtitle">Funding overview</div>
        </div>
        <div class="details-grid">
            <div class="details-card">
                <div class="details-label">Current APR</div>
                <div class="details-value">${(row.apr ?? 0).toFixed(2)} %</div>
            </div>
            <div class="details-card">
                <div class="details-label">Average funding (all exchanges)</div>
                <div class="details-value">${avg ? avg.toFixed(2) + " %" : "N/A"}</div>
            </div>
            <div class="details-card">
                <div class="details-label">Max funding</div>
                <div class="details-value">
                    ${max ? max.value.toFixed(2) + " % (" + max.exchange + ")" : "N/A"}
                </div>
            </div>
            <div class="details-card">
                <div class="details-label">Min funding</div>
                <div class="details-value">
                    ${min ? min.value.toFixed(2) + " % (" + min.exchange + ")" : "N/A"}
                </div>
            </div>
            <div class="details-card">
                <div class="details-label">Strategy</div>
                <div class="details-value">
                    <span class="text-long">LONG ${row.strategy?.long || "-"}</span>
                    <span class="text-short">SHORT ${row.strategy?.short || "-"}</span>
                </div>
            </div>
        </div>
    `;
}

// ==================== FONCTION POUR METTRE À JOUR LE PANNEAU PRICE ====================
function updatePriceDetails(row) {
    const panel = document.getElementById("price-details-panel");
    if (!panel) return;

    if (!row) {
        panel.innerHTML = "<div style='text-align:center; color:#6b7280;'>Select a pair to view detailed price arbitrage data.</div>";
        return;
    }

    const exchanges = row.exchanges || {};

    const values = Object.entries(exchanges)
        .filter(([exId, v]) => typeof v === "number" && !isNaN(v))
        .map(([exId, v]) => ({ exchange: exId, value: v }));

    let avg = 0;
    let min = null;
    let max = null;

    if (values.length > 0) {
        const sum = values.reduce((acc, x) => acc + x.value, 0);
        avg = sum / values.length;
        min = values.reduce((acc, x) => (acc === null || x.value < acc.value ? x : acc), null);
        max = values.reduce((acc, x) => (acc === null || x.value > acc.value ? x : acc), null);
    }

    panel.innerHTML = `
        <div class="details-header">
            <div class="details-title">${row.pair}</div>
            <div class="details-subtitle">Price arbitrage overview</div>
        </div>
        <div class="details-grid">
            <div class="details-card">
                <div class="details-label">Current spread</div>
                <div class="details-value">${(row.spread ?? 0).toFixed(2)} %</div>
            </div>
            <div class="details-card">
                <div class="details-label">Average price</div>
                <div class="details-value">
                    ${avg ? "$" + avg.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : "N/A"}
                </div>
            </div>
            <div class="details-card">
                <div class="details-label">Max price</div>
                <div class="details-value">
                    ${max ? "$" + max.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + max.exchange + ")" : "N/A"}
                </div>
            </div>
            <div class="details-card">
                <div class="details-label">Min price</div>
                <div class="details-value">
                    ${min ? "$" + min.value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) + " (" + min.exchange + ")" : "N/A"}
                </div>
            </div>
            <div class="details-card">
                <div class="details-label">Strategy</div>
                <div class="details-value">
                    <span class="text-long">LONG ${row.strategy?.long || "-"}</span>
                    <span class="text-short">SHORT ${row.strategy?.short || "-"}</span>
                </div>
            </div>
        </div>
    `;
}

// ==================== MODIFIED renderFundingTable (ÉTAPE 7) ====================
function renderFundingTable(data) {
    if (!fundingTableBody) return;
    fundingTableBody.innerHTML = "";

    // Réinitialiser la sélection
    selectedFundingPair = null;
    updateFundingDetails(null);

    const exchangeOrder = [
        "paradex", "vest", "extended", "hyperliquid", "lighter",
        "hibachi", "aster", "pacifica", "variational"
    ];

    data.forEach(row => {
        const tr = document.createElement("tr");

        // LISTENER DE CLIC SUR LA LIGNE ENTIÈRE
        tr.addEventListener("click", () => {
            selectedFundingPair = row.pair;

            // Retirer la classe selected-row de toutes les lignes
            Array.from(fundingTableBody.querySelectorAll("tr")).forEach(r => {
                r.classList.remove("selected-row");
            });

            // Ajouter la classe selected-row à cette ligne
            tr.classList.add("selected-row");

            // Mettre à jour le panneau de détails
            updateFundingDetails(row);
        });

        // Colonne Pair
        const tdPair = document.createElement("td");
        tdPair.textContent = row.pair;
        tr.appendChild(tdPair);

        // Colonne APR
        const tdApr = document.createElement("td");
        tdApr.textContent = row.apr.toFixed(2) + " %";
        tr.appendChild(tdApr);

        // Colonne Strategy WITH AFFILIATE LINKS
        const tdStrategy = document.createElement("td");

        // LONG
        const longWrapper = document.createElement("div");
        longWrapper.classList.add("text-long");
        const longLabel = document.createElement("span");
        longLabel.textContent = "LONG ";
        longWrapper.appendChild(longLabel);

        if (row.strategy && row.strategy.long) {
            const longExId = row.strategy.long;
            const longExSpan = document.createElement("span");
            longExSpan.textContent = longExId;
            longExSpan.classList.add("affiliate-link");
            longExSpan.addEventListener("click", (e) => {
                e.stopPropagation();
                openExchange(longExId);
            });
            longWrapper.appendChild(longExSpan);
        }

        tdStrategy.appendChild(longWrapper);

        // SHORT
        const shortWrapper = document.createElement("div");
        shortWrapper.classList.add("text-short");
        const shortLabel = document.createElement("span");
        shortLabel.textContent = "SHORT ";
        shortWrapper.appendChild(shortLabel);

        if (row.strategy && row.strategy.short) {
            const shortExId = row.strategy.short;
            const shortExSpan = document.createElement("span");
            shortExSpan.textContent = shortExId;
            shortExSpan.classList.add("affiliate-link");
            shortExSpan.addEventListener("click", (e) => {
                e.stopPropagation();
                openExchange(shortExId);
            });
            shortWrapper.appendChild(shortExSpan);
        }

        tdStrategy.appendChild(shortWrapper);
        tr.appendChild(tdStrategy);

        // Colonnes par exchange WITH AFFILIATE LINKS
        exchangeOrder.forEach(exId => {
            const td = document.createElement("td");
            const span = document.createElement("span");
            span.classList.add("affiliate-link");

            const value = row.exchanges[exId];
            if (typeof value === "number") {
                span.textContent = value.toFixed(2) + " %";
            } else if (value === null || value === undefined) {
                span.textContent = "-";
            } else {
                span.textContent = String(value);
            }

            span.addEventListener("click", (e) => {
                e.stopPropagation();
                openExchange(exId);
            });

            td.appendChild(span);
            tr.appendChild(td);
        });

        fundingTableBody.appendChild(tr);
    });
}

// ==================== MODIFIED renderPriceTable (ÉTAPE 7) ====================
function renderPriceTable(data) {
    if (!priceTableBody) return;
    priceTableBody.innerHTML = "";

    // Réinitialiser la sélection
    selectedPricePair = null;
    updatePriceDetails(null);

    const exchangeOrder = [
        "paradex", "vest", "extended", "hyperliquid", "lighter",
        "hibachi", "aster", "pacifica", "variational"
    ];

    data.forEach(row => {
        const tr = document.createElement("tr");

        // LISTENER DE CLIC SUR LA LIGNE ENTIÈRE
        tr.addEventListener("click", () => {
            selectedPricePair = row.pair;

            Array.from(priceTableBody.querySelectorAll("tr")).forEach(r => {
                r.classList.remove("selected-row");
            });

            tr.classList.add("selected-row");
            updatePriceDetails(row);
        });

        // Colonne Pair
        const tdPair = document.createElement("td");
        tdPair.textContent = row.pair;
        tr.appendChild(tdPair);

        // Colonne Spread
        const tdSpread = document.createElement("td");
        tdSpread.textContent = row.spread.toFixed(2) + " %";
        tr.appendChild(tdSpread);

        // Colonne Strategy WITH AFFILIATE LINKS
        const tdStrategy = document.createElement("td");

        // LONG
        const longWrapper = document.createElement("div");
        longWrapper.classList.add("text-long");
        const longLabel = document.createElement("span");
        longLabel.textContent = "LONG ";
        longWrapper.appendChild(longLabel);

        if (row.strategy && row.strategy.long) {
            const longExId = row.strategy.long;
            const longExSpan = document.createElement("span");
            longExSpan.textContent = longExId;
            longExSpan.classList.add("affiliate-link");
            longExSpan.addEventListener("click", (e) => {
                e.stopPropagation();
                openExchange(longExId);
            });
            longWrapper.appendChild(longExSpan);
        }

        tdStrategy.appendChild(longWrapper);

        // SHORT
        const shortWrapper = document.createElement("div");
        shortWrapper.classList.add("text-short");
        const shortLabel = document.createElement("span");
        shortLabel.textContent = "SHORT ";
        shortWrapper.appendChild(shortLabel);

        if (row.strategy && row.strategy.short) {
            const shortExId = row.strategy.short;
            const shortExSpan = document.createElement("span");
            shortExSpan.textContent = shortExId;
            shortExSpan.classList.add("affiliate-link");
            shortExSpan.addEventListener("click", (e) => {
                e.stopPropagation();
                openExchange(shortExId);
            });
            shortWrapper.appendChild(shortExSpan);
        }

        tdStrategy.appendChild(shortWrapper);
        tr.appendChild(tdStrategy);

        // Colonnes prix par exchange WITH AFFILIATE LINKS
        exchangeOrder.forEach(exId => {
            const td = document.createElement("td");
            const span = document.createElement("span");
            span.classList.add("affiliate-link");

            const value = row.exchanges[exId];
            if (typeof value === "number") {
                span.textContent = "$" + value.toLocaleString(undefined, {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                });
            } else if (value === null || value === undefined) {
                span.textContent = "-";
            } else {
                span.textContent = String(value);
            }

            span.addEventListener("click", (e) => {
                e.stopPropagation();
                openExchange(exId);
            });

            td.appendChild(span);
            tr.appendChild(td);
        });

        priceTableBody.appendChild(tr);
    });
}

// ==================== INITIALISATION (À AJOUTER DANS LA FONCTION init()) ====================
// Après setActiveTab("funding") et avant refreshAll(), ajouter :
// updateFundingDetails(null);
// updatePriceDetails(null);
