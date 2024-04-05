import { assignIssue } from "./jiraClient";
import { closePopup, getIssueRarity } from "./utils";

const JIRA_BROWSE_URL = 'https://jira-mon.atlassian.net/browse/';

function getRandomCoordinate(arr: number[], width: number, height: number): [number, number] | null {
    const zeroCoordinates: [number, number][] = [];
    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            if (arr[y * width + x] === 0) {
                zeroCoordinates.push([x, y]);
            }
        }
    }

    if (zeroCoordinates.length === 0) {
        return null;
    }

    const randomIndex = Math.floor(Math.random() * zeroCoordinates.length);
    return zeroCoordinates[randomIndex];
}

async function spawnIssues(jiraIssues: any[]) {
    const collisionsLayer = (await (WA.room.getTiledMap())).layers[1];



    jiraIssues
        .filter(issue => !["DONE"].includes(issue.fields.status.name))
        .forEach((issue, index) => {
            const coordinates = getRandomCoordinate(collisionsLayer.data, collisionsLayer.width, collisionsLayer.height);
            const [randomX, randomY] = coordinates as [number, number];
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
                        assignIssue(issue.key, WA.player.state.jiraAccountId as string);
                    },
                });


                const triggerMessage = WA.ui.displayActionMessage({
                    message: `[${ticketRarity.toLocaleUpperCase()}]Ticket ${issue.key} : ${issue.fields.summary} (${issue.fields.status.name})`,
                    callback: () => {
                        WA.nav.openTab(JIRA_BROWSE_URL + issue.key);
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