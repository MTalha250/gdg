import nodemailer from "nodemailer";

// Create transporter
const createTransporter = () => {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.SMTP_EMAIL,
      pass: process.env.SMTP_PASS,
    },
  });
};

// Contact form confirmation email
export const sendContactConfirmation = async (userEmail, userName) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: "GDG on Campus ITU",
      address: process.env.SMTP_EMAIL,
    },
    to: userEmail,
    subject: "Thank you for contacting GDG on Campus ITU",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1c4ed8; margin: 0;">GDG on Campus ITU</h1>
          <p style="color: #666; margin: 5px 0;">Google Developer Groups</p>
        </div>
        
        <div style="background: #f8fafc; padding: 30px; border-radius: 10px; border-left: 4px solid #1c4ed8;">
          <h2 style="color: #1e293b; margin-top: 0;">Hi ${userName}! 👋</h2>
          
          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Thank you for reaching out to <strong>GDG on Campus ITU</strong>! We've received your message and our team will get back to you soon.
          </p>
          
          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            In the meantime, feel free to:
          </p>
          
          <ul style="color: #475569; line-height: 1.6;">
            <li>Follow us on our social media channels</li>
            <li>Check out our upcoming events</li>
            <li>Join our community discussions</li>
          </ul>
          
          <div style="margin: 25px 0; padding: 15px; background: #f0fdf4; border-radius: 8px; border-left: 3px solid #16803c;">
            <p style="margin: 0; color: #16803c; font-weight: 500;">
              💡 Pro tip: Stay updated with Google technologies and connect with fellow developers in our community!
            </p>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>GDG on Campus ITU Team</strong>
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Contact confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending contact confirmation email:", error);
    throw error;
  }
};

// Recruitment form confirmation email
export const sendRecruitmentConfirmation = async (
  userEmail,
  userName,
  selectedTeam,
  selectedRole
) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: {
      name: "GDG on Campus ITU",
      address: process.env.SMTP_EMAIL,
    },
    to: userEmail,
    subject: "GDG on Campus ITU - Recruitment Application Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1c4ed8; margin: 0;">GDG on Campus ITU</h1>
          <p style="color: #666; margin: 5px 0;">Google Developer Groups</p>
        </div>
        
        <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; border-left: 4px solid #16803c;">
          <h2 style="color: #1e293b; margin-top: 0;">Application Received! 🎉</h2>
          
          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Hi <strong>${userName}</strong>,
          </p>
          
          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Thank you for applying to join <strong>GDG on Campus ITU</strong>! We've successfully received your application for the <strong>${selectedTeam}</strong> as a <strong>${
      selectedRole[0].toUpperCase() + selectedRole.slice(1)
    }</strong>.
          </p>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">📋 Application Summary:</h3>
            <p style="margin: 8px 0; color: #475569;"><strong>Team:</strong> ${selectedTeam}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Role:</strong> ${
              selectedRole[0].toUpperCase() + selectedRole.slice(1)
            }</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Status:</strong> <span style="color: #eab305; font-weight: 500;">Under Review</span></p>
          </div>
          
          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Our team will carefully review your application and get back to you as soon as possible. 
          </p>
          
          <div style="margin: 25px 0; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 3px solid #eab305;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">
              ⏰ What's next?
            </p>
            <ul style="color: #92400e; margin: 10px 0 0 0; padding-left: 20px;">
              <li>We'll review your application thoroughly</li>
              <li>Shortlisted candidates will be contacted for interviews</li>
              <li>Final results will be communicated via email</li>
            </ul>
          </div>
        </div>
        
        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Best of luck! 🚀<br>
            <strong>GDG on Campus ITU Recruitment Team</strong>
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
            This is an automated confirmation email. Please do not reply to this message.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Recruitment confirmation email sent to ${userEmail}`);
  } catch (error) {
    console.error("Error sending recruitment confirmation email:", error);
    throw error;
  }
};
