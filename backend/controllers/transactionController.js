const Transaction = require('../models/Transaction');

// Create
exports.addTransaction = async (req, res) => {
  try {
    const transaction = new Transaction({ ...req.body, userId: req.user._id });
    await transaction.save();
    res.status(201).json(transaction);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Get All
exports.getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ userId: req.user._id }).sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};

// Delete
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
    res.json({ msg: 'Deleted' });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};
