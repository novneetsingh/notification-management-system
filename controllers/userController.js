const User = require("../models/User");
const Notification = require("../models/Notification");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// signup a user
exports.signup = async (req, res) => {
  try {
    const { email, password, isAdmin=false } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // check if user already exists
    const user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }

    // hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      password: hashedPassword,
      isAdmin,
    });

    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// login a user
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    // check if password is correct
    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // create token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({
      message: "User logged in successfully",
      token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update user profile
exports.updateProfile = async (req, res) => {
  try {
    const { name, mobileNumber, bio, availibilityTime } = req.body;

    // check if user exists
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.name = name || user.name;
    user.mobileNumber = mobileNumber || user.mobileNumber;
    user.bio = bio || user.bio;
    // array of strings representing the time slots when the user is available like ["09:00-12:00", "14:00-18:00"]
    user.availibilityTime = availibilityTime || user.availibilityTime;

    await user.save();

    res.status(200).json({
      message: "User profile updated successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// sending notification to users
exports.createNotifications = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Please provide the message" });
    }

    // recipients contains all the user ids to whom the notification is to be sent
    const recipients = Array.isArray(req.body.recipients)
      ? req.body.recipients
      : [req.body.recipients];

    // check if recipients exist
    const recipientUsers = await User.find({ _id: { $in: recipients } });
    if (recipientUsers.length !== recipients.length) {
      return res.status(400).json({ message: "Recipient does not exist" });
    }

    // check sender is admin or regular user
    const sender = await User.findById(req.user.id);
    const isAdmin = sender ? sender.isAdmin : false;

    // create a notification array
    const notifications = [];

    // if sender is admin then
    if (isAdmin) {
      const { isCritical = false } = req.body;

      recipients.forEach((recipientId) => {
        const newNotification = new Notification({
          sender: req.user.id,
          recipient: recipientId,
          message,
          isCritical,
        });

        notifications.push(newNotification);
      });
    } else {
      // if sender is regular user then
      recipients.forEach((recipientId) => {
        const newNotification = new Notification({
          sender: req.user.id,
          recipient: recipientId,
          message,
          isCritical: false,
        });

        notifications.push(newNotification);
      });
    }

    // save notifications
    await Notification.insertMany(notifications);

    res.status(200).json({
      message: "Notifications created successfully",
      notifications,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
