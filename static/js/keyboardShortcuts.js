window.addEventListener('keyup', function(e) {
    if (e.shiftKey && e.key === 'O') {
        openFile()
    }
    if (e.shiftKey && e.key === 'N') {
        newFile()
    }
    if (e.shiftKey && e.key === 'S') {
        saveFile()
    }
    if (e.shiftKey && e.key === 'W') {
        closeTab(currentTab)
    }
    if (e.key === 'F2') {
        renameFile()
    }
}, false);