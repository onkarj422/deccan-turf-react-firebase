/**
 * Creates the payload object for PhonePe payment API.
 * @param {Object} params
 * @param {string} params.merchantOrderId
 * @param {number} params.amount
 * @param {number} params.expireAfter
 * @param {string} params.udf1
 * @param {string} params.udf2
 * @param {string} params.udf3
 * @param {string} params.udf4
 * @param {string} params.udf5
 * @param {string} params.redirectUrl
 * @return {Object} Payment payload
 */
function createPaymentPayload({ merchantOrderId, amount, expireAfter, udf1, udf2, udf3, udf4, udf5, redirectUrl }) {
    return {
        merchantOrderId,
        amount,
        expireAfter,
        metaInfo: { udf1, udf2, udf3, udf4, udf5 },
        paymentFlow: {
            type: "PG_CHECKOUT",
            message: "Payment for booking",
            merchantUrls: { redirectUrl },
        },
    };
}

module.exports = { createPaymentPayload };
