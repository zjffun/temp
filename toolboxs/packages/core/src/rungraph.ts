async function runEntry(entry) {
  await entry.args;
  await entry.env;
  await entry.cwd;

  return runCommand(entry);
}

export function rungraph({ entries }) {
  entries.forEach((entry) => {
    runEntry(entry);
  });
}
