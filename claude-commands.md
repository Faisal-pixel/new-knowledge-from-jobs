# Claude Commands & Learning Notes

This file documents Claude Code commands, behaviors, and usage notes learned while working on jobs.

## Contents

This includes:
- Claude Code commands and what they do
- Practical notes about using the terminal interface
- Tips, reminders, and troubleshooting details worth keeping

---

## Index

1. [/logout](#logout)
2. [/status or /model](#status-or-model)

---

## /logout

Use `/logout` in the Claude Code terminal to end the current authenticated session.

- Type `/logout` directly into the terminal prompt
- This ends the current login session
- You will need to re-authenticate the next time you use Claude Code

### Notes

- If `/logout` is not recognized, make sure you are using the latest version of the Claude Code CLI
- Claude Code may rely on browser authorization or persistent sessions, so logging out can require signing in again on the next use

## /status or /model

Use `/status` or `/model` in the Claude Code terminal to check the current model while Claude Code is running.

- `/status` shows your current model, account information, and token usage
- `/model` shows the model version currently in use
- You can also configure a persistent status line in `~/.claude/settings.json` to display the model name at all times

### Notes

- The status line can be set with a command-based configuration
- You can replace the example echo command with a script that dynamically reads your current settings

Example:

```json
{
	"statusLine": {
		"type": "command",
		"command": "echo 'Model: claude-3-5-sonnet'",
		"padding": 2
	}
}
```

