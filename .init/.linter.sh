#!/bin/bash
cd /home/kavia/workspace/code-generation/surgical-schedule-management-system-1461-1484/backend
npm run lint
LINT_EXIT_CODE=$?
if [ $LINT_EXIT_CODE -ne 0 ]; then
  exit 1
fi

