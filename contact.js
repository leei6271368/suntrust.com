
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const contactForm = document.getElementById("contactForm");
  const formStatus = document.getElementById("formStatus");
  const currentYear = document.getElementById("currentYear");

  // Automatically display the current year in the footer.
  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation menu.
  if (menuToggle && mainNav) {
    menuToggle.addEventListener("click", () => {
      const isOpen = mainNav.classList.toggle("open");

      menuToggle.setAttribute("aria-expanded", String(isOpen));
      menuToggle.setAttribute(
        "aria-label",
        isOpen ? "Close navigation" : "Open navigation"
      );
      menuToggle.textContent = isOpen ? "✕" : "☰";
    });

    mainNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        mainNav.classList.remove("open");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Open navigation");
        menuToggle.textContent = "☰";
      });
    });
  }

  // Validate the enquiry and prepare an email for the user's email application.
  if (contactForm) {
    contactForm.addEventListener("submit", (event) => {
      event.preventDefault();

      formStatus.textContent = "";
      formStatus.className = "form-status";

      if (!contactForm.checkValidity()) {
        contactForm.reportValidity();
        return;
      }

      const formData = new FormData(contactForm);

      const fullName = String(formData.get("fullName") || "").trim();
      const email = String(formData.get("email") || "").trim();
      const phone = String(formData.get("phone") || "").trim();
      const enquiryType = String(formData.get("enquiryType") || "");
      const property = String(formData.get("property") || "").trim();
      const message = String(formData.get("message") || "").trim();

      if (!fullName || !email || !enquiryType || !message) {
        formStatus.textContent = "Please complete all required fields.";
        formStatus.classList.add("error");
        return;
      }

      const subject = `Suntrust Website Enquiry: ${enquiryType}`;

      const emailBody = [
        "SUNTRUST PROPERTIES WEBSITE ENQUIRY",
        "",
        `Name: ${fullName}`,
        `Email: ${email}`,
        `Phone: ${phone || "Not provided"}`,
        `Enquiry type: ${enquiryType}`,
        `Property or project: ${property || "Not specified"}`,
        "",
        "Message:",
        message
      ].join("\n");

      const mailtoLink =
        "mailto:wecare@suntrust.com.ph" +
        "?subject=" + encodeURIComponent(subject) +
        "&body=" + encodeURIComponent(emailBody);

      formStatus.textContent =
        "Your email application should open with your enquiry. Please review and send the email to complete your enquiry.";
      formStatus.classList.add("success");

      // Open the visitor's email application; this does not send the email automatically.
      window.location.href = mailtoLink;
    });
  }
});
