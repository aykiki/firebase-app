export interface IPostInfo {
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
  favorites: string[],
}

export interface IPost {
  [key: string]: IPostInfo;
}

export type Reaction = 'like' | 'dislike' | 'none';