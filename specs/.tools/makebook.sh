#!/usr/bin/env bash

# /* SPDX-License-Identifier: (Apache-2.0) */
# /* Original: https://github.com/rust-lang/rfcs/blob/85c95c7179acc8986eae709f773ff3a91f1e2e43/generate-book.sh */

# todo: make this appropriate for the spec process, and transform to a GH Action

set -e

if [ ! -d src ]; then
    mkdir src
fi

printf '[Introduction](introduction.md)\n\n' > src/SUMMARY.md

find ./text ! -type d -print0 | xargs -0 -I {} ln -frs {} -t src/

find ./text ! -type d -name '*.md' -print0 \
  | sort -z \
  | while read -r -d '' file;
do
    printf -- '- [%s](%s)\n' "$(basename "$file" ".md")" "$(basename "$file")"
done >> src/SUMMARY.md

ln -frs README.md src/introduction.md

mdbook build
