// PhonePe API URLs
const PHONEPE_AUTH_URL_PROD = "https://api.phonepe.com/apis/identity-manager/v1/oauth/token";
const PHONEPE_AUTH_URL_UAT = "https://api-preprod.phonepe.com/apis/pg-sandbox/v1/oauth/token";
const PHONEPE_PAY_URL_PROD = "https://api.phonepe.com/apis/pg/checkout/v2/pay";
const PHONEPE_PAY_URL_UAT = "https://api-preprod.phonepe.com/apis/pg-sandbox/checkout/v2/pay";

// Error Types
const ERROR_TYPE_PAYMENT_API = "PAYMENT_API_ERROR";
const ERROR_TYPE_INTERNAL = "INTERNAL_ERROR";

module.exports = {
    PHONEPE_AUTH_URL_PROD,
    PHONEPE_AUTH_URL_UAT,
    PHONEPE_PAY_URL_PROD,
    PHONEPE_PAY_URL_UAT,
    ERROR_TYPE_PAYMENT_API,
    ERROR_TYPE_INTERNAL,
};
