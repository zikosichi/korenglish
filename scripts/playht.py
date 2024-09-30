# -*- coding: utf-8 -*-
import requests
import time
import os

# Replace with your actual Play.ht API key and User ID
API_KEY = '9111e548bbd6421d8a281f1ee072e587'
USER_ID = 'DQUkqbt0S4eUZFR4vk8xryLz2mv1'

headers = {
    'Authorization': API_KEY,
    'X-User-ID': USER_ID,
    'Content-Type': 'application/json'
}

# List of words with id, English, and Georgian translations
words = [
    {"id": 1, "english": "Achieve", "georgian": "მიაღწიოს"},
    # ... include all words up to id 100
    {"id": 100, "english": "Foreign", "georgian": "უცხო"}
]

# Directories to save the audio files
georgian_dir = 'kore/audio/ka'
english_dir = 'kore/audio/en'

os.makedirs(georgian_dir, exist_ok=True)
os.makedirs(english_dir, exist_ok=True)

def generate_audio(text, voice_id, filename):
    # Step 1: Initiate Text-to-Speech Conversion
    payload = {
        "voiceId": voice_id,
        "text": text,
        "outputFormat": "mp3",
        "sampleRate": "24000",
        "speed": "1.0"
    }

    print(f"Initiating conversion for: {text}")
    response = requests.post('https://play.ht/api/v1/convert', headers=headers, json=payload)

    if response.status_code != 200:
        print(f"Error initiating conversion: {response.text}")
        return False

    data = response.json()
    transcription_id = data.get('transcriptionId')
    if not transcription_id:
        print("Error: transcriptionId not found in the response.")
        return False

    # Step 2: Poll for Conversion Completion
    status_url = f'https://play.ht/api/v1/articleStatus?transcriptionId={transcription_id}'
    while True:
        status_response = requests.get(status_url, headers=headers)
        if status_response.status_code != 200:
            print(f"Error checking status: {status_response.text}")
            return False

        status_data = status_response.json()
        converted = status_data.get('converted')
        if converted:
            audio_url = status_data.get('audioUrl')
            break
        else:
            print("Conversion in progress... Waiting 5 seconds.")
            time.sleep(5)

    # Step 3: Download the Audio File
    print(f"Downloading audio to {filename}")
    audio_response = requests.get(audio_url)
    if audio_response.status_code == 200:
        with open(filename, 'wb') as f:
            f.write(audio_response.content)
        print("Download completed.")
        return True
    else:
        print(f"Error downloading audio: {audio_response.text}")
        return False

# Replace with the actual voice IDs provided by Play.ht
georgian_voice_id = 'ge-GE-Eka'    # Replace with actual Georgian voice ID
english_voice_id = 'en-US-Matthew'  # Replace with actual English voice ID

for word in words:
    word_id = word['id']
    english_text = word['english']
    georgian_text = word['georgian']

    # File paths
    georgian_mp3 = os.path.join(georgian_dir, f"{word_id}.mp3")
    english_mp3 = os.path.join(english_dir, f"{word_id}.mp3")

    # Generate and download Georgian audio
    success_ka = generate_audio(georgian_text, georgian_voice_id, georgian_mp3)
    if not success_ka:
        print(f"Failed to process Georgian word ID {word_id}")
        continue

    # Generate and download English audio
    success_en = generate_audio(english_text, english_voice_id, english_mp3)
    if not success_en:
        print(f"Failed to process English word ID {word_id}")
        continue

print("All audio files have been generated successfully!")
