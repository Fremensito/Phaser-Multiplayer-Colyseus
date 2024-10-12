export interface UIAbility{
    abilityWidth: number;
    abilityHeight: number
    slotResource: string;
    iconResource: string;
}

export interface IAbility{
    name: string;
    cooldown: number;
    speed: number;
    mana_cost: number;
    particlesSprite: string;
    range: number
    UI: UIAbility;
}

export interface StraighAttackDirections{
    down:string;
    right:string;
    left:string;
    up:string;
}
