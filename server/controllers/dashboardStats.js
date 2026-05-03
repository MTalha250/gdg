import Contact from "../models/contact.js";
import Event from "../models/event.js";
import Recruitment from "../models/recruitment.js";
import BrainGames from "../models/brainGames.js";
import Coderush from "../models/coderush.js";
import Voucher from "../models/voucher.js";
import Sponsor from "../models/sponsor.js";
import Ambassador from "../models/ambassador.js";
import Partner from "../models/partner.js";

export const getDashboardStats = async (req, res) => {
  try {
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const recentFilter = { createdAt: { $gte: sevenDaysAgo } };
    const groupByStatus = [
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ];

    const [
      // General counts
      contactCount,
      eventCount,
      recruitmentCount,
      brainGamesCount,
      coderushCount,
      voucherCount,
      sponsorCount,
      ambassadorCount,
      partnerCount,
      // Recruitment aggregations
      recruitmentStats,
      teamStats,
      roleStats,
      // Recent activity (last 7 days)
      recentContacts,
      recentRecruitments,
      recentEvents,
      recentBrainGames,
      recentCoderush,
      // Brain Games + Coderush analytics
      brainGamesStats,
      coderushStats,
      coderushByCompetition,
      coderushVoucherStats,
      // Latest items
      latestApplications,
      latestContacts,
    ] = await Promise.all([
      Contact.countDocuments(),
      Event.countDocuments(),
      Recruitment.countDocuments(),
      BrainGames.countDocuments(),
      Coderush.countDocuments(),
      Voucher.countDocuments({ isActive: true }),
      Sponsor.countDocuments(),
      Ambassador.countDocuments(),
      Partner.countDocuments(),

      Recruitment.aggregate(groupByStatus),
      Recruitment.aggregate([
        { $group: { _id: "$selectedTeam", count: { $sum: 1 } } },
      ]),
      Recruitment.aggregate([
        { $group: { _id: "$selectedRole", count: { $sum: 1 } } },
      ]),

      Contact.countDocuments(recentFilter),
      Recruitment.countDocuments(recentFilter),
      Event.countDocuments(recentFilter),
      BrainGames.countDocuments(recentFilter),
      Coderush.countDocuments(recentFilter),

      BrainGames.aggregate(groupByStatus),
      Coderush.aggregate([
        {
          $group: {
            _id: "$status",
            count: { $sum: 1 },
            totalAmount: { $sum: "$discountedFee" },
            originalAmount: { $sum: "$originalFee" },
          },
        },
      ]),
      Coderush.aggregate([
        {
          $group: {
            _id: "$competition",
            count: { $sum: 1 },
            totalAmount: { $sum: "$discountedFee" },
            acceptedAmount: {
              $sum: {
                $cond: [{ $eq: ["$status", "accepted"] }, "$discountedFee", 0],
              },
            },
          },
        },
        { $sort: { count: -1 } },
      ]),
      Coderush.aggregate([
        { $match: { voucherCode: { $ne: null } } },
        {
          $group: {
            _id: null,
            count: { $sum: 1 },
            totalDiscount: {
              $sum: { $subtract: ["$originalFee", "$discountedFee"] },
            },
          },
        },
      ]),

      Recruitment.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("fullName email selectedTeam selectedRole status createdAt"),
      Contact.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select("name email message createdAt"),
    ]);

    res.status(200).json({
      // Overall counts
      contactCount,
      eventCount,
      recruitmentCount,
      brainGamesCount,
      coderushCount,
      voucherCount,
      sponsorCount,
      ambassadorCount,
      partnerCount,

      // Recruitment analytics
      recruitmentStats,
      teamStats,
      roleStats,

      // Brain Games analytics
      brainGamesStats,

      // Coderush analytics
      coderushStats,
      coderushByCompetition,
      coderushVoucherStats: coderushVoucherStats[0] || {
        count: 0,
        totalDiscount: 0,
      },

      // Recent activity (last 7 days)
      recentActivity: {
        contacts: recentContacts,
        recruitments: recentRecruitments,
        events: recentEvents,
        brainGames: recentBrainGames,
        coderush: recentCoderush,
      },

      // Latest items
      latestApplications,
      latestContacts,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
