from flask import Flask, send_from_directory

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
    names = ["event-Neck Breaker", "Neck Breaker",
            "event-Burning Temptation", "Burning Temptation",
             ]
    columns = 2
    return render_template("gallery.html", names=names, columns=columns)

@app.route("/pdfView")
def pdf_viewer():
    return render_template('pdf_viewer.html', pdf_url=f'/pdf_files/plants2.pdf')

# Displays all plants in the pandas dataframe
# If "habitat" is specified in get request, only plants from that habitat are displayed
# (e.g. /galleryAll?terrain=Forest)


@app.route('/pdf_list')
def pdf_files():
    return send_from_directory('static/pdf_files', "plants2.pdf")

@app.route("/galleryAll")
def galleryAll():
    terrain = request.args.get('terrain')
    plants_all = pd.read_csv("plant_list.csv", sep=";").fillna("")
    if terrain is not None:
        plants_all = plants_all[plants_all[terrain]]
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
    for name in queue:
        names.append("event-" + name)
        names.append(name)
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
