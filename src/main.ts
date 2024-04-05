// src/main.ts

/// <reference types="@workadventure/iframe-api-typings" />
import { bootstrapExtra } from "@workadventure/scripting-api-extra";
import { JiraIssue, UserIdMap } from "./types";
import { enforceInventoryLimits, initInventory } from "./inventory";
import { closePopup, disableTicketDeletion, displayCurrentTime, displayJiraBoard, enableTicketDeletion, displayJiraAssignmentMessage } from "./utils";
import { spawnIssues } from "./map";
import { initPlayerStates } from "./player";
import { getAllIssues as getAllJiraIssues, IssueCategory } from "./jiraClient";

console.log('Script started successfully');

const userIdMap: UserIdMap = {
    'adia-dev': '5f9f40bec2e5390077a882f5',
    'vithushan': '712020:0854f1d3-6e21-4be9-ac7a-b18393a8683c',
    'pascal': '622a323259c0740069dc3850',
    'malha': '712020:730bfd03-913f-4ae5-b823-170c6c47b515',
};

async function initScript(): Promise<void> {
    try {
        console.log('Scripting API ready');
        console.log(`Player tags: ${WA.player.tags.join(', ')}`);

        initPlayerStates();

        const jiraIssues: JiraIssue[] = await getAllJiraIssues();
        spawnIssues(jiraIssues);
        handleInventory(jiraIssues);
        handleAreas(jiraIssues);
        setIntervalEnforceInventoryLimits();
        await bootstrapExtra();
        console.log('Scripting API Extra ready');
    } catch (error) {
        console.error('Error initializing script', error);
    }
}

function setIntervalEnforceInventoryLimits(): void {
    setInterval(() => enforceInventoryLimits(), 20 * 1000);
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

    WA.room.area.onEnter('backlogGrass').subscribe(() => displayJiraAssignmentMessage(userIdMap[WA.player.name], IssueCategory.Backlog, 'backlog-popup'));
    WA.room.area.onLeave('backlogGrass').subscribe(() => closePopup(WA.player.state.randomIssueAssignedPopup));

    WA.room.area.onEnter('grass1').subscribe(() => displayJiraAssignmentMessage(userIdMap[WA.player.name], IssueCategory.Todo, 'grass1-popup'));
    WA.room.area.onLeave('grass1').subscribe(() => closePopup(WA.player.state.randomIssueAssignedPopup));

    WA.room.area.onEnter('grass2').subscribe(() => displayJiraAssignmentMessage(userIdMap[WA.player.name], IssueCategory.Todo, 'grass2-popup'));
    WA.room.area.onLeave('grass2').subscribe(() => closePopup(WA.player.state.randomIssueAssignedPopup));
}

WA.onInit().then(initScript).catch(e => console.error('Error during WA.onInit', e));

export { };