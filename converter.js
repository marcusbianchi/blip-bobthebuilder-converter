var blipJson = {}
var csv = {}
var fs = require('fs')
var loader = require('csv-load-sync');
var getstates = require('./Modules/getstates')
var getnlp = require('./Modules/getnlp')
var savefile = require('./Modules/savefile')
var jsonPath = "./input/" + process.argv[2]
var csvPath = "./input/" + process.argv[3]
var bobJson =
{
    confiability: "0.8",
    startState: "start",
    exceptionState: "exception",
    humanAttendance: "",
    states: [],
    routing: [],
    nlp: []
}
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
var nlp = getnlp.getnlp(csv, bobStatesjson.map)
bobJson['states'] = bobStatesjson.states
bobJson['nlp'] = nlp



savefile.savefile(bobJson)



