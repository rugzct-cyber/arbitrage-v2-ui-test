// ==================== AFFILIATE LINKS ====================
const EXCHANGE_LINKS = {
    paradex: "https://app.paradex.trade/r/0xrugz",
    vest: "https://alpha.vestmarkets.com/join/0XRGZ",
    extended: "https://app.extended.exchange/join/0XRUGZ",
    hyperliquid: "https://app.hyperliquid.xyz/join/0XRUGZ",
    lighter: "https://app.lighter.xyz/?referral=0XRUGZ",
    hibachi: "https://hibachi.xyz/r/0xrugz",
    aster: "https://www.asterdex.com/en/referral/6f113B",
    pacifica: "https://app.pacifica.fi?referral=0xrugz",
    variational: "https://omni.variational.io/?ref=OMNIILQCGBAI"
};

function openExchange(exchangeId) {
    const url = EXCHANGE_LINKS[exchangeId];
    if (!url) {
        console.warn("No affiliate URL for exchange:", exchangeId);
        return;
    }
    window.open(url, "_blank", "noopener,noreferrer");
}

// ==================== MODIFIED renderFundingTable ====================
function renderFundingTable(data) {
    if (!fundingTableBody) return;
    fundingTableBody.innerHTML = "";

    const exchangeOrder = [
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

    data.forEach(row => {
        const tr = document.createElement("tr");

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

// ==================== MODIFIED renderPriceTable ====================
function renderPriceTable(data) {
    if (!priceTableBody) return;
    priceTableBody.innerHTML = "";

    const exchangeOrder = [
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

    data.forEach(row => {
        const tr = document.createElement("tr");

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
