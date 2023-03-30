'use strict';

function test(times){
  alert(document.body.childNodes.length)
  for (let i = 0; i < document.body.childNodes.length; i++) {
       alert( document.body.childNodes[i] ); // Text, DIV, Text, UL, ..., SCRIPT
     }
}

function extractName(string){
  if (string.includes("EVENT:")){
    // console.log(string);
    let name = string.substring(7)
    // console.log("event-"+name);
    return "event-"+name
    //alert(name)
  }
  return string
}

function delete_node(event){
  let container = event.target.parentElement;
  let name = extractName(container.querySelector('[name="title"]').innerHTML);
  deletePlant(name)
  container.remove();
}

function duplicate_node(){
  let container = document.getElementById("plant_container");
  let plant = container.lastElementChild;
  let clone = plant.cloneNode(true);
  container.appendChild(clone);
}

function create_node(){
  let container = document.getElementById("plant_container");
  let definition = "<div class=title_div><p class='title'>Herbarium</p></div>";
  let element = createElementFromHTML(definition);
  container.appendChild(element);
}


function is_hand_size_valid(proff){
  let container = document.getElementById("plant_container");
  let hand_size = container.childElementCount;
  if (proff==0)
    proff=1;
  return hand_size < proff
}

function handle_warning(valid_size){
  let element = document.getElementById("hand_full");
  if (valid_size)
    element.innerHTML = ""
  else
    element.innerHTML = "Your hand is full!"
}

function read_form(){
  let form = document.forms.radios;
  let terrains = form.elements.terrain;
  let proffs = form.elements.proff;
  let terrain = get_checked(terrains);
  let proff = get_checked(proffs);
  let has_hand_space = is_hand_size_valid(proff)
  handle_warning(has_hand_space)
  if (has_hand_space)
    fetch_plant(terrain, proff)
}

function read_form_b(){
  let form = document.forms.radiosB;
  let terrains = form.elements.terrain;
  let proffs = form.elements.proff;
  let terrain = get_checked(terrains);
  let proff = get_checked(proffs);
  let has_hand_space = is_hand_size_valid(proff)
  handle_warning(has_hand_space)
  if (has_hand_space)
    fetch_plant(terrain, proff)
}

function fetch_plant(terrain, proff){
  let address = window.location.href;
  let getUrl = window.location;
  let baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
  //alert(baseUrl)
  fetch(baseUrl+'/generate_plant?terrain='+terrain+"&proff="+proff)
  .then(response => response.text())
  .then(data => add_plant(data));
}

function add_plant(data){
  let element = add_node(data)
  if (element === null)
    return;
  let name = extractName(element.querySelector('[name="title"]').innerHTML);
  savePlant(name)
}

function add_node(node_string){
  if (node_string.length <=1)
    return;
  let container = document.getElementById("plant_container");
  let element = createElementFromHTML(node_string);
  container.prepend(element);
  return element
}

function get_checked(group){
  for (let radio of group){
    if (radio.checked)
      return radio.value
  }
  return null
}

function createElementFromHTML(htmlString) {
  let div = document.createElement('div');
  div.innerHTML = htmlString.trim();

  // Change this to div.childNodes to support multiple top-level nodes
  return div.firstChild;
}

function replacePlant(event, htmlString){
  //alert(htmlString)
  let target = event.target.parentNode;
  let element = createElementFromHTML(htmlString);
  target.parentNode.replaceChild(element, target);
}


function replaceName(old_name, new_name){
    // console.log(old_name);
    // console.log(new_name);
    deletePlant(old_name)
    savePlant(new_name);
}


function resolvePlant(event, name){
  let address = window.location.href;
  let getUrl = window.location;
  let baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
  let old_name = "event-"+name
  fetch(baseUrl+'/generate_plant?terrain=Forest&proff=2&plant_name='+name)
  .then(response => response.text())
  .then(data => replacePlant(event, data))
  .then(() => replaceName(old_name, name));
}

function fetchSpecificPlant(name){
  if (name.length<=1)
    return
  let address = window.location.href;
  let getUrl = window.location;
  let baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
  fetch(baseUrl+'/generate_plant?terrain=Forest&proff=2&plant_name='+name)
  .then(response => response.text())
  .then(data => add_node(data));
}

function currentCards(){
  let current = ""
  let storage = localStorage.getItem("card");
  if (storage !== null)
    current = storage
  return current
}

function savePlant(name){
  let current = currentCards()
  current += ";"+name
  localStorage.setItem("card", current);
}

function deletePlant(name){
  let current = currentCards()
  let plants = current.split(";");
  let result = ""
  for (let i=1; i<plants.length; i++){
    let plant = plants[i]
    if (plant == name){
      name = "placeholder" // No further copies will be removed
    }
    else{
      result +=  ";"+plant
    }
  }
  localStorage.setItem("card", result);
}

function deleteAllPlants(name){
  localStorage.removeItem("card");
}

function loadPlants(){
  let current = currentCards()
  // alert(current)
  let plants = current.split(";");
  plants.forEach(fetchSpecificPlant);
}

function loadAll(){
  loadSettings()
  //savePlant("Berry")
  //savePlant("Tentacle Weed")
  //deleteAllPlants()
  loadPlants()
  //
}

function loadSettings(){
  let form = document.forms.radios;
  let terrains = form.elements.terrain;
  let proffs = form.elements.proff;
  let terrain = localStorage.getItem("terrain");
  let proff = localStorage.getItem("proff");
  if (terrain !== null)
    setSettings(terrains, terrain)
  if (proff !== null)
    setSettings(proffs, proff)
}

function setSettings(group, value){
  for (let radio of group){
    if (radio.value == value)
      radio.checked = true
  }
}

function saveSettings(){
  let form = document.forms.radios;
  let terrains = form.elements.terrain;
  let proffs = form.elements.proff;
  let terrain = get_checked(terrains);
  let proff = get_checked(proffs);
  localStorage.setItem("proff", proff);
  localStorage.setItem("terrain", terrain);
}

function toggle_credits(){
  let container = document.getElementById("credits");
  if (container.style.display == "none" || container.style.display == "")
     container.style.display = "block";
  else{
     container.style.display = "none";}
 }