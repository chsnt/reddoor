//const catalog = require('./catalog.js')

module.exports = (catalog) => {
    //     
    let common = []
    for (const group in catalog) {
        if (catalog.hasOwnProperty(group)) {
            let element = catalog[group];
            let portion = element.map(board => board.en)
            common.push(...portion)
        }
    }
}
