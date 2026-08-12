export interface Posts {
  author?: string;
  title: string;
  path: string;
  date: string;
  coverImage: string;
  tags: string[];
  aiGenerated: boolean;
  filepath: string;
}

export interface IGroupByItems {
  name: string;
  counts: number;
}

export interface IGroupByYearMonthItems {
  name: string;
  counts: number;
  months: IGroupByItems[];
}
