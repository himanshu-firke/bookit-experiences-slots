const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const Experience = require('./models/Experience');
const Booking = require('./models/Booking');
const PromoCode = require('./models/PromoCode');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/bookit';

mongoose.connect(MONGODB_URI)
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch(err => console.error('❌ MongoDB connection error:', err));

// Helper function to generate reference ID
function generateRefId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 8; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// ==================== API ENDPOINTS ====================

// GET /experiences - Return list of experiences
app.get('/api/experiences', async (req, res) => {
  try {
    const experiences = await Experience.find({ isActive: true })
      .select('-times -about -dates')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: experiences.length,
      data: experiences
    });
  } catch (error) {
    console.error('Error fetching experiences:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experiences',
      error: error.message
    });
  }
});

// GET /experiences/:id - Return details and slot availability
app.get('/api/experiences/:id', async (req, res) => {
  try {
    const experience = await Experience.findById(req.params.id);
    
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Update slot availability based on bookings
    const bookings = await Booking.find({
      experienceId: experience._id,
      status: 'confirmed'
    });

    // Calculate availability for each time slot
    const updatedTimes = experience.times.map(timeSlot => {
      const bookedCount = bookings
        .filter(booking => booking.time === timeSlot.time)
        .reduce((sum, booking) => sum + booking.quantity, 0);
      
      const available = Math.max(0, 10 - bookedCount); // Assuming max 10 slots per time
      
      return {
        ...timeSlot.toObject(),
        available,
        status: available === 0 ? 'SOLD OUT' : undefined
      };
    });

    const responseData = {
      ...experience.toObject(),
      times: updatedTimes
    };

    res.json({
      success: true,
      data: responseData
    });
  } catch (error) {
    console.error('Error fetching experience details:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching experience details',
      error: error.message
    });
  }
});

// POST /bookings - Accept booking details and store them
app.post('/api/bookings', async (req, res) => {
  try {
    const {
      experienceId,
      experienceTitle,
      fullName,
      email,
      date,
      time,
      location,
      quantity,
      price,
      taxes,
      total,
      promoCode,
      discount,
      agreedToTerms
    } = req.body;

    // Validation
    if (!experienceId || !fullName || !email || !date || !time || !quantity || !agreedToTerms) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields'
      });
    }

    // Email validation
    const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }

    // Check if experience exists
    const experience = await Experience.findById(experienceId);
    if (!experience) {
      return res.status(404).json({
        success: false,
        message: 'Experience not found'
      });
    }

    // Check slot availability
    const existingBookings = await Booking.find({
      experienceId,
      date,
      time,
      status: 'confirmed'
    });

    const totalBooked = existingBookings.reduce((sum, booking) => sum + booking.quantity, 0);
    if (totalBooked + quantity > 10) {
      return res.status(400).json({
        success: false,
        message: 'Not enough slots available',
        available: Math.max(0, 10 - totalBooked)
      });
    }

    // Generate unique reference ID
    let refId;
    let isUnique = false;
    while (!isUnique) {
      refId = generateRefId();
      const existing = await Booking.findOne({ refId });
      if (!existing) isUnique = true;
    }

    // Create booking
    const booking = new Booking({
      experienceId,
      experienceTitle,
      fullName,
      email,
      date,
      time,
      location,
      quantity,
      price,
      taxes,
      total,
      promoCode: promoCode || null,
      discount: discount || 0,
      refId,
      agreedToTerms,
      status: 'confirmed'
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: 'Booking confirmed successfully',
      data: {
        refId: booking.refId,
        experienceTitle: booking.experienceTitle,
        date: booking.date,
        time: booking.time,
        quantity: booking.quantity,
        total: booking.total,
        email: booking.email
      }
    });

  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating booking',
      error: error.message
    });
  }
});

// POST /promo/validate - Validate promo codes
app.post('/api/promo/validate', async (req, res) => {
  try {
    const { code, subtotal } = req.body;

    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Promo code is required'
      });
    }

    const promoCode = await PromoCode.findOne({
      code: code.toUpperCase(),
      isActive: true
    });

    if (!promoCode) {
      return res.status(404).json({
        success: false,
        message: 'Invalid promo code'
      });
    }

    // Check if promo code is expired
    if (promoCode.validUntil && new Date() > promoCode.validUntil) {
      return res.status(400).json({
        success: false,
        message: 'Promo code has expired'
      });
    }

    // Check usage limit
    if (promoCode.usageLimit && promoCode.usageCount >= promoCode.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Promo code usage limit reached'
      });
    }

    // Check minimum purchase
    if (subtotal < promoCode.minPurchase) {
      return res.status(400).json({
        success: false,
        message: `Minimum purchase of ₹${promoCode.minPurchase} required`
      });
    }

    // Calculate discount
    let discount = 0;
    if (promoCode.discountType === 'percentage') {
      discount = (subtotal * promoCode.discountValue) / 100;
      if (promoCode.maxDiscount && discount > promoCode.maxDiscount) {
        discount = promoCode.maxDiscount;
      }
    } else {
      discount = promoCode.discountValue;
    }

    // Increment usage count
    promoCode.usageCount += 1;
    await promoCode.save();

    res.json({
      success: true,
      message: 'Promo code applied successfully',
      data: {
        code: promoCode.code,
        discount: Math.round(discount),
        discountType: promoCode.discountType,
        discountValue: promoCode.discountValue
      }
    });

  } catch (error) {
    console.error('Error validating promo code:', error);
    res.status(500).json({
      success: false,
      message: 'Error validating promo code',
      error: error.message
    });
  }
});

// GET /bookings/:refId - Get booking by reference ID
app.get('/api/bookings/:refId', async (req, res) => {
  try {
    const booking = await Booking.findOne({ refId: req.params.refId })
      .populate('experienceId', 'title location image');

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }

    res.json({
      success: true,
      data: booking
    });
  } catch (error) {
    console.error('Error fetching booking:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching booking',
      error: error.message
    });
  }
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'BookIt API is running',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Endpoint not found'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    message: 'Internal server error',
    error: err.message
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📡 API available at http://localhost:${PORT}/api`);
});
