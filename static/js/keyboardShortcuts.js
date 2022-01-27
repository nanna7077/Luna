window.addEventListener('keydown', function(e) {
    if (e.shiftKey && e.key === 'O') {
        openFile();
        e.preventDefault();
    }
    if (e.shiftKey && e.key === 'N') {
        newFile()
        e.preventDefault();
    }
    if (e.shiftKey && e.key === 'S') {
        saveFile()
        e.preventDefault();
    }
    if (e.shiftKey && e.key === 'D') {
        downloadFile()
        e.preventDefault();
    }
    if (e.shiftKey && e.key === 'W') {
        closeTab(currentTab)
        e.preventDefault();
    }
    if (e.key === 'F2') {
        renameFile()
        e.preventDefault();
    }
}, false);