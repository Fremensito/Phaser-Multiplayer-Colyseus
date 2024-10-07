import { Schema, type, MapSchema } from "@colyseus/schema";
import { SAliveEntity } from "../../schemas/SAliveEntity";
import { SScytheGirl } from "../../schemas/characters/SScytheGirl";
import { SBasicMelee } from "../../schemas/enemies/SBasicMelee";

export class RoomState extends Schema {
    @type({map: SAliveEntity}) scytheGirls = new MapSchema<SScytheGirl, string>();
    @type({map: SBasicMelee}) basicMeleeEnemies = new MapSchema<SBasicMelee, string>();
}
