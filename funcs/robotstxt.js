const catalog = require('../data/catalog/catalog')

module.exports = () => {
    let links = []
    // /catalog/Health
    catalog.forEach(group => {
        links.push(`Disallow: /catalog/${group.name.en}`)
        group.list.forEach(board => links.push(`Disallow: /r/${board.en}`))
    })
    console.log(links)
    return links.join('\n')
}