import { Ability } from "../../../combat/Ability";
import { QAbility } from "../../../combat/scythe-girl/QAbility";
import { WAbility } from "../../../combat/scythe-girl/WAbility";
import { ScytheGirl } from "./ScytheGirl";
import { Vector2 } from "../../../interfaces/Vector2";
import { Enemy } from "../../enemies/Enemy";

export class ScytheGirlManager{
    static reconciliationDeay = 100;

    /**
     * 
     * @param {AliveEntity} character
     * @param {Ability} ability
     */
    static useQ(character:ScytheGirl, ability:Ability, direction:string, clock:any){
        character.ability= "Q"
        character.attacking = true
        character.idle = false
        ability.activate();
        let enemies = new Array<Enemy>();
        ability.selectEnemies(character.partition).forEach(k=>{
            (ability as QAbility).worldManager.mapParitions.get(k)?.forEach((e=>{
                if(e instanceof Enemy)
                    enemies.push(e)
            }))
        });
        (ability as QAbility).doDamage(direction, character.damage, character, enemies)
        character.hitWithQ(direction);
        clock.setTimeout(()=>{
            ability.available = true;
        }, ability.cooldown - this.reconciliationDeay)

        clock.setTimeout(()=>{
            character.ability = "Q"
            character.attacking = false
        }, (1/ability.speed)*ability.frames*1000)
    }

    /**
     * 
     * @param {Character} character 
     * @param {{x:number, y:number}} direction 
     */
    static useW(character:ScytheGirl, direction:Vector2, clock:any){
        character.attacking = true;
        character.idle = false;
        character.abilities[1].activate()
        character.ability = "W"
        character.WAction(direction)
        //character.changeDirectionInput(direction);
        //character.speed = 120;

        clock.setTimeout(()=>{
            character.abilities[1].available = true;
            (character.abilities[1] as WAbility).clear();
        }, character.abilities[1].cooldown - this.reconciliationDeay)

        clock.setTimeout(()=>{
            character.ability = ""
            character.idle = true
            character.attacking = false
            character.abilities[1].deactivate()
            // character.speed = 40;
        }, (1/character.abilities[1].speed)*character.abilities[1].frames*1000)

    }
}