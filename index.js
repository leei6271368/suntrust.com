
document.addEventListener("DOMContentLoaded", function () {
  // Mobile navigation
  const menuToggle = document.getElementById("menuToggle");
  const navigation = document.getElementById("navigation");

  menuToggle.addEventListener("click", function () {
    const isOpen = navigation.classList.toggle("open");

    menuToggle.setAttribute("aria-expanded", String(isOpen));
    menuToggle.setAttribute(
      "aria-label",
      isOpen ? "Close navigation" : "Open navigation"
    );
    menuToggle.textContent = isOpen ? "✕" : "☰";
  });

  // Close the mobile menu after choosing a link
  navigation.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      navigation.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
      menuToggle.setAttribute("aria-label", "Open navigation");
      menuToggle.textContent = "☰";
    });
  });

  // Search panel
  const searchToggle = document.getElementById("searchToggle");
  const searchPanel = document.getElementById("searchPanel");
  const closeSearch = document.getElementById("closeSearch");
  const searchInput = document.getElementById("searchInput");
  const searchMessage = document.getElementById("searchMessage");
  const searchForm = document.getElementById("searchForm");

  function toggleSearch(show) {
    searchPanel.hidden = !show;
    searchToggle.setAttribute("aria-expanded", String(show));

    if (show) {
      searchInput.focus();
    }
  }

  searchToggle.addEventListener("click", function () {
    toggleSearch(searchPanel.hidden);
  });

  closeSearch.addEventListener("click", function () {
    toggleSearch(false);
  });

  searchForm.addEventListener("reset", function () {
    searchMessage.textContent = "";
  });

  // Search the visible content on this page
  searchForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const query = searchInput.value.trim().toLowerCase();

    if (!query) {
      searchMessage.textContent = "Please enter a search term.";
      return;
    }

    const searchableSections = [
      ...document.querySelectorAll("main section")
    ];

    const match = searchableSections.find(function (section) {
      return section.textContent.toLowerCase().includes(query);
    });

    if (match) {
      searchMessage.textContent = "A matching section was found.";
      match.scrollIntoView({ behavior: "smooth", block: "start" });
    } else {
      searchMessage.textContent =
        "No matching section found. Try another keyword.";
    }
  });

  // Newsletter form
  const newsletterForm = document.getElementById("newsletterForm");
  const newsletterMessage = document.getElementById("newsletterMessage");

  newsletterForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
      newsletterMessage.textContent = "Please enter your email address.";
      return;
    }

    newsletterMessage.textContent =
      "Thank you! The form works, but newsletter signup needs a connected service.";

    newsletterForm.reset();
  });

  // Cookie consent
  const cookieBanner = document.getElementById("cookieBanner");
  const acceptCookies = document.getElementById("acceptCookies");
  const declineCookies = document.getElementById("declineCookies");

  // This remembers the choice in the current browser.
  // Connect a proper consent-management tool for production use.
  let cookieChoice = null;

  try {
    cookieChoice = localStorage.getItem("suntrust-cookie-choice");
  } catch (error) {
    // Storage may be unavailable in some browsing environments.
  }

  if (!cookieChoice) {
    cookieBanner.hidden = false;
  }

  function saveCookieChoice(choice) {
    try {
      localStorage.setItem("suntrust-cookie-choice", choice);
    } catch (error) {
      // The banner can still be dismissed if storage is unavailable.
    }

    cookieBanner.hidden = true;
  }

  acceptCookies.addEventListener("click", function () {
    saveCookieChoice("accepted");
  });

  declineCookies.addEventListener("click", function () {
    saveCookieChoice("declined");
  });

  // Back to top
  const backToTop = document.getElementById("backToTop");

  window.addEventListener("scroll", function () {
    backToTop.classList.toggle("visible", window.scrollY > 400);
  });

  backToTop.addEventListener("click", function () {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  });
});
