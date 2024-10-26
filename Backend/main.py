from flask import Flask, render_template, request, jsonify
from flask_cors import CORS
from database import DATABASE

app = Flask(__name__)
CORS(app)

db = DATABASE("packageDB")


@app.route("/sign-in", methods=["POST"])
def login():
    if request.method == 'POST':
        user = request.get_json()
        data = db.login(user)
        return data


@app.route("/sign-up", methods=["POST"])
def register():
    if request.method == 'POST':
        user = request.get_json()

        data = db.register(user)
        return data



if __name__ == "__main__":
    app.run(debug=True)
