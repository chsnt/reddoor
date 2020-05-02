const catalog = require('../catalog.js')
const fs = require('fs')

//module.exports = (catalog) => {
    //     
    let common = []
    for (const group in catalog) {
        if (catalog.hasOwnProperty(group)) {
            let list = catalog[group].list;
            common.push(...list)
        }
    }
//}
common = JSON.stringify(common)
fs.writeFileSync('../catalogWOG.json', common)
//console.log(common)
