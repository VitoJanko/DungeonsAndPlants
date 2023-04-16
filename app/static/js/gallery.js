// On click reloads the page with a get request (e.g. /galleryAll?terrain=Forest)
function selectTerrain(terrain){
    let getUrl = window.location;
    let baseUrl = getUrl .protocol + "//" + getUrl.host + "/" + getUrl.pathname.split('/')[1];
    window.location.href = baseUrl + '?terrain=' + terrain;
 }

 function getPDF(terrain){
    let getUrl = window.location;
    let baseUrl = getUrl .protocol + "//" + getUrl.host + "/"
    window.location.href = baseUrl + 'pdf_list';
 }

function createElementFromHTML(htmlString) {
    const div = document.createElement('div');
    div.innerHTML = htmlString.trim();
    return div.firstChild;
}

function addNode(element, htmlString) {
    if (htmlString.length <= 1) {
        return;
    }
    const newElement = createElementFromHTML(htmlString);
    element.appendChild(newElement);
    return newElement;
}

 function loadAll(){
    let getUrl = window.location;
    let baseUrl = getUrl .protocol + "//" + getUrl.host + "/";

    $(document).ready(function() {
        $('.grid-item').each(function() {
            const name = $(this).data('name');
            const url = baseUrl+'/generate_plant?terrain=Forest&proff=2&plant_name='+name;
            const element = $(this);
            fetch(url)
                .then(response => response.text())
                .then(data => addNode(element[0], data));
        });
    });
}
