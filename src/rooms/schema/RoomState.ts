import { Schema, type, MapSchema } from "@colyseus/schema";
import { SAliveEntity } from "../../schemas/SAliveEntity";

export class RoomState extends Schema {

    @type({map: SAliveEntity}) characters = new MapSchema<SAliveEntity, string>();
    @type({map: SAliveEntity}) enemies = new MapSchema<SAliveEntity, string>();
}
