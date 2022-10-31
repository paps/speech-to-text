# speech-to-text

Experimental project that takes raw live audio (i.e. what's going to the speakers) in stdin and pipes it through GCP's [Speech-to-Text API](https://cloud.google.com/speech-to-text), then through GCP's [Translation API](https://cloud.google.com/translate).

To practice my Chinese hearing comprehension, an idea would be to watch streaming content (e.g. Taiwanese Twicth streamers); however I need a bit of help. This code can generate near real-time subtitles + translated subtitles + pinyin. The UI is stdout, the terminal is meant to be reduced to a small window and placed alongside the content. It remains to be seen if this is truly useful and practical, more tests need to be done.

The code is heavily inspired from the [Perform streaming speech recognition on an audio stream](https://cloud.google.com/speech-to-text/docs/streaming-recognize#perform_streaming_speech_recognition_on_an_audio_stream) GCP example.
