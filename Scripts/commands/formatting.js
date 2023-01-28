exports.formattingCommand = (client, editor) => {
  let uri = editor.document.uri;
  if (true) {
    uri = "file://" + uri.substring(uri.indexOf("/Users"));
  }

  return client
    .sendRequest("textDocument/formatting", {
      textDocument: { uri: editor.document.uri },
      options: {
        tabSize: 4,
        insertSpaces: true,
      },
    })
    .then((result) => {

      if (result) {
        editor.edit((edit) => {
          result.map((r) => {
            edit.replace(new Range(0, editor.document.length), r.newText);
          });
        });
      }
    });
};
