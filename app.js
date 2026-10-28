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
const EMAIL_ENDPOINT = "https://script.google.com/macros/s/AKfycbwbfKG90YcqHvgvH50EgV19Uq6PAMbY18viGfzgwP4s9-VWbtslDE-sumsmZvVAtnKMAA/exec";

$("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.currentTarget;
  if (!form.reportValidity()) return;

 if (
  !EMAIL_ENDPOINT.startsWith("https://script.google.com/macros/s/") ||
  EMAIL_ENDPOINT.endsWith("/YOUR_DEPLOYMENT_ID/exec")
) {
  const note = $("formNote");
  note.textContent = "Η φόρμα δεν έχει συνδεθεί ακόμη. Έλεγξε τη ρύθμιση του Google Apps Script.";
  note.setAttribute("role", "alert");
  return;
}

  const data = new FormData(form);
  const params = new URLSearchParams();
  ["name", "reply", "device", "details"].forEach((key) => params.set(key, String(data.get(key) || "").trim()));
  params.set("source", "TechXpert website");

  const submitButton = form.querySelector('button[type="submit"]');
  const originalButtonText = submitButton.innerText;
  submitButton.disabled = true;
  submitButton.innerText = "Αποστολή…";
  const note = $("formNote");
  note.textContent = "Γίνεται υποβολή του αιτήματος…";
  note.setAttribute("role", "status");

  try {
    // Apps Script Web Apps redirect their response cross-origin. no-cors permits
    // a simple form-encoded POST, but the browser cannot inspect the response.
    await fetch(EMAIL_ENDPOINT, {
      method: "POST",
      mode: "no-cors",
      body: params
    });
    note.textContent = "Το αίτημα υποβλήθηκε προς αποστολή. Επειδή ο browser δεν μπορεί να επιβεβαιώσει την παράδοση του email, έλεγξε το techxpertgr@gmail.com και τον φάκελο ανεπιθύμητων μετά τη δοκιμή.";
    form.reset();
  } catch (err) {
    note.textContent = "Δεν ήταν δυνατή η υποβολή του αιτήματος. Δοκίμασε ξανά ή επικοινώνησε στο 698 136 5735.";
    note.setAttribute("role", "alert");
  } finally {
    submitButton.disabled = false;
    submitButton.innerText = originalButtonText;
  }
});
document.querySelectorAll(".contact-placeholder").forEach(a => a.addEventListener("click", e => {e.preventDefault(); alert("Θα ενεργοποιηθεί μόλις προστεθούν τα πραγματικά στοιχεία επικοινωνίας της TechXpert.");}));
