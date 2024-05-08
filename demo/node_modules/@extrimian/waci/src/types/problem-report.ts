


export interface ProblemReportBody {
    code: string;
    comment?: string;
    args?: string[];
    escalate_to?: string;
  }

export class ProblemReportMessage{
    code: string;
    comment?: string;
    args?: string[];
    escalate_to?: string;

   

    presentProofMessage(code: string, comment?:string, args?: string[], escalate_to?: string): ProblemReportBody{
        return {
            code: code,
            comment: comment,
            args: args,
            escalate_to: escalate_to
        }
    }

   
}