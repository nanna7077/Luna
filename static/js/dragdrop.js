dropArea = document.getElementsByTagName("body")[0];
dropArea.addEventListener('drop', dropped, false);
dropArea.addEventListener('dragover', dragover, false);

function dropped(event) {
    function openDroppedFile(file) {
        (new Blob([file])).text().then(x => {
            monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(file.name.split(".").at(-1)))
            document.editor.setValue(x);
            currentTabs.push({ 'content': x, 'name': file.name })
            currentTab = currentTabs.length - 1;
            loadTabChanges();
        })
    }

    if (event.dataTransfer.items) {
        for (var i = 0; i < event.dataTransfer.items.length; i++) {
            if (event.dataTransfer.items[i].kind === 'file') {
                var file = event.dataTransfer.items[i].getAsFile();
                openDroppedFile(file);
            }
        }
    } else {
        for (var i = 0; i < event.dataTransfer.files.length; i++) {
            openDroppedFile(event.dataTransfer.files[i]);
        }
    }
    event.preventDefault();
}

function dragover(event) {
    event.preventDefault();
}