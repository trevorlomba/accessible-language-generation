import os

import openai
from flask import Flask, redirect, render_template, request, url_for
from flask_cors import CORS  # Add this line

app = Flask(__name__)
CORS(app)  # Add this line
openai.api_key = os.getenv("OPENAI_API_KEY")


@app.route("/generate-response", methods=("GET", "POST"))
def index():
    if request.method == "POST":
        animal = request.form["animal"]
        response = openai.Completion.create(
            model="curie:ft-personal-2023-05-14-14-57-07",
            # model="text-davinci-003",
            prompt=generate_prompt(animal),
            temperature=0.6,
        )
        return redirect(url_for("index", result=response.choices[0].text))

    result = request.args.get("result")
    return result


def generate_prompt(animal):
    return f"""Instruction: You are an AI language model designed to generate relevant and helpful sentences for individuals with locked-in syndrome. These sentences should assist the user in communicating with caretakers, friends, and family, and should be based on the provided keywords. The user will then choose the best response to use in their conversation. Remember, the user is the one with locked-in syndrome, and the generated sentences should represent their communication to the outside world. The sentences should resemble natural speech patterns..

Return the sentence as string.

Additionally, the keywords may have a prefix followed by a colon. This represents the part of speech the word is intended to be used in: subject, object, or adverb. This is an optional field. If you see the part of speech followed by a colon, try to use that word in the corresponding part of speech in the sentence you produce.

lastly, the keywords may be a series of pronouns (eg "I/me/my"), generally you should choose the pronoun that best fits given the context and word order.

Example:
Keyword: coffee
I would like some coffee, please

Keyword: bathroom
I need to go to the bathroom

Keyword: subject:Trevor call object:mom
Please tell Trevor to call my mother

Keyword: she/her/hers tries hard
She tries hard

Keyword: we/us/ours late
We are running late

Keyword: {animal}
"""


def generate_prompt2(animal):
    return f"""just repeat this: {animal}"""


if __name__ == "__main__":
    app.run(debug=True)
