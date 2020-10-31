const unirest = require('unirest');

const { kgraph_key } = require('../config')


module.exports = async (msg) => {

    if(msg.content.startsWith('!google ')) {
        
        query = msg.content.slice(8);
        query = query.split(' ').join('+');

        req_url = `https://kgsearch.googleapis.com/v1/entities:search?` + 
        `query=${query}&key=${kgraph_key}&limit=1&indent=True`
        
        let qresult = '';
        let res = await unirest.get(req_url);


        try {
            qresult = getObjects(res.toJSON(), "articleBody", '')[0]['articleBody'];
        } catch(e) {
            qresult = "couldn't find any results.";
        }

        msg.channel.send(qresult);
    }
}


// dont deal with this

function getObjects(obj, key, val) {
    var objects = [];
    for (var i in obj) {
        if (!obj.hasOwnProperty(i)) continue;
        if (typeof obj[i] == 'object') {
            objects = objects.concat(getObjects(obj[i], key, val));    
        } else 
        //if key matches and value matches or if key matches and value is not passed (eliminating the case where key matches but passed value does not)
        if (i == key && obj[i] == val || i == key && val == '') { //
            objects.push(obj);
        } else if (obj[i] == val && key == ''){
            //only add if the object is not already in the array
            if (objects.lastIndexOf(obj) == -1){
                objects.push(obj);
            }
        }
    }
    return objects;
}

