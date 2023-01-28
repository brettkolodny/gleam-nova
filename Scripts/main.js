const { handleAddTextEditor } = require("./handlers/handleAddTextEditor");
require("./tasks/tasks");

var langserver = null;

console.log(nova.workspace.path);

exports.activate = function () {
  // Do work when the extension is activated
  langserver = new GleamLanguageServer();
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
  if (langserver) {
    langserver.deactivate();
    langserver = null;
  }
};

class GleamLanguageServer {
  constructor() {
    // Observe the configuration setting for the server's location, and restart the server on change
    nova.config.observe(
      "gleam.language-server-path",
      function (path) {
        this.start(path);
      },
      this
    );
  }

  deactivate() {
    this.stop();
  }

  start(path) {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
    }

    // Use the default server path
    if (!path) {
      path = "/opt/homebrew/bin/gleam";
    }

    // Create the client
    var serverOptions = {
      path: path,
      args: ["lsp"],
      env: {
        GLEAM_LOG: "info",
        GLEAM_LOG_NOCOLOUR: "1",
        PROJECT_PATH: nova.workspace.path,
      },
    };
    var clientOptions = {
      // The set of document syntaxes for which the server is valid
      syntaxes: ["gleam"],
      initializationOptions: {
        documentSelector: [{ scheme: "file", language: "gleam" }],
        suggest: {
          names: true,
          paths: true,
          autoImports: true,
          completeFunctionCalls: true,
          imports: {
            autoDiscover: true,
          },
        },
      },
    };
    var client = new LanguageClient(
      "gleam-langserver",
      "Gleam Language Server",
      serverOptions,
      clientOptions
    );

    this.mainDisposable = new CompositeDisposable();

    try {
      // Start the client
      client.start();

      // Add the client to the subscriptions to be cleaned up
      nova.subscriptions.add(client);
      this.languageClient = client;

      // Format on save
      nova.workspace.onDidAddTextEditor(
        handleAddTextEditor(
          this.mainDisposable,
          client,
          Boolean(nova.config.get("gleam.format-on-save"))
        )
      );
    } catch (err) {
      // If the .start() method throws, it's likely because the path to the language server is invalid

      if (nova.inDevMode()) {
        console.error(err);
      }
    }
  }

  stop() {
    if (this.languageClient) {
      this.languageClient.stop();
      nova.subscriptions.remove(this.languageClient);
      this.mainDisposable.dispose();
      this.languageClient = null;
    }
  }
}
