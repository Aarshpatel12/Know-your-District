import fs from 'fs';
import * as XLSX from 'xlsx';

// 1. Read the AWC Excel file
const fileBuffer = fs.readFileSync('./Assembly Constituency wise AWCs.xlsx');
const workbook = XLSX.read(fileBuffer, { type: 'buffer' });

// 2. Use the Main Sheet which has all AWCs across all constituencies
const sheetName = workbook.SheetNames[0]; // 'Main Sheet'
const sheet = workbook.Sheets[sheetName];

// 3. Convert to array of arrays
const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 });

const awcs = [];

// 4. Column indices (from header row):
// 0: Sr No, 1: District Name, 2: Block Name, 3: Circle Name/Sector Name,
// 4: Rural/Urban, 5: Village/ULB code, 6: Ward no,
// 7: AWC Code, 8: Village Name as per LGD Code, 9: Anganwadi Centre Name,
// 10: Name of Vidhan Sabha (Assembly), 11: Booth No,
// 12: Lat, 13: Long,
// 14: Located (Inside/Outside school),
// 15: Anganwadi Worker Name, 16: Mobile No, 17: Worker Code,
// 18: Supervisor Name, 19: Supervisor Phone, 20: Supervisor Code,
// 21: Data Verified by Call Centre

for (let i = 1; i < rows.length; i++) {
  const row = rows[i];

  // Skip empty rows or rows without AWC name
  if (!row[9]) continue;

  const lat = parseFloat(row[12]);
  const lng = parseFloat(row[13]);

  // Skip rows without valid coordinates
  if (isNaN(lat) || isNaN(lng)) continue;

  // Normalize assembly name (trim + title case)
  const rawAssembly = String(row[10] || '').trim();
  const assembly = rawAssembly.charAt(0).toUpperCase() + rawAssembly.slice(1).toLowerCase();

  awcs.push({
    id: 'awc_' + (row[7] || i),
    name: String(row[9]).trim(),
    awcCode: row[7],
    block: String(row[2] || '').trim(),
    circle: String(row[3] || '').trim(),
    village: String(row[8] || '').trim(),
    assembly: assembly,
    areaType: String(row[4] || '').trim(),
    locationType: String(row[14] || '').trim(),
    workerName: String(row[15] || '').trim(),
    workerMobile: String(row[16] || '').trim(),
    supervisorName: String(row[18] || '').trim(),
    supervisorPhone: String(row[19] || '').trim(),
    verified: String(row[21] || '').trim(),
    lat: lat,
    lng: lng
  });
}

// 5. Save the generated JSON
fs.writeFileSync(
  './src/assets/data/awcs.json',
  JSON.stringify(awcs, null, 2)
);

console.log(`✅ Success! Converted ${awcs.length} AWCs to JSON.`);

// Print summary by assembly
const byAssembly = {};
awcs.forEach(a => {
  byAssembly[a.assembly] = (byAssembly[a.assembly] || 0) + 1;
});
console.log('\n📊 AWCs by Assembly Constituency:');
Object.entries(byAssembly).sort((a,b) => b[1]-a[1]).forEach(([k,v]) => {
  console.log(`  ${k}: ${v}`);
});
