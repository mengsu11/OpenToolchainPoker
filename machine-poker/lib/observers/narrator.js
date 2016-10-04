// Generated by CoffeeScript 1.6.3
(function() {
  var Card, Hand, actionString, narratorLog, narratorLogAction, narratorLogState, playerInfoString;

  Hand = require("../../hoyle").Hand;

  Card = require('../../hoyle').Card;

  redColor   = '\033[31m' + '\033[47m';
blueColor  = '\033[34m' + '\033[47m';
resetColor = '\033[0m';

  narratorLogAction = function(logStr) {
    return console.log(redColor + logStr + resetColor);
  };

  narratorLogState = function(logStr) {
    return console.log(blueColor + logStr + resetColor);
  };

  narratorLog = function(logStr) {
    return console.log(logStr);
  };

  playerInfoString = function(player, communityCards) {
    var c, card, handName, playerCards, _i, _len, _ref;
    playerCards = "";
    if (player.cards != null) {
      _ref = player.cards;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        card = _ref[_i];
        playerCards += card + " ";
      }
      if (communityCards != null) {
        playerCards = (function() {
          var _j, _len1, _ref1, _results;
          _ref1 = player.cards;
          _results = [];
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            c = _ref1[_j];
            _results.push(new Card(c));
          }
          return _results;
        })();
        c = [];
        c = c.concat(communityCards);
        c = c.concat(playerCards);
        handName = Hand.make(c).name;
        if ((handName != null) && handName !== 'High card') {
          playerCards += " (" + handName + ")";
        }
      }
    }
    return "" + player.name + " ($" + player.chips + ") " + playerCards;
  };

  actionString = function(action, bet) {
    switch (action) {
      case 'bet':
        return 'bet $' + bet;
      case 'raise':
        return 'raised by $' + bet;
      case 'fold':
        return 'folded';
      case 'allIn':
        return 'went ALL IN with $' + bet;
      case 'call':
        return 'called $' + bet;
      case 'check':
        return 'checked';
    }
  };

  exports.roundStart = function(status) {
    var player, _i, _len, _ref, _results;
    narratorLog(" ");
    narratorLogState("==== Round #" + status.hand + " starting ====");
    narratorLogState(status.players.length + " players:");
    _ref = status.players;
    _results = [];
    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
      player = _ref[_i];
      _results.push(narratorLogState("  " + playerInfoString(player, null)));
    }
    return _results;
  };

  exports.betAction = function(player, action, bet, err) {
    if (err) {
      return narratorLogAction("  " + player.name + " failed to bet: " + err);
    } else {
      return narratorLogAction("  " + player.name + " " + (actionString(action, bet)));
    }
  };

  exports.stateChange = function(status) {
    var c, card, cards, communityCards, player, pot, stateName, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4, _results;
    stateName = status.state;
    narratorLog(" ");
    narratorLogState("-- " + stateName);
    if (stateName === 'pre-flop') {
      _ref = status.players;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        player = _ref[_i];
        narratorLogState("  " + (playerInfoString(player, null)));
      }
      _ref1 = status.players;
      _results = [];
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        player = _ref1[_j];
        if (player.blind > 0) {
          _results.push(narratorLogAction("  " + player.name + "  paid a blind of $" + player.blind));
        } else {
          _results.push(void 0);
        }
      }
      return _results;
    } else {
      cards = "";
      _ref2 = status.community;
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        card = _ref2[_k];
        cards = cards + card + " ";
      }
      narratorLogState(" Cards are: " + cards);
      pot = 0;
      _ref3 = status.players;
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        player = _ref3[_l];
        if (player.wagered != null) {
          pot += player.wagered;
        }
      }
      narratorLogState(" Pot is: " + pot);
      communityCards = (function() {
        var _len4, _m, _ref4, _results1;
        _ref4 = status.community;
        _results1 = [];
        for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
          c = _ref4[_m];
          _results1.push(new Card(c));
        }
        return _results1;
      })();
      _ref4 = status.players;
      for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
        player = _ref4[_m];
        if (player.state === 'active' || player.state === 'allIn') {
          narratorLogState("  " + (playerInfoString(player, communityCards)));
        }
      }
      return narratorLogAction(" Actions: ");
    }
  };

  exports.complete = function(status) {
    var card, cardString, handName, player, winner, winningPlayer, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2;
    narratorLog(" ");
    narratorLogState("Round #" + status.hand + " complete.");
    if (status.winners.length > 1) {
      narratorLogState("Winners are:");
      _ref = status.winners;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        winner = _ref[_i];
        narratorLogState("" + status.players[winner.position].name + " with " + status.players[winner.position].handName + ". Amount won: $" + (+winner.amount));
      }
    } else {
      winningPlayer = status.players[status.winners[0].position];
      handName = "";
      if (winningPlayer.handName != null) {
        handName = "with " + winningPlayer.handName;
      }
      narratorLogState("Winner was " + winningPlayer.name + " " + handName + " Amount won: $" + status.winners[0].amount);
    }
    narratorLogState("Positions: ");
    _ref1 = status.players;
    for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
      player = _ref1[_j];
      cardString = "";
      if (player.cards != null) {
        _ref2 = player.cards;
        for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
          card = _ref2[_k];
          cardString += card + " ";
        }
      }
      handName = "";
      if (player.handName != null) {
        handName = "(" + player.handName + ")";
      }
      narratorLogState("" + player.name + " ($" + player.chips + ") had " + cardString + " " + handName);
    }
    return narratorLogState("=================================");
  };

}).call(this);
