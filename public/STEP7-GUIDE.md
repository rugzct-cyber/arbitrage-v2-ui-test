# Étape 7 - Intégration des Panneaux de Détails

## Vue d'ensemble

Cette étape ajoute :
- ✅ Sélection de ligne au clic avec highlight doré
- ✅ Panneaux de détails avec statistiques (APR, moyenne, min, max)
- ✅ Compatibilité avec les liens d'affiliation (e.stopPropagation)

## Fichiers de référence

- [`step7-code.js`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step7-code.js) - JavaScript complet
- [`step7-styles.css`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step7-styles.css) - CSS pour détails

## Instructions d'intégration

### 1. Ajouter le CSS dans `<style>`

**Localisation** : Avant la fermeture `</style>` (ligne ~641)

Copier tout le contenu de [`step7-styles.css`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step7-styles.css)

### 2. Ajouter les variables d'état

**Localisation** : Dans `<script>`, après `selectedExchanges` (ligne ~783)

```javascript
// ==================== ÉTAT DE SÉLECTION ====================
let selectedFundingPair = null;
let selectedPricePair = null;
```

### 3. Ajouter les fonctions de mise à jour des panneaux

**Localisation** : Après `openExchange()` (ligne ~805)

```javascript
// ==================== PANNEAUX DE DÉTAILS ====================
function updateFundingDetails(row) {
    // Voir step7-code.js lignes 4-58
}

function updatePriceDetails(row) {
    // Voir step7-code.js lignes 60-114
}
```

> [!TIP]
> Copier les fonctions complètes depuis [`step7-code.js`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step7-code.js)

### 4. Modifier `renderFundingTable`

**Remplacements clés** :

#### A. Début de la fonction

```javascript
function renderFundingTable(data) {
    if (!fundingTableBody) return;
    fundingTableBody.innerHTML = "";
    
    // AJOUTER CES LIGNES
    selectedFundingPair = null;
    updateFundingDetails(null);
    
    const exchangeOrder = [...];
```

#### B. Après `const tr = document.createElement("tr");`

```javascript
const tr = document.createElement("tr");

// AJOUTER CE LISTENER
tr.addEventListener("click", () => {
    selectedFundingPair = row.pair;
    
    Array.from(fundingTableBody.querySelectorAll("tr")).forEach(r => {
        r.classList.remove("selected-row");
    });
    
    tr.classList.add("selected-row");
    updateFundingDetails(row);
});

// Puis continuer avec tdPair, tdApr, etc.
```

### 5. Modifier `renderPriceTable`

**Modifications identiques** à `renderFundingTable` :

```javascript
function renderPriceTable(data) {
    if (!priceTableBody) return;
    priceTableBody.innerHTML = "";
    
    // Réinitialiser la sélection
    selectedPricePair = null;
    updatePriceDetails(null);
    
    // ... puis ajouter le même listener sur tr
}
```

### 6. Initialisation

**Localisation** : Dans `init()`, avant `refreshAll()`

```javascript
function init() {
    setActiveTab("funding");
    
    tabButtons.forEach(btn => { /* ... */ });
    
    initializeSidebar();
    
    // AJOUTER CES LIGNES
    updateFundingDetails(null);
    updatePriceDetails(null);
    
    refreshAll();
    
    // ...
}
```

## Vérification

Après l'intégration, vérifiez que :

- [ ] Clic sur une ligne du tableau Funding → highlight doré
- [ ] Panneau `#funding-details-panel` se remplit avec les stats
- [ ] Clic sur une ligne Price → même comportement
- [ ] Clic sur un lien d'affiliation n'active PAS la sélection (grâce à `stopPropagation`)
- [ ] Le tri continue de fonctionner
- [ ] Le refresh conserve la logique de sélection

## Contenu des panneaux

### Funding Details
- Current APR
- Average funding (all exchanges)
- Max funding (valeur + exchange)
- Min funding (valeur + exchange)
- Strategy (LONG/SHORT avec couleurs)

### Price Details
- Current spread
- Average price
- Max price (valeur + exchange)
- Min price (valeur + exchange)
- Strategy (LONG/SHORT avec couleurs)

## Style visuel

- **Ligne sélectionnée** : Fond jaune semi-transparent avec bordure dorée
- **Panneaux** : Grille responsive de cartes avec labels uppercase
- **Cartes** : Fond sombre avec bordures subtiles

---

**Référence complète** : [`step7-code.js`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step7-code.js) contient les fonctions `renderFundingTable()` et `renderPriceTable()` complètes avec tous les listeners
