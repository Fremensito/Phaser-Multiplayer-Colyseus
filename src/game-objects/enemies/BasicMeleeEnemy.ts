import { Ability } from "../../combat/Ability";
import { AliveEntity } from "../AliveEntity";
import { WorldManager } from "../../managers/WorldManager";
import { IEnemy } from "../../interfaces/Enemy";
import { MyRoom } from "../../rooms/MyRoom";
import { getRandomInt } from "../../math/Math";
import { Vector2 } from "../../interfaces/Vector2";
import SAT from "sat";
import { NetManager } from "../../managers/NetManager";
import { Enemy } from "./Enemy";
import { SBasicMelee } from "../../schemas/enemies/SBasicMelee";
import { IAbility } from "../../interfaces/Ability";
import { EnemyStraightAttack } from "../../combat/basic-enemies/EnemyStraightAttack";
import { EnemiesNetManager } from "./EnemiesNetManager";

export class BasicMeleeEnemy extends Enemy{

    timeout = false
    testX: number;
    testY: number;

    agro = false;
    agroTargets = new Array<AliveEntity>;
    agroRange = 200;

    constructor(health: number, speed: number, damage:number, x:number, y:number, abilities: Array<Ability>, id: string, room: MyRoom, 
        worldManager: WorldManager
    ){
        super(health, speed, damage, x, y, abilities,id, room, worldManager)

        this.schema = new SBasicMelee();
        this.schema.id = id;
        this.schema.x = x;
        this.schema.y = y;

        this.testX = x;
        this.testY = y;

        this.setPartition()

        this.schema.health = this.health
        this.schema.type = this.entityType;

        //Inserting the schema in the enemies collection state
        this.room.state.basicMeleeEnemies.set(this.id, this.schema as SBasicMelee)
        
        setTimeout(this.randomMovement, 5000, this)

        this.boxWidth = 5;
        this.boxHeight = 10;
        this.box = new SAT.Box(new SAT.Vector(x - this.boxWidth/2, y - this.boxHeight/2), this.boxWidth, this.boxHeight)

        if(MyRoom.debug)
            this.generateDebugger();
    }

    getData():IEnemy{
        let abilities = new Array<IAbility>();
        this.abilities.forEach((a: Ability)=> abilities.push(a.getData()))
        return{
            speed: this.speed,
            x: this.position.x,
            y: this.position.y,
            pointToMoveX: this.pointToMove.x,
            pointToMoveY: this.pointToMove.y,
            directionX: this.direction.x,
            directionY: this.direction.y,
            health: this.health,
            abilities: abilities,
            id: this.id
        }
    }

    update(delta:number){
        this.saveLastPosition()
        super.update(delta);
        this.updateDirection();
        if(!this.idle && !this.attacking){
            this.position.x += this.speed*this.direction.x*delta
            this.position.y += this.speed*this.direction.y*delta
        }
        if(this.checkPositionGoal()){
            this.idle = true
        }
        this.updatePartition()
        this.box.pos.x = (this.position.x - this.boxWidth/2)
        this.box.pos.y = (this.position.y - this.boxHeight/2)
        
        this.updateAgro();
    }

    updateAgro(){

        //Turn off agro behaviour when no targets
        if(this.agroTargets.length == 0  && this.agro){
            this.agro = false;
            setTimeout(this.randomMovement, 5000, this)
        }
        else if(this.agro){

            //Update agro targets info
            let agroTargets = this.agroTargets.filter(c => {
                return new SAT.Vector(this.position.x - c.position.x, this.position.y - c.position.y).len() <= this.agroRange
                    && !c.disconnected;
            })
            this.agroTargets = agroTargets
            
            //Follow the nearest agro target
            if(this.agroTargets.length != 0){
                this.agroTargets.sort((c1,c2)=>{
                    let distanceV_1 = new SAT.Vector(this.position.x - c1.position.x, this.position.y - c1.position.y).len()
                    let distanceV_2 = new SAT.Vector(this.position.x - c2.position.x, this.position.y - c2.position.y).len()
                    return distanceV_1 - distanceV_2;
                })
                this.idle = false;
                this.changeDirectionInput({x:this.agroTargets[0].position.x, y:this.agroTargets[0].position.y})
                if(!this.attacking)
                    this.attack(this.agroTargets[0], 
                        this.abilities[0] as EnemyStraightAttack)
            }
        }
    }

    attack(character:AliveEntity, ability:EnemyStraightAttack){
        let action = false;
        const agroBox = character.box.toPolygon();

        if(SAT.testPolygonPolygon(ability.right.toPolygon(), agroBox)){
            EnemiesNetManager.ghostAttack(this.room, ability.directions.right, this.id)
            action = true
        }
        else if(SAT.testPolygonPolygon(ability.down.toPolygon(), agroBox)){
            EnemiesNetManager.ghostAttack(this.room, ability.directions.down, this.id)
            action = true
        }
        else if(SAT.testPolygonPolygon(ability.left.toPolygon(), agroBox)){
            EnemiesNetManager.ghostAttack(this.room, ability.directions.left, this.id)
            action = true
        }
        else if(SAT.testPolygonPolygon(ability.up.toPolygon(), agroBox)){
            EnemiesNetManager.ghostAttack(this.room, ability.directions.up, this.id)
            action = true
        }
        
        if(action){
            this.attacking = true
            character.getDamage(this.damage, this)
            
            setTimeout(()=>{
                this.attacking = false
            }, (1/ability.speed)*ability.frames*1000)
        }
    }

    changeDirectionInput(vector:Vector2){
        // console.log(vector)
        // console.log(this.id)
        NetManager.enemyMoves(this.room, this, vector)
        super.changeDirectionInput(vector)
    }

    getDamage(damage:number, character:AliveEntity){
        console.log(this.id + ": damage " + damage)
        NetManager.enemyReceiveDamage(this.room, this, damage)
        this.health -= damage;
        this.schema.health -= damage;
        console.log(this.schema.health)

        this.agro = true;
        this.agroTargets.push(character);

        if(this.health <= 0){
            this.dead = true
            setTimeout((enemy:BasicMeleeEnemy)=>{
                console.log(this.id, "died")
                enemy.room.state.basicMeleeEnemies.delete(this.id)
                enemy.worldManager.enemies.delete(this.id)
                
                let enemies = this.worldManager.mapParitions.get(this.partition)
    
                enemies.splice(enemies.indexOf(this), 1)
            }, 100, this)
        }
    }

    randomMovement(enemy: BasicMeleeEnemy){
        if(getRandomInt(1, 10) > 2 && !this.agro){
            enemy.idle = false;
            let x = getRandomInt(enemy.testX-80, enemy.testX+80);
            let y = getRandomInt(enemy.testY-80, enemy.testY+80);
            enemy.changeDirectionInput({x: x, y:y})
        }
        if(!enemy.dead && !enemy.agro)
            setTimeout(enemy.randomMovement, 5000, enemy)
    }
}