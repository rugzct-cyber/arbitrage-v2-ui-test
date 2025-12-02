/**
 * Simple logging utility
 */
function log(...args) {
    console.log("[LOG]", new Date().toISOString(), ...args);
}

module.exports = { log };
