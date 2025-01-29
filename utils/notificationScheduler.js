const cron = require("node-cron");
const Notification = require("../models/Notification");
const User = require("../models/User");
const { checkAvailability } = require("./checkAvailability");

exports.startNotificationScheduler = () => {
  // Schedule notifications every 30 seconds
  cron.schedule("*/30 * * * * *", async () => {
    // Get all notifications that are queued and not critical
    console.log(
      "Checking for notifications to send at",
      new Date().toLocaleString()
    );

    try {
      const notifications = await Notification.find({
        isDelivered: false,
      });

      // If no notifications are found, return
      if (notifications.length === 0) {
        console.log("No notifications to send.");
        return;
      }

      // convert notifications to array if only one notification is found
      if (!Array.isArray(notifications)) {
        notifications = [notifications];
      }

      const isAnyUserAvailable = false;

      // Iterate through each notification
      for (const notification of notifications) {
        // get the sender and recipient details
        const sender = await User.findById(notification.sender);

        const recipient = await User.findById(notification.recipient);

        // check if notification is critical
        if (notification.isCritical) {
          console.log(
            `Sending CRITICAL notification from ${sender.name} to ${recipient.name}: ${notification.message}`
          );

          // Mark notification as delivered
          notification.isDelivered = true;
          notification.deliveredAt = Date.now();

          // Save notification
          await notification.save();

          // if any user is available, set isAnyUserAvailable to true
          isAnyUserAvailable = true;
        }

        // if normal notification, check if recipient is available
        else if (checkAvailability(recipient.availibilityTime)) {
          console.log(
            `Sending notification from ${sender.name} to ${recipient.name}: ${notification.message}`
          );

          // Mark notification as delivered
          notification.isDelivered = true;
          notification.deliveredAt = Date.now();

          // Save notification
          await notification.save();

          // if any user is available, set isAnyUserAvailable to true
          isAnyUserAvailable = true;
        }
      }

      // Log if no user is available to receive notifications
      if (!isAnyUserAvailable) {
        console.log("No user is available to receive notifications.");
      } else {
        console.log("Notification sent successfully to available users.");
      }
    } catch (error) {
      console.error("Error in sending notifications:", error);
    }
  });
};
