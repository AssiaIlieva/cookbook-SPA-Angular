export interface Author {
  email: string;
  username: string;
  _id: string;
}

export interface Comment {
  _ownerId: string;
  recipeId: string;
  text: string;
  _createdOn: number;
  _id: string;
  author: Author;
}

export interface NewComment {
  recipeId: string;
  text: string;
  author: Author;
}
