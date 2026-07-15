const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

const inputFile = path.join(__dirname, 'Officer Detail-Monday, 6_22_2026, 12_24_57 PM (1).xlsx');
const outputFile = path.join(__dirname, 'src', 'data', 'blo.json');

console.log('Reading Excel file...');
const workbook = xlsx.readFile(inputFile);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

const rows = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

const bloData = [];
// Skip the first row (headers)
for (let i = 1; i < rows.length; i++) {
  const row = rows[i];
  if (!row || row.length === 0 || !row[0]) continue;
  
  const [assembly, partNo, name, designation, epicNumber, department, mobileNo] = row;

  if (assembly === 'Assembly' || partNo === 'Part No.') continue;
  
  if (name && name.trim()) {
    bloData.push({
      assembly: assembly ? String(assembly).trim() : '',
      partNo: partNo ? String(partNo).trim() : '',
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
