import fs from 'fs';

const rawData = [
  {
    name: "CIVIL HOSPITAL LUDHIANA", type: "DH", ownership: "Government",
    address: "Lord Mahavir civil hospital Ludhiana, Fieldganj, pin code - 141008",
    lat: 30.9067, lng: 75.8608, tehsil: "Ludhiana",
    contact: "Dr. Rohit Rampal - 9872400169"
  },
  {
    name: "KHANNA SDH", type: "SDH", ownership: "Government",
    address: "Gulam Mohammad diwana hospital Khanna",
    lat: 30.7045, lng: 76.2175, tehsil: "Khanna",
    contact: "Dr. Maninder Singh Bhasin - 9876024199"
  },
  {
    name: "JAGRAON SDH", type: "SDH", ownership: "Government",
    address: "Frozpur road Jagraon",
    lat: 30.7938, lng: 75.476097, tehsil: "Jagraon",
    contact: "Dr.Gurbinder Kaur - 9872462818"
  },
  {
    name: "SAMRALA SDH", type: "SDH", ownership: "Government",
    address: "MACHHIWARA ROAD SAMRALA, LUDHIANA-141114",
    lat: 30.8357, lng: 76.1910, tehsil: "Samrala",
    contact: "DR SARIKA - 9463910991"
  },
  {
    name: "RAIKOT SDH", type: "SDH", ownership: "Government",
    address: "Near Tehsil Complex Raikot",
    lat: 30.6441, lng: 75.5806, tehsil: "Raikot",
    contact: "Dr. Mandeep Singh - 9814926962"
  },
  {
    name: "MACHHIWARA CHC", type: "CHC", ownership: "Government",
    address: "Near Nabhi Khan Gani Khan Gate Bus stand Road Machhiwara",
    lat: 30.9126, lng: 76.1972, tehsil: "Machhiwara",
    contact: "Dr. Jasdev Singh - 9872598055"
  },
  {
    name: "MANNUPUR CHC", type: "CHC", ownership: "Government",
    address: "NEAR GOVT SR.SEC. SCHOOL MANUPUR",
    lat: 30.76562, lng: 76.26592, tehsil: "Samrala",
    contact: "Dr.Sudeep Sidhu - 9855580903"
  },
  {
    name: "PAYAL CHC", type: "CHC", ownership: "Government",
    address: "Near Police station",
    lat: 30.724318, lng: 76.062139, tehsil: "Payal",
    contact: "Dr. Harvinder Singh - 9464034843"
  },
  {
    name: "MALAUDH CHC", type: "CHC", ownership: "Government",
    address: "Near Bank of india",
    lat: 30.6333, lng: 75.9333, tehsil: "Payal",
    contact: "Dr.Harbinder Singh - 9814067540"
  },
  {
    name: "SAHNEWAL CHC", type: "CHC", ownership: "Government",
    address: "opp dream park, sahnewal",
    lat: 30.8406, lng: 75.9794, tehsil: "Ludhiana",
    contact: "Dr. Ramesh Kumar - 9855716180"
  },
  {
    name: "KOOMKALAN CHC", type: "CHC", ownership: "Government",
    address: "near Senior secondary hospital chc koom kalan",
    lat: 30.89107, lng: 75.87729, tehsil: "Koom Kalan",
    contact: "Dr.Rupinder Gill - 9915300543"
  },
  {
    name: "Sidhawan bet CHC", type: "CHC", ownership: "Government",
    address: "opposite police station",
    lat: 30.9080, lng: 75.5290, // Approx for Sidhwan Bet
    tehsil: "Sidhawan bet",
    contact: "Dr Mandeep singh - 9814926962"
  },
  {
    name: "PAKHOWAL CHC", type: "CHC", ownership: "Government",
    address: "Near Patrol Pump dangon Pakhowal",
    lat: 30.8788722, lng: 75.8182907, tehsil: "Pakhowal",
    contact: "Dr. Neelam - 9815245642"
  },
  {
    name: "SUDHAR CHC", type: "CHC", ownership: "Government",
    address: "Opposite GHG Khalsa College Sudhar",
    lat: 30.774381, lng: 75.648774, tehsil: "Sudhar",
    contact: "Dr. Davinder Kumar - 9872035799"
  },
  {
    name: "HATHUR CHC", type: "CHC", ownership: "Government",
    address: "Near Post Office Hathur",
    lat: 30.6007, lng: 75.4297, tehsil: "Hathur",
    contact: "Dr. Aman Sharma - 9592381831"
  },
  {
    name: "DEHLON CHC", type: "CHC", ownership: "Government",
    address: "Near police Satation",
    lat: 30.7425, lng: 75.8461, tehsil: "Ludhiana East",
    contact: "Dr.Puneet Sidhu - 9872217849"
  },
  {
    name: "VARDMAN UCHC", type: "UCHC", ownership: "Government",
    address: "Sec 32 Chandigarh Road, Near Division No. 7 Police station, Ludhiana",
    lat: 30.911123, lng: 75.890682, tehsil: "Ludhiana",
    contact: "Dr.Savita - 9872380508"
  },
  {
    name: "JAWADDI UCHC", type: "UCHC", ownership: "Government",
    address: "canal road,near pancham hospital, Ludhiana",
    lat: 30.880799, lng: 75.830205, tehsil: "Ludhiana",
    contact: "dr kawaljeet kaur - 9501166663"
  },
  {
    name: "UCHC CS COMPLEX", type: "UCHC", ownership: "Government",
    address: "civil surgeon office near pavilion mall ludhiana",
    lat: 30.92, lng: 75.84, tehsil: "Ludhiana",
    contact: "Dr. Kanwaljeet Kaur - 9501166663"
  },
  {
    name: "SHIMLAPURI UCHC", type: "UCHC", ownership: "Government",
    address: "uchc shimlapuri adjoining smaj bhalai complex building near gill canal ludhiana",
    lat: 30.8669, lng: 75.8752, tehsil: "Ludhiana",
    contact: "Dr. Bindu - 9855721304"
  },
  {
    name: "SUBASH NAGAR UCHC", type: "UCHC", ownership: "Government",
    address: "UCHC SUBHASH NAGAR BANDA BAHADAR COLONY NEAR SHAMSHAN GHAT",
    lat: 30.935219, lng: 75.88402, tehsil: "Ludhiana",
    contact: "Dr.Ramninder kaur Gill - 9814432400"
  },
  {
    name: "GIASPURA UCHC", type: "UCHC", ownership: "Government",
    address: "UCHC Giaspura near govt flats",
    lat: 30.8589, lng: 75.8894, tehsil: "Ludhiana",
    contact: "Dr. Ramesh Kumar - 9855716180"
  },
  {
    name: "Gagan hospital", type: "Hospital", ownership: "Private",
    address: "opp.milan palace dehlon",
    lat: 30.746567, lng: 75.851669, tehsil: "Dehlon",
    contact: "Dr.Gagandeep Sharma - 9888495359"
  },
  {
    name: "Mehta Hospital", type: "Hospital", ownership: "Private",
    address: "Mehta hospital doraha near society petrol pump doraha",
    lat: 30.795, lng: 76.035238, // Added lat approx based on Doraha
    tehsil: "Payal",
    contact: "Dr.Rohit Mehta - 7888579019"
  },
  {
    name: "RAJWANT HOSPITAL", type: "Hospital", ownership: "Private",
    address: "Rajwant Hospital GT Road (NH 1), SBS Nagar, Doraha, Ludhiana, Punjab - 141421",
    lat: 30.795864, lng: 76.033238, tehsil: "Payal",
    contact: "Dr. Jaskirat Singh Pandher - 9878432457"
  }
];

const mapped = rawData.map((item, index) => ({
  id: `hosp_${index + 1}`,
  name: item.name,
  type: item.type,
  ownership: item.ownership,
  tehsil: item.tehsil,
  address: item.address,
  mobile: item.contact,
  lat: item.lat,
  lng: item.lng
}));

fs.writeFileSync('./src/assets/data/hospitals.json', JSON.stringify(mapped, null, 2));
console.log('Saved to src/assets/data/hospitals.json');
