const Lead = require('../models/Lead');

// Helper for filtering
function buildFilters(query) {
  const filters = {};
  // String fields
  if (query.email) filters.email = { $regex: query.email, $options: 'i' };
  if (query.company) filters.company = { $regex: query.company, $options: 'i' };
  if (query.city) filters.city = { $regex: query.city, $options: 'i' };
  // Enums
  if (query.status) filters.status = query.status;
  if (query.source) filters.source = query.source;
  // Numbers
  if (query.score) filters.score = Number(query.score);
  if (query.score_gt) filters.score = { ...filters.score, $gt: Number(query.score_gt) };
  if (query.score_lt) filters.score = { ...filters.score, $lt: Number(query.score_lt) };
  if (query.lead_value) filters.lead_value = Number(query.lead_value);
  if (query.lead_value_gt) filters.lead_value = { ...filters.lead_value, $gt: Number(query.lead_value_gt) };
  if (query.lead_value_lt) filters.lead_value = { ...filters.lead_value, $lt: Number(query.lead_value_lt) };
  // Dates
  if (query.created_at) filters.created_at = new Date(query.created_at);
  if (query.created_before) filters.created_at = { ...filters.created_at, $lt: new Date(query.created_before) };
  if (query.created_after) filters.created_at = { ...filters.created_at, $gt: new Date(query.created_after) };
  if (query.last_activity_at) filters.last_activity_at = new Date(query.last_activity_at);
  // Boolean
  if (query.is_qualified !== undefined) filters.is_qualified = query.is_qualified === 'true';
  return filters;
}

// Create Lead
exports.createLead = async (req, res) => {
  try {
    const lead = await Lead.create(req.body);
    return res.status(201).json(lead);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid data', error: err.message });
  }
};

// Get Leads (pagination + filters)
exports.getLeads = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, parseInt(req.query.limit) || 20);
    const filters = buildFilters(req.query);
    const total = await Lead.countDocuments(filters);
    const leads = await Lead.find(filters)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ created_at: -1 });
    return res.status(200).json({
      data: leads,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    return res.status(500).json({ message: 'Server error' });
  }
};

// Get single lead
exports.getLead = async (req, res) => {
  try {
    const lead = await Lead.findById(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(404).json({ message: 'Lead not found' });
  }
};

// Update lead
exports.updateLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    return res.status(200).json(lead);
  } catch (err) {
    return res.status(400).json({ message: 'Invalid data', error: err.message });
  }
};

// Delete lead
exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findByIdAndDelete(req.params.id);
    if (!lead) return res.status(404).json({ message: 'Lead not found' });
    return res.status(200).json({ message: 'Lead deleted' });
  } catch (err) {
    return res.status(404).json({ message: 'Lead not found' });
  }
};
