import fs from 'node:fs';

const supplier = 'El Barranqueño';
const regions = ['guadalajara', 'colima'];

regions.forEach(region => {
  const filePath = `./data/menu_${region}_list2.json`;
  const menu = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
  
  const updated = menu.map(item => ({
    ...item,
    supplier
  }));
  
  fs.writeFileSync(filePath, JSON.stringify(updated, null, 2));
  console.log(`✅ Updated ${filePath} with supplier: ${supplier}`);
});

console.log(`\n✅ All menu files updated with supplier data`);
