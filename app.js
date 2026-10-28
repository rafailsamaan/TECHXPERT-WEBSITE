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
$("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  $("formNote").textContent = "Η φόρμα συμπληρώθηκε, αλλά δεν έχει συνδεθεί ακόμη με email ή βάση δεδομένων. Πριν δημοσιευτεί, θα συνδέσουμε ασφαλή αποστολή αιτημάτων.";
});
document.querySelectorAll(".contact-placeholder").forEach(a => a.addEventListener("click", e => {e.preventDefault(); alert("Θα ενεργοποιηθεί μόλις προστεθούν τα πραγματικά στοιχεία επικοινωνίας της TechXpert.");}));
