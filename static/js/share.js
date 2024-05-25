var isFromAShare = window.location.search.includes("share=");
var peer = new Peer();
var peerID = null;

if (isFromAShare) {
    console.log("Connecting to peer...");
    handleConnection(peer.connect(window.location.search.split('?share=')[1]));
} else {
    document.getElementById('share-dropdown').style.display = 'block';
}

peer.on('open', function(id) {
    peerID = id;
    console.log("Peer connection opened with ID:", peerID);
});

function handleConnection(conn) {
    conn.on('open', function() {
        console.log("Connection opened:", conn);
        [...document.getElementsByClassName('share-peerID')].forEach(function(element) { 
            element.innerText = conn.id; 
        });
    });

    conn.on('data', function(data) {
        console.log("Data received:", data);
        currentTabs = JSON.parse(data);
        loadTabChanges();
    });

    const shareWaitForDocumentInterval = setInterval(() => {
        if (document.editor) {
            document.editor.onDidChangeModelContent((e) => {
                console.log("Document content changed, sending data...");
                conn.send(JSON.stringify(currentTabs));
            });
            clearInterval(shareWaitForDocumentInterval);
        }
    }, 1000);

    const shareInInterval = setInterval(() => {
        console.log("Sending data:", currentTabs);
        conn.send(JSON.stringify(currentTabs));
    }, 2000);
}

peer.on('connection', handleConnection);

function shareWorkspace() {
    const url = `${window.location.protocol}//${window.location.host}${window.location.pathname}${window.location.search ? window.location.search + '&share=' : '?share='}${peerID}`;
    alert(`Sharing on ${url}`);
    navigator.clipboard ? navigator.clipboard.writeText(url).then(function() {
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
    }) : console.warn('Clipboard API not available');
}
