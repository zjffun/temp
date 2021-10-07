/*---------------------------------------------------------------------------------------------
 *  Copyright (c) Microsoft Corporation. All rights reserved.
 *  Licensed under the MIT License. See License.txt in the project root for license information.
 *--------------------------------------------------------------------------------------------*/

import assert = require('assert');
import { DisposableStore } from 'vs/base/common/lifecycle';
import { LanguageAgnosticBracketTokens } from 'vs/editor/common/model/bracketPairColorizer/brackets';
import { SmallImmutableSet, DenseKeyProvider } from 'vs/editor/common/model/bracketPairColorizer/smallImmutableSet';
import { Token, TokenKind } from 'vs/editor/common/model/bracketPairColorizer/tokenizer';
import { LanguageIdentifier } from 'vs/editor/common/modes';
import { LanguageConfigurationRegistry } from 'vs/editor/common/modes/languageConfigurationRegistry';

suite('Bracket Pair Colorizer - Brackets', () => {
	test('Basic', () => {
		const languageId = 3;
		const mode1 = new LanguageIdentifier('testMode1', languageId);
		const denseKeyProvider = new DenseKeyProvider<string>();
		const getImmutableSet = (elements: string[]) => {
			let newSet = SmallImmutableSet.getEmpty();
			elements.forEach(x => newSet = newSet.add(`${languageId}:::${x}`, denseKeyProvider));
			return newSet;
		};
		const getKey = (value: string) => {
			return denseKeyProvider.getKey(`${languageId}:::${value}`);
		};

		const disposableStore = new DisposableStore();
		disposableStore.add(LanguageConfigurationRegistry.register(mode1, {
			brackets: [
				['{', '}'], ['[', ']'], ['(', ')'],
				['begin', 'end'], ['case', 'endcase'], ['casez', 'endcase'],					// Verilog
				['\\left(', '\\right)'], ['\\left(', '\\right.'], ['\\left.', '\\right)'],		// LaTeX Parentheses
				['\\left[', '\\right]'], ['\\left[', '\\right.'], ['\\left.', '\\right]']		// LaTeX Brackets
			]
		}));

		const brackets = new LanguageAgnosticBracketTokens(denseKeyProvider);
		const bracketsExpected = [
			{ text: '{', length: 1, kind: 'OpeningBracket', bracketId: getKey('{'), bracketIds: getImmutableSet(['{']) },
			{ text: '[', length: 1, kind: 'OpeningBracket', bracketId: getKey('['), bracketIds: getImmutableSet(['[']) },
			{ text: '(', length: 1, kind: 'OpeningBracket', bracketId: getKey('('), bracketIds: getImmutableSet(['(']) },
			{ text: 'begin', length: 5, kind: 'OpeningBracket', bracketId: getKey('begin'), bracketIds: getImmutableSet(['begin']) },
			{ text: 'case', length: 4, kind: 'OpeningBracket', bracketId: getKey('case'), bracketIds: getImmutableSet(['case']) },
			{ text: 'casez', length: 5, kind: 'OpeningBracket', bracketId: getKey('casez'), bracketIds: getImmutableSet(['casez']) },
			{ text: '\\left(', length: 6, kind: 'OpeningBracket', bracketId: getKey('\\left('), bracketIds: getImmutableSet(['\\left(']) },
			{ text: '\\left.', length: 6, kind: 'OpeningBracket', bracketId: getKey('\\left.'), bracketIds: getImmutableSet(['\\left.']) },
			{ text: '\\left[', length: 6, kind: 'OpeningBracket', bracketId: getKey('\\left['), bracketIds: getImmutableSet(['\\left[']) },

			{ text: '}', length: 1, kind: 'ClosingBracket', bracketId: getKey('{'), bracketIds: getImmutableSet(['{']) },
			{ text: ']', length: 1, kind: 'ClosingBracket', bracketId: getKey('['), bracketIds: getImmutableSet(['[']) },
			{ text: ')', length: 1, kind: 'ClosingBracket', bracketId: getKey('('), bracketIds: getImmutableSet(['(']) },
			{ text: 'end', length: 3, kind: 'ClosingBracket', bracketId: getKey('begin'), bracketIds: getImmutableSet(['begin']) },
			{ text: 'endcase', length: 7, kind: 'ClosingBracket', bracketId: getKey('case'), bracketIds: getImmutableSet(['case', 'casez']) },
			{ text: '\\right)', length: 7, kind: 'ClosingBracket', bracketId: getKey('\\left('), bracketIds: getImmutableSet(['\\left(', '\\left.']) },
			{ text: '\\right.', length: 7, kind: 'ClosingBracket', bracketId: getKey('\\left('), bracketIds: getImmutableSet(['\\left(', '\\left[']) },
			{ text: '\\right]', length: 7, kind: 'ClosingBracket', bracketId: getKey('\\left['), bracketIds: getImmutableSet(['\\left[', '\\left.']) }
		];
		const bracketsActual = bracketsExpected.map(x => tokenToObject(brackets.getToken(x.text, 3), x.text));

		assert.deepStrictEqual(bracketsActual, bracketsExpected);

		disposableStore.dispose();
	});
});

function tokenToObject(token: Token | undefined, text: string): any {
	if (token === undefined) {
		return undefined;
	}
	return {
		text: text,
		length: token.length,
		bracketId: token.bracketId,
		bracketIds: token.bracketIds,
		kind: {
			[TokenKind.ClosingBracket]: 'ClosingBracket',
			[TokenKind.OpeningBracket]: 'OpeningBracket',
			[TokenKind.Text]: 'Text',
		}[token.kind],
	};
}
