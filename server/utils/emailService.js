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

// Brain Games registration confirmation email
export const sendBrainGamesConfirmation = async (registration) => {
  const transporter = createTransporter();

  const teamLead = registration.members.find((m) => m.isTeamLead);
  const membersList = registration.members
    .map(
      (member, index) =>
        `<li>${member.name} ${member.isTeamLead ? "(Team Lead)" : ""}</li>`
    )
    .join("");

  const mailOptions = {
    from: {
      name: "GDG on Campus ITU",
      address: process.env.SMTP_EMAIL,
    },
    to: teamLead.email,
    subject: "Brain Games 2025 - Registration Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1c4ed8; margin: 0;">GDG on Campus ITU</h1>
          <p style="color: #666; margin: 5px 0;">Brain Games 2025</p>
        </div>

        <div style="background: #f0fdf4; padding: 30px; border-radius: 10px; border-left: 4px solid #16803c;">
          <h2 style="color: #1e293b; margin-top: 0;">Registration Received! 🎮</h2>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Hi <strong>${teamLead.name}</strong>,
          </p>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Thank you for registering your team <strong>"${registration.teamName}"</strong> for Brain Games 2025! We've successfully received your registration.
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">📋 Registration Summary:</h3>
            <p style="margin: 8px 0; color: #475569;"><strong>Team Name:</strong> ${registration.teamName}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Team Members:</strong> ${registration.members.length}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Registration Fee:</strong> Rs 900</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Status:</strong> <span style="color: #eab305; font-weight: 500;">Verification Pending</span></p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">👥 Team Members:</h3>
            <ol style="color: #475569; margin: 0; padding-left: 20px;">
              ${membersList}
            </ol>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">💳 Payment Details:</h3>
            <p style="margin: 8px 0; color: #475569;"><strong>Account Name:</strong> MUHAMMAD FASIH UDDIN</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Account Number:</strong> 02860110211843</p>
            <p style="margin: 8px 0; color: #475569;"><strong>IBAN:</strong> PK39MEZN0002860110211843</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Bank:</strong> MEEZAN BANK</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Amount:</strong> Rs 900</p>
          </div>

          <div style="margin: 25px 0; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 3px solid #eab305;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">
              ⏰ What's next?
            </p>
            <ul style="color: #92400e; margin: 10px 0 0 0; padding-left: 20px;">
              <li>Our team will verify your payment proof</li>
              <li>You'll receive a confirmation email once verified</li>
              <li>Further event details will be shared via email</li>
            </ul>
          </div>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            If you have any questions, feel free to reach out to us.
          </p>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            See you at Brain Games! 🚀<br>
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
    console.log(`Brain Games confirmation email sent to ${teamLead.email}`);
  } catch (error) {
    console.error("Error sending Brain Games confirmation email:", error);
    throw error;
  }
};

// Brain Games admin notification email
export const sendBrainGamesAdminNotification = async (registration) => {
  const transporter = createTransporter();

  const teamLead = registration.members.find((m) => m.isTeamLead);
  const membersList = registration.members
    .map(
      (member, index) =>
        `<li>${member.name} ${member.email ? `(${member.email})` : ""} ${
          member.isTeamLead ? "- <strong>Team Lead</strong>" : ""
        }</li>`
    )
    .join("");

  const registrationDate = new Date(registration.createdAt).toLocaleString(
    "en-US",
    {
      dateStyle: "full",
      timeStyle: "short",
      timeZone: "Asia/Karachi",
    }
  );

  const mailOptions = {
    from: {
      name: "GDG on Campus ITU",
      address: process.env.SMTP_EMAIL,
    },
    to: "googledevelopergroup@itu.edu.pk",
    subject: `New Brain Games 2025 Registration - ${registration.teamName}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1c4ed8; margin: 0;">GDG on Campus ITU</h1>
          <p style="color: #666; margin: 5px 0;">Brain Games 2025 - Admin Notification</p>
        </div>

        <div style="background: #dbeafe; padding: 30px; border-radius: 10px; border-left: 4px solid #1c4ed8;">
          <h2 style="color: #1e293b; margin-top: 0;">New Team Registration! 🎮</h2>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            A new team has registered for Brain Games 2025. Please review the details below:
          </p>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">📋 Registration Details:</h3>
            <p style="margin: 8px 0; color: #475569;"><strong>Team Name:</strong> ${registration.teamName}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Team Lead:</strong> ${teamLead.name}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Team Lead Email:</strong> ${teamLead.email}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Team Lead Roll Number:</strong> ${teamLead.rollNumber}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Number of Members:</strong> ${registration.members.length}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Registration Time:</strong> ${registrationDate}</p>
            <p style="margin: 8px 0; color: #475569;"><strong>Status:</strong> <span style="color: #eab305; font-weight: 500;">Pending Verification</span></p>
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #e5e7eb;">
            <h3 style="color: #1e293b; margin-top: 0; margin-bottom: 15px;">👥 Team Members:</h3>
            <ol style="color: #475569; margin: 0; padding-left: 20px;">
              ${membersList}
            </ol>
          </div>

          <div style="margin: 25px 0; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 3px solid #eab305;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">
              ⏰ Action Required:
            </p>
            <ul style="color: #92400e; margin: 10px 0 0 0; padding-left: 20px;">
              <li>Review the payment proof in the admin panel</li>
              <li>Verify team member details</li>
              <li>Update registration status (Accept/Reject)</li>
            </ul>
          </div>

          <div style="text-align: center; margin-top: 25px;">
            <a href="${process.env.ADMIN_URL || "http://localhost:3001"}/brain-games"
               style="display: inline-block; background: #1c4ed8; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; font-weight: 500;">
              View in Admin Panel
            </a>
          </div>
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            <strong>GDG on Campus ITU - Admin Notification System</strong>
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
            This is an automated admin notification email.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(
      `Brain Games admin notification sent to googledevelopergroup@itu.edu.pk`
    );
  } catch (error) {
    console.error("Error sending Brain Games admin notification:", error);
    throw error;
  }
};

// ─── Coderush Emails ──────────────────────────────────────────────────────────

const COMPETITION_LABELS = {
  "competitive-programming": "Competitive Programming",
  "web-development": "Web Development",
  "app-development": "App Development",
  "ui-ux": "UI/UX Design",
  robotics: "Robotics",
  "game-jam": "Game Jam",
  "machine-learning": "Machine Learning",
};

// Coderush registration confirmation email (to team lead)
export const sendCoderushConfirmation = async (registration) => {
  const transporter = createTransporter();
  const teamLead = registration.members.find((m) => m.isTeamLead);
  const competitionLabel = COMPETITION_LABELS[registration.competition] || registration.competition;
  const membersList = registration.members
    .map((m) => `<li>${m.name}${m.isTeamLead ? " <strong>(Team Lead)</strong>" : ""}</li>`)
    .join("");

  const voucherRow =
    registration.voucherCode
      ? `<p style="margin:8px 0;color:#475569;"><strong>Voucher Applied:</strong> ${registration.voucherCode} (PKR ${registration.originalFee - registration.discountedFee} off)</p>`
      : "";

  const mailOptions = {
    from: { name: "GDG on Campus ITU — Coderush", address: process.env.SMTP_EMAIL },
    to: teamLead.email,
    subject: `Coderush 2026 — ${competitionLabel} Registration Received`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1c4ed8;margin:0;">GDG on Campus ITU</h1>
          <p style="color:#666;margin:5px 0;">Coderush 2026</p>
        </div>
        <div style="background:#f0fdf4;padding:30px;border-radius:10px;border-left:4px solid #16803c;">
          <h2 style="color:#1e293b;margin-top:0;">Registration Received! 🚀</h2>
          <p style="color:#475569;line-height:1.6;">Hi <strong>${teamLead.name}</strong>,</p>
          <p style="color:#475569;line-height:1.6;">
            Your team <strong>"${registration.teamName}"</strong> has been successfully registered for <strong>${competitionLabel}</strong> at Coderush 2026!
          </p>
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #e5e7eb;">
            <h3 style="color:#1e293b;margin-top:0;">📋 Registration Summary</h3>
            <p style="margin:8px 0;color:#475569;"><strong>Team Name:</strong> ${registration.teamName}</p>
            <p style="margin:8px 0;color:#475569;"><strong>Competition:</strong> ${competitionLabel}</p>
            <p style="margin:8px 0;color:#475569;"><strong>Members:</strong> ${registration.members.length}</p>
            <p style="margin:8px 0;color:#475569;"><strong>Registration Fee:</strong> PKR ${registration.discountedFee}</p>
            ${voucherRow}
            <p style="margin:8px 0;color:#475569;"><strong>Status:</strong> <span style="color:#eab305;font-weight:500;">Verification Pending</span></p>
          </div>
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #e5e7eb;">
            <h3 style="color:#1e293b;margin-top:0;">👥 Team Members</h3>
            <ol style="color:#475569;margin:0;padding-left:20px;">${membersList}</ol>
          </div>
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #e5e7eb;">
            <h3 style="color:#1e293b;margin-top:0;">💳 Payment Details</h3>
            <p style="margin:8px 0;color:#475569;"><strong>Account Name:</strong> MUHAMMAD FASIH UDDIN</p>
            <p style="margin:8px 0;color:#475569;"><strong>Account Number:</strong> 02860110211843</p>
            <p style="margin:8px 0;color:#475569;"><strong>IBAN:</strong> PK39MEZN0002860110211843</p>
            <p style="margin:8px 0;color:#475569;"><strong>Bank:</strong> MEEZAN BANK</p>
            <p style="margin:8px 0;color:#475569;"><strong>Amount:</strong> PKR ${registration.discountedFee}</p>
          </div>
          <div style="margin:25px 0;padding:15px;background:#fef3c7;border-radius:8px;border-left:3px solid #eab305;">
            <p style="margin:0;color:#92400e;font-weight:500;">⏰ What's next?</p>
            <ul style="color:#92400e;margin:10px 0 0 0;padding-left:20px;">
              <li>Our team will verify your payment proof</li>
              <li>You'll receive a confirmation email once verified</li>
              <li>Further event details will be shared via email</li>
            </ul>
          </div>
        </div>
        <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e2e8f0;">
          <p style="color:#64748b;font-size:14px;margin:0;">See you at Coderush 2026! 🎯<br><strong>GDG on Campus ITU Team</strong></p>
          <p style="color:#94a3b8;font-size:12px;margin:10px 0 0 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Coderush confirmation sent to ${teamLead.email}`);
};

// Coderush admin notification
export const sendCoderushAdminNotification = async (registration) => {
  const transporter = createTransporter();
  const teamLead = registration.members.find((m) => m.isTeamLead);
  const competitionLabel = COMPETITION_LABELS[registration.competition] || registration.competition;
  const membersList = registration.members
    .map((m) => `<li>${m.name}${m.email ? ` (${m.email})` : ""}${m.isTeamLead ? " — <strong>Team Lead</strong>" : ""}</li>`)
    .join("");

  const mailOptions = {
    from: { name: "GDG on Campus ITU", address: process.env.SMTP_EMAIL },
    to: "googledevelopergroup@itu.edu.pk",
    subject: `New Coderush Registration — ${registration.teamName} (${competitionLabel})`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1c4ed8;margin:0;">GDG on Campus ITU</h1>
          <p style="color:#666;margin:5px 0;">Coderush 2026 — Admin Notification</p>
        </div>
        <div style="background:#dbeafe;padding:30px;border-radius:10px;border-left:4px solid #1c4ed8;">
          <h2 style="color:#1e293b;margin-top:0;">New Registration! 🚀</h2>
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #e5e7eb;">
            <h3 style="color:#1e293b;margin-top:0;">📋 Details</h3>
            <p style="margin:8px 0;color:#475569;"><strong>Team:</strong> ${registration.teamName}</p>
            <p style="margin:8px 0;color:#475569;"><strong>Competition:</strong> ${competitionLabel}</p>
            <p style="margin:8px 0;color:#475569;"><strong>Team Lead:</strong> ${teamLead.name} (${teamLead.email})</p>
            <p style="margin:8px 0;color:#475569;"><strong>Members:</strong> ${registration.members.length}</p>
            <p style="margin:8px 0;color:#475569;"><strong>Fee:</strong> PKR ${registration.discountedFee}${registration.voucherCode ? ` (Voucher: ${registration.voucherCode})` : ""}</p>
          </div>
          <div style="background:white;padding:20px;border-radius:8px;margin:20px 0;border:1px solid #e5e7eb;">
            <h3 style="color:#1e293b;margin-top:0;">👥 Members</h3>
            <ol style="color:#475569;margin:0;padding-left:20px;">${membersList}</ol>
          </div>
        </div>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
};

// Coderush status update email
export const sendCoderushStatusUpdate = async (registration) => {
  const transporter = createTransporter();
  const teamLead = registration.members.find((m) => m.isTeamLead);
  const competitionLabel = COMPETITION_LABELS[registration.competition] || registration.competition;
  const isAccepted = registration.status === "accepted";
  const statusColor = isAccepted ? "#16803c" : "#dc2626";
  const statusBgColor = isAccepted ? "#f0fdf4" : "#fef2f2";
  const statusText = isAccepted ? "Registration Confirmed ✅" : "Registration Update ❌";

  const mailOptions = {
    from: { name: "GDG on Campus ITU — Coderush", address: process.env.SMTP_EMAIL },
    to: teamLead.email,
    subject: `Coderush 2026 — ${isAccepted ? "Registration Confirmed" : "Registration Update"}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:0 auto;padding:20px;">
        <div style="text-align:center;margin-bottom:30px;">
          <h1 style="color:#1c4ed8;margin:0;">GDG on Campus ITU</h1>
          <p style="color:#666;margin:5px 0;">Coderush 2026</p>
        </div>
        <div style="background:${statusBgColor};padding:30px;border-radius:10px;border-left:4px solid ${statusColor};">
          <h2 style="color:#1e293b;margin-top:0;">${statusText}</h2>
          <p style="color:#475569;line-height:1.6;">Hi <strong>${teamLead.name}</strong>,</p>
          ${isAccepted ? `
          <p style="color:#475569;line-height:1.6;">
            Congratulations! 🎉 Your team <strong>"${registration.teamName}"</strong> has been confirmed for <strong>${competitionLabel}</strong> at Coderush 2026!
          </p>
          <div style="margin:20px 0;padding:15px;background:#f0fdf4;border-radius:8px;border-left:3px solid #16803c;">
            <p style="margin:0;color:#16803c;font-weight:600;">📅 Event Dates: May 8–10, 2026 | ITU Campus</p>
          </div>
          <p style="color:#475569;line-height:1.6;">Further details about venue, timing, and competition format will be shared soon. Stay tuned!</p>
          ` : `
          <p style="color:#475569;line-height:1.6;">
            We regret to inform you that your registration for team <strong>"${registration.teamName}"</strong> (${competitionLabel}) has not been approved at this time.
          </p>
          <p style="color:#475569;line-height:1.6;">
            If you believe this is an error or have questions, please contact us directly.
          </p>
          `}
        </div>
        <div style="text-align:center;margin-top:30px;padding-top:20px;border-top:1px solid #e2e8f0;">
          <p style="color:#64748b;font-size:14px;margin:0;">Best regards,<br><strong>GDG on Campus ITU Team</strong></p>
          <p style="color:#94a3b8;font-size:12px;margin:10px 0 0 0;">This is an automated email. Please do not reply.</p>
        </div>
      </div>`,
  };

  await transporter.sendMail(mailOptions);
  console.log(`Coderush status update sent to ${teamLead.email}`);
};

// ─── Brain Games status update email ─────────────────────────────────────────

// Brain Games status update email
export const sendBrainGamesStatusUpdate = async (registration) => {
  const transporter = createTransporter();

  const teamLead = registration.members.find((m) => m.isTeamLead);
  const isAccepted = registration.status === "accepted";

  const statusColor = isAccepted ? "#16803c" : "#dc2626";
  const statusBgColor = isAccepted ? "#f0fdf4" : "#fef2f2";
  const statusText = isAccepted
    ? "Registration Confirmed ✅"
    : "Registration Not Approved ❌";

  const mailOptions = {
    from: {
      name: "GDG on Campus ITU",
      address: process.env.SMTP_EMAIL,
    },
    to: teamLead.email,
    subject: `Brain Games 2025 - ${
      isAccepted ? "Registration Confirmed" : "Registration Update"
    }`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1c4ed8; margin: 0;">GDG on Campus ITU</h1>
          <p style="color: #666; margin: 5px 0;">Brain Games 2025</p>
        </div>

        <div style="background: ${statusBgColor}; padding: 30px; border-radius: 10px; border-left: 4px solid ${statusColor};">
          <h2 style="color: #1e293b; margin-top: 0;">${statusText}</h2>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Hi <strong>${teamLead.name}</strong>,
          </p>

          ${
            isAccepted
              ? `
          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Congratulations! 🎉 Your team <strong>"${registration.teamName}"</strong> has been successfully registered for Brain Games 2025!
          </p>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Your payment has been verified and your registration is now confirmed. Get ready for an exciting competition!
          </p>

          <div style="margin: 25px 0; padding: 20px; background: #f0fdf4; border-radius: 8px; border-left: 3px solid #16803c;">
            <p style="margin: 0 0 10px 0; color: #16803c; font-weight: 600; font-size: 16px;">
              📅 Event Details:
            </p>
            <p style="margin: 5px 0; color: #166534;"><strong>Date:</strong> Sunday, 23rd November 2025</p>
            <p style="margin: 5px 0; color: #166534;"><strong>Reporting Time:</strong> 9:30 AM</p>
            <p style="margin: 5px 0; color: #166534;"><strong>Venue:</strong> ASTP, ITU</p>
          </div>

          <div style="margin: 25px 0; padding: 15px; background: #dbeafe; border-radius: 8px; border-left: 3px solid #1c4ed8;">
            <p style="margin: 0; color: #1e40af; font-weight: 500;">
              📋 Important - Action Required:
            </p>
            <ul style="color: #1e40af; margin: 10px 0 0 0; padding-left: 20px;">
              <li><strong>Join the WhatsApp group:</strong> <a href="https://chat.whatsapp.com/Dy7JKr7dXhn2KOkZgv95Cf?mode=hqrt3" style="color: #1c4ed8;">Click here to join</a></li>
              <li><strong>Download EZBuzzer app (Team Lead only):</strong>
                <ul style="margin-top: 5px;">
                  <li>iPhone: <a href="https://apps.apple.com/app/id1635404640" style="color: #1c4ed8;">Download from App Store</a></li>
                  <li>Android: <a href="https://play.google.com/store/apps/details?id=com.braultomatic.ezbuzzer" style="color: #1c4ed8;">Download from Play Store</a></li>
                </ul>
              </li>
              <li>Keep an eye on your email for event updates</li>
              <li>Prepare your team for the competition</li>
            </ul>
          </div>

          <div style="margin: 25px 0; padding: 15px; background: #fef3c7; border-radius: 8px; border-left: 3px solid #eab305;">
            <p style="margin: 0; color: #92400e; font-weight: 500;">
              ⚠️ Important Note:
            </p>
            <p style="color: #92400e; margin: 10px 0 0 0;">
              The <strong>team lead must download the EZBuzzer app</strong> before coming to the event. This app will be used during the buzzer rounds of the competition.
            </p>
          </div>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            We're excited to see you and your team compete! Best of luck! 🚀
          </p>
          `
              : `
          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            We regret to inform you that your registration for team <strong>"${registration.teamName}"</strong> has not been approved at this time.
          </p>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            If you believe this is an error or have questions about your registration status, please contact us directly.
          </p>

          <p style="color: #475569; line-height: 1.6; margin: 15px 0;">
            Thank you for your interest in Brain Games 2025. We hope to see you at future events!
          </p>
          `
          }
        </div>

        <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0;">
          <p style="color: #64748b; font-size: 14px; margin: 0;">
            Best regards,<br>
            <strong>GDG on Campus ITU Team</strong>
          </p>
          <p style="color: #94a3b8; font-size: 12px; margin: 10px 0 0 0;">
            This is an automated email. If you have questions, please contact us through our official channels.
          </p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Brain Games status update email sent to ${teamLead.email}`);
  } catch (error) {
    console.error("Error sending Brain Games status update email:", error);
    throw error;
  }
};

// ─── SPONSOR EMAILS ───────────────────────────────────────────────────────────

const PACKAGE_LABELS = {
  platinum: "Platinum",
  gold: "Gold",
  silver: "Silver",
  bronze: "Bronze",
  custom: "Custom",
};

export const sendSponsorConfirmation = async (sponsor) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: { name: "CodeRush 2026", address: process.env.SMTP_EMAIL },
    to: sponsor.email,
    subject: "CodeRush 2026 — Sponsorship Application Received",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #000; color: #fff; padding: 0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #000 0%, #0a1a0a 100%); padding: 40px 40px 30px; border-bottom: 1px solid #22c55e30;">
          <h1 style="margin: 0 0 6px; font-size: 28px; font-weight: 900; color: #22c55e;">CodeRush 2026</h1>
          <p style="margin: 0; color: #ffffff60; font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">GDG on Campus · Information Technology University</p>
        </div>
        <div style="padding: 36px 40px;">
          <h2 style="color: #fff; margin: 0 0 8px; font-size: 20px;">Hi ${sponsor.fullName},</h2>
          <p style="color: #ffffff80; line-height: 1.7; margin: 0 0 24px;">
            Thank you for your interest in sponsoring <strong style="color: #22c55e;">CodeRush 2026</strong>! We've received your application and our team will review it shortly and get back to you soon.
          </p>
          <div style="background: #0d0d0d; border: 1px solid #22c55e20; border-radius: 10px; padding: 20px; margin-bottom: 24px;">
            <p style="margin: 0 0 14px; font-size: 11px; color: #22c55e80; text-transform: uppercase; letter-spacing: 2px;">Application Summary</p>
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <tr><td style="padding: 6px 0; color: #ffffff50; width: 40%;">Company</td><td style="color: #fff; font-weight: 600;">${sponsor.companyName}</td></tr>
              <tr><td style="padding: 6px 0; color: #ffffff50;">Contact</td><td style="color: #fff;">${sponsor.fullName} · ${sponsor.jobTitle}</td></tr>
              <tr><td style="padding: 6px 0; color: #ffffff50;">Package</td><td style="color: #22c55e; font-weight: 700;">${PACKAGE_LABELS[sponsor.package]} Sponsor</td></tr>
              <tr><td style="padding: 6px 0; color: #ffffff50;">Stall</td><td style="color: #fff;">${sponsor.wantsStall ? "Yes" : "No"}</td></tr>
            </table>
          </div>
          <p style="color: #ffffff50; font-size: 13px; line-height: 1.6;">
            If you have any questions in the meantime, feel free to reach out at <a href="mailto:${process.env.SMTP_EMAIL}" style="color: #22c55e;">${process.env.SMTP_EMAIL}</a> or follow us on Instagram <a href="https://www.instagram.com/coderush_itu/" style="color: #22c55e;">@coderush_itu</a>.
          </p>
        </div>
        <div style="padding: 20px 40px; border-top: 1px solid #ffffff08; text-align: center;">
          <p style="margin: 0; color: #ffffff25; font-size: 12px;">CodeRush 2026 · May 8–10 · Information Technology University, Lahore</p>
        </div>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Sponsor confirmation email sent to ${sponsor.email}`);
  } catch (error) {
    console.error("Error sending sponsor confirmation email:", error);
    throw error;
  }
};

export const sendSponsorAdminNotification = async (sponsor) => {
  const transporter = createTransporter();

  const mailOptions = {
    from: { name: "CodeRush 2026", address: process.env.SMTP_EMAIL },
    to: process.env.SMTP_EMAIL,
    subject: `[CodeRush] New Sponsor Application — ${sponsor.companyName} (${PACKAGE_LABELS[sponsor.package]})`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 30px; background: #f8fafc; border-radius: 10px;">
        <h2 style="color: #000; margin: 0 0 20px;">New Sponsorship Application</h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
          <tr style="background: #f1f5f9;"><td style="padding: 10px; color: #64748b; width: 35%;">Company</td><td style="padding: 10px; font-weight: 600;">${sponsor.companyName}</td></tr>
          <tr><td style="padding: 10px; color: #64748b;">Industry</td><td style="padding: 10px;">${sponsor.industry || "—"}</td></tr>
          <tr style="background: #f1f5f9;"><td style="padding: 10px; color: #64748b;">Website</td><td style="padding: 10px;">${sponsor.companyWebsite || "—"}</td></tr>
          <tr><td style="padding: 10px; color: #64748b;">Size</td><td style="padding: 10px;">${sponsor.companySize || "—"}</td></tr>
          <tr style="background: #f1f5f9;"><td style="padding: 10px; color: #64748b;">Contact Person</td><td style="padding: 10px;">${sponsor.fullName} (${sponsor.jobTitle})</td></tr>
          <tr><td style="padding: 10px; color: #64748b;">Email</td><td style="padding: 10px;">${sponsor.email}</td></tr>
          <tr style="background: #f1f5f9;"><td style="padding: 10px; color: #64748b;">Phone</td><td style="padding: 10px;">${sponsor.phone}</td></tr>
          <tr><td style="padding: 10px; color: #64748b;">WhatsApp</td><td style="padding: 10px;">${sponsor.whatsapp || "—"}</td></tr>
          <tr style="background: #f1f5f9;"><td style="padding: 10px; color: #64748b;">Package</td><td style="padding: 10px; font-weight: 700; color: #22c55e;">${PACKAGE_LABELS[sponsor.package]}</td></tr>
          <tr><td style="padding: 10px; color: #64748b;">Wants Stall</td><td style="padding: 10px;">${sponsor.wantsStall ? "Yes" : "No"}</td></tr>
          ${sponsor.requirements ? `<tr style="background: #f1f5f9;"><td style="padding: 10px; color: #64748b;">Requirements</td><td style="padding: 10px;">${sponsor.requirements}</td></tr>` : ""}
          ${sponsor.comments ? `<tr><td style="padding: 10px; color: #64748b;">Comments</td><td style="padding: 10px;">${sponsor.comments}</td></tr>` : ""}
        </table>
      </div>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Sponsor admin notification sent`);
  } catch (error) {
    console.error("Error sending sponsor admin notification:", error);
    throw error;
  }
};
