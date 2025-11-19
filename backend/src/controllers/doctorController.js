const Doctor = require('../models/Doctor');
const User = require('../models/User');

exports.createProfile = async (req, res) => {
  try{
    const { specialization, experience, fees, bio } = req.body;
    // ensure user exists
    const user = req.user;
    let doc = await Doctor.findOne({ user: user.id });
    if(doc) return res.status(400).json({ msg: 'Profile already exists' });
    doc = new Doctor({ user: user.id, specialization, experience, fees, bio });
    await doc.save();
    res.json(doc);
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
}

exports.getAll = async (req, res) => {
  try{
    const docs = await Doctor.find().populate('user','name email');
    res.json(docs);
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
}

exports.getById = async (req, res) => {
  try{
    const doc = await Doctor.findById(req.params.id).populate('user','name email');
    if(!doc) return res.status(404).json({ msg: 'Doctor not found' });
    res.json(doc);
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
}

exports.verify = async (req, res) => {
  try{
    const doc = await Doctor.findById(req.params.id);
    if(!doc) return res.status(404).json({ msg: 'Doctor not found' });
    doc.verified = true;
    await doc.save();
    // also update linked user
    await User.findByIdAndUpdate(doc.user, { verified: true });
    res.json({ msg: 'Doctor verified' });
  }catch(err){ console.error(err); res.status(500).json({ msg: 'Server error' }); }
}
