exports.activate = function () {
  // Do work when the extension is activated
};

exports.deactivate = function () {
  // Clean up state before the extension is deactivated
};

class GleamTaskProvider {
  #path = "/opt/homebrew/bin/gleam";

  constructor() {
    nova.config.observe(
      "gleam.language-server-path",
      function (path) {
        console.log(path);
        this.#path = path ?? this.#path;
      },
      this
    );
  }

  provideTasks() {
    const gleamTask = new Task("Gleam");

    gleamTask.setAction(
      Task.Build,
      new TaskProcessAction(this.#path, {
        args: ["build"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    gleamTask.setAction(
      Task.Run,
      new TaskProcessAction(this.#path, {
        args: ["run"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    gleamTask.setAction(
      Task.Clean,
      new TaskProcessAction(this.#path, {
        args: ["clean"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    const erlangTask = new Task("Gleam Erlang");

    erlangTask.setAction(
      Task.Build,
      new TaskProcessAction(this.#path, {
        args: ["build", "--target=erlang"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    erlangTask.setAction(
      Task.Clean,
      new TaskProcessAction(this.#path, {
        args: ["clean"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    erlangTask.setAction(
      Task.Run,
      new TaskProcessAction(this.#path, {
        args: ["run", "--target=erlang"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    const nodeTask = new Task("Gleam Node");

    nodeTask.setAction(
      Task.Build,
      new TaskProcessAction(this.#path, {
        args: ["build", "--target=node"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    nodeTask.setAction(
      Task.Clean,
      new TaskProcessAction(this.#path, {
        args: ["clean"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    nodeTask.setAction(
      Task.Run,
      new TaskProcessAction(this.#path, {
        args: ["run", "--target=javascript", "--runtime=node"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    const denoTask = new Task("Gleam Deno");

    denoTask.setAction(
      Task.Build,
      new TaskProcessAction(this.#path, {
        args: ["build", "--target=javascript"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    denoTask.setAction(
      Task.Clean,
      new TaskProcessAction(this.#path, {
        args: ["clean"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    denoTask.setAction(
      Task.Run,
      new TaskProcessAction(this.#path, {
        args: ["run", "--target=javascript", "--runtime=deno"],
        env: {},
        cwd: nova.workspace.path,
      })
    );

    return [gleamTask, erlangTask, nodeTask, denoTask];
  }
}

nova.assistants.registerTaskAssistant(new GleamTaskProvider(), {
  identifier: "gleam-tasks",
  name: "Gleam Tasks",
});
