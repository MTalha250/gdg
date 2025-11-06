import Contact from "../models/contact.js";
import Event from "../models/event.js";
import Recruitment from "../models/recruitment.js";
import BrainGames from "../models/brainGames.js";

export const getDashboardStats = async (req, res) => {
  try {
    // General counts
    const contactCount = await Contact.countDocuments();
    const eventCount = await Event.countDocuments();
    const recruitmentCount = await Recruitment.countDocuments();
    const brainGamesCount = await BrainGames.countDocuments();

    // Recruitment status breakdown
    const recruitmentStats = await Recruitment.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recruitment by team
    const teamStats = await Recruitment.aggregate([
      {
        $group: {
          _id: "$selectedTeam",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recruitment by role
    const roleStats = await Recruitment.aggregate([
      {
        $group: {
          _id: "$selectedRole",
          count: { $sum: 1 },
        },
      },
    ]);

    // Recent activities (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentContacts = await Contact.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentRecruitments = await Recruitment.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentEvents = await Event.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    const recentBrainGames = await BrainGames.countDocuments({
      createdAt: { $gte: sevenDaysAgo },
    });

    // Brain Games stats
    const brainGamesStats = await BrainGames.aggregate([
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    // Latest applications (last 5)
    const latestApplications = await Recruitment.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("fullName email selectedTeam selectedRole status createdAt");

    // Latest contacts (last 5)
    const latestContacts = await Contact.find()
      .sort({ createdAt: -1 })
      .limit(5)
      .select("name email message createdAt");

    res.status(200).json({
      // Overall counts
      contactCount,
      eventCount,
      recruitmentCount,
      brainGamesCount,

      // Recruitment analytics
      recruitmentStats,
      teamStats,
      roleStats,

      // Brain Games analytics
      brainGamesStats,

      // Recent activity (last 7 days)
      recentActivity: {
        contacts: recentContacts,
        recruitments: recentRecruitments,
        events: recentEvents,
        brainGames: recentBrainGames,
      },

      // Latest items
      latestApplications,
      latestContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
