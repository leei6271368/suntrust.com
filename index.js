document.addEventListener("DOMContentLoaded", () => {
  const $ = s => document.querySelector(s);
  const $$ = s => Array.from(document.querySelectorAll(s));

  $("#year").textContent = new Date().getFullYear();
  $("#today").textContent = new Date().toLocaleDateString("en-PH", {
    day: "numeric",
    month: "short",
    year: "numeric"
  });

  // Mobile sidebar
  const sidebar = $("#sidebar");

  $("#menuToggle").addEventListener("click", () => {
    sidebar.classList.toggle("open");
  });

  $$(".nav-link").forEach(a => {
    a.addEventListener("click", () => {
      $$(".nav-link").forEach(n => n.classList.remove("active"));
      a.classList.add("active");

      if (innerWidth <= 980) {
        sidebar.classList.remove("open");
      }
    });
  });

  document.addEventListener("click", e => {
    if (
      innerWidth <= 980 &&
      sidebar.classList.contains("open") &&
      !sidebar.contains(e.target) &&
      !$("#menuToggle").contains(e.target)
    ) {
      sidebar.classList.remove("open");
    }
  });

  // Sales and lead charts
  let salesChart;

  if (window.Chart) {
    salesChart = new Chart($("#salesChart"), {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        datasets: [{
          data: [2.8, 3.4, 3.1, 4.6, 4.2, 5.3,
            4.8, 6.1, 5.5, 6.8, 6.4, 7.5],
          borderColor: "#287451",
          backgroundColor: "rgba(40,116,81,.09)",
          fill: true,
          tension: 0.38,
          borderWidth: 2,
          pointRadius: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false }
        },
        scales: {
          x: {
            grid: { display: false },
            ticks: { color: "#9aa39d", font: { size: 9 } }
          },
          y: {
            beginAtZero: true,
            grid: { color: "#edf1ed" },
            ticks: {
              color: "#9aa39d",
              font: { size: 9 },
              callback: v => "₱" + v + "M"
            }
          }
        }
      }
    });

    new Chart($("#leadChart"), {
      type: "doughnut",
      data: {
        labels: ["Website", "Referrals", "Social media", "Other"],
        datasets: [{
          data: [42, 28, 20, 10],
          backgroundColor: [
            "#367a58",
            "#d5ad60",
            "#76a6d4",
            "#d9dfda"
          ],
          borderWidth: 0
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: "76%",
        plugins: {
          legend: { display: false }
        }
      }
    });

    $("#chartPeriod").addEventListener("change", e => {
      if (e.target.value === "half") {
        salesChart.data.labels = [
          "May", "Jun", "Jul", "Aug", "Sep", "Oct"
        ];
        salesChart.data.datasets[0].data = [
          4.2, 5.3, 4.8, 6.1, 5.5, 6.8
        ];
      } else {
        salesChart.data.labels = [
          "Jan", "Feb", "Mar", "Apr", "May", "Jun",
          "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];
        salesChart.data.datasets[0].data = [
          2.8, 3.4, 3.1, 4.6, 4.2, 5.3,
          4.8, 6.1, 5.5, 6.8, 6.4, 7.5
        ];
      }

      salesChart.update();
    });
  }

  // Search and filter properties
  const body = $("#propertyTable");
  const searchInputs = [
    $("#propertySearch"),
    $("#globalSearch")
  ];

  function filterRows() {
    const query = searchInputs
      .map(i => i.value.trim().toLowerCase())
      .find(Boolean) || "";

    const status = $("#statusFilter").value;
    let shown = 0;

    Array.from(body.rows).forEach(row => {
      const match =
        row.textContent.toLowerCase().includes(query) &&
        (status === "all" || row.dataset.status === status);

      row.hidden = !match;

      if (match) shown++;
    });

    $("#tableCount").textContent =
      `Showing ${shown} ${shown === 1 ? "development" : "developments"}`;
  }

  searchInputs.forEach(input => {
    input.addEventListener("input", () => {
      searchInputs.forEach(other => {
        if (other !== input) other.value = input.value;
      });

      filterRows();
    });
  });

  $("#statusFilter").addEventListener("change", filterRows);

  $("#resetBtn").addEventListener("click", () => {
    searchInputs.forEach(i => i.value = "");
    $("#statusFilter").value = "all";
    filterRows();
  });

  $("#viewAllBtn")?.addEventListener("click", () => {
    searchInputs.forEach(i => i.value = "");
    $("#statusFilter").value = "all";
    filterRows();
  });

  filterRows();

  // Add-property modal
  const modal = $("#modal");
  const form = $("#propertyForm");

  const close = () => {
    modal.classList.remove("show");
    modal.setAttribute("aria-hidden", "true");
  };

  $("#addBtn").addEventListener("click", () => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
    $("#newName").focus();
  });

  $("#closeModal").addEventListener("click", close);
  $("#cancelModal").addEventListener("click", close);

  modal.addEventListener("click", e => {
    if (e.target === modal) close();
  });

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") close();
  });

  const badgeClass = {
    "Available": "available",
    "Pre-selling": "pre",
    "Sold Out": "sold",
    "Maintenance": "maintenance"
  };

  // Add recent activity
  function addActivity(title, detail) {
    const item = document.createElement("div");
    item.className = "activity";

    const icon = document.createElement("i");
    icon.className = "activity-dot green-dot";
    icon.textContent = "⌂";

    const text = document.createElement("span");
    const b = document.createElement("b");
    b.textContent = title;

    const small = document.createElement("small");
    small.textContent = detail + " · Just now";

    text.append(b, small);
    item.append(icon, text);

    $("#activityList").prepend(item);
  }

  // Submit new property
  form.addEventListener("submit", e => {
    e.preventDefault();

    const name = $("#newName").value.trim();
    const location = $("#newLocation").value.trim();
    const type = $("#newType").value;
    const status = $("#newStatus").value;

    if (!name || !location) return;

    const row = document.createElement("tr");
    row.dataset.status = status;

    const first = document.createElement("td");
    const wrap = document.createElement("div");
    wrap.className = "property-name";

    const thumb = document.createElement("span");
    thumb.className = "thumb t1";
    thumb.textContent = name
      .split(/\s+/)
      .slice(0, 2)
      .map(w => w[0])
      .join("")
      .toUpperCase();

    const info = document.createElement("span");
    const b = document.createElement("b");
    const small = document.createElement("small");

    b.textContent = name;
    small.textContent = type;

    info.append(b, small);
    wrap.append(thumb, info);
    first.append(wrap);

    const loc = document.createElement("td");
    loc.textContent = location;

    const ty = document.createElement("td");
    ty.textContent = type;

    const st = document.createElement("td");
    const badge = document.createElement("span");
    badge.className = "badge " + badgeClass[status];
    badge.textContent = status;
    st.append(badge);

    const inquiries = document.createElement("td");
    inquiries.textContent = "0";

    const more = document.createElement("td");
    more.textContent = "•••";

    row.append(first, loc, ty, st, inquiries, more);
    body.prepend(row);

    const count = Number($("#totalProperties").textContent) + 1;
    $("#totalProperties").textContent = count;
    $("#navCount").textContent = count;

    form.reset();
    close();
    filterRows();

    addActivity("New property added", name + " · " + location);
  });

  // Export property report as CSV
  $("#exportBtn").addEventListener("click", () => {
    const rows = Array.from(body.rows).filter(r => !r.hidden);

    const data = [
      ["Property", "Location", "Type", "Status", "Inquiries"],
      ...rows.map(r => [
        r.cells[0].innerText.replace(/\n/g, " ").trim(),
        r.cells[1].innerText,
        r.cells[2].innerText,
        r.cells[3].innerText,
        r.cells[4].innerText
      ])
    ];

    const csv = data.map(row =>
      row.map(v => '"' + String(v).replace(/"/g, '""') + '"').join(",")
    ).join("\n");

    const url = URL.createObjectURL(
      new Blob([csv], { type: "text/csv;charset=utf-8;" })
    );

    const link = document.createElement("a");
    link.href = url;
    link.download = "suntrust-property-report.csv";
    link.click();

    URL.revokeObjectURL(url);
  });

  // Demo notification button
  $("#notify").addEventListener("click", () => {
    alert("Demo notifications: buyer inquiries and pending operations tasks.");
  });

  // Add an appointment
  $("#addAppointment").addEventListener("click", () => {
    const title = prompt("Enter appointment title:");

    if (!title || !title.trim()) return;

    const item = document.createElement("div");
    item.className = "appointment";

    const date = document.createElement("span");
    date.className = "day";

    const d = document.createElement("b");
    d.textContent = new Date().getDate();

    const m = document.createElement("small");
    m.textContent = new Date()
      .toLocaleDateString("en", { month: "short" })
      .toUpperCase();

    date.append(d, m);

    const info = document.createElement("span");
    const b = document.createElement("b");
    const small = document.createElement("small");

    b.textContent = title.trim();
    small.textContent = "New appointment · Added locally";

    info.append(b, small);

    const time = document.createElement("time");
    time.textContent = "To be set";

    item.append(date, info, time);
    $("#appointments").prepend(item);

    addActivity("Appointment added", title.trim());
  });
});
