# Notification Service

A scalable, event-driven notification microservice built with NestJS and TypeScript. It listens to hiring pipeline events from Kafka and dispatches notifications to users via multiple channels (Email, Push, Console) based on their roles and event types.

---

## Features

- ✅ Kafka event consumption
- ✅ EventEmitter2 for internal event routing
- ✅ Role + event-type-based routing logic
- ✅ Multi-recipient, multi-channel notification dispatch
- ✅ Email, Push, and Console adapters
- ✅ Notification logging to PostgreSQL
- ✅ Modular and testable architecture (unit + integration)
- ✅ Swagger API documentation

---

## Tech Stack

- **NestJS** (modular app structure)
- **Kafka** (event ingestion)
- **EventEmitter2** (internal event routing)
- **TypeORM + PostgreSQL** (notification logging)
- **Jest** (unit + integration testing)
- **Swagger** (auto-generated API docs)

---

## Setup Instructions

### 1. Install Dependencies

npm install

### 2. Configure Environment Variables

Create a `.env` file:

env
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=password
DB_NAME=notification_db
NODE_ENV=development

### 3. Run Postgres (if not already running)

docker run --name pg-local -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=notification_db -p 5432:5432 -d postgres

### 4. Run Migrations

npm run migration:run

### 5. Start the Service

npm run start:dev

---

## Testing

# Run unit and integration tests

npm run test

---

## Swagger API

Visit: `http://localhost:3000/api`

### Test Example

curl -X POST http://localhost:3000/notifications/event \
 -H "Content-Type: application/json" \
 -d '{
"type": "OFFER_EXTENDED",
"recipients": [
{ "role": "CANDIDATE", "identifier": "alice@example.com" },
{ "role": "RECRUITER", "identifier": "recruiter@example.com" }
],
"payload": {
"position": "Software Engineer"
}
}'

## Event Routing (routingMap)

| Event Type           | Roles Notified            | Channels             |
| -------------------- | ------------------------- | -------------------- |
| APPLICATION_RECEIVED | RECRUITER                 | email, console       |
| INTERVIEW_SCHEDULED  | CANDIDATE, HIRING_MANAGER | email, push          |
| OFFER_EXTENDED       | CANDIDATE, RECRUITER      | email, console, push |
| APPLICATION_REJECTED | CANDIDATE                 | email                |
| OFFER_ACCEPTED       | HIRING_MANAGER, RECRUITER | email                |
| OFFER_DECLINED       | HIRING_MANAGER, RECRUITER | email                |

## Assumptions Made

- All recipients provide a channel-agnostic `identifier` field
- All events are ingested via Kafka and not directly via API (except for testing)
- No retries or deduplication implemented (yet)
- No external integrations for actual email/push — currently using console logs

---

## What I'd Improve With More Time

- Add retry logic with backoff for failed notifications using bull queue
- Use templates for rendering channel-specific messages
- Add per-user notification preferences
- Integrate with actual services like SendGrid and FCM
- Track delivery status in a `PENDING → SUCCESS/FAILED` model
- Add dead-letter queue (DLQ) support for Kafka failures

---
