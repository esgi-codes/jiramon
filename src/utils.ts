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
    let currentIndex = 0; // Ajoutez cette ligne pour suivre l'indice actuel

    const updatePopupContent = () => {
        const issue = jiraIssues[currentIndex];
        WA.player.state.jiraBoardPopup =
        WA.ui.openPopup("jiraPopup", formatIssueString(issue), [
           /* {
                label: 'Close',
                callback: () => WA.player.state.jiraBoardPopup.close()
            },*/
            {
                label: 'Back',
                className: '',
                callback: () => {
                    currentIndex = (currentIndex - 1) % jiraIssues.length; // Incrémente l'indice et boucle si nécessaire
                    WA.player.state.jiraBoardPopup.close(); // Ferme le popup actuel
                    if (currentIndex < 0) {
                        WA.player.state.jiraBoardPopup.close(); // Ferme le popup actuel
                    } // Assure que l'indice reste positif (boucle à la fin de la liste
                    updatePopupContent(); // Met à jour et réouvre le popup avec le nouveau contenu
                    console.log('Back issue: ', issue.key);
                }
            },
            {
                label: 'Next',
                callback: () => {
                    currentIndex = (currentIndex + 1) % jiraIssues.length; // Incrémente l'indice et boucle si nécessaire
                    WA.player.state.jiraBoardPopup.close(); // Ferme le popup actuel
                    updatePopupContent(); // Met à jour et réouvre le popup avec le nouveau contenu
                    console.log('Next issue: ', issue.key);
                }
            },
            {
                label: 'Go to Jira ticket',
                callback: () => {
                    const issue = jiraIssues[currentIndex];
                    const url = `https://jira-mon.atlassian.net/browse/${issue.key}`;
                    WA.nav.openTab(url); // Redirige l'utilisateur vers le ticket Jira
                }
            }

        ]);
    };

    updatePopupContent(); // Appelle cette fonction pour fie ppete le premier popup
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
export function enableTicketDeletion(filled: boolean | undefined): void {
    if (filled) {
        WA.player.state.trashActionMessage = WA.ui.displayActionMessage({
            message: 'This trash can is already full, you cannot delete any more tickets, go to another trash can!',
            callback: () => { },
        });

        setTimeout(() => {
            (WA.player.state.trashActionMessage as ActionMessage).remove();
            WA.player.state.trashActionMessage = undefined;
        }, 5000);

        return;
    }
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
        (WA.player.state.trashActionMessage as ActionMessage).remove();
        WA.player.state.trashActionMessage = undefined;
    }, 5000);
}

/**
 * Disables the ability to delete a ticket from the inventory.
 */
export function disableTicketDeletion(): void {
    WA.player.state.canRemoveTicket = false;
    if (WA.player.state.trashActionMessage !== undefined) {
        (WA.player.state.trashActionMessage as ActionMessage).remove();
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
        (WA.player.state.currentPopup as Popup).close();
        WA.player.state.currentPopup = undefined;
    }
}

/**
 * Determines the rarity of a Jira issue based on its custom field.
 */
export function getIssueRarity(issue: JiraIssue): string {
    return issue.fields.customfield_10060?.value ?? 'common';
}
