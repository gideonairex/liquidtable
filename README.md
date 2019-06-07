### Requisites
1. node.js
2. docker
3. docker-compose
4. hasura

### Development
1. `cp .env.sample .env`
2. `docker-compose up -d`

### Hasura console
1. Update `hasura-console/config.yml` point `endpoint` to `hasura` engine.
2. `cd hasura-console && hasura console --access-key=<admin-secret>`

### Hasura migrations
1. `cd hasura-console && hasura migrate apply --access-key=<admin-secret>`