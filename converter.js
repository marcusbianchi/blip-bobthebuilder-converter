var blipJson = {}
var fs = require('fs')

var savefile = function (blipJson) {
    try {
        fs.writeFileSync('./output/flow.json', JSON.stringify(blipJson), {
            encoding: 'utf8',
            flag: 'w+'
        })
    } catch (error) {
        console.log(error);
    }
}

var jsonPath = "./output/"+process.argv[2]

try {
    blipJson = JSON.parse(fs.readFileSync(jsonPath))
} catch (error) {
    console.log(error)
    return null;
}
if (!blipJson) {
    console.log('Unable to parse BlipJSON')
    return null;
}

var getstates = require ('./Modules/getstates')
var bobStatesjson = getstates.getstates(blipJson)

savefile(bobStatesjson)



