const fs = require('fs');
const path = require('path');
const zip = require('bestzip');

const backupFolder = path.join(__dirname, '../clickcard-business');
const output = path.join(__dirname, `backup-clickcard-${new Date().toISOString().split('T')[0]}.zip`);

zip({
  source: '*',
  destination: output,
  cwd: backupFolder
}).then(() => {
  console.log(`✅ Backup salvo em: ${output}`);
}).catch((err) => {
  console.error('❌ Falha ao criar backup:', err);
});
