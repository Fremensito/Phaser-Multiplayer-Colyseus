import { QAbility } from "../combat/scythe-girl/QAbility";
import { WAbility } from "../combat/scythe-girl/WAbility";
import { Character } from "../game-objects/Character";
import { WorldManager } from "../managers/WorldManager";

export function scytheGirlAbilities(character:Character, worldManager: WorldManager){
    return[
        new QAbility("basic attack", 1000, 12, 5, 0, "", (
            {
                abilityWidth:32,
                abilityHeight:32,
                slotResource:"ui/hability.png", 
                iconResource:"ui/scythe_hability.png"
            }),
            26, character, worldManager),
        new WAbility("W", 3000, 12, 5, 0, "W-particles.png", 
            {
                abilityWidth:32, 
                abilityHeight:32, 
                slotResource:"ui/W-slot.png", 
                iconResource:"ui/W-icon.png"
            }, 
            30, character, worldManager)
    ]
}