// const catalog = require('../catalog.js')
const fs = require('fs')
const fse = require('fs-extra')
const dir = '../../boards-ru'


/**
 * Index
 * {
 *   "AdvancedFitness":
 *      [
 *         { "ID":"1hxjqx", "NAME":"" }, 
 *         { "ID":"a36kf6", "NAME":"" },
 *         { "ID":"a5i7t4", "NAME":"" }, 
 *         { "ID":"c5o5a1", "NAME":"" },
 *         { "ID":"ciycit", "NAME":"" }, 
 *         { "ID":"czqsu7", "NAME":"" },
 *         { "ID":"d0xuof", "NAME":"" }, 
 *         { "ID":"d3nx0z", "NAME":"" },
 *         { "ID":"de34sa", "NAME":"" }, 
 *         { "ID":"dj1gr1", "NAME":"" } 
 *      ]
 *   }
 * }
 * 
 * 
 *  */

fs.readdir(dir, (err, directories)=>{

    let index = {}

    if (err) {
      return console.log('Unable to scan directory: ' + err);
    } 
    
    // console.log(directories)
    directories.forEach( directory => {

        console.log(directory)
        // console.log(index)

        fs.readdir(`${dir}/${directory}`, (err, files)=>{
            if (err) {
              return console.log('Unable to scan directory: ' + err);
            } 

            console.log(`${dir}/${directory}`)
            //console.log(index)

            index[directory] = [] 
            files.forEach( (file, i) => {
                let regex = /(\S+)(\.json)/  
                let f = fse.readJsonSync(`${dir}/${directory}/${file}`)      
                index[directory].push({ 
                    "ID" : file.match(regex)[1], 
                    "NAME": f.title,
                    "SCORE": f.ups,
                    "DATE": f.created,
                    "ORDER": i+1,
                })
            });

            fse.writeJSONSync('../index.json', index)

        })

    });

}) 
