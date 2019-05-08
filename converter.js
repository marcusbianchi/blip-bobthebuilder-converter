var blipJson = {}
var fs = require('fs')
var getstates = require('./Modules/getstates')

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

var getKeyByValue = function (object, value) {
    return Object.keys(object).find(key => object[key].indexOf(value) != -1);
}
var findId = function (flowPoint, builderPoint, idMap) {
    let idPoint = getKeyByValue(idMap, flowPoint);
    if (idPoint)
        return idPoint
    idPoint = getKeyByValue(idMap, builderPoint);
    if (idPoint)
        return idPoint
    return "";
}

var loader = require('csv-load-sync');
var csv = loader("./input/GestãoDeNLP_Nextel - V4.csv");
var nlp = []

for (let index = 0; index < csv.length; index++) {
    const element = csv[index];
    var values = []
    if (element['Nome da Entidade 1'] != '-' && element['Nome da Entidade 1'] != '') {
        let entity = {
            entity: element['Nome da Entidade 1'],
            value: element['Valor da Entidade 1'],
        }
        values.push(entity);
    }

    if (element['Nome da Entidade 2'] != '-' && element['Nome da Entidade 2'] != '') {
        let entity = {
            entity: element['Nome da Entidade 2'],
            value: element['Valor da Entidade 2'],
        }
        values.push(entity);
    }
    if (values.length > 0) {
        destination = findId(element['Ponto do fluxo'], element['Ponto no Builder'], bobStatesjson.map)
        let intention = {
            "id": index,
            "intents": [
                element['Intenção']
            ],
            "entities": [
                {
                    "values": values,
                    "destination": destination
                }
            ],
            "defaultDestination": "exception",
            "order": index
        }
        nlp.push(intention);
    }
}



savefile(nlp)



