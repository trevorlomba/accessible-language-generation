from nltk.corpus import stopwords
import json
import re
import nltk
from collections import Counter
import sqlite3

# Replace with the path to your JSON file
json_file = "MessageBank.json"

# Add this line to import stopwords


def read_json_file(json_file):
    with open(json_file, "r", encoding="utf-8") as file:
        data = json.load(file)

    transcriptions = []
    for message in data["RecordedMessages"]:
        transcriptions.append(message["Transcription"]["Text"])

    return " ".join(transcriptions)


raw_text = read_json_file(json_file)


def preprocess_text(text):
    text = text.lower()
    text = re.sub(r'\W+', ' ', text)
    return text


processed_text = preprocess_text(raw_text)
words = nltk.word_tokenize(processed_text)

# Add this line to download stopwords
nltk.download("stopwords")

# Filter out stopwords
stop_words = set(stopwords.words("english"))
filtered_words = [word for word in words if word not in stop_words]

nltk.download("averaged_perceptron_tagger")
tagged_words = nltk.pos_tag(filtered_words)

word_frequency = Counter(filtered_words)



def create_database():
    conn = sqlite3.connect("words.db")
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS words (
            id INTEGER PRIMARY KEY,
            text TEXT UNIQUE,
            category TEXT,
            frequency INTEGER
        )
    """)
    conn.commit()
    return conn


def insert_word(conn, word, category, frequency):
    cursor = conn.cursor()
    cursor.execute("""
        INSERT OR IGNORE INTO words (text, category, frequency)
        VALUES (?, ?, ?)
    """, (word, category, frequency))
    conn.commit()


conn = create_database()
for word, tag in tagged_words:
    insert_word(conn, word, tag, word_frequency[word])

conn.close()

def save_data_to_json_file(data, filename):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Collect the data from the database
conn = create_database()
cursor = conn.cursor()
cursor.execute("SELECT * FROM words")
rows = cursor.fetchall()

# Save the data to a JSON file
data = [{"id": row[0], "text": row[1], "category": row[2],
         "frequency": row[3]} for row in rows]
save_data_to_json_file(data, "words.json")

conn.close()
