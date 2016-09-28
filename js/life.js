(function(){

  var grid, actions_bar, grid_size, $game, game_paused = false;
  var live_squares = {}

  var start = function(dom_id, actions_dom_id, size=50) {
    grid_size = size;
    $game = $(dom_id);
    grid = window.GameOfLife.Grid(dom_id, size);
    actions_bar = window.GameOfLife.ActionsBar(actions_dom_id);

    populate_initial_state();
    bindEvents();
    start_game();
  }

  var bindEvents = function() {
    $(document).on('GameOfLife.pause_resume_btn.clicked', pause_resume_game);
  }

  var pause_resume_game = function() {
    game_paused = !game_paused;
  }

  var populate_initial_state = function() {
    x_point = grid_size / 2;

    initial_state = [
      {x: x_point, y: x_point},
      {x: x_point + 1, y: x_point},
      {x: x_point + 1, y: x_point + 2},
      {x: x_point + 3, y: x_point + 1},
      {x: x_point + 4, y: x_point},
      {x: x_point + 5, y: x_point},
      {x: x_point + 6, y: x_point},
    ]

    for(i in initial_state) {
      point = initial_state[i];
      grid.reviveSquare(point.x, point.y);
      live_squares[[point.x, point.y]] = true
    }
  }

  var start_game = function() {
    $game.data('gameOfLife', setInterval(function() {
      if(!game_paused) { step(); }
    }, 50));
  }

  var step = function() {
    var squares_to_kill = [];
    var squares_to_revive = [];

    for(i in live_squares) {
      var coords = i.split(',');
      var x = parseInt(coords[0]), y = parseInt(coords[1]);
      if(shouldKillSquare(x, y)) { squares_to_kill.push([x, y]) };

      var neighbors = grid.neighbors(x, y);
      for(j in neighbors) {
        var coords = neighbors[j];
        var x = coords[0], y = coords[1];
        if(shouldReviveSquare(x, y)) { squares_to_revive.push([x, y]) };
      }
    }

    killSquares(squares_to_kill);
    reviveSquares(squares_to_revive);
  }

  var shouldKillSquare = function(x, y) {
    var number_of_live_neighbors = totalLiveNeighbors(x, y);
    return (number_of_live_neighbors < 2 || number_of_live_neighbors > 3);
  }

  var shouldReviveSquare = function(x, y) {
    return totalLiveNeighbors(x, y) == 3;
  }

  var killSquares = function(squares) {
    for(i in squares) {
      coords = squares[i];
      delete live_squares[coords];
      grid.killSquare(coords[0], coords[1]);
    }
  }

  var reviveSquares = function(squares) {
    for(i in squares) {
      coords = squares[i];
      live_squares[coords] = true;
      grid.reviveSquare(coords[0], coords[1]);
    }
  }

  var totalLiveNeighbors = function(x, y) {
    var neighbors = grid.neighbors(x, y);
    var live_from_grid = grid.liveNeighbors(x, y);
    var diff = arr_diff(neighbors, live_from_grid);
    var count = live_from_grid.length;

    for(var i in diff) {
      coords = diff[i].split(',');
      var x = parseInt(coords[0]), y = parseInt(coords[1]);
      if(live_squares[[x, y]] !== undefined) { count++; }
    }
    return count;
  }

  var arr_diff = function(a1, a2) {
    var a = [], diff = [];
    for (var i = 0; i < a1.length; i++) { a[a1[i]] = true; }
    for (var i = 0; i < a2.length; i++) {
      if (a[a2[i]]) {
        delete a[a2[i]];
      } else {
        a[a2[i]] = true;
      }
    }
    for (var k in a) { diff.push(k); }
    return diff;
  };

  window.GameOfLife.start = start;
}());
