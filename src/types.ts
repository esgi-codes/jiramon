export interface JiraIssue {
    id: string;
    key: string;
    fields: {
        summary: string;
        status: {
            name: string;
        };
        assignee?: {
            accountId: string;
        };
        customfield_10060?: {
            value: string;
        };
    };
}

export interface UserIdMap {
    [key: string]: string;
}
