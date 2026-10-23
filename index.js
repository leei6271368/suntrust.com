document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const year = document.getElementById("year");
  const contactForm = document.getElementById("contactForm");
  const formMessage = document.getElementById("formMessage");

  // Update the copyright year automatically.
  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // Mobile navigation menu.
  if (menuToggle && mainNav) {
    const closeMenu = () => {
      mainNav.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    };

    menuToggle.addEventListener("click", () => {
      const open = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(open));
      menuToggle.setAttribute(
        "aria-label",
        open ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = open ? "×" : "☰";
    });

    // Close the menu when a visitor selects a link.
    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeMenu);
    });

    // Close the menu when Escape is pressed.
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        closeMenu();
      }
    });
  }

  // Contact form: prepares an email for the visitor to send.
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const data = new FormData(contactForm);

      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const topic = String(data.get("topic") || "General inquiry");
      const message = String(data.get("message") || "").trim();

      if (!name || !email || !message) {
        if (formMessage) {
          formMessage.textContent =
            "Please complete all required fields.";
        }
        return;
      }

      const subject = encodeURIComponent(
        `Suntrust website inquiry: ${topic}`
      );

      const body = encodeURIComponent(
        `Name: ${name}\n` +
        `Email: ${email}\n` +
        `Inquiry: ${topic}\n\n` +
        `Message:\n${message}`
      );

      if (formMessage) {
        formMessage.textContent =
          "Your email app should open with the message prepared. Please review and send it there.";
      }

      window.location.href =
        `mailto:wecare@suntrust.com.ph?subject=${subject}&body=${body}`;
    });
  }
});
