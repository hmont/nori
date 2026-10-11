# backend

This folder contains the backend implementation for Nori.

## Prerequisites

Java 25, Maven, and a PostgreSQL database initialized.

## Building

```sh
mvn clean install
```

## Setup

Nori requires certain environment variables to be set in order to connect to the PostgreSQL database. If these are unset, Nori will use its configured default values.

- `DB_HOST` (default: `localhost`)
- `DB_PORT` (default: `5432`)
- `DB_NAME` (default: `nori`)
- `DB_USER` (default: `nori`)
- `DB_PASSWORD` (default: an empty string)

## Running the backend

```sh
java -jar target/nori-*.jar
```