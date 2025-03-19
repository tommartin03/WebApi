import express from 'express';
import { graphqlHTTP } from 'express-graphql';
import { schema } from './schema/schema';
import { createServer } from 'http';

const app = express();
const PORT = process.env.PORT || 4000;

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true,
}));

const server = createServer(app);

server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}/graphql`);
});