// src/inventory.ts

import axiosInstance from "./axiosInstance";
import { JiraIssue } from "./types";

const MAX_INVENTORY_SIZE = 2;
const MAX_INVENTORY_MOVE_DELAY = 5000;
const JIRA_ASSIGNEE_URL = 'https://jira-mon.atlassian.net/jira/software/projects/JI/boards/1?assignee=';

/**
 * Initializes the player's inventory with Jira issues.
 */
function initInventory(userId: string, jiraIssues: JiraIssue[]) {
    WA.player.state.saveVariable('inventorySize', 0);
    console.log('Initializing inventory for user', userId);
    jiraIssues
        .filter(issue => issue.fields.assignee?.accountId === userId && !["DONE", "BACKLOG"].includes(issue.fields.status.name))
        .forEach(issue => addToInventory(issue));

}

/**
 * Adds a Jira issue to the inventory and sets up an action button for it.
*/
function addToInventory(issue: JiraIssue): void {
    WA.player.state.inventorySize += 1;

    WA.ui.actionBar.addButton({
        id: issue.id,
        toolTip: issue.fields.summary,
        type: 'action',
        imageSrc: 'https://pics.clipartpng.com/midle/Red_Dice_PNG_Clip_Art-2654.png',
        callback: () => {
            if (WA.player.state.canRemoveTicket) {
                removeIssueFromInventory(issue.id);
            } else {
                const goToNearestTrashActionMessage = WA.ui.displayActionMessage({
                    message: `Go to the nearest trash to delete ticket ${issue.key}`,
                    callback: () => { },
                });

                setTimeout(() => {
                    goToNearestTrashActionMessage.remove();
                }, 5000);
            }
        },
    });
}

/**
 * Removes a Jira issue from the inventory.
 */
async function removeIssueFromInventory(issueId: string): Promise<void> {
    // Example call to potentially unassign the issue via API
    const response = await axiosInstance.post('jira/unassign', { issueId: issueId });
    WA.ui.actionBar.removeButton(issueId);
    WA.player.state.inventorySize -= 1;
}

/**
 * Enforces inventory limits and applies consequences if exceeded.
 */
function enforceInventoryLimits(): void {
    if (WA.player.state.inventorySize >= MAX_INVENTORY_SIZE) {
        WA.controls.disablePlayerControls();
        const message = `You have too many tickets. You cannot move for a few seconds... Use this time to address them! (Press space to open Jira) ${WA.player.name}`;
        const triggerMessage = WA.ui.displayActionMessage({
            message,
            callback: () => {
                WA.nav.goToPage(JIRA_ASSIGNEE_URL + WA.player.state.jiraAccountId);
            }
        });

        setTimeout(() => {
            triggerMessage.remove();
            WA.controls.restorePlayerControls();
        }, MAX_INVENTORY_MOVE_DELAY);
    }
}

export { initInventory, enforceInventoryLimits };
