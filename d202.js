// player attributes
var damage = 6;
var armour = 8;
var health = 100;
var specialModifier = 2;

var cooldown = 0;

// monster attributes
var monsterArmour = 5;
var monsterHealth = 20;
var monsterDamage = 6;
var monsterCount = 0;

var monster = ["Goblin", "Hill Giant", "Minotaur", "Werewolf", "Griffin", "Red Dragon"];
var weapon = ["Shortsword", "Scimitar", "Great-axe", "Mithril Whip", "Scythe", "Aegis of the Immortal"];

// Used for select logic, and special selector

var select = "Shortsword";
var weaponCount = 0;
var weaponSpecial = ["Swashbuckle", "Raze", "Wretched Sunder", "Soul Split", "Elven Guillotine"]

var turn = 0;
var currentPotion = 4;
var healTurn = 0;

// Used for Griffin's special next turn recoil ability.

var griffinVar = 80;
var griffinToggle = false;

// Used for block ability
var armourBuff = false;
var normalArmour = armour;

// Dragon

var dragonAspect = 0;

function update() {
    $("#monster-health").html(monsterHealth);
    $("#player-health").html(health);
    $("#player-potion").html('Health Potions: ' + currentPotion);
    $("#player-armour").html('Armour Class: ' + armour);
};

function render() {

};

function handler(action) {


    $('#attack').attr('disabled', 'disabled');
    $('#special').attr('disabled', 'disabled');
    $('#heal').attr('disabled', 'disabled');
    $('#block').attr('disabled', 'disabled');

    if (action == "attack") {
        attackHandler();
        setTimeout(enable, 1000);
    } else if (action == "special") {
        specialHandler();
        setTimeout(enable, 1000);
    } else if (action == "heal") {
        heal();
        setTimeout(enable, 1000);
    } else if (action == "block") {
        block();
        setTimeout(enable, 1000);
    }
}


function enable() {
    $('#attack').removeAttr('disabled');
    $('#special').removeAttr('disabled');
    $('#heal').removeAttr('disabled');
    $('#block').removeAttr('disabled');
}

// Takes in from HTML. Uses Global damage, monsterArmour, monsterHealth. Increment turn and reduces special cooldown.

function attackHandler() {
    turn++;
    cooldown--;
    healTurn++;
    calcHeal();

    let result = attack(damage, monsterArmour, 1);
    if (result != 0) {
        updateLog('<b>You</b> hit for ' + result + ' damage! ' + 'Turn: ' + turn);
        soundHandler('hit');

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
        soundHandler('miss');
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);
    }
};

// Takes in from HTML. Uses Global select from weaponSwitch(). Each special has own function.

function specialHandler() {
    if (cooldown <= 0) {
        turn++;
        healTurn++;
        calcHeal();

        cooldown = 4;

        switch (select) {
            case weapon[0]:
                shortsword();
                break;

            case weapon[1]:
                scimitar();
                break;

            case weapon[2]:
                greataxe();
                break;

            case weapon[3]:
                whip();
                break;

            case weapon[4]:
                scythe();
                break;

            case weapon[5]:
                aegis();
                break;

            default:
                console.log("Error at Special handle");
                break;
        }

    } else {
        updateLog('Special Attack on cooldown for: ' + cooldown + ' turns.', 'cooldown-log');
    }
}

function shortsword() {
    let result = attack(damage, monsterArmour, specialModifier);
    if (result != 0) {
        updateLog('<b>You </b> <i>Swashbuckle</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log');
        soundHandler('Shortsword');
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
        soundHandler('miss');
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);
    }
}

function scimitar() {
    let result = attack(damage, 0, 1);
    if (result != 0) {
        updateLog('<b>You </b> <i>Raze</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log');
        soundHandler('Scimitar');
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
        updateLog('Please report bug.' + 'Turn: ' + turn);
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);
    }
}

function greataxe() {
    let result = attack(8, monsterArmour, 1);
    if (result != 0) {

        var healthOffset = 100 - health;
        healthOffset = healthOffset - (healthOffset % 10);
        healthOffset = healthOffset / 10;
        secondRoll = attack(8, 0, healthOffset);
        result = result + secondRoll;

        soundHandler('Great-axe');

        updateLog('<b>You </b> <i>Wretched Sunder</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log');

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
        soundHandler('miss');
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);
    }
}

function whip() {
    let result = attack(5, monsterArmour, 2);
    if (result != 0) {
        updateLog('<b>You </b> <i>Soul Split</i> for ' + result + ' damage, and heal for ' + result + '! ' + 'Turn: ' + turn, 'special-log');
        health += result;
        soundHandler('whip');
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
        soundHandler('miss');
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);
    }
}

function scythe() {
    let result = attack(10, monsterArmour, 3);
    if (result != 0) {
        updateLog('<b>You </b> <i>Elven Guillotine</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log');
        soundHandler('scythe');
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
        soundHandler('miss');
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);
    }
}

function aegis() {
    let result = roll(20);
    let aegis = result + 10;
    health = health + aegis;
    updateLog('Aegis of the Immortal heals you for ' + aegis + 'HP!', 'special-log');
    update();
    soundHandler('aegis');
    
    setTimeout(function () {
        monsterAttack(monsterCount);
    }, 1000);

}

// Monster attack logic. Add % for chance to hit. Seperate monster logic.

function monsterAttack(monsterCount) {
    switch (monsterCount) {
        case 0:
            goblin();
            break;

        case 1:
            hillgiant();
            break;

        case 2:
            minotaur();
            break;
        case 3:
            werewolf();
            break;
        case 4:
            griffin();
            break;
        case 5:
            dragon();
            break;
    }
}

function goblin() {
    turn++;
    let result = attack(monsterDamage, armour, 1);
    if (result != 0) {
        updateLog('<b>Goblin</b> hit you for ' + result + ' damage! ' + 'Turn: ' + turn)
        soundHandler('goblin');

        if (result >= health) {
            playerDeath();
        } else {
            health = health - result;
            update();
        }

    } else {
        updateLog('<b>Goblin</b> missed! ' + 'Turn: ' + turn);
        soundHandler('miss');
    }

}

function hillgiant() {
    turn++;
    let ability = roll(100);
    if (ability >= 70) {
        let result = attack(6, armour, 2);
        if (result != 0) {
            updateLog('<b>Hill Giant </b> <i>Gobsmacks</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('hillgiant-1');
            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Hill Giant</b> missed! ' + 'Turn: ' + turn)
            soundHandler('miss');
        }
    } else {
        let result = attack(monsterDamage, armour, 1);
        if (result != 0) {
            updateLog('<b>Hill Giant</b> hit you for ' + result + ' damage! ' + 'Turn: ' + turn)
            soundHandler('hillgiant');
            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Hill Giant</b> missed! ' + 'Turn: ' + turn)
            soundHandler('miss');
        }
    }
}

function minotaur() {
    turn++;

    // Resets armour from buff.
    monsterArmour = 10;

    var reduction = armour - 5;

    let ability = roll(100);
    console.log("Minotaur roll " + ability)
    if (ability >= 90) {
        let result = attack(8, reduction, 1);
        if (result != 0) {
            updateLog('<b>Minotaur </b> <i>Stampedes</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('minotaur-1');
            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }
        } else {
            updateLog('<b>Minotaur</b> missed! ' + 'Turn: ' + turn)
            soundHandler('miss');
        }
    } else if (ability >= 1 && ability < 21) {
        updateLog('<b>Minotaur </b> uses <i>Unbreakable!</i> buffing AC to 15 agaisnt your next attack!' + 'Turn: ' + turn, 'special-log')
        monsterArmour = 10 + 5;
        soundHandler('minotaur-2');
    } else {
        let result = attack(monsterDamage, armour, 1);
        if (result != 0) {
            updateLog('<b>Minotaur</b> hit you for ' + result + ' damage! ' + 'Turn: ' + turn)
            soundHandler('minotaur');
            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Minotaur</b> missed! ' + 'Turn: ' + turn)
            soundHandler('miss');
        }
    }

}

function werewolf() {
    turn++;

    let ability = roll(100);
    console.log("Werewolf " + ability);
    if (ability >= 90) {
        let result = attack(10, armour - 5, 1);
        if (result != 0) {
            updateLog('<b>Werewolf </b> uses <i>Fears</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('werewolf-1');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Werewolf</b> missed! ' + 'Turn: ' + turn)
            soundHandler('miss');
        }
    } else if (ability < 90 && ability >= 80) {
        let result = attack(10, armour, 2);
        if (result != 0) {
            updateLog('<b>Werewolf </b> uses <i>Predatory</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('werewolf');
            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Werewolf</b> missed! ' + 'Turn: ' + turn)
            soundHandler('miss');
        }
    } else if (ability < 80 && ability >= 60) {
        let result = attack(10, armour, 1);
        if (result != 0) {
            let special = roll(12);
            monsterHealth = monsterHealth + special;
            updateLog('<b>Werewolf </b> uses <i>Regenerate</i> for ' + special + ' HP, and deals ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('werewolf-2');
            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Werewolf</b> missed! ' + 'Turn: ' + turn)
            soundHandler('miss');
        }
    } else {
        let result = attack(monsterDamage, armour, 1);
        if (result != 0) {
            updateLog('<b>Werewolf</b> hit you for ' + result + ' damage! ' + 'Turn: ' + turn)
            soundHandler('werewolf');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Werewolf</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }
    }
}

function griffin() {
    turn++;

    if (monsterHealth < griffinVar && griffinToggle == true) {
        let roar = griffinVar - monsterHealth;

        updateLog("The <b>Griffin's </b> <i>Roar</i> ability recoils back " + roar + " damage!", 'special-log');
        if (roar >= health) {
            playerDeath();
        } else {
            health = health - roar;
            update();
        }
        griffinToggle = false;
    } else {
        griffinToggle = false;
    }

    let ability = roll(100);
    if (ability >= 80) {
        griffinVar = monsterHealth;
        griffinToggle = true;
        updateLog("<b>Griffin</b> uses <i>Roar</i>!")
        soundHandler('griffin-1');

    } else if (ability < 80 && ability >= 70) {
        let result = attack(20, armour, 1);
        if (result != 0) {
            updateLog('<b>Griffin</b> <i>Skydives</i> you for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('griffin-2');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Griffin</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }
    } else if (ability < 70 && ability >= 60) {
        let result = attack(12, 0, 1);
        if (result != 0) {
            updateLog('<b>Griffin</b> uses <i>Iron Talons</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('griffin-2');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Griffin</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }
    } else if (ability < 60 && ability >= 50) {
        let result = attack(6, armour, 3);
        if (result != 0) {
            updateLog('<b>Griffin </b> <i>Acid Spits</i> you for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('griffin-2');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Griffin</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }
    } else {
        let result = attack(12, armour, 1);
        if (result != 0) {
            updateLog('<b>Griffin</b> hits you for ' + result + ' damage! ' + 'Turn: ' + turn)
            soundHandler('griffin');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Griffin</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }
    }
}

function dragon() {
    turn++;


    let ability = roll(100);

    if (ability >= 90) {
        // Dragonfire

        if (armour <= 0) {
            let result = attack(10 + dragonAspect, armour, 2);
            if (result != 0) {
                updateLog('<b>Dragon</b> uses <i>Dragonfire</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log');
                soundHandler('dragon-1');

                if (result >= health) {
                    playerDeath();
                } else {
                    health = health - result;
                    update();
                }

            } else {
                updateLog('<b>Dragon</b> missed! ' + 'Turn: ' + turn);
                soundHandler('miss');
            }
        } else {
            updateLog('<b>Dragon</b> uses <i>Dragonfire</i> to reduce your armour by 1!  Turn: ' + turn, 'special-log')
            armour--;
            soundHandler('dragon-1');
            update();
        }

    } else if (ability < 90 && ability >= 79) {
        // Imperium
        updateLog('Dragon uses <i>Imperium</i>!', 'special-log');
        soundHandler('dragon-2');
        let result1 = attack(10 + dragonAspect, armour, 1);
        if (result1 != 0) {

            updateLog('<b>Dragon</b> hits you for ' + result1 + ' damage! Turn: ' + turn)
            

            if (result1 >= health) {
                playerDeath();
            } else {
                health = health - result1;
                update();
            }

        } else {
            updateLog('<b>Dragon</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }

        let imperium = roll(4);

        if (imperium == 4) {
            dragonAspect = dragonAspect + 2;
            updateLog('Dragon uses <i>Dragon Aspect</i>!', 'special-log');
            soundHandler('dragon-4');

            let result = attack(12, armour, 1);
            if (result != 0) {
                result = result + dragonAspect;
                updateLog('<b>Dragon</b> uses <i>Slice</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
                

                if (result >= health) {
                    playerDeath();
                } else {
                    health = health - result;
                    update();
                }

            } else {
                updateLog('<b>Dragon</b> missed! ' + 'Turn: ' + turn, 'special-log');
                soundHandler('miss');
            }
        } else if (imperium == 3) {
            if (armour <= 0) {
                let result = attack(10 + dragonAspect, armour, 2);
                if (result != 0) {
                    updateLog('<b>Imperium</b> uses <i>Dragonfire</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log');
                    soundHandler('dragon-1');

                    if (result >= health) {
                        playerDeath();
                    } else {
                        health = health - result;
                        update();
                    }

                } else {
                    updateLog('<b>Imperium</b> missed! ' + 'Turn: ' + turn, 'special-log');
                    soundHandler('miss');
                }
            } else {
                updateLog('<b>Dragon</b> uses <i>Dragonfire</i> to reduce your armour by 1!  Turn: ' + turn, 'special-log')
                armour--;
                soundHandler('dragon-1');
                update();
            }
        } else if (imperium == 2) {
            let result = attack(20 + dragonAspect, armour, 1);
            if (result != 0) {
                monsterHealth += result;
                updateLog('<b>Imperium</b> uses <i>Torment</i> for ' + result + ' damage and heals ' + result + '! Turn: ' + turn, 'special-log')
                soundHandler('dragon-3');

                if (result >= health) {
                    playerDeath();
                } else {
                    health = health - result;
                    update();
                }

            } else {
                updateLog('<b>Imperium</b> missed! ' + 'Turn: ' + turn, 'special-log');
                soundHandler('miss');
            }
        } else {
            let result = attack(4, armour, 1);
            if (result != 0) {

                var healthOffset = 100 - health;
                healthOffset = healthOffset - (healthOffset % 10);
                healthOffset = healthOffset / 10;
                secondRoll = attack(4, 0, healthOffset);
                result = result + secondRoll + dragonAspect;

                updateLog('<b>Imperium</b> uses <i>Anguish</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
                soundHandler('dragon-5');

                if (result >= health) {
                    playerDeath();
                } else {
                    health = health - result;
                    update();
                }

            } else {
                updateLog('<b>Imperium</b> missed! ' + 'Turn: ' + turn, 'special-log');
                soundHandler('miss');
            }
        }

    } else if (ability < 79 && ability >= 69) {
        // Torment

        let result = attack(20 + dragonAspect, armour, 1);
        if (result != 0) {
            monsterHealth += result;
            updateLog('<b>Dragon</b> uses <i>Torment</i> for ' + result + ' damage and heals ' + result + '! Turn: ' + turn, 'special-log')
            soundHandler('dragon-3');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Dragon</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }

    } else if (ability < 69 && ability >= 59) {
        // Anguish

        let result = attack(4, armour, 1);
        if (result != 0) {

            var healthOffset = 100 - health;
            healthOffset = healthOffset - (healthOffset % 10);
            healthOffset = healthOffset / 10;
            secondRoll = attack(4 + dragonAspect, 0, healthOffset);
            result = result + secondRoll;

            updateLog('<b>Dragon</b> uses <i>Anguish</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            soundHandler('dragon-5');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Dragon</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }

    } else if (ability < 59 && ability >= 50) {
        dragonAspect = dragonAspect + 2;
        updateLog('Dragon uses <i>Dragon Aspect</i>!', 'special-log');
        soundHandler('dragon-4');
        let result = attack(12, armour, 1);
        if (result != 0) {
            result = result + dragonAspect;
            updateLog('<b>Dragon</b> uses <i>Slice</i> for ' + result + ' damage! ' + 'Turn: ' + turn, 'special-log')
            

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Dragon</b> missed! ' + 'Turn: ' + turn);
            
        }

    } else {

        let result = attack(12 + dragonAspect, armour, 1);
        if (result != 0) {

            updateLog('<b>Dragon</b> hits you for ' + result + ' damage! Turn: ' + turn)
            soundHandler('dragon');

            if (result >= health) {
                playerDeath();
            } else {
                health = health - result;
                update();
            }

        } else {
            updateLog('<b>Dragon</b> missed! ' + 'Turn: ' + turn);
            soundHandler('miss');
        }
    }
}

function d() {
    // Utility to dragon.
    monsterDeath();
    monsterDeath();
    monsterDeath();
    monsterDeath();
    monsterDeath();

}

// 

function monsterDeath() {

    if (monsterCount == 5) {
        dragonDeath();
    } else {

    updateLog('You have slain: ' + monster[monsterCount]);
    weaponCount++;

    updateLog('New Weapon Unlocked: ' + weapon[weaponCount], 'reward-log');
    monsterCount++;

    updateLog('A new challenger approaches... ' + monster[monsterCount] + ".");
    $('#monster-name').html(monster[monsterCount]);

    $('#weapon-select').append($('<option>', {
        value: weapon[weaponCount],
        text: weapon[weaponCount]
    }));

    switch (monsterCount) {
        case 1:
            // Hill Giant
            monsterHealth = 40;
            monsterArmour = 8;
            monsterDamage = 8;
            update();
            break;

        case 2:
            // Minotaur
            monsterArmour = 10;
            monsterDamage = 8;
            monsterHealth = 60;
            update();
            break;

        case 3:
            // Werewolf
            armour = 10;
            monsterArmour = 10;
            monsterDamage = 10;
            monsterHealth = 60;
            update();
            break;

        case 4:
            // Griffin 
            monsterArmour = 12;
            monsterDamage = 12;
            monsterHealth = 80;
            health = 100;
            updateLog('Your <i>Mithril Whip</i> absorbs the life essence of the Griffin, healing you to max.', 'special-log')
            update();
            break;

        case 5:
            // Dragon
            monsterArmour = 14;
            monsterDamage = 12;
            monsterHealth = 100;
            update();
            break;
        }
    }
}

function dragonDeath() {
    monsterHealth = 1;
    update();
    $('#attack').attr('disabled', 'disabled');
    $('#special').attr('disabled', 'disabled');
    $('#heal').attr('disabled', 'disabled');
    $('#block').attr('disabled', 'disabled');
    updateLog("You: You're... Immortal?");
    setTimeout(function() {
        updateLog("Dragon: Yes.")
    }, 3000);
    setTimeout(function() {
        updateLog('<b>Dragon</b> uses <i>Absorb Soul</i> for ' + health + ' damage! ' + 'Turn: ' + turn, 'special-log');
                soundHandler('dragon-2');
                playerDeath();

    }, 4000);
}

function playerDeath() {
    updateLog('Oh dear, you are dead!', 'dead');
    health = 0;
    update();
    $('#attack').remove();
    $('#special').remove();
    $('#heal').remove();
    $('#block').remove();
}

function weaponSwitch() {

    select = document.getElementById("weapon-select").value;

    switch (select) {
        case weapon[0]:
            $('#player-weapon').html("Weapon: Shortsword - 1d6")
            damage = 6;
            break;
        case weapon[1]:
            $('#player-weapon').html("Weapon: Scimitar - 1d8")
            damage = 8;
            break;
        case weapon[2]:
            $('#player-weapon').html("Weapon: Greataxe - 1d10")
            damage = 10;
            break;
        case weapon[3]:
            $('#player-weapon').html("Weapon: Mithril whip - 1d10")
            damage = 10
            break;
        case weapon[4]:
            $('#player-weapon').html("Weapon: Scythe - 1d12")
            damage = 12;
            break;
        case weapon[5]:
            $('#player-weapon').html("Weapon: Aegis - 1d0")
            damage = 0;
            break;
        default:
        
    }
}

function calcHeal() {
    if (currentPotion < 4) {
        if (healTurn >= 4) {
            healTurn = 0;
            currentPotion = currentPotion + 1;
            update();
        } else {
            var calc = 4 - healTurn;
            console.log(turn + "more turns");
        }
    } else {
        // Maxed on potions.
    }
}

function heal() {
    if (currentPotion > 0) {
        turn++;
        cooldown--;
        currentPotion--;


        var result = roll(10);
        if (result + health >= 100) {
            health = 100;
        } else {
            health = health + result;
        }

        updateLog('You healed for ' + result + ' HP! Turn: ' + turn, 'heal-log');
        soundHandler('heal');
        update();
        setTimeout(function () {
            monsterAttack(monsterCount);
        }, 1000);

    } else {
        updateLog('You do not have any potions!', 'cooldown-log')
    }
}

function block() {
    turn++;
    cooldown--;
    healTurn++;
    calcHeal();

    armourBuff = true;
    normalArmour = armour;
    armour = armour + 4;
    updateLog('You used <i>Anticipate</i>! Turn: ' + turn)
    soundHandler('block');
    update();
    setTimeout(function () {
        monsterAttack(monsterCount);
    }, 1000);
    setTimeout(function () {
        armour = normalArmour;
        armourBuff = false;
        update();
    }, 1000);


}

// Damage of weapon, and armour class of opponent, and multiplier of dice n(Dx)

function attack(damage, armour, multiplier) {
    let result = 0;
    let hit = roll(20);
    if (hit >= armour) {
        for (let i = 0; i < multiplier; i++) {
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

    let attack = "Make an attack roll.";
    let special = "Perform a special attack. Specials take 4 turns to recharge."
    let heal = "Heal for 1d10 damage. Potions take 4 turns to recharge."
    let block = "You anticipate your foe's next attack. Raise your AC by 4 for 1 turn."

    $('#attack').attr('title', attack);
    $('#special').attr('title', special);
    $('#heal').attr('title', heal);
    $('#block').attr('title', block);

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

    tippy('.heal', {
        placement: 'bottom',
        animation: 'fade',
        arrow: true
    });

    tippy('.block', {
        placement: 'bottom',
        animation: 'fade',
        arrow: true
    });

});

function soundHandler(sound) {
    switch (sound) {
        case 'hit':
            var audio = new Audio('assets/hit.mp3');
            audio.volume = 0.1;
            audio.play();
            break;
        case 'miss':
            var audio = new Audio('assets/miss.mp3');
            audio.volume = 0.1;
            audio.play();
            break;
        case 'heal':
            var audio = new Audio('assets/heal.mp3');
            audio.volume = 0.1;
            audio.play();
            break;
        case weapon[0]:
            var audio = new Audio('assets/shortsword.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case weapon[1]:
            var audio = new Audio('assets/scimitar.mp3');
            audio.volume = 0.2;
            audio.play();
            break;

        case weapon[2]:
            var audio = new Audio('assets/greataxe.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case weapon[3]:
            var audio = new Audio('assets/whip.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case weapon[4]:
            var audio = new Audio('assets/scythe.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'goblin':
            var audio = new Audio('assets/goblin.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'hillgiant':
            var audio = new Audio('assets/hillgiant.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'hillgiant-1':
            var audio = new Audio('assets/hillgiant-1.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'minotaur':
            var audio = new Audio('assets/minotaur.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'minotaur-1':
            var audio = new Audio('assets/minotaur-1.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'minotaur-2':
            var audio = new Audio('assets/minotaur-2.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'werewolf':
            var audio = new Audio('assets/werewolf.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'werewolf-1':
            var audio = new Audio('assets/werewolf-1.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'werewolf-2':
            var audio = new Audio('assets/werewolf-2.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'whip':
            var audio = new Audio('assets/whip.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'griffin':
            var audio = new Audio('assets/griffin.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'griffin-1':
            var audio = new Audio('assets/griffin-1.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'griffin-2':
            var audio = new Audio('assets/griffin-2.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'scythe':
            var audio = new Audio('assets/scythe.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'block':
            var audio = new Audio('assets/block.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

        case 'dragon':
            var audio = new Audio('assets/dragon.mp3');
            audio.volume = 0.1;
            audio.play();
            break;

            case 'dragon-1':
            var audio = new Audio('assets/dragon-1.mp3');
            audio.volume = 0.1;
            audio.play();
            break;   

            case 'dragon-2':
            var audio = new Audio('assets/dragon-2.mp3');
            audio.volume = 0.1;
            audio.play();
            break;     

            case 'dragon-3':
            var audio = new Audio('assets/dragon-3.mp3');
            audio.volume = 0.1;
            audio.play();
            break;    

            case 'dragon-4':
            var audio = new Audio('assets/dragon-4.mp3');
            audio.volume = 0.1;
            audio.play();
            break;    

            case 'dragon-5':
            var audio = new Audio('assets/dragon-5.mp3');
            audio.volume = 0.1;
            audio.play();
            break;    

            case 'aegis':
            var audio = new Audio('assets/aegis.m4a');
            audio.volume = 0.1;
            audio.play();
            break;   
    }
}