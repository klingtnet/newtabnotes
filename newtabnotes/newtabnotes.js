"use strict";

var defaultText = `# newtabnotes

Please enter *your* **Markdown** text;

- It is
- *easy*
- trust me!

-> Ligatures are supported as well!

1 != 2
`;

var editor;
var editorId = "newtabnotes-editor";
var editorData = {
  "content": "",
  "scheme": "github",
  "syntax": "markdown",
  "fontSize": "16"
};

(function() {
  editor = ace.edit(editorId);
  loadFromSync();
  editor.getSession().setUseWrapMode(true);
  editor.setShowPrintMargin(false);
  editor.getSession().on('change', changeListener);
})();

function changeListener(event) {
  editorData.content = editor.getValue();
  // check if only one instance of the newtab page is open,
  // otherwise disable save and show warning banner
  chrome.storage.sync.set({"editorData": editorData}, function() {});
}

function loadFromSync() {
  chrome.storage.sync.get("editorData", function(data) {
    if (data.hasOwnProperty("editorData")) {
      updateEditorData(data.editorData);
      updateEditor(editorData);
    }
  });
}

function updateEditorData(data) {
  if (data.hasOwnProperty('content')) {
    editorData.content = data.content;
  }
  if (data.hasOwnProperty('scheme')) {
    editorData.scheme = data.scheme;
  }
  if (data.hasOwnProperty('syntax')) {
    editorData.syntax = data.syntax;
  }
  if (data.hasOwnProperty('fontSize')) {
    editorData.fontSize = data.fontSize;
  }
}

function updateEditor(data) {
  editor.setValue(data.content);
  editor.session.selection.clearSelection();
  editor.setTheme("ace/theme/"+data.scheme);
  editor.getSession().setMode("ace/mode/"+data.syntax);
  var node = document.getElementById(editorId);
  if (node !== undefined) {
    node.style.fontSize = data.content.fontSize+'px';
  }
}

window.onresize = function() {
  editor.resize();
}
