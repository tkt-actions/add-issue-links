# Add an issue reference
A GitHub Action for adding a issue link to a pull request.

## :arrow_forward: Usage
A workflow adds texts contained a link for a related issue based on the branch name to a pull request description when a pull request is opened.

![Adds texts contained a link for a related issue](usage.png)

### Create a workflow

Add `.github/workflows/issue-reference.yml` with the following:

```yml
name: 'Issue Link'
on:
  pull_request:
    types: [opened]

jobs:
  issue-link:
    runs-on: ubuntu-latest
    steps:
      - uses: tkt-actions/add-issue-links@v0.1.2
        with:
          repo-token: "${{ secrets.GITHUB_TOKEN }}"
          branch-prefix: "issue-"
```

### Set up required parameters
Need to contain the required parameters on the workflow file.

- `repo-token` A token for the repository. Can be passed in using `{{ secrets.GITHUB_TOKEN }}`
- `branch-prefix` A prefix of the branch name for finding a related issue (e.g `issue-`).

### Add a comment contained a link for a related issue
Create a branch based on the pattern of the branch name (`[branch prefix][issue number][you can put any texts]`) set up on `.github/workflows/issue-reference.yml`.

For example, if `branch-prefix` is `issue-`, create a branch like `issue-8_create-action`.

When pushing your changes to the repository and creating a pull request, a workflow runs automatically.

## :memo: Licence
MIT
