# Add Issue Link

A GitHub Action for [Linking a pull request to an issue](https://help.github.com/en/enterprise/2.17/user/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue).

## :arrow_forward: Usage

this action add texts like this into the head of your Pull Request description when it is opened.

```md
# Related Issue

- Resolve #2
```

- Result example
  ![Linking a pull request to an issue](readmeImages/pull-request.png)

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
      - uses: tkt-actions/add-issue-links@v1.2.0
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}' # required
          branch-prefix: 'issue-' # required
          position: 'top' # optional (default: "bottom")
          resolve: 'true' # optional (default: "false")
```

### Set up required parameters

Need to contain the required parameters on the workflow file.

- `repo-token` - A token of the repository. It can be passed with `{{ secrets.GITHUB_TOKEN }}`
- `branch-prefix` - A prefix of the branch name for finding a related issue (e.g. `issue-`).

### Set up optional parameters

- `position` - Changing position of link text section. ("top" or "bottom" allowed)
- `resolve` - Adding \"resolve\" prefix to close a related issue when the branch is merged. ("true" or "false" allowed)

### Add a section contained a link of related issue to a pull request

Create a branch based on the pattern of the branch name (`[branch prefix][issue number][you can put any texts]`) set up on `.github/workflows/issue-reference.yml`.

For example, if `branch-prefix` is `issue-`, create a branch like `issue-8/create-action`.

When pushing your changes to the repository and creating a pull request, a workflow runs automatically.

## :memo: Licence

MIT
