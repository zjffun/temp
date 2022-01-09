/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/


// import * as fs from "fs";
// import * as path from "path";
// import { exec } from "child_process";

// const author = "zhangjufeng";
// const filePath = path.join(__dirname, "statistic.txt");

// const dirs = fs.readdirSync(__dirname);

// dirs.forEach((d) => {
//   try {
//     exec(
//       `git log --shortstat --author="${author}" | grep -E "fil(e|es) changed" | awk '{files+=$1; inserted+=$4; deleted+=$6} END {print "files changed: ", files, "lines inserted: ", inserted, "lines deleted: ", deleted }'`,
//       {
//         shell: "/bin/sh",
//         cwd: path.join(__dirname, d),
//       },
//       (error, stdout, stderr) => {
//         if (error) {
//           console.log(`error: ${error.message}`);
//           return;
//         }
//         if (stderr) {
//           console.log(`stderr: ${stderr}`);
//           return;
//         }
//         if (
//           stdout === "files changed:   lines inserted:   lines deleted:  \n"
//         ) {
//           return;
//         }
//         fs.appendFileSync(filePath, `${d}\n ${stdout}`);
//       }
//     );
//   } catch (e) {
//     // console.error(e);
//   }
// });


export default (author: any, dir: any, cb) => {
	console.log(123)
	// const dirs = fs.readdirSync(dir);

	// dirs.forEach((d: any) => {
	// 	try {
	// 		exec(
	// 			`git log --shortstat --author="${author}" | grep -E "fil(e|es) changed" | awk '{files+=$1; inserted+=$4; deleted+=$6} END {print "files changed: ", files, "lines inserted: ", inserted, "lines deleted: ", deleted }'`,
	// 			{
	// 				shell: "/bin/sh",
	// 				cwd: path.join(dir, d),
	// 			},
	// 			(error: any, stdout: any, stderr: any) => {
	// 				if (error) {
	// 					console.log(`error: ${error.message}`);
	// 					return;
	// 				}
	// 				if (stderr) {
	// 					console.log(`stderr: ${stderr}`);
	// 					return;
	// 				}
	// 				if (
	// 					stdout === "files changed:   lines inserted:   lines deleted:  \n"
	// 				) {
	// 					return;
	// 				}
	// 				console.log(`${d}\n ${stdout}`);
	// 				cb(`${d}\n ${stdout}`)
	// 				// fs.appendFileSync(filePath, `${d}\n ${stdout}`);
	// 			}
	// 		);
	// 	} catch (e) {
	// 		// console.error(e);
	// 	}
	// });

}
