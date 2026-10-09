import emailjs from '@emailjs/browser';

export interface SendOtpResult {
  success: boolean;
  message: string;
  otp?: string;
  error?: string;
}

export interface EmailJsConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

export const EMAILJS_STORAGE_KEY = 'bharatkart_emailjs_config_v1';

export const getEmailJsConfig = (): EmailJsConfig => {
  let savedConfig: Partial<EmailJsConfig> = {};
  try {
    const raw = localStorage.getItem(EMAILJS_STORAGE_KEY);
    if (raw) savedConfig = JSON.parse(raw);
  } catch {}

  const serviceId =
    savedConfig.serviceId?.trim() ||
    (import.meta as any).env?.VITE_EMAILJS_SERVICE_ID?.trim() ||
    '';
  const templateId =
    savedConfig.templateId?.trim() ||
    (import.meta as any).env?.VITE_EMAILJS_TEMPLATE_ID?.trim() ||
    '';
  const publicKey =
    savedConfig.publicKey?.trim() ||
    (import.meta as any).env?.VITE_EMAILJS_PUBLIC_KEY?.trim() ||
    '';

  return { serviceId, templateId, publicKey };
};

export const saveEmailJsConfig = (config: Partial<EmailJsConfig>) => {
  try {
    const current = getEmailJsConfig();
    const updated = { ...current, ...config };
    localStorage.setItem(EMAILJS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save EmailJS config:', err);
  }
};

/**
 * Sends a real 6-digit OTP email using EmailJS (@emailjs/browser with REST API fallback)
 */
export const sendOtpEmail = async (
  toEmail: string,
  toName: string,
  otpCode: string
): Promise<SendOtpResult> => {
  const { serviceId, templateId, publicKey } = getEmailJsConfig();

  // If credentials are not configured
  if (!serviceId || !templateId || !publicKey) {
    console.warn(
      'EmailJS credentials unconfigured. Please provide VITE_EMAILJS_SERVICE_ID, VITE_EMAILJS_TEMPLATE_ID, and VITE_EMAILJS_PUBLIC_KEY.'
    );
    return {
      success: false,
      message: 'Failed to send email. Please check your network or try again.',
      error: 'EmailJS credentials unconfigured',
    };
  }

  const templateParams = {
    to_email: toEmail,
    email: toEmail,
    recipient: toEmail,
    to_name: toName || 'Valued Customer',
    user_name: toName || 'Customer',
    otp: otpCode,
    otp_code: otpCode,
    passcode: otpCode,
    subject: 'Your Bharat Kart Password Reset OTP',
    message: `Your 6-digit verification code to reset your Bharat Kart password is: ${otpCode}. This code is valid for 10 minutes. If you did not request this password reset, please ignore this email.`,
    expiry_warning: 'This code will expire in 10 minutes.',
  };

  try {
    // 1. Attempt sending via @emailjs/browser
    const response = await emailjs.send(serviceId, templateId, templateParams, {
      publicKey,
    });

    if (response.status === 200 || response.text === 'OK') {
      return {
        success: true,
        message: 'OTP sent successfully to your registered email address.',
        otp: otpCode,
      };
    }
  } catch (browserError: any) {
    console.warn('emailjs.send failed, attempting direct REST fetch fallback:', browserError);

    // 2. Direct REST fetch API fallback
    try {
      const restResponse = await fetch('https://api.emailjs.com/api/v1.0/email/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          service_id: serviceId,
          template_id: templateId,
          user_id: publicKey,
          template_params: templateParams,
        }),
      });

      if (restResponse.ok) {
        return {
          success: true,
          message: 'OTP sent successfully to your registered email address.',
          otp: otpCode,
        };
      }
    } catch (restError) {
      console.error('EmailJS direct REST call also failed:', restError);
    }
  }

  return {
    success: false,
    message: 'Failed to send email. Please check your network or try again.',
  };
};
