$(function () {
  const ameniNames = {};
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
});
