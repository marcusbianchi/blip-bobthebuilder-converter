var blipJson = {}
var csv = {}
var fs = require('fs')
var loader = require('csv-load-sync');
var getstates = require('./Modules/getstates')
var getnlp = require('./Modules/getnlp')
var savefile = require('./Modules/savefile')
var jsonPath = "./input/" + process.argv[2]
var csvPath = "./input/" + process.argv[3]



try {
     csv = loader(csvPath);
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


savefile.savefile(nlp)



