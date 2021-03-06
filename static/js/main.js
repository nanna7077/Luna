var JSZip = null;
require(['https://cdn.jsdelivr.net/npm/jszip@3.7.1/dist/jszip.min.js'], function(jszip) {
    JSZip = jszip;
})

var currentTabs = [];
var currentTab = -1;

function hideDiv(id) {
    document.getElementById(id).style.display = 'none';
}

function loadLastSession() {
    if (localStorage.getItem('lastsession') !== null) {
        currentTabs = JSON.parse(localStorage.getItem('lastsession'));
        if (currentTabs.length !== 0) {
            currentTab = parseInt(localStorage.getItem('lastsessionOpenTab'));
            document.editor.setValue(currentTabs.at(currentTab).content);
            monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(currentTabs.at(currentTab).name.split(".").at(-1)))
            loadTabChanges(currentTab);
        } else {
            currentTab = -1;
        }
    }
}

function saveSession() {
    localStorage['lastsession'] = JSON.stringify(currentTabs);
    localStorage['lastsessionOpenTab'] = currentTab;
}

function clearWorkspace() {
    currentTabs = [];
    currentTab = -1;
    localStorage['lastsession'] = JSON.stringify(currentTab);
    loadTabChanges();
    monaco.editor.setModelLanguage(document.editor.getModel(), "")
    document.editor.setValue(lunaIntroText);
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
    if (currentTab !== -1) {
        document.getElementById('pageTitle').innerText = currentTabs[currentTab].name + " - Luna Editor";
    } else {
        document.getElementById('pageTitle').innerText = "Luna Editor";
    }
    document.getElementById("tabdisplay").innerHTML += "<div class='tab' onclick='newFile()'> + </div>";
    saveSession();
}

function moveEditorTo(index) {
    currentTabs.at(currentTab).content = document.editor.getValue();
    document.editor.setValue(currentTabs.at(index).content);
    monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(currentTabs.at(index).name.split(".").at(-1)))
    currentTab = index;
    loadTabChanges(index);
}

function closeTab(id) {
    if (id === -1) {
        Toastify({
            text: "No tab is open",
            duration: 3000,
            position: "center",
            style: {
                background: "#ff0033"
            }
        }).showToast();
        return;
    }
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

function addToMonacoConfig(key, value) {
    document.monacoConfig[key] = value;
    localStorage['monacoConfig'] = JSON.stringify(document.monacoConfig);
    document.editor.getModel().updateOptions(document.monacoConfig);
    Toastify({
        text: "Please refresh page for changes to take effect.",
        duration: 3000,
        position: "center",
        style: {
            background: "#00ff00",
            color: "#000000"
        }
    }).showToast();
}

function loadMonacoConfig() {
    document.monacoConfig = JSON.parse(localStorage.getItem("monacoConfig"));
    if (document.monacoConfig === null) {
        document.monacoConfig = { tabSize: 4, "bracketPairColorization.enabled": true }
        localStorage['monacoConfig'] = JSON.stringify(document.monacoConfig);
    }
    document.editor.getModel().updateOptions(document.monacoConfig);
}

function addToConfig(key, value) {
    document.config[key] = value;
    localStorage['config'] = JSON.stringify(document.config);
    document.editor.getModel().updateOptions(document.config);
    Toastify({
        text: "Please refresh page for changes to take effect.",
        duration: 3000,
        position: "center",
        style: {
            background: "#00ff00",
            color: "#000000"
        }
    }).showToast();
}

function loadconfig() {
    document.config = JSON.parse(localStorage.getItem("config"));
    if (document.config === null) {
        document.config = { theme: 'lunadark' }
        localStorage['config'] = JSON.stringify(document.config);
    }
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
                loadTabChanges();
            });
        }
    }
    fileselector.click();
}

function openFileFromLink() {
    document.getElementById("openFromLinkDialog").style.display = 'block';
}

function OpenInLunaLinkMaker() {
    document.getElementById('createOpenInLunaLink').style.display = 'block';
}

function makeOpenInLunaLinkFromDialog() {
    if (document.getElementById('createOpenInLunaLinkText').value.length === 0) {
        Toastify({
            text: "Link cannot be empty",
            duration: 3000,
            position: "center",
            style: {
                background: "#ff0033"
            }
        }).showToast();
        return;
    }
    var c = window.location.origin + window.location.pathname + '?openUrl=' + encodeURIComponent(document.getElementById('createOpenInLunaLinkText').value);
    if (document.getElementById('createOpenInLunaLanguageText').value.length !== 0) {
        c += '&language=' + document.getElementById('createOpenInLunaLanguageText').value;
    }
    navigator.clipboard.writeText(c).then(function() {
        Toastify({
            text: "Copied link to clipboard",
            duration: 3000,
            position: "center",
            style: {
                background: "#00FF00"
            }
        }).showToast();
    }, function(err) {
        Toastify({
            text: "Could not copy to clipboard. " + err,
            duration: 3000,
            position: "center",
            style: {
                background: "#ff0033"
            }
        }).showToast();
    })
    document.getElementById('createOpenInLunaLink').style.display = 'none';
}

function triggerFileOpenFromLinkFromDialog(link, language) {
    if (link == undefined) {
        if (document.getElementById("fileFromLinkText").value.length === 0) {
            Toastify({
                text: "Link cannot be empty",
                duration: 3000,
                position: "center",
                style: {
                    background: "#ff0033"
                }
            }).showToast();
            return;
        }
        var link = document.getElementById("fileFromLinkText").value;
    }
    fetch(link).then((response) => {
            if (response.status === 200) {
                return response.text();
            } else {
                throw new Error('Something went wrong');
            }
        })
        .then((responseText) => {
            currentTabs.push({ 'content': responseText, 'name': document.getElementById("fileFromLinkText").value.split("/").at(-1) });
            if (language == undefined) {
                monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(document.getElementById("fileFromLinkText").value.split("/").at(-1).split(".").at(-1)));
            } else {
                monaco.editor.setModelLanguage(document.editor.getModel(), language);
            }
            document.editor.setValue(responseText);
            currentTab = currentTabs.length - 1;
            loadTabChanges();
        })
        .catch((error) => {
            Toastify({
                text: "Could not fetch from link. " + error,
                duration: 3000,
                position: "center",
                style: {
                    background: "#ff0033"
                }
            }).showToast();
        })
    document.getElementById("fileFromLinkText").value = '';
    document.getElementById("openFromLinkDialog").style.display = 'none';
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
    saveSession()
}

function downloadFile() {
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

function downloadWorkspace() {
    var zip = new JSZip();
    var fname = '';
    currentTabs.forEach(function(file) {
        zip.file(file.name, file.content);
        fname += file.name.replace(" ", '') + "-";
    })
    fname = fname.slice(0, fname.length - 1) + ".zip"
    zip.generateAsync({ type: "blob", compression: "DEFLATE" }).then(function(content) {
        var saveanchor = document.createElement("a");
        saveanchor.href = URL.createObjectURL(content);
        saveanchor.download = fname;
        saveanchor.click();
    })
}

function renameFile() {
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
    document.getElementById("renameDialogNewFilename").focus();
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
    monaco.editor.setModelLanguage(document.editor.getModel(), getFileType(currentTabs.at(currentTab).name.split(".").at(-1)))
    loadTabChanges()
    document.getElementById("renameDialog").style.display = 'none';
}

function displayMonacoVersion() {
    fetch("https://unpkg.com/browse/monaco-editor@0.31.1").then(response => response.text()).then(data => {
        document.getElementById("monacoversion").innerText = "Monaco Version " + data.split("@")[1];
    })
}

function openPreferences() {
    document.getElementById("preferences").style.display = 'block';
    showCategory('general');
}

function showCategory(category) {
    [...document.getElementsByClassName('dialogBig-categories-category')].forEach(function(element) { element.classList.remove("selected"); })
    if (category === 'general') {
        document.getElementById("category-general").classList.add("selected");
        [...document.getElementsByClassName('dialogBig-options')].forEach(function(element) { element.style.display = 'none'; })
        document.getElementById("preferences-general-values").style.display = 'inline-block';
        if (document.config.theme === 'lunadark') {
            document.getElementById("preferencesThemeDark").checked = true;
        } else {
            document.getElementById("preferencesThemeLight").checked = true;
        }
    } else if (category === 'editor') {
        document.getElementById("category-editor").classList.add("selected");
        [...document.getElementsByClassName('dialogBig-options')].forEach(function(element) { element.style.display = 'none'; })
        document.getElementById("preferences-editor-values").style.display = 'inline-block';
        document.getElementById("preferencesTabSize").value = document.monacoConfig.tabSize;
        document.getElementById("preferencesAutoClosingBrackets").checked = document.monacoConfig.autoClosingBrackets;
        document.getElementById("preferencesBracketPairColorization").checked = document.monacoConfig[`'bracketPairColorization.enabled'`];
    } else {
        return;
    }
}

var currentURL = new URL(window.location.href);
if (currentURL.searchParams.get('openUrl') != null) {
    if (currentURL.searchParams.get('language') != null) {
        triggerFileOpenFromLinkFromDialog(decodeURIComponent(currentURL.searchParams.get('openUrl')), currentURL.searchParams.get('language'));
    } else {
        triggerFileOpenFromLinkFromDialog(decodeURIComponent(currentURL.searchParams.get('openUrl')));
    }
}

displayMonacoVersion()