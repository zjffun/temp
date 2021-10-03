const { spawn } = require('child_process');

export class Tool {
  public process;
  public stdin;

  constructor(config) {
    const { cmd, args, cwd, env } = config;

    this.process = spawn(cmd, args, {
      cwd,
      env,
    });
  }
}
