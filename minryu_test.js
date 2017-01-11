var apiCount = 4;
var foodshopLayer = L.layerGroup();
var cropshopLayer = L.layerGroup();

var hypermarketLayer = L.layerGroup();
var curedproductLayer = L.layerGroup();

var baseMaps = {
  "OpenStreetMap": L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
  "GoogleMap": L.tileLayer('http://mt{s}.google.com/vt/x={x}&y={y}&z={z}', {
    subdomains: '014'
  })
};

var map = L.map('map', {
  worldCopyJump: true,
  layers: [baseMaps.OpenStreetMap, foodshopLayer, cropshopLayer, hypermarketLayer, curedproductLayer]
}).setView([36.5841324,139.8352569], 14);

L.control.layers(baseMaps, {
  'Food Shop': foodshopLayer,
  'Crop Shop': cropshopLayer,
  'Hyper Market': hypermarketLayer,
  'Cured Product': curedproductLayer
}).addTo(map);

//Update the data
var refresh = L.control({
  position: 'topleft'
});
refresh.onAdd = function(map) {
  var controlDiv = L.DomUtil.create('div', 'leaflet-bar');
  L.DomEvent
    .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
    .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
    .addListener(controlDiv, 'click', function() {
      if (!this.querySelector('i').classList.contains('fa-spin')) {
        apiCount = 4;
        getBikeJsons();
      }
    });

  var controlUI = L.DomUtil.create('a', '', controlDiv);
  controlUI.id = 'shopRefresh';
  controlUI.title = 'Updating';
  controlUI.href = '#';
  controlUI.style.fontSize = '18px';
  controlUI.style.lineHeight = '26px';
  controlUI.style.textAlign = 'center';
  controlUI.innerHTML = '<i class="fa fa-refresh"></i>'

  return controlDiv;
};
refresh.addTo(map);

//legend
var legend = L.control({
  position: 'bottomright'
});
legend.onAdd = function(map) {
  var div = L.DomUtil.create('div', 'legend'),
    // change the names if necessary
    grades = ['Food Shop','Crop Shop','Hyper Market','Cured Product'];
    // change the icon path if necessary
    labels = ['./icon/foodshop.png','./icon/cropshop.png','./icon/hypermarket.png','./icon/curedproduct.png']

  // loop through our density intervals and generate a label with a colored square for each interval
  for (var i = 0; i < grades.length; i++) {
    div.innerHTML += grades[i] + (" <img src=" + labels[i] + " height = '30' width = '30'>") +'<br>'
  }
  return div;
};
legend.addTo(map);

//geolocation
var geolocation = L.control({
  position: 'topleft'
});
geolocation.onAdd = function(map) {
  var controlDiv = L.DomUtil.create('div', 'leaflet-bar');
  L.DomEvent
    .addListener(controlDiv, 'click', L.DomEvent.stopPropagation)
    .addListener(controlDiv, 'click', L.DomEvent.preventDefault)
    .addListener(controlDiv, 'click', function() {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
          map.setView([position.coords.latitude, position.coords.longitude], 12);
        });
      } else {
        alert("Geolocation is not supported by this browser.");
      }
    });

  var controlUI = L.DomUtil.create('a', '', controlDiv);
  controlUI.title = 'Current Location';
  controlUI.href = '#';
  controlUI.style.fontSize = '18px';
  controlUI.style.lineHeight = '26px';
  controlUI.style.textAlign = 'center';
  controlUI.innerHTML = '<i class="fa fa-location-arrow"></i>'

  return controlDiv;
};
geolocation.addTo(map);

getShopJsons();

function getShopJsons() {
  $('#shopRefresh i').addClass('fa-spin');

  //Food shops
  foodshopLayer.clearLayers();
  $.getJSON("./data/foodshop.geojson", function(data) {
      /*optional stuff to do after success */
      var foodshop = L.geoJson(data,{
        pointToLayer: function(feature, latlng){
          var foodicon =  new L.Icon({
            iconUrl: './icon/foodshop.png',
            iconSize: [20, 20],
            iconAnchor: [13, 10]
          });
          return L.marker(latlng,{icon:foodicon});
        },
        onEachFeature: function(feature,layer){
          layer.bindPopup('Shop:' + feature.properties.title +'<br/>'+'City:'+feature.properties.city + '<br/>' +'TEL:'+feature.properties.Tel);
        }
      });
      foodshop.addTo(foodshopLayer);
  }).error(function() {
    alert("Unable to load Food Shop Information, please try again later!");
  }).always(function() {
    checkAllFinish();
  });;

  //Crop shops
  cropshopLayer.clearLayers();
  $.getJSON("./data/cropshop.geojson", function(data) {
      /*optional stuff to do after success */
      var shop = L.geoJson(data,{
        pointToLayer: function(feature, latlng){
          var cropicon = new L.Icon({
            iconUrl: './icon/cropshop.png',
            iconSize: [20, 20],
            iconAnchor: [13, 10],


          });
          return L.marker(latlng,{icon:cropicon});
        },
        onEachFeature: function(feature,layer){
          layer.bindPopup('Shop:' + feature.properties.title +'<br/>'+'Address:' +feature.properties.city + '<br/>' + 'TEL:'+feature.properties.Tel);
        }
      });
      shop.addTo(cropshopLayer);
  }).error(function() {
    alert("Unable to load Super Information, please try again later!");
  }).always(function() {
    checkAllFinish();
  });;

  // Hyper markets
  hypermarketLayer.clearLayers();
  $.getJSON("./data/hypermarket.geojson", function(data) {
      /*optional stuff to do after success */
      var shop = L.geoJson(data,{
        pointToLayer: function(feature, latlng){
          var hypericon = new L.Icon({
            iconUrl: './icon/hypermarket.png',
            iconSize: [20, 20],
            iconAnchor: [13, 10]
          });
          return L.marker(latlng,{icon:hypericon});
        },
        onEachFeature: function(feature,layer){
          layer.bindPopup('Shop:' + feature.properties.title +'<br/>'+'Address:'+feature.properties.city + '<br/>' +'TEL:'+feature.properties.Tel);
        }
      });
      shop.addTo(hypermarketLayer);
  }).error(function() {
    alert("Unable to load Super Information, please try again later!");
  }).always(function() {
    checkAllFinish();
  });;

  // Cured Products
  curedproductLayer.clearLayers();
  $.getJSON("./data/curedproduct.geojson", function(data) {
      /*optional stuff to do after success */
      var curedproduc = L.geoJson(data,{
        pointToLayer: function(feature, latlng){
          var curedicon = new L.Icon({
            iconUrl: './icon/curedproduct.png',
            iconSize: [20, 20],
            iconAnchor: [13, 10],
          });
          return L.marker(latlng,{icon:curedicon});
        },
        onEachFeature: function(feature,layer){
          layer.bindPopup('Shop:' + feature.properties.title +'<br/>'+ 'Address:' + feature.properties.city + '<br/>' + 'TEL:' +feature.properties.Tel);
        }
      });
      curedproduc.addTo(curedproductLayer);
  }).error(function() {
    alert("Unable to load Super Information, please try again later!");
  }).always(function() {
    checkAllFinish();
  });;
}

function shopsColor(count) {
  var unit = Math.floor(count / 3);
  switch (unit) {
    case 0:
      color = '#120b03';
      break;
    case 1:
      color = '#099c5d';
      break;
    case 2:
      color = '#041430';
      break;
    case 3:
      color = '#ffb000';
      break;
    default:
      color = '#840139';
      break;
  }
  return color;
}

function checkAllFinish() {
  apiCount -= 1;
  if (apiCount === 0) {
    $('#shopRefresh i').removeClass('fa-spin');
  }
}
