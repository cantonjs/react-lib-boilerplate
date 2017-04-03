
const fs = require('fs');
const path = require('path');
const childProcess = require('child_process');
const readline = require('readline');
const os = require('os');
const pkg = require('./package.json');

const rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
});

const answers = {};

const ask = (question, key) => new Promise((resolve) => {
	const defaults = pkg[key];
	rl.question(`${question} (default: ${defaults})\n`, (answer) => {
		answers[key] = answer || defaults;
		resolve();
	});
});

ask('What is your project name?', 'name')
	.then(() => ask('What is description?', 'description'))
	.then(() => ask('What is repository?', 'repository'))
	.then(() => ask('Who is the author?', 'author'))
	.then(() => {
		rl.close();
		console.log(JSON.stringify(answers, null, 2));
		Object.assign(pkg, answers);

		const pkgFile = path.resolve(__dirname, 'package.json');
		const newPkg = JSON.stringify(pkg, null, 2);
		// console.log('\npackage.json:\n', newPkg);
		fs.writeFileSync(pkgFile, newPkg, 'utf8');

		const isWindows = /^win32/.test(os.platform());
		const rimrafCommand = isWindows ? 'rd /s /q' : 'rm -rf';
		const gitDir = path.resolve(__dirname, '.git');
		// console.log(`${rimrafCommand} ${gitDir}`);
		childProcess.exec(`${rimrafCommand} ${gitDir}`);

		console.log('Success.\n');
		console.log('To install dependencies, please run `yarn` manually.\n');

		fs.unlinkSync(__filename);
	})
	.catch((err) => { throw err; })
;
