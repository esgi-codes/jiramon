import axiosInstance from "./axiosInstance";
import { JiraIssue } from "./types";


async function getAllIssues(): Promise<JiraIssue[]> {
    return (await axiosInstance.get<JiraIssue[]>('jira/issues')).data;
}

async function unassignIssue(issueId: string, assignee: string): Promise<boolean> {
    const response = await axiosInstance.post('jira/issues/unassign', { issueId: issueId });
    if (response.status !== 204) {
        console.error('Failed to unassign issue', issueId);
        return false;
    }

    console.log(`Successfully unassigned issue ${issueId} from ${assignee}`);
    return true;
}

export { getAllIssues, unassignIssue };