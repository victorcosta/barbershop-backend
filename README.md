

# Barbershop Microservices Project

This project is a microservices-based system for managing barbershop appointments, availability, and user accounts. It includes the following services:
- API Gateway
- User Service
- Appointment Service
- Availability Service

## Prerequisites

Ensure you have the following installed:
- Docker
- Docker Compose

## Getting Started

### Clone the Repository

```sh
git clone <repository-url>
cd <repository-directory>
```

### Create Docker Network

Before starting the services, create a Docker network:

```sh
docker network create barbershop-backend-net
```

### Running the Services

To start all the services, run the following command in the root directory of the project:

```sh
docker-compose up --build -d
```

This command will:
- Build the Docker images for each service.
- Start the containers for the API Gateway, User Service, Appointment Service, and Availability Service.
- Start the PostgreSQL databases for each service.

### Accessing the Services

All services should be accessed through the API Gateway on port 3000. Below are some example endpoints:

#### User Service

- **Register User:** `POST http://localhost:3000/users/register`
- **Login User:** `POST http://localhost:3000/users/login`
- **Get Users:** `GET http://localhost:3000/users`

#### Appointment Service

- **Create Appointment:** `POST http://localhost:3000/appointments`
- **Get Appointments:** `GET http://localhost:3000/appointments`
- **Get Appointment by ID:** `GET http://localhost:3000/appointments/:id`
- **Update Appointment:** `PUT http://localhost:3000/appointments/:id`
- **Delete Appointment:** `DELETE http://localhost:3000/appointments/:id`

#### Availability Service

- **Create Availability:** `POST http://localhost:3000/availabilities`
- **Get Availabilities:** `GET http://localhost:3000/availabilities`
- **Get Availability by ID:** `GET http://localhost:3000/availabilities/:id`
- **Update Availability:** `PUT http://localhost:3000/availabilities/:id`
- **Delete Availability:** `DELETE http://localhost:3000/availabilities/:id`

#### Barber Service (within Availability Service)

- **Create Barber:** `POST http://localhost:3000/barbers`
- **Get Barbers:** `GET http://localhost:3000/barbers`
- **Get Barber by ID:** `GET http://localhost:3000/barbers/:id`
- **Update Barber:** `PUT http://localhost:3000/barbers/:id`
- **Delete Barber:** `DELETE http://localhost:3000/barbers/:id`

#### Services (within Appointment Service)

- **Create Service:** `POST http://localhost:3000/services`
- **Get Services:** `GET http://localhost:3000/services`
- **Get Service by ID:** `GET http://localhost:3000/services/:id`
- **Update Service:** `PUT http://localhost:3000/services/:id`
- **Delete Service:** `DELETE http://localhost:3000/services/:id`

### Shutting Down

To stop the services, run:

```sh
docker-compose down
```

### Additional Commands

- **Rebuild the images:** `docker-compose build`
- **View logs:** `docker-compose logs -f`

### Environment Variables

The environment variables are defined in the `docker-compose.yml` file. If you need to make changes, edit the `docker-compose.yml` file directly.

This setup ensures that all the services are accessible only through the API Gateway and properly networked within Docker.
