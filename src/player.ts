function initPlayerStates(jiraAccountId: string) {
    WA.player.state.saveVariable('issuePopup', {});
    WA.player.state.saveVariable('currentPopup', {});
    WA.player.state.saveVariable('canRemoveTicket', false);
    WA.player.state.saveVariable('trashActionMessage', {});
    WA.player.state.saveVariable('inventorySize', 0);

    WA.player.state.jiraAccountId = jiraAccountId;
}

export { initPlayerStates };