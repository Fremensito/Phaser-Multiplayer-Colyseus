import Matter from "matter-js";
import { Character } from "../../game-objects/Character";
import { Enemy } from "../../game-objects/Enemy";
import { UIAbility } from "../../interfaces/Ability";
import { Ability } from "../Ability";
import { Globals } from "../../globals/Globals";
import { WorldManager } from "../../managers/WorldManager";

export class WAbility extends Ability{
    hitbox: Matter.Body
    enemiesHit = new Array<Enemy>();
    character: Character
    engine: Matter.Engine
    worldManager: WorldManager

    constructor(
        name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, character:Character, engine:Matter.Engine, worldManager: WorldManager
    ){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range);
        this.character = character;
        this.engine = engine;
        this.worldManager = worldManager

        this.createHitbox();
        this.addCollisions();
    }

    createHitbox(){
        this.hitbox = Matter.Bodies.rectangle(
            this.character.body.position.x, 
            this.character.body.position.y, 
            this.range*2, 
            this.range*2
        );
        this.hitbox.label = "W"
        this.addToWorld(this.hitbox)
    }

    addToWorld(hitbox:Matter.Body){
        hitbox.isSensor = true;
        hitbox.frictionAir = 0;
        hitbox.friction = 0;
        hitbox.frictionStatic = 0;
        hitbox.collisionFilter = {
            category: Globals.categories.abilities,
            mask: Globals.categories.enemies,
            group: 0
        }
        //console.log(hitbox.collisionFilter.category)
        Matter.Composite.add(this.engine.world, hitbox)
    }

    addCollisions(){
        Matter.Events.on(this.engine, "collisionStart", (event)=>{
            for(let i=0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.label == "W" && 
                    !this.enemiesHit.includes(this.worldManager.enemies.get(pair.bodyB.label))){
                    this.attack(pair.bodyB);
                }
                else if(pair.bodyB.label == "W" && !this.enemiesHit.includes(this.worldManager.enemies.get(pair.bodyB.label))){
                    this.attack(pair.bodyA)
                }
            }
        })

        Matter.Events.on(this.engine, "collisionEnd", (event)=>{
            for(let i=0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.label == "W"){
                    this.enemiesHit.splice(this.enemiesHit.indexOf(this.worldManager.enemies.get(pair.bodyB.label)), 1)
                }
                else if (pair.bodyB.label == "W"){
                    this.enemiesHit.splice(this.enemiesHit.indexOf(this.worldManager.enemies.get(pair.bodyA.label)), 1)
                }
            }
        })
    }

    attack(body:Matter.Body){
        let enemy = this.worldManager.enemies.get(body.label);
        this.enemiesHit.push(enemy)
        if(this.character.ability == "W")
            enemy.getDamage(10);
    }

    update(){
        //console.log(this.hitbox.position)
        //console.log(this.hitbox.isSleeping)
        //console.log(this.enemiesHit.length)
        //console.log(this.hitbox.bounds)
        Matter.Body.setPosition(this.hitbox, {x: this.character.body.position.x, y:this.character.body.position.y})
    }

    activate(){
        super.activate()
        this.enemiesHit.forEach(e=>{
            if(!e.dead)
                e.getDamage(10)
        })
    }
}