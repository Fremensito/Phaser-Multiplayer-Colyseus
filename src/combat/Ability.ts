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

    update(){}

    attack(direction: any){}
}