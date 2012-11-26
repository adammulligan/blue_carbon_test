document.addEventListener("deviceready", init, false);

var localFileName;	// the filename of the local mbtiles file
var remoteFile;		// the url of the remote mbtiles file to be downloaded
var msg;			// the span to show messages

localFileName = 'test.mbtiles';
remoteFile = 'http://dl.dropbox.com/u/14814828/OSMBrightSLValley.mbtiles';

function init() {
	var fs;
	var ft;

	msg = document.getElementById('message');
	
	window.requestFileSystem(LocalFileSystem.PERSISTENT, 0, function (fileSystem) {
		fs = fileSystem;

		// check to see if files already exists
		var file = fs.root.getFile(localFileName, {create: false}, function () {
			msg.innerHTML = 'File already exists on device. Building map...';

			buildMap();
		}, function () {
            msg.innerHTML = 'Downloading file...';

			ft = new FileTransfer();
			ft.download(remoteFile, fs.root.fullPath + '/' + localFileName, function (entry) {
				buildMap();
			}, function (error) {
				console.log('error with download', error);
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