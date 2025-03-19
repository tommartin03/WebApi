export const authors = [
  {
    firstname: 'Alice',
    lastname: 'Smith',
    orcid: '0000-0001-2345-6789',
    coauthors: ['Bob Johnson', 'Charlie Brown']
  },
  {
    firstname: 'Bob',
    lastname: 'Johnson',
    orcid: '0000-0002-3456-7890',
    coauthors: ['Alice Smith']
  },
  {
    firstname: 'Charlie',
    lastname: 'Brown',
    orcid: '0000-0003-4567-8901',
    coauthors: ['Alice Smith']
  }
];

export const publications = [
  {
    __typename: 'Book',
    authors: ['Alice Smith', 'Bob Johnson'],
    title: 'GraphQL for Beginners',
    publisher: 'Tech Books Publishing',
    publicationDate: '2021-01-01',
    isbn: '978-3-16-148410-0'
  },
  {
    __typename: 'ConferenceProceedings',
    authors: ['Alice Smith', 'Charlie Brown'],
    title: 'Advanced GraphQL Techniques',
    publisher: 'Conference Publishing',
    publicationDate: '2022-05-15',
    isbn: '978-3-16-148411-7',
    conferenceDate: '2022-05-10',
    location: 'New York, USA'
  },
  {
    __typename: 'JournalArticle',
    authors: ['Bob Johnson'],
    title: 'GraphQL in Practice',
    journal: 'Tech Journal',
    volume: '10',
    issue: '2',
    pages: '123-145',
    doi: '10.1234/tj.v10i2.5678'
  },
  {
    __typename: 'ConferenceProceedingsArticle',
    authors: ['Charlie Brown'],
    title: 'GraphQL Performance Optimization',
    proceedings: 'GraphQL Conference 2023',
    pages: '67-89',
    doi: '10.1234/gc2023.6789'
  }
];