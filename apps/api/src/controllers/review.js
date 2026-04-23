import Review from '../models/Review.js';

const markHelpful = async (req, res) => {
  try {
    const { reviewId } = req.body;

    if (!reviewId) {
      return res.status(400).json({ message: 'reviewId is required' });
    }

    const review = await Review.findById(reviewId);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    review.helpfulCount += 1;
    await review.save();

    return res.json({ message: 'Review marked helpful' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};

export default { markHelpful };
