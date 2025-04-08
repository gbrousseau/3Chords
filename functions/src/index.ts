import * as functions from 'firebase-functions';
import * as nodemailer from 'nodemailer';

interface SupportEmailData {
  to: string;
  subject: string;
  body: string;
}

interface SupportEmailResponse {
  success: boolean;
  message?: string;
}

// Configure nodemailer with your email service (e.g., Gmail)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

export const sendSupportEmail = functions.https.onCall(
  async (data: SupportEmailData, context: functions.https.CallableContext): Promise<SupportEmailResponse> => {
    // Ensure the user is authenticated
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated to send support emails');
    }

    try {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.to,
        subject: data.subject,
        text: data.body
      });

      return {
        success: true,
        message: 'Email sent successfully'
      };
    } catch (error) {
      console.error('Error sending email:', error);
      throw new functions.https.HttpsError('internal', 'Failed to send email');
    }
  }
); 