# HOW TO DEPLOY ME

**App is reachable at:** https://murmuring-hollows-40420.herokuapp.com/

1) ```git merge origin master```
2) ```webpack```
3) ```git add .```
4) ```git commit -m "staging latest changes"```
5) ```git push```
6) ```npm run deploy```


## NOTE: 

When you check out the deployables branch, in yor project directory, run the following:

```cat .git/config```

You should see this somewhere in there:
```[remote "heroku"]
	url = https://git.heroku.com/murmuring-hollows-40420.git
	fetch = +refs/heads/*:refs/remotes/heroku/*```

  If it isn't in there, add it.

  Then, your deploys should work.