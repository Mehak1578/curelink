const Appointment = require('../models/Appointment');

exports.create = async (req, res) => {
  try {
    const { doctor, date, reason } = req.body;
    if (!doctor || !date) return res.status(400).json({ msg: 'Missing fields' });
    const appt = new Appointment({ patient: req.user.id, doctor, date, reason, status: 'requested' });
    await appt.save();
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.getMy = async (req, res) => {
  try {
    const appts = await Appointment.find({ $or: [{ patient: req.user.id }, { doctor: req.user.id }] }).populate('patient doctor', 'name email');
    res.json(appts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.reschedule = async (req, res) => {
  try {
    const { id } = req.params;
    const { date } = req.body;
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });
    // only patient or doctor can reschedule
    if (String(appt.patient) !== String(req.user.id) && String(appt.doctor) !== String(req.user.id)) return res.status(403).json({ msg: 'Forbidden' });
    appt.date = date;
    appt.status = 'requested';
    await appt.save();
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.cancel = async (req, res) => {
  try {
    const { id } = req.params;
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });
    if (String(appt.patient) !== String(req.user.id) && req.user.role !== 'admin') return res.status(403).json({ msg: 'Forbidden' });
    appt.status = 'cancelled';
    await appt.save();
    res.json({ msg: 'Appointment cancelled' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};

exports.updatePayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const appt = await Appointment.findById(id);
    if (!appt) return res.status(404).json({ msg: 'Appointment not found' });
    appt.paymentStatus = status;
    await appt.save();
    res.json(appt);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
};
