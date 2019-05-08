var blipJson = {}
var fs = require('fs')
var loader = require('csv-load-sync');
var getstates = require('./Modules/getstates')
var getnlp = require('./Modules/getnlp')


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

var jsonPath = "./input/" + process.argv[2]
var csv = loader("./input/GestãoDeNLP_Nextel - V4.csv");

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
var bobStatesjson = getstates.getstates(blipJson)
var nlp = getnlp.getnlp(csv,bobStatesjson.map)


savefile(nlp)



