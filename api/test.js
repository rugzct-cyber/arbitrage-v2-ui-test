/**
 * Vercel Serverless Function
 * Route: /api/test
 * Method: GET
 * Purpose: Test connection to all exchanges
 */

const { testAllExchanges } = require("../backend/services/exchangeAggregator");
const { handleError } = require("../backend/utils/errorHandler");

module.exports = async (req, res) => {
    try {
        // GET obligatoire
        if (req.method !== "GET") {
            return res.status(405).json({
                success: false,
                message: "Method not allowed. Use GET."
            });
        }

        // 1) Lancer les tests de connexion
        const results = await testAllExchanges();

        // 2) Retourner une réponse propre
        return res.status(200).json({
            success: true,
            timestamp: Date.now(),
            exchanges: results
        });
    } catch (error) {
        return handleError(res, error);
    }
};
