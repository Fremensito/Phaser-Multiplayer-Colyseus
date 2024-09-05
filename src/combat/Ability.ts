import { IAbility, UIAbility } from "../interfaces/Ability";

export class Ability{
    name:string;
    cooldown:number
    speed:number
    frames:number
    manaCost:number
    particlesSprite:string
    UI:UIAbility;
    available:boolean
    range:number

    /**
     * 
     * @param {string} name 
     * @param {number} cooldown 
     * @param {number} speed 
     * @param {number} frames 
     * @param {number} manaCost 
     * @param {string} particlesSprite 
     * @param {UI} UI 
     */
    constructor(name:string, cooldown:number, speed:number, frames:number, manaCost:number, particlesSprite:string, 
        UI:UIAbility, range:number){
        this.name = name;
        this.cooldown = cooldown;
        this.speed = speed;
        this.frames = frames;
        this.manaCost = manaCost;
        this.particlesSprite = particlesSprite;
        this.UI = UI;
        this.available = true;
        this.range = range;
    }

    activate(){
        if(this.available){
            this.available = false;
        }
    }

    deactivate(){
        
    }

    getData(): IAbility{
        return {
            name: this.name,
            cooldown: this.cooldown,
            speed: this.speed,
            mana_cost: this.manaCost,
            particlesSprite: this.particlesSprite,
            range: this.range,
            UI: this.UI
        }
    }

    update(x:number, y:number){}

    selectEnemies(partition: string): Array<string>{
        let keys = []
        let coords = partition.split("-")
        let xMax = +coords[0] + 2;
        let yMax = +coords[1] + 2;
        for(let i = +coords[1]-1; i < yMax; i++){
            for(let j = +coords[0]-1; j < xMax; j++){
                keys.push(j.toString() + "-" + i.toString())
            }
        }
        return keys;
    }

    attack(direction: any){}
}