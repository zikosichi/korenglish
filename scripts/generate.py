# -*- coding: utf-8 -*-
import subprocess
import os

# List of words with id, english, and georgian
words = [
    {"id": 1, "english": "Achieve", "georgian": "მიაღწიოს"},
    {"id": 2, "english": "Activity", "georgian": "საქმიანობა"},
    {"id": 3, "english": "Advice", "georgian": "რჩევა"},
    {"id": 4, "english": "Affect", "georgian": "ზეგავლენა"},
    {"id": 5, "english": "Agree", "georgian": "შეთანხმება"},
    {"id": 6, "english": "Allow", "georgian": "ნება"},
    {"id": 7, "english": "Already", "georgian": "უკვე"},
    {"id": 8, "english": "Although", "georgian": "მიუხედავად იმისა"},
    {"id": 9, "english": "Amount", "georgian": "რაოდენობა"},
    {"id": 10, "english": "Analyze", "georgian": "ანალიზი"},
    {"id": 11, "english": "Ancient", "georgian": "უძველესი"},
    {"id": 12, "english": "Appear", "georgian": "გამოჩენა"},
    {"id": 13, "english": "Apply", "georgian": "გამოყენება"},
    {"id": 14, "english": "Argue", "georgian": "კამათი"},
    {"id": 15, "english": "Article", "georgian": "სტატია"},
    {"id": 16, "english": "Attend", "georgian": "დასწრება"},
    {"id": 17, "english": "Attention", "georgian": "ყურადღება"},
    {"id": 18, "english": "Available", "georgian": "ხელმისაწვდომი"},
    {"id": 19, "english": "Avoid", "georgian": "აცილება"},
    {"id": 20, "english": "Beautiful", "georgian": "ლამაზი"},
    {"id": 21, "english": "Belief", "georgian": "რწმენა"},
    {"id": 22, "english": "Benefit", "georgian": "სარგებელი"},
    {"id": 23, "english": "Beyond", "georgian": "მიღმა"},
    {"id": 24, "english": "Billion", "georgian": "მილიარდი"},
    {"id": 25, "english": "Business", "georgian": "ბიზნესი"},
    {"id": 26, "english": "Career", "georgian": "კარიერა"},
    {"id": 27, "english": "Cause", "georgian": "მიზეზი"},
    {"id": 28, "english": "Certain", "georgian": "გარკვეული"},
    {"id": 29, "english": "Challenge", "georgian": "გამოწვევა"},
    {"id": 30, "english": "Chance", "georgian": "შანსი"},
    {"id": 31, "english": "Change", "georgian": "ცვლილება"},
    {"id": 32, "english": "Choice", "georgian": "არჩევანი"},
    {"id": 33, "english": "Choose", "georgian": "არჩევა"},
    {"id": 34, "english": "Citizen", "georgian": "მოქალაქე"},
    {"id": 35, "english": "Civil", "georgian": "სამოქალაქო"},
    {"id": 36, "english": "Claim", "georgian": "მოთხოვნა"},
    {"id": 37, "english": "Clear", "georgian": "ნათელი"},
    {"id": 38, "english": "College", "georgian": "კოლეჯი"},
    {"id": 39, "english": "Common", "georgian": "საერთო"},
    {"id": 40, "english": "Compare", "georgian": "შედარება"},
    {"id": 41, "english": "Concern", "georgian": "შეშფოთება"},
    {"id": 42, "english": "Condition", "georgian": "მდგომარეობა"},
    {"id": 43, "english": "Consider", "georgian": "განხილვა"},
    {"id": 44, "english": "Consumer", "georgian": "მომხმარებელი"},
    {"id": 45, "english": "Continue", "georgian": "გაგრძელება"},
    {"id": 46, "english": "Control", "georgian": "კონტროლი"},
    {"id": 47, "english": "Cost", "georgian": "ღირებულება"},
    {"id": 48, "english": "Country", "georgian": "ქვეყანა"},
    {"id": 49, "english": "Couple", "georgian": "წყვილი"},
    {"id": 50, "english": "Course", "georgian": "კურსი"},
    {"id": 51, "english": "Create", "georgian": "შექმნა"},
    {"id": 52, "english": "Culture", "georgian": "კულტურა"},
    {"id": 53, "english": "Current", "georgian": "მიმდინარე"},
    {"id": 54, "english": "Customer", "georgian": "კლიენტი"},
    {"id": 55, "english": "Decide", "georgian": "გადაწყვეტა"},
    {"id": 56, "english": "Decision", "georgian": "გადაწყვეტილება"},
    {"id": 57, "english": "Defense", "georgian": "დაცვა"},
    {"id": 58, "english": "Degree", "georgian": "ხარისხი"},
    {"id": 59, "english": "Demand", "georgian": "მოთხოვნა"},
    {"id": 60, "english": "Describe", "georgian": "აღწერა"},
    {"id": 61, "english": "Design", "georgian": "დიზაინი"},
    {"id": 62, "english": "Detail", "georgian": "დეტალი"},
    {"id": 63, "english": "Develop", "georgian": "განვითარება"},
    {"id": 64, "english": "Difference", "georgian": "განსხვავება"},
    {"id": 65, "english": "Different", "georgian": "სხვადასხვა"},
    {"id": 66, "english": "Difficult", "georgian": "რთული"},
    {"id": 67, "english": "Direction", "georgian": "მიმართულება"},
    {"id": 68, "english": "Discover", "georgian": "აღმოჩენა"},
    {"id": 69, "english": "Discuss", "georgian": "განხილვა"},
    {"id": 70, "english": "Disease", "georgian": "დაავადება"},
    {"id": 71, "english": "Doctor", "georgian": "ექიმი"},
    {"id": 72, "english": "During", "georgian": "განმავლობაში"},
    {"id": 73, "english": "Economy", "georgian": "ეკონომიკა"},
    {"id": 74, "english": "Education", "georgian": "განათლება"},
    {"id": 75, "english": "Effect", "georgian": "ეფექტი"},
    {"id": 76, "english": "Effort", "georgian": "ძალისხმევა"},
    {"id": 77, "english": "Either", "georgian": "ან"},
    {"id": 78, "english": "Energy", "georgian": "ენერგია"},
    {"id": 79, "english": "Enjoy", "georgian": "სიამოვნების მიღება"},
    {"id": 80, "english": "Environment", "georgian": "გარემო"},
    {"id": 81, "english": "Especially", "georgian": "განსაკუთრებით"},
    {"id": 82, "english": "Establish", "georgian": "დაფუძნება"},
    {"id": 83, "english": "Even", "georgian": "კი"},
    {"id": 84, "english": "Event", "georgian": "ღონისძიება"},
    {"id": 85, "english": "Evidence", "georgian": "მტკიცებულება"},
    {"id": 86, "english": "Example", "georgian": "მაგალითი"},
    {"id": 87, "english": "Exchange", "georgian": "გაცვლა"},
    {"id": 88, "english": "Expect", "georgian": "მოლოდინი"},
    {"id": 89, "english": "Experience", "georgian": "გამოცდილება"},
    {"id": 90, "english": "Explain", "georgian": "ახსნა"},
    {"id": 91, "english": "Factor", "georgian": "ფაქტორი"},
    {"id": 92, "english": "Family", "georgian": "ოჯახი"},
    {"id": 93, "english": "Federal", "georgian": "ფედერალური"},
    {"id": 94, "english": "Feeling", "georgian": "გრძნობა"},
    {"id": 95, "english": "Field", "georgian": "სფერო"},
    {"id": 96, "english": "Figure", "georgian": "ფიგურა"},
    {"id": 97, "english": "Finally", "georgian": "საბოლოოდ"},
    {"id": 98, "english": "Financial", "georgian": "ფინანსური"},
    {"id": 99, "english": "Focus", "georgian": "ფოკუსი"},
    {"id": 100, "english": "Foreign", "georgian": "უცხო"},
]

# Base directory for audio files
base_dir = 'kore/audio'

# Directories for Georgian and English audio
georgian_dir = os.path.join(base_dir, 'ka')
english_dir = os.path.join(base_dir, 'en')

# Create directories if they do not exist
os.makedirs(georgian_dir, exist_ok=True)
os.makedirs(english_dir, exist_ok=True)

for word in words:
    word_id = word['id']
    english_text = word['english']
    georgian_text = word['georgian']

    # File paths
    georgian_mp3 = os.path.join(georgian_dir, f"{word_id}.mp3")
    english_mp3 = os.path.join(english_dir, f"{word_id}.mp3")

    # Generate Georgian audio
    espeak_georgian_command = [
        'espeak-ng',
        '-v', 'ka',          # Georgian voice
        '-s', '140',         # Speed
        '-p', '50',          # Pitch
        '--stdout',          # Output to stdout
        georgian_text
    ]

    # Generate English audio
    espeak_english_command = [
        'espeak-ng',
        '-v', 'en-us',       # English US voice
        '-s', '140',         # Speed
        '-p', '50',          # Pitch
        '--stdout',          # Output to stdout
        english_text
    ]

    # Convert Georgian audio to MP3
    print(f"Generating Georgian MP3 for ID {word_id}: {georgian_text}")
    with open(georgian_mp3, 'wb') as f_mp3:
        espeak_process = subprocess.Popen(espeak_georgian_command, stdout=subprocess.PIPE)
        ffmpeg_command = [
            'ffmpeg',
            '-y',              # Overwrite output
            '-i', 'pipe:0',    # Input from stdin
            '-codec:a', 'libmp3lame',
            '-qscale:a', '2',
            '-f', 'mp3',
            'pipe:1'           # Output to stdout
        ]
        ffmpeg_process = subprocess.Popen(ffmpeg_command, stdin=espeak_process.stdout, stdout=f_mp3)
        ffmpeg_process.communicate()
        espeak_process.stdout.close()

    # Convert English audio to MP3
    print(f"Generating English MP3 for ID {word_id}: {english_text}")
    with open(english_mp3, 'wb') as f_mp3:
        espeak_process = subprocess.Popen(espeak_english_command, stdout=subprocess.PIPE)
        ffmpeg_command = [
            'ffmpeg',
            '-y',              # Overwrite output
            '-i', 'pipe:0',    # Input from stdin
            '-codec:a', 'libmp3lame',
            '-qscale:a', '2',
            '-f', 'mp3',
            'pipe:1'           # Output to stdout
        ]
        ffmpeg_process = subprocess.Popen(ffmpeg_command, stdin=espeak_process.stdout, stdout=f_mp3)
        ffmpeg_process.communicate()
        espeak_process.stdout.close()

print("All audio files have been generated successfully!")
