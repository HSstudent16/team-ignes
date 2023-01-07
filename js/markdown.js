/**
 * MIT License
 *
 * Copyright (c) 2019 Greg Bowler
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
((root, udf) => {
  let output = "", exports;
  const
    BLOCK = "block",
    INLINE = "inline";

    let parseMap = [
      {
        pattern: /(#{1,6})([^\n]+)/g,
        replace: "<h$L1>$2</h$L1>",
        type: BLOCK,
      },
      {
        pattern: /\n(?!<\/?\w+>|\s?\*|\s?[0-9]+|>|\&gt;|-{5,})([^\n]+)/g,
        replace: "<p>$1</p>",
        type: BLOCK,
      },
      {
        pattern: /\n(?:&gt;|\>)\W*(.*)/g,
        replace: "<blockquote><p>$1</p></blockquote>",
        type: BLOCK,
      },
      {
        // xxx HS16 : Combine repeated entries into one list
        pattern: /(\n\s?[*\-+~]\s*(.*))+/g,
        replace: (match) => match.replace(/\n\s?[*\-+~]\s*(.*)/g, "<li>$1</li>"),
        type: BLOCK,
      },
      {
        pattern: /(\n\s?[0-9]+\s*(.*))+/g,
        replace: (match) => match.replace(/\n\s?[0-9]+\s*(.*)/g, "<li>$1</li>"),
        type: BLOCK,
      },
      {
        pattern: /(\*\*|__)(.*?)\1/g,
        replace: "<strong>$2</strong>",
        type: INLINE,
      },
      {
        pattern: /(\*|_)(.*?)\1/g,
        replace: "<em>$2</em>",
        type: INLINE,
      },
      {
        // xxx HS16 : Add target="_blank" to links
        pattern: /([^!])\[([^\[]+)\]\(([^\)]+)\)/g,
        replace: "$1<a href=\"$3\" target=\"_blank\">$2</a>",
        type: INLINE,
      },
      {
        pattern: /!\[([^\[]+)\]\(([^\)]+)\)/g,
        replace: "<img src=\"$2\" alt=\"$1\" />",
        type: INLINE,
      },
      {
        pattern: /\~\~(.*?)\~\~/g,
        replace: "<del>$1</del>",
        type: INLINE,
      },
      {
        pattern: /`((?:[^`]|\\`)*?)`/g,
        replace: "<code>$1</code>",
        type: INLINE,
      },
      // xxx HS16 : Code block
      {
        patern: /\n```\n([^`]|^(?!~~)|\n)*```/g,
        replace: "<pre><code>$1</code></pre>",
        type: BLOCK
      },
      {
        // xxx HS16 : 3 dashes are pretty common
        pattern: /\n-{3,}\n/g,
        replace: "<hr />",
        type: BLOCK,
      }
    ];

  (function go() {
    if(
      typeof module !== "undefined" &&
      typeof module.exports !== "undefined"
    ) {
      exports = module.exports;
    } else if(typeof window !== "undefined") {
      window.MarkdownToHtml = {};
      exports = window.MarkdownToHtml;
    }

    exports.parse = parse;
  })();

  function parse (string) {
    output = "\n" + string + "\n";

    // xxx HS16 : arrow functions cuz they look cool :)
    parseMap.forEach(p => {
      output = output.replace(p.pattern, (...a) => {
        return replace.call(this, a, p.replace, p.type);
      });
    });

    output = clean(output);
    output = output.trim();
    output = output.replace(/[\n]{1,}/g, "\n");
    return output;
  }

  function replace(matchList, replacement, type) {
    let i = 0, l = matchList.length;

    // xxx HS16 : Add support for replacement functions
    if (typeof replacement === "function")
      replacement = replacement(...matchList);

    // xxx HS16 : remove "in" loop on array
    for(; i < l; i++) {
      let match = matchList[i];
      replacement = replacement.split("$" + i).join(match);
      replacement = replacement.split("$L" + i).join(match.length);
    }

    if(type === BLOCK)
      replacement = replacement.trim() + "\n";

    return replacement;
  }

  function clean(string) {
    let cleaningRuleArray = [
      {
        match: /<\/([uo]l)>\s*<\1>/g,
        replacement: "",
      },
      {
        match: /(<\/\w+>)<\/(blockquote)>\s*<\2>/g,
        replacement: "$1",
      }
    ];

    cleaningRuleArray.forEach(rule => {
      string = string.replace(rule.match, rule.replacement);
    });

    return string;
  }

})();