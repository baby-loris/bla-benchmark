all:
	@npm install
	@make run

run:
	@node server/boot.js

.PHONY: all run
