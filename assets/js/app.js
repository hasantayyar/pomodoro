var pomodoro = 25 * 60;
var pomodoroRest = 5 * 60;
var pomodoroStatus = 0; //0:init 1:running a pomodoro 2:having rest 3:pomodoro completed 4:rest completed
var reminderTxt = '';

$(function() {
    loadSettings();
    drawClock();
    var btn_start = $('#startBtn');
    var btn_stop = $('#stopBtn');
    var bar_progress = $('#mainTimeProgress');

    btn_start.click(function() {
        $("#progress").slideDown("fast");
        if (pomodoroStatus === 0 || pomodoroStatus === 1 || pomodoroStatus === 4) {    //start new pomodoro
            mainCounter = pomodoro;
            pomodoroStatus = 1;
            toggleProgress();
            btn_start.everyTime('1s', function() {
                mainCounter--;
                $('#pomodoroTimer').html(s2Str(mainCounter));
                prog = Math.floor(mainCounter / pomodoro * 100);
                bar_progress.width(prog + '%');
                if (prog < 50 && prog > 20 && !bar_progress.hasClass("progress-warning")) {
                    bar_progress.parent().removeClass("progress-success")
                            .addClass("progress-warning");
                }
                if (prog < 20 && !bar_progress.hasClass("progress-danger")) {
                    bar_progress.parent().removeClass("progress-warning")
                            .addClass("progress-danger");
                }
                if (mainCounter === 0) {
                    pomodoroStatus = 3;
                    btn_start.html('Have a rest');
                    btn_start.removeClass('btn-primary').addClass('btn-success');
                    document.getElementById("ding").play();
		    stopCounter();
                }
            });
        } else if (pomodoroStatus === 2 || pomodoroStatus === 3) { // start having a rest
            mainCounter = pomodoroRest;
            pomodoroStatus = 2;
            toggleProgress();
            btn_start.everyTime('1s', function() {
                mainCounter--;
                $('#pomodoroTimer').html(s2Str(mainCounter));
                bar_progress.width(mainCounter / pomodoroRest * 100 + '%');

                if (mainCounter === 0) {
                    pomodoroStatus = 4;
                    btn_start.html('Start Pomodoro');
                    btn_start.removeClass('btn-success').addClass('btn-primary');
                    stopCounter();
                }
            });
        }

    });

    $('#settitleBtn').click(function() {
        var inputText = $('input[name="reminderText"]').val();
        var titleContainer = $('#titleContainer');
        if ($.trim(inputText) !== '') {
            titleContainer.html($.trim(inputText));
            titleContainer.show();
        } else {
            titleContainer.hide();
        }
        $('#txtModal').modal('hide');
        saveSettings();
        return false;
    });

    $('#setTimerBtn').click(function() {
        pomodoroStatus = 0
        stopCounter();
        drawClock();
        saveSettings();
        $('#txtModal2').modal('hide');
    });

    $('input[name="pomodoroDuration"]').on('change', function() {
        pomodoro = $(this).val() * 60;
    });

    $('input[name="restDuration"]').on('change', function() {
        pomodoroRest = $(this).val() * 60;
     });

    $('#txtModal').on('shown', function() {
        $('input[name="reminderText"]').focus();
    });

    $('#txtModal2').on('shown', function() {
         $('input[name="pomodoroDuration"]').val(pomodoro / 60);
        $('input[name="restDuration"]').val(pomodoroRest / 60);
    });
 

    function drawClock() {
        $('#pomodoroTimer').html(s2Str(pomodoro));
    }

    $('input[name="reminderText"]').keypress(function(e) {
        if (e.keyCode === 13) {
            $('#settitleBtn').click();
            return false;
        }
    });

    btn_stop.click(function() {
        if (pomodoroStatus === 1 || pomodoroStatus === 2) {
            stopCounter();
            toggleProgress();
        }
    });

    btn_start.click(function() {
        btn_start.addClass('disabled');
        btn_stop.removeClass('disabled');
    });

    function stopCounter() {
        btn_start.stopTime();

        btn_start.removeClass('disabled');
        btn_stop.addClass('disabled');
    }

    function toggleProgress() {
        bar_progress.parent().toggleClass('active');
    }

    function s2Str(seconds) {
        var sec = seconds % 60;
        var min = Math.floor(seconds / 60);
        return min + ':' + (sec < 10 ? '0' : '') + sec;
    }

    function loadSettings() {
	Notification.requestPermission();
        if (window.localStorage) {
            var a, b, c;
            var storage = window.localStorage;
            if (a = storage.getItem('pomodoro')) {
                pomodoro = parseInt(a);
            }
            if (b = storage.getItem('pomodoroRest')) {
                pomodoroRest = parseInt(b);
            }
            if (c = storage.getItem('reminderTxt')) {
                reminderTxt = parseInt(c);
            }
        }
    }

    function saveSettings() {
        if (window.localStorage) {
            var storage = window.localStorage;
            storage.setItem('pomodoro', pomodoro);
            storage.setItem('pomodoroRest', pomodoroRest);
            storage.setItem('reminderTxt', reminderTxt);
        }
    }
});
