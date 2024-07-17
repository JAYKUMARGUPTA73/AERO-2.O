const {
  sendVerificationEmail,
  sendSignupEmailNotification,
} = require("../middlewares/nodemailerMiddleware");
const OtpVerification = require("../models/OtpVerification");
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");



const uploadProfile = async (req, res) => {
  try {
    const _id = req.user_id;
    const profile_pic = req.fileDownloadURL; // Assuming req.fileDownloadURL holds the URL of the uploaded file
    const user = await User.findOne({ _id });
    if (user) {
      user.profile_pic = profile_pic;
      await user.save(); // Save the updated user object
      res.status(200).json({ success: true, message: "Profile picture updated successfully",profile_pic:profile_pic});
    } else {
      res.status(404).json({ success: false, message: "User not found" });
    }
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};


function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
}

const emailVerification = async (req, res) => {
  const { full_name, email } = req.body;
  if (email) {
    try {
      const existingEmail = await User.findOne({ email });
      if (existingEmail) {
        return res.status(409).json({ err: "Email already exists" });
      }

      // Generate OTP with timestamp
      const otp = generateOTP();

      // Send email with OTP
      try {
        await sendVerificationEmail(email, otp);
        console.log("Email sent successfully");
        // Check if OTP exists for the email
        const existingOtp = await OtpVerification.findOne({ email });

        if (existingOtp) {
          // Update existing OTP
          existingOtp.otp = otp;
          await existingOtp.save();
        } else {
          // Create new OTP entry
          const newOtp = new OtpVerification({
            email,
            otp,
            full_name,
          });
          await newOtp.save();
        }

        return res.status(200).json({ msg: "OTP sent successfully" });
      } catch (error) {
        console.log("Error sending email5:", error);
        return res
          .status(500)
          .json({ err: "Failed to send verification email" });
      }
    } catch (error) {
      console.log("Error:", error);
      return res.status(500).json({ err: "Internal server error" });
    }
  } else {
    return res.status(400).json({ err: "Please use your college email id" });
  }
};

const otpcheck = async (req, res) => {
  try {
    console.log("Request body:", req.body);

    let { email, otp } = req.body;
    email = email.trim();

    console.log("Email:", email);
    console.log("OTP before parsing:", otp);

    // Ensure otp is always treated as a string
    otp = Array.isArray(otp) ? parseInt(otp.join("")) : parseInt(otp);
    console.log("OTP after parsing:", otp);

    console.log("Querying database for email:", email);

    // First, find the document without updating it
    const verificationDoc = await OtpVerification.findOne({ email: email });

    console.log("Initial verification result:", verificationDoc);

    if (!verificationDoc) {
      console.log("No OTP verification document found for email:", email);
      return res.status(404).json({ err: "OTP verification document not found" });
    }

    // Check if the OTP matches
    if (verificationDoc.otp !== otp) {
      console.log(verificationDoc.otp)
      console.log(otp)
      console.log("OTP mismatch for email:", email);
      return res.status(400).json({ err: "Invalid OTP" });
    }

    // Check if the OTP has expired (assuming 10 minutes expiration)
    if (verificationDoc.createdAt < new Date(Date.now() - 10 * 60 * 1000)) {
      console.log("OTP expired for email:", email);
      return res.status(400).json({ err: "OTP has expired" });
    }

    // If everything is valid, update the status
    verificationDoc.status = true;
    await verificationDoc.save();

    console.log("Updated verification document:", verificationDoc);

    return res.status(200).json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ err: "Internal server error" });
  }
};

const Signup = async (req, res) => {
  const { email, password } = req.body;

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const verification = await OtpVerification.findOne({ email: email });
    if (!verification) {
      return res.status(404).json({ err: "OTP verification not found" });
    }

    const full_name = verification.full_name;
    console.log("Verification:", verification);

    if (!verification || !verification.status) {
      return res.status(404).json({ err: "Email not verified" });
    }
     await verification.deleteOne({email});
    const date_of_joining = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const profile_pic = `https://avatar.iran.liara.run/public/boy?username=${
      Math.random() * 9000
    }`;
    const newUser = new User({
      full_name,
      email,
      password,
      date_of_joining,
      profile_pic,
    });

    const savedUser = await newUser.save();
    const token = savedUser.generateAuthToken();
    if (savedUser) {
      sendSignupEmailNotification(savedUser.full_name, savedUser.email);
    }

    res.status(201).json({ token, user: savedUser });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Failed to signup" });
  }
};

const Login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid email or password" });
    }

    let expiresIn;
    switch (user.role) {
      case "admin":
        expiresIn = 6 * 60 * 60 * 1000; // 6 hours in milliseconds
        break;
      case "blogger":
        expiresIn = 24 * 60 * 60 * 1000; // 1 day in milliseconds
        break;
      default:
        expiresIn = 50 * 24 * 60 * 60 * 1000; // 50 days in milliseconds
    }

    const token = user.generateAuthToken({ expiresIn });
    const _id = user._id;
    const full_name = user.full_name;
    const profile_pic = user.profile_pic;

    // Set the cookie
    res.cookie("token", token, {
      httpOnly: false, // Allow client-side access for development
      maxAge: expiresIn,
      path: "/",
      sameSite: "lax",
      secure: false, // Allow over HTTP for development
    });

    // Ensure the cookie is set before sending the response
    res.setHeader("Set-Cookie", res.getHeader("Set-Cookie"));

    // Send the response after setting the cookie
    res.status(200).json({ token, _id, full_name, profile_pic });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Failed to login" });
  }
};

const logout = async (req, res) => {
  try {
    console.log("logout");
    // Clear the JWT cookie
    res.clearCookie("token");

    // Optionally, destroy the session if you're using sessions
    // req.session.destroy();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { Signup, Login, logout, emailVerification, otpcheck,uploadProfile};
