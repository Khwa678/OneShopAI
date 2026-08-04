import React, { useEffect, forwardRef, useImperativeHandle } from 'react';

/**
 * ReCaptcha Component - CAPTCHA challenge disabled as requested.
 */
const ReCaptcha = forwardRef(({ onVerify }, ref) => {
  useImperativeHandle(ref, () => ({
    reset: () => {}
  }));

  useEffect(() => {
    if (onVerify) {
      onVerify('bypassed_captcha_token');
    }
  }, [onVerify]);

  return null;
});

export default ReCaptcha;
