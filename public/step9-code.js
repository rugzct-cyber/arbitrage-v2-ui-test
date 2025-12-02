// ==================== ÉTAPE 9 : GRAPHIQUES CHART.JS DANS LES PANNEAUX DE DÉTAILS ====================

// ==================== ÉTAT GLOBAL POUR LES INSTANCES DE CHART ====================
let fundingChart = null;
let priceChart = null;

// ==================== FONCTIONS POUR GÉNÉRER DES DONNÉES MOCK ====================
function buildMockSeriesFromFundingRow(row) {
    const points = [];

    const base = typeof row.apr === "number" ? row.apr : 0;
    const exValues = Object.values(row.exchanges || {}).filter(v => typeof v === "number");
    const avgEx = exValues.length ? exValues.reduce((a, b) => a + b, 0) / exValues.length : 0;

    // Générer 8 points dans le temps
    for (let i = 0; i < 8; i++) {
        const variation = (Math.sin(i / 2) * 0.1 + (Math.random() - 0.5) * 0.05) * base;
        const value = base + variation * 0.1 + avgEx * 0.02;
        points.push(Math.max(value, 0));
    }

    return points;
}

function buildMockSeriesFromPriceRow(row) {
    const points = [];

    const baseSpread = typeof row.spread === "number" ? row.spread : 0;
    const exValues = Object.values(row.exchanges || {}).filter(v => typeof v === "number");
    const avgPrice = exValues.length ? exValues.reduce((a, b) => a + b, 0) / exValues.length : 0;

    for (let i = 0; i < 8; i++) {
        const spreadVariation = (Math.sin(i / 3) * 0.2 + (Math.random() - 0.5) * 0.1) * baseSpread;
        const value = baseSpread + spreadVariation;
        points.push(value);
    }

    return {
        spreadSeries: points,
        avgPrice: avgPrice
    };
}

// ==================== FONCTION POUR RENDRE LE CHART FUNDING ====================
function renderFundingChart(row) {
    const canvas = document.getElementById("funding-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const dataSeries = buildMockSeriesFromFundingRow(row);

    const labels = dataSeries.map((_, idx) => `T-${(dataSeries.length - 1 - idx) * 8}h`);

    if (fundingChart) {
        fundingChart.destroy();
    }

    fundingChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Estimated APR (mock)",
                    data: dataSeries,
                    borderColor: "rgba(74, 222, 128, 0.8)",
                    backgroundColor: "rgba(74, 222, 128, 0.1)",
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#e5e7eb",
                        font: { size: 11 }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#9ca3af",
                        font: { size: 10 }
                    },
                    grid: {
                        color: "rgba(55, 65, 81, 0.4)"
                    }
                },
                y: {
                    ticks: {
                        color: "#9ca3af",
                        font: { size: 10 },
                        callback: (value) => value.toFixed ? value.toFixed(2) + " %" : value + " %"
                    },
                    grid: {
                        color: "rgba(55, 65, 81, 0.4)"
                    }
                }
            }
        }
    });
}

// ==================== FONCTION POUR RENDRE LE CHART PRICE ====================
function renderPriceChart(row) {
    const canvas = document.getElementById("price-chart");
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    const seriesData = buildMockSeriesFromPriceRow(row);
    const dataSeries = seriesData.spreadSeries;

    const labels = dataSeries.map((_, idx) => `T-${(dataSeries.length - 1 - idx) * 5}m`);

    if (priceChart) {
        priceChart.destroy();
    }

    priceChart = new Chart(ctx, {
        type: "line",
        data: {
            labels,
            datasets: [
                {
                    label: "Spread (mock)",
                    data: dataSeries,
                    borderColor: "rgba(147, 197, 253, 0.8)",
                    backgroundColor: "rgba(147, 197, 253, 0.1)",
                    tension: 0.3,
                    borderWidth: 2,
                    pointRadius: 0,
                    fill: true
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    labels: {
                        color: "#e5e7eb",
                        font: { size: 11 }
                    }
                }
            },
            scales: {
                x: {
                    ticks: {
                        color: "#9ca3af",
                        font: { size: 10 }
                    },
                    grid: {
                        color: "rgba(55, 65, 81, 0.4)"
                    }
                },
                y: {
                    ticks: {
                        color: "#9ca3af",
                        font: { size: 10 },
                        callback: (value) => value.toFixed ? value.toFixed(2) + " %" : value + " %"
                    },
                    grid: {
                        color: "rgba(55, 65, 81, 0.4)"
                    }
                }
            }
        }
    });
}

// ==================== MODIFIED updateFundingDetails (ÉTAPE 9) ====================
function updateFundingDetails(row) {
    const panel = document.getElementById("funding-details-panel");
    if (!panel) return;

    if (!row) {
        panel.innerHTML = "<div style='text-align:center; color:#6b7280;'>Select a pair to view detailed funding data.</div>";
        if (fundingChart) {
            fundingChart.destroy();
            fundingChart = null;
        }
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
        <div class="details-chart-wrapper">
            <canvas id="funding-chart"></canvas>
        </div>
    `;

    // Rendre le graphique
    renderFundingChart(row);
}

// ==================== MODIFIED updatePriceDetails (ÉTAPE 9) ====================
function updatePriceDetails(row) {
    const panel = document.getElementById("price-details-panel");
    if (!panel) return;

    if (!row) {
        panel.innerHTML = "<div style='text-align:center; color:#6b7280;'>Select a pair to view detailed price arbitrage data.</div>";
        if (priceChart) {
            priceChart.destroy();
            priceChart = null;
        }
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
        <div class="details-chart-wrapper">
            <canvas id="price-chart"></canvas>
        </div>
    `;

    // Rendre le graphique
    renderPriceChart(row);
}
