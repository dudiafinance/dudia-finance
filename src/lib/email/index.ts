import sgMail from "@sendgrid/mail";

// Configurar SendGrid
sgMail.setApiKey(process.env.SENDGRID_API_KEY || "");

interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
}

async function sendEmail({ to, subject, html }: SendEmailParams) {
  try {
    const fromEmail = process.env.SENDGRID_FROM_EMAIL || "noreply@dudiafinance.vercel.app";

    await sgMail.send({
      to,
      from: fromEmail,
      subject,
      html,
    });

    return { success: true };
  } catch (error) {
    console.error("Error sending email:", error);
    return { success: false, error };
  }
}

export async function sendWelcomeEmail(email: string, name: string) {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">Bem-vindo ao DUD.IA Finance!</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">
          Olá <strong>${name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #666; line-height: 1.6;">
          Parabéns por criar sua conta! Agora você pode começar a gerenciar suas finanças de forma inteligente.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="https://dudiafinance.vercel.app/dashboard" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Acessar Dashboard
          </a>
        </div>
        
        <h2 style="color: #333; font-size: 18px; margin-top: 30px;">O que você pode fazer:</h2>
        
        <ul style="color: #666; line-height: 1.8;">
          <li>📊 Controlar seus gastos e receitas</li>
          <li>🏷️ Criar categorias personalizadas</li>
          <li>💰 Definir orçamentos mensais</li>
          <li>🤖 Usar IA para análises financeiras</li>
        </ul>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
          <p style="color: #999; font-size: 14px;">
            Precisa de ajuda? Responda este email ou acesse nosso suporte.
          </p>
        </div>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Bem-vindo ao DUD.IA Finance! 💰",
    html,
  });
}

export async function sendVerificationEmail(email: string, name: string, verificationToken: string) {
  const verifyUrl = `${process.env.NEXTAUTH_URL}/verify-email?token=${verificationToken}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center;">
        <h1 style="color: white; margin: 0;">Verifique seu Email</h1>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9; border-radius: 0 0 10px 10px;">
        <p style="font-size: 16px; color: #333;">
          Olá <strong>${name}</strong>,
        </p>
        
        <p style="font-size: 16px; color: #666; line-height: 1.6;">
          Por favor, clique no botão abaixo para verificar seu endereço de email.
        </p>
        
        <div style="margin: 30px 0; text-align: center;">
          <a href="${verifyUrl}" 
             style="background: #667eea; color: white; padding: 15px 30px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
            Verificar Email
          </a>
        </div>
        
        <p style="color: #999; font-size: 14px;">
          Este link expira em 24 horas.
        </p>
      </div>
    </div>
  `;

  return sendEmail({
    to: email,
    subject: "Verifique seu email - DUD.IA Finance",
    html,
  });
}