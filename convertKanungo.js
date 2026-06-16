import fs from 'fs';
import * as XLSX from 'xlsx';

// Read the Excel file
const fileBuffer = fs.readFileSync('./INFO PATWARI KANUNGO LDH 28-04-2026 (1).xlsx');
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
const sheet = workbook.Sheets['KANUNGOS'];
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

// Tehsil-level approximate coordinates for Ludhiana district
// These are real central coordinates for each tehsil/sub-tehsil
const tehsilCoords = {
  'ludhiana west':   { lat: 30.9200, lng: 75.8100 },
  'ludhiana east':   { lat: 30.9100, lng: 75.8900 },
  'ludhiana south':  { lat: 30.8500, lng: 75.8600 },
  'ludhiana north':  { lat: 30.9600, lng: 75.8500 },
  'ludhiana central':{ lat: 30.9010, lng: 75.8573 },
  'mullanpur':       { lat: 30.9400, lng: 76.0200 },
  'sahnewal':        { lat: 30.8700, lng: 75.9500 },
  'dehlon':          { lat: 30.8400, lng: 76.0500 },
  'koomkalan':       { lat: 30.8600, lng: 76.1000 },
  'jagraon':         { lat: 30.7900, lng: 75.4700 },
  'ਜਗਰਾਉਂ':          { lat: 30.7900, lng: 75.4700 },
  'sidhwan bet':     { lat: 30.9800, lng: 75.3700 },
  'ਸਿੱਧਵਾਂ ਬੇਟ':     { lat: 30.9800, lng: 75.3700 },
  'samrala':         { lat: 30.8400, lng: 76.1900 },
  'machhiwara':      { lat: 30.9100, lng: 76.2400 },
  'payal':           { lat: 30.6700, lng: 76.0400 },
  'maloud':          { lat: 30.7000, lng: 76.2500 },
  'raikot':          { lat: 30.6500, lng: 75.6000 },
  'khanna':          { lat: 30.7000, lng: 76.2200 },
};

function getCoords(tehsil) {
  const key = String(tehsil || '').trim().toLowerCase();
  const base = tehsilCoords[key];
  if (base) {
    // Add slight random offset so multiple kanungos in same tehsil don't stack
    return {
      lat: base.lat + (Math.random() - 0.5) * 0.04,
      lng: base.lng + (Math.random() - 0.5) * 0.04,
    };
  }
  // Fallback: Ludhiana city center
  return {
    lat: 30.9010 + (Math.random() - 0.5) * 0.05,
    lng: 75.8573 + (Math.random() - 0.5) * 0.05,
  };
}

function cleanMobile(raw) {
  if (!raw) return '';
  return String(raw).replace(/\D/g, '').slice(-10); // last 10 digits
}

const kanungos = [];
let idCounter = 1;

// Data starts at row index 4 (0-indexed): [SN, NAME, TEHSIL, MOB, CIRCLES]
for (let i = 4; i < rows.length; i++) {
  const row = rows[i];
  if (!row || row.length === 0) continue;

  const sn     = row[0];
  const name   = String(row[1] || '').trim();
  const tehsil = String(row[2] || '').trim();
  const mobile = cleanMobile(row[3]);
  const circles = String(row[4] || '').trim().replace(/\s+/g, ' ');

  // Skip header row and empty rows
  if (!name || name === 'NAME OF KANUNGO') continue;
  if (!tehsil || tehsil === 'TEHSIL/SUB TEHSIL') continue;

  const coords = getCoords(tehsil);

  kanungos.push({
    id: `kanungo_${idCounter++}`,
    sn: sn || idCounter,
    name,
    tehsil,
    mobile,
    circle: circles,
    type: 'Kanungo',
    lat: coords.lat,
    lng: coords.lng,
  });
}

fs.writeFileSync(
  './src/assets/data/kanungos.json',
  JSON.stringify(kanungos, null, 2)
);

console.log(`✅ Converted ${kanungos.length} Kanungos to JSON`);
kanungos.forEach(k => {
  console.log(`  ${k.sn}. ${k.name} | ${k.tehsil} | ${k.mobile} | ${k.circle}`);
});