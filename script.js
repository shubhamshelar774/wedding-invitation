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

function scatterPetals(container, count, className) {
  const colors = ["#c8768a", "#db9cac", "#e7bbab", "#c5a16e"];
  for (let index = 0; index < count; index += 1) {
    const piece = document.createElement("span");
    piece.className = className;
    piece.style.setProperty("--left", `${Math.random() * 100}%`);
    piece.style.setProperty("--size", `${6 + Math.random() * 8}px`);
    piece.style.setProperty("--angle", `${Math.random() * 360}deg`);
    piece.style.setProperty("--drift", `${Math.random() * 160 - 80}px`);
    piece.style.setProperty("--petal-color", colors[index % colors.length]);
    piece.style.setProperty("--delay", `${Math.random() * -12}s`);
    piece.style.setProperty("--duration", `${9 + Math.random() * 9}s`);
    container.append(piece);
  }
}

scatterPetals(document.querySelector("#entry-petals"), 18, "entry-petal");

document.querySelector("#open-invitation").addEventListener("click", () => {
  const entryScreen = document.querySelector("#entry-screen");
  const invitation = document.querySelector("#invitation");
  entryScreen.classList.add("is-opening");
  entryScreen.setAttribute("aria-hidden", "true");
  invitation.removeAttribute("aria-hidden");
  invitation.inert = false;
  document.body.classList.add("invitation-open");

  if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    scatterPetals(document.querySelector("#date-confetti"), 36, "confetti-piece");
    document.querySelectorAll(".confetti-piece").forEach((piece, index) => {
      piece.style.setProperty("--delay", `${Math.random() * 0.9}s`);
      piece.style.animation = `confetti-fall ${2.8 + Math.random() * 1.8}s ${index * 0.018}s ease-in forwards`;
    });
  }

  window.setTimeout(() => {
    entryScreen.hidden = true;
    document.querySelector("#names-reveal").scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth",
      block: "start",
    });
  }, 900);
});

const memoryTrack = document.querySelector("#memory-track");
const memoryCards = [...memoryTrack.querySelectorAll(".memory-card")];
const carouselDots = [...document.querySelectorAll(".carousel-dot")];

function setCurrentMemory(index) {
  const card = memoryCards[index];
  if (!card) return;
  memoryTrack.scrollTo({ left: card.offsetLeft - memoryTrack.offsetLeft, behavior: "smooth" });
}

document.querySelector("#previous-memory").addEventListener("click", () => {
  const current = carouselDots.findIndex((dot) => dot.classList.contains("is-current"));
  setCurrentMemory(Math.max(0, current - 1));
});

document.querySelector("#next-memory").addEventListener("click", () => {
  const current = carouselDots.findIndex((dot) => dot.classList.contains("is-current"));
  setCurrentMemory(Math.min(memoryCards.length - 1, current + 1));
});

carouselDots.forEach((dot, index) => {
  dot.addEventListener("click", () => setCurrentMemory(index));
});

let scrollFrame = 0;
memoryTrack.addEventListener("scroll", () => {
  if (scrollFrame) return;
  scrollFrame = window.requestAnimationFrame(() => {
    const center = memoryTrack.scrollLeft + memoryTrack.clientWidth / 2;
    const currentIndex = memoryCards.reduce((closest, card, index) => {
      const cardCenter = card.offsetLeft + card.clientWidth / 2 - memoryTrack.offsetLeft;
      const closestCenter = memoryCards[closest].offsetLeft + memoryCards[closest].clientWidth / 2 - memoryTrack.offsetLeft;
      return Math.abs(cardCenter - center) < Math.abs(closestCenter - center) ? index : closest;
    }, 0);

    carouselDots.forEach((dot, index) => {
      const isCurrent = index === currentIndex;
      dot.classList.toggle("is-current", isCurrent);
      if (isCurrent) {
        dot.setAttribute("aria-current", "true");
      } else {
        dot.removeAttribute("aria-current");
      }
    });
    scrollFrame = 0;
  });
});

document.querySelector("#calendar-button").addEventListener("click", () => {
  const timestamp = new Date().toISOString()
    .replace(/[-:]/g, "")
    .replace(/\.\d{3}Z$/, "Z");
  const event = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Shubham and Pratiksha//Wedding Invitation//EN",
    "BEGIN:VEVENT",
    "UID:shubham-pratiksha-haldi-20261219",
    `DTSTAMP:${timestamp}`,
    "DTSTART:20261219T123000Z",
    "SUMMARY:Haldi Celebration at the Groom's Home",
    "LOCATION:Groom's home",
    "DESCRIPTION:Join the Haldi celebration from 6:00 PM onwards on Saturday\\, 19 December 2026.",
    "END:VEVENT",
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
  const shareUrl = new URL(window.location.href);
  shareUrl.searchParams.set("share", "2");
  const shareData = {
    title: "Shubham & Pratiksha — Wedding Invitation",
    text: "Join us for Haldi at the groom’s home on 19 December from 6:00 PM, and our wedding on 20 December 2026 at 2:35 PM.",
    url: shareUrl.href,
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
    await navigator.clipboard.writeText(shareUrl.href);
    status.textContent = "Invitation link copied. Share it with your loved ones.";
  } catch {
    status.textContent = "Copy the invitation link from your browser’s address bar to share it.";
  }
});
