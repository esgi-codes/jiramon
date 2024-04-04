import { JiraIssue } from "./types";


/**
 * Opens a popup displaying the current time.
 */
export function displayCurrentTime(): void {
    const now = new Date();
    const timeStr = `${now.getHours()}:${now.getMinutes().toString().padStart(2, '0')}`;
    WA.player.state.currentTimePopup = WA.ui.openPopup("clockPopup", `It's ${timeStr}`, []);
}

/**
 * Displays Jira issues on the board area.
 */
export function displayJiraBoard(jiraIssues: JiraIssue[]): void {
    const issuesString = jiraIssues.map(issue => formatIssueString(issue)).join('\n');
    WA.player.state.jiraBoardPopup = WA.ui.openPopup("jiraPopup", issuesString, []);
}

/**
 * Formats a single Jira issue into a readable string.
 */
export function formatIssueString(issue: JiraIssue): string {
    return `[${getIssueRarity(issue).toUpperCase()}] Ticket ${issue.key}: ${issue.fields.summary} (${issue.fields.status.name})`;
}

/**
 * Enables the ability to delete a ticket from the inventory.
 */
export function enableTicketDeletion(): void {
    WA.player.state.canRemoveTicket = true;
    if (WA.player.state.inventorySize === 0) {
        WA.player.state.trashActionMessage = WA.ui.displayActionMessage({
            message: 'You have no tickets to delete, feel free to pick some up!',
            callback: () => { },
        });
    } else {
        WA.player.state.trashActionMessage = WA.ui.displayActionMessage({
            message: 'Click on a ticket in your inventory to delete it',
            callback: () => { },
        });
    }

    setTimeout(() => {
        WA.player.state.trashActionMessage.remove();
        WA.player.state.trashActionMessage = undefined;
    }, 5000);
}

/**
 * Disables the ability to delete a ticket from the inventory.
 */
export function disableTicketDeletion(): void {
    WA.player.state.canRemoveTicket = false;
    if (WA.player.state.trashActionMessage !== undefined) {
        WA.player.state.trashActionMessage.remove();
        WA.player.state.trashActionMessage = undefined;
    }
}

/**
 * Closes the currently open popup, if any.
 */
export function closePopup(popup: any = undefined): void {
    if (popup !== undefined) {
        popup.close();
        popup = undefined;
    } else if (WA.player.state.currentPopup !== undefined) {
        WA.player.state.currentPopup.close();
        WA.player.state.currentPopup = undefined;
    }
}

/**
 * Determines the rarity of a Jira issue based on its custom field.
 */
export function getIssueRarity(issue: JiraIssue): string {
    return issue.fields.customfield_10060?.value ?? 'common';
}
