export interface IPostData {
  postUID: string;
  authorID: string;
  authorEmail: string;
  title: string;
  description: string;
  date: string;
  photoURL: string;
  mainText: string;
  countOfLikes: string[];
  countOfDislikes: string[];
  favorites: string[];
}

export interface IPost {
  [key: string]: IPostData;
}

export interface ICommentsData {
  commentsUID: string;
  mainText: string;
  countOfLikes: string[];
  countOfDislikes: string[];
  date: string;
  authorUID: string;
  postUID: string;
  userPhoto: string;
  userName: string;
}

export interface IComments {
  [key: string]: ICommentsData;
}

export type Reaction = 'like' | 'dislike' | 'none';
