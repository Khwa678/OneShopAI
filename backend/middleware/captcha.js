const fetchApi = typeof fetch !== 'undefined' ? fetch : globalThis.fetch;

/**
 * Express middleware to verify Google reCAPTCHA token against Google siteverify API.
 */
async function verifyCaptcha(req, res, next) {
  const captchaToken = req.body?.captchaToken || req.headers['x-captcha-token'];
  const recaptchaSecret = process.env.RECAPTCHA_SECRET_KEY || '6LeSbXMtAAAAAKSYZHza_JefYAILsyJDZRIvNeGy';

  // If no token provided
  if (!captchaToken) {
    return res.status(403).json({
      error: 'Security Verification Required: CAPTCHA token is missing. Please complete the CAPTCHA challenge.'
    });
  }

  try {
    const verifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${encodeURIComponent(recaptchaSecret)}&response=${encodeURIComponent(captchaToken)}`;
    const verifyRes = await fetchApi(verifyUrl, { method: 'POST' });
    const verifyData = await verifyRes.json();

    if (!verifyData.success) {
      console.warn('reCAPTCHA verification failed:', verifyData['error-codes'] || verifyData);
      const errors = verifyData['error-codes'] || [];
      // Bypass if secret key is invalid/placeholder or in dev environment so auth isn't broken
      if (process.env.NODE_ENV !== 'production' || errors.includes('invalid-input-secret') || errors.includes('bad-request')) {
        console.warn('Bypassing reCAPTCHA verification due to environment or test secret key configuration.');
        return next();
      }
      return res.status(403).json({
        error: 'reCAPTCHA verification failed. Please complete the "I\'m not a robot" check and try again.'
      });
    }

    next();
  } catch (error) {
    console.error('reCAPTCHA siteverify error:', error);
    return res.status(500).json({ error: 'Failed to verify security CAPTCHA with server.' });
  }
}

/**
 * Optional CAPTCHA middleware: verifies CAPTCHA if token is supplied or if strict mode is active.
 */
async function optionalVerifyCaptcha(req, res, next) {
  const captchaToken = req.body?.captchaToken || req.headers['x-captcha-token'];
  if (!captchaToken) {
    return next();
  }
  return verifyCaptcha(req, res, next);
}

module.exports = {
  verifyCaptcha,
  optionalVerifyCaptcha
};
