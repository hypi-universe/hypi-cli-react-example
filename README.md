# Getting Started with Hypi cli ReactJS

* [Available commands](#available-commands)
* [Getting started](#getting-started)

## Install hypi cli

```$ npm install -g @hypi/cli```

## Available commands

### `hypi login` 

```hypi login``` 
Login with user name and password
```hypi login -d``` 
Login with organization name space and Authorization token from here https://hypi.app/developer-hub

### `hypi init`

```hypi init```

 Initialize your app and instance or reference an existing domain
.hypi folder will be created with app.yaml, instance.yaml and schema.graphql files

### `hypi sync`

```hypi sync reactjs```

will sync your local schema and get the full schema, then genearte graphql reactjs schema file

## Getting started
1. Inside yoir ReactJs project, run ```hypi login``` 
   Afetr login, user config folder will be placed in `~/.config/hypi/config.json`
2. Run ```hypi init``` to initialize your app or refernece an existing domain
.hypi folder will be created with `app.yaml`, `instance.yaml` and `schema.graphql`
3. Write your schema inside `schema.graphql`
4. Write your queries and mutations inside `/src/graphql` and then run `hypi sync reactjs` to generate the Reactjs schema
   The full generated schema will be inside .hypi folder `/.hypi/generated-schema.graphql`

5. The genearted graphql ReactJs schema will be inside `/src/generated/graphql.ts`
