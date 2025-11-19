const Weather = require('../models/Weather');

// POST /weather  -> create new reading
exports.createReading = async (req, res, next) => {
  try {
    const data = req.body;
    const doc = await Weather.create(data);
    res.status(201).json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// GET /weather -> list (with optional paging)
exports.getAll = async (req, res, next) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    const docs = await Weather.find()
      .sort({ timestamp: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) { next(err); }
};

// GET /weather/:id
exports.getOne = async (req, res, next) => {
  try {
    const doc = await Weather.findById(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// PUT /weather/:id -> replace
exports.replace = async (req, res, next) => {
  try {
    const doc = await Weather.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// PATCH /weather/:id -> partial update
exports.update = async (req, res, next) => {
  try {
    const doc = await Weather.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true, runValidators: true });
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// DELETE /weather/:id
exports.remove = async (req, res, next) => {
  try {
    const doc = await Weather.findByIdAndDelete(req.params.id);
    if (!doc) return res.status(404).json({ success: false, error: 'Not found' });
    res.json({ success: true, data: doc });
  } catch (err) { next(err); }
};

// GET /weather/search?q=
exports.search = async (req, res, next) => {
  try {
    const q = req.query.q || '';
    const docs = await Weather.find({
      $or: [
        { locationName: new RegExp(q, 'i') },
        { conditions: new RegExp(q, 'i') },
        { source: new RegExp(q, 'i') }
      ]
    }).limit(50);
    res.json({ success: true, count: docs.length, data: docs });
  } catch (err) { next(err); }
};
