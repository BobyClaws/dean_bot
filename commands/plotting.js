const { exec } = require('child_process');

module.exports = function(rclient, msg) {



    // graphing #1
    if(msg.content.startsWith('plot [')) {



        json = msg.content.slice(5);

        rclient.exists('plotting>input', (e,r) => {
            if (r == 1) {
                msg.channel.send('already working on previous set...');
            } else {
                rclient.set('plotting>input', json);

                exec('cd facilities/plotting/ && ./plotting',
                    {shell: '/bin/bash'},
                    (err, stdout, stderr) => {
                        if (err) console.error(err);
                        if (stderr) console.log(stderr);
                        if (stdout) console.log(stdout);

                        msg.channel.send('here', {files: ['data/plotting/output.png']});
                        rclient.del('plotting>input')

                    }
                )

            }
        });
    }
    

}