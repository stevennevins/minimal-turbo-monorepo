import { actions } from "@wagmi/cli/plugins"
import fs from "fs"
import path from "path"

const abiDirectory = "../contracts/out"

interface Abi {
	name: string;
	abi: object;
}

const getAbis = (dir: string): Abi[] => {
	const subDirs = fs.readdirSync(dir).filter(subDir => fs.statSync(path.join(dir, subDir)).isDirectory());
	let abis: Abi[] = [];

	subDirs.forEach(subDir => {
		const subDirPath = path.join(dir, subDir);
		const files = fs.readdirSync(subDirPath).filter(file => file.endsWith(".json"));
		files.forEach(file => {
			const name = path.basename(file, ".json");
			const abiPath = path.join(subDirPath, file);
			const abiContent = JSON.parse(fs.readFileSync(abiPath, 'utf-8'));
			abis.push({ name, abi: abiContent.abi });
		});
	});

	return abis;
}

// @ts-check
/** @type {import('@wagmi/cli').Config} */
export default {
	out: "dist/generated.js",
	contracts: getAbis(abiDirectory),
	plugins: [
		actions()
	],
};