
export type ChrPosition = number[];

class Character {
    id: string;
    position: ChrPosition;
    value: string;

    constructor(id: string, position: ChrPosition, value: string) {
        this.id = id;
        this.position = position;
        this.value = value;
    }

    static fromJSON(json: any): Character {
        return new Character(json.id, json.position, json.value);
    }

    toJSON(): any {
        return {
            id: this.id,
            position: this.position,
            value: this.value
        };
    }
}

export default Character;