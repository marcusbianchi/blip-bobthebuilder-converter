exports.getstates = (function () {
    var bobStatesjson = [
        {
            "id": "start",
            "name": "Inicio",
            "interactions": null,
            "stoppingPoint": true,
            "tracking": null,
            "defaultExit": "exception"
        },
        {
            "id": "exception",
            "name": "Excecao",
            "interactions": null,
            "stoppingPoint": false,
            "tracking": null,
            "defaultExit": "start",
            "actionsBefore": null,
            "actionsAfter": null
        }
    ]

    var checkMessage = function (blipblock) {
        var actions = blipblock['$contentActions']
        if (actions) {
            for (let index = 0; index < actions.length; index++) {
                const element = actions[index];
                if (element['action'] && element['action']['type'] == 'SendMessage') {
                    return true;
                }
            }
        }
        return false
    }

    var getMessages = function (blipblock) {
        var messages = []
        var actions = blipblock['$contentActions']
        var count = 0;
        if (actions) {
            for (let index = 0; index < actions.length; index++) {
                const element = actions[index];
                if (element['action'] && element['action']['type'] == 'SendMessage'
                    && element['action']['settings'] && element['action']['settings']['type']
                    && element['action']['settings']['type'] == "text/plain") {
                    let text = element['action']['settings']['content']
                    let message = {
                        "mediaType": "TEXT",
                        "order": count,
                        "text": text
                    }
                    count++;
                    messages.push(message);
                }
            }
        }
        return messages
    }

    var camelize = function (str) {
        return str.split(' ').map(function (word, index) {
            if (index == 0) {
                return word.toLowerCase();
            }
            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
        }).join('');
    }


    var checkuserinteraction = function (searchObject) {
        var actions = searchObject['$contentActions']
        if (actions) {
            const element = actions[actions.length - 1];
            if (element['input']) {
                if (element['input']['bypass'] == true)
                    return false;
            }
        }
        return true
    }
    return function (blipJson) {
        var idMap = {}
        Object.keys(blipJson).forEach(function (k) {
            let blipblock = blipJson[k]
            if (checkMessage(blipblock)) {
                let name = blipblock['$title'];
                let title = ""
                if (blipblock['$title'].search('\\]') == -1) {
                    title = blipblock['$title'].trim().toLowerCase()
                } else {
                    title = blipblock['$title'].substring(blipblock['$title'].search("\\]") + 1, blipblock['$title'].length).trim().toLowerCase()
                }
                let id = camelize(title);
                let messages = getMessages(blipblock);
                let userInteraction = checkuserinteraction(blipblock);
                let bobBlock = {
                    "id": id,
                    "name": name,
                    "interactions": messages,
                    "stoppingPoint": userInteraction,
                    "tracking": null,
                    "defaultExit": "exception",
                    "actionsBefore": null,
                    "actionsAfter": null
                }
                idMap[id]=name;
                bobStatesjson.push(bobBlock);
            }
        });
        return {
            states : bobStatesjson,
            map : idMap
        };
    }
})()