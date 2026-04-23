import Playlist from '../models/Playlist.js';

const createPlaylist = async (req, res) => {
  try {
    const { title, isPublic } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'title is required' });
    }

    const playlist = await Playlist.create({ title, isPublic, createdBy: req.user.id });
    return res.status(201).json({ message: 'Playlist created', playlistId: playlist._id });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

const addContent = async (req, res) => {
  try {
    const { playlistId, contentId } = req.body;

    if (!playlistId || !contentId) {
      return res.status(400).json({ message: 'playlistId and contentId are required' });
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: 'Playlist not found' });
    }

    if (!playlist.contentIds.some((id) => id.toString() === contentId)) {
      playlist.contentIds.push(contentId);
      await playlist.save();
    }

    return res.json({ message: 'Content added to playlist' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default {
  createPlaylist,
  addContent,
};
