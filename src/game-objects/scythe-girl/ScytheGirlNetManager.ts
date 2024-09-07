import { Client } from "colyseus"
import { MyRoom } from "../../rooms/MyRoom"
import { ScytheGirlManager } from "./ScytheGirlManager"
import { Vector2 } from "../../interfaces/Vector2"
import { getTime } from "../../utils/Functions"

export class ScytheGirlNetManager{

    private static commands = {
        q: "sgq",
        w: "sgw",
    }

    static set(room:MyRoom){
        room.onMessage(this.commands.q, (client, message:{direction:Vector2, weaponDirection:string})=>{
            this.useQ(room, client, message.direction, message.weaponDirection)
        })

        room.onMessage(this.commands.w, (client, direction:Vector2)=>{
            this.useW(room, client, direction)
        })
    }

    static useQ(room:MyRoom, client:Client<any, any>, direction: Vector2, weaponDirection: string){
        if(room.worldManager.scytheGirls.get(client.sessionId)?.abilities[0].available){
            ScytheGirlManager.useQ(room.worldManager.scytheGirls.get(client.sessionId)!, 
                room.worldManager.scytheGirls.get(client.sessionId)!.abilities[0], weaponDirection, room.clock)
            room.broadcast(this.commands.q, {id: client.sessionId, direction:direction, weaponDirection: weaponDirection})
            console.log(this.commands.q + ": " + client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log(this.commands.q + ": " + client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }

    static useW(room:MyRoom, client:Client<any,any>, direction:Vector2){
        console.log(direction)
        if(room.worldManager.scytheGirls.get(client.sessionId)?.abilities[1].available){
            ScytheGirlManager.useW(room.worldManager.scytheGirls.get(client.sessionId)!, direction, room.clock);
            room.broadcast(this.commands.w, {id: client.sessionId, direction: direction});
            console.log(this.commands.w + ": " + client.sessionId + " time: " + getTime())
            console.log(true)
        }
        else{
            console.log(this.commands.w + ": " + client.sessionId + " time: " + getTime())
            console.log(false)
        }
    }
}