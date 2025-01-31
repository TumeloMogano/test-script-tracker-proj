export interface Comment {
  commentId: string;
  commentTitle: string;
  commentLine: string;
  commentDate: Date;
  isDeleted: boolean;
  isModified: boolean;
  dateModified: Date;
  testScriptId: string;
  userEmail: string;
}


// export interface CommentViewModel {
//   commentTitle: string;
//   commentLine: string;
//   testScriptId: string;
//   userEmail: string;
//   mentions: CommentMentionVM[];  
// }
export interface CommentViewModel {
  commentTitle: string;
  commentLine: string;
  testScriptId: string; // Ensure this is a string or Guid in C#
  userEmail: string;
  mentions?: CommentMentionVM[];
  notificationTitle?: string;
  message?: string;
  notificationTypeID: number;
  projectID?: string; // Ensure this is a string or Guid in C#
}

export interface CommentMentionVM {
  userEmail: string;
  commentId: string;
  userId: string;
  comment: string;
}

