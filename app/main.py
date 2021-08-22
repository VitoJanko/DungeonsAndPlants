from flask import Flask

app = Flask(__name__)

from app import views

@app.route("/test/")
def home_view():
        return "<h1>Welcome to Geeks for Geeks</h1>"

@app.route("/about")
def home_view():
        return "<h1>Welcome to Geeks for Geeks 22</h1>"
