import fs from 'fs';
import * as XLSX from 'xlsx';

// 1. Read the file into a memory buffer using Node's native 'fs'
const fileBuffer = fs.readFileSync('./sk data.xlsx - SEWA KENDRA.csv');

// 2. Tell the XLSX library to read that buffer
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

// 3. Get the first sheet and convert it to a Javascript array
const sheetName = workbook.SheetNames[0];
const sheet = workbook.Sheets[sheetName];
const rows = XLSX.utils.sheet_to_json(sheet);

const sewaKendras = [];

// Ludhiana Center Coordinates for mock data
const baseLat = 30.9010;
const baseLng = 75.8573;

// 4. Loop through all the rows
for (let i = 0; i < rows.length; i++) {
  const row = rows[i];
  if (!row['SK_Name']) continue; 
  
  sewaKendras.push({
    id: "sk_" + row['SR.NO'],
    name: row['SK_Name'],
    tehsil: row['Tehsil'],
    assembly: row['Assembly Constituency'],
    type: row['SK_Type'],
    // Mock coordinates for testing
    lat: baseLat + (Math.random() - 0.5) * 0.3,
    lng: baseLng + (Math.random() - 0.5) * 0.3
  });
}

// 5. Save the generated array to your React app
fs.writeFileSync(
  './src/assets/data/sewakendras.json', 
  JSON.stringify(sewaKendras, null, 2)
);

console.log(`✅ Success! Converted ${sewaKendras.length} Sewa Kendras to JSON.`);