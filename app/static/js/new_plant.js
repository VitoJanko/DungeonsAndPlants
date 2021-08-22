'use strict';

function test(times){
  alert(document.body.childNodes.length)
  for (let i = 0; i < document.body.childNodes.length; i++) {
       alert( document.body.childNodes[i] ); // Text, DIV, Text, UL, ..., SCRIPT
     }
}


function delete_node(event){
  let container = event.target.parentElement;
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

function fetch_plant(terrain, proff){
  let address = window.location.href;
  let getUrl = window.location;
  let baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
  //alert(baseUrl)
  fetch(baseUrl+'/generate_plant?terrain='+terrain+"&proff="+proff)
  .then(response => response.text())
  .then(data => add_node(data));
}

function add_node(node_string){
  let container = document.getElementById("plant_container");
  let element = createElementFromHTML(node_string);
  container.prepend(element);
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
