/**
 * Exchange Aggregator Service
 * Coordinates requests across multiple exchanges
 */

const hyperliquid = require("./exchanges/hyperliquid");
const vest = require("./exchanges/vest");
const extended = require("./exchanges/extended");
const lighter = require("./exchanges/lighter");
const paradex = require("./exchanges/paradex");
const pacifica = require("./exchanges/pacifica");
const hibachi = require("./exchanges/hibachi");
const variational = require("./exchanges/variational");
const aster = require("./exchanges/aster");

const exchanges = {
    hyperliquid,
    vest,
    extended,
    lighter,
    paradex,
    pacifica,
    hibachi,
    variational,
    aster
};

/**
 * Test connection to all exchanges
 */
async function testAllExchanges() {
    const exchangeNames = Object.keys(exchanges);

    const results = await Promise.allSettled(
        exchangeNames.map(name => exchanges[name].testConnection())
    );

    return results.map((result, index) => {
        const exchange = exchangeNames[index];

        if (result.status === "fulfilled") {
            return {
                exchange,
                success: result.value.success,
                error: result.value.error || null
            };
        } else {
            return {
                exchange,
                success: false,
                error: result.reason.message
            };
        }
    });
}

/**
 * Get current prices from all exchanges for a pair
 */
async function getAllPrices(pair) {
    const exchangeNames = Object.keys(exchanges);

    const results = await Promise.allSettled(
        exchangeNames.map(name => exchanges[name].getCurrentPrice(pair))
    );

    return results.map((result, index) => {
        const exchange = exchangeNames[index];

        if (result.status === "fulfilled") {
            return {
                exchange,
                success: true,
                data: result.value,
                error: null
            };
        } else {
            return {
                exchange,
                success: false,
                data: null,
                error: result.reason.message
            };
        }
    });
}

/**
 * Get funding rates from all exchanges for a pair
 */
async function getAllFunding(pair) {
    const exchangeNames = Object.keys(exchanges);

    const results = await Promise.allSettled(
        exchangeNames.map(name => exchanges[name].getFundingRate(pair))
    );

    return results.map((result, index) => {
        const exchange = exchangeNames[index];

        if (result.status === "fulfilled") {
            return {
                exchange,
                success: true,
                data: result.value,
                error: null
            };
        } else {
            return {
                exchange,
                success: false,
                data: null,
                error: result.reason.message
            };
        }
    });
}

/**
 * Get price history for a pair from one or all exchanges
 */
async function getPriceHistory(pair, from, to, exchange = null) {
    if (exchange) {
        // Single exchange
        const service = exchanges[exchange];
        if (!service) {
            throw new Error(`Exchange ${exchange} not found`);
        }

        const result = await service.getPriceHistory(pair, from, to);
        return [{
            exchange,
            success: true,
            data: result,
            error: null
        }];
    }

    // All exchanges
    const exchangeNames = Object.keys(exchanges);

    const results = await Promise.allSettled(
        exchangeNames.map(name => exchanges[name].getPriceHistory(pair, from, to))
    );

    return results.map((result, index) => {
        const exchange = exchangeNames[index];

        if (result.status === "fulfilled") {
            return {
                exchange,
                success: true,
                data: result.value,
                error: null
            };
        } else {
            return {
                exchange,
                success: false,
                data: null,
                error: result.reason.message
            };
        }
    });
}

/**
 * Get funding history for a pair from one or all exchanges
 */
async function getFundingHistory(pair, from, to, exchange = null) {
    if (exchange) {
        // Single exchange
        const service = exchanges[exchange];
        if (!service) {
            throw new Error(`Exchange ${exchange} not found`);
        }

        const result = await service.getFundingHistory(pair, from, to);
        return [{
            exchange,
            success: true,
            data: result,
            error: null
        }];
    }

    // All exchanges
    const exchangeNames = Object.keys(exchanges);

    const results = await Promise.allSettled(
        exchangeNames.map(name => exchanges[name].getFundingHistory(pair, from, to))
    );

    return results.map((result, index) => {
        const exchange = exchangeNames[index];

        if (result.status === "fulfilled") {
            return {
                exchange,
                success: true,
                data: result.value,
                error: null
            };
        } else {
            return {
                exchange,
                success: false,
                data: null,
                error: result.reason.message
            };
        }
    });
}

module.exports = {
    testAllExchanges,
    getAllPrices,
    getAllFunding,
    getPriceHistory,
    getFundingHistory
};
