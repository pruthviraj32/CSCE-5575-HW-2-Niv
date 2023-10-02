#!/bin/bash

function doesExist() {
	if ! command -v $1 > /dev/null; then
		printf "\e[31;1m $1 is not installed. Please install it before continuing.\n\n\e[0m"
		exit 1
	fi
}

doesExist curl
doesExist git
doesExist forge
doesExist cast
doesExist node
doesExist pnpm

printf "\e[32m All the necessary tools are installed.\n\n\e[0m "

mkdir -p chain-end
mkdir -p front-end
cd chain-end
forge init . --no-commit
forge install OpenZeppelin/openzeppelin-contracts --no-commit
rm -rf test
cd ..
cp foundry.toml remappings.txt chain-end
cd front-end
pnpm install

printf "\n\e[32m pnpm start to start the react server.\n Run the helper functions from the 'front-end' directory.\n For a list of the helper functions, check out the GitHub repository.\n\n\e[0m"

