from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/about")
def about():
    return "<h1 style='color: red;'>I'm a red H1 heading!</h1>"
