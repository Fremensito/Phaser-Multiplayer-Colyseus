import { SStraightDirectionsAbility } from "../schemas/combat/SStraightDirectionAbility";
import SAT from "sat";
import { SVector2 } from "../schemas/SVector2";

export function generateDebugger([up, down, right, left]: Array<SAT.Box>, schema: SStraightDirectionsAbility){
    up.toPolygon().calcPoints.forEach(()=>{
        let sschema = new SVector2();
        schema.up.push(sschema);
    })

    down.toPolygon().calcPoints.forEach(()=>{
        let sschema = new SVector2();
        schema.down.push(sschema);
    })

    right.toPolygon().calcPoints.forEach(()=>{
        let sschema = new SVector2();
        schema.right.push(sschema);
    })

    left.toPolygon().calcPoints.forEach(()=>{
        let sschema = new SVector2();
        schema.left.push(sschema);
    })
}

export function updateStraightDirectionAbility([up, down, right, left]: Array<SAT.Box>, schema: SStraightDirectionsAbility){
    for(let i = 0; i < up.toPolygon().calcPoints.length; i++){
        schema.up[i].x = up.pos.x + up.toPolygon().calcPoints[i].x;
        schema.up[i].y = up.pos.y + up.toPolygon().calcPoints[i].y;
    }

    for(let i = 0; i < down.toPolygon().calcPoints.length; i++){
        schema.down[i].x = down.pos.x + down.toPolygon().calcPoints[i].x;
        schema.down[i].y = down.pos.y + down.toPolygon().calcPoints[i].y;
    }

    for(let i = 0; i < right.toPolygon().calcPoints.length; i++){
        schema.right[i].x = right.pos.x + right.toPolygon().calcPoints[i].x;
        schema.right[i].y = right.pos.y + right.toPolygon().calcPoints[i].y;
    }

    for(let i = 0; i < left.toPolygon().calcPoints.length; i++){
        schema.left[i].x = left.pos.x + left.toPolygon().calcPoints[i].x;
        schema.left[i].y = left.pos.y + left.toPolygon().calcPoints[i].y;
    }
}
