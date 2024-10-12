import { StraighAttackDirections, UIAbility } from "../../interfaces/Ability"
import { WorldManager } from "../../managers/WorldManager"
import { ScytheGirl } from "../../game-objects/characters/scythe-girl/ScytheGirl";
import { SScytheGirl } from "../../schemas/characters/SScytheGirl";
import { MyRoom } from "../../rooms/MyRoom";
import { AliveEntity } from "../../game-objects/AliveEntity";
import { generateDebugger, updateStraightDirectionAbility } from "../../utils/Debugger";
import { StraightDirectionAttack } from "../StraightDirectionAttack";

export class QAbility extends StraightDirectionAttack{

    constructor(character: ScytheGirl, name:string, directions:StraighAttackDirections,
        cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, attackWidth:number, worldManager: WorldManager){

        super(name, directions, cooldown, speed, frames, manaCost, particlesSprite, UI, range, attackWidth, worldManager)

        if(MyRoom.debug)
            generateDebugger([this.up, this.down, this.right, this.left], 
                (character.schema as SScytheGirl).q);
    }

    update(character: AliveEntity, x:number, y: number){
        
        super.update(character, x, y)

        if(MyRoom.debug){
            updateStraightDirectionAbility([this.up, this.down, this.right, this.left], 
                (character.schema as SScytheGirl).q
            )
        }
    }
}