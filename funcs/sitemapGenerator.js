/* fs.stat("/dir/file.txt", function(err, stats){
    var mtime = stats.mtime;
    console.log(mtime);
}); */

/* 
{
    url: '/1',
    lastMod: new Date('2000-02-02'),
    changeFreq: 'weekly'
} 
 */

const fs = require('fs')
const fse = require('fs-extra')
const dir = '../data/boards-ru'
const catalog = require('../data/catalog/catalog')

// module.exports = () => {
let sitemap = []

// Сдесь промежуточные 
// /catalog/Health
// catalog.forEach(group => {
//     sitemap.push({
//         url: `https://apxub.com/catalog/${group.name.en}`
//     })
//     group.list.forEach(board => sitemap.push({
//         url: `https://apxub.com/r/${board.en}`
//     }))
// })
// /r/AdvancedFitness

fs.readdir(dir, (err, directories) => {

    let index = {}

    if (err) {
        return console.log('Unable to scan directory: ' + err);
    }
    // console.log(directories)

    // console.log(directories)
    for (let directory of directories) {

        fs.readdir(`${dir}/${directory}`, (err, files) => {
            if (err) {
                return console.log('Unable to scan directory: ' + err);
            }

            // console.log(`${dir}/${directory}`)
            // console.log(files)

            //index[directory] = [] 
            for (let file of files) {
                // https://apxub.com/r/AdvancedFitness/a28fe2
                let lastMod
                fs.stat(`${dir}/${directory}/${file}`, (err, stats) => {
                    lastMod = stats.mtime
                    let url = {
                        url: `https://apxub.com/r/${directory}/${file.split('.')[0]}`,
                        lastMod: lastMod,
                        changeFreq: 'monthly',
                        
                    }
                    sitemap.push(url)
                    fse.writeJSONSync('../sitemap.json', sitemap)
                })



                // console.log(sitemap)

            }


        })

    };


})
// return sitemap
// }