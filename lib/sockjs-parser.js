/*
 * The MIT License (MIT)
 *
 * Copyright (c) 2011-2012 VMware, Inc.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 *
 *     Status API Training Shop Blog About Pricing
 */

// Piece of code picked up and adapted from sockjs-client:
// https://github.com/sockjs/sockjs-client/blob/0b4879d5e0b7f44d9f8accb28759fd965f70ea1f/lib/main.js#L237-L288

exports.parse = function(msg) {
  var self = this
    , type = msg.slice(0, 1)
    , content = msg.slice(1)
    , payload
    ;

  // first check for messages that don't need a payload
  switch (type) {
    case 'o':
      return { type: 'open' };
    case 'h':
      return { type: 'heartbeat' };
  }

  if (content) {
    try {
      payload = JSON.parse(content);
    } catch (e) {
      return;
    }
  }

  if (typeof payload === 'undefined') {
    return;
  }

  switch (type) {
    case 'a':
      return { type: 'message', data: payload };
    case 'm':
      return { type: 'message', data: payload };
    case 'c':
      let [code, message] = payload;
      return { type: 'close', code, message };
    default:
      return;
  }
};
