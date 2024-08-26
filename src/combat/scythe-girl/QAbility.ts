import Matter from "matter-js"
import { Character } from "../../game-objects/Character"
import { Enemy } from "../../game-objects/Enemy"
import { UIAbility } from "../../interfaces/Ability"
import { Ability } from "../Ability"
import { Globals } from "../../globals/Globals"
import { WorldManager } from "../../managers/WorldManager"

export class QAbility extends Ability{
    right:Matter.Body
    down:Matter.Body
    left:Matter.Body
    up:Matter.Body

    directions = {
        up: "QUp",
        right: "QRight",
        down: "QDown",
        left: "QLeft"
    }

    //enemies = []
    enemiesUp = new Array<Enemy>()
    enemiesRight = new Array<Enemy>()
    enemiesDown = new Array<Enemy>()
    enemiesLeft = new Array<Enemy>()

    character:Character
    offset:number

    engine:Matter.Engine
    worldManager: WorldManager

    /**
     * 
     * @param {string} name 
     * @param {number} cooldown 
     * @param {number} speed 
     * @param {number} frames 
     * @param {number} manaCost 
     * @param {string} particlesSprite 
     * @param {UI} UI 
     * @param {number} range 
     * @param {Character} character 
     * @param {Matter.Engine} engine
     * @param {Map<string, Enemy>} enemies
     */
    constructor(name:string, cooldown:number, speed:number, frames:number, manaCost:number, 
        particlesSprite:string, UI:UIAbility, range:number, character:Character, engine:Matter.Engine, worldManager: WorldManager){
        super(name, cooldown, speed, frames, manaCost, particlesSprite, UI, range)
        this.worldManager = worldManager;
        this.character = character
        this.engine = engine
        this.offset = this.range/2
        this.createRight(character)
        this.createDown(character)
        this.createLeft(character)
        this.createUp(character)
        this.addCollisions();
    }

    createRight(character:Character){
        //console.log(character.body.position.x)
        this.right = Matter.Bodies.rectangle(character.body.position.x + this.offset, character.body.position.y, this.range, 30);
        this.right.label = this.directions.right
        //console.log(this.right.position)
        this.addToWorld(this.right)
    }

    createDown(character:Character){
        this.down = Matter.Bodies.rectangle(character.body.position.x, character.body.position.y+this.offset, 30, this.range);
        this.down.label = this.directions.down
        this.addToWorld(this.down)
    }

    createLeft(character:Character){
        this.left = Matter.Bodies.rectangle(character.body.position.x - this.offset, character.body.position.y, this.range,30)
        this.left.label = this.directions.left;
        this.addToWorld(this.left)
    }

    createUp(character:Character){
        this.up = Matter.Bodies.rectangle(character.body.position.x, character.body.position.y - this.offset, 30, this.range)
        this.up.label = this.directions.up;
        this.addToWorld(this.up)
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
        //console.log(hitbox.label)
    }

    addCollisions(){
        Matter.Events.on(this.engine,"collisionStart", (event)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.label == this.directions.up || pair.bodyB.label == this.directions.up){
                    if(pair.bodyA.label == this.directions.up)
                        this.enemiesUp.push(this.worldManager.enemies.get(pair.bodyB.label)!)
                    else
                        this.enemiesUp.push(this.worldManager.enemies.get(pair.bodyA.label)!)
                }
                else if(pair.bodyA.label == this.directions.right || pair.bodyB.label == this.directions.right){
                    if(pair.bodyA.label == this.directions.right)
                        this.enemiesRight.push(this.worldManager.enemies.get(pair.bodyB.label)!)
                    else
                        this.enemiesRight.push(this.worldManager.enemies.get(pair.bodyA.label)!)
                }
                else if(pair.bodyA.label == this.directions.down || pair.bodyB.label == this.directions.down){
                    if(pair.bodyA.label == this.directions.down)
                        this.enemiesDown.push(this.worldManager.enemies.get(pair.bodyB.label)!)
                    else
                        this.enemiesDown.push(this.worldManager.enemies.get(pair.bodyA.label)!)
                }
                else if(pair.bodyA.label == this.directions.left || pair.bodyB.label == this.directions.left){
                    if(pair.bodyA.label == this.directions.left)
                        this.enemiesLeft.push(this.worldManager.enemies.get(pair.bodyB.label)!)
                    else
                        this.enemiesLeft.push(this.worldManager.enemies.get(pair.bodyA.label)!)
                }
                //console.log(pair.bodyA.label, pair.bodyB.label)
            }
        })

        Matter.Events.on(this.engine,"collisionEnd", (event)=>{
            for(let i = 0; i < event.pairs.length; i++){
                let pair = event.pairs[i]
                if(pair.bodyA.label == this.directions.up || pair.bodyB.label == this.directions.up){
                    if(pair.bodyA.label == this.directions.up)
                        this.enemiesUp.splice(this.enemiesUp.indexOf(this.worldManager.enemies.get(pair.bodyB.label)!), 1)
                    else
                        this.enemiesUp.splice(this.enemiesUp.indexOf(this.worldManager.enemies.get(pair.bodyA.label)!), 1)
                }
                else if(pair.bodyA.label == this.directions.right || pair.bodyB.label == this.directions.right){
                    if(pair.bodyA.label == this.directions.right)
                        this.enemiesRight.splice(this.enemiesRight.indexOf(this.worldManager.enemies.get(pair.bodyB.label)!), 1)
                    else
                        this.enemiesRight.splice(this.enemiesRight.indexOf(this.worldManager.enemies.get(pair.bodyA.label)!), 1)
                }
                else if(pair.bodyA.label == this.directions.down || pair.bodyB.label == this.directions.down){
                    if(pair.bodyA.label == this.directions.down)
                        this.enemiesDown.splice(this.enemiesDown.indexOf(this.worldManager.enemies.get(pair.bodyB.label)!), 1)
                    else
                        this.enemiesDown.splice(this.enemiesDown.indexOf(this.worldManager.enemies.get(pair.bodyA.label)!), 1)
                }
                else if(pair.bodyA.label == this.directions.left || pair.bodyB.label == this.directions.left){
                    if(pair.bodyA.label == this.directions.left)
                        this.enemiesLeft.splice(this.enemiesLeft.indexOf(this.worldManager.enemies.get(pair.bodyB.label)!), 1)
                    else
                        this.enemiesLeft.splice(this.enemiesLeft.indexOf(this.worldManager.enemies.get(pair.bodyA.label)!), 1)
                }
                //console.log(pair.bodyA.label, pair.bodyB.label)
            }
        });
    }

    update(){
        // this.right.position.x = this.character.body.x + this.offset;
        // this.right.position.y = this.character.body.y;
        //console.log("posisao", this.character.body.position)
        Matter.Body.setPosition(this.right,{x: this.character.body.position.x + this.offset, y:this.character.body.position.y})
        //console.log("right", this.right.position)

        // this.down.position.x = this.character.body.x;
        // this.down.position.y = this.character.body.y + this.offset;
        Matter.Body.setPosition(this.down, {x: this.character.body.position.x, y: this.character.body.position.y + this.offset})
        
        // this.left.position.x = this.character.body.x - this.offset;
        // this.left.position.y = this.character.body.y;
        Matter.Body.setPosition(this.left, {x: this.character.body.position.x - this.offset, y: this.character.body.position.y})

        // this.up.position.x = this.character.body.x;
        // this.up.position.y = this.character.body.y - this.offset;
        Matter.Body.setPosition(this.up, {x: this.character.body.position.x, y: this.character.body.position.y - this.offset})
    }

    attack(direction:string){
        let damage = 10
        console.log("attacking with Q")
        console.log(direction)
        switch(direction){
            case this.directions.right:
                this.enemiesRight.forEach((e)=>e.getDamage(damage))
                break;
            
            case this.directions.down:
                this.enemiesDown.forEach((e)=>e.getDamage(damage))
                break;
            
            case this.directions.left:
                this.enemiesLeft.forEach((e)=>e.getDamage(damage))
                break;
            
            case this.directions.up:
                this.enemiesUp.forEach(e => e.getDamage(damage))
                break;
        }
    }
}