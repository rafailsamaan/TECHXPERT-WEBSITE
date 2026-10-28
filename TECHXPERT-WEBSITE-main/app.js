
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

// Apps Script receives regular form fields through e.parameter.
// A hidden iframe lets the browser submit cross-origin without fetch/CORS.
let techxpertFrame = document.getElementById("techxpertSubmitFrame");
if (!techxpertFrame) {
  techxpertFrame = document.createElement("iframe");
  techxpertFrame.name = "techxpertSubmitFrame";
  techxpertFrame.id = "techxpertSubmitFrame";
  techxpertFrame.hidden = true;
  techxpertFrame.setAttribute("aria-hidden", "true");
  document.body.appendChild(techxpertFrame);
}

$("contactForm").addEventListener("submit", (e) => {
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

  if (!payload.name || !payload.reply || !payload.device || !payload.details) {
    note.textContent = "Συμπλήρωσε όλα τα απαραίτητα πεδία.";
    note.setAttribute("role", "alert");
    return;
  }

  button.disabled = true;
  button.textContent = "Αποστολή…";
  note.textContent = "Γίνεται αποστολή του αιτήματος…";
  note.setAttribute("role", "status");

  // Build a normal POST form so Apps Script receives e.parameter fields.
  const postForm = document.createElement("form");
  postForm.method = "POST";
  postForm.action = EMAIL_ENDPOINT;
  postForm.target = "techxpertSubmitFrame";
  postForm.acceptCharset = "UTF-8";
  postForm.style.display = "none";

  Object.entries(payload).forEach(([name, value]) => {
    const input = document.createElement("input");
    input.type = "hidden";
    input.name = name;
    input.value = value;
    postForm.appendChild(input);
  });

  document.body.appendChild(postForm);
  postForm.submit();
  postForm.remove();

  note.textContent =
    "Το αίτημα στάλθηκε για επεξεργασία. Η παράδοση του email δεν επιβεβαιώνεται από τη σελίδα. Αν δεν υπάρξει επικοινωνία, κάλεσε στο 698 136 5735.";
  // Keep the user's entries visible in case they need to retry or call.
  window.setTimeout(() => {
    button.disabled = false;
    button.textContent = originalText;
  }, 3000);
});

document.querySelectorAll(".contact-placeholder").forEach((a) => {
  a.addEventListener("click", (e) => {
    e.preventDefault();
    alert("Επικοινώνησε με την TechXpert στο 698 136 5735.");
  });
});
