/**
 * Hyperliquid exchange service
 */

const { httpGet } = require("../../utils/fetcher");
const { normalizeFunding, normalizePrice } = require("../../utils/normalize");
const { log } = require("../../utils/logger");
const config = require("../../config/exchanges.config").hyperliquid;

/**
 * Test connection to Hyperliquid API
 */
async function testConnection() {
    try {
        await httpGet(config.baseUrl);
        return { success: true };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

/**
 * Get available trading pairs
 */
async function getPairs() {
    throw new Error("Feature not supported");
}

/**
 * Get current price for a pair (temporary simulator)
 */
async function getCurrentPrice(pair) {
    log("Getting current price for", pair, "from Hyperliquid");

    return normalizePrice("hyperliquid", {
        token: pair,
        price: 100, // valeur test
        timestamp: Date.now()
    });
}

/**
 * Get funding rate for a pair (temporary simulator)
 */
async function getFundingRate(pair) {
    log("Getting funding rate for", pair, "from Hyperliquid");

    return normalizeFunding("hyperliquid", {
        token: pair,
        fundingRate: 0.0001,
        timestamp: Date.now()
    });
}

/**
 * Get price history for a pair
 */
async function getPriceHistory(pair, from, to) {
    throw new Error("Feature not supported");
}

/**
 * Get funding history for a pair
 */
async function getFundingHistory(pair, from, to) {
    throw new Error("Feature not supported");
}

module.exports = {
    testConnection,
    getPairs,
    getCurrentPrice,
    getFundingRate,
    getPriceHistory,
    getFundingHistory
};
