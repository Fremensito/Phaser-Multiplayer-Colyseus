import { EnemyStraightAttack } from "../combat/basic-enemies/EnemyStraightAttack";
import { QAbility } from "../combat/scythe-girl/QAbility";
import { WAbility } from "../combat/scythe-girl/WAbility";
import { ScytheGirl } from "../game-objects/characters/scythe-girl/ScytheGirl";
import { BasicMeleeEnemy } from "../game-objects/enemies/BasicMeleeEnemy";
import { WorldManager } from "../managers/WorldManager";

export function scytheGirlAbilities(worldManager: WorldManager, character:ScytheGirl){
    return[
        new QAbility(character, "basic attack", 1000, 12, 5, 0, "", (
            {
                abilityWidth:32,
                abilityHeight:32,
                slotResource:"ui/scythe-girl/Q-slot.png", 
                iconResource:"ui/scythe-girl/Q-icon.png"
            }),
            26, 32, worldManager),
        new WAbility("W", 3000, 12, 5, 0, "W-particles.png", 
            {
                abilityWidth:32, 
                abilityHeight:32, 
                slotResource:"ui/scythe-girl/W-slot.png", 
                iconResource:"ui/scythe-girl/W-icon.png"
            }, 
            30, worldManager)
    ]
}

export function ghostAbilities(worldManager: WorldManager, entity:BasicMeleeEnemy){
    return[
        new EnemyStraightAttack(entity, "ghost bassic attack", 0, 12, 7, 0, "", undefined, 12, 16, worldManager)
    ]
}