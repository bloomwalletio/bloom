# Contribute to Bloom

This document describes how to contribute to Bloom.
We encourage everyone with knowledge and passion in IOTA technology to do so.

Thanks! :heart:

<details>
<summary>Do you have a question :question:</summary>
<br>

If you have a general or technical question, you can use one of the following resources instead of submitting an issue:

- [**IOTA documentation:**](https://wiki.iota.org/) For official information about developing with IOTA technology
- [**Developer documentation:**](https://docs.bloomwallet.io/) For official information about developing with Bloom wallet
- [**Discord:**](https://discord.gg/RjX3jEc7K7) For real-time chats with the developers and community members
</details>

<br>

<details>
<summary>Ways to contribute :mag:</summary>
<br>

To contribute to wallet on GitHub, you can:

- Report a bug
- Suggest a new feature
- Build a new feature
</details>

<br>

<details>
<summary>Report a bug :bug:</summary>
<br>

This section guides you through reporting a bug. Following these guidelines helps maintainers and the community understand the bug, reproduce the behavior, and find related bugs.

### Before reporting a bug

Please check the following list:

- **Do not open a GitHub issue for [security vulnerabilities](.github/SECURITY.MD)**, instead, please contact us at [security@bloomwallet.io](mailto:security@bloomwallet.io).

- **Ensure the bug was not already reported** by searching on GitHub under [**Issues**](https://github.com/bloomwalletio/bloom/issues). If the bug has already been reported **and the issue is still open**, add a comment to the existing issue instead of opening a new one.

**Note:** If you find a **Closed** issue that seems similar to what you're experiencing, open a new issue and include a link to the original issue in the body of your new one.

### Submitting a bug report

To report a bug, [open a new issue](https://github.com/bloomwalletio/bloom/issues/new?assignees=&labels=bug-report&projects=&template=bug_report.yml&title=%F0%9F%90%9E+-+), and be sure to include as many details as possible, using the template.

**Note:** Minor changes such as fixing a typo can but do not need an open issue.

If you also want to fix the bug, submit a [pull request](#pull-requests) and reference the issue.
</details>

<br>

<details>
<summary>Suggest a new feature :bulb:</summary>
<br>

This section guides you through suggesting a new feature. Following these guidelines helps maintainers and the community collaborate to find the best possible way forward with your suggestion.

### Before suggesting a new feature

**Ensure the feature has not already been suggested** by searching on GitHub under [**Issues**](https://github.com/bloomwalletio/bloom/issues).

### Suggesting a new feature

To suggest a new feature, talk to the Bloom team on the [Discord Server](https://discord.gg/RjX3jEc7K7).

</details>

<br>

<details>
<summary>Build a new feature :hammer:</summary>
<br>

This section guides you through building a new feature. Following these guidelines helps give your feature the best chance of being approved and merged.

### Before building a new feature

Make sure to discuss the feature on [Discord](https://discord.gg/RjX3jEc7K7).

Otherwise, your feature may not be approved at all.

### Building a new feature

To build a new feature, check out a new branch based on the `develop` branch.
</details>

<br>

<details>
<summary>Pull requests :mega:</summary>
<br>

This section guides you through submitting a pull request (PR). Following these guidelines helps give your PR the best chance of being approved and merged.

### Before submitting a pull request

Before submitting a pull request, please follow these steps to have your contribution considered by the maintainers:

- A pull request should have exactly one concern (for example one feature or one bug). If a PR addresses more than one concern, it should be split into two or more PRs.

- A pull request can be merged only if it references an open issue

    **Note:** You don't need to open an issue for minor changes such as typos, but you can if you want.

- All code should be well formatted and linted, passing our [linting continuous integration](https://github.com/bloomwalletio/bloom/blob/develop/.github/workflows/ci.lint.yml) workflow

- All code should be well tested, passing (unit _and_ integration tests) both locally and in our [testing continuous integration](https://github.com/bloomwalletio/bloom/blob/develop/.github/workflows/ci.test.yml) workflow


### Submitting a pull request

The following is a typical workflow for submitting a new pull request:

1. Fork this repository
2. Create a new branch based on your fork. For example, `git checkout -b fix/my-fix` or ` git checkout -b feat/my-feature`.
3. Run the `yarn check:types && yarn lint && yarn test:shared` command to make sure your code is well formatted
4. Commit changes and push them to your fork
5. Target your pull request to be merged with `develop`

If all [status checks](https://help.github.com/articles/about-status-checks/) pass, and the maintainer approves the PR, it will be merged.

**Note:** Reviewers may ask you to complete additional work, tests, or other changes before your pull request can be approved and merged.
</details>

<br>

<details>
<summary>Code of Conduct :clipboard:</summary>
<br>

This project and everyone participating in it is governed by the [Bloom Code of Conduct](.github/CODE_OF_CONDUCT.md).
