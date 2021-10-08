export interface IPost {
  authorID: string;
  authorEmail: string,
  title: string;
  description: string;
  date: string;
  photoURL: string;
  mainText: string;
  countOfLikes: string[];
  countOfDislikes: string[];
}





export type Reaction = 'like' | 'dislike' | 'none';

