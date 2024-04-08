$(function () {
  const ameniNames = {};
  (function () {
    $('.amenities ul input[type="checkbox"]').each(function () {
      $(this).on('click', function (e) {
        const checkbox = $(this);
        const name = checkbox.parent().text();
        if (checkbox.prop('checked')) {
          ameniNames[name] = true;
        } else {
          delete ameniNames[name];
        }
        let ameniStr = '';
        const ameniArr = Object.keys(ameniNames);
        for (const name in ameniNames) {
          ameniStr = ameniStr + name;
          if (ameniArr.indexOf(name) + 1 !== ameniArr.length) {
            ameniStr = ameniStr + ', ';
          }
        }
        $('.amenities h4').text(ameniStr);
      });
    });
  })();
  (function () {
    $.ajax('http://0.0.0.0:5001/api/v1/status/').done(function (api) {
      if (api.status === 'OK') {
        $('#api_status').addClass('available');
      } else {
        $('#api_status').removeClass('available');
      }
    });
  })();
  function searchPlaces (filters = {}) {
    $.ajax({
      url: 'http://0.0.0.0:5001/api/v1/places_search/',
      contentType: 'application/json; charset=utf-8',
      type: 'POST',
      data: JSON.stringify(filters)
    })
      .done(function (places) {
        console.log(places);
        places = places.sort(function (place1, place2) {
          if (place1.name < place2.name) {
            return -1;
          } else if (place1.name > place2.name) {
            return 1;
          }

          return 0;
        });
        const placesHtml = [];
        places.forEach(function (place) {
          const placeHtml = `
          <article>
          <div class="title_box">
            <h2>${place.name}</h2>
            <div class="price_by_night">$${place.price_by_night}</div>
          </div>
          <div class="information">
            <div class="max_guest">${place.max_guest} Guest${place.max_guest !== 1 ? 's' : ''}</div>
            <div class="number_rooms">${place.number_rooms} Bedroom${place.number_rooms !== 1 ? 's' : ''}</div>
            <div class="number_bathrooms">${place.number_bathrooms} Bathroom${place.number_bathrooms !== 1 ? 's' : ''}</div>
          </div>
          <div class="user">
          </div>
          <div class="description">
            ${place.description}
          </div>
        </article>
        `;
          placesHtml.push(placeHtml);
        });
        $('section.places').append(...placesHtml);
      });
  }
  function amenitiesFilter () {
    let amenIds = [];
    let amenObjs = [];
    const ameniArr = Object.keys(ameniNames);
    $.ajax('http://0.0.0.0.:5001/api/v1/amenities/').done(function (amenities) {
      amenObjs = amenities.filter(function (ameni) {
        for (let i = 0; i < ameniArr.length; i++) {
          if (ameni.name === ameniArr[i]) {
            return 1;
          }
        }
        return 0;
      });
      amenIds = amenObjs.map(function (ameni) {
        return ameni.id;
      });
      searchPlaces({ amenities: amenIds });
    });
  }
  $('button').on('click', amenitiesFilter);
  searchPlaces();
});
