const weddingDate = new Date("2026-12-20T14:35:00+05:30");
const countdownFields = {
  days: document.querySelector("#days"),
  hours: document.querySelector("#hours"),
  minutes: document.querySelector("#minutes"),
  seconds: document.querySelector("#seconds"),
};

function updateCountdown() {
  const remaining = weddingDate.getTime() - Date.now();

  if (remaining <= 0) {
    Object.values(countdownFields).forEach((field) => {
      field.textContent = "00";
    });
    document.querySelector(".countdown-title").textContent = "The celebration is here";
    return;
  }

  const seconds = Math.floor(remaining / 1000);
  countdownFields.days.textContent = String(Math.floor(seconds / 86400)).padStart(2, "0");
  countdownFields.hours.textContent = String(Math.floor((seconds % 86400) / 3600)).padStart(2, "0");
  countdownFields.minutes.textContent = String(Math.floor((seconds % 3600) / 60)).padStart(2, "0");
  countdownFields.seconds.textContent = String(seconds % 60).padStart(2, "0");
}

updateCountdown();
window.setInterval(updateCountdown, 1000);

const revealSections = document.querySelectorAll(".reveal");
if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  revealSections.forEach((section) => revealObserver.observe(section));
} else {
  revealSections.forEach((section) => section.classList.add("is-visible"));
}

document.querySelector("#calendar-button").addEventListener("click", () => {
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const event = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shubham and Pratiksha//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    "UID:shubham-pratiksha-wedding-20261220",
    `DTSTAMP:${timestamp}`,
    "DTSTART:20261220T090500Z",
    "SUMMARY:Shubham and Pratiksha's Wedding",
    "LOCATION:Sankalp Garden Mangal Karyalaya\\, Pune\\, Maharashtra\\, India",
    "DESCRIPTION:Celebrate the wedding of Shubham and Pratiksha.",
    "URL:https://maps.app.goo.gl/CM8Jx7gFPAzWLVDv7",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const file = new Blob([event], { type: "text/calendar;charset=utf-8" });
  const downloadUrl = URL.createObjectURL(file);
  const link = document.createElement("a");
  link.href = downloadUrl;
  link.download = "shubham-and-pratiksha-wedding.ics";
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(downloadUrl), 1000);
});

document.querySelector("#share-button").addEventListener("click", async () => {
  const status = document.querySelector("#share-status");
  const shareData = {
    title: "Shubham & Pratiksha — Wedding Invitation",
    text: "Join us to celebrate Shubham and Pratiksha on 20 December 2026 at 2:35 PM.",
    url: window.location.href,
  };

  if (navigator.share) {
    try {
      await navigator.share(shareData);
      status.textContent = "Thank you for sharing our invitation.";
    } catch (error) {
      if (error.name !== "AbortError") {
        status.textContent = "Sharing isn’t available right now. You can copy the page link from your browser.";
      }
    }
    return;
  }

  try {
    await navigator.clipboard.writeText(window.location.href);
    status.textContent = "Invitation link copied. Share it with your loved ones.";
  } catch {
    status.textContent = "Copy the invitation link from your browser’s address bar to share it.";
  }
});
