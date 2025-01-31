export interface AuditLog {
  userId: string;
  userName: string;
  actionId: number;
  actionName: string;
  timeStamp: Date;
  tableName: string;
  primaryKey: string;
  oldValues: string;
  newValues: string;
  affectedColumns: string;
}

