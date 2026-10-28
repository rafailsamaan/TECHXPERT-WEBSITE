const $ = (id) => document.getElementById(id);
$("year").textContent = new Date().getFullYear();
$("menuToggle").addEventListener("click", () => $("mainNav").classList.toggle("open"));
document.querySelectorAll("#mainNav a").forEach(a => a.addEventListener("click", () => $("mainNav").classList.remove("open")));
$("priceSearch").addEventListener("click", () => {
  const type = $("deviceType").value, model = $("model").value.trim(), repair = $("repair").value;
  if (!type || !model || !repair) {
    $("priceResult").textContent = "Συμπλήρωσε κατηγορία, μοντέλο και επισκευή. Θα προστεθεί τιμή μόλις καταχωριστεί ο τιμοκατάλογος.";
    return;
  }
  $("priceResult").textContent = `Για ${type} ${model} — ${repair}: δεν έχει καταχωριστεί ακόμη τιμή. Στείλε αίτημα για εκτίμηση.`;
  const details = `Κατηγορία: ${type}%0AΜοντέλο: ${encodeURIComponent(model)}%0AΕπισκευή: ${encodeURIComponent(repair)}`;
  $("contactForm").elements.details.value = `Μοντέλο: ${model}\nΕπισκευή: ${repair}`;
  $("contactForm").elements.device.value = type;
  location.hash = "contact";
});
// Βάλε εδώ το Web App URL που θα πάρεις από το Google Apps Script.
// Μην βάλεις ποτέ API keys ή μυστικά στοιχεία στο app.js.
const EMAIL_ENDPOINT = "https://script.google.com/macros/s/AKfycbyuswjFC21E378sA36DZ_vnu4j9RCRM6k2iy41r2k6iEFe4WDO3kI3vZVjUUeSKODNMHA/exec";


$("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();

  const form = e.currentTarget;

  if (!form.reportValidity()) return;

  const note = $("formNote");
  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerText;

  // Διαβάζουμε απευθείας τα πεδία της φόρμας.
  const params = new URLSearchParams();

  params.set("name", form.elements.name?.value?.trim() || "");
  params.set("reply", form.elements.reply?.value?.trim() || "");
  params.set("device", form.elements.device?.value?.trim() || "");
  params.set("details", form.elements.details?.value?.trim() || "");
  params.set("source", "TechXpert website");

  // Προσωρινός έλεγχος πριν από την αποστολή.
  if (
    !params.get("name") ||
    !params.get("reply") ||
    !params.get("device") ||
    !params.get("details")
  ) {
    note.textContent =
      "Συμπλήρωσε όλα τα απαραίτητα πεδία της φόρμας.";
    note.setAttribute("role", "alert");
    return;
  }

  submitButton.disabled = true;
  submitButton.innerText = "Αποστολή…";
  note.textContent = "Γίνεται υποβολή του αιτήματος…";
  note.setAttribute("role", "status");

  try {
    await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: params
    });

    note.textContent =
      "Το αίτημα στάλθηκε προς επεξεργασία. Έλεγξε το email σου για επιβεβαίωση από την TechXpert.";
    form.reset();
  } catch (err) {
    console.error("TechXpert form error:", err);

    note.textContent =
      "Δεν ήταν δυνατή η αποστολή. Δοκίμασε ξανά ή επικοινώνησε στο 698 136 5735.";
    note.setAttribute("role", "alert");
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = originalButtonText;
  }
});

document.querySelectorAll(".contact-placeholder").forEach(a => a.addEventListener("click", e => {e.preventDefault(); alert("Θα ενεργοποιηθεί μόλις προστεθούν τα πραγματικά στοιχεία επικοινωνίας της TechXpert.");}));
