import { addToInventory } from "./inventory";
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

            (WA.player.state.issuesOnTheFloor as Map<string, any>).set(issue.id, { x: randomX, y: randomY });
            WA.player.state.ticketsCount = (WA.player.state.ticketsCount as number) + 1;

            const ticketsCount = WA.player.state.loadVariable("ticketsCount");
            const ticketRarity = getIssueRarity(issue);
            const ticketTile = `${ticketRarity}Issue`;
            WA.room.setTiles([
                {
                    x: randomX,
                    y: randomY,
                    tile: ticketTile,
                    layer: "above/above2"
                }
            ])
            WA.room.area.create({
                height: 32,
                width: 32,
                x: randomX * 32,
                y: randomY * 32,
                name: "issue_" + ticketsCount,
            })
            WA.room.area.onEnter('issue_' + ticketsCount).subscribe(() => {
                WA.ui.actionBar.addButton({
                    id: 'assign_issue_' + ticketsCount,
                    label: `Assign ${issue.key} to me`,
                    toolTip: issue.fields.summary,
                    callback: () => {
                        addToInventory(issue);
                        WA.room.setTiles([
                            {
                                x: randomX,
                                y: randomY,
                                tile: 'empty',
                                layer: "above/above2"
                            }
                        ])
                        assignIssue(issue.key, WA.player.state.jiraAccountId as string);
                    },
                });

                WA.ui.actionBar.addButton({
                    id: 'locate_issue_' + ticketsCount,
                    label: `Locate ${issue.key}`,
                    toolTip: issue.fields.summary,
                    callback: () => {
                        const issueCoordinates = (WA.player.state.issuesOnTheFloor as Map<string, any>).get(issue.id);
                        WA.camera.set(
                            issueCoordinates.x * 32,
                            issueCoordinates.y * 32,
                            64,
                            64,
                            false,
                            true
                        );
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
            WA.room.area.onLeave('issue_' + ticketsCount).subscribe(() => {
                WA.ui.actionBar.removeButton('assign_issue_' + ticketsCount);
                WA.ui.actionBar.removeButton('locate_issue_' + ticketsCount);
                closePopup()
            })
        })
}

export { spawnIssues };