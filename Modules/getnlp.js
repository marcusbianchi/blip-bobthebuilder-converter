exports.getnlp = (function () {
    var nlp = []
    var default_values = {}

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
        return "exception";
    }

    return function (csv, map) {
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
            let destination = findId(element['Ponto do fluxo'], element['Ponto no Builder'], map)
            if (values.length > 0) {
                let intention = {
                    id: index,
                    intents: [element['Intenção']],
                    entities: [
                        {
                            values: values,
                            destination: destination
                        }
                    ],
                    defaultDestination: "exception",
                    order: index
                }
                nlp.push(intention);
            } else {
                default_values[element['Intenção']] = destination
            }
        }

        for (let index = 0; index < nlp.length; index++) {
            const element = nlp[index];
            let intent = element['intents'][0]
            if (default_values[intent])
                element['defaultDestination'] = default_values[intent]
        }
        return nlp;
    }
})()