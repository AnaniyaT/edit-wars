import {Operation} from "@/lib/crdt/operation.ts";

enum MessageType {
    Operation = "operation",
    Cursor = "cursor",
}

type MessageData = Operation;

type MessageHandler<T extends MessageData> = (message: WSMessage<T>) => void;

class WSMessage<T extends MessageData> {
    type: MessageType;
    data: T;

    constructor(type: MessageType, data: T) {
        this.type = type;
        this.data = data;
    }

    fromJSON(json: any): WSMessage<T> {
        return new WSMessage<T>(json.type, json.data)
    }

    toJSON(): any {
        return {
            type: this.type,
            data: this.data
        };
    }
}

export { WSMessage, MessageType };
export type { MessageHandler, MessageData };