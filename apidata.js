const areaOfUk = 242495;
var imageData = [];
var layerData =[];
let map;
var authenication;
let authToken;
var searchInAction = false;

function authenticate(){
    data = new FormData();
    data.set('grant_type', 'password');
    data.set('username', 'Hallam1');
    data.set('password', 'dn2-fJSL');
    const postBody = "grant_type=password&username=Hallam1&password=dn2-fJSL";
    let request = new XMLHttpRequest();
    request.open('POST','https://hallam.sci-toolset.com/api/v1/token', true);
    request.send(data);
    request.onreadystatechange = function() {
        if (request.readyState === 4  && request.status === 200){
            var json = JSON.parse(request.responseText);
            authenication = {
                "access_token" : json.access_token,
                "refresh_token" : json.refresh_token,
                "expires_in" : json.expires_in

            };
            authToken = 'Bearer ' + authenication.access_token;
            getProducts();
            }
        }
}
function initMap(){
  map = L.map('map').setView([54.3138, -2.169], 6);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18,
  }).addTo(map);
  addCountesToMap();
  authenticate();
}
function addCountesToMap(){
    var geojsonLayer = new L.GeoJSON.AJAX("data/ukcounties.geojson");
    geojsonLayer.addTo(map);
}
function getProducts() {
    const postBody = "{\"size\":100, \"keywords\":\"\"}";//, \"strings\":[{\"field\":\"sceneimagery\",\"value\":[\"*\"],\"operator\":\"or\"}]}";
    let request = new XMLHttpRequest();
    request.open('POST','https://hallam.sci-toolset.com/discover/api/v1/products/search',true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', authToken);
    request.setRequestHeader('Accept', '*/*');
    request.send(postBody);
    request.onreadystatechange = function() {
        if (request.readyState === 4  && request.status === 200){
            console.log("product data recieved");
            var json = JSON.parse(request.responseText);
            console.log(json.results.searchresults.length);
            for(var x = 0; x < json.results.searchresults.length; x++){
                getGeoJson(json.results.searchresults[x].id,function(geoJSONdata){
                    console.log(x);
                addToMap(geoJSONdata);
                imageData.push(geoJSONdata)
                });
            }
        }
    }
}
function getMissionById(id){
    searchInAction = true;
     map.eachLayer(function (layer){
         map.removeLayer(layer);
    });
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18
    }).addTo(map);
    addCountesToMap();


    getGeoJson(id, function(geoJSONdata){
        addToMap(geoJSONdata);
        
        
    });


}
function getGeoJson(id, callback){
    console.log(id);
    let request = new XMLHttpRequest();
    request.open('GET','https://hallam.sci-toolset.com/discover/api/v1/products/' + id, true);
    request.setRequestHeader('Content-Type', 'application/json');
    request.setRequestHeader('Authorization', authToken);
    request.setRequestHeader('Accept', '*/*');
    request.send(null);
    request.onreadystatechange = function() {
        if (request.readyState === 4 && request.status === 200){
            //console.log("product data recieved");
            var json = JSON.parse(request.responseText);
            var area = turf.area(turf.polygon(json.product.result.footprint.coordinates));
            area = ((area/1000000));
            var percentage = (area/areaOfUk)*100;
            var geojson = 
            {
                "type": "Feature",
                "properties" : {
                     "missionid" : json.product.result.missionid,
                     "documentType" : json.product.result.documentType,
                     "area" : area,
                     "percentage": percentage,
                     "id" : id
                },
                "geometry" : json.product.result.footprint
            };
            callback(geojson);
        }
    }
}
function addToMap(data){
    L.geoJSON(data, {
        onEachFeature: function(feature, layer) {
            layerData.push(layer);
            layer.bindPopup("Mission ID: " + feature.properties.missionid
            + '<br>Area: ' + parseFloat(feature.properties.area.toFixed(2)) + "km²" 
            + '<br>Percentage Covered: ' + parseFloat(feature.properties.percentage.toFixed(6)) + "%"
            + '<br>ID: ' + feature.properties.id);
        }
    }).addTo(map);
}
var specElement = document.getElementById("searchbar");


document.addEventListener('click', function(event){
    console.log("click");
    var isClickInside = specElement.contains(event.target);

    if(!isClickInside && searchInAction == true){
        getProducts(); 
        searchInAction = false; 
    }
})

initMap();
