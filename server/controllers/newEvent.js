import NewEvent from "../models/newEvent.js";
import { sendEventRegistrationConfirmation, sendEventApprovalEmail, sendEventRejectionEmail } from "../utils/emailService.js";



export const createNewEvent = async (req, res) => {
  try {
    const { teamName, leader, members, receipt } = req.body;

    const event = await NewEvent.create({
      teamName,
      leader,
      members,
      receipt,
    });

    await sendEventRegistrationConfirmation(leader.email, leader.name, teamName);

    return res.status(201).json({
      success: true,
      message: "Registration successful. Confirmation email sent.",
      data: event,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getAllEvents = async (req, res) => {
  try {
    const events = await NewEvent.find().sort({ createdAt: -1 });
    return res.json(events);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const getEvent = async (req, res) => {
  try {
    const event = await NewEvent.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Not found" });
    return res.json(event);
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};

export const deleteEvent = async (req, res) => {
  try {
    const deleted = await NewEvent.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Not found" });
    return res.json({ message: "Deleted Successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Server Error" });
  }
};


export const acceptApplication = async (req, res) => {
  const { id } = req.params;

  const application = await NewEvent.findByIdAndUpdate(id, { status: "accepted" }, { new: true });

  
  await sendEventApprovalEmail(application.leader.email, application.leader.name, application.teamName);

  res.json({ success: true, message: "Application approved", application });
};

export const rejectApplication = async (req, res) => {
  const { id } = req.params;

  const application = await NewEvent.findByIdAndUpdate(id, { status: "rejected" }, { new: true });

  await sendEventRejectionEmail(application.leader.email, application.leader.name, application.teamName);

  res.json({ success: true, message: "Application rejected", application });
};
