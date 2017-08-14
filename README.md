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
```
  [remote "heroku"]
	url = https://git.heroku.com/murmuring-hollows-40420.git
	fetch = +refs/heads/*:refs/remotes/heroku/*
  ```

  If it isn't in there, add it.

 1) ```nano .git/config```
 2) Add the lines into the file
 3) ```CTRL + X``` (to close the editor)
 4) You will be asked if you want to save your changes. Type the following without quotes: ```"Y"```
 5) ```ENTER```
 6) ```cat .git/config``` (to check again and see that it's saved in there)

  Then, your deploys should work.