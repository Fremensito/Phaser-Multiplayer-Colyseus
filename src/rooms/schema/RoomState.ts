import { Schema, type, MapSchema } from "@colyseus/schema";
import { SAliveEntity } from "../../schemas/SAliveEntity";
import { SScytheGirl } from "../../schemas/SScytheGirl";

export class RoomState extends Schema {
    @type({map: SAliveEntity}) scytheGirls = new MapSchema<SScytheGirl, string>();
    @type({map: SAliveEntity}) enemies = new MapSchema<SAliveEntity, string>();
}
