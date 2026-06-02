const User = require("../models/User");

const sendOTP = async (req, res) => {
  try {
    const { email, phone } = req.body;

    if (!email && !phone) {
      return res.status(400).json({
        success: false,
        message: "Email or phone is required",
      });
    }

    // Generate a random 6-digit OTP (e.g., between 100000 and 999999)
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Log the OTP to the console
    console.log(`Generated OTP for ${email || phone}: ${otp}`);

    let user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      user = await User.create({
        email,
        phone,
        otp,
      });
    } else {
      user.otp = otp;
      await user.save();
    }

    res.status(200).json({
      success: true,
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const verifyOTP = async (req, res) => {
  try {
    const { email, phone, otp } = req.body;

    const user = await User.findOne({
      $or: [{ email }, { phone }],
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    if (user.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    user.isVerified = true;
    user.otp = ""; // Clear OTP after successful verification to prevent reuse
    await user.save();

    res.status(200).json({
      success: true,
      message: "OTP verified successfully",
      user: {
        id: user._id,
        email: user.email,
        phone: user.phone,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  sendOTP,
  verifyOTP,
};