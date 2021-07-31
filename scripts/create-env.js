const fs = require('fs')
fs.writeFileSync('./.env', `HYPI_DOMAIN=${process.env.HYPI_DOMAIN}\n`)