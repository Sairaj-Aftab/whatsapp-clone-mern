export const hideEmail = (email) => {
  var atIndex = email.indexOf("@");
  var visiblePart = email.substring(0, 2);
  var domain = email.substring(atIndex - 2);

  return visiblePart + "*".repeat(atIndex - 4) + domain;
};

export const hidePhoneNumber = (phoneNumber) => {
  // Remove non-digit characters from the phone number
  var cleanedPhoneNumber = phoneNumber.replace(/\D/g, "");

  // Determine the number of visible and hidden digits
  var visibleDigits = 3;
  var hiddenDigits = cleanedPhoneNumber.length - visibleDigits;

  // Create the hidden phone number with asterisks
  var visiblePart = cleanedPhoneNumber.substring(0, visibleDigits);
  var hiddenPart = "*".repeat(hiddenDigits);
  var lastTwoDigits = cleanedPhoneNumber.slice(-2);

  return visiblePart + hiddenPart + lastTwoDigits;
};

export const expireTimeCount = (expiryTime) => {
  const timerInterval = setInterval(() => {
    const now = Date.now();
    const timeRemaining = expiryTime - now;

    if (timeRemaining <= 0) {
      // OTP has expired, you can handle this case accordingly
      clearInterval(timerInterval);
      console.log("OTP Expired");
    } else {
      // Calculate minutes and seconds from milliseconds
      const minutes = Math.floor(
        (timeRemaining % (1000 * 60 * 60)) / (1000 * 60)
      );
      const seconds = Math.floor((timeRemaining % (1000 * 60)) / 1000);

      console.log(`Time remaining: ${minutes} minutes ${seconds} seconds`);
      return minutes;
    }
  }, 1000);

  // Clean up the interval when the component unmounts
  return () => clearInterval(timerInterval);
};

export const formatTime = (dateString) => {
  // Parse the input date string
  const date = new Date(dateString);

  // Format the time in "hh:mm a" format (e.g., "2:00 PM")
  const formattedTime = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return formattedTime;
};

export const formatTiming = (timeString) => {
  const messageDate = new Date(timeString);
  const today = new Date();

  // If the message was sent today, show time in AM/PM format
  if (messageDate.toDateString() === today.toDateString()) {
    const hours = messageDate.getHours();
    const minutes = messageDate.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
    return `${formattedHours}:${minutes.toString().padStart(2, "0")} ${ampm}`;
  }
  // If the message was sent yesterday, show "Yesterday"
  else if (messageDate.getDate() === today.getDate() - 1) {
    return "Yesterday";
  }
  // If the message was sent within the last 7 days, show the day of the week
  else if ((today.getTime() - messageDate.getTime()) / (1000 * 3600 * 24) < 7) {
    const daysOfWeek = [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];
    return daysOfWeek[messageDate.getDay()];
  }
  // If the message was sent more than 7 days ago, show the date in the format "dd/mm/yyyy"
  else {
    const formattedDate = messageDate.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    return formattedDate.replace(/\//g, "-");
  }
};

// // Example usage:
// const messageTime1 = '2024-02-14T09:05:29.389+00:00'; // Today's message
// const messageTime2 = '2024-02-13T19:05:29.389+00:00'; // Yesterday's message
// const messageTime3 = '2024-02-07T19:05:29.389+00:00'; // More than a week ago message

// console.log(formatTime(messageTime1)); // Output: "9:05 AM"
// console.log(formatTime(messageTime2)); // Output: "Yesterday"
// console.log(formatTime(messageTime3)); // Output: "02-07-2024"
