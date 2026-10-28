
const $ = (id) => document.getElementById(id);

$("year").textContent = new Date().getFullYear();

$("menuToggle").addEventListener("click", () => {
  $("mainNav").classList.toggle("open");
});

document.querySelectorAll("#mainNav a").forEach((a) => {
  a.addEventListener("click", () => {
    $("mainNav").classList.remove("open");
  });
});

$("priceSearch").addEventListener("click", () => {
  const type = $("deviceType").value;
  const model = $("model").value.trim();
  const repair = $("repair").value;

  if (!type || !model || !repair) {
    $("priceResult").textContent =
      "Συμπλήρωσε κατηγορία, μοντέλο και επισκευή για να ζητήσεις εκτίμηση.";
    return;
  }

  $("priceResult").textContent =
    `Για ${type} ${model} — ${repair}: δεν έχει καταχωριστεί ακόμη τιμή. Στείλε αίτημα για εκτίμηση.`;

  const form = $("contactForm");
  form.elements.namedItem("details").value =
    `Μοντέλο: ${model}\nΕπισκευή: ${repair}`;
  form.elements.namedItem("device").value = type;

  location.hash = "contact";
});

const EMAIL_ENDPOINT =
  "https://script.google.com/macros/s/AKfycbyuswjFC21E378sA36DZ_vnu4j9RCRM6k2iy41r2k6iEFe4WDO3kI3vZVjUUeSKODNMHA/exec";

$("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.currentTarget;
  if (!form.reportValidity()) return;

  const note = $("formNote");
  const button = form.querySelector('button[type="submit"]');
  const originalText = button.textContent;

  const payload = {
    name: form.elements.namedItem("name").value.trim(),
    reply: form.elements.namedItem("reply").value.trim(),
    device: form.elements.namedItem("device").value.trim(),
    details: form.elements.namedItem("details").value.trim(),
    source: "TechXpert website"
  };

  if (!payload.name || !payload.reply ||
      !payload.device || !payload.details) {
    note.textContent = "Συμπλήρωσε όλα τα απαραίτητα πεδία.";
    note.setAttribute("role", "alert");
    return;
  }

  button.disabled = true;
  button.textContent = "Αποστολή…";
  note.textContent = "Γίνεται υποβολή του αιτήματος…";
  note.setAttribute("role", "status");

  try {
    await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      headers: {
        "Content-Type": "text/plain;charset=UTF-8"
      },
      body: JSON.stringify(payload)
    });

    note.textContent =
      "Το αίτημα υποβλήθηκε προς επεξεργασία. Η παράδοση του email δεν έχει επιβεβαιωθεί ακόμη.";
    form.reset();
  } catch (error) {
    console.error("TechXpert submission error:", error);
    note.textContent =
      "Δεν ήταν δυνατή η υποβολή. Δοκίμασε ξανά ή κάλεσε το 698 136 5735.";
    note.setAttribute("role", "alert");
  } finally {
    button.disabled = false;
    button.textContent = originalText;
  }
});

document.querySelectorAll(".contact-placeholder").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Επικοινώνησε με την TechXpert στο 698 136 5735.");
  });
});
