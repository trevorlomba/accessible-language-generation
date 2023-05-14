import json
import csv

# Load the JSON data
with open('MessageBank.json') as json_file:
    data = json.load(json_file)

# Open (or create) a CSV file to write the data
with open('transcripts.csv', 'w', newline='') as csvfile:
    fieldnames = ['Id', 'FileName', 'TranscriptionText',
                  'TranscriptionSource', 'TranscriptionConfidence', 'TranscriptionState']
    writer = csv.DictWriter(csvfile, fieldnames=fieldnames)

    # Write the CSV header
    writer.writeheader()

    # Loop through the data and write each transcript as a row in the CSV
    for message in data['RecordedMessages']:
        writer.writerow({
            # 'Id': message['Id'],
            # 'FileName': message['FileName'],
            'TranscriptionText': message['Transcription']['Text'],
            # 'TranscriptionSource': message['Transcription']['Source'],
            # 'TranscriptionConfidence': message['Transcription']['Confidence'],
            # 'TranscriptionState': message['Transcription']['State'],
        })
