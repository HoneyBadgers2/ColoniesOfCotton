#!/bin/bash
webpack
git push heroku deployables:master
sleep 5
heroku logs --tail
