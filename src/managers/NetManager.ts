import { Client } from "colyseus"
import { CharacterManagersProvider } from "../providers/CharacterManagersProvider"
import { Vector2 } from "../interfaces/Vector2"
import { MyRoom } from "../rooms/MyRoom"
import { CharactersManager } from "./CharactersManager"
import { getTime } from "../utils/Functions"
import { ScytheGirlManager } from "../game-objects/scythe-girl/ScytheGirlManager"
import { Enemy } from "../game-objects/Enemy"

export class NetManager{
    
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

    static useQ(room:MyRoom, client:Client<any, any>, direction: Vector2, weaponDirection: string){
        if(room.worldManager.scytheGirls.get(client.sessionId)?.abilities[0].available){
            ScytheGirlManager.useQ(room.worldManager.scytheGirls.get(client.sessionId)!, 
                room.worldManager.scytheGirls.get(client.sessionId)!.abilities[0], weaponDirection, room.clock)
            room.broadcast("q", {id: client.sessionId, direction:direction, weaponDirection: weaponDirection})
            console.log("q: " + client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log("q: " + client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    static useW(room:MyRoom, client:Client<any,any>, direction:Vector2){
        console.log(direction)
        if(room.worldManager.scytheGirls.get(client.sessionId)?.abilities[1].available){
            ScytheGirlManager.useW(room.worldManager.scytheGirls.get(client.sessionId)!, direction, room.clock);
            room.broadcast("w", {id: client.sessionId, direction: direction});
            console.log("w: "+ client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log("w: "+ client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    static enemyMoves(room:MyRoom, enemy:Enemy, vector:Vector2){
        room.broadcast("em", {id: enemy.id, vector: vector});
    }

    static enemyReceiveDamage(room:MyRoom, enemy:Enemy){
        room.broadcast("ed", enemy.id)
    }
}