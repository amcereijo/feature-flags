# feature-flags (Root Repository)

This repository is the main entry point for working with the feature flags projects. It contains two submodules, each with its own independent repository and version control.

## Structure

- `go-api-sqllite`  
  Go API with SQLite.  
  Remote: [git@github.com:amcereijo/go-api-sqllite.git](git@github.com:amcereijo/go-api-sqllite.git)

- `go-api-sqlite-client`  
  Go client for the API.  
  Remote: [git@github.com:amcereijo/go-api-sqllite-client.git](git@github.com:amcereijo/go-api-sqllite-client.git)

## Cloning the repository

To clone this repository along with its submodules, run:

```sh
git clone git@github.com:amcereijo/feature-flags.git
cd feature-flags
git submodule update --init --recursive
```

This will download the root repository and both submodules on the `main` branch.

## Updating submodules

If the submodules have changed remotely and you want to update your local copy:

```sh
git submodule update --remote --merge
```

## Working with submodules

Each submodule is an independent Git repository. You can enter each folder and work with Git as usual:

```sh
cd go-api-sqllite
# or
cd go-api-sqlite-client
```

Remember to `push` and `pull` within the submodules to synchronize your changes with their respective remotes.

## Adding new submodules

To add a new submodule:

```sh
git submodule add -b main <repo-url> <directory>
git commit -am "Add new submodule"
git push
```

## Notes

- If you clone the repository and see empty folders for the submodules, make sure to run `git submodule update --init --recursive`.
- If you need to change the branch of a submodule, enter its folder and use the usual Git commands.

---

**Root repository:**  
[git@github.com:amcereijo/feature-flags.git](git@github.com:amcereijo/feature-flags.git)