window.addEventListener('keydown', function(e) {
    if (e.ctrlKey && e.key == 'o') {
        openFile();
        e.preventDefault();
    }
    if (e.shiftKey && e.key == 'N') {
        newFile()
        e.preventDefault();
    }
    if (e.ctrlKey && e.key == 's') {
        saveFile()
        e.preventDefault();
    }
    if (e.ctrlKey && e.key == 'd') {
        downloadFile()
        e.preventDefault();
    }
    if (e.shiftKey && e.key == 'W') {
        closeTab(currentTab)
        e.preventDefault();
    }
    if (e.key === 'F2') {
        renameFile()
        e.preventDefault();
    }
}, false);