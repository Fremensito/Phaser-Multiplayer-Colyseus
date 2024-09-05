import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";
import { getTime } from "../utils/Functions";
import { scytheGirlAbilities } from "../utils/HabilitiesGeneratos";
import { WorldManager } from "../managers/WorldManager";
import { Enemy } from "../game-objects/Enemy";
import { ICharacter } from "../interfaces/Character";
import { IEnemy } from "../interfaces/Enemy";
import { Vector2 } from "../interfaces/Vector2";
import SAT from "sat";
import { getRandomInt } from "../math/Math";
import { ScytheGirl } from "../game-objects/scythe-girl/ScytheGirl";
import { NetManager } from "../managers/NetManager";

export class MyRoom extends Room<RoomState> {

    worldManager: WorldManager;

    onCreate (options: any) {

        this.setState(new RoomState());
        this.autoDispose = false;
        this.maxClients = 10;
        this.worldManager = new WorldManager();
        this.clock.start();

        this.onMessage("wk", (client, message:Vector2) => {
            NetManager.walk(this,client, message)
        });

        this.onMessage("q", (client, message:{direction:Vector2, weaponDirection:string})=>{
            NetManager.useQ(this, client, message.direction, message.weaponDirection)
        })

        this.onMessage("w", (client, direction:Vector2)=>{
            NetManager.useW(this, client, direction)
        })

        this.onMessage("ping", (client)=>{
            client.send("ping")
        })


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
            this.worldManager.scytheGirls.forEach((s:ScytheGirl,k)=>{
                s.update(delta);
                s.abilities.forEach(a => a.update(s.position.x, s.position.y))
            })

            this.worldManager.enemies.forEach((e:Enemy)=>{
                e.update(delta)
            })

            this.worldManager.checkCollisions(delta)

        }, 10)

        this.setPatchRate(16);  
    }

    onJoin (client: Client, options: any) {
        console.log("connected: " + client.sessionId + " time: " + getTime())
        let character = new ScytheGirl(0.05, 280, 280, [], client.sessionId, "scythe-girl",this, this.worldManager)
        character.abilities = scytheGirlAbilities(this.worldManager)

        let characters = new Array<ICharacter>()
        this.worldManager.scytheGirls.forEach((s:ScytheGirl)=>characters.push(s.getData()))
        let enemiesSend = new Array<IEnemy>
        this.worldManager.enemies.forEach((e:Enemy) => enemiesSend.push(e.getData()))

        client.send("update", {characters: characters, enemies: enemiesSend})
        this.broadcast("pe", character.getData())
    }

    onLeave (client: Client, consented: boolean) {
        console.log("disconnected: " + client.sessionId + " time: " + getTime())
        this.worldManager.scytheGirls.delete(client.sessionId)
        this.state.characters.delete(client.sessionId)
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
