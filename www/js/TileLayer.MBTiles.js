L.TileLayer.MBTiles = L.TileLayer.extend({
	db: null,

	initialize: function(url, options, db) {
		this.db = db;

		L.Util.setOptions(this, options);
	},
	getTileUrl: function (tilePoint, zoom, tile) {
		var z = this._getOffsetZoom(zoom);
		var x = tilePoint.x;
		var y = tilePoint.y;
		var base64Prefix = 'data:image/gif;base64,';

        this.db.transaction(function(tx) {
            tx.executeSql(
                "SELECT tile_data FROM images " +
                "INNER JOIN map ON images.tile_id = map.tile_id " +
                "WHERE zoom_level = ? " +
                "AND tile_column = ? " +
                "AND tile_row = ?",
//                "SELECT tile_data FROM tiles " +
//                "WHERE zoom_level = ? " +
//                "AND tile_column = ? " +
//                "AND tile_row = ?",
                [z, x, y],
                function (tx, res) {
                    tile.src = base64Prefix + res.rows.item(0).tile_data;
                },
                function (er) {
                    console.log('error with executeSql', er);
                }
            );
        });


	},
	_loadTile: function (tile, tilePoint, zoom) {
		tile._layer = this;
		tile.onload = this._tileOnLoad;
		tile.onerror = this._tileOnError;
		this.getTileUrl(tilePoint, zoom, tile);
	}
});