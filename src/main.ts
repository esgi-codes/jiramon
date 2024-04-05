// src/main.ts

/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { JiraIssue, UserIdMap } from "./types";
import { addToInventory, enforceInventoryLimits, initInventory } from "./inventory";
import { closePopup, disableTicketDeletion, displayCurrentTime, displayJiraBoard, enableTicketDeletion } from "./utils";
import { spawnIssues } from "./map";
import { initPlayerStates } from "./player";
import { getAllIssues as getAllJiraIssues } from "./jiraClient";

console.log('Script started successfully');

const userIdMap: UserIdMap = {
    'adia-dev': '5f9f40bec2e5390077a882f5',
    'vithushan': '712020:0854f1d3-6e21-4be9-ac7a-b18393a8683c',
    'pascal': '622a323259c0740069dc3850',
};


async function initScript(): Promise<void> {
    try {
        console.log('Scripting API ready');
        console.log(`Player tags: ${WA.player.tags.join(', ')}`);

        initPlayerStates(userIdMap[WA.player.name]);
        WA.player.state.saveVariable("ticketsCount", 0);

        WA.player.state.saveVariable("jiraIssues", await getAllJiraIssues());
        spawnIssues(WA.player.state.jiraIssues as JiraIssue[]);
        handleInventory(WA.player.state.jiraIssues as JiraIssue[]);
        handleAreas(WA.player.state.jiraIssues as JiraIssue[]);
        setIntervalEnforceInventoryLimits();
        setIntervalSpawnNewTickets();

        await bootstrapExtra();
        console.log('Scripting API Extra ready');
    } catch (error) {
        console.error('Error initializing script', error);
    }
}

function setIntervalEnforceInventoryLimits(): void {
    setInterval(() => enforceInventoryLimits(), 20 * 1000);
}

function setIntervalSpawnNewTickets(): void {
    setInterval(() => checkNewTickets(), 10 * 1000)
}

async function checkNewTickets(): Promise<void> {
    // Get all Jira issues
    const allJiraIssues: JiraIssue[] = await getAllJiraIssues();

    // Filter out new tickets
    const newTickets: JiraIssue[] = allJiraIssues.filter(issue => {
        // Check if the issue is not present in the jiraIssues array
        const isNew = !(WA.player.state.jiraIssues as JiraIssue[]).some(existingIssue => existingIssue.id === issue.id);
        if (isNew) {
            console.log(`New ticket found: ${issue.id}`);
            if (issue.fields.assignee?.accountId == WA.player.state.jiraAccountId) {
                addToInventory(issue);
            }
        } else {
            console.log(`Ticket ${issue.id} is already in the list.`);
        }
        return isNew;
    });
    spawnIssues(newTickets);

    WA.player.state.jiraIssues = (WA.player.state.jiraIssues as JiraIssue[]).concat(newTickets);
}


function handleInventory(jiraIssues: JiraIssue[]): void {
    initInventory(userIdMap[WA.player.name], jiraIssues);
}

function handleAreas(jiraIssues: JiraIssue[]): void {
    WA.room.area.onEnter('clock').subscribe(displayCurrentTime);
    WA.room.area.onLeave('clock').subscribe(() => closePopup(WA.player.state.currentTimePopup));
    WA.room.area.onEnter('jiraBoard').subscribe(() => displayJiraBoard(jiraIssues));
    WA.room.area.onLeave('jiraBoard').subscribe(() => closePopup(WA.player.state.jiraBoardPopup));
    WA.room.area.onEnter('trash').subscribe(() => enableTicketDeletion(false));
    WA.room.area.onLeave('trash').subscribe(disableTicketDeletion);
    WA.room.area.onEnter('filledTrash').subscribe(() => enableTicketDeletion(true));
}

WA.onInit().then(initScript).catch(e => console.error('Error during WA.onInit', e));

export { };