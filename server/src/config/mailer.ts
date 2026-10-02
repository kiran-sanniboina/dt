import nodemailer from 'nodemailer';

interface SendCredentialsParams {
  toEmail: string;
  teamLeadName: string;
  teamName: string;
  year: string;
  section: string;
  temporaryPassword: string;
}

interface SendEvaluationParams {
  toEmail: string;
  teamLeadName: string;
  projectName: string;
  totalScore: number;
  criteriaScores: {
    technicalApproach: number;
    uiUxDesign: number;
    designThinking: number;
    functionality: number;
    innovation: number;
    projectQuality: number;
    problemSolving: number;
  };
  feedback: string;
  evaluatorName?: string;
}

export interface EmailDispatchResult {
  sent: boolean;
  mode: 'SMTP_REAL' | 'DEVELOPMENT_SIMULATED' | 'ETHEREAL_TEST';
  message: string;
  previewUrl?: string | null;
  error?: string | null;
}

export interface MailLogEntry {
  to: string;
  subject: string;
  text: string;
  mode: string;
  previewUrl?: string | null;
  error?: string | null;
  date: Date;
}

export const inMemoryMailLog: MailLogEntry[] = [];

export const isSMTPConfigured = (): boolean => {
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;
  return Boolean(user && user.trim() && pass && pass.trim());
};

const getRealTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.SMTP_USER?.trim();
  const pass = process.env.SMTP_PASS?.trim();

  if (user && pass) {
    return nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass },
      tls: {
        rejectUnauthorized: false,
      },
    });
  }

  return null;
};

export const sendCredentialsEmail = async (params: SendCredentialsParams): Promise<EmailDispatchResult> => {
  const { toEmail, teamLeadName, teamName, year, section, temporaryPassword } = params;
  const subject = `🎓 College Project Hub - Team Lead Account Credentials for ${teamName}`;
  const text = `
Dear ${teamLeadName},

You have been designated as the Team Lead for "${teamName}" (${year}, Section: ${section}) on the College Project Hub platform.

Your credentials to access the Project Upload portal:
--------------------------------------------------
Official Email: ${toEmail}
Temporary Password: ${temporaryPassword}
Portal URL: http://localhost:5173/login/team-lead
--------------------------------------------------

Please log in and submit your team's project before the deadline. You can only submit your project ONCE.

Best regards,
Department of Computer Science and Engineering
Rajiv Gandhi University of Knowledge Technologies, Srikakulam
`.trim();

  const realTransporter = getRealTransporter();

  if (realTransporter) {
    try {
      const from = process.env.SMTP_FROM || `"College Project Hub" <${process.env.SMTP_USER}>`;
      const info = await realTransporter.sendMail({
        from,
        to: toEmail,
        subject,
        text,
      });

      inMemoryMailLog.unshift({
        to: toEmail,
        subject,
        text,
        mode: 'SMTP_REAL',
        date: new Date(),
      });

      console.log(`[Mailer] Real email successfully sent to ${toEmail} (MessageId: ${info.messageId})`);
      return {
        sent: true,
        mode: 'SMTP_REAL',
        message: `Real email successfully delivered to ${toEmail} via SMTP.`,
      };
    } catch (err: any) {
      console.error('[Mailer] SMTP delivery error:', err);
      inMemoryMailLog.unshift({
        to: toEmail,
        subject,
        text,
        mode: 'SMTP_REAL_FAILED',
        error: err.message,
        date: new Date(),
      });
      return {
        sent: false,
        mode: 'SMTP_REAL',
        message: `SMTP delivery failed: ${err.message}`,
        error: err.message,
      };
    }
  }

  // Fallback: SMTP credentials missing
  console.log(`\n================== [DEVELOPMENT EMAIL LOG: CREDENTIALS] ==================`);
  console.log(`NOTICE: SMTP_USER and SMTP_PASS are not configured in server/.env`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Password: ${temporaryPassword}`);
  console.log(`=========================================================================\n`);

  inMemoryMailLog.unshift({
    to: toEmail,
    subject,
    text,
    mode: 'DEVELOPMENT_SIMULATED',
    date: new Date(),
  });

  return {
    sent: false,
    mode: 'DEVELOPMENT_SIMULATED',
    message: `SMTP not configured in server/.env. Email was logged locally and in Notification Logs.`,
  };
};

export const sendEvaluationEmail = async (params: SendEvaluationParams): Promise<EmailDispatchResult> => {
  const { toEmail, teamLeadName, projectName, totalScore, criteriaScores, feedback, evaluatorName } = params;
  const subject = `⭐ Project Evaluation Result: ${projectName} - Score: ${totalScore}/100`;
  const text = `
Dear ${teamLeadName},

Your submitted project "${projectName}" has been evaluated by faculty ${evaluatorName ? `(${evaluatorName})` : ''}.

Evaluation Summary:
--------------------------------------------------
Overall Score: ${totalScore} / 100

Detailed Rubric Breakdown:
- Technical Approach:    ${criteriaScores.technicalApproach} / 15
- UI/UX Design:          ${criteriaScores.uiUxDesign} / 15
- Design Thinking:       ${criteriaScores.designThinking} / 10
- Functionality:         ${criteriaScores.functionality} / 20
- Innovation:            ${criteriaScores.innovation} / 15
- Project Quality:       ${criteriaScores.projectQuality} / 10
- Problem Solving:       ${criteriaScores.problemSolving} / 15

Faculty Feedback & Remarks:
"${feedback}"
--------------------------------------------------

Congratulations on your hard work! You can view the project in the university repository.

Best regards,
Department of Computer Science and Engineering
Rajiv Gandhi University of Knowledge Technologies, Srikakulam
`.trim();

  const realTransporter = getRealTransporter();

  if (realTransporter) {
    try {
      const from = process.env.SMTP_FROM || `"College Project Hub" <${process.env.SMTP_USER}>`;
      const info = await realTransporter.sendMail({
        from,
        to: toEmail,
        subject,
        text,
      });

      inMemoryMailLog.unshift({
        to: toEmail,
        subject,
        text,
        mode: 'SMTP_REAL',
        date: new Date(),
      });

      console.log(`[Mailer] Real evaluation email sent to ${toEmail} (MessageId: ${info.messageId})`);
      return {
        sent: true,
        mode: 'SMTP_REAL',
        message: `Evaluation results emailed to ${toEmail} via SMTP.`,
      };
    } catch (err: any) {
      console.error('[Mailer] SMTP delivery error:', err);
      inMemoryMailLog.unshift({
        to: toEmail,
        subject,
        text,
        mode: 'SMTP_REAL_FAILED',
        error: err.message,
        date: new Date(),
      });
      return {
        sent: false,
        mode: 'SMTP_REAL',
        message: `SMTP delivery failed: ${err.message}`,
        error: err.message,
      };
    }
  }

  // Fallback
  console.log(`\n================== [DEVELOPMENT EMAIL LOG: EVALUATION] ==================`);
  console.log(`NOTICE: SMTP_USER and SMTP_PASS are not configured in server/.env`);
  console.log(`To: ${toEmail}`);
  console.log(`Subject: ${subject}`);
  console.log(`Score: ${totalScore}/100`);
  console.log(`Feedback: ${feedback}`);
  console.log(`=========================================================================\n`);

  inMemoryMailLog.unshift({
    to: toEmail,
    subject,
    text,
    mode: 'DEVELOPMENT_SIMULATED',
    date: new Date(),
  });

  return {
    sent: false,
    mode: 'DEVELOPMENT_SIMULATED',
    message: `SMTP not configured in server/.env. Evaluation was logged locally and in Notification Logs.`,
  };
};
