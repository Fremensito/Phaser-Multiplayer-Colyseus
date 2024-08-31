import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";
import { getTime } from "../utils/Functions";
import { scytheGirlAbilities } from "../utils/HabilitiesGeneratos";
import { WorldManager } from "../managers/WorldManager";
import { CharactersManager } from "../managers/CharactersManager";
import { Enemy } from "../game-objects/Enemy";
import { Character } from "../game-objects/Character";
import { ICharacter } from "../interfaces/Character";
import { IEnemy } from "../interfaces/Enemy";
import { Vector2 } from "../interfaces/Vector2";
import SAT from "sat";
import { getRandomInt } from "../math/Math";

export class MyRoom extends Room<RoomState> {

    worldManager: WorldManager;

    onCreate (options: any) {

        this.setState(new RoomState());
        this.autoDispose = false;
        this.maxClients = 10;
        this.clock.start();

        this.onMessage("wk", (client, message:Vector2) => {
            this.walk(client, message)
        });

        this.onMessage("q", (client, message:{direction:Vector2, weaponDirection:string})=>{
            this.useQ(client, message.direction, message.weaponDirection)
        })

        this.onMessage("w", (client, direction:Vector2)=>{
            this.useW(client, direction)
        })

        this.onMessage("ping", (client)=>{
            client.send("ping")
        })


        this.worldManager = new WorldManager();

        // new Enemy(0.035, 320, 320, [], "ghost", this, this.worldManager)
        // new Enemy(0.035, 320, 320,[], "ghost1", this, this.worldManager)
        // new Enemy(0.035, 320, 320, [], "ghost2", this, this.worldManager)
        // new Enemy(0.035, 320, 330, [], "ghost3", this, this.worldManager)
        // new Enemy(0.035, 320, 320, [], "ghost4", this, this.worldManager)
        // new Enemy(0.035, 320, 320,[], "ghost5", this, this.worldManager)
        // new Enemy(0.035, 320, 320, [], "ghost6", this, this.worldManager)
        // new Enemy(0.035, 320, 330, [], "ghost7", this, this.worldManager)

        for(let i = 0; i < 50; i++){
            new Enemy(0.035, getRandomInt(100, 700), getRandomInt(100, 700), [], "ghost"+i.toString(), this, this.worldManager)
        }

        this.setSimulationInterval((delta)=>{
            this.worldManager.players.forEach((c:Character,k)=>{
                c.update(delta);
                c.abilities.forEach(a => a.update())
            })

            this.worldManager.enemies.forEach((e:Enemy)=>{
                e.update(delta)
            })

            this.worldManager.checkCollisions(delta)

        }, 10)

        this.setPatchRate(16);  
    }

    walk(client:Client<any, any>, direction:Vector2){
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

    useQ(client:Client<any, any>, direction: Vector2, weaponDirection: string){
        if(this.worldManager.players.get(client.sessionId)?.abilities[0].available){
            CharactersManager.useQ(this.worldManager.players.get(client.sessionId)!, 
                this.worldManager.players.get(client.sessionId)!.abilities[0], weaponDirection, this.clock)
            this.broadcast("q", {id: client.sessionId, direction:direction, weaponDirection: weaponDirection})
            console.log("q: " + client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log("q: " + client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    useW(client:Client<any,any>, direction:Vector2){
        console.log(direction)
        if(this.worldManager.players.get(client.sessionId)?.abilities[1].available){
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

    enemyMoves(enemy:Enemy, vector:Vector2){
        this.broadcast("em", {id: enemy.id, vector: vector});
    }

    onJoin (client: Client, options: any) {
        console.log("connected: " + client.sessionId + " time: " + getTime())
        let character = new Character(0.05, 280, 280, [], client.sessionId, "scythe-girl",this, this.worldManager)
        character.abilities = scytheGirlAbilities(character, this.worldManager)

        let characters = new Array<ICharacter>()
        this.worldManager.players.forEach((c:Character)=>characters.push(c.getData()))
        let enemiesSend = new Array<IEnemy>
        this.worldManager.enemies.forEach((e:Enemy) => enemiesSend.push(e.getData()))

        client.send("update", {characters: characters, enemies: enemiesSend})
        this.broadcast("pe", character.getData())
    }

    onLeave (client: Client, consented: boolean) {
        console.log("disconnected: " + client.sessionId + " time: " + getTime())
        this.worldManager.players.delete(client.sessionId)
        this.state.characters.delete(client.sessionId)
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
