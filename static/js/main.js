var currentTabs = [];
var currentTab = -1;

function hideDiv(id) {
    document.getElementById(id).style.display = 'none';
}

function loadTabChanges(index) {
    document.getElementById("tabdisplay").innerHTML = "";
    var c = 0;
    currentTabs.forEach(function(file) {
        if (index !== undefined) {
            if (c === index) {
                document.getElementById("tabdisplay").innerHTML += "<div class='tab tab-selected'><div class='tab-content' onclick='moveEditorTo(" + c + ")'>" + file.name + "</div><div class='tab-close' onclick='closeTab(" + c + ")'> x </div></div>";
            } else {
                document.getElementById("tabdisplay").innerHTML += "<div class='tab'><div class='tab-content' onclick='moveEditorTo(" + c + ")'>" + file.name + "</div><div class='tab-close' onclick='closeTab(" + c + ")'>x</div></div>";
            }
        } else {
            if (c === (currentTabs.length) - 1) {
                document.getElementById("tabdisplay").innerHTML += "<div class='tab tab-selected'><div class='tab-content' onclick='moveEditorTo(" + c + ")'>" + file.name + "</div><div class='tab-close' onclick='closeTab(" + c + ")'> x </div></div>";
            } else {
                document.getElementById("tabdisplay").innerHTML += "<div class='tab'><div class='tab-content' onclick='moveEditorTo(" + c + ")'>" + file.name + "</div><div class='tab-close' onclick='closeTab(" + c + ")'>x</div></div>";
            }
        }
        c += 1;
    })
}

function moveEditorTo(index) {
    currentTabs.at(currentTab).content = document.editor.getValue();
    document.editor.setValue(currentTabs.at(index).content);
    monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(currentTabs.at(index).name.split(".").at(-1)))
    currentTab = index;
    loadTabChanges(index);
}

function closeTab(id) {
    currentTabs.splice(id, 1);
    currentTab = currentTabs.length - 1;
    if (currentTab === -1) {
        monaco.editor.setModelLanguage(document.editor.getModel(), "")
        document.editor.setValue(lunaIntroText);
    } else {
        monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(currentTabs.at(currentTab).name.split(".").at(-1)))
        document.editor.setValue(currentTabs.at(currentTab).content);
    }
    loadTabChanges();
}

function addToConfig(key, value) {
    docuemnt.config[key] = value;
    localStorage['config'] = JSON.stringify(config);
    document.editor.getModel().updateOptions(document.config);
}

function loadConfig() {
    document.config = JSON.parse(localStorage.getItem("config"));
    if (document.config === null) {
        document.config = { tabSize: 4 }
        localStorage['config'] = JSON.stringify(document.config);
    }
    document.editor.getModel().updateOptions(document.config);
}

function doUndo() {
    document.editor.trigger("", "undo");
}

function doRedo() {
    document.editor.trigger("", "redo");
}

function openFile() {
    var fileselector = document.createElement("input");
    fileselector.setAttribute('type', 'file');
    fileselector.setAttribute('multiple', true)
    fileselector.onchange = function(event) {
        for (let file of fileselector.files) {
            (new Blob([file])).text().then(x => {
                monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(file.name.split(".").at(-1)))
                document.editor.setValue(x);
                currentTabs.push({ 'content': x, 'name': file.name })
                currentTab = currentTabs.length - 1;
                loadTabChanges()
            });
        }
    }
    fileselector.click();
}

function newFile() {
    monaco.editor.setModelLanguage(document.editor.getModel(), '')
    document.editor.setValue('');
    currentTabs.push({ 'content': '', 'name': 'New File' })
    currentTab = currentTabs.length - 1;
    loadTabChanges()
}

function saveFile() {
    if (currentTab === -1) {
        Toastify({
            text: "Create/Open a file first.",
            duration: 3000,
            position: "center",
            style: {
                background: "#ff0033"
            }
        }).showToast();
        return;
    }
    currentTabs.at(currentTab).content = document.editor.getValue();
    var saveanchor = document.createElement("a");
    var toSave = new Blob([document.editor.getValue()], { type: "text/plain;charset=utf-8" });
    saveanchor.href = URL.createObjectURL(toSave);
    saveanchor.download = currentTabs.at(currentTab).name;
    saveanchor.click();
}

function doRenameFile() {
    if (currentTab === -1) {
        Toastify({
            text: "Open a file first.",
            duration: 3000,
            position: "center",
            style: {
                background: "#ff0033"
            }
        }).showToast();
        return;
    }
    document.getElementById("renameDialog").style.display = 'block';
    document.getElementById("renameDialogNewFilename").value = currentTabs.at(currentTab).name;
}

function triggerFileRenameFromDialog() {
    if (document.getElementById("renameDialogNewFilename").value.length === 0) {
        Toastify({
            text: "File name cannot be empty",
            duration: 3000,
            position: "center",
            style: {
                background: "#ff0033"
            }
        }).showToast();
        return;
    }
    currentTabs.at(currentTab).name = document.getElementById("renameDialogNewFilename").value;
    console.log(currentTabs.at(currentTab).name)
    monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(currentTabs.at(currentTab).name.split(".").at(-1)))
    loadTabChanges()
    document.getElementById("renameDialog").style.display = 'none';
}

function displayMonacoVersion() {
    fetch("https://unpkg.com/browse/monaco-editor@0.31.1").then(response => response.text()).then(data => {
        document.getElementById("monacoversion").innerText = "Monaco Version " + data.split("@")[1];
    })
}

displayMonacoVersion()