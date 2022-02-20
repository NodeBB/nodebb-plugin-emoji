/* eslint-disable */

define('leven', function () {
	/*
	The MIT License (MIT)

	Copyright (c) Sindre Sorhus <sindresorhus@gmail.com> (sindresorhus.com)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in
	all copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
	THE SOFTWARE.
	*/

	'use strict';

	var arr = [];
	var charCodeCache = [];

	return function (a, b) {
	  if (a === b) {
		return 0;
	  }

	  var swap = a;

	  // Swapping the strings if `a` is longer than `b` so we know which one is the
	  // shortest & which one is the longest
	  if (a.length > b.length) {
		a = b;
		b = swap;
	  }

	  var aLen = a.length;
	  var bLen = b.length;

	  // Performing suffix trimming:
	  // We can linearly drop suffix common to both strings since they
	  // don't increase distance at all
	  // Note: `~-` is the bitwise way to perform a `- 1` operation
	  while (aLen > 0 && (a.charCodeAt(~-aLen) === b.charCodeAt(~-bLen))) {
		aLen--;
		bLen--;
	  }

	  // Performing prefix trimming
	  // We can linearly drop prefix common to both strings since they
	  // don't increase distance at all
	  var start = 0;

	  while (start < aLen && (a.charCodeAt(start) === b.charCodeAt(start))) {
		start++;
	  }

	  aLen -= start;
	  bLen -= start;

	  if (aLen === 0) {
		return bLen;
	  }

	  var bCharCode;
	  var ret;
	  var tmp;
	  var tmp2;
	  var i = 0;
	  var j = 0;

	  while (i < aLen) {
		charCodeCache[i] = a.charCodeAt(start + i);
		arr[i] = ++i;
	  }

	  while (j < bLen) {
		bCharCode = b.charCodeAt(start + j);
		tmp = j++;
		ret = j;

		for (i = 0; i < aLen; i++) {
		  tmp2 = bCharCode === charCodeCache[i] ? tmp : tmp + 1;
		  tmp = arr[i];
		  ret = arr[i] = tmp > ret ? tmp2 > ret ? ret + 1 : tmp2 : tmp2 > tmp ? tmp + 1 : tmp2;
		}
	  }

	  return ret;
	};
  });