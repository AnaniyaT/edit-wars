package websocket

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/google/uuid"
	"github.com/gorilla/websocket"
)

type Message struct {
	TopicId uuid.UUID
	Data    []byte
}

type WSMessage struct {
	Type string      `json:"type"`
	Data interface{} `json:"data"`
}

var upgrader = websocket.Upgrader{
	ReadBufferSize:  1024,
	WriteBufferSize: 1024,
}

// Hub maintains the set of active clients and broadcasts messages to the
// clients.
type Hub struct {
	// Registered clients.
	topics map[uuid.UUID]map[*Client]bool

	// Inbound messages from the clients.
	onMessage chan *Message

	// OnMessageHandler is a function that is called when a message is received.
	onMessageHandlers map[string]func(message Message)

	// Outbound messages to the clients.
	broadcast chan *Message

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client
}

func NewHub() *Hub {
	messageHandlers := make(map[string]func(message Message))
	messageHandlers["default"] = func(message Message) {}

	return &Hub{
		broadcast:         make(chan *Message),
		onMessage:         make(chan *Message),
		onMessageHandlers: messageHandlers,
		register:          make(chan *Client),
		unregister:        make(chan *Client),
		topics:            make(map[uuid.UUID]map[*Client]bool),
	}
}

// For users of the api, pushes the message to the queue

func (h *Hub) Broadcast(message Message) {
	h.broadcast <- &message
}

// Register a message handler func to a message type
func (h *Hub) OnMessage(messageType string, handler func(message Message)) {
	h.onMessageHandlers[messageType] = handler
}

func (h *Hub) registerClient(client *Client) {
	h.topics[client.topicId][client] = true
}

func (h *Hub) unregisterClient(client *Client) {
	if _, ok := h.topics[client.topicId]; ok {
		if _, ok := h.topics[client.topicId][client]; ok {
			delete(h.topics[client.topicId], client)
			close(client.send)
		}

		// if there are no more clients in the topic, delete the topic
		if len(h.topics[client.topicId]) == 0 {
			delete(h.topics, client.topicId)
		}
	}
}

// internal use, actually broadcasts
func (h *Hub) broadcastMessage(message Message) {
	clients, ok := h.topics[message.TopicId]
	if !ok {
		return
	}

	for client := range clients {
		select {
		case client.send <- message.Data:
		default: // if client can't receive message, remove it
			close(client.send)
			delete(clients, client)
		}
	}
}

func (h *Hub) dispatchMessageHandler(message Message) {
	var wsMessage WSMessage
	err := json.Unmarshal(message.Data, &wsMessage)
	if err != nil {
		h.onMessageHandlers["default"](message)
		return
	}
	handler, ok := h.onMessageHandlers[wsMessage.Type]
	if !ok {
		h.onMessageHandlers["default"](message)
		return
	}

	handler(message)
}

func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.registerClient(client)

		case client := <-h.unregister:
			h.unregisterClient(client)

		case message := <-h.onMessage:
			h.dispatchMessageHandler(*message)

		case message := <-h.broadcast:
			h.broadcastMessage(*message)
		}
	}
}

// serveWs handles websocket requests from the peer.
func ServeWs(hub *Hub, clientId uuid.UUID, topicId uuid.UUID, w http.ResponseWriter, r *http.Request) {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{Id: clientId, hub: hub, conn: conn, send: make(chan []byte, 256), topicId: topicId}
	client.hub.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.WritePump()
	go client.ReadPump()
}
