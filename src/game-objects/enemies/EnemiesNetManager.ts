import { MyRoom } from "../../rooms/MyRoom";

export class EnemiesNetManager{
    private static commands = {
        basicMeleeAttack: "basicMeleeAttack",
    }
    static ghostAttack(room:MyRoom, direction:string, id: string){
        room.broadcast(this.commands.basicMeleeAttack, {id: id, direction: direction})
    }
}