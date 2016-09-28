(function() {

  var Grid = function(ele_id, grid_size) {

    var square_size = 15;
    var $grid = $(ele_id)

    $grid.css({
      position: 'relative',
      margin: '0 auto',
      width: grid_size * square_size + 'px',
    });

    var $base_square = $('<span />')
      .css({
        width: square_size + 'px',
        height: square_size + 'px',
        position: 'absolute',
        border: '1px solid black',
        padding: 0,
        display: 'inline-block',
        'background-color': 'white',
      });

    var grid = [];

    for(x=0; x < grid_size; x++) {
      grid.push([]);
      for(y=0; y < grid_size; y++) {
        var $square = $base_square.clone();
        $square.css({
          left: x * square_size + 'px',
          top: y * square_size + 'px',
        });
        grid[x].push($square);
        $grid.append($square);
      }
    }

    var listGrid = function() {
      return grid;
    }

    var fillSquare = function(x, y) {
      if(validSquare(x, y)) {
        $square = grid[x][y];
        $square.css('background-color', '#5cb85c');
        $square.data('life.state', 'live');
      }
    }

    var killSquare = function(x, y) {
      if(validSquare(x, y)) {
        $square = grid[x][y];
        $square.css('background-color', 'white');
        $square.data('life.state', 'dead');
      }
    }

    var stateOf = function(x, y) {
      if(validSquare(x, y)) {
        return grid[x][y].data('life.state');
      } else {
        return 'dead';
      }
    }

    var validSquare = function(x, y) {
      return x >= 0 && y >= 0 && x < grid_size && y < grid_size;
    }

    var liveNeighbors = function(x, y) {
      var live_neighbors = [];
      var neighbors_of_node = neighbors(x, y);
      for(i in neighbors_of_node) {
        coords = neighbors_of_node[i]
        if(stateOf(coords[0], coords[1]) == 'live') { live_neighbors.push([coords[0], coords[1]]) }
      }
      return live_neighbors;
    }

    var neighbors = function(x, y) {
      var neighbors_array = [];
      for(i=-1; i <= 1; i++) {
        for(j=-1; j <= 1; j++) {
          if(i == 0 && j == 0) { continue; }
          neighbors_array.push([x+i, y+j]);
        }
      }
      return neighbors_array;
    }

    var that = {}
    that.listGrid = listGrid;
    that.reviveSquare = fillSquare;
    that.killSquare = killSquare;
    that.stateOf = stateOf;
    that.liveNeighbors = liveNeighbors;
    that.neighbors = neighbors;

    return that;
  };

  window.GameOfLife.Grid = Grid;

}());
