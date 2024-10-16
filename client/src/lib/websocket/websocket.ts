import { Queue } from "@/lib/containers/collections.ts";
import { MessageData, MessageHandler, MessageType, WSMessage } from "@/lib/websocket/ws-message.ts";
import { Operation } from "@/lib/crdt/operation.ts";

// WebSocket connection class.
//
// Manages a message queue and handlers for different message types.
class WSConnection {
    private ws: WebSocket;
    private queue: Queue<WSMessage<Operation>>;
    private handlers: Map<MessageType, MessageHandler<MessageData>>;
    private queueIntervalId: NodeJS.Timeout | null = null;

    connected: boolean;
    onConnectionChangeCallback: (connected: boolean) => void;
    onDisconnectCallback: () => void;

    QUEUE_CHECK_INTERVAL = 1;
    MAX_RETRIES = 10;
    RETRY_INTERVAL = 3;

    constructor(clientId: string, documentId: string) {
        const url = "ws://localhost:8080/ws";
        const token = "ac83e344-2856-4ae1-a839-55d60c75fa12";
        const wsUrl = `${url}?cid=${clientId}&d=${documentId}&tok=${token}`;
        this.connected = false;
        this.onConnectionChangeCallback = () => {};
        this.onDisconnectCallback = () => {};

        this.ws = new WebSocket(wsUrl);
        this.setupWs();
        this.queue = new Queue<WSMessage<Operation>>();
        this.handlers = new Map<MessageType, MessageHandler<MessageData>>();
    }

    private setupWs() {
        this.ws.onopen = () => {
            this.connected = true;
            this.onConnectionChangeCallback(true);
        }

        this.ws.onclose = () => {
            this.connected = false;
            this.retryConnect();
            this.onConnectionChangeCallback(false);
        }
    }

    // Register a handler for a specific message type.
    // The handler will be called when a message of the specified type is received.
    registerHandler(type: MessageType, handler: MessageHandler<MessageData>) {
        this.handlers.set(type, handler);
    }

    // Start listening for messages from the server and call the appropriate handler.
    // Handlers are registered using the `registerHandler` method.
    listen() {
        const messageHandler = (event: MessageEvent) => {
            const data = JSON.parse(event.data);
            const message = new WSMessage<Operation>(data.type, data.data);
            if (this.handlers.has(message.type)) {
                this.handlers.get(message.type)!(message);
            } else {
                console.error(`No handler for message type: ${message.type}`);
            }
        }
        this.ws.addEventListener("message", messageHandler);
    }

    // Send a message to the server.
    //
    // It doesn't guarantee that the message will be sent immediately.
    // The message will be added to a queue and sent eventually.
    enqueue(message: WSMessage<Operation>) {
        this.queue.enqueue(message);
    }

    // Start sending messages from the queue.
    startQueue() {
        this.queueIntervalId = setInterval(() => {
            this.sendFromQueue();
        }, this.QUEUE_CHECK_INTERVAL);
    }

    // Stop sending messages from the queue.
    stopQueue() {
        if (this.queueIntervalId) {
            clearInterval(this.queueIntervalId);
        }
    }

    // Register a callback to be called when the connection status changes.
    onConnectionChange(callback: (connected: boolean) => void) {
        this.onConnectionChangeCallback = callback;
    }

    // Register a callback to be called when the maximum number of retries is reached.
    // This can be used to notify the user that the connection could not be established.
    onDisconnect(callback: () => void) {
        this.onDisconnectCallback = callback;
    }

    // Close the WebSocket connection
    close() {
        this.stopQueue();
        this.ws.close();
    }

    private send(data: any) {
        this.ws.send(JSON.stringify(data));
    }

    private sendFromQueue() {
        if (!this.queue.isEmpty()) {
            const message = this.queue.dequeue();
            this.send(message.toJSON());
        }
    }

    private retryConnect() {
        let retries = 0;
        const intervalId = setInterval(() => {
            if (this.connected || retries >= this.MAX_RETRIES) {
                clearInterval(intervalId);
            } else {
                this.ws = new WebSocket(this.ws.url);
                this.setupWs();
                retries++;
            }
        }, this.RETRY_INTERVAL);
    }
}

export { WSConnection };