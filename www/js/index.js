window.onerror = function(error, file, line) {
  console.log('gerror');
  console.log(error);
  console.log(file);
  console.log(line);
};

var localFileName = 'bluecarbon.mbtiles';
var remoteFile = 'https://dl.dropbox.com/s/jllnjvlwvhfqys1/test.mbtiles?dl=1';
var msg;

var init = function() {
	var fs;
	var ft;

	msg = document.getElementById('message');
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		fs = fileSystem;

		var file = fs.root.getFile(localFileName, {create: false}, function () {
			msg.innerHTML = 'File already exists on device. Building map...';

			buildMap();
		}, function () {
      msg.innerHTML = 'Downloading file...';

			ft = new FileTransfer();
			ft.download(remoteFile, fs.root.fullPath + '/' + localFileName, function (entry) {
				buildMap();
			}, function (error) {
				console.log(error);
			});
		});
	});
}

var buildMap = function() {
	var db = window.sqlitePlugin.openDatabase(localFileName, "1.0", "Tiles", 2000000);

	document.body.removeChild(msg);
    
	var map = new L.Map('map', {
		center: new L.LatLng(24.2870, 54.3274),
		zoom: 9
	});
  
  tileLayer = new L.TileLayer.MBTiles(db, {
    tms: true
  }).addTo(map);
  
  var polygonDraw = new L.Polygon.Draw(map, {});
  polygonDraw.enable();
}

document.addEventListener("deviceready", init, false);