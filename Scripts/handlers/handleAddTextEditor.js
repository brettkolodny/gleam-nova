const { formattingCommand } = require("../commands/formatting");

exports.handleAddTextEditor =
  (disposable, client, formatOnSave) => (editor) => {
    if (editor.document.syntax !== "gleam") return;
    const editorDisposable = new CompositeDisposable();
    disposable.add(editor.onDidDestroy(() => editorDisposable.dispose()));

    if (formatOnSave) {
      editorDisposable.add(
        editor.onWillSave((editor) => {
          return formattingCommand(client, editor);
        })
      );
    }

    // This triggers a recompile. This should be sent automatically by the Nova
    // LanguageClient but that does not seem to be happening so we send it
    // manually here.
    editorDisposable.add(
      editor.onDidSave((editor) => {
        client.sendNotification("textDocument/didSave", {
          textDocument: { uri: editor.document.uri },
        });
      })
    );
  };
