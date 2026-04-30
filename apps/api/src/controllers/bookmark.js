import Bookmark from '../models/Bookmark.js';
import content from './content.js';
const bookmarkS = 0.1;

const saveForLater = async (req, res) => {
  try {
    const { contentId,userId } = req.body;

    if (!contentId || !userId) {
      return res.status(400).json({ message: 'contentId and userId is required' });
    }

    const bookmark = await Bookmark.create({ userId , contentId });
    content.engagementScore += bookmarkS;
    await content.save();
    return res.status(201).json({ message: 'Content bookmarked', bookmarkId: bookmark._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default { saveForLater };
