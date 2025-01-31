export interface Defect {
    defectId?: string;
    defectDescription?: string;
    dateLogged?: string;
    isDeleted?: boolean;
    defectStatusId?: number;
    testScriptId?: string;
    defectStatus?: string;
    testScriptName?: string;
    userEmailAddress?: string;
    defectImage?: string;

    imageTrue?: boolean;
    //status change
    isUnclosed?: boolean;
    inProgress?: boolean;
}