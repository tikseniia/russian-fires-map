mapboxgl.accessToken = 'pk.eyJ1IjoidGlrc2VuaWlhIiwiYSI6ImNqbzBobGpkZTAwd2Mza2xvZ2F4bTk1eG4ifQ.AWFalA05G9xWxDQqFOFBWA';
var mymap = new mapboxgl.Map({
    container: 'mapid',
    style: 'mapbox://styles/mapbox/light-v9',
    center: [100.570311, 67.456381],
    zoom: 2,
    maxZoom: 3,
    minZoom: 1.5,
});

var getColorCoef = function(p) {
  return p > 1.9   ? '#b71c1c' :
         p > 1.6 ? '#c62828' :
         p > 1.3 ? '#d32f2f' :
         p > 1.0 ? '#e53935' :
         p > 0.8 ? '#f44336' :
         p > 0.7 ? '#ef5350' :
         p > 0.5 ? '#e57373' :
         p > 0.3 ? '#ef9a9a' :
         p > 0.1 ? '#ffcdd2':
                   '#ffebee'
}

mymap.on('load', function () {
  for (var i=0; i<Fires.length; i++) {
    for (var j=0; j<Object.keys(SubData.features).length; j++) {

      var name = Fires[i].region;
      var sq = Fires[i]['2019'];

      if (name == SubData.features[j].properties.name) {

        var description = '<h3>'+name+'</h3><h6>Горело <b>'+Math.round(sq*100)/100+'%</b> территории</h6>'

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
                  'fill-color': getColorCoef(sq),
                  'fill-outline-color': '#ffffff'
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
});


$('.btn').click(function() {
    var year = $(this).attr('data-year');

    for (var i=0; i<Fires.length; i++) {
        for (var j=0; j<Object.keys(SubData.features).length; j++) {

          var name = Fires[i].region;
          var sq = Fires[i][year];

          if (name == SubData.features[j].properties.name) {
              if (mymap.getLayer(SubData.features[j].id)){
                    mymap.removeLayer(SubData.features[j].id);
                }

              if (mymap.getSource(SubData.features[j].id)) {
                  mymap.removeSource(SubData.features[j].id);
              }

            var description = '<h3>'+name+'</h3><h6>Горело <b>'+Math.round(sq*100)/100+'%</b> территории</h6>'

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
                      'fill-color': getColorCoef(sq),
                      'fill-outline-color': '#ffffff'
                  }
            });
          }
        }
    }
    $('.btn').removeClass('btn-dark').addClass('btn-outline-dark');

    $(this).removeClass('btn-outline-dark').addClass('btn-dark');
});
