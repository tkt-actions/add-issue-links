# Add Issue Links

A GitHub Action for [Linking a pull request to an issue](https://help.github.com/en/enterprise/2.17/user/github/managing-your-work-on-github/linking-a-pull-request-to-an-issue).

## :arrow_forward: Usage

This action add a comment or add texts into a body of Pull Request like this when it is opened.

```md
# Related Issue

- Resolve #2
```

- Result Sample
  ![Linking a pull request to an issue](readmeImages/pull-request.png)

### Create a workflow

Create `.github/workflows/issue-link.yml`.

#### issue-link.yml

```yml
name: 'Issue Links'
on:
  pull_request:
    types: [opened]

jobs:
  issue-links:
    runs-on: ubuntu-latest
    steps:
      - uses: tkt-actions/add-issue-links@v1.4.0
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}' # required
          branch-prefix: 'issue-' # required
```

### Set up required parameters

Need to contain the required parameters on the workflow file.

- `repo-token` - A token of the repository.  
  It can pass with `{{ secrets.GITHUB_TOKEN }}`

### Set up optional parameters

- `branch-prefix` - A prefix of a branch name for finding a related issue.  
  (Default: "issue-")
- `position` - Changing position of link text section.  
  (allow "top" or "bottom". Default: "bottom")
- `resolve` - Adding "resolve" prefix to close a related issue when the branch is merged.  
  (allow "true" or "false". Default: "false")
- `repository` - Changing a base repository related to an issue.  
  If you use this option, "resolve" option become false.  
  (e.g. `tkt-actions/issue-links`)
- `link-style` - `body` add an issue link by editing Pull Request body.  
  `comment` add an issue link by creating comment to Pull Request.  
  (allow "body or "comment". Default: "body")

#### example

```yml
name: 'Issue Links'
on:
  pull_request:
    types: [opened]

jobs:
  issue-links:
    runs-on: ubuntu-latest
    steps:
      - uses: tkt-actions/add-issue-links@v1.4.0
        with:
          repo-token: '${{ secrets.GITHUB_TOKEN }}' # required
          branch-prefix: 'issue-' # required
          position: 'top' # optional (default: "bottom")
          resolve: 'true' # optional (default: "false")
          repository: 'tkt-actions/add-issue-links' # optional
          link-style: 'comment' # optional (default: "body")
```

### Add a section contained a link of related issue to a pull request

Create a branch based on the pattern of the branch name (`[branch prefix][issue number][you can put any texts]`) set up on `.github/workflows/issue-reference.yml`.

For example, if `branch-prefix` is `issue-`, create a branch like `issue-8/create-action`.

When pushing your changes to the repository and creating a pull request, a workflow runs automatically.

## :memo: Licence

MIT
