/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(async () => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)

    const tickets = []

    tickets.forEach((ticket,index)=>{
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
        WA.room.setTiles([
            {
                x: 8,
                y: 13,
                tile: "greenTicket",
                layer:"furniture/furniture3"
            }]
        )
    })

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    WA.room.area.onEnter('ticket1').subscribe(() => {
        const triggerMessage = WA.ui.displayActionMessage({
            message: "Appuyer espace pour s'attribuer le ticket",
            callback: () => {
                WA.nav.goToPage('https://jira-mon.atlassian.net/browse/JI-1');
            }
        });
        setTimeout(() => {
            // later
            triggerMessage.remove();
        }, 3000)
        currentPopup = WA.ui.openPopup("ticket-popup", "Loading...", []);

        fetch("http://localhost:3000/jira", {
            method: "GET"
        })
            .then((response) => {
                return response.text();
            })
            .then((text) => {
                const jiraTicket = JSON.parse(text);
                closePopup();
                currentPopup = WA.ui.openPopup("ticket-popup", jiraTicket.issueTypes[0].description, []);
            })
            .catch((err) => console.error(err));

    })
    WA.room.area.onLeave('ticket1').subscribe(closePopup)

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

export { };
