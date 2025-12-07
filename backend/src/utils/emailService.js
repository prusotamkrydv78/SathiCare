import nodemailer from 'nodemailer';

// Create transporter
const createTransporter = () => {
    return nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

// Generate 6-digit OTP (default to 111111 for development)
export const generateOTP = () => {
    // For development/testing, always return 111111
    if (process.env.NODE_ENV === 'development') {
        return '111111';
    }
    // For production, generate random OTP
    return Math.floor(100000 + Math.random() * 900000).toString();
};

// Send OTP email
export const sendOTPEmail = async (email, otp, name = 'User') => {
    try {
        // In development mode, skip email sending and just log OTP
        if (process.env.NODE_ENV === 'development') {
            console.log(`\n📧 ========== OTP EMAIL (DEV MODE) ==========`);
            console.log(`📨 To: ${email}`);
            console.log(`👤 Name: ${name}`);
            console.log(`🔑 OTP: ${otp}`);
            console.log(`⏰ Expires in: ${process.env.OTP_EXPIRE_MINUTES || 10} minutes`);
            console.log(`📧 ==========================================\n`);
            return { success: true, messageId: 'dev-mode-skip-email' };
        }

        // Production mode - send actual email
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Saathi - Your OTP Code',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .otp-box { background: white; border: 2px dashed #FF6B9D; padding: 20px; text-align: center; margin: 20px 0; border-radius: 8px; }
                        .otp-code { font-size: 32px; font-weight: bold; color: #FF6B9D; letter-spacing: 5px; }
                        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #666; }
                        .warning { background: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🌸 Saathi</h1>
                            <p>Your Maternal Health Companion</p>
                        </div>
                        <div class="content">
                            <h2>Hello ${name}!</h2>
                            <p>Thank you for choosing Saathi. Your OTP code is:</p>
                            
                            <div class="otp-box">
                                <div class="otp-code">${otp}</div>
                            </div>
                            
                            <p>This code will expire in <strong>${process.env.OTP_EXPIRE_MINUTES || 10} minutes</strong>.</p>
                            
                            <div class="warning">
                                <strong>⚠️ Security Notice:</strong> Never share this OTP with anyone. Saathi will never ask for your OTP via phone or email.
                            </div>
                            
                            <p>If you didn't request this code, please ignore this email.</p>
                        </div>
                        <div class="footer">
                            <p>© 2024 Saathi - Empowering Women's Health in Nepal</p>
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ OTP email sent to ${email}: ${info.messageId}`);
        return { success: true, messageId: info.messageId };
    } catch (error) {
        console.error(`❌ Error sending OTP email: ${error.message}`);
        throw new Error('Failed to send OTP email');
    }
};

// Send welcome email
export const sendWelcomeEmail = async (email, name) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM,
            to: email,
            subject: 'Welcome to Saathi! 🌸',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #FF6B9D 0%, #4ECDC4 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .feature { background: white; padding: 15px; margin: 10px 0; border-left: 4px solid #4ECDC4; border-radius: 5px; }
                        .cta-button { display: inline-block; background: #FF6B9D; color: white; padding: 12px 30px; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>🌸 Welcome to Saathi!</h1>
                        </div>
                        <div class="content">
                            <h2>Namaste ${name}! 🙏</h2>
                            <p>We're thrilled to have you join the Saathi community. Your journey to better reproductive health starts here!</p>
                            
                            <h3>What you can do with Saathi:</h3>
                            
                            <div class="feature">
                                <strong>📅 Period Tracker</strong><br>
                                Track your cycle and get AI-powered predictions
                            </div>
                            
                            <div class="feature">
                                <strong>🤰 Pregnancy Companion</strong><br>
                                Week-by-week guidance throughout your pregnancy
                            </div>
                            
                            <div class="feature">
                                <strong>🤖 AI Health Assistant</strong><br>
                                Get instant answers to your health questions 24/7
                            </div>
                            
                            <div class="feature">
                                <strong>🏥 Find Healthcare</strong><br>
                                Locate nearby hospitals, clinics, and female doctors
                            </div>
                            
                            <div class="feature">
                                <strong>📚 Health Library</strong><br>
                                Access reliable health information in your language
                            </div>
                            
                            <p style="text-align: center;">
                                <a href="${process.env.FRONTEND_URL}" class="cta-button">Get Started</a>
                            </p>
                            
                            <p>Remember, Saathi is here to support you - privately, safely, and without judgment.</p>
                            
                            <p>Stay healthy! 💪</p>
                            <p><strong>The Saathi Team</strong></p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log(`✅ Welcome email sent to ${email}`);
    } catch (error) {
        console.error(`❌ Error sending welcome email: ${error.message}`);
        // Don't throw error for welcome email - it's not critical
    }
};
