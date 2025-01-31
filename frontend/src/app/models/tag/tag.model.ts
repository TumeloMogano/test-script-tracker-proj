export interface Tag {
  tagId: string;
  tagName: string;
  tagDescription: string;
  isDeleted: boolean;
  tagTypeId: number;
}

export interface TagViewModel {
  tagName: string;
  tagDescription: string;
  tagTypeId: number;
}

export interface ApplyTagReq {
  testscriptId: string;
  tagId: string;
}
