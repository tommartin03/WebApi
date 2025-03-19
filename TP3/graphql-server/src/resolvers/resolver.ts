import { authors, publications } from '../data/data';

const resolvers = {
  Query: {
    authors: () => authors,
    publications: () => publications
  }
};

export default resolvers;