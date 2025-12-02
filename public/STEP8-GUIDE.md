# Étape 8 - Sidebar Fonctionnelle (Masquer/Afficher Colonnes)

## Vue d'ensemble

Cette étape rend la sidebar fonctionnelle pour masquer/afficher les colonnes d'exchanges dans les tableaux.

**Fonctionnalités** :
- ✅ Clic sur exchange dans sidebar → masque/affiche la colonne correspondante
- ✅ État persistant entre refresh et tri
- ✅ Compatible avec toutes les fonctionnalités existantes

## Fichier de référence

- [`step8-code.js`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step8-code.js) - Code JavaScript complet

## Instructions d'intégration

### 1. Ajouter `data-exchange` aux headers HTML

**Localisation** : Dans les `<thead>` des tableaux (lignes ~701-715 et ~742-756)

#### Tableau Funding

```html
<thead>
    <tr>
        <th class="sortable-header" data-table="funding" data-key="pair">Pair <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="apr">APR <span class="sort-indicator"></span></th>
        <th>Strategy</th>
        <th class="sortable-header" data-table="funding" data-key="exchange:paradex" data-exchange="paradex">Paradex <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:vest" data-exchange="vest">Vest <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:extended" data-exchange="extended">Extended <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:hyperliquid" data-exchange="hyperliquid">Hyperliquid <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:lighter" data-exchange="lighter">Lighter <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:hibachi" data-exchange="hibachi">Hibachi <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:aster" data-exchange="aster">Aster <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:pacifica" data-exchange="pacifica">Pacifica <span class="sort-indicator"></span></th>
        <th class="sortable-header" data-table="funding" data-key="exchange:variational" data-exchange="variational">Variational <span class="sort-indicator"></span></th>
    </tr>
</thead>
```

#### Tableau Price

Même modification avec `data-table="price"` :

```html
<th class="sortable-header" data-table="price" data-key="exchange:paradex" data-exchange="paradex">Paradex <span class="sort-indicator"></span></th>
<!-- etc. pour tous les exchanges -->
```

### 2. Ajouter la fonction `updateExchangeColumnVisibility()`

**Localisation** : Dans `<script>`, après `updatePriceDetails()`

```javascript
// ==================== VISIBILITÉ DES COLONNES ====================
function updateExchangeColumnVisibility() {
    const exchangeIds = [
        "paradex", "vest", "extended", "hyperliquid", "lighter",
        "hibachi", "aster", "pacifica", "variational"
    ];

    // Funding table
    const fundingTable = document.getElementById("funding-table");
    if (fundingTable) {
        const fundingHeaderCells = fundingTable.querySelectorAll("thead th");
        const fundingRows = fundingTable.querySelectorAll("tbody tr");

        exchangeIds.forEach(exId => {
            let colIndex = -1;
            fundingHeaderCells.forEach((th, idx) => {
                if (th.dataset && th.dataset.exchange === exId) {
                    colIndex = idx;
                }
            });

            if (colIndex === -1) return;

            const visible = !!selectedExchanges[exId];

            // Afficher/masquer le header
            fundingHeaderCells[colIndex].style.display = visible ? "" : "none";

            // Afficher/masquer chaque cellule
            fundingRows.forEach(tr => {
                const tdList = tr.querySelectorAll("td");
                if (tdList[colIndex]) {
                    tdList[colIndex].style.display = visible ? "" : "none";
                }
            });
        });
    }

    // Price table - même logique
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
            priceHeaderCells[colIndex].style.display = visible ? "" : "none";

            priceRows.forEach(tr => {
                const tdList = tr.querySelectorAll("td");
                if (tdList[colIndex]) {
                    tdList[colIndex].style.display = visible ? "" : "none";
                }
            });
        });
    }
}
```

### 3. Appeler la fonction après rendu des tableaux

**Dans `renderFundingTable()`**, à la fin (après `fundingTableBody.appendChild(tr);`) :

```javascript
    });  // Fin de data.forEach

    // AJOUTER CETTE LIGNE
    updateExchangeColumnVisibility();
}
```

**Dans `renderPriceTable()`**, même modification à la fin.

### 4. Modifier `initializeSidebar()`

**Localisation** : Fonction `initializeSidebar()` (ligne ~1015)

**Remplacer** :

```javascript
function initializeSidebar() {
    exchangeToggles.forEach(toggle => {
        const exId = toggle.dataset.exchange;
        if (!exId) return;

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

            // MODIFIER CETTE PARTIE
            // Au lieu de refreshAll(), réappliquer le tri
            applyFundingSortAndRender();
            applyPriceSortAndRender();
            // updateExchangeColumnVisibility() sera appelé automatiquement
        });
    });
}
```

## Fonctionnement

1. **État initial** : Tous les exchanges sont actifs (`selectedExchanges[exId] = true`)
2. **Clic sur exchange** :
   - Toggle `selectedExchanges[exId]` (true ↔ false)
   - Toggle classe `.active` sur le bouton sidebar
   - Réapplique le tri actuel
   - `updateExchangeColumnVisibility()` masque/affiche les colonnes
3. **Refresh** : L'état `selectedExchanges` est conservé, les colonnes restent masquées/visibles

## Vérification

- [ ] Clic sur "Paradex" dans sidebar → colonne Paradex disparaît des deux tableaux
- [ ] Re-clic sur "Paradex" → colonne réapparaît
- [ ] Tri fonctionne toujours (colonnes visibles uniquement)
- [ ] Liens d'affiliation fonctionnent toujours
- [ ] Refresh conserve l'état de visibilité
- [ ] Sélection de ligne continue de fonctionner

## Notes importantes

- Les **données** ne changent pas (`currentFundingData` / `currentPriceData`)
- Seule la **visibilité CSS** (`display: none`) est modifiée
- Le tri s'applique toujours sur toutes les données
- Compatible avec skeleton loading, détails, et affiliate links

---

**Référence complète** : [`step8-code.js`](file:///c:/Users/jules/Documents/arbitrage%20v2%20ui%20test/public/step8-code.js)
