export interface Status {
  statusId: string;
  statusName: string;
  statusDescription: string;
  isDeleted: boolean;
  projectId: string;
  statusTypeId: number;
}

export interface StatusViewModel {
  statusName: string;
  statusDescription: string;
  projectId: string;
  statusTypeId: number;
}
