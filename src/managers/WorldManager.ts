import { Character } from "../game-objects/Character";
import { Enemy } from "../game-objects/Enemy";

export class WorldManager{
    enemies = new Map<string, Enemy>();
    players = new Map<string, Character>();
}