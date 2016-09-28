(function() {

  var PauseResumeBtn = function(e) {
    $btn = $(this);
    $btn.html() == 'Start' ? $btn.html('Pause') : $btn.html('Start');
    $(document).trigger('GameOfLife.pause_resume_btn.clicked');
  }

  var ActionsBar = function(ele_id) {

    $actions_bar_container = $(ele_id);
    $start_stop_btn = $("<button class='btn btn-primary'>Pause</button>").on('click', PauseResumeBtn);

    $actions_bar_container.append($start_stop_btn);
  };

  window.GameOfLife.ActionsBar = ActionsBar;

}());
