
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mainNav = document.getElementById("mainNav");
  const searchInput = document.getElementById("propertySearch");
  const typeFilter = document.getElementById("propertyType");
  const locationFilter = document.getElementById("propertyLocation");
  const resetButton = document.getElementById("resetFilters");
  const emptyReset = document.getElementById("emptyReset");
  const propertyCards = Array.from(
    document.querySelectorAll(".property-card")
  );
  const resultsCount = document.getElementById("resultsCount");
  const emptyState = document.getElementById("emptyState");
  const propertyGrid = document.getElementById("propertyGrid");
  const currentYear = document.getElementById("currentYear");

  if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
  }

  // Mobile navigation.
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

  // Property search and filters.
  function filterProperties() {
    const searchTerm = searchInput.value.trim().toLowerCase();
    const selectedType = typeFilter.value;
    const selectedLocation = locationFilter.value;
    let visibleCount = 0;

    propertyCards.forEach((card) => {
      const name = card.dataset.name.toLowerCase();
      const type = card.dataset.type;
      const location = card.dataset.location;

      const matchesSearch = name.includes(searchTerm);
      const matchesType =
        selectedType === "all" ||
        type === selectedType ||
        type === "all";
      const matchesLocation =
        selectedLocation === "all" ||
        location === selectedLocation;

      const isVisible =
        matchesSearch && matchesType && matchesLocation;

      card.hidden = !isVisible;

      if (isVisible) {
        visibleCount++;
      }
    });

    resultsCount.textContent =
      `Showing ${visibleCount} of ${propertyCards.length} properties`;

    emptyState.hidden = visibleCount !== 0;
    propertyGrid.hidden = visibleCount === 0;
  }

  function resetFilters() {
    searchInput.value = "";
    typeFilter.value = "all";
    locationFilter.value = "all";
    filterProperties();
  }

  searchInput.addEventListener("input", filterProperties);
  typeFilter.addEventListener("change", filterProperties);
  locationFilter.addEventListener("change", filterProperties);
  resetButton.addEventListener("click", resetFilters);
  emptyReset.addEventListener("click", resetFilters);

  // Allow enquiry links to prefill the contact form's property field.
  const propertyLinks = document.querySelectorAll(
    'a[href^="contact.html?property="]'
  );

  propertyLinks.forEach((link) => {
    link.addEventListener("click", () => {
      // The property name is passed in the URL for contact.html to read.
      // No form data is sent by this page.
    });
  });

  filterProperties();
});
