const months = [
  "Ocak","Şubat","Mart","Nisan",
  "Mayıs","Haziran","Temmuz","Ağustos",
  "Eylül","Ekim","Kasım","Aralık"
];

const STORAGE_KEY = "kiraTableData";

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
    console.warn("Storage defekt – Standardwerte geladen");

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
          <button onclick="printTable()">🖨 DRUCKEN</button>
        </td>
    </tr>
  `;

  recalc();
}

function printTable() {
    window.print();
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
  if (!confirm("Alle Änderungen verwerfen und Standardwerte laden?")) {
    return;
  }

  localStorage.removeItem(STORAGE_KEY);

  data.length = 0;
  DEFAULT_DATA.forEach(row => data.push({ ...row }));

  recalc();
}


build();



