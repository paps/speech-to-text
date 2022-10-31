const pinyin = require("pinyin")
const util = require('util')
const speech = require('@google-cloud/speech')
const {TranslationServiceClient} = require('@google-cloud/translate')
const client = new speech.SpeechClient()

const translationClient = new TranslationServiceClient()

// sox -V1 -q -t pulseaudio -e signed-integer -r 16000 -c 1 -b 16 alsa_output.xxxx -t wav - | node this_program.js
// (to list audio sources: pactl list short sources)

const request = {
  config: {
    encoding: 'LINEAR16',
    sampleRateHertz: 16000,
    // see https://cloud.google.com/speech-to-text/docs/languages
    languageCode: 'cmn-Hant-TW', // Chinese Mandarin (Han?) Traditional Taiwan
  },
  interimResults: true,
}

let lastResultDate
let resultBeingTranslated

const recognizeStream = client.streamingRecognize(request).on('error', console.error).on('data', data => {
  //console.clear()
  if (data.results && data.results[0] && data.results[0].alternatives[0]) {
    const result = data.results[0].alternatives[0].transcript
    lastResultDate = Date.now()
    if (!resultBeingTranslated) {
      resultBeingTranslated = result
      const request = {
        parent: `projects/refreshing-glow-357323/locations/global`,
        contents: [resultBeingTranslated],
        mimeType: 'text/plain',
        sourceLanguageCode: 'cmn-Hant-TW',
        targetLanguageCode: 'en',
      }
      translationClient.translateText(request).then((value) => {
        //console.log(util.inspect(value, {showHidden: false, depth: null, colors: true}))
        if (value && value[0] && value[0].translations && value[0].translations[0]) {
          console.log(`| ${resultBeingTranslated}`)
          const p = pinyin.pinyin(resultBeingTranslated, {
            segment: true,
            group: true,
            mode: "tone2",
          })
          console.log(`| ${p.join(" ")}`)
          console.log(`| ${value[0].translations[0].translatedText}`)
        }
        resultBeingTranslated = null
      }, (error) => {
        console.error("Translation error:")
        console.error(error)
        resultBeingTranslated = null
      })
    }
    //console.log(util.inspect(data.results[0], {showHidden: false, depth: null, colors: true}))
    console.log(result)
  } else {
    console.error("Malformed data")
    process.exit(1)
  }
})

setInterval(() => {
  if (lastResultDate && lastResultDate + 4000 < Date.now()) {
    process.exit(0)
  }
}, 100)

process.stdin.pipe(recognizeStream)

console.log(' ~~~')
