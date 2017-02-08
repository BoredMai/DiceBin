(function() {
  'use strict'

  angular.module('diceApp').controller('DiceController', DiceController);

//   DiceController.$inject = ['$location', '$anchorScroll'];

  function DiceController() {
    var vm = this;

    vm.formula = '';
    vm.result = '';
    vm.isKeep = false;
    vm.explode = false;
    vm.errorMessage = '';

    vm.quickRoll = quickRoll;
    vm.customRoll = customRoll;
    vm.onKeyUp = onKeyUp;
    vm.onKeyDown = onKeyDown;

    activate();

    function activate() {
    }

    function quickRoll(formula) {
        vm.formula = formula;
        vm.customRoll();
    }

    function customRoll() {
        vm.errorMessage = '';
        vm.result = '';

        if (!vm.formula.match(/[0-9]+(([d][0-9]+([k][0-9]+)?)|(([d][0-9]+)?[k][0-9]+))([+-][0-9]+)?/g)) {
            vm.errorMessage = 'Please input a formula in the correct format.'
            return;
        }

        var regex = /([0-9]+)(?:[d])?([0-9]+)?(?:[k])?([0-9]+)?([+-][0-9]+)?/g;
        var match = regex.exec(vm.formula.toLowerCase());
        
        var numDice = parseInt(match[1]);
        var numSides = match[2] ? parseInt(match[2]) : 10;
        var numKeep = match[3] ? parseInt(match[3]) : numDice;
        var mod = match[4];
        var numExploding = 0;
        
        if (numKeep > numDice) {
            vm.errorMessage = 'You can\'t keep more dices than you\'re rolling!'
            return;
        }

        var rollArray = [];
        for (var i = 0; i < numDice; i++) {
            var roll = Math.ceil(Math.random() * numSides);
            rollArray.push(roll);
            if (vm.explode && roll === numSides) {
                numExploding++;
            }
        }

        rollArray.sort(function(a, b) { return a - b; }).reverse();

        vm.result += "<p>Rolls: " + rollArray.toString().replace(/,/g, ', ') + '</p>';

        var keepArray = rollArray.slice(0, numKeep);
        if (numKeep < numDice) {
            vm.result += '<p>Keeping: ' + keepArray.toString().replace(/,/g, ', ') + '</p>';
        }

        if (vm.explode) {
            if (numExploding > 0) {
                while (numExploding > 0) {
                    vm.result += '<p>' + numExploding + ' exploded!</p>';
                    var numExplosions = numExploding;
                    numExploding = 0;

                    var explodeArray = [];
                    for (var i = 0; i < numExplosions; i++) {
                        var explode = Math.ceil(Math.random() * numSides);
                        explodeArray.push(explode);
                        if (explode === numSides) {
                            numExploding++;
                        }
                    }

                    explodeArray.sort(function(a, b) { return a - b; }).reverse();
                    keepArray = keepArray.concat(explodeArray);
                    
                    vm.result += '<p> Exploded into: ' + explodeArray.toString().replace(/,/g, ', ') + '</p>';
                }
                vm.result += '<p>After exploding: ' + keepArray.toString().replace(/,/g, ', ') + '</p>';
            }
        }

        var total = keepArray.reduce(function(a, b) { return a + b; }, 0);
        vm.result += '<p>Total: ' + total.toString();
        if (mod) {
            vm.result += mod + ' = ' + (total + parseInt(mod)).toString();
        }
        vm.result += '</p>';
    }

    function onKeyDown(e) {
        var allowedKeys = [46, 8, 9, 27, 13, 110, 68, 75, 107, 109];
        // Allow: backspace, delete, tab, escape, enter and . || Additions: d, k, +, -
        if (allowedKeys.indexOf(e.keyCode) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) ||
            // Number Row + and -
            (e.key === '+' || e.key === '-')) {
                 // let it happen, don't do anything
                 return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    function onKeyUp(e) {
        var regex = /([0-9]+)([d])?([0-9]+)?([k])?([0-9]+)?([+-])?([0-9]+)?/g;
        var match = regex.exec(vm.formula.toLowerCase());
        vm.formula = match ? match[0] : '';
        vm.isKeep = vm.formula.indexOf('k') !== -1;
        
        if (e.keyCode === 13) {
            vm.customRoll();
        }
    }
  }
})();
