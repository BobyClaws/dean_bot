const textToSpeech = require('@google-cloud/text-to-speech');
const Discord = require('discord.js');
const { Readable } = require('stream');
const fs = require('fs');
const util = require('util');

const ttsClient = new textToSpeech.TextToSpeechClient();




/**
 * 
 * @param {Discord.Message} msg
 */

module.exports = async (msg) => {

    if(msg.content.startsWith("!tts ")) {
        message = msg.content.slice("5");

        // Construct the request
        const request = {
            input: {ssml: message},
            // Select the language and SSML voice gender (optional)
            voice: {languageCode: 'ja-JP', name: 'ja-JP-Wavenet-B'},
            // select the type of audio encoding
            audioConfig: {audioEncoding: 'LINEAR16', pitch: 0},
        };

        // Performs the text-to-speech request
        const [response] = await ttsClient.synthesizeSpeech(request);
        // Write the binary audio content to a local file

//	console.log(response.audioContent);
//	let channelid = '768510442435248152'
	let channelid = '744209394358812727'
	let voiceChannel = msg.client.channels.cache.get(channelid);
	const connection = await voiceChannel.join();

	var readStream =  new Readable({
		read() {
			this.push(response.audioContent)
			this.push(null);
		}
	});

//	connection.play(readStream);
//	console.log('done');

        const writeFile = util.promisify(fs.writeFile);
        writeFile('data/tts/output.wav', response.audioContent, 'binary')
	.then(async (res) => {

		const { exec } = require('child_process');
		exec('sox data/tts/output.wav data/tts/output2.wav pitch 300', (e,o,e2) => {
			console.log('donec');
			connection.play('data/tts/output2.wav');
			console.log('done');
		});

	});




  }

}
