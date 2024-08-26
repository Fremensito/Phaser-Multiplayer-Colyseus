import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";
import { getTime } from "../utils/Functions";
import { Engine } from "matter-js";
import Matter from "matter-js";
import { scytheGirlAbilities } from "../utils/HabilitiesGeneratos";
import { WorldManager } from "../managers/WorldManager";
import { CharactersManager } from "../managers/CharactersManager";
import { Enemy } from "../game-objects/Enemy";
import { Character } from "../game-objects/Character";
import { QAbility } from "../combat/scythe-girl/QAbility";
import { WAbility } from "../combat/scythe-girl/WAbility";
import { ICharacter } from "../interfaces/Character";
import { IEnemy } from "../interfaces/Enemy";

export class MyRoom extends Room<RoomState> {

    maxClients: 10;
    engine: Engine;
    worldManager: WorldManager;

    onCreate (options: any) {

        this.setState(new RoomState());
        this.autoDispose = false;
        this.clock.start();

        this.onMessage("wk", (client, message:Matter.Vector) => {
            this.walk(client, message)
        });

        this.onMessage("q", (client, message:{direction:Matter.Vector, weaponDirection:string})=>{
            this.useQ(client, message.direction, message.weaponDirection)
        })

        this.onMessage("w", (client, direction:Matter.Vector)=>{
            this.useW(client, direction)
        })

        this.onMessage("ping", (client)=>{
            client.send("ping")
        })

        const Engine = Matter.Engine
        const Composite = Matter.Composite;

        this.engine = Engine.create()
        this.engine.gravity.x = 0;
        this.engine.gravity.y = 0;

        this.worldManager = new WorldManager();

        new Enemy(0.4, 320, 320, [], "ghost", this.engine, this, this.worldManager)
        new Enemy(0.4, 320, 324,[], "ghost1", this.engine, this, this.worldManager)
        new Enemy(0.4, 320, 328, [], "ghost2", this.engine, this, this.worldManager)
        new Enemy(0.4, 320, 334, [], "ghost3", this.engine, this, this.worldManager)
        console.log(this.state.enemies)

        this.setSimulationInterval((delta)=>{

            this.worldManager.players.forEach((c:Character,k)=>{
                c.update();
                c.abilities.forEach(a => a.update())
            })

            this.worldManager.enemies.forEach((e:Enemy)=>{
                e.update()
            })
            
            Matter.Engine.update(this.engine, delta)
        })
    }

    walk(client:Client<any, any>, direction:Matter.Vector){
        if(!isNaN(direction.x) && !isNaN(direction.y)){
            CharactersManager.pointerDownMove(this.worldManager.players.get(client.sessionId)!, direction)
            this.broadcast("wk", {id: client.sessionId, direction: direction})
            console.log("wk: "+ client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log("wk: "+ client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    useQ(client:Client<any, any>, direction:Matter.Vector, weaponDirection: string){
        if(this.worldManager.players.get(client.sessionId)?.abilities[0].available && (!isNaN(direction.x) && !isNaN(direction.y))){
            CharactersManager.useQ(this.worldManager.players.get(client.sessionId)!, 
                this.worldManager.players.get(client.sessionId)!.abilities[0], weaponDirection, this.clock)
            this.broadcast("q", {id: client.sessionId, direction:direction})
            console.log("q: " + client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log("q: " + client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    useW(client:Client<any,any>, direction:Matter.Vector){
        console.log(direction)
        if(this.worldManager.players.get(client.sessionId)?.abilities[1].available && (!isNaN(direction.x) && !isNaN(direction.y))){
            CharactersManager.useW(this.worldManager.players.get(client.sessionId)!, direction, this.clock);
            this.broadcast("w", {id: client.sessionId, direction: direction});
            console.log("w: "+ client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log("w: "+ client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    enemyMoves(enemy:Enemy, vector:Matter.Vector){
        this.broadcast("em", {id: enemy.id, vector: vector});
    }

    onJoin (client: Client, options: any) {
        console.log("connected: " + client.sessionId + " time: " + getTime())
        let character = new Character(0.6, 280, 280, [], client.sessionId, "scythe-girl", this.engine, this, this.worldManager)
        character.abilities = scytheGirlAbilities(character, this.engine, this.worldManager)

        let characters = new Array<ICharacter>()
        this.worldManager.players.forEach((c:Character)=>characters.push(c.getData()))
        let enemiesSend = new Array<IEnemy>
        this.worldManager.enemies.forEach((e:Enemy) => enemiesSend.push(e.getData()))

        client.send("update", {characters: characters, enemies: enemiesSend})
        this.broadcast("pe", character.getData())
    }

    onLeave (client: Client, consented: boolean) {
        let ability:QAbility = this.worldManager.players.get(client.sessionId).abilities[0] as QAbility;
        console.log("disconnected: " + client.sessionId + " time: " + getTime())
        Matter.Composite.remove(this.engine.world, [ability.right, ability.down, ability.left, ability.up])
        Matter.Composite.remove(this.engine.world, (this.worldManager.players.get(client.sessionId).abilities[1] as WAbility).hitbox)
        this.worldManager.players.delete(client.sessionId)
        this.state.characters.delete(client.sessionId)
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
