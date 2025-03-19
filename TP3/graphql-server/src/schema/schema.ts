import { GraphQLObjectType, GraphQLSchema, GraphQLString, GraphQLList, GraphQLNonNull, GraphQLUnionType } from 'graphql';
import { authors, publications } from '../data/data';
import resolvers from '../resolvers/resolver';

// Define the Author type
const AuthorType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Author',
    fields: () => ({
        firstname: { type: GraphQLString },
        lastname: { type: GraphQLString },
        orcid: { type: GraphQLString },
        coauthors: { type: new GraphQLList(GraphQLString) }
    })
});

// Define the Book type
const BookType: GraphQLObjectType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        authors: { type: new GraphQLList(AuthorType) },
        title: { type: GraphQLString },
        publisher: { type: GraphQLString },
        publicationDate: { type: GraphQLString },
        isbn: { type: GraphQLString }
    })
});

// Define the ConferenceProceedings type
const ConferenceProceedingsType: GraphQLObjectType = new GraphQLObjectType({
    name: 'ConferenceProceedings',
    fields: () => ({
        authors: { type: new GraphQLList(AuthorType) },
        title: { type: GraphQLString },
        publisher: { type: GraphQLString },
        publicationDate: { type: GraphQLString },
        isbn: { type: GraphQLString },
        conferenceDate: { type: GraphQLString },
        location: { type: GraphQLString }
    })
});

// Define the JournalArticle type
const JournalArticleType: GraphQLObjectType = new GraphQLObjectType({
    name: 'JournalArticle',
    fields: () => ({
        authors: { type: new GraphQLList(AuthorType) },
        title: { type: GraphQLString },
        journal: { type: GraphQLString },
        volume: { type: GraphQLString },
        issue: { type: GraphQLString },
        pages: { type: GraphQLString },
        doi: { type: GraphQLString }
    })
});

// Define the ConferenceProceedingsArticle type
const ConferenceProceedingsArticleType: GraphQLObjectType = new GraphQLObjectType({
    name: 'ConferenceProceedingsArticle',
    fields: () => ({
        authors: { type: new GraphQLList(AuthorType) },
        title: { type: GraphQLString },
        proceedings: { type: GraphQLString },
        pages: { type: GraphQLString },
        doi: { type: GraphQLString }
    })
});

// Define the Publication union type
const PublicationType = new GraphQLUnionType({
    name: 'Publication',
    types: [BookType, ConferenceProceedingsType, JournalArticleType, ConferenceProceedingsArticleType],
    resolveType(value) {
        if (value.isbn) {
            return BookType;
        }
        if (value.conferenceDate) {
            return ConferenceProceedingsType;
        }
        if (value.journal) {
            return JournalArticleType;
        }
        if (value.proceedings) {
            return ConferenceProceedingsArticleType;
        }
        return null;
    }
});

// Define the RootQuery
const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: {
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: resolvers.Query.authors
        },
        publications: {
            type: new GraphQLList(PublicationType),
            resolve: resolvers.Query.publications
        }
    }
});

// Define the Mutation
const Mutation = new GraphQLObjectType({
    name: 'Mutation',
    fields: {
        addAuthor: {
            type: AuthorType,
            args: {
                firstname: { type: new GraphQLNonNull(GraphQLString) },
                lastname: { type: new GraphQLNonNull(GraphQLString) },
                orcid: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve(parent, args) {
                const newAuthor = { firstname: args.firstname, lastname: args.lastname, orcid: args.orcid, coauthors: [] };
                authors.push(newAuthor);
                return newAuthor;
            }
        },
        addPublication: {
            type: PublicationType,
            args: {
                type: { type: new GraphQLNonNull(GraphQLString) },
                authors: { type: new GraphQLNonNull(new GraphQLList(GraphQLString)) },
                title: { type: new GraphQLNonNull(GraphQLString) },
                publisher: { type: GraphQLString },
                publicationDate: { type: GraphQLString },
                isbn: { type: GraphQLString },
                conferenceDate: { type: GraphQLString },
                location: { type: GraphQLString },
                journal: { type: GraphQLString },
                volume: { type: GraphQLString },
                issue: { type: GraphQLString },
                pages: { type: GraphQLString },
                doi: { type: GraphQLString },
                proceedings: { type: GraphQLString }
            },
            resolve(parent, args) {
                const authorObjects = args.authors.map((name: string) => {
                    const [firstname, lastname] = name.split(' ');
                    return authors.find(author => author.firstname === firstname && author.lastname === lastname);
                });

                let newPublication;
                switch (args.type) {
                    case 'Book':
                        newPublication = {
                            __typename: 'Book',
                            authors: authorObjects,
                            title: args.title,
                            publisher: args.publisher,
                            publicationDate: args.publicationDate,
                            isbn: args.isbn
                        };
                        break;
                    case 'ConferenceProceedings':
                        newPublication = {
                            __typename: 'ConferenceProceedings',
                            authors: authorObjects,
                            title: args.title,
                            publisher: args.publisher,
                            publicationDate: args.publicationDate,
                            isbn: args.isbn,
                            conferenceDate: args.conferenceDate,
                            location: args.location
                        };
                        break;
                    case 'JournalArticle':
                        newPublication = {
                            __typename: 'JournalArticle',
                            authors: authorObjects,
                            title: args.title,
                            journal: args.journal,
                            volume: args.volume,
                            issue: args.issue,
                            pages: args.pages,
                            doi: args.doi
                        };
                        break;
                    case 'ConferenceProceedingsArticle':
                        newPublication = {
                            __typename: 'ConferenceProceedingsArticle',
                            authors: authorObjects,
                            title: args.title,
                            proceedings: args.proceedings,
                            pages: args.pages,
                            doi: args.doi
                        };
                        break;
                    default:
                        throw new Error('Invalid publication type');
                }
                publications.push(newPublication);
                return newPublication;
            }
        }
    }
});

// Create the schema
export const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});