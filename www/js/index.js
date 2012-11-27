document.addEventListener("deviceready", init, false);

var localFileName = 'test.mbtiles';
var remoteFile = 'https://dl.dropbox.com/s/jllnjvlwvhfqys1/test.mbtiles?dl=1';
var msg;

function init() {
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

function buildMap() {
	var db = window.sqlitePlugin.openDatabase(localFileName, "1.0", "Tiles", 2000000);

	document.body.removeChild(msg);

	var map = new L.Map('map', {
		center: new L.LatLng(40.6681, -111.9364),
		zoom: 11
	});

	var lyr = new L.TileLayer.MBTiles('', {maxZoom: 14, scheme: 'tms'}, db);

	map.addLayer(lyr);
}