/**
 * Express middleware for CAPTCHA verification - Disabled / Bypassed as requested.
 */
async function verifyCaptcha(req, res, next) {
  return next();
}

async function optionalVerifyCaptcha(req, res, next) {
  return next();
}

module.exports = {
  verifyCaptcha,
  optionalVerifyCaptcha
};
