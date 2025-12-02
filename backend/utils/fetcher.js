/**
 * HTTP GET utility using native fetch (Node 18+)
 */
async function httpGet(url, options = {}) {
    const res = await fetch(url, { method: "GET", ...options });

    if (res.status >= 400) {
        const error = new Error("HTTP error");
        error.statusCode = res.status;
        throw error;
    }

    return await res.json();
}

module.exports = { httpGet };
