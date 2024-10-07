import { BasicMeleeEnemy } from "../../game-objects/enemies/BasicMeleeEnemy";
import { UIAbility } from "../../interfaces/Ability";
import { WorldManager } from "../../managers/WorldManager";
import { MyRoom } from "../../rooms/MyRoom";
import { SBasicMelee } from "../../schemas/enemies/SBasicMelee";
import { generateDebugger, updateStraightDirectionAbility } from "../../utils/Debugger";
import { StraightDirectionAttack } from "../StraightDirectionAttack";

export class EnemyStraightAttack extends StraightDirectionAttack{
    constructor(entity:  BasicMeleeEnemy, name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, attackWidth:number, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range, attackWidth, worldManager)

        if(MyRoom.debug)
            generateDebugger([this.up, this.down, this.right, this.left], 
                (entity.schema as SBasicMelee).ability);
    }

    update(entity: BasicMeleeEnemy, x:number, y: number){
        
        super.update(entity, x, y)

        if(MyRoom.debug){
            updateStraightDirectionAbility([this.up, this.down, this.right, this.left], 
                (entity.schema as SBasicMelee).ability
            )
        }
    }
}