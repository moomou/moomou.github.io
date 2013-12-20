// Generated by IcedCoffeeScript 1.6.3-e

/*
# Basic idea of the game, iterate from a to z, ask user to put
# unix commands starting with the letter; the more cmd, the more
# score; 3 seconds per letter
*/

(function() {
  var CMD_SCORE, FinishGame, LETTER_TIME, MAX_SCORE, MoveToNextLetter, SetTimer, StartGame, ValidationCheck, getRefURL, inputBox, instruction, score, startBtn, timer, _currentLetter, _missingLetters, _score, _timerInterval, _timerTimeout;



  getRefURL = function(letter) {
    return "http://unixhelp.ed.ac.uk/alphabetical/m" + letter + ".html";
  };

  CMD_SCORE = 100;

  LETTER_TIME = 5;

  MAX_SCORE = CMD_SCORE * 1299;

  startBtn = document.getElementById('startBtn');

  inputBox = document.getElementById('inputBox');

  timer = document.getElementById('timer');

  score = document.getElementById('score');

  instruction = document.getElementById('instruction');

  _score = 0;

  _currentLetter = 0;

  _timerInterval = null;

  _timerTimeout = null;

  _missingLetters = [];

  FinishGame = function() {
    var finalComment, ind, letter, letters, rank, _i, _len;
    rank = _score / CMD_SCORE * 25;
    rank = parseInt(rank * 10);
    finalComment = "Your score is " + _score + ". <br><br>";
    if (_missingLetters.length === 0) {
      finalComment += "You got everything!";
    } else {
      letters = "";
      for (ind = _i = 0, _len = _missingLetters.length; _i < _len; ind = ++_i) {
        letter = _missingLetters[ind];
        if (letter) {
          letters += "<a target='_blank' href='" + (getRefURL(letter)) + "'> " + letter + "</a> ";
        }
      }
      letters = letters.slice(0, -1);
      finalComment += "You missed " + letters + ".";
    }
    instruction.innerHTML = finalComment;
    inputBox.setAttribute("class", "hide");
    score.setAttribute("class", "hide");
    return timer.setAttribute("class", "hide");
  };

  ValidationCheck = function() {
    var ind, input, inputs, success, _i, _len;
    inputs = inputBox.value.split(",");
    success = false;
    for (ind = _i = 0, _len = inputs.length; _i < _len; ind = ++_i) {
      input = inputs[ind];
      if (window.allCmd[input.toLowerCase()]) {
        _score += CMD_SCORE;
        success = true;
      }
    }
    if (!success) {
      _missingLetters.push(window.aToZ[_currentLetter - 1]);
    }
    return inputBox.value = "";
  };

  SetTimer = function() {
    var localTime;
    localTime = LETTER_TIME;
    _timerInterval = setInterval(function(e) {
      localTime -= 1;
      return timer.innerHTML = "Time Left " + localTime + "s";
    }, 1000);
    return _timerTimeout = setTimeout(function(e) {
      instruction.text = "Time up";
      clearInterval(_timerInterval);
      return MoveToNextLetter();
    }, LETTER_TIME * 1000);
  };

  MoveToNextLetter = function() {
    ValidationCheck();
    if (_currentLetter >= window.aToZ.length) {
      FinishGame();
      return;
    }
    timer.innerHTML = "Time Left " + LETTER_TIME + "s";
    score.innerHTML = "Score " + _score;
    instruction.innerHTML = window.aToZ[_currentLetter];
    instruction.setAttribute("class", "center");
    SetTimer();
    return _currentLetter += 1;
  };

  StartGame = function() {
    var _SCORE;
    _SCORE = 0;
    startBtn.setAttribute("class", "hide");
    inputBox.setAttribute("class", "");
    inputBox.addEventListener("keydown", function(e) {
      if (e.keyCode === 13) {
        clearTimeout(_timerTimeout);
        clearInterval(_timerInterval);
        return MoveToNextLetter();
      }
    });
    return MoveToNextLetter();
  };

  startBtn.addEventListener("click", function(e) {
    return StartGame();
  });

}).call(this);
