// src/main.ts

/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import axiosInstance from "./axiosInstance";
import { JiraIssue, UserIdMap } from "./types";
import { enforceInventoryLimits, initInventory } from "./inventory";
import { closePopup, disableTicketDeletion, displayCurrentTime, displayJiraBoard, enableTicketDeletion } from "./utils";
import { spawnIssues } from "./map";
import { initPlayerStates } from "./player";

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

        initPlayerStates();

        const jiraIssues: JiraIssue[] = (await axiosInstance.get<JiraIssue[]>('jira/issues')).data;
        spawnIssues(jiraIssues);
        handleInventory(jiraIssues);
        handleAreas(jiraIssues);

        await bootstrapExtra();
        console.log('Scripting API Extra ready');
    } catch (error) {
        console.error('Error initializing script', error);
    }
}

function handleInventory(jiraIssues: JiraIssue[]): void {
    initInventory(userIdMap[WA.player.name], jiraIssues);
    enforceInventoryLimits();
}

function handleAreas(jiraIssues: JiraIssue[]): void {
    WA.room.area.onEnter('clock').subscribe(displayCurrentTime);
    WA.room.area.onLeave('clock').subscribe(() => closePopup(WA.player.state.currentTimePopup));
    WA.room.area.onEnter('jiraBoard').subscribe(() => displayJiraBoard(jiraIssues));
    WA.room.area.onLeave('jiraBoard').subscribe(() => closePopup(WA.player.state.jiraBoardPopup));
    WA.room.area.onEnter('trash').subscribe(enableTicketDeletion);
    WA.room.area.onLeave('trash').subscribe(disableTicketDeletion);
}

WA.onInit().then(initScript).catch(e => console.error('Error during WA.onInit', e));

export { };