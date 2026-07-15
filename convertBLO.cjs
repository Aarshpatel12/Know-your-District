const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'Officer Detail-Tuesday, 6_9_2026, 7_35_23 PM.xlsx');
const outputFile = path.join(__dirname, 'src', 'assets', 'data', 'blo.json');

console.log('Reading Excel file...');
const workbook = xlsx.readFile(inputFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

const bloData = [];
// Skip first few rows containing title and metadata
// Headers are at row 2 (0-indexed). Actual data starts at row 3.
for (let i = 3; i < rows.length; i++) {
  const row = rows[i];
  if (!row || row.length === 0 || !row[0]) continue;
  
  // Columns based on 'Officer Detail-Tuesday, 6_9_2026, 7_35_23 PM.xlsx'
  // 0: Name, 3: Designation, 6: Assembly, 7: Part No., 8: Part Name
  // 9: EPIC Number, 10: Department, 15: Mobile No.
  
  const name = row[0];
  const designation = row[3];
  const assembly = row[6];
  const partNo = row[7];
  const partName = row[8];
  const epicNumber = row[9];
  const department = row[10];
  const mobileNo = row[15];

  if (name && String(name).trim() !== '' && String(name).trim() !== 'Name') {
    bloData.push({
      assembly: assembly ? String(assembly).trim() : '',
      partNo: partNo ? String(partNo).trim() : '',
      partName: partName ? String(partName).trim() : '',
      name: name ? String(name).trim() : '',
      designation: designation ? String(designation).trim() : '',
      epicNumber: epicNumber ? String(epicNumber).trim() : '',
      department: department ? String(department).trim() : '',
      mobile: mobileNo ? String(mobileNo).trim() : ''
    });
  }
}

fs.writeFileSync(outputFile, JSON.stringify(bloData, null, 2));
console.log(`Successfully converted ${bloData.length} BLO records and saved to ${outputFile}`);
