import nodemailer from "nodemailer";

// Initialize transporter with Gmail App Password (more stable than OAuth2)
let transporter = null;

function initializeTransporter() {
    if (transporter) return transporter; // Return if already initialized
    
    console.log("📧 Initializing Email Transporter...");
    console.log("   GOOGLE_USER:", process.env.GOOGLE_USER);
    console.log("   GMAIL_APP_PASSWORD exists:", !!process.env.GMAIL_APP_PASSWORD);
    
    transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.GOOGLE_USER,
            pass: process.env.GMAIL_APP_PASSWORD  // Use App Password, not OAuth2
        }
    });

    // Verify transporter connection (non-blocking)
    transporter.verify((error, success) => {
        if (error) {
            console.warn("⚠️  Email transporter verification failed:", error.message);
            console.warn("Emails may fail to send. Check GOOGLE_USER and GMAIL_APP_PASSWORD in .env");
        } else if (success) {
            console.log("✅ Email transporter is ready to send emails");
        }
    });

    return transporter;
}


export async function sendEmail({ to, subject, html, text }) {
    try {
        console.log("📤 Sending email...");
        console.log("   To:", to);
        console.log("   Subject:", subject);
        
        const transport = initializeTransporter(); // Initialize on first use

        const mailOptions = {
            from: process.env.GOOGLE_USER,
            to,
            subject,
            html,
            text
        };

        const details = await transport.sendMail(mailOptions);
        console.log("✅ Email sent successfully!");
        console.log("   Message ID:", details.messageId);
        console.log("   Response:", details.response);
        
        return details;
    } catch (error) {
        console.error("❌ Email sending failed!");
        console.error("   Error message:", error.message);
        console.error("   Error code:", error.code);
        console.error("   Full error:", error);
        
        throw error; // Re-throw so caller knows it failed
    }
}