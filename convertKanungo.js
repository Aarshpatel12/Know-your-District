import fs from 'fs';
import * as XLSX from 'xlsx';

// 1. Read the exact Excel file you provided
const fileBuffer = fs.readFileSync('./INFO PATWARI KANUNGO LDH 28-04-2026 (1).xlsx');
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

// 2. Select the KANUNGOS sheet (it is the second sheet in the file)
const sheet = workbook.Sheets['KANUNGOS'];

// 3. Convert to an array of arrays (because the government file has empty title rows at the top)
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const kanungos = [];
const baseLat = 30.9010;
const baseLng = 75.8573;

// 4. Find the data and loop through it
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  
  // In the Excel file, column index 2 is "NAME OF KANUNGO"
  // We skip rows that don't have a name (like the empty title rows at the top)
  if (!row[2] || row[2] === 'NAME OF KANUNGO') continue;

  kanungos.push({
    id: "kanungo_" + row[1], // SN
    name: row[2], // NAME OF KANUNGO
    tehsil: row[3], // TEHSIL/SUB TEHSIL
    mobile: row[4], // MOB
    circle: row[5], // CIRCLES
    type: 'Kanungo',
    // Mock coordinates around Ludhiana for testing
    lat: baseLat + (Math.random() - 0.5) * 0.3,
    lng: baseLng + (Math.random() - 0.5) * 0.3
  });
}

// 5. Save the generated JSON to your data folder
fs.writeFileSync(
  './src/assets/data/kanungos.json', 
  JSON.stringify(kanungos, null, 2)
);

console.log(`✅ Success! Converted ${kanungos.length} Kanungos to JSON.`);