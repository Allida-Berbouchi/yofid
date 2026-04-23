import FlaggedContent from '../models/FlaggedContent.js';

const reportContent = async (req, res) => {
  try {
    const { contentId, reason } = req.body;

    if (!contentId) {
      return res.status(400).json({ message: 'contentId is required' });
    }

    await FlaggedContent.create({ contentId, reportedBy: req.user.id, reason });
    return res.status(201).json({ message: 'Content reported' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.body;

    if (!reportId) {
      return res.status(400).json({ message: 'reportId is required' });
    }

    const report = await FlaggedContent.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.reportStatus = 'resolved';
    await report.save();

    return res.json({ message: 'Report resolved' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default {
  reportContent,
  resolveReport,
};
