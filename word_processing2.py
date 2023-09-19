from nltk.corpus import stopwords
import json
import re
import nltk
from collections import Counter
import sqlite3

# Replace with the path to your JSON file
json_file = "MessageBank.json"

# Add this line to import stopwords
# nltk.download("stopwords")
print('hello')

# Function to connect to the existing database


def connect_database():
    conn = sqlite3.connect("words.db")
    return conn

# Read rows from the words2 table in the database


def read_rows_from_database(conn):
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM words2")
    rows = cursor.fetchall()
    return rows

# Save the data to a JSON file


def save_data_to_json_file(data, filename):
    with open(filename, "w", encoding="utf-8") as file:
        json.dump(data, file, ensure_ascii=False, indent=4)

# Connect to the database
conn = connect_database()

# Fetch rows from words2 table
rows = read_rows_from_database(conn)

# Format the data
data = [{ "id": row[0], "text": row[1], "category": row[2],
         "frequency": row[3]} for row in rows]

# Save the data to a JSON file
save_data_to_json_file(data, "words2.json")

# Close the database connection
conn.close()
