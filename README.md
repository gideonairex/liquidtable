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

### sample data
```
mutation {
  insert_table_meta(objects: {
    meta : {
      make : {
        headerName: "Make", field:"meta", sortable: true, resizable: true
      },
      model : {
        headerName: "Model", field: "model", sortable: true, resizable: true
      },
      ,
      price : {
        headerName: "Price", field: "price", sortable: true, resizable: true
      }
    },
    name : "liquid-table"
  }) {
    returning {
      id
    }
  }
}

```