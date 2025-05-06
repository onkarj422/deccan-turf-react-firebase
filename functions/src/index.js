require("dotenv").config();
/* eslint-disable camelcase */
const express = require("express");
const cors = require("cors");
const logger = require("firebase-functions/logger");
const fetch = require("node-fetch");
const { fetchPhonePeAuthToken } = require("./auth");
const { createPaymentPayload } = require("./utils");
const { PHONEPE_PAY_URL_PROD, PHONEPE_PAY_URL_UAT, ERROR_TYPE_PAYMENT_API, ERROR_TYPE_INTERNAL } = require("./constants");

const app = express();
app.use(cors({ origin: true }));
app.options("*", cors({ origin: true })); // Explicitly handle preflight requests
app.use(express.json());

// POST /create-payment - Initiates a PhonePe payment
app.post("/create-payment", async (req, res) => {
    // Destructure and set defaults for request body
    const {
        amount,
        merchantOrderId,
        expireAfter = 1200,
        udf1 = "",
        udf2 = "",
        udf3 = "",
        udf4 = "",
        udf5 = "",
        redirectUrl = "",
        env = "UAT",
    } = req.body;

    // Use environment variables or fallback to test credentials
    const clientId = process.env.PHONEPE_CLIENT_ID;
    const clientSecret = process.env.PHONEPE_CLIENT_SECRET;
    const clientVersion = env === "PROD" ? process.env.PHONEPE_CLIENT_VERSION : 1;

    try {
        // 1. Get OAuth token using the separated function
        const access_token = await fetchPhonePeAuthToken({ clientId, clientSecret, clientVersion, env });

        // 2. Create payment
        const payUrl = env === "PROD" ? PHONEPE_PAY_URL_PROD : PHONEPE_PAY_URL_UAT;

        // Use utility function to create payment payload
        const payload = createPaymentPayload({
            merchantOrderId,
            amount,
            expireAfter,
            udf1,
            udf2,
            udf3,
            udf4,
            udf5,
            redirectUrl,
        });

        const payRes = await fetch(payUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `O-Bearer ${access_token}`,
            },
            body: JSON.stringify(payload),
        });
        const payData = await payRes.json();
        if (!payRes.ok) {
            const error = new Error("PhonePe Payment failed");
            error.type = ERROR_TYPE_PAYMENT_API;
            error.status = payRes.status;
            error.details = payData;
            throw error;
        }
        return res.status(200).json(payData);
    } catch (err) {
        // Structured error response
        logger.error("/create-payment error", {
            message: err.message || "Unknown error",
            type: err.type || ERROR_TYPE_INTERNAL,
            status: err.status || 500,
            details: err.details || err,
        });
        return res.status(err.status || 500).json({
            error: {
                message: err.message || "Request failed",
                type: err.type || ERROR_TYPE_INTERNAL,
                details: err.details || err,
            },
        });
    }
});

exports.api = require("firebase-functions/v2/https").onRequest(app);
