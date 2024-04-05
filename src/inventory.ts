import { unassignIssue } from "./jiraClient";
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
    WA.player.state.inventorySize = (WA.player.state.inventorySize as number) + 1;

    const rarityImageSrc = [
        {
            'name': 'legendary',
            'imageSrc': 'https://lh3.googleusercontent.com/d/1O8Tw3hq1b80jCPA9WMme7GO24Bh83LWk=w1000?authuser=0'
        },
        {
            'name': 'epic',
            'imageSrc': 'https://lh3.googleusercontent.com/d/1Xi8z7MVHulr01WJkq6qUsaTvzkiW8-MJ=w1000?authuser=0'
        },
        {
            'name': 'uncommon',
            'imageSrc': 'https://lh3.googleusercontent.com/d/1lvQ5nEUS_wdb0kwc_g5EJVEdwbF7BQqf=w1000?authuser=0'
        },
        {
            'name': 'common',
            'imageSrc': 'https://lh3.googleusercontent.com/d/1m2ytC5Ie4l_1Kp-Tqu8aIn973j0DzAJX=w1000?authuser=0'
        },
        {
            'name': 'rare',
            'imageSrc': 'https://lh3.googleusercontent.com/d/1DlWcMOwnjg8kK93Lz8iocx_tNU0XY1G5=w1000?authuser=0'
        },
        {
            'name': 'mythic',
            'imageSrc': 'https://lh3.googleusercontent.com/d/1QrGVa0Vr_RLKTFs2g_4RBLe5XA_TKPAP=w1000?authuser=0'
        },
        {
            'name': 'shiny',
            'imageSrc': 'https://lh3.googleusercontent.com/d/1tktcnrdPmHVO48Q70hXXsaQJA-yMb3Nb=w1000?authuser=0'
        }
    ]

    const rarity = rarityImageSrc.find(rarity => rarity.name === issue.fields.customfield_10060?.value.toLowerCase());

    WA.ui.actionBar.addButton({
        id: issue.id,
        toolTip: issue.fields.summary,
        type: 'action',
        imageSrc: rarity?.imageSrc ?? 'https://lh3.googleusercontent.com/d/1m2ytC5Ie4l_1Kp-Tqu8aIn973j0DzAJX=w1000?authuser=0',
        callback: () => {
            if (WA.player.state.canRemoveTicket) {

                removeIssueFromInventory(issue.id);
            } else {
                const issueCoordinates = (WA.player.state.issuesOnTheFloor as Map<string, any>).get(issue.id);
                WA.camera.set(
                    issueCoordinates.x * 32,
                    issueCoordinates.y * 32,
                    64,
                    64,
                    false,
                    true
                );
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
    const thrashSound = WA.sound.loadSound("sounds/trash.mp3");

    // Example call to potentially unassign the issue via API
    if (!(await unassignIssue(issueId, WA.player.state.jiraAccountId as string))) {
        return;
    }
    thrashSound.play({});
    WA.ui.actionBar.removeButton(issueId);
    WA.player.state.inventorySize = Math.max(0, (WA.player.state.inventorySize as number) - 1);
}

/**
 * Enforces inventory limits and applies consequences if exceeded.
 */
function enforceInventoryLimits(): void {
    if ((WA.player.state.inventorySize as number) >= MAX_INVENTORY_SIZE) {
        WA.controls.disablePlayerControls();
        const message = `You have too many tickets. You cannot move for a few seconds... Use this time to address them! (Press space to open Jira) ${WA.player.name}`;
        const triggerMessage = WA.ui.displayActionMessage({
            message,
            callback: () => {
                WA.nav.openTab(JIRA_ASSIGNEE_URL + WA.player.state.jiraAccountId);
            }
        });

        setTimeout(() => {
            triggerMessage.remove();
            WA.controls.restorePlayerControls();
        }, MAX_INVENTORY_MOVE_DELAY);
    }
}

export { initInventory, enforceInventoryLimits, addToInventory };
