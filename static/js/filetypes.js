function getFileType(ftypeshort) {
    ftypeshort = ftypeshort.toLowerCase();
    var fileTypes = {
        css: 'css',
        js: 'javascript',
        md: 'markdown',
        mjs: 'javascript',
        ts: 'typescript',
        py: 'python',
    }
    if (fileTypes.hasOwnProperty(ftypeshort)) { return fileTypes[ftypeshort]; }
    return ftypeshort
}
