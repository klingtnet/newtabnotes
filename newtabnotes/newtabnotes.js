"use strict";

var editor;
var editorId = "newtabnotes-editor";
var editorState = {
  "content": "",
  "scheme": "github",
  "syntax": "markdown",
  "fontSize": 12,
  "showLineNumbers": false,
};

// init function
(function() {
  document.getElementById("scheme-selector").onchange = schemeSelector;
  document.getElementById("line-numbers").onchange = lineNumbers;
  document.getElementById("font-size").onchange = fontSize;
  editor = ace.edit(editorId);
  loadFromSync();
  updateView(editorState);
  editor.getSession().setUseWrapMode(true);
  editor.setShowPrintMargin(false);
  editor.getSession().on('change', changeListener);
})();

function schemeSelector() {
  if (this.value !== undefined) {
    var scheme = this.value;
    editor.setTheme("ace/theme/"+scheme);
    editorState.scheme = scheme;
    chrome.storage.sync.set({"editorState": editorState}, function() {});
  }
}

function lineNumbers() {
  editorState.showLineNumbers = this.checked;
  console.log(editorState);
  updateView(editorState);
  storeState();
}

function fontSize() {
  editorState.fontSize = this.value;
  updateView(editorState);
  storeState();
}

function changeListener(event) {
  editorState.content = editor.getValue();
  // check if only one instance of the newtab page is open,
  // otherwise disable save and show warning banner
  storeState();
}

function storeState() {
  chrome.storage.sync.set({"editorState": editorState}, function() {});
}

function loadFromSync() {
  chrome.storage.sync.get("editorState", function(data) {
    if (data.hasOwnProperty("editorState")) {
      updateState(data.editorState);
      updateView(data.editorState);
    }
  });
}

function updateState(data) {
  if (data.hasOwnProperty('content')) {
    editorState.content = data.content;
  }
  if (data.hasOwnProperty('scheme')) {
    editorState.scheme = data.scheme;
  }
  if (data.hasOwnProperty('syntax')) {
    editorState.syntax = data.syntax;
  }
  if (data.hasOwnProperty('fontSize')) {
    editorState.fontSize = data.fontSize;
  }
  if (data.hasOwnProperty('showLineNumbers')) {
    editorState.showLineNumbers = data.showLineNumbers;
  }
}

function updateView(data) {
  var node = document.getElementById("scheme-selector");
  var idx = 0;
  for (; idx < node.options.length; idx++) {
    if (node.options[idx].value === data.scheme) {
      break;
    }
  }
  node.selectedIndex = idx;
  editor.setValue(data.content);
  editor.session.selection.clearSelection();
  editor.setTheme("ace/theme/"+data.scheme);
  editor.getSession().setMode("ace/mode/"+data.syntax);
  document.getElementById('font-size').value = data.fontSize;
  document.getElementById(editorId).style.fontSize = data.fontSize+'px';
  document.getElementById('line-numbers').checked = data.showLineNumbers;
  editor.renderer.setOption('showLineNumbers', data.showLineNumbers);

}

window.onresize = function() {
  editor.resize();
}
