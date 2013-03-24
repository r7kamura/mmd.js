var getDataView = function(url, callback) {
  var request = new XMLHttpRequest();
  request.open('GET', '/data/example.pmx');
  request.responseType = 'arraybuffer';
  request.send();
  request.onreadystatechange = function() {
    if (request.readyState === 4) {
      var buffer   = request.response;
      var dataView = new DataView(buffer);
      callback(dataView);
    }
  };
};

getDataView('/data/example.pmx', function(dataView) {
  console.log(dataView);
});
