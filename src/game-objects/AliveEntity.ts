import { Engine } from "matter-js";
import { Ability } from "../combat/Ability";
import Matter from "matter-js";
import { SAliveEntity } from "../schemas/SAliveEntity";

export class AliveEntity{
    schema = new SAliveEntity();
    speed:  number
    direction: Matter.Vector
    abilities: Array<Ability>
    ability: string;
    id: string
    idle: boolean
    pointToMove: Matter.Vector
    attacking: boolean
    body: Matter.Body
    health: number
    dead: boolean
    positionHistory = new Array<Matter.Vector>();
    /**
     * 
     * @param {number} speed 
     * @param {number} x 
     * @param {number} y 
     * @param {Array<Ability>} abilities 
     * @param {string} characterClass 
     * @param {string} id 
     */
    constructor(speed: number, x: number, y:number, abilities: Array<Ability>, id: string, engine:Engine){
        this.dead = false;
        this.idle = true;
        this.speed = speed;
        this.direction = {x:x, y:y+10}
        this.ability = "";
        this.id = id;
        this.pointToMove = {x:x, y:y+10}
        this.idle = true
        this.attacking = false
    }

    updateDirection(){
        const direction = {x: this.pointToMove.x - this.body.position.x, y: this.pointToMove.y - this.body.position.y}
        this.direction = Matter.Vector.normalise(direction)
    }

    checkPositionGoal(){
        return(
            (this.body.position.x >=this.pointToMove.x -2 && this.body.position.x <= this.pointToMove.x +2) &&
            (this.body.position.y >=this.pointToMove.y -2 && this.body.position.y <= this.pointToMove.y +2)
        )
    }

    /**
     * 
     * @param {{x:number, y:number}} vector 
     */
    changeDirectionInput(vector: Matter.Vector){
        this.pointToMove.x = vector.x;
        this.pointToMove.y = vector.y;
        const direction = {x: vector.x - this.body.position.x, y: vector.y - this.body.position.y}
        this.direction = Matter.Vector.normalise(direction)
    }

    update(){
        this.schema.x = this.body.position.x;
        this.schema.y = this.body.position.y;
    }
}