#!/bin/bash
## REMEMBER TO RUN WEBPACK AND GIT ADD/COMMIT THAT SHIT BEFORE DEPLOY
git push heroku deployables:master
sleep 5
heroku logs --tail
