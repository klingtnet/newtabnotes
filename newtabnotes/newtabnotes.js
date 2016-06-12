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

(function() {
var editorId = "newtabnotes-editor";
editor = ace.edit(editorId);
editor.setTheme("ace/theme/github");
editor.getSession().setMode("ace/mode/markdown");
editor.setValue(defaultText);
editor.session.selection.clearSelection();
editor.getSession().setUseWrapMode(true);
editor.setShowPrintMargin(false);
})();

window.onresize = function() {
  editor.resize();
};
