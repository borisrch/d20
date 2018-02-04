// player attributes
var damage = 6;
var armour = 8;
var health = 100;
var specialModifier = 2;

var recharge = 4;
var cooldown = false;
var future;
var repeater;

// monster attributes
var monsterArmour = 5;
var monsterHealth = 20;
var monsterDamage = 6;
var monsterCount = 0;

var monster = ["Goblin", "Hill Giant", "Minotaur", "Werewolf", "Griffin", "Red_Dragon"];
var weapon = ["Shortsword","Scimitar", "Great-axe", "Mithril Whip", "Scythe"];
var weaponCount = 0;
var weaponSpecial = ["Swashbuckle", "Raze", "Wretched Sunder", "Life Lasso", "Icarian Guillotine"]

var turn = 0;
var playerTurn = 0;

function update() {
    $("#monster-health").html(monsterHealth);
    $("#player-health").html(health);
};

function render() {

};

function handler(action) {

    $('#attack').attr('disabled', 'disabled');
    $('#special').attr('disabled', 'disabled');
    $('#heal').attr('disabled', 'disabled');
    $('#flee').attr('disabled', 'disabled');

    if (action == "attack") {
        attackHandler();
        setTimeout(enable, 1000);
    } else if (action == "special") {
        specialHandler();
        setTimeout(enable, 1000);
    } else if (action == "heal") {

        //HANDLER HERE
        setTimeout(enable, 1000);
    } else if (action == "flee") {

        //HANDLER HERE
        setTimeout(enable, 1000);
    }
}

function enable() {
    $('#attack').removeAttr('disabled');
    $('#special').removeAttr('disabled');
    $('#heal').removeAttr('disabled');
    $('#flee').removeAttr('disabled');
}

function attackHandler() {
    turn++;
    playerTurn++;
    let result = attack(damage, monsterArmour, 1);
    if (result != 0) {
        updateLog('<b>You</b> hit for ' + result + ' damage! ' + 'Turn: ' + turn);

        if (result >= monsterHealth) {
            // Damage more than monster's health
            $("#monster-health").html("0");
            monsterDeath();
        } else {
            // Damage less than monster's health
            monsterHealth = monsterHealth - result;
            update();
            setTimeout(function () {
                monsterAttack(monsterCount);
            }, 1000);
        }
    } else {
        updateLog('<b>You</b> missed! ' + 'Turn: ' + turn);
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);
    }
};

function specialHandler() {

    if (!cooldown) {

        turn++;
        playerTurn++;
        cooldown = true;
        future = playerTurn + 4;
        checkCD();

        switch(weaponCount) {
            // Shortsword
            case 0:
            
            let result = attack(damage, monsterArmour, specialModifier);
            if (result != 0) {
                updateLog('<b>You</b> hit for ' + result + ' damage! ' + 'Turn: ' + turn);
        
                if (result >= monsterHealth) {
                    // Damage more than monster's health
                    $("#monster-health").html("0");
                    monsterDeath();
                } else {
                    // Damage less than monster's health
                    monsterHealth = monsterHealth - result;
                    update();
                    setTimeout(function () {
                        monsterAttack(monsterCount);
                    }, 1000);
                }
            } else {
                updateLog('<b>You</b> missed! ' + 'Turn: ' + turn);
                setTimeout(function () {
                    monsterAttack(monsterCount);
                }, 1000);
            }
            break;

            case 1:
        }

        
    } 
    // Not enough mana logic.
    else {
        console.log("Not Ready.");
        
    }
    
}

function checkCD() {
    if(playerTurn >= future){
        cooldown = false;
    }
    repeater = setTimeout(checkCD, 1000);
}

function monsterAttack(monsterCount) {
    switch (monsterCount) {
        case 0:
            goblin();
            break;

        case 1:

            break;
    }
}

function goblin() {
    turn++;
    let result = attack(monsterDamage, armour, 1);
    if (result != 0) {
        updateLog('<b>Goblin</b> hit you for ' + result + ' damage! ' + 'Turn: ' + turn)

        if (result >= health) {
            // Player dead
        } else {
            health = health - result;
            update();
        }

    } else {
        updateLog('<b>Goblin</b> missed! ' + 'Turn: ' + turn)
    }

}

function monsterDeath() {
    updateLog('You have slain: ' + monster[monsterCount]);
    weaponCount++;
    updateLog(monster[monsterCount] + 'dropped: ' + weapon[weaponCount]);
    monsterCount++;
    updateLog('A new challenger approaches... ' + monster[monsterCount] + ".");
    $('#monster-name').html(monster[monsterCount]);

    switch (monsterCount) {
        case 1:
            monsterHealth = 40;
            damage = 8;
            $('#mySelect').append($('<option>', {
                value: 2,
                text: weapon[weaponCount]
            }));
            update();
            break;
        case 2:
            monsterHealth = 60;
            break;
    }
}

// Damage of weapon, and armour class of opponent, and multiplier of dice n(Dx)

function attack(damage, armour, multiplier) {
    let result = 0;    
    let hit = roll(20);
    if (hit >= armour) {
        for(let i = 0 ; i < multiplier ; i++) {            
            result += roll(damage);
        }        
        return result;
    } else {
        result = 0;
        return result;
    }
};

function roll(max) {
    var roll;
    min = 1;
    max = Math.floor(max);
    roll = Math.floor(Math.random() * (max - min + 1)) + min; //The maximum is inclusive and the minimum is inclusive
    return roll;
};

function updateLog(String, style) {
    var table = document.getElementById("table-log");
    var tableLength = document.getElementById("table-log").rows.length;
    if (tableLength > 4) {
        table.deleteRow(4);
        var row = table.insertRow(0);
        row.innerHTML = String;
        row.className += style;
    } else {
        var row = table.insertRow(0);
        row.innerHTML = String;
        row.className += style;
    }
}

// Tippy code

$(document).ready(function () {

    let attack = "Make an attack roll!";
    let special = "Perform a special attack. Specials are recharged after " + recharge + " of your turns."

    $('#attack').attr('title', attack);
    $('#special').attr('title', special);

    tippy('.attack', {
        placement: 'bottom',
        animation: 'fade',
        arrow: true
    });

    tippy('.special', {
        placement: 'bottom',
        animation: 'fade',
        arrow: true
    });
   
});