window.addEventListener('keyup', function(e) {
    if (e.ctrlKey && e.key === 'o') {
        openFile()
        e.preventDefault();
    }
    if (e.ctrlKey && e.key === 'n') {
        newFile()
        e.preventDefault();
    }
    if (e.ctrlKey && e.key === 's') {
        saveFile()
        e.preventDefault();
    }
    if (e.ctrlKey && e.key === 'w') {
        closeTab(currentTab)
        e.preventDefault();
    }
    if (e.key === 'F2') {
        renameFile()
        e.preventDefault();
    }
}, false);