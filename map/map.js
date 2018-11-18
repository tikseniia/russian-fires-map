mapboxgl.accessToken = 'pk.eyJ1IjoidGlrc2VuaWlhIiwiYSI6ImNqbzBobGpkZTAwd2Mza2xvZ2F4bTk1eG4ifQ.AWFalA05G9xWxDQqFOFBWA';
var mymap = new mapboxgl.Map({
    container: 'mapid',
    style: 'mapbox://styles/mapbox/dark-v9',
    center: [130.570311, 67.456381],
    zoom: 1.75,
    maxZoom: 1.75,
    minZoom: 1.5,
});

var getColorPopulation = function(p) {
  return p > 500000 ? '#100080' :
         p > 200000 ? '#2900bd' :
         p > 100000 ? '#2a1ae3' :
         p > 50000  ? '#312afc' :
         p > 10000  ? '#423cfd' :
         p > 5000   ? '#524cfe' :
         p > 1000   ? '#7678fe' :
                      '#a3a0ff' ;
}

var getColorCoef = function(p) {
  return p == 2   ? '#100080' :
         p == 1.8 ? '#2900bd' :
         p == 1.7 ? '#2a1ae3' :
         p == 1.6 ? '#312afc' :
         p == 1.5 ? '#423cfd' :
         p == 1.4 ? '#524cfe' :
         p == 1.3 ? '#7678fe' :
                    '#a3a0ff' ;
}

function countPopulation(region) {
  var population = 0;
  for (var k in sregion) {
    population = population + region.subjects[k].population[0].count
  }
  console.log(region.name+' - '+population);
}

mymap.on('load', function () {
  for (var i=0; i<Object.keys(NordRegions.regions).length; i++) {
    for (var j=0; j<Object.keys(SubData.features).length; j++) {

      var name = NordRegions.regions[i].name;
      var coef = Benefits_b30.regions[name].coef;
      var population = NordRegions.regions[i].population;

      if ((name == SubData.features[j].properties.name && name != 'Тюменская область') ||
        (Object.keys(NordRegions.regions[i].subjects).includes(SubData.features[j].properties.name))) {

        if (Object.keys(NordRegions.regions[i].subjects)[0] != 'all') {
          var description = '<h3>'+name+'</h3><p>Минимальный коэффициент: '+coef+'</p><p>Население на территории Крайнего Севера: '+population+'</p><p>Отнесены к Крайнему Северу: '+Object.keys(NordRegions.regions[i].subjects)+'</p>'
        } else {
          var description = '<h3>'+name+'</h3><p>Минимальный коэффициент: '+coef+'</p><p>Население на территории Крайнего Севера: '+population+'</p>'
        }

        mymap.addLayer({
            'id': SubData.features[j].id,
            'type': 'fill',
            'source': {
                'type': 'geojson',
                'data': {
                    'type': SubData.features[j].type,
                    'properties': {
                      'description': description,
                    },
                    'geometry': {
                        'type': SubData.features[j].geometry.type,
                        'coordinates': SubData.features[j].geometry.coordinates
                    }
                  }
              },
              'paint': {
                  'fill-color': getColorCoef(coef)
              }
        });

        mymap.on('click', SubData.features[j].id, function (e) {
          var coordinates = e.lngLat;
          var name =  e.features[0].properties.description;

          while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          }

          new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(name)
              .addTo(mymap);
        });

        // Change the cursor to a pointer when the mouse is over the places layer.
        mymap.on('mouseenter', SubData.features[j].id, function () {
            mymap.getCanvas().style.cursor = 'pointer';
        });

        // Change it back to a pointer when it leaves.
        mymap.on('mouseleave', SubData.features[j].id, function () {
            mymap.getCanvas().style.cursor = '';
        });
      }
    }
  }
})
