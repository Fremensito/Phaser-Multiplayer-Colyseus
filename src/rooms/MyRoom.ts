import { Room, Client } from "@colyseus/core";
import { RoomState } from "./schema/RoomState";
import { getTime } from "../utils/Functions";
import { ghostAbilities, scytheGirlAbilities } from "../utils/HabilitiesGeneratos";
import { WorldManager } from "../managers/WorldManager";
import { BasicMeleeEnemy } from "../game-objects/enemies/BasicMeleeEnemy";
import { ICharacter } from "../interfaces/Character";
import { IEnemy } from "../interfaces/Enemy";
import { getRandomInt } from "../math/Math";
import { ScytheGirl } from "../game-objects/characters/scythe-girl/ScytheGirl";
import { NetManager } from "../managers/NetManager";
import { classes } from "../utils/Classes";
import { Enemy } from "../game-objects/enemies/Enemy";

export class MyRoom extends Room<RoomState> {
    static debug = true;
    worldManager: WorldManager;

    onCreate (options: any) {

        this.setState(new RoomState());
        this.autoDispose = false;
        this.maxClients = 10;
        this.worldManager = new WorldManager();
        this.clock.start();

        NetManager.set(this)

        // new Enemy(0.035, 320, 320, [], "ghost", this, this.worldManager)
        // new Enemy(0.035, 320, 320,[], "ghost1", this, this.worldManager)
        // new Enemy(0.035, 320, 320, [], "ghost2", this, this.worldManager)
        // new Enemy(0.035, 320, 330, [], "ghost3", this, this.worldManager)
        // new Enemy(0.035, 320, 320, [], "ghost4", this, this.worldManager)
        // new Enemy(0.035, 320, 320,[], "ghost5", this, this.worldManager)
        // new Enemy(0.035, 320, 320, [], "ghost6", this, this.worldManager)
        // new Enemy(0.035, 320, 330, [], "ghost7", this, this.worldManager)

        for(let i = 0; i < 50; i++){
            let enemy = new BasicMeleeEnemy(0.035, 10, getRandomInt(100, 700), getRandomInt(100, 700), [],
             "ghost"+i.toString(), this, this.worldManager)
            enemy.abilities = ghostAbilities(this.worldManager, enemy)
        }

        //Game main loop
        this.setSimulationInterval((delta)=>{
            this.worldManager.scytheGirls.forEach((s:ScytheGirl,k)=>{
                s.update(delta);
                //s.abilities.forEach(a => a.update(s, s.position.x, s.position.y))
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
        let character = new ScytheGirl(0.05, 10, 280, 280, [], client.sessionId, classes.scytheGirl,this, this.worldManager)
        character.abilities = scytheGirlAbilities(this.worldManager, character)

        let characters = new Array<ICharacter>()
        this.worldManager.scytheGirls.forEach((s:ScytheGirl)=>characters.push(s.getData()))
        let enemiesSend = new Array<IEnemy>
        this.worldManager.enemies.forEach((e:Enemy) => enemiesSend.push(e.getData()))

        client.send("update", {characters: characters, enemies: enemiesSend})
        this.broadcast("pe", character.getData())
    }

    onLeave (client: Client, consented: boolean) {
        console.log("disconnected: " + client.sessionId + " time: " + getTime())
        this.worldManager.scytheGirls.get(client.sessionId).disconnected = true;
        this.worldManager.scytheGirls.delete(client.sessionId)
        this.state.scytheGirls.delete(client.sessionId)
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

}
