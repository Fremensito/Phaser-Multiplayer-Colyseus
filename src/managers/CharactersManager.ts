import { AliveEntity } from "../game-objects/AliveEntity";
import { Vector2 } from "../interfaces/Vector2";

export class CharactersManager{
    /**
     * 
     * @param {Character} character 
     * @param {{x:number, y:number}} vector 
     */
    static pointerDownMove(character:AliveEntity, vector:Vector2){
        character.idle = false;
        character.changeDirectionInput(vector)
    }
}