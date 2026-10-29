
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

// Brand and model lists for the repair estimator.
const catalogue = {
  Smartphone: {
    Apple: ["iPhone 16 Pro Max", "iPhone 16 Pro", "iPhone 16", "iPhone 15 Pro Max", "iPhone 15 Pro", "iPhone 15", "iPhone 14 Pro Max", "iPhone 14 Pro", "iPhone 14", "iPhone 13 Pro Max", "iPhone 13 Pro", "iPhone 13", "iPhone 12", "iPhone 11", "Άλλο / δεν εμφανίζεται"],
    Samsung: ["Galaxy S25 Ultra", "Galaxy S25", "Galaxy S24 Ultra", "Galaxy S24", "Galaxy S23", "Galaxy A56", "Galaxy A55", "Galaxy A35", "Galaxy A25", "Galaxy A15", "Άλλο / δεν εμφανίζεται"],
    Xiaomi: ["Redmi Note 14 Pro", "Redmi Note 14", "Redmi Note 13 Pro", "Redmi Note 13", "Redmi 13", "Poco X7 Pro", "Poco X6", "Άλλο / δεν εμφανίζεται"],
    Huawei: ["Pura 70", "P60 Pro", "Nova 12", "P30 Pro", "Άλλο / δεν εμφανίζεται"],
    Google: ["Pixel 9 Pro", "Pixel 9", "Pixel 8 Pro", "Pixel 8", "Άλλο / δεν εμφανίζεται"],
    OnePlus: ["OnePlus 13", "OnePlus 12", "Nord 4", "Άλλο / δεν εμφανίζεται"],
    Motorola: ["Edge 50", "Moto G85", "Moto G54", "Άλλο / δεν εμφανίζεται"],
    Άλλη: ["Άλλο / δεν εμφανίζεται"]
  },
  Tablet: {
    Apple: ["iPad Pro", "iPad Air", "iPad mini", "iPad (10ης γενιάς)", "Άλλο / δεν εμφανίζεται"],
    Samsung: ["Galaxy Tab S10", "Galaxy Tab S9", "Galaxy Tab A9", "Άλλο / δεν εμφανίζεται"],
    Lenovo: ["Tab P12", "Tab M11", "Άλλο / δεν εμφανίζεται"],
    Xiaomi: ["Pad 7", "Redmi Pad Pro", "Άλλο / δεν εμφανίζεται"],
    Huawei: ["MatePad 11", "MatePad SE", "Άλλο / δεν εμφανίζεται"],
    Άλλη: ["Άλλο / δεν εμφανίζεται"]
  },
  Laptop: {
    Apple: ["MacBook Air", "MacBook Pro", "Άλλο / δεν εμφανίζεται"],
    ASUS: ["Zenbook", "Vivobook", "ROG", "TUF Gaming", "Άλλο / δεν εμφανίζεται"],
    Acer: ["Aspire", "Swift", "Nitro", "Predator", "Άλλο / δεν εμφανίζεται"],
    Lenovo: ["ThinkPad", "IdeaPad", "Yoga", "Legion", "Άλλο / δεν εμφανίζεται"],
    HP: ["Pavilion", "Envy", "Victus", "Omen", "ProBook", "Άλλο / δεν εμφανίζεται"],
    Dell: ["XPS", "Inspiron", "Latitude", "G Series", "Άλλο / δεν εμφανίζεται"],
    MSI: ["Modern", "Katana", "Thin", "Raider", "Άλλο / δεν εμφανίζεται"],
    Microsoft: ["Surface Laptop", "Surface Pro", "Άλλο / δεν εμφανίζεται"],
    Άλλη: ["Άλλο / δεν εμφανίζεται"]
  },
  Desktop: {
    Custom: ["Συναρμολογημένος υπολογιστής", "Άλλο / δεν εμφανίζεται"],
    ASUS: ["Desktop PC", "Άλλο / δεν εμφανίζεται"],
    HP: ["Pavilion Desktop", "ProDesk", "Άλλο / δεν εμφανίζεται"],
    Dell: ["OptiPlex", "XPS Desktop", "Άλλο / δεν εμφανίζεται"],
    Lenovo: ["ThinkCentre", "IdeaCentre", "Άλλο / δεν εμφανίζεται"],
    Άλλη: ["Άλλο / δεν εμφανίζεται"]
  },
  Κονσόλα: {
    Sony: ["PlayStation 5", "PlayStation 5 Slim", "PlayStation 4 Pro", "PlayStation 4", "Άλλο / δεν εμφανίζεται"],
    Microsoft: ["Xbox Series X", "Xbox Series S", "Xbox One X", "Xbox One S", "Άλλο / δεν εμφανίζεται"],
    Nintendo: ["Nintendo Switch OLED", "Nintendo Switch", "Nintendo Switch Lite", "Άλλο / δεν εμφανίζεται"],
    Άλλη: ["Άλλο / δεν εμφανίζεται"]
  }
};

function fillSelect(select, placeholder, values) {
  select.replaceChildren(new Option(placeholder, ""));
  values.forEach(value => select.add(new Option(value, value)));
}

const typeSelect = $("deviceType");
const brandSelect = $("brand");
const modelSelect = $("model");
const customModelWrap = $("customModelWrap");
const customModel = $("customModel");

 typeSelect.addEventListener("change", () => {
  const brands = Object.keys(catalogue[typeSelect.value] || {});
  fillSelect(brandSelect, brands.length ? "Επίλεξε μάρκα" : "Πρώτα επίλεξε κατηγορία", brands);
  brandSelect.disabled = !brands.length;
  fillSelect(modelSelect, "Πρώτα επίλεξε μάρκα", []);
  modelSelect.disabled = true;
  customModelWrap.hidden = true;
  customModel.value = "";
});

brandSelect.addEventListener("change", () => {
  const models = (catalogue[typeSelect.value] || {})[brandSelect.value] || [];
  fillSelect(modelSelect, "Επίλεξε μοντέλο", models);
  modelSelect.disabled = !models.length;
  customModelWrap.hidden = true;
  customModel.value = "";
});

modelSelect.addEventListener("change", () => {
  const isOther = modelSelect.value === "Άλλο / δεν εμφανίζεται";
  customModelWrap.hidden = !isOther;
  customModel.required = isOther;
  if (!isOther) customModel.value = "";
});

let publicPrices = [];
let pricesLoaded = false;

async function loadPublicPrices() {
  try {
    const response = await fetch('/api/prices', { cache: 'no-store' });
    if (!response.ok) throw new Error('Could not load prices');
    const data = await response.json();
    publicPrices = Array.isArray(data.prices) ? data.prices : [];
    pricesLoaded = true;
  } catch (error) {
    console.warn('TechXpert price list could not be loaded:', error);
    publicPrices = [];
    pricesLoaded = false;
  }
}
loadPublicPrices();

function moneyFromCents(cents) {
  return new Intl.NumberFormat('el-GR', { style: 'currency', currency: 'EUR' }).format(cents / 100);
}

$('priceSearch').addEventListener('click', async () => {
  const type = typeSelect.value;
  const brand = brandSelect.value;
  const selectedModel = modelSelect.value;
  const model = selectedModel === 'Άλλο / δεν εμφανίζεται' ? customModel.value.trim() : selectedModel;
  const repair = $('repair').value;

  if (!type || !brand || !selectedModel || !model || !repair) {
    $('priceResult').textContent = 'Επίλεξε κατηγορία, μάρκα, μοντέλο και επισκευή.';
    return;
  }

  await loadPublicPrices();
  const match = publicPrices.find(p =>
    p.deviceType === type && p.brand === brand && p.model === model && p.repair === repair && p.active
  );

  if (match) {
    $('priceResult').textContent = `Ενδεικτική τιμή για ${brand} ${model} — ${repair}: ${moneyFromCents(match.priceCents)}${match.note ? ' · ' + match.note : ''}`;
  } else {
    $('priceResult').textContent = `Δεν έχει καταχωριστεί ακόμη τιμή για ${brand} ${model} — ${repair}. Στείλε αίτημα για εκτίμηση.`;
  }

  const form = $('contactForm');
  form.elements.namedItem('details').value = `Μάρκα: ${brand}\nΜοντέλο: ${model}\nΕπισκευή: ${repair}${match ? '\nΕνδεικτική τιμή ιστοσελίδας: ' + moneyFromCents(match.priceCents) : '\nΤιμή: κατόπιν εκτίμησης'}`;
  form.elements.namedItem('device').value = type;
  location.hash = 'contact';
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
