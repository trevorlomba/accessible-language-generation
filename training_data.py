import pandas as pd
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import casual_tokenize

# Add the word 'please' to the list of stopwords
stop_words = set(stopwords.words('english'))
additional_stopwords = ["please"]
stop_words.update(additional_stopwords)


def remove_stopwords(line):
    if isinstance(line, str):
        word_tokens = casual_tokenize(line)
        filtered_text = [
            word for word in word_tokens if word.casefold() not in stop_words]
        return ' '.join(filtered_text) if filtered_text else 'Default Text'
    else:
        return line


# Read csv
# Replace 'transcriptions.csv' with your csv file name
df = pd.read_csv('transcriptions.csv')

# Rename 'TranscriptionText' column to 'completion'
df.rename(columns={'Response': 'completion'}, inplace=True)

# Remove stopwords from 'completion' and create new column 'prompt'
df['prompt'] = df['completion'].apply(remove_stopwords)

# Reorder the columns
df = df[['prompt', 'completion']]

# Write the DataFrame back to csv
df.to_csv('training_data.csv', index=False)

# Convert DataFrame to JSONL format and save it to a file
df.to_json('training_data.jsonl', orient='records', lines=True)
