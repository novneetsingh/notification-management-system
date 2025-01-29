// helper function to check if the recipient is available at the current time
// availability is an array of strings representing the time slots when the recipient is available
// Example: availability = ["09:00-12:00", "14:00-18:00"]
// Returns true if the recipient is available at the current time, false otherwise

exports.checkAvailability = (availableTimes) => {
  // Step 1: Get the current time
  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();

  // Step 2: Convert current time to total minutes since midnight
  const currentTimeInMinutes = currentHour * 60 + currentMinute;

  // Step 3: Loop through each availability interval
  for (const slot of availableTimes || []) {
    // Step 4: Split the interval into start and end times
    const [start, end] = slot.split("-");

    // Step 5: Convert start and end times to total minutes since midnight
    const [startHour, startMinute] = start.split(":").map(Number);
    const [endHour, endMinute] = end.split(":").map(Number);

    const startTime = startHour * 60 + startMinute;
    const endTime = endHour * 60 + endMinute;

    // Step 6: Check if current time lies within this interval
    if (currentTimeInMinutes >= startTime && currentTimeInMinutes < endTime) {
      return true; // Current time is within this interval
    }
  }

  // Step 7: If no interval matches, return false
  return false;
};
