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

/// open a youtube video in a coWebSite when entering the area
WA.room.area.onEnter('youtube').subscribe(async () => {
    //const url = 'https://www.youtube.com/embed/Me8cu5lLN3A?si=JNDHzv3HaUtw-EW0'
    //WA.nav.openTab(url);

    //const coWebsite = await WA.nav.openCoWebSite(url, true, "", 70, 1, true, true);
    //const coWebsiteWorkAdventure = await WA.nav.openCoWebSite('https://workadventu.re/', true, "", 70, 1, true, true);
    //coWebsiteWorkAdventure.close();
    WA.nav.openCoWebSite('https://jira-mon.atlassian.net/jira/software/projects/JI/boards/1?selectedIssue=JI-1', true, "", 70, 1, true, true);
})
///end of youtube

/// open a jira-ticket-2 video in a coWebSite when entering the area
WA.room.area.onEnter('jira-ticket-2').subscribe(async () => {
    //const url = 'https://www.youtube.com/embed/Me8cu5lLN3A?si=JNDHzv3HaUtw-EW0'
    //WA.nav.openTab(url);

    //const coWebsite = await WA.nav.openCoWebSite(url, true, "", 70, 1, true, true);
    //const coWebsiteWorkAdventure = await WA.nav.openCoWebSite('https://workadventu.re/', true, "", 70, 1, true, true);
    //coWebsiteWorkAdventure.close();
    WA.nav.openCoWebSite('https://jira-mon.atlassian.net/jira/software/projects/JI/boards/1?selectedIssue=JI-2', true, "", 70, 1, true, true);
})
///end of jira-ticket-2

/// open a jira-ticket-3 video in a coWebSite when entering the area
WA.room.area.onEnter('jira-ticket-3').subscribe(async () => {
    //const url = 'https://www.youtube.com/embed/Me8cu5lLN3A?si=JNDHzv3HaUtw-EW0'
    //WA.nav.openTab(url);

    //const coWebsite = await WA.nav.openCoWebSite(url, true, "", 70, 1, true, true);
    //const coWebsiteWorkAdventure = await WA.nav.openCoWebSite('https://workadventu.re/', true, "", 70, 1, true, true);
    //coWebsiteWorkAdventure.close();
    WA.nav.openCoWebSite('https://jira-mon.atlassian.net/jira/software/projects/JI/boards/1?selectedIssue=JI-3', true, "", 70, 1, true, true);
})
///end of jira-ticket-3

function closePopup() {
    if (currentPopup !== undefined) {
        currentPopup.close();
        currentPopup = undefined;
    }
}

export { };
