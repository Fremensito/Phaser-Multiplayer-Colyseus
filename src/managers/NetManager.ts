import { Client } from "colyseus"
import { Vector2 } from "../interfaces/Vector2"
import { MyRoom } from "../rooms/MyRoom"
import { CharactersManager } from "./CharactersManager"
import { getTime } from "../utils/Functions"
import { Enemy } from "../game-objects/Ghost"
import { ScytheGirlNetManager } from "../game-objects/scythe-girl/ScytheGirlNetManager"

export class NetManager{

    static set(room: MyRoom){
        room.onMessage("wk", (client, message:Vector2) => {
            NetManager.walk(room,client, message)
        });

        room.onMessage("ping", (client)=>{
            client.send("ping")
        })
        
        this.setManagers(room)
    }

    static setManagers(room: MyRoom){
        ScytheGirlNetManager.set(room)
    }
    
    static walk(room:MyRoom, client:Client<any, any>, direction:Vector2){
        if(!isNaN(direction.x) && !isNaN(direction.y)){
            CharactersManager.pointerDownMove(room.worldManager.scytheGirls.get(client.sessionId)!, direction)
            room.broadcast("wk", {id: client.sessionId, direction: direction})
            console.log("wk: "+ client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log("wk: "+ client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    static enemyMoves(room:MyRoom, enemy:Enemy, vector:Vector2){
        room.broadcast("em", {id: enemy.id, vector: vector});
    }

    static enemyReceiveDamage(room:MyRoom, enemy:Enemy, damage:number){
        room.broadcast("ed", {id:enemy.id, damage: damage})
    }
    
}