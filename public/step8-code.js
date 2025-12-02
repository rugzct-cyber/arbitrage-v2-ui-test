// ==================== ÉTAPE 8 : SIDEBAR FONCTIONNELLE - MASQUER/AFFICHER COLONNES ====================

// ==================== FONCTION POUR METTRE À JOUR LA VISIBILITÉ DES COLONNES ====================
function updateExchangeColumnVisibility() {
    const exchangeIds = [
        "paradex",
        "vest",
        "extended",
        "hyperliquid",
        "lighter",
        "hibachi",
        "aster",
        "pacifica",
        "variational"
    ];

    // Funding table
    const fundingTable = document.getElementById("funding-table");
    if (fundingTable) {
        const fundingHeaderCells = fundingTable.querySelectorAll("thead th");
        const fundingRows = fundingTable.querySelectorAll("tbody tr");

        exchangeIds.forEach(exId => {
            // Trouver l'index de colonne pour cet exchange
            let colIndex = -1;
            fundingHeaderCells.forEach((th, idx) => {
                if (th.dataset && th.dataset.exchange === exId) {
                    colIndex = idx;
                }
            });

            if (colIndex === -1) return;

            const visible = !!selectedExchanges[exId];

            // Afficher/masquer le header
            const th = fundingHeaderCells[colIndex];
            th.style.display = visible ? "" : "none";

            // Afficher/masquer chaque cellule de cette colonne
            fundingRows.forEach(tr => {
                const tdList = tr.querySelectorAll("td");
                if (tdList[colIndex]) {
                    tdList[colIndex].style.display = visible ? "" : "none";
                }
            });
        });
    }

    // Price table
    const priceTable = document.getElementById("price-table");
    if (priceTable) {
        const priceHeaderCells = priceTable.querySelectorAll("thead th");
        const priceRows = priceTable.querySelectorAll("tbody tr");

        exchangeIds.forEach(exId => {
            let colIndex = -1;
            priceHeaderCells.forEach((th, idx) => {
                if (th.dataset && th.dataset.exchange === exId) {
                    colIndex = idx;
                }
            });

            if (colIndex === -1) return;

            const visible = !!selectedExchanges[exId];

            const th = priceHeaderCells[colIndex];
            th.style.display = visible ? "" : "none";

            priceRows.forEach(tr => {
                const tdList = tr.querySelectorAll("td");
                if (tdList[colIndex]) {
                    tdList[colIndex].style.display = visible ? "" : "none";
                }
            });
        });
    }
}

// ==================== MODIFIED renderFundingTable (ÉTAPE 8) ====================
function renderFundingTable(data) {
    if (!fundingTableBody) return;
    fundingTableBody.innerHTML = "";

    selectedFundingPair = null;
    updateFundingDetails(null);

    const exchangeOrder = [
        "paradex", "vest", "extended", "hyperliquid", "lighter",
        "hibachi", "aster", "pacifica", "variational"
    ];

    data.forEach(row => {
        const tr = document.createElement("tr");

        tr.addEventListener("click", () => {
            selectedFundingPair = row.pair;
            Array.from(fundingTableBody.querySelectorAll("tr")).forEach(r => {
                r.classList.remove("selected-row");
            });
            tr.classList.add("selected-row");
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

    // APPEL DE LA FONCTION POUR MASQUER/AFFICHER LES COLONNES
    updateExchangeColumnVisibility();
}

// ==================== MODIFIED renderPriceTable (ÉTAPE 8) ====================
function renderPriceTable(data) {
    if (!priceTableBody) return;
    priceTableBody.innerHTML = "";

    selectedPricePair = null;
    updatePriceDetails(null);

    const exchangeOrder = [
        "paradex", "vest", "extended", "hyperliquid", "lighter",
        "hibachi", "aster", "pacifica", "variational"
    ];

    data.forEach(row => {
        const tr = document.createElement("tr");

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

    // APPEL DE LA FONCTION POUR MASQUER/AFFICHER LES COLONNES
    updateExchangeColumnVisibility();
}

// ==================== MODIFIED initializeSidebar (ÉTAPE 8) ====================
function initializeSidebar() {
    exchangeToggles.forEach(toggle => {
        const exId = toggle.dataset.exchange;
        if (!exId) return;

        // État initial : actif
        toggle.classList.add("active");

        toggle.addEventListener("click", () => {
            const current = !!selectedExchanges[exId];
            const next = !current;
            selectedExchanges[exId] = next;

            if (next) {
                toggle.classList.add("active");
            } else {
                toggle.classList.remove("active");
            }

            // Réappliquer le tri + rendu
            // updateExchangeColumnVisibility() sera appelé automatiquement
            // à la fin de renderFundingTable() et renderPriceTable()
            applyFundingSortAndRender();
            applyPriceSortAndRender();
        });
    });
}
