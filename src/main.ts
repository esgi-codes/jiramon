/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import axiosInstance from "./axiosInstance";

console.log('Script started successfully');

const jiraBrowseUrl = 'https://jira-mon.atlassian.net/browse/';
const jiraAssigneeUrl = 'https://jira-mon.atlassian.net/jira/software/projects/JI/boards/1?assignee=';
const maxInventorySize = 3;
const maxInventoryMoveDelay = 5000;
let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)

    const userIdMap: { [key: string]: string } = {
        'WOKA_NAME': 'JIRA_ACCOUNT_ID'
    };


    const jiraIssues = (await axiosInstance.get('jira/issues')).data;
    const size = initInventory(userIdMap[WA.player.name], jiraIssues);
    spawnIssues(jiraIssues);

    if (size >= maxInventorySize) {
        WA.controls.disablePlayerControls();

        const triggerMessage = WA.ui.displayActionMessage({
            message: "Vous avez trop de tickets, vous ne pouvez plus vous déplacer pendant quelques secondes... Profitez-en pour les traiter !(Appuyer espace pour ouvrir Jira)" + WA.player.name,
            callback: () => {
                WA.nav.goToPage(jiraAssigneeUrl + userIdMap[WA.player.name]);
            }
        });

        setTimeout(() => {
            triggerMessage.remove();
            WA.controls.restorePlayerControls();
        }, maxInventoryMoveDelay)
    }


    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)



    // The line below bootstraps the Scripting API Extra library that adds a number of advanced properties/features to WorkAdventure
    bootstrapExtra().then(() => {
        console.log('Scripting API Extra ready');
    }).catch(e => console.error(e));

}).catch(e => console.error(e));

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

function initInventory(userId: string, jiraIssues: any): number {
    let inventorySize = 0;

    jiraIssues
        .filter(issue => issue.fields.assignee?.accountId === userId && issue.fields.status.name !== 'DONE' && issue.fields.status.name !== 'BACKLOG')
        .forEach((issue, index) => {
            inventorySize++;
            WA.ui.actionBar.addButton({
                id: issue.id,
                toolTip: issue.fields.summary,
                type: 'action',
                imageSrc: 'https://pics.clipartpng.com/midle/Red_Dice_PNG_Clip_Art-2654.png',
                callback: (event) => {
                    console.log('Inventory item clicked', event);
                    // When a user clicks on the action bar button 'Register', we remove it.
                    WA.ui.actionBar.removeButton(issue.id);
                }
            });
        })

    return inventorySize;
}

function spawnIssues(jiraIssues: any[]) {
    jiraIssues.forEach((ticket, index) => {
        const randomX = Math.floor(Math.random() * 20);
        const randomY = Math.floor(Math.random() * 20);
        WA.room.setTiles([
            {
                x: randomX,
                y: randomY,
                tile: "greenTicket",
                layer: "furniture/furniture3"
            }
        ])
        WA.room.area.create({
            height: 32,
            width: 32,
            x: randomX * 32,
            y: randomY * 32,
            name: "ticket" + index,
        })

        WA.room.area.onEnter('ticket' + index).subscribe(() => {
            const triggerMessage = WA.ui.displayActionMessage({
                message: "Appuyer espace pour s'attribuer le ticket",
                callback: () => {
                    WA.nav.goToPage(jiraBrowseUrl + ticket.key);
                }
            });
            setTimeout(() => {
                triggerMessage.remove();
            }, 3000)
            currentPopup = WA.ui.openPopup("ticket-popup", ticket.fields.description, []);
        })

        WA.room.area.onLeave('ticket' + index).subscribe(closePopup)
    })

}

export { };
