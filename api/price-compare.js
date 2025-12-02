/**
 * Vercel Serverless Function
 * Route: /api/price-compare
 * Method: GET
 * Query: ?pair=ETH-PERP
 */

const { getAllPrices } = require("../backend/services/exchangeAggregator");
const { comparePrices, calculateArbitrage } = require("../backend/services/comparator");
const { handleError } = require("../backend/utils/errorHandler");

module.exports = async (req, res) => {
    try {
        // Vérifier la méthode
        if (req.method !== "GET") {
            return res.status(405).json({
                success: false,
                message: "Method not allowed. Use GET."
            });
        }

        // Récupérer la paire dans la query : ?pair=ETH-PERP
        const { pair } = req.query;

        if (!pair) {
            return res.status(400).json({
                success: false,
                message: 'Missing required query parameter: "pair".'
            });
        }

        // 1) Récupérer tous les prix sur tous les exchanges
        const pricesArray = await getAllPrices(pair);

        // 2) Calculer les comparaisons de prix
        const comparison = comparePrices(pricesArray);

        // 3) Calculer les opportunités d'arbitrage (simple pour l'instant)
        const arbitrage = calculateArbitrage(pricesArray);

        // 4) Retourner le résultat
        return res.status(200).json({
            success: true,
            pair,
            timestamp: Date.now(),
            comparison,
            arbitrage,
            raw: pricesArray
        });
    } catch (error) {
        return handleError(res, error);
    }
};
