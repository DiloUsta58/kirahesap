const months = [
  "Ocak","Şubat","Mart","Nisan",
  "Mayıs","Haziran","Temmuz","Ağustos",
  "Eylül","Ekim","Kasım","Aralık"
];

const STORAGE_KEY = "kiraTableData";
const APP_VERSION = "1.1.0";
const RELEASE_DATE = "23.04.2026";
const VERSION_JSON_URL = "https://dilousta58.github.io/kirahesap/version.json";
const VERSION_KEY = "kira_tablo_app_version";

const data = [
  { year: 2023, base: 5000, percent: 0 },
  { year: 2024, base: null, percent: 25 },
  { year: 2025, base: null, percent: 58.51 },
  { year: 2026, base: null, percent: 0 },
  { year: 2027, base: null, percent: 0 },
  { year: 2028, base: null, percent: 0 },
  { year: 2029, base: null, percent: 0 }
];

const DEFAULT_DATA = JSON.parse(JSON.stringify(data));
const CURRENT_YEAR = new Date().getFullYear();


const table = document.getElementById("table");
const thead = table.querySelector("thead");
const tbody = table.querySelector("tbody");
const tfoot = table.querySelector("tfoot");

const pageTitle = document.getElementById("pageTitle");
const menuBtn = document.getElementById("menuBtn");
const appMenu = document.getElementById("appMenu");
const backupFileInput = document.getElementById("backupFileInput");
const pageNames = {
  tufePage: "TÜFE Kira Hesaplama",
  sozlesmePage: "Konut Kira Sözleşmesi"
};

const CONTRACT_KEY = "kiraContractData";
const PREVIEW_SIZE_KEY = "kiraPreviewSize";
const contractDefaults = {
  cityDistrict: "",
  parcelNo: "",
  apartmentNo: "",
  neighborhood: "",
  street: "",
  outerDoorNo: "",
  propertyType: "",
  usagePurpose: "",
  fixtures: "",
  address: "",
  contractType: "belirsiz",
  startDate: "",
  endDate: "",
  landlord1Name: "",
  landlord1Tc: "",
  landlord1Address: "",
  landlord2Name: "",
  landlord2Tc: "",
  landlord2Address: "",
  tenantName: "",
  tenantTc: "",
  tenantAddress: "",
  tenantFamilyCount: "",
  iban: "",
  bankName: "",
  bankOwner: "",
  rentAmount: "",
  yearlyRent: "",
  depositAmount: "",
  paymentType: "aylik",
  paymentDay: "",
  terminationNotice: "1 ay",
  guarantorName: "",
  guarantorTc: "",
  guarantorAddress: "",
  city: "",
  signDate: "",
  tenantSignature: "",
  landlordSignature: "",
  tenantSignature1: "",
  tenantSignature2: "",
  landlordSignature1: "",
  landlordSignature2: ""
};

const contractSections = [
  {
    title: "Konut adresi",
    fields: [
      { key: "cityDistrict", label: "İl / İlçesi", placeholder: "Ör: Sivas" },
      { key: "parcelNo", label: "Ada / Parsel No.", placeholder: "Ör: 1235/05" },
      { key: "apartmentNo", label: "Bina (Blok) No / İç Kapı No.", placeholder: "Ör: A Blok / 3" },
      { key: "neighborhood", label: "Mahallesi", placeholder: "Ör: Emek Mahallesi" },
      { key: "street", label: "Sokağı", placeholder: "Ör: Örnek Caddesi" },
      { key: "outerDoorNo", label: "Dış kapı numarası", placeholder: "Ör: 26/3" }
    ]
  },
  {
    title: "Konut detayları",
    fields: [
      { key: "propertyType", label: "Kiralanan şeyin cinsi", placeholder: "Ör: Konut" },
      { key: "usagePurpose", label: "Kullanım amacı", placeholder: "Ör: Konut (ikamet)" },
      { key: "fixtures", label: "Demirbaşlar", type: "textarea" },
      { key: "address", label: "Ek adres / açıklama", type: "textarea" }
    ]
  },
  {
    title: "Süre",
    fields: [
      { key: "contractType", label: "Sözleşme süresi", type: "select", options: [["belirsiz", "Belirsiz süreli"], ["belirli", "Belirli tarihe kadar"]] },
      { key: "startDate", label: "Başlangıç tarihi", type: "date" },
      { key: "endDate", label: "Bitiş tarihi", type: "date" }
    ]
  },
  {
    title: "Kiracı bilgileri",
    fields: [
      { key: "tenantName", label: "Kiracı adı soyadı", placeholder: "Ör: Sıla Erdem" },
      { key: "tenantTc", label: "T.C. kimlik no", placeholder: "Ör: 12345678900" },
      { key: "tenantAddress", label: "Eski adres", type: "textarea" },
      { key: "tenantFamilyCount", label: "Kiracı sayısı / aile", type: "number", placeholder: "Ör: 1" }
    ]
  },
  {
    title: "Kiralayan bilgileri",
    fields: [
      { key: "landlord1Name", label: "1. kiralayan adı soyadı", placeholder: "Ör: Kiraya veren adı" },
      { key: "landlord1Tc", label: "1. kiralayan T.C. no", placeholder: "Ör: 12345678900" },
      { key: "landlord1Address", label: "1. kiralayan adres", type: "textarea" },
      { key: "landlord2Name", label: "2. kiralayan adı soyadı", placeholder: "Opsiyonel" },
      { key: "landlord2Tc", label: "2. kiralayan T.C. no", placeholder: "Opsiyonel" },
      { key: "landlord2Address", label: "2. kiralayan adres", type: "textarea" }
    ]
  },
  {
    title: "Kira bedeli",
    fields: [
      { key: "rentAmount", label: "Aylık kira bedeli", type: "text", readonly: true },
      { key: "yearlyRent", label: "Bir senelik kira karşılığı", type: "text", readonly: true },
      { key: "depositAmount", label: "Depozito", type: "number", placeholder: "Ör: 30000" }
    ]
  },
  {
    title: "Ödeme bilgileri",
    fields: [
      { key: "paymentType", label: "Ödeme şekli", type: "select", options: [["aylik", "Aylık"], ["ucaylik", "3 aylık"]] },
      { key: "paymentDay", label: "Kiranın ne zaman ödeneceği", placeholder: "Ör: Her ayın 15. günü" },
      { key: "bankName", label: "Kiranın Ödeneceği Banka Adı", placeholder: "Ör: Ziraat Bankası" },
      { key: "iban", label: "IBAN / hesap no", placeholder: "TR..." }
    ]
  },
  {
    title: "Fesih, kefil ve imza",
    fields: [
      { key: "terminationNotice", label: "Fesih bildirim süresi", placeholder: "Ör: 1 ay" },
      { key: "guarantorName", label: "Kefil adı soyadı", placeholder: "Opsiyonel" },
      { key: "guarantorTc", label: "Kefil T.C. no", placeholder: "Opsiyonel" },
      { key: "guarantorAddress", label: "Kefil adresi", type: "textarea" },
      { key: "city", label: "İmza yeri", placeholder: "Ör: Sivas" },
      { key: "signDate", label: "İmza tarihi", type: "date" }
    ]
  }
];

let contractData = loadContractData();
let activeContractKey = "";
let contractFormStep = 0;

const tr = v =>
  Number(v).toLocaleString("tr-TR", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });




function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function loadData() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    const parsed = JSON.parse(saved);
    parsed.forEach((row, i) => {
      if (data[i]) {
        data[i].percent = row.percent;
        data[i].base = row.base;
      }
    });
  }
}

/* Speicherfunktionen */
function saveData() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}


function loadData() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);

    if (!saved) {
      data.length = 0;
      DEFAULT_DATA.forEach(r => data.push(structuredClone(r)));
      return;
    }

    const parsed = JSON.parse(saved);

    if (!Array.isArray(parsed)) {
      throw new Error("Invalid data");
    }

    data.length = 0;
    parsed.forEach(row => data.push(row));

  } catch (e) {
    console.warn("Depolama bozuk - varsayılan değerler yüklendi");

    data.length = 0;
    DEFAULT_DATA.forEach(r => data.push(structuredClone(r)));
  }
}



function build() {
  loadData();

  thead.innerHTML = `
    <tr><th colspan="15" class="title">
      Sivas  Kira Ödeme Durumu
    </th></tr>
    <tr>
      <th>Yıl</th>
      ${months.map(m=>`<th>${m}</th>`).join("")}
      <th>Toplam</th><th>TÜFE Kira Artış Oranı:</th>
    </tr>
  `;

  tfoot.innerHTML = `
    <tr>
      <td></td>
        <td colspan="12" class="total">Toplam:</td>
        <td id="grandTotal" class="total"></td> 
        <td class="print-cell">
          <button onclick="printTable()">🖨 YAZDIR</button>
        </td>
    </tr>
  `;

  recalc();
}

function loadContractData() {
  try {
    const saved = JSON.parse(localStorage.getItem(CONTRACT_KEY)) || {};
    const merged = { ...contractDefaults, ...saved };

    if (!merged.bankName && merged.bankOwner) {
      merged.bankName = merged.bankOwner;
    }
    if (!merged.tenantSignature1 && merged.tenantSignature) {
      merged.tenantSignature1 = merged.tenantSignature;
    }
    if (!merged.landlordSignature1 && merged.landlordSignature) {
      merged.landlordSignature1 = merged.landlordSignature;
    }

    return merged;
  } catch {
    return { ...contractDefaults };
  }
}

function buildSozlesmePage() {
  const form = document.getElementById("sozlesmeForm");
  if (!form) return;

  if (!form.children.length) {
    form.innerHTML = contractSections.map((section, index) => `
      <section class="form-section" data-form-step="${index}">
        <h2>${section.title}</h2>
        ${section.fields.map(fieldTemplate).join("")}
      </section>
    `).join("") + signaturePadTemplate(contractSections.length) + `
      <div class="form-step-nav">
        <button id="prevFormStep" type="button">&lt; Geri</button>
        <span id="formStepInfo"></span>
        <button id="nextFormStep" type="button">İleri &gt;</button>
      </div>
    `;

    form.addEventListener("input", handleContractInput);
    form.addEventListener("change", handleContractInput);
    form.addEventListener("focusin", event => {
      activeContractKey = event.target.dataset.contract || "";
      renderContract();
      scrollPreviewToActiveField();
    });
    form.addEventListener("focusout", event => {
      if (event.target.dataset.contract === activeContractKey) {
        activeContractKey = "";
        renderContract();
      }
    });
    document.getElementById("printContractBtn").addEventListener("click", printContract);
    document.getElementById("prevFormStep").addEventListener("click", () => showContractStep(contractFormStep - 1));
    document.getElementById("nextFormStep").addEventListener("click", () => showContractStep(contractFormStep + 1));
    initSignaturePads();
    initPreviewResize();
    showContractStep(contractFormStep);
  }

  renderContract();
}

function initPreviewResize() {
  const layout = document.querySelector(".sozlesme-layout");
  const handle = document.getElementById("previewResizeHandle");
  if (!layout || !handle || handle.dataset.ready === "true") return;
  handle.dataset.ready = "true";

  const saved = Number(localStorage.getItem(PREVIEW_SIZE_KEY));
  if (Number.isFinite(saved) && saved >= 30 && saved <= 78) {
    layout.style.setProperty("--preview-percent", `${saved}%`);
  }

  let dragging = false;

  function setFromPointer(event) {
    const rect = layout.getBoundingClientRect();
    if (window.matchMedia("(orientation: landscape)").matches) {
      return;
    }
    const previewPercent = ((rect.bottom - event.clientY) / rect.height) * 100;
    const clamped = Math.max(30, Math.min(78, previewPercent));
    layout.style.setProperty("--preview-percent", `${clamped}%`);
    localStorage.setItem(PREVIEW_SIZE_KEY, String(Math.round(clamped)));
  }

  handle.addEventListener("pointerdown", event => {
    dragging = true;
    handle.setPointerCapture?.(event.pointerId);
    setFromPointer(event);
  });

  handle.addEventListener("pointermove", event => {
    if (dragging) setFromPointer(event);
  });

  handle.addEventListener("pointerup", () => {
    dragging = false;
  });

  handle.addEventListener("pointercancel", () => {
    dragging = false;
  });
}

function signaturePadTemplate(index) {
  return `
    <section class="form-section signature-pad-section" data-form-step="${index}">
      <h2>Touch imza</h2>
      <div class="signature-pad-grid">
        <div class="signature-pad-group">
          <div class="signature-pad-title">KİRACI</div>
          <div class="signature-pad-block">
            <div class="signature-pad-subtitle">KİRACI imza 1</div>
            <canvas class="signature-pad" data-signature="tenantSignature1"></canvas>
            <button type="button" class="clear-signature" data-clear-signature="tenantSignature1">Temizle</button>
          </div>
          <div class="signature-pad-block">
            <div class="signature-pad-subtitle">KİRACI imza 2</div>
            <canvas class="signature-pad" data-signature="tenantSignature2"></canvas>
            <button type="button" class="clear-signature" data-clear-signature="tenantSignature2">Temizle</button>
          </div>
        </div>
        <div class="signature-pad-group">
          <div class="signature-pad-title">KİRAYA VEREN</div>
          <div class="signature-pad-block">
            <div class="signature-pad-subtitle">KİRAYA VEREN imza 1</div>
            <canvas class="signature-pad" data-signature="landlordSignature1"></canvas>
            <button type="button" class="clear-signature" data-clear-signature="landlordSignature1">Temizle</button>
          </div>
          <div class="signature-pad-block">
            <div class="signature-pad-subtitle">KİRAYA VEREN imza 2</div>
            <canvas class="signature-pad" data-signature="landlordSignature2"></canvas>
            <button type="button" class="clear-signature" data-clear-signature="landlordSignature2">Temizle</button>
          </div>
        </div>
      </div>
    </section>
  `;
}

function showContractStep(nextStep) {
  const steps = Array.from(document.querySelectorAll("#sozlesmeForm .form-section"));
  if (!steps.length) return;

  contractFormStep = Math.max(0, Math.min(nextStep, steps.length - 1));
  steps.forEach((section, index) => {
    section.classList.toggle("active-step", index === contractFormStep);
  });

  const prev = document.getElementById("prevFormStep");
  const next = document.getElementById("nextFormStep");
  const info = document.getElementById("formStepInfo");
  if (prev) prev.disabled = contractFormStep === 0;
  if (next) next.disabled = contractFormStep === steps.length - 1;
  if (info) info.textContent = `${contractFormStep + 1} / ${steps.length}`;

  document.querySelectorAll(".signature-pad").forEach(canvas => {
    if (typeof canvas.resizeSignaturePad === "function") {
      canvas.resizeSignaturePad();
    }
  });
}

function scrollPreviewToActiveField() {
  if (!activeContractKey) return;

  requestAnimationFrame(() => {
    const preview = document.getElementById("contractPreview");
    const target = preview?.querySelector(`[data-preview-key="${activeContractKey}"], [data-preview-keys~="${activeContractKey}"]`);
    if (!preview || !target) return;

    const previewRect = preview.getBoundingClientRect();
    const targetRect = target.getBoundingClientRect();
    const offset = targetRect.top - previewRect.top + preview.scrollTop - 80;
    preview.scrollTo({
      top: Math.max(0, offset),
      behavior: "smooth"
    });
  });
}

function initSignaturePads() {
  document.querySelectorAll(".signature-pad").forEach(canvas => {
    setupSignaturePad(canvas);
  });

  document.querySelectorAll("[data-clear-signature]").forEach(button => {
    button.addEventListener("click", () => {
      const key = button.dataset.clearSignature;
      contractData[key] = "";
      localStorage.setItem(CONTRACT_KEY, JSON.stringify(contractData));
      const canvas = document.querySelector(`.signature-pad[data-signature="${key}"]`);
      if (canvas) clearSignatureCanvas(canvas);
      renderContract();
    });
  });
}

function setupSignaturePad(canvas) {
  const key = canvas.dataset.signature;
  const ctx = canvas.getContext("2d");
  let drawing = false;

  function resizeCanvas() {
    const ratio = window.devicePixelRatio || 1;
    const width = canvas.clientWidth || 280;
    const height = canvas.clientHeight || 120;
    canvas.width = Math.floor(width * ratio);
    canvas.height = Math.floor(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    ctx.lineWidth = 2.4;
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.strokeStyle = "#111";
    restoreSignature(canvas);
  }
  canvas.resizeSignaturePad = resizeCanvas;

  function point(event) {
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }

  function start(event) {
    event.preventDefault();
    drawing = true;
    canvas.setPointerCapture?.(event.pointerId);
    const p = point(event);
    ctx.beginPath();
    ctx.moveTo(p.x, p.y);
  }

  function move(event) {
    if (!drawing) return;
    event.preventDefault();
    const p = point(event);
    ctx.lineTo(p.x, p.y);
    ctx.stroke();
  }

  function end() {
    if (!drawing) return;
    drawing = false;
    contractData[key] = canvas.toDataURL("image/png");
    localStorage.setItem(CONTRACT_KEY, JSON.stringify(contractData));
    renderContract();
  }

  canvas.addEventListener("pointerdown", start);
  canvas.addEventListener("pointermove", move);
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();
}

function clearSignatureCanvas(canvas) {
  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function restoreSignature(canvas) {
  const signature = contractData[canvas.dataset.signature];
  clearSignatureCanvas(canvas);
  if (!signature) return;
  const ctx = canvas.getContext("2d");
  const img = new Image();
  img.onload = () => {
    ctx.drawImage(img, 0, 0, canvas.clientWidth || 280, canvas.clientHeight || 120);
  };
  img.src = signature;
}

function fieldTemplate(field) {
  const value = field.readonly ? readonlyContractValue(field.key) : (contractData[field.key] || "");
  const placeholder = field.placeholder ? ` placeholder="${field.placeholder}"` : "";
  const readonly = field.readonly ? " readonly" : "";
  if (field.type === "textarea") {
    return `<label>${field.label}<textarea data-contract="${field.key}"${placeholder}>${value}</textarea></label>`;
  }
  if (field.type === "select") {
    return `
      <label>${field.label}
        <select data-contract="${field.key}">
          ${field.options.map(([key, label]) => `<option value="${key}" ${value === key ? "selected" : ""}>${label}</option>`).join("")}
        </select>
      </label>
    `;
  }
  return `<label>${field.label}<input data-contract="${field.key}" type="${field.type || "text"}" value="${value}"${placeholder}${readonly}></label>`;
}

function handleContractInput(event) {
  const key = event.target.dataset.contract;
  if (!key) return;
  contractData[key] = event.target.value;
  localStorage.setItem(CONTRACT_KEY, JSON.stringify(contractData));
  renderContract();
}

function formatDate(value) {
  if (!value) return "____.__.____";
  const date = new Date(`${value}T00:00:00`);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("tr-TR");
}

function val(key, fallback = "________") {
  return contractData[key] && String(contractData[key]).trim() ? contractData[key] : fallback;
}

function currentMayRentValue() {
  let previousBase = null;
  for (let i = 0; i < data.length; i++) {
    const row = data[i];
    if (i > 0 && (row.base === null || row.base === undefined || row.base === "")) {
      row.base = previousBase * (1 + data[i - 1].percent / 100);
    }
    previousBase = row.base;
    if (row.year === CURRENT_YEAR) {
      return row.base * (1 + row.percent / 100);
    }
  }
  const last = data[data.length - 1];
  return last ? last.base * (1 + last.percent / 100) : 0;
}

function readonlyContractValue(key) {
  const monthly = currentMayRentValue();
  if (key === "rentAmount") return currencyValue(monthly);
  if (key === "yearlyRent") return currencyValue(monthly * 12);
  return "";
}

function fill(key, fallback = "________") {
  const active = key === activeContractKey ? " active-fill" : "";
  return `<span class="contract-fill${active}" data-preview-key="${key}">${val(key, fallback)}</span>`;
}

function fillText(text, keys) {
  const keyList = Array.isArray(keys) ? keys : [keys];
  const active = keyList.includes(activeContractKey) ? " active-fill" : "";
  return `<span class="contract-fill${active}" data-preview-keys="${keyList.join(" ")}">${text}</span>`;
}

function currencyValue(value) {
  const parsed = Number(String(value).replace(",", "."));
  return Number.isFinite(parsed) ? `${tr(parsed)} ₺ (TL)` : value;
}

function money(key, fallback = "0") {
  const raw = key === "rentAmount" ? currentMayRentValue() : val(key, fallback);
  const parsed = Number(String(raw).replace(",", "."));
  return Number.isFinite(parsed) ? currencyValue(parsed) : raw;
}

function yearlyRentValue() {
  return currencyValue(currentMayRentValue() * 12);
}

function renderContract() {
  const preview = document.getElementById("contractPreview");
  if (!preview) return;
  syncReadonlyContractFields();

  const durationText = contractData.contractType === "belirli"
    ? `${formatDate(contractData.startDate)} - ${formatDate(contractData.endDate)}`
    : "Belirsiz süreli";
  const paymentText = contractData.paymentType === "ucaylik" ? "3 aylık" : "Aylık";
  const landlordInfo = `${val("landlord1Name")} / ${val("landlord1Tc")}`;
  const landlord2Info = `${val("landlord2Name")} / ${val("landlord2Tc")}`;
  const tenantInfo = `${val("tenantName")} / ${val("tenantTc")}`;
  const guarantorInfo = `${val("guarantorName", "")} ${val("guarantorTc", "") ? `/ ${val("guarantorTc")}` : ""} ${val("guarantorAddress", "") ? `/ ${val("guarantorAddress")}` : ""}`.trim() || "________";
  const hasSecondLandlord = ["landlord2Name", "landlord2Tc", "landlord2Address"].some(key => val(key, "") !== "");
  const hasGuarantor = ["guarantorName", "guarantorTc", "guarantorAddress"].some(key => val(key, "") !== "");
  const tenantSignature1 = contractData.tenantSignature1 ? `<img class="contract-signature-img" src="${contractData.tenantSignature1}" alt="Kiracı imza 1">` : `<div class="contract-signature-placeholder"></div>`;
  const tenantSignature2 = contractData.tenantSignature2 ? `<img class="contract-signature-img" src="${contractData.tenantSignature2}" alt="Kiracı imza 2">` : `<div class="contract-signature-placeholder"></div>`;
  const landlordSignature1 = contractData.landlordSignature1 ? `<img class="contract-signature-img" src="${contractData.landlordSignature1}" alt="Kiraya veren imza 1">` : `<div class="contract-signature-placeholder"></div>`;
  const landlordSignature2 = contractData.landlordSignature2 ? `<img class="contract-signature-img" src="${contractData.landlordSignature2}" alt="Kiraya veren imza 2">` : `<div class="contract-signature-placeholder"></div>`;
  const signatureBlock = `
    <div class="signature-grid ${hasGuarantor ? "" : "without-guarantor"}">
      <div class="signature-party">
        <b>KİRACI</b>
        <span class="signature-party-name">${fill("tenantName")}</span>
        <div class="signature-entry">
          <small>İmza</small>
          ${tenantSignature1}
        </div>
        <div class="signature-entry">
          <small>İmza</small>
          ${tenantSignature2}
        </div>
      </div>
      ${hasGuarantor ? `<div class="signature-party guarantor-party"><b>MÜTESELSİL BORÇLU VE KEFİL</b><span class="signature-party-name">${fill("guarantorName", "")}</span><div class="signature-entry"><small>İmza</small><div class="contract-signature-placeholder"></div></div></div>` : ""}
      <div class="signature-party">
        <b>KİRAYA VEREN</b>
        <span class="signature-party-name">${fill("landlord1Name")}</span>
        <div class="signature-entry">
          <small>İmza</small>
          ${landlordSignature1}
        </div>
        <div class="signature-entry">
          <small>İmza</small>
          ${landlordSignature2}
        </div>
      </div>
    </div>
  `;
  const renderConditionTable = items => `
    <table class="conditions-table">
      <colgroup>
        <col class="condition-number-col">
        <col class="condition-text-col">
      </colgroup>
      <tbody>
        ${items.map((item, index) => `<tr><th class="condition-number">${index + 1}</th><td class="condition-text">${item}</td></tr>`).join("")}
      </tbody>
    </table>
  `;
  const rentConditionAmount = fillText(money("rentAmount"), "rentAmount");
  const depositConditionAmount = fillText(money("depositAmount", "________,- TL"), "depositAmount");
  const bankNameText = fill("bankName", "________");
  const bankAccountText = fill("iban", "TR XXXX XXXX XXXX XXXX XXXX");
  const courtCityText = fill("city", "XXXXXXXXX");
  const generalConditions = [
    "Kiracı, kiralananı özenle kullanmak zorundadır.",
    "Kiracı, kiralananda ve çevrede oturanlara iyi niyet kuralları içinde davranmaya zorunludur.",
    "Kiracı, kiralananı kısmen veya tamamen üçüncü kişilere kiralayamaz, alt kiraya veremez; devir ve temlik edemez.",
    "Kiracı, kiralayanın yazılı izni olmadıkça kiralananda değişiklik yapamaz; aksi halde doğacak zararı karşılamak zorundadır.",
    "Üçüncü kişilerin kiralanan üzerinde hak iddia etmeleri halinde, kiracı durumu derhal kiralayana haber vermek zorundadır.",
    "Kiracı, kiralananda yapılması gereken onarımları derhal kiralayana bildirmek zorundadır; aksi halde doğacak zarardan sorumludur.",
    "Kiracı, kat malikleri kurulunca kendisine tebliğ edilen hususları kiralayana haber vermek zorundadır.",
    "Kiracı, kat malikleri kurulu kararı uyarınca yapılması gereken işlere izin vermek zorundadır.",
    "Kiracı, kiralanandaki olağan kullanımdan doğan onarımları yapmak/yaptırmak ve giderlerini karşılamak zorundadır.",
    "Kiralananın mülkiyet hakkından doğan vergileri kiralayana, kullanımdan doğan vergi, resim ve harçları kiracıya aittir.",
    "Kiracı, kira sözleşmesinin sonunda kiralananı aldığı şekilde kiralayana teslim etmek zorundadır.",
    "Kiralananın iyi ve kullanılmaya elverişli halde teslim edildiği asıldır. Aksi durum kiracı tarafından ispatlanmak zorundadır.",
    "Kiralanan şeye ait yakıt, elektrik, su bedelleri ve kapıcı ücreti kiracıya aittir.",
    "Kiracı, doğal gaz, elektrik ve su idaresi ile ayrı sözleşmeler yapıp sayaçları kendi şahsı üzerine geçirecektir.",
    "Takip eden yıllarda kiracılık devam ettikçe kira bedeline her yeni yıl için TÜİK yıllık değişim TÜFE endeksi oranında zam yapılacaktır.",
    "Kiracı, sözleşmenin sona ermesi veya satılığa çıkarılması halinde kiralananın gezilmesine ve incelenmesine izin vermek zorundadır.",
    "Kiralananın boşaltılması gerektiği halde boşaltılmaması durumunda doğacak zararlardan kiracı sorumludur.",
    "Kiracı, sağlığı için ciddi tehlike oluşturmayan kusurlardan dolayı kiralananı teslim almaktan kaçınamaz ve sözleşmeyi bozamaz.",
    "Kiracı, kiralanana yaptığı faydalı ve lüks şeylerin bedelini isteyemez; sözleşme bitiminde bunları kiralayana teslim eder.",
    "Kiracı, kiralayanın icazetini almak ve giderleri kendisine ait olmak üzere genel anten, uydu anteni ve kablo televizyon donanımı yaptırabilir.",
    "İşbu sözleşmede yer almayan hususlarda 6098 sayılı Türk Borçlar Kanunu ve ilgili mevzuat hükümleri uygulanır."
  ];
  const specialConditions = [
    "Kiralanan alt kiraya verilemez, ortak alınamaz; devir ve temlik edilemez.",
    "Kiralanan, mesken dışında herhangi bir amaçla kullanılamaz.",
    "Kiralananda, kiracı ve ailesinin dışında kimse sürekli olarak kalamaz.",
    "Kiracı yönetim planı, işletme planı, site /bina yönetim kurulu kararları, kat malikleri kurulu kararları ve sair düzenlemeler gibi tüm kurallara uymakla yükümlüdür. Kiracının bu kurallara uymaması fesih ve tahliye nedenidir.",
    `Kira bedelleri (${rentConditionAmount}), her ayın onbeşinci günü akşamına kadar, kiralayanın ${bankNameText} nezdindeki ${bankAccountText} numaralı hesabına yatırılacaktır. Kira parasının başka bir şubeden havale edilmesi halinde, aynı süre içinde hesapta olacak şekilde işlem yaptırılacak olup, aksi durumda temerrüt hükümleri uygulanacaktır.`,
    "Bir ayın kira bedelinin ödenmemesi halinde dönem sonuna kadar işleyecek kira bedellerinin tümü muacceliyet kazanacaktır. Kiracı bu muacceliyet hükmünün sonuçlarını bildiğini ve hiçbir itirazı olmadığını şimdiden kabul ve beyan eder.",
    "Kiralananın kapıcı/kaloriferci, bina aidat, yakıt ve genel giderleri ile çevre temizlik vergileri kiracı tarafından ödenecektir.",
    "Kapılar, pencereler, sıhhî tesisat araçları sağlam, tam ve kullanılmaya elverişli olarak teslim edilmiştir.",
    "Kiracı, kiralananı özenle kullanacak; kiralayan da gerekli onarımları, kiracının uyarısından itibaren on gün içinde -teknik imkansızlıklar hariç- yaptıracaktır.",
    "Kiracı, elektrik, su ve doğalgaz aboneliklerini kendi adına yaptıracak, sözleşme sonunda hesabı kestirerek, buna ilişkin makbuz fotokopisini kiralayana verecektir.",
    "Kiracı, en geç bir hafta içinde, aile beyannamesini mahalle muhtarlığına verecektir.",
    "Kira süresi 1 yıldır. Ancak, kira dönemi sonundan en az 15 gün evvel taraflar sözleşmeyi yenilemeyeceğini bildirmedikçe kira sözleşmesi otomatik olarak 1 yıl daha uzar.",
    "Kira sözleşmesinin otomatik uzaması durumunda kira bedeli, TUİK tarafından açıklanan ve bir önceki yılın aynı ayına göre hesaplanan ÜFE & TÜFE oranının ortalaması kadar artırılacaktır.",
    `Kiracı, kiralayana 2 kira bedeli (${depositConditionAmount}) teminat (depozito) bedeli ödeyecektir. Kira sözleşmesi sona erdiği zaman kiralananda ve demirbaşlarda herhangi bir zararziyan, aidat, elektrik, doğalgaz, su gibi, ayrıca kira bedeline ve genel giderlere ait bir borç olmadığı tespit edildiğinde, kiralayan teminatı kiracıya aynen iade etmeyi; eğer zarar ziyan ve borçların bulunması halinde ise, kiracı zarar ve borç miktarının teminatlardan mahsup edileceğini peşinen kabul ederler. Kiracı, hiçbir şekilde teminatı kiraya mahsup edemez.`,
    "Kiracı ilk bir yıllık kira dönemi hariç olmak kaydıyla, otomatik uzayan kira dönemleri içinde 2 (iki) ay önceden kiralayana yazılı olarak bildirmek şartıyla kira sözleşmesini feshetme ve kiralananı tahliye etme hakkına sahiptir.",
    "Kefilin kefaleti müteselsil olup kira kontratı süresince devam eder ve kiracının iş bu sözleşme ile mal sahibine karşı yüklediği tüm edimleri içerir. Kefilin sorumluluğu, işbu kira sözleşmesinin imzasından itibaren en fazla 3 (üç) yıl ve en fazla 18 (onsekiz) aylık kira bedeliyle sınırlıdır.",
    `Sözleşmeden doğacak uyuşmazlıklardan dolayı, ${courtCityText}. Mahkemeleri ve icra müdürlükleri yetkili olacaktır.`
  ];

  preview.innerHTML = `
    <section class="contract-page preview-page">
      <h1>KİRA SÖZLEŞMESİ</h1>
      <table class="contract-info-table">
        <tbody>
          <tr><th>İl/İlçesi</th><td>${fill("cityDistrict")}</td></tr>
          <tr><th>Ada/Parsel No.</th><td>${fill("parcelNo")}</td></tr>
          <tr><th>Bina (Blok) No / İç Kapı No.</th><td>${fill("apartmentNo")}</td></tr>
          <tr><th>Mahallesi</th><td>${fill("neighborhood")}</td></tr>
          <tr><th>Sokağı</th><td>${fill("street")}</td></tr>
          <tr><th>Dış Kapı Numarası</th><td>${fill("outerDoorNo")}</td></tr>
          <tr><th>Kiralanan Şeyin Cinsi</th><td>${fill("propertyType")}</td></tr>
          <tr><th>Kiraya Verenin Adı Soyadı/T.C. Kimlik No.</th><td>${fillText(landlordInfo, ["landlord1Name", "landlord1Tc"])}</td></tr>
          <tr><th>Kiraya Verenin Adresi</th><td>${fill("landlord1Address")}</td></tr>
          ${hasSecondLandlord ? `<tr><th>2. Kiraya Verenin Adı Soyadı/T.C. Kimlik No.</th><td>${fillText(landlord2Info, ["landlord2Name", "landlord2Tc"])}</td></tr>
          <tr><th>2. Kiraya Verenin Adresi</th><td>${fill("landlord2Address")}</td></tr>` : ""}
          <tr><th>Kiracının Adı Soyadı/T.C. Kimlik No.</th><td>${fillText(tenantInfo, ["tenantName", "tenantTc"])}</td></tr>
          <tr><th>Kiracının İkametgahı</th><td>${fill("tenantAddress")}</td></tr>
          ${hasGuarantor ? `<tr><th>Garanti ve Müşterek Müteselsil Kefilin Adı Soyadı/T.C. Kimlik No./Adresi</th><td>${fillText(guarantorInfo, ["guarantorName", "guarantorTc", "guarantorAddress"])}</td></tr>` : ""}
          <tr><th>Bir Senelik Kira Karşılığı</th><td>${fillText(yearlyRentValue(), ["yearlyRent", "rentAmount"])}</td></tr>
          <tr><th>Bir Aylık Kira Karşılığı</th><td>${fillText(money("rentAmount"), "rentAmount")}</td></tr>
          <tr><th>Depozito</th><td>${fillText(money("depositAmount", "________"), "depositAmount")}</td></tr>
          <tr><th>Kira Müddeti</th><td>${fillText(durationText, ["contractType", "startDate", "endDate"])}</td></tr>
          <tr><th>Kiranın Ne Zaman Ödeneceği</th><td>${fill("paymentDay")}</td></tr>
          <tr><th>Kiranın Ödeneceği Banka Adı ve IBAN numarası</th><td><div class="contract-bank-lines"><div>${fill("landlord1Name")}</div><div>${fill("bankName")}</div><div>${fill("iban")}</div></div></td></tr>
          <tr><th>Kiranın Başlangıcı</th><td>${fillText(formatDate(contractData.startDate), "startDate")}</td></tr>
          <tr><th>Kiralananda Bulunan Demirbaşlar</th><td>${fill("fixtures", "")}</td></tr>
          <tr><th>Kiralananın Hangi Amaçla Kullanılacağı</th><td>${fill("usagePurpose")}</td></tr>
        </tbody>
      </table>
      <div class="print-only-signatures">${signatureBlock}</div>
    </section>

    <section class="contract-page general-conditions-page">
      <h2 class="condition-title">GENEL KOŞULLAR</h2>
      ${renderConditionTable(generalConditions)}
      <div class="print-only-signatures">${signatureBlock}</div>
    </section>

    <section class="contract-page special-conditions-page">
      <h2 class="condition-title">ÖZEL KOŞULLAR</h2>
      ${renderConditionTable(specialConditions)}
      <p class="contract-note">İşbu Sözleşme 21 (yirmi bir) genel ve 17 (onyedi) özel koşuldan ibaret olup KİRACI ve KİRAYA VEREN tarafından tam olarak okunup anlaşıldıktan sonra ${fillText(formatDate(contractData.signDate), "signDate")} tarihinde 2 (iki) nüsha olarak imza altına alınmıştır.</p>
      ${signatureBlock}
    </section>
  `;
}

function syncReadonlyContractFields() {
  document.querySelectorAll("[data-contract='rentAmount']").forEach(input => {
    input.value = readonlyContractValue("rentAmount");
  });
  document.querySelectorAll("[data-contract='yearlyRent']").forEach(input => {
    input.value = readonlyContractValue("yearlyRent");
  });
}

function printContract() {
  document.body.classList.add("print-contract");
  const preview = document.getElementById("contractPreview");
  if (preview) preview.scrollTop = 0;
  window.scrollTo(0, 0);

  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      if (preview && window.AndroidKira && typeof window.AndroidKira.printHtml === "function") {
        const printHtml = `<!doctype html>
<html lang="tr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <link rel="stylesheet" href="css/style.css">
  <title>Konut Kira Sözleşmesi</title>
</head>
<body class="print-contract">
  <main>
    <section id="sozlesmePage" class="app-page sozlesme-page active">
      <div class="sozlesme-layout">
        <article class="contract-preview">${preview.innerHTML}</article>
      </div>
    </section>
  </main>
</body>
</html>`;
        window.AndroidKira.printHtml(printHtml);
      } else if (window.AndroidKira && typeof window.AndroidKira.printPage === "function") {
        window.AndroidKira.printPage();
      } else {
        window.print();
      }
      setTimeout(() => document.body.classList.remove("print-contract"), 1500);
    });
  });
}

function buildBackupPayload() {
  return {
    app: "KiraTablo",
    version: 1,
    exportedAt: new Date().toISOString(),
    kiraTableData: data,
    contractData
  };
}

function exportAllAppData() {
  try {
    saveData();
    localStorage.setItem(CONTRACT_KEY, JSON.stringify(contractData));
    const payload = buildBackupPayload();
    const stamp = new Date().toISOString().slice(0, 10);
    const filename = `kira_tablo_backup_${stamp}.json`;
    const json = JSON.stringify(payload, null, 2);

    if (window.AndroidKira && typeof window.AndroidKira.saveDataFile === "function") {
      window.AndroidKira.saveDataFile(json, filename);
      return;
    }

    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch {
    alert("Kaydetme başarısız oldu.");
  }
}

function importAllAppData() {
  const file = backupFileInput.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    try {
      const imported = JSON.parse(String(reader.result || "").trim().replace(/^\uFEFF/, ""));
      const importedTable = imported.kiraTableData || imported.data;
      const importedContract = imported.contractData || imported.contract;

      if (!Array.isArray(importedTable) || typeof importedContract !== "object" || importedContract === null) {
        throw new Error("Invalid backup");
      }

      data.length = 0;
      importedTable.forEach(row => data.push({
        year: Number(row.year),
        base: row.base === null || row.base === "" ? null : Number(row.base),
        percent: Number(row.percent || 0)
      }));

      contractData = { ...contractDefaults, ...importedContract };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      localStorage.setItem(CONTRACT_KEY, JSON.stringify(contractData));

      const form = document.getElementById("sozlesmeForm");
      if (form) form.innerHTML = "";
      buildSozlesmePage();
      recalc();
      alert("Veriler yüklendi.");
    } catch {
      alert("Dosya yüklenemedi.");
    } finally {
      backupFileInput.value = "";
    }
  };
  reader.readAsText(file);
}

function closeMenu() {
  appMenu.classList.remove("open");
  menuBtn.setAttribute("aria-expanded", "false");
}

function showPage(pageId) {
  document.querySelectorAll(".app-page").forEach(page => {
    page.classList.toggle("active", page.id === pageId);
  });

  document.querySelectorAll(".menu-item").forEach(item => {
    item.classList.toggle("active", item.dataset.page === pageId);
  });

  pageTitle.textContent = pageNames[pageId] || "";
  if (pageId === "sozlesmePage") buildSozlesmePage();
  closeMenu();
}

menuBtn.addEventListener("click", () => {
  const isOpen = appMenu.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(isOpen));
});

appMenu.addEventListener("click", event => {
  const item = event.target.closest(".menu-item");
  if (!item) return;
  if (item.dataset.page) {
    showPage(item.dataset.page);
    return;
  }
  if (item.dataset.action === "saveData") {
    exportAllAppData();
    closeMenu();
    return;
  }
  if (item.dataset.action === "loadData") {
    backupFileInput.click();
    closeMenu();
  }
});

backupFileInput.addEventListener("change", importAllAppData);

document.addEventListener("click", event => {
  if (!appMenu.contains(event.target) && !menuBtn.contains(event.target)) {
    closeMenu();
  }
});

function printTable() {
    if (window.AndroidKira && typeof window.AndroidKira.printPage === "function") {
      window.AndroidKira.printPage();
      return;
    }
    window.print();
}

function updateAppInfoFooter() {
  const versionEl = document.getElementById("footerVersion");
  const releaseEl = document.getElementById("footerReleaseDate");
  const statusEl = document.getElementById("updateStatus");

  if (versionEl) versionEl.textContent = `Sürüm: ${APP_VERSION}`;
  if (releaseEl) releaseEl.textContent = `Güncelleme tarihi: ${RELEASE_DATE}`;
  if (statusEl) {
    statusEl.textContent = "Güncelleme kontrolü";
    statusEl.className = "version-checking";
  }
}

function compareVersions(a, b) {
  const left = String(a || "0").split(".").map(part => parseInt(part, 10) || 0);
  const right = String(b || "0").split(".").map(part => parseInt(part, 10) || 0);
  const len = Math.max(left.length, right.length);
  for (let i = 0; i < len; i++) {
    const diff = (left[i] || 0) - (right[i] || 0);
    if (diff !== 0) return diff;
  }
  return 0;
}

function showUpdateNotice(localVersion, serverVersion, changelog, apkUrl) {
  document.querySelector(".update-notice")?.remove();
  const box = document.createElement("div");
  box.className = "update-notice";
  box.innerHTML = `
    <div class="update-box">
      <h3>Yeni sürüm mevcut</h3>
      <p>Yüklü sürüm: <b>${localVersion}</b></p>
      <p>Sunucu sürümü: <b>${serverVersion}</b></p>
      ${changelog ? `<p>Değişiklikler: ${changelog}</p>` : ""}
      <div class="update-actions">
        <button id="updateNowBtn" type="button">Şimdi güncelle</button>
        <button id="updateLaterBtn" class="secondary" type="button">Daha sonra</button>
      </div>
    </div>
  `;
  document.body.appendChild(box);

  document.getElementById("updateLaterBtn").onclick = () => box.remove();
  document.getElementById("updateNowBtn").onclick = () => {
    if (!apkUrl) {
      alert("version.json içinde APK indirme adresi bulunamadı.");
      return;
    }
    box.style.pointerEvents = "none";
    box.style.opacity = "0";
    box.style.visibility = "hidden";
    const statusEl = document.getElementById("updateStatus");
    if (statusEl) {
      statusEl.textContent = "Güncelleme başlatıldı";
      statusEl.className = "version-checking";
    }
    window.setTimeout(() => {
      box.remove();
      if (window.AndroidKira && typeof window.AndroidKira.downloadAndInstallApk === "function") {
        window.AndroidKira.downloadAndInstallApk(apkUrl);
        return;
      }
      window.location.href = apkUrl;
    }, 120);
  };
}

async function checkServerVersion() {
  const statusEl = document.getElementById("updateStatus");
  updateAppInfoFooter();

  try {
    const res = await fetch(VERSION_JSON_URL, { cache: "no-store" });
    if (!res.ok) throw new Error("version.json erişilemiyor");
    const data = await res.json();
    const serverVersion = data.version;
    if (!serverVersion) throw new Error("sürüm bilgisi eksik");

    if (compareVersions(serverVersion, APP_VERSION) <= 0) {
      if (statusEl) {
        statusEl.textContent = "Güncel";
        statusEl.className = "version-ok";
      }
      localStorage.setItem(VERSION_KEY, APP_VERSION);
      return;
    }

    if (statusEl) {
      statusEl.textContent = "Güncelleme mevcut";
      statusEl.className = "version-outdated";
    }
    showUpdateNotice(APP_VERSION, serverVersion, data.changelog, data.apkUrl);
  } catch {
    if (statusEl) {
      statusEl.textContent = "Güncelleme çevrimdışı";
      statusEl.className = "version-checking";
    }
  }
}


document.addEventListener("click", function (e) {
  if (e.target && e.target.id === "addYearBtn") {
    addYear();
  }

  if (e.target.id === "removeYearBtn") {
    removeYear();
  }  
});

function addYear() {
  const last = data[data.length - 1];

  
  if (data.length > 10) {
    alert("ℹ️ Maximale Anzahl von Jahr(en) erreicht (10 Jahre) !");
    return;
  }

  data.push({
    year: last.year + 1,
    base: null,
    percent: last.percent
  });

  recalc();
  saveData();
}

function removeYear() {
  if (data.length <= 7) {
    alert("ℹ️ Mindestens Standart Jahr(e) müssen vorhanden sein!");
    return;
  }


  data.pop();     // letztes Jahr entfernen
  recalc();
  saveData();
}


function recalc() {
  for (let i=1;i<data.length;i++) {
    if (data[i].base===null) {
      data[i].base = data[i-1].base * (1 + data[i-1].percent/100);
    }
  }

  tbody.innerHTML = "";
  let grand = 0;


  const now = new Date();
  const CURRENT_YEAR = now.getFullYear();
  const CURRENT_MONTH_INDEX = now.getMonth(); // 0 = Ocak

    data.forEach((row, i) => {
      const oldV = row.base;
      const newV = oldV * (1 + row.percent / 100);
      const isLast = i === data.length - 1;

        const isCurrentYear = row.year === CURRENT_YEAR;

        let r = `
          <tr class="${isCurrentYear ? 'current-year' : ''}">
            <td class="year" data-label="Yıl">
              ${row.year}
              ${isLast ? '<br><br><button class="row-btn add" onclick="addYear()"> ➕ </button>' : ''}
            </td>
        `;


        months.forEach((m, idx) => {
          const v = idx < 4 ? oldV : newV;

          let classes = [];
          if (idx === 4) classes.push("green"); // Mai grün
          if (isCurrentYear && idx === CURRENT_MONTH_INDEX) {
            classes.push("current-month");     // 🔥 GELBER RAHMEN
          }

          r += `<td class="${classes.join(" ")}" data-label="${m}"><span class="cell-value">${tr(v)}</span></td>`;
          grand += v;
        });


      r += `
          <td class="total" data-label="Toplam">
            ${tr(oldV * 4 + newV * 8)} TRY
          </td>

          <td class="percent" data-label="TÜFE Kira Artış Oranı" data-value="${row.percent}">
            <input value="${row.percent}" onchange="update(${i},this.value)">
            ${isLast ? '<br><br><button class="row-btn remove" onclick="removeYear()"> ➖ </button>' : ''}
            ${isLast ? '<button class="row-btn reset" onclick="resetData()">↩️</button>' : ''}
          </td>
        </tr>
      `;

      tbody.insertAdjacentHTML("beforeend", r);
    });
    document.getElementById("grandTotal").innerText = tr(grand) + " TRY";
    scrollToCurrentYearMobile();
    if (document.getElementById("sozlesmePage")?.classList.contains("active")) {
      renderContract();
    }
  }

/* AKTUELLE JAHR SPRINGEN / MOBIL */
  function scrollToCurrentYearMobile() {
  // nur Mobile
  if (window.innerWidth > 768) return;

  const el = document.querySelector("tr.current-year");
  if (!el) return;

  // kleiner Delay, damit DOM sicher fertig ist
  setTimeout(() => {
    el.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    // kurzer Highlight-Blink
    el.classList.add("flash");
    setTimeout(() => el.classList.remove("flash"), 1300);

  }, 200);
}

  function update(index, value) {

    // Komma erlauben, Zahl parsen
    let p = parseFloat(String(value).replace(",", "."));

    // Absicherung
    if (isNaN(p)) p = 0;
    if (p < 0) p = 0;
    if (p > 100) p = 100;

    // auf 2 Nachkommastellen begrenzen
    p = Math.round(p * 100) / 100;

    // Prozent setzen
    data[index].percent = p;

    // Folgende Jahre neu berechnen erzwingen
    for (let i = index + 1; i < data.length; i++) {
      data[i].base = null;
    }

    recalc();
    saveData();   // bleibt GENAU hier
  }


/* Reset-Funktion */
function resetData() {
  if (!confirm("Tüm değişiklikler silinsin ve varsayılan değerler yüklensin mi?")) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  data.length = 0;
  DEFAULT_DATA.forEach(row => data.push({ ...row }));

  recalc();
}


build();
updateAppInfoFooter();
checkServerVersion();
