exports.savefile = (function () {
    var fs = require('fs')

    return function (json) {
        try {
            fs.writeFileSync('./output/flow.json', JSON.stringify(json), {
                encoding: 'utf8',
                flag: 'w+'
            })
        } catch (error) {
            console.log(error);
        }
    }
})()