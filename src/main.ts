/// <reference types="@workadventure/iframe-api-typings" />

import { bootstrapExtra } from "@workadventure/scripting-api-extra";

console.log('Script started successfully');

let currentPopup: any = undefined;

// Waiting for the API to be ready
WA.onInit().then(() => {
    console.log('Scripting API ready');
    console.log('Player tags: ', WA.player.tags)

    WA.room.area.onEnter('clock').subscribe(() => {
        const today = new Date();
        const time = today.getHours() + ":" + today.getMinutes();
        currentPopup = WA.ui.openPopup("clockPopup", "It's " + time, []);
    })

    WA.room.area.onLeave('clock').subscribe(closePopup)

    WA.room.area.onEnter('ticket1').subscribe(() => {
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

// Add action bar Jiramon
WA.ui.actionBar.addButton({
    id: 'btn-jiramon',
    type: 'action',
    imageSrc: './public/images/twitter.png',
    toolTip: 'Liste des jiramon',
    callback: (event) => {
        console.log('Button clicked', event);
        // When a user clicks on the action bar button 'Register', we remove it.
        WA.ui.actionBar.removeButton('btn-jiramon');
    }
});

//fin bouton de barre d'action
function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export { };
