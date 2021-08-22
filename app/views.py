from app import app
from flask import render_template
from flask import request
import pandas as pd

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/about")
def about():
    return "All about Flask"

@app.route("/generate_plant")
def generate_plant():
    terrain = request.args.get('terrain')
    proff = request.args.get('proff')

    plants_all = pd.read_csv("plant_list_mod.csv", sep=";").fillna("")
    plants_relevant = plants_all[(plants_all[terrain]) & (plants_all["Profficiency"]<=int(proff))]

    #print(terrain, proff, plants_all)

    selected = plants_relevant.sample().iloc[0]

    return render_template("single_plant.html",
                            plant_name=selected["Name"],
                            plant_image=selected["Image"],
                            plant_t1a=selected["t1a"],
                            plant_t1b=selected["t1b"],
                            plant_t2a=selected["t2a"],
                            plant_t2b=selected["t2b"],
                            plant_flavour=selected["Flavour"]
                            )
    #return terrain+"--"+proff
