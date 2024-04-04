function initPlayerStates() {
    WA.player.state.saveVariable('issuePopup', {});
    WA.player.state.saveVariable('currentPopup', {});
    WA.player.state.saveVariable('canRemoveTicket', false);
    WA.player.state.saveVariable('trashActionMessage', {});
    WA.player.state.saveVariable('inventorySize', 0);
}

export { initPlayerStates };