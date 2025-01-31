export interface TestStep {
    testStepId?: string;
    testStepDescription?: string;
    testStepRole?: string;
    testStepName?: string;
    testData?: string;
    additionalInfo?: string;
    expectedOutcome?: string;
    feedback?: string;
    isDeleted?: boolean;
    result?: string;
    stepResultId?: number;
    testScriptId?: string;
    stepResult?: string;
    testScriptName?: string;
}