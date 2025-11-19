const express = require('express');
const Stripe = require('stripe');
const auth = require('../middleware/auth');
const Transaction = require('../models/Transaction');
const Appointment = require('../models/Appointment');

const router = express.Router();
const stripe = Stripe(process.env.STRIPE_SECRET_KEY || '');

// POST /api/payments/create-intent { amount, appointmentId }
router.post('/create-intent', auth, async (req, res) => {
  try {
    const { amount, appointmentId } = req.body;
    if (!amount) return res.status(400).json({ msg: 'Missing amount' });

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(Number(amount) * 100),
      currency: 'usd',
      metadata: { user: req.user.id, appointmentId: appointmentId || '' }
    });

    // record transaction and link to appointment if provided
    const tx = new Transaction({ user: req.user.id, amount, currency: 'usd', provider: 'stripe', providerId: paymentIntent.id, status: 'pending' });
    if (appointmentId) tx.appointment = appointmentId;
    await tx.save();

    res.json({ clientSecret: paymentIntent.client_secret, txId: tx._id });
  } catch (err) {
    console.error('create-intent error', err);
    res.status(500).json({ msg: 'Server error' });
  }
});

// POST /api/payments/webhook - stripe webhook to update tx and appointment
// Must be raw body to verify signature
router.post('/webhook', express.raw({ type: 'application/json' }), async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  let event;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } else {
      // fallback if webhook secret not set (not secure for prod)
      event = req.body;
    }
  } catch (err) {
    console.error('Webhook signature verification failed.', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const pi = event.data.object;
      // mark transaction succeeded
      const tx = await Transaction.findOneAndUpdate({ providerId: pi.id }, { status: 'succeeded' }, { new: true });
      if (tx && tx.appointment) {
        await Appointment.findByIdAndUpdate(tx.appointment, { paymentStatus: 'paid' });
      }
    }

    // Handle other events or log them
    res.json({ received: true });
  } catch (err) {
    console.error('webhook error', err);
    res.status(500).end();
  }
});

// GET /api/payments/transactions - user transaction history
router.get('/transactions', auth, async (req, res) => {
  try {
    const txs = await Transaction.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(txs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
