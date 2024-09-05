import { QAbility } from "../combat/scythe-girl/QAbility";
import { WAbility } from "../combat/scythe-girl/WAbility";
import { WorldManager } from "../managers/WorldManager";

export function scytheGirlAbilities(worldManager: WorldManager){
    return[
        new QAbility("basic attack", 1000, 12, 5, 0, "", (
            {
                abilityWidth:32,
                abilityHeight:32,
                slotResource:"ui/scythe-girl/Q-slot.png", 
                iconResource:"ui/scythe-girl/Q-icon.png"
            }),
            26, worldManager),
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