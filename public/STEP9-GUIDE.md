# Étape 9 - Graphiques Chart.js dans les Panneaux de Détails

## Vue d'ensemble

Cette étape ajoute des graphiques interactifs dans les panneaux de détails pour visualiser l'évolution des APR (funding) et spreads (price).

**Fonctionnalités** :
- ✅ Graphiques Chart.js dans les deux panneaux
- ✅ Données mock générées à partir du row sélectionné
- ✅ Mise à jour automatique au clic sur une ligne
- ✅ Destruction propre des charts lors de la désélection

## Fichiers de référence

- [`step9-code.js`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step9-code.js) - JavaScript complet
- [`step9-styles.css`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step9-styles.css) - CSS pour charts

## Instructions d'intégration

### 1. Ajouter Chart.js dans le `<head>`

**Localisation** : Dans `<head>`, avant la fermeture `</head>`

```html
<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
```

### 2. Ajouter le CSS pour les charts

**Localisation** : Dans `<style>`, avant la fermeture `</style>`

Copier le contenu de [`step9-styles.css`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step9-styles.css) :

```css
.details-chart-wrapper {
    margin-top: 16px;
    background: #05070d;
    border-radius: 12px;
    border: 1px solid rgba(148, 163, 184, 0.3);
    padding: 8px 12px;
}

.details-chart-wrapper canvas {
    width: 100%;
    max-height: 220px;
}
```

### 3. Ajouter les variables globales pour les charts

**Localisation** : Dans `<script>`, après `selectedPricePair`

```javascript
// ==================== INSTANCES DE CHART ====================
let fundingChart = null;
let priceChart = null;
```

### 4. Ajouter les fonctions de génération de données mock

**Localisation** : Après les variables globales

```javascript
// ==================== DONNÉES MOCK POUR LES CHARTS ====================
function buildMockSeriesFromFundingRow(row) {
    const points = [];
    const base = typeof row.apr === "number" ? row.apr : 0;
    const exValues = Object.values(row.exchanges || {}).filter(v => typeof v === "number");
    const avgEx = exValues.length ? exValues.reduce((a, b) => a + b, 0) / exValues.length : 0;

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

    return { spreadSeries: points, avgPrice: avgPrice };
}
```

### 5. Ajouter les fonctions de rendu des charts

**Localisation** : Après les fonctions de génération de données

```javascript
// ==================== RENDU DES CHARTS ====================
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
            datasets: [{
                label: "Estimated APR (mock)",
                data: dataSeries,
                borderColor: "rgba(74, 222, 128, 0.8)",
                backgroundColor: "rgba(74, 222, 128, 0.1)",
                tension: 0.3,
                borderWidth: 2,
                pointRadius: 0,
                fill: true
            }]
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
                    ticks: { color: "#9ca3af", font: { size: 10 } },
                    grid: { color: "rgba(55, 65, 81, 0.4)" }
                },
                y: {
                    ticks: {
                        color: "#9ca3af",
                        font: { size: 10 },
                        callback: (value) => value.toFixed ? value.toFixed(2) + " %" : value + " %"
                    },
                    grid: { color: "rgba(55, 65, 81, 0.4)" }
                }
            }
        }
    });
}

function renderPriceChart(row) {
    // Voir step9-code.js pour la fonction complète
}
```

### 6. Modifier `updateFundingDetails()`

**Localisation** : Remplacer la fonction existante

**Modifications clés** :

#### A. Gestion du cas null

```javascript
if (!row) {
    panel.innerHTML = "<div>Select a pair to view detailed funding data.</div>";
    if (fundingChart) {
        fundingChart.destroy();
        fundingChart = null;
    }
    return;
}
```

#### B. Ajout du canvas dans le HTML

```javascript
panel.innerHTML = `
    <div class="details-header">...</div>
    <div class="details-grid">...</div>
    <div class="details-chart-wrapper">
        <canvas id="funding-chart"></canvas>
    </div>
`;
```

#### C. Appel du rendu du chart

```javascript
// À la fin de la fonction
renderFundingChart(row);
```

### 7. Modifier `updatePriceDetails()`

**Modifications identiques** à `updateFundingDetails()` :
- Détruire `priceChart` si null
- Ajouter `<canvas id="price-chart">`
- Appeler `renderPriceChart(row)`

## Fonctionnement

### Génération des données mock

**Funding** :
- Génère 8 points basés sur `row.apr` et la moyenne des exchanges
- Ajoute des variations sinusoïdales + aléatoires
- Labels : "T-56h", "T-48h", ..., "T-0h"

**Price** :
- Génère 8 points basés sur `row.spread`
- Variations similaires pour simuler l'évolution
- Labels : "T-35m", "T-30m", ..., "T-0m"

### Lifecycle des charts

1. **Création** : Au clic sur une ligne → `renderFundingChart(row)` crée le chart
2. **Mise à jour** : Au clic sur une autre ligne → `fundingChart.destroy()` puis nouveau chart
3. **Destruction** : Désélection → `fundingChart.destroy()` + `fundingChart = null`

## Configuration Chart.js

### Couleurs

- **Funding** : Vert `rgba(74, 222, 128, 0.8)` avec fill semi-transparent
- **Price** : Bleu `rgba(147, 197, 253, 0.8)` avec fill semi-transparent

### Options

- `responsive: true` - S'adapte à la largeur du conteneur
- `maintainAspectRatio: false` - Respecte max-height: 220px
- `tension: 0.3` - Courbes lisses
- `pointRadius: 0` - Pas de points visibles (ligne continue)
- `fill: true` - Aire sous la courbe colorée

## Vérification

- [ ] Chart.js se charge correctement (pas d'erreur console)
- [ ] Clic sur ligne Funding → graphique apparaît avec courbe verte
- [ ] Clic sur ligne Price → graphique apparaît avec courbe bleue
- [ ] Changement de ligne → graphique se met à jour
- [ ] Désélection → graphique disparaît proprement
- [ ] Aucun conflit avec tri, sidebar, ou affiliate links

## Future amélioration

En production, remplacer les données mock par :
- Endpoint historique `/api/funding-history?pair=BTC-PERP`
- Données réelles avec timestamps
- Graphiques multi-lignes (un par exchange)

---

**Référence complète** : [`step9-code.js`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step9-code.js) contient les fonctions complètes avec toutes les options Chart.js
