# Contributing

First off, thank you for considering contributing to this project! It's people like you that make open source such a great community.

## Where do I go from here?

If you've noticed a bug or have a feature request, [make one](https://github.com/typeWolffo/THREE.Fire/issues/new)! It's generally best if you get confirmation of your bug or approval for your feature request this way before starting to code.

## Fork & create a branch

If this is something you think you can fix, then fork the repository and create a branch with a descriptive name.

A good branch name would be (where issue #325 is the ticket you're working on):

```
git checkout -b 325-add-japanese-translations
```

## Get the test suite running

Make sure you get the tests running.

## Implement your fix or feature

At this point, you're ready to make your changes! Feel free to ask for help; everyone is a beginner at first :feelsgood:

## Make a Pull Request

At this point, you should switch back to your master branch and make sure it's up to date with the upstream master branch.

```
git remote add upstream git@github.com:typeWolffo/THREE.Fire.git
git checkout master
git pull upstream master
```

Then update your feature branch from your local copy of master, and push it!

```
git checkout 325-add-japanese-translations
git rebase master
git push --force-with-lease origin 325-add-japanese-translations
```

Finally, go to GitHub and make a Pull Request.

## Keeping your Pull Request updated

If a maintainer asks you to "rebase" your PR, they're saying that a lot of code has changed, and that you need to update your branch so it's easier to merge.

To learn more about rebasing and merging, check out this guide on [dev.to](https://dev.to/g_abud/advanced-git-reference-for-a-clean-git-history-4o0f).

It's also a good idea to open the PR on your side and run the tests, just to be sure.
