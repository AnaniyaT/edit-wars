FROM golang:1.22.3-alpine

RUN apk add --no-cache git

WORKDIR /app

COPY go.mod .
COPY go.sum .

RUN go mod download

COPY . .

RUN go build -o /app/build/server ./cmd

EXPOSE 8080

RUN chmod +x /app/build/serve.sh

CMD ["/app/build/serve.sh"]
