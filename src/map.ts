import { closePopup, getIssueRarity } from "./utils";

const JIRA_BROWSE_URL = 'https://jira-mon.atlassian.net/browse/';

function spawnIssues(jiraIssues: any[]) {
    jiraIssues
        .filter(issue => !["DONE"].includes(issue.fields.status.name))
        .forEach((issue, index) => {
            const randomX = Math.floor(Math.random() * 20);
            const randomY = Math.floor(Math.random() * 20);
            const ticketRarity = getIssueRarity(issue);
            const ticketTile = `${ticketRarity}Issue`;
            WA.room.setTiles([
                {
                    x: randomX,
                    y: randomY,
                    tile: ticketTile,
                    layer: "furniture/furniture3"
                }
            ])
            WA.room.area.create({
                height: 32,
                width: 32,
                x: randomX * 32,
                y: randomY * 32,
                name: "issue_" + index,
            })
            WA.room.area.onEnter('issue_' + index).subscribe(() => {
                WA.ui.actionBar.addButton({
                    id: 'assign_issue_' + index,
                    label: `Assign ${issue.key} to me`,
                    toolTip: issue.fields.summary,
                    callback: () => {
                        console.log('Assigning issue', issue.key);
                    },
                });


                const triggerMessage = WA.ui.displayActionMessage({
                    message: `[${ticketRarity.toLocaleUpperCase()}]Ticket ${issue.key} : ${issue.fields.summary} (${issue.fields.status.name})`,
                    callback: () => {
                        WA.nav.goToPage(JIRA_BROWSE_URL + issue.key);
                    }
                });
                setTimeout(() => {
                    triggerMessage.remove();
                }, 3000)
                WA.player.state.currentPopup = WA.ui.openPopup("issue-popup", issue.fields.description, []);
            })
            WA.room.area.onLeave('issue_' + index).subscribe(() => {
                WA.ui.actionBar.removeButton('assign_issue_' + index);
                closePopup()
            })
        })
}

export { spawnIssues };