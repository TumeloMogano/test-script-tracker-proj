export interface TestScript {
    testScriptId?: string;
    process?: string;
    test?: string;
    testScriptDescription?: string;
    dateReviewed?: Date;
    version?: number;
    isDeleted?: boolean;   
    isAssigned?: boolean;
    statusNameDisplayed?: string;
    projectId?: string;
    statusTypeId?: number;
    templateId?: string;
    statusType?: string;
    project?: string;
    template?: string;

}