/**
 * Vercel Serverless Function
 * Route: /api/funding-compare
 * Method: GET
 * Query: ?pair=ETH-PERP
 */

const { getAllFunding } = require("../backend/services/exchangeAggregator");
const { compareFunding } = require("../backend/services/comparator");
const { handleError } = require("../backend/utils/errorHandler");

module.exports = async (req, res) => {
    try {
        // Refuser toutes les méthodes sauf GET
        if (req.method !== "GET") {
            return res.status(405).json({
                success: false,
                message: "Method not allowed. Use GET."
            });
        }

        // Lire ?pair=ETH-PERP
        const { pair } = req.query;

        if (!pair) {
            return res.status(400).json({
                success: false,
                message: 'Missing required query parameter: "pair".'
            });
        }

        // 1) Récupérer les funding rates
        const fundingArray = await getAllFunding(pair);

        // 2) Comparer funding (highest, lowest, apr, etc.)
        const comparison = compareFunding(fundingArray);

        // 3) Réponse JSON
        return res.status(200).json({
            success: true,
            pair,
            timestamp: Date.now(),
            comparison,
            raw: fundingArray
        });
    } catch (error) {
        return handleError(res, error);
    }
};
