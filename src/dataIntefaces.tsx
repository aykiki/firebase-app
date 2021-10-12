export interface IPost {
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

export interface newPostData {
  [key: string]: IPost;
}

export type Reaction = 'like' | 'dislike' | 'none';
