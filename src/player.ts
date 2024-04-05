function initPlayerStates() {
    WA.player.state.saveVariable('issuePopup', {});
    WA.player.state.saveVariable('currentPopup', {});
    WA.player.state.saveVariable('canRemoveTicket', false);
    WA.player.state.saveVariable('trashActionMessage', {});
    WA.player.state.saveVariable('inventorySize', 0);
    WA.player.state.saveVariable('randomIssueAssignedPopup', {});

    WA.player.state.jiraAccountId = '5f9f40bec2e5390077a882f5';
}

export { initPlayerStates };