import SortedList from "@/lib/containers/sorted-list";
import {compareArrays} from "@/lib/utils";
import Character, {ChrPosition} from "@/lib/crdt/character";
import {Operation, OperationType} from "@/lib/crdt/operation";

class Document {
    chars: SortedList<Character>;
    operation_history: Operation[] = [];
    levelStrategies: string[] = [];
    boundary: number = 10;
    base: number = 1000;

    constructor() {
        const cmp = (a: Character, b: Character) => {
            const arrCmpRes = compareArrays(a.position, b.position);
            if (arrCmpRes === 0) {
                if (a.id == b.id) return 0;
                return a.id < b.id ? -1 : 1;
            }
            return arrCmpRes;
        }
        this.chars = new SortedList<Character>(cmp);
        this.chars.insert(new Character("0", [0], ""));
        this.chars.insert(new Character("1", [1000], ""));
    }

    delete(chr: Character) {
        this.chars.removeByCmp(chr);
    }

    deleteIndex(index: number) {
        this.chars.remove(this.chars.at(index));
    }

    // LSEQ shenanigans
    // https://hal.science/hal-00921633/document
    // TODO: Refactor for readability cuz this is a mess and it was a pain to write

    getPositionBetween(min: ChrPosition, max: ChrPosition): ChrPosition {
        min = [...min]; // copy the arrays (let's not mutate the input, learned that the hard way)
        max = [...max];
        const maxLen = Math.max(min.length, max.length);

        while (min.length < maxLen) min.push(0);
        while (max.length < maxLen) max.push(this.base * (2 ** max.length));

        let idx = min.length - 1;

        if (max[idx] - min[idx] < 2) {
            min.push(0);
            max.push(this.base * (2 ** max.length));
            idx++
        }

        if (this.levelStrategies[idx] == undefined) {
            this.levelStrategies[idx] = Math.random() > 0.5 ? "-" : "+";
        }

        const pos = min;
        if (this.levelStrategies[idx] == '+') {
            pos[idx] += this.boundary < (max[idx] - min[idx]) ? this.boundary : 1;
            return pos;
        }

        pos[idx] = max[idx] - (this.boundary < (max[idx] - min[idx]) ? this.boundary : 1);

        return pos;
    }

    insertAfter(character: Character, id: string, value: string): Character {
        const before = this.chars.indexOf(character);
        const after = this.chars.at(before + 1);
        const position = this.getPositionBetween(character.position, after.position);

        const new_character = new Character(id, position, value);
        // Insert the new character at the correct position
        this.chars.insert(new_character);

        return new_character
    }

    insertAfterIndex(index: number, id: string, value: string): Character {
        const character = this.chars.at(index);
        const after = this.chars.at(index + 1);
        const position = this.getPositionBetween(character.position, after.position)

        const new_character = new Character(id, position, value);
        // Insert the new character at the correct position
        this.chars.insert(new_character);

        return new_character;
    }

    insert(character: Character) {
        this.chars.insert(character);
    }

    private applyInsert(operation: Operation) {
        if (operation.type != OperationType.Insert) {
            throw Error("Operation must be of type 'INSERT'")
        }
        const character = new Character(operation.chrId, operation.position, operation.value);
        if (this.chars.exists(character)) return;
        this.insert(character);
    }

    private applyDelete(operation: Operation) {
        if (operation.type != OperationType.Delete) {
            throw Error("Operation must be of type 'DELETE'")
        }
        const character = new Character(operation.chrId, operation.position, "");
        this.chars.removeByCmp(character);
    }

    // Ugly code, but it works
    apply(operation: Operation) {
        switch (operation.type) {
            case OperationType.Insert:
                this.applyInsert(operation);
                break;
            case OperationType.Delete:
                this.applyDelete(operation);
                break;
            default:
                throw new Error(`Unknown operation type: ${operation.type}`);
        }

        this.operation_history.push(operation);
    }

    getText() {
        return this.chars.toList().map(char => char.value).join("");
    }

    getPositions() {
        return this.chars.toList().map(char => char.position);
    }
}

export default Document;
