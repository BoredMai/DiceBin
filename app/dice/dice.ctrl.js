(function() {
  'use strict'

  angular.module('diceApp').controller('DiceController', DiceController);

//   AdvancedController.$inject = ['$http', '$route', 'gameData'];

  function DiceController() {
    var vm = this;

    vm.formula = '';
    vm.result = '';
    vm.isKeep = false;

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
        if (!vm.formula.match(/([0-9]+)([dk])([0-9]+)([+-][0-9]+)?/g)) {
            console.log('CAN\'T ACCEPT');
            return;
        }

        var formula = vm.formula.toLowerCase();
        var numDice = formula.match(/^\d+/g)[0];
        formula = formula.replace(numDice, '');
        formula = formula.replace(/^[dk]/g, '');
        var sideOrKeep = formula.match(/^\d+/g)[0];
        formula = formula.replace(sideOrKeep, '');
        var match = formula.match(/^[+-]\d*/g);
        
        if (match) {
            var mod = parseInt(match[0]);
        }

        console.log(numDice, sideOrKeep, mod);
    }

    function onKeyDown(e) {
        var allowedKeys = [46, 8, 9, 27, 13, 110, 68, 75, 107, 109];
        // Allow: backspace, delete, tab, escape, enter and . || Additions: d, k, +, -
        if (allowedKeys.indexOf(e.keyCode) !== -1 ||
             // Allow: Ctrl+A, Command+A
            (e.keyCode === 65 && (e.ctrlKey === true || e.metaKey === true)) || 
             // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40) ||
            (e.shiftKey && e.keyCode === 187) || (!e.shiftKey && e.keyCode === 189)) {
                 // let it happen, don't do anything
                 return;
        }

        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    }

    function onKeyUp(e) {
        var formula = vm.formula.toLowerCase();
        var newFormula = '';

        // [qty]
        var match = formula.match(/^\d+/g);
        if (match)
        {
            newFormula += match[0];
            formula = formula.replace(match[0], '');

            // [k | d]
            match = formula.match(/^[dk]/g);
            if (match) {
                newFormula += match[0];
                formula = formula.replace(match[0], '');
                vm.isKeep = match[0] === 'k';

                // [keep | sides]
                match = formula.match(/^\d+/g);
                if (match)
                {
                    newFormula += match[0];
                    formula = formula.replace(match[0], '');

                    match = formula.match(/^[+-]\d*/g);
                    
                    if (match) {
                        var mod = parseInt(match[0]);
                        if (isNaN(mod) || mod === 0) {
                            newFormula += match[0];
                        } else {
                            newFormula += mod > 0 ? '+' + mod.toString() : mod.toString();
                        }
                    }
                }
            }
        }
        vm.formula = newFormula;
    }
  }
})();
