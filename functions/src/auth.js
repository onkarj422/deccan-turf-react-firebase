/* eslint-disable camelcase */
const fetch = require("node-fetch");
const { PHONEPE_AUTH_URL_PROD, PHONEPE_AUTH_URL_UAT, ERROR_TYPE_INTERNAL } = require("./constants");

/**
 * Fetches PhonePe OAuth token.
 * @param {Object} options
 * @param {string} clientId
 * @param {string} clientSecret
 * @param {string|number} clientVersion
 * @param {string} env - 'PROD' or 'UAT'
 * @return {Promise<string>} access_token
 * @throws {Error} if auth fails
 */
async function fetchPhonePeAuthToken({ clientId, clientSecret, clientVersion, env }) {
    const authUrl = env === "PROD" ? PHONEPE_AUTH_URL_PROD : PHONEPE_AUTH_URL_UAT;
    const params = new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        client_version: env === "UAT" ? "1" : clientVersion || "",
        grant_type: "client_credentials",
    });
    const authRes = await fetch(authUrl, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: params.toString(),
    });
    if (!authRes.ok) {
        const text = await authRes.text();
        const error = new Error("PhonePe Auth failed");
        error.type = ERROR_TYPE_INTERNAL;
        error.status = authRes.status;
        error.details = text;
        throw error;
    }
    const { access_token } = await authRes.json();
    return access_token;
}

module.exports = { fetchPhonePeAuthToken };
