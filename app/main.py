from flask import Flask

app = Flask(__name__)

#from app import views
from flask import render_template
from flask import request
import pandas as pd

@app.route("/test/")
def home_view():
    return "<h1>Welcome to Geeks for Geeks</h1>"

@app.route("/time")
def diff_name():
    return "<h1>Welcome to Geeks for Geeks 22</h1>"

@app.route("/")
def index():
    return render_template("index.html")


@app.route("/gallery")
def gallery():
    names = ['Sunflower', 'Chamomile',
             "Cobblecap Moss", "Magpie Nest",
             "Willow Bark", "Moving Nest",
             "event-Fertile Fields", "Fertile Fields",
             "Marker Moss", "Spell Drinker",
             "Empyrean Yeast", "Cleanser",
             "event-Curse Bleeder", "Curse Bleeder",
             "event-Twirling Piper", "Twirling Piper",
             "event-Sludge Flower", "Sludge Flower",
             "event-Cinderleaf", "Cinderleaf",
             "Living Web", "Size Changer",
             "Tracker", "Blabbeler",
             "event-Symbiotic Succulents", "Symbiotic Succulents",
             "event-Thorny Prison", "Thorny Prison",
             "Name Thief", "Facade",
             "event-The Hanging Tree", "The Hanging Tree",
             ]
    columns = 2
    return render_template("gallery.html", names=names, columns=columns)

@app.route("/galleryAll")
def galleryAll():
    plants_all = pd.read_csv("plant_list.csv", sep=";").fillna("")
    plants_all = plants_all.sort_values(by="Profficiency")
    queue = []
    proficiency = -1
    names = []
    for i, row in plants_all.iterrows():
        if len(names) % 2 == 0 or row["Profficiency"] != proficiency:
            for name in queue:
                names.append("event-" + name)
                names.append(name)
            queue = []
            proficiency = row["Profficiency"]
        if len(row["Event"].strip()) > 1:
            if len(names) % 2 == 0:
                names.append("event-"+row["Name"])
                names.append(row["Name"])
            else:
                queue.append(row["Name"])
        else:
            names.append(row["Name"])
    # names = list(plants_all["Name"])
    columns = 2
    return render_template("gallery.html", names=names, columns=columns)

@app.route("/about")
def about():
    return "All about Flask"

def format_text(cond):
    cond = cond.strip()
    if len(cond)==0:
        return cond
    cond = list(cond)
    if cond[-1]==".":
        cond[-1]=":"
    else:
        cond +=[":"]
    cond = "".join(cond)
    cond =cond.replace(".",",")
    return cond

@app.route("/generate_plant")
def generate_plant():
    terrain = request.args.get('terrain')
    proff = request.args.get('proff')
    name_arg = request.args.get("plant_name")

    return_event = False
    if name_arg is not None and name_arg.startswith("event-"):
        name_arg = name_arg[6:]
        return_event = True

    plants_all = pd.read_csv("plant_list.csv", sep=";").fillna("")
    plants_all["t2a"] = plants_all["t2a"].apply(format_text)
    plants_all["t1a"] = plants_all["t1a"].apply(format_text)
    plants_relevant = plants_all[(plants_all[terrain]) & (plants_all["Profficiency"]<=int(proff))]
    selected = plants_relevant.sample().iloc[0]

    #print("Just arrived", name_arg)
    if name_arg is not None:
        selected = plants_all[(plants_all["Name"]==name_arg)]
        #print(len(selected))
        if len(selected) == 0:
            return ""
        selected = selected.iloc[0]

    plant_template = render_template("single_plant.html",
                            plant_name=selected["Name"],
                            plant_image=selected["Image"],
                            plant_t1a=selected["t1a"],
                            plant_t1b=selected["t1b"],
                            plant_t2a=selected["t2a"],
                            plant_t2b=selected["t2b"],
                            profficiency=selected["Profficiency"],
                            plant_flavour=selected["Flavour"]
                            )

    event = selected["Event"]

    if not return_event and (len(event.strip()) <= 1 or (name_arg is not None)):
        return plant_template

    event_template = render_template("single_event.html",
                            plant_name=selected["Name"],
                            plant_image=selected["Image"],
                            plant_event=selected["Event"],
                            profficiency=selected["Profficiency"],
                            plant_resolved=plant_template
                            )
    return event_template
