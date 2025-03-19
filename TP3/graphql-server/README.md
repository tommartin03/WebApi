# GraphQL Server with In-Memory Data

This project implements a GraphQL server that allows users to query information about users and their friends using in-memory data structures.

## Project Structure

```
graphql-server
├── src
│   ├── index.ts          # Entry point of the application
│   ├── schema
│   │   └── index.ts      # GraphQL schema definitions
│   ├── resolvers
│   │   └── index.ts      # Resolver functions for GraphQL queries
│   └── data
│       └── users.ts      # In-memory user data
├── package.json           # NPM dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation
```

## Setup Instructions

1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd graphql-server
   ```

2. **Install dependencies:**
   ```
   npm install
   ```

3. **Run the server:**
   ```
   npm start
   ```

   The server will start and listen for requests on `http://localhost:4000/graphql`.

## Usage

Once the server is running, you can use a GraphQL client or tools like Postman or GraphiQL to interact with the API.

### Example Queries

- **Fetch all users:**
  ```graphql
  query {
    users {
      id
      name
      friends {
        id
        name
      }
    }
  }
  ```

- **Fetch a specific user by ID:**
  ```graphql
  query {
    user(id: "1") {
      id
      name
      friends {
        id
        name
      }
    }
  }
  ```

## License

This project is licensed under the MIT License.