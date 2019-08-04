import { MediatorData } from 'ngx-mat-table-mediator';

export interface Person {
  name: string;
  age: number;
}

function randomString(): string {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

export function mockPersonData(pageSize: number = 10): MediatorData<Person> {
  return {
    total: 100,
    data: Array(pageSize)
      .fill(0)
      .map((_, i) => ({
        age: Math.floor(Math.random() * (i + 1) * 10),
        name: randomString()
      }))
  };
}

// GitHub API

export interface GithubApi {
  items: GithubIssue[];
  total_count: number;
}

export interface GithubIssue {
  created_at: string;
  number: string;
  state: string;
  title: string;
}

// https://jsonplaceholder.typicode.com/comments

export interface JsonPlaceholderComment {
  postId: number;
  id: number;
  name: string;
  email: string;
  body: string;
}
