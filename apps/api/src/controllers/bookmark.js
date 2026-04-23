import Bookmark from '../models/Bookmark.js';

const saveForLater = async (req, res) => {
  try {
    const { contentId } = req.body;

    if (!contentId) {
      return res.status(400).json({ message: 'contentId is required' });
    }

    const bookmark = await Bookmark.create({ userId: req.user.id, contentId });
    return res.status(201).json({ message: 'Content bookmarked', bookmarkId: bookmark._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default { saveForLater };
