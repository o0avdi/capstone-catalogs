var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// ../node_modules/jmespath/jmespath.js
var require_jmespath = __commonJS({
  "../node_modules/jmespath/jmespath.js"(exports) {
    "use strict";
    (function(exports2) {
      "use strict";
      function isArray(obj) {
        if (obj !== null) {
          return Object.prototype.toString.call(obj) === "[object Array]";
        } else {
          return false;
        }
      }
      function isObject2(obj) {
        if (obj !== null) {
          return Object.prototype.toString.call(obj) === "[object Object]";
        } else {
          return false;
        }
      }
      function strictDeepEqual(first, second) {
        if (first === second) {
          return true;
        }
        var firstType = Object.prototype.toString.call(first);
        if (firstType !== Object.prototype.toString.call(second)) {
          return false;
        }
        if (isArray(first) === true) {
          if (first.length !== second.length) {
            return false;
          }
          for (var i = 0; i < first.length; i++) {
            if (strictDeepEqual(first[i], second[i]) === false) {
              return false;
            }
          }
          return true;
        }
        if (isObject2(first) === true) {
          var keysSeen = {};
          for (var key in first) {
            if (hasOwnProperty.call(first, key)) {
              if (strictDeepEqual(first[key], second[key]) === false) {
                return false;
              }
              keysSeen[key] = true;
            }
          }
          for (var key2 in second) {
            if (hasOwnProperty.call(second, key2)) {
              if (keysSeen[key2] !== true) {
                return false;
              }
            }
          }
          return true;
        }
        return false;
      }
      function isFalse(obj) {
        if (obj === "" || obj === false || obj === null) {
          return true;
        } else if (isArray(obj) && obj.length === 0) {
          return true;
        } else if (isObject2(obj)) {
          for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
              return false;
            }
          }
          return true;
        } else {
          return false;
        }
      }
      function objValues(obj) {
        var keys = Object.keys(obj);
        var values = [];
        for (var i = 0; i < keys.length; i++) {
          values.push(obj[keys[i]]);
        }
        return values;
      }
      function merge2(a, b) {
        var merged = {};
        for (var key in a) {
          merged[key] = a[key];
        }
        for (var key2 in b) {
          merged[key2] = b[key2];
        }
        return merged;
      }
      var trimLeft;
      if (typeof String.prototype.trimLeft === "function") {
        trimLeft = function(str) {
          return str.trimLeft();
        };
      } else {
        trimLeft = function(str) {
          return str.match(/^\s*(.*)/)[1];
        };
      }
      var TYPE_NUMBER = 0;
      var TYPE_ANY = 1;
      var TYPE_STRING = 2;
      var TYPE_ARRAY = 3;
      var TYPE_OBJECT = 4;
      var TYPE_BOOLEAN = 5;
      var TYPE_EXPREF = 6;
      var TYPE_NULL = 7;
      var TYPE_ARRAY_NUMBER = 8;
      var TYPE_ARRAY_STRING = 9;
      var TYPE_NAME_TABLE = {
        0: "number",
        1: "any",
        2: "string",
        3: "array",
        4: "object",
        5: "boolean",
        6: "expression",
        7: "null",
        8: "Array<number>",
        9: "Array<string>"
      };
      var TOK_EOF = "EOF";
      var TOK_UNQUOTEDIDENTIFIER = "UnquotedIdentifier";
      var TOK_QUOTEDIDENTIFIER = "QuotedIdentifier";
      var TOK_RBRACKET = "Rbracket";
      var TOK_RPAREN = "Rparen";
      var TOK_COMMA = "Comma";
      var TOK_COLON = "Colon";
      var TOK_RBRACE = "Rbrace";
      var TOK_NUMBER = "Number";
      var TOK_CURRENT = "Current";
      var TOK_EXPREF = "Expref";
      var TOK_PIPE = "Pipe";
      var TOK_OR = "Or";
      var TOK_AND = "And";
      var TOK_EQ = "EQ";
      var TOK_GT = "GT";
      var TOK_LT = "LT";
      var TOK_GTE = "GTE";
      var TOK_LTE = "LTE";
      var TOK_NE = "NE";
      var TOK_FLATTEN = "Flatten";
      var TOK_STAR = "Star";
      var TOK_FILTER = "Filter";
      var TOK_DOT = "Dot";
      var TOK_NOT = "Not";
      var TOK_LBRACE = "Lbrace";
      var TOK_LBRACKET = "Lbracket";
      var TOK_LPAREN = "Lparen";
      var TOK_LITERAL = "Literal";
      var basicTokens = {
        ".": TOK_DOT,
        "*": TOK_STAR,
        ",": TOK_COMMA,
        ":": TOK_COLON,
        "{": TOK_LBRACE,
        "}": TOK_RBRACE,
        "]": TOK_RBRACKET,
        "(": TOK_LPAREN,
        ")": TOK_RPAREN,
        "@": TOK_CURRENT
      };
      var operatorStartToken = {
        "<": true,
        ">": true,
        "=": true,
        "!": true
      };
      var skipChars = {
        " ": true,
        "	": true,
        "\n": true
      };
      function isAlpha(ch) {
        return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch === "_";
      }
      function isNum(ch) {
        return ch >= "0" && ch <= "9" || ch === "-";
      }
      function isAlphaNum(ch) {
        return ch >= "a" && ch <= "z" || ch >= "A" && ch <= "Z" || ch >= "0" && ch <= "9" || ch === "_";
      }
      function Lexer() {
      }
      Lexer.prototype = {
        tokenize: function(stream) {
          var tokens = [];
          this._current = 0;
          var start;
          var identifier;
          var token;
          while (this._current < stream.length) {
            if (isAlpha(stream[this._current])) {
              start = this._current;
              identifier = this._consumeUnquotedIdentifier(stream);
              tokens.push({
                type: TOK_UNQUOTEDIDENTIFIER,
                value: identifier,
                start
              });
            } else if (basicTokens[stream[this._current]] !== void 0) {
              tokens.push({
                type: basicTokens[stream[this._current]],
                value: stream[this._current],
                start: this._current
              });
              this._current++;
            } else if (isNum(stream[this._current])) {
              token = this._consumeNumber(stream);
              tokens.push(token);
            } else if (stream[this._current] === "[") {
              token = this._consumeLBracket(stream);
              tokens.push(token);
            } else if (stream[this._current] === '"') {
              start = this._current;
              identifier = this._consumeQuotedIdentifier(stream);
              tokens.push({
                type: TOK_QUOTEDIDENTIFIER,
                value: identifier,
                start
              });
            } else if (stream[this._current] === "'") {
              start = this._current;
              identifier = this._consumeRawStringLiteral(stream);
              tokens.push({
                type: TOK_LITERAL,
                value: identifier,
                start
              });
            } else if (stream[this._current] === "`") {
              start = this._current;
              var literal2 = this._consumeLiteral(stream);
              tokens.push({
                type: TOK_LITERAL,
                value: literal2,
                start
              });
            } else if (operatorStartToken[stream[this._current]] !== void 0) {
              tokens.push(this._consumeOperator(stream));
            } else if (skipChars[stream[this._current]] !== void 0) {
              this._current++;
            } else if (stream[this._current] === "&") {
              start = this._current;
              this._current++;
              if (stream[this._current] === "&") {
                this._current++;
                tokens.push({ type: TOK_AND, value: "&&", start });
              } else {
                tokens.push({ type: TOK_EXPREF, value: "&", start });
              }
            } else if (stream[this._current] === "|") {
              start = this._current;
              this._current++;
              if (stream[this._current] === "|") {
                this._current++;
                tokens.push({ type: TOK_OR, value: "||", start });
              } else {
                tokens.push({ type: TOK_PIPE, value: "|", start });
              }
            } else {
              var error2 = new Error("Unknown character:" + stream[this._current]);
              error2.name = "LexerError";
              throw error2;
            }
          }
          return tokens;
        },
        _consumeUnquotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          while (this._current < stream.length && isAlphaNum(stream[this._current])) {
            this._current++;
          }
          return stream.slice(start, this._current);
        },
        _consumeQuotedIdentifier: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== '"' && this._current < maxLength) {
            var current = this._current;
            if (stream[current] === "\\" && (stream[current + 1] === "\\" || stream[current + 1] === '"')) {
              current += 2;
            } else {
              current++;
            }
            this._current = current;
          }
          this._current++;
          return JSON.parse(stream.slice(start, this._current));
        },
        _consumeRawStringLiteral: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (stream[this._current] !== "'" && this._current < maxLength) {
            var current = this._current;
            if (stream[current] === "\\" && (stream[current + 1] === "\\" || stream[current + 1] === "'")) {
              current += 2;
            } else {
              current++;
            }
            this._current = current;
          }
          this._current++;
          var literal2 = stream.slice(start + 1, this._current - 1);
          return literal2.replace("\\'", "'");
        },
        _consumeNumber: function(stream) {
          var start = this._current;
          this._current++;
          var maxLength = stream.length;
          while (isNum(stream[this._current]) && this._current < maxLength) {
            this._current++;
          }
          var value = parseInt(stream.slice(start, this._current));
          return { type: TOK_NUMBER, value, start };
        },
        _consumeLBracket: function(stream) {
          var start = this._current;
          this._current++;
          if (stream[this._current] === "?") {
            this._current++;
            return { type: TOK_FILTER, value: "[?", start };
          } else if (stream[this._current] === "]") {
            this._current++;
            return { type: TOK_FLATTEN, value: "[]", start };
          } else {
            return { type: TOK_LBRACKET, value: "[", start };
          }
        },
        _consumeOperator: function(stream) {
          var start = this._current;
          var startingChar = stream[start];
          this._current++;
          if (startingChar === "!") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_NE, value: "!=", start };
            } else {
              return { type: TOK_NOT, value: "!", start };
            }
          } else if (startingChar === "<") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_LTE, value: "<=", start };
            } else {
              return { type: TOK_LT, value: "<", start };
            }
          } else if (startingChar === ">") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_GTE, value: ">=", start };
            } else {
              return { type: TOK_GT, value: ">", start };
            }
          } else if (startingChar === "=") {
            if (stream[this._current] === "=") {
              this._current++;
              return { type: TOK_EQ, value: "==", start };
            }
          }
        },
        _consumeLiteral: function(stream) {
          this._current++;
          var start = this._current;
          var maxLength = stream.length;
          var literal2;
          while (stream[this._current] !== "`" && this._current < maxLength) {
            var current = this._current;
            if (stream[current] === "\\" && (stream[current + 1] === "\\" || stream[current + 1] === "`")) {
              current += 2;
            } else {
              current++;
            }
            this._current = current;
          }
          var literalString = trimLeft(stream.slice(start, this._current));
          literalString = literalString.replace("\\`", "`");
          if (this._looksLikeJSON(literalString)) {
            literal2 = JSON.parse(literalString);
          } else {
            literal2 = JSON.parse('"' + literalString + '"');
          }
          this._current++;
          return literal2;
        },
        _looksLikeJSON: function(literalString) {
          var startingChars = '[{"';
          var jsonLiterals = ["true", "false", "null"];
          var numberLooking = "-0123456789";
          if (literalString === "") {
            return false;
          } else if (startingChars.indexOf(literalString[0]) >= 0) {
            return true;
          } else if (jsonLiterals.indexOf(literalString) >= 0) {
            return true;
          } else if (numberLooking.indexOf(literalString[0]) >= 0) {
            try {
              JSON.parse(literalString);
              return true;
            } catch (ex) {
              return false;
            }
          } else {
            return false;
          }
        }
      };
      var bindingPower = {};
      bindingPower[TOK_EOF] = 0;
      bindingPower[TOK_UNQUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_QUOTEDIDENTIFIER] = 0;
      bindingPower[TOK_RBRACKET] = 0;
      bindingPower[TOK_RPAREN] = 0;
      bindingPower[TOK_COMMA] = 0;
      bindingPower[TOK_RBRACE] = 0;
      bindingPower[TOK_NUMBER] = 0;
      bindingPower[TOK_CURRENT] = 0;
      bindingPower[TOK_EXPREF] = 0;
      bindingPower[TOK_PIPE] = 1;
      bindingPower[TOK_OR] = 2;
      bindingPower[TOK_AND] = 3;
      bindingPower[TOK_EQ] = 5;
      bindingPower[TOK_GT] = 5;
      bindingPower[TOK_LT] = 5;
      bindingPower[TOK_GTE] = 5;
      bindingPower[TOK_LTE] = 5;
      bindingPower[TOK_NE] = 5;
      bindingPower[TOK_FLATTEN] = 9;
      bindingPower[TOK_STAR] = 20;
      bindingPower[TOK_FILTER] = 21;
      bindingPower[TOK_DOT] = 40;
      bindingPower[TOK_NOT] = 45;
      bindingPower[TOK_LBRACE] = 50;
      bindingPower[TOK_LBRACKET] = 55;
      bindingPower[TOK_LPAREN] = 60;
      function Parser3() {
      }
      Parser3.prototype = {
        parse: function(expression) {
          this._loadTokens(expression);
          this.index = 0;
          var ast = this.expression(0);
          if (this._lookahead(0) !== TOK_EOF) {
            var t = this._lookaheadToken(0);
            var error2 = new Error(
              "Unexpected token type: " + t.type + ", value: " + t.value
            );
            error2.name = "ParserError";
            throw error2;
          }
          return ast;
        },
        _loadTokens: function(expression) {
          var lexer = new Lexer();
          var tokens = lexer.tokenize(expression);
          tokens.push({ type: TOK_EOF, value: "", start: expression.length });
          this.tokens = tokens;
        },
        expression: function(rbp) {
          var leftToken = this._lookaheadToken(0);
          this._advance();
          var left = this.nud(leftToken);
          var currentToken = this._lookahead(0);
          while (rbp < bindingPower[currentToken]) {
            this._advance();
            left = this.led(currentToken, left);
            currentToken = this._lookahead(0);
          }
          return left;
        },
        _lookahead: function(number3) {
          return this.tokens[this.index + number3].type;
        },
        _lookaheadToken: function(number3) {
          return this.tokens[this.index + number3];
        },
        _advance: function() {
          this.index++;
        },
        nud: function(token) {
          var left;
          var right;
          var expression;
          switch (token.type) {
            case TOK_LITERAL:
              return { type: "Literal", value: token.value };
            case TOK_UNQUOTEDIDENTIFIER:
              return { type: "Field", name: token.value };
            case TOK_QUOTEDIDENTIFIER:
              var node2 = { type: "Field", name: token.value };
              if (this._lookahead(0) === TOK_LPAREN) {
                throw new Error("Quoted identifier not allowed for function names.");
              }
              return node2;
            case TOK_NOT:
              right = this.expression(bindingPower.Not);
              return { type: "NotExpression", children: [right] };
            case TOK_STAR:
              left = { type: "Identity" };
              right = null;
              if (this._lookahead(0) === TOK_RBRACKET) {
                right = { type: "Identity" };
              } else {
                right = this._parseProjectionRHS(bindingPower.Star);
              }
              return { type: "ValueProjection", children: [left, right] };
            case TOK_FILTER:
              return this.led(token.type, { type: "Identity" });
            case TOK_LBRACE:
              return this._parseMultiselectHash();
            case TOK_FLATTEN:
              left = { type: TOK_FLATTEN, children: [{ type: "Identity" }] };
              right = this._parseProjectionRHS(bindingPower.Flatten);
              return { type: "Projection", children: [left, right] };
            case TOK_LBRACKET:
              if (this._lookahead(0) === TOK_NUMBER || this._lookahead(0) === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice({ type: "Identity" }, right);
              } else if (this._lookahead(0) === TOK_STAR && this._lookahead(1) === TOK_RBRACKET) {
                this._advance();
                this._advance();
                right = this._parseProjectionRHS(bindingPower.Star);
                return {
                  type: "Projection",
                  children: [{ type: "Identity" }, right]
                };
              }
              return this._parseMultiselectList();
            case TOK_CURRENT:
              return { type: TOK_CURRENT };
            case TOK_EXPREF:
              expression = this.expression(bindingPower.Expref);
              return { type: "ExpressionReference", children: [expression] };
            case TOK_LPAREN:
              var args = [];
              while (this._lookahead(0) !== TOK_RPAREN) {
                if (this._lookahead(0) === TOK_CURRENT) {
                  expression = { type: TOK_CURRENT };
                  this._advance();
                } else {
                  expression = this.expression(0);
                }
                args.push(expression);
              }
              this._match(TOK_RPAREN);
              return args[0];
            default:
              this._errorToken(token);
          }
        },
        led: function(tokenName, left) {
          var right;
          switch (tokenName) {
            case TOK_DOT:
              var rbp = bindingPower.Dot;
              if (this._lookahead(0) !== TOK_STAR) {
                right = this._parseDotRHS(rbp);
                return { type: "Subexpression", children: [left, right] };
              }
              this._advance();
              right = this._parseProjectionRHS(rbp);
              return { type: "ValueProjection", children: [left, right] };
            case TOK_PIPE:
              right = this.expression(bindingPower.Pipe);
              return { type: TOK_PIPE, children: [left, right] };
            case TOK_OR:
              right = this.expression(bindingPower.Or);
              return { type: "OrExpression", children: [left, right] };
            case TOK_AND:
              right = this.expression(bindingPower.And);
              return { type: "AndExpression", children: [left, right] };
            case TOK_LPAREN:
              var name = left.name;
              var args = [];
              var expression, node2;
              while (this._lookahead(0) !== TOK_RPAREN) {
                if (this._lookahead(0) === TOK_CURRENT) {
                  expression = { type: TOK_CURRENT };
                  this._advance();
                } else {
                  expression = this.expression(0);
                }
                if (this._lookahead(0) === TOK_COMMA) {
                  this._match(TOK_COMMA);
                }
                args.push(expression);
              }
              this._match(TOK_RPAREN);
              node2 = { type: "Function", name, children: args };
              return node2;
            case TOK_FILTER:
              var condition = this.expression(0);
              this._match(TOK_RBRACKET);
              if (this._lookahead(0) === TOK_FLATTEN) {
                right = { type: "Identity" };
              } else {
                right = this._parseProjectionRHS(bindingPower.Filter);
              }
              return { type: "FilterProjection", children: [left, right, condition] };
            case TOK_FLATTEN:
              var leftNode = { type: TOK_FLATTEN, children: [left] };
              var rightNode = this._parseProjectionRHS(bindingPower.Flatten);
              return { type: "Projection", children: [leftNode, rightNode] };
            case TOK_EQ:
            case TOK_NE:
            case TOK_GT:
            case TOK_GTE:
            case TOK_LT:
            case TOK_LTE:
              return this._parseComparator(left, tokenName);
            case TOK_LBRACKET:
              var token = this._lookaheadToken(0);
              if (token.type === TOK_NUMBER || token.type === TOK_COLON) {
                right = this._parseIndexExpression();
                return this._projectIfSlice(left, right);
              }
              this._match(TOK_STAR);
              this._match(TOK_RBRACKET);
              right = this._parseProjectionRHS(bindingPower.Star);
              return { type: "Projection", children: [left, right] };
            default:
              this._errorToken(this._lookaheadToken(0));
          }
        },
        _match: function(tokenType) {
          if (this._lookahead(0) === tokenType) {
            this._advance();
          } else {
            var t = this._lookaheadToken(0);
            var error2 = new Error("Expected " + tokenType + ", got: " + t.type);
            error2.name = "ParserError";
            throw error2;
          }
        },
        _errorToken: function(token) {
          var error2 = new Error("Invalid token (" + token.type + '): "' + token.value + '"');
          error2.name = "ParserError";
          throw error2;
        },
        _parseIndexExpression: function() {
          if (this._lookahead(0) === TOK_COLON || this._lookahead(1) === TOK_COLON) {
            return this._parseSliceExpression();
          } else {
            var node2 = {
              type: "Index",
              value: this._lookaheadToken(0).value
            };
            this._advance();
            this._match(TOK_RBRACKET);
            return node2;
          }
        },
        _projectIfSlice: function(left, right) {
          var indexExpr = { type: "IndexExpression", children: [left, right] };
          if (right.type === "Slice") {
            return {
              type: "Projection",
              children: [indexExpr, this._parseProjectionRHS(bindingPower.Star)]
            };
          } else {
            return indexExpr;
          }
        },
        _parseSliceExpression: function() {
          var parts = [null, null, null];
          var index = 0;
          var currentToken = this._lookahead(0);
          while (currentToken !== TOK_RBRACKET && index < 3) {
            if (currentToken === TOK_COLON) {
              index++;
              this._advance();
            } else if (currentToken === TOK_NUMBER) {
              parts[index] = this._lookaheadToken(0).value;
              this._advance();
            } else {
              var t = this._lookahead(0);
              var error2 = new Error("Syntax error, unexpected token: " + t.value + "(" + t.type + ")");
              error2.name = "Parsererror";
              throw error2;
            }
            currentToken = this._lookahead(0);
          }
          this._match(TOK_RBRACKET);
          return {
            type: "Slice",
            children: parts
          };
        },
        _parseComparator: function(left, comparator) {
          var right = this.expression(bindingPower[comparator]);
          return { type: "Comparator", name: comparator, children: [left, right] };
        },
        _parseDotRHS: function(rbp) {
          var lookahead = this._lookahead(0);
          var exprTokens = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER, TOK_STAR];
          if (exprTokens.indexOf(lookahead) >= 0) {
            return this.expression(rbp);
          } else if (lookahead === TOK_LBRACKET) {
            this._match(TOK_LBRACKET);
            return this._parseMultiselectList();
          } else if (lookahead === TOK_LBRACE) {
            this._match(TOK_LBRACE);
            return this._parseMultiselectHash();
          }
        },
        _parseProjectionRHS: function(rbp) {
          var right;
          if (bindingPower[this._lookahead(0)] < 10) {
            right = { type: "Identity" };
          } else if (this._lookahead(0) === TOK_LBRACKET) {
            right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_FILTER) {
            right = this.expression(rbp);
          } else if (this._lookahead(0) === TOK_DOT) {
            this._match(TOK_DOT);
            right = this._parseDotRHS(rbp);
          } else {
            var t = this._lookaheadToken(0);
            var error2 = new Error("Sytanx error, unexpected token: " + t.value + "(" + t.type + ")");
            error2.name = "ParserError";
            throw error2;
          }
          return right;
        },
        _parseMultiselectList: function() {
          var expressions = [];
          while (this._lookahead(0) !== TOK_RBRACKET) {
            var expression = this.expression(0);
            expressions.push(expression);
            if (this._lookahead(0) === TOK_COMMA) {
              this._match(TOK_COMMA);
              if (this._lookahead(0) === TOK_RBRACKET) {
                throw new Error("Unexpected token Rbracket");
              }
            }
          }
          this._match(TOK_RBRACKET);
          return { type: "MultiSelectList", children: expressions };
        },
        _parseMultiselectHash: function() {
          var pairs = [];
          var identifierTypes = [TOK_UNQUOTEDIDENTIFIER, TOK_QUOTEDIDENTIFIER];
          var keyToken, keyName, value, node2;
          for (; ; ) {
            keyToken = this._lookaheadToken(0);
            if (identifierTypes.indexOf(keyToken.type) < 0) {
              throw new Error("Expecting an identifier token, got: " + keyToken.type);
            }
            keyName = keyToken.value;
            this._advance();
            this._match(TOK_COLON);
            value = this.expression(0);
            node2 = { type: "KeyValuePair", name: keyName, value };
            pairs.push(node2);
            if (this._lookahead(0) === TOK_COMMA) {
              this._match(TOK_COMMA);
            } else if (this._lookahead(0) === TOK_RBRACE) {
              this._match(TOK_RBRACE);
              break;
            }
          }
          return { type: "MultiSelectHash", children: pairs };
        }
      };
      function TreeInterpreter(runtime) {
        this.runtime = runtime;
      }
      TreeInterpreter.prototype = {
        search: function(node2, value) {
          return this.visit(node2, value);
        },
        visit: function(node2, value) {
          var matched, current, result, first, second, field, left, right, collected, i;
          switch (node2.type) {
            case "Field":
              if (value !== null && isObject2(value)) {
                field = value[node2.name];
                if (field === void 0) {
                  return null;
                } else {
                  return field;
                }
              }
              return null;
            case "Subexpression":
              result = this.visit(node2.children[0], value);
              for (i = 1; i < node2.children.length; i++) {
                result = this.visit(node2.children[1], result);
                if (result === null) {
                  return null;
                }
              }
              return result;
            case "IndexExpression":
              left = this.visit(node2.children[0], value);
              right = this.visit(node2.children[1], left);
              return right;
            case "Index":
              if (!isArray(value)) {
                return null;
              }
              var index = node2.value;
              if (index < 0) {
                index = value.length + index;
              }
              result = value[index];
              if (result === void 0) {
                result = null;
              }
              return result;
            case "Slice":
              if (!isArray(value)) {
                return null;
              }
              var sliceParams = node2.children.slice(0);
              var computed = this.computeSliceParams(value.length, sliceParams);
              var start = computed[0];
              var stop = computed[1];
              var step = computed[2];
              result = [];
              if (step > 0) {
                for (i = start; i < stop; i += step) {
                  result.push(value[i]);
                }
              } else {
                for (i = start; i > stop; i += step) {
                  result.push(value[i]);
                }
              }
              return result;
            case "Projection":
              var base = this.visit(node2.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              collected = [];
              for (i = 0; i < base.length; i++) {
                current = this.visit(node2.children[1], base[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "ValueProjection":
              base = this.visit(node2.children[0], value);
              if (!isObject2(base)) {
                return null;
              }
              collected = [];
              var values = objValues(base);
              for (i = 0; i < values.length; i++) {
                current = this.visit(node2.children[1], values[i]);
                if (current !== null) {
                  collected.push(current);
                }
              }
              return collected;
            case "FilterProjection":
              base = this.visit(node2.children[0], value);
              if (!isArray(base)) {
                return null;
              }
              var filtered = [];
              var finalResults = [];
              for (i = 0; i < base.length; i++) {
                matched = this.visit(node2.children[2], base[i]);
                if (!isFalse(matched)) {
                  filtered.push(base[i]);
                }
              }
              for (var j = 0; j < filtered.length; j++) {
                current = this.visit(node2.children[1], filtered[j]);
                if (current !== null) {
                  finalResults.push(current);
                }
              }
              return finalResults;
            case "Comparator":
              first = this.visit(node2.children[0], value);
              second = this.visit(node2.children[1], value);
              switch (node2.name) {
                case TOK_EQ:
                  result = strictDeepEqual(first, second);
                  break;
                case TOK_NE:
                  result = !strictDeepEqual(first, second);
                  break;
                case TOK_GT:
                  result = first > second;
                  break;
                case TOK_GTE:
                  result = first >= second;
                  break;
                case TOK_LT:
                  result = first < second;
                  break;
                case TOK_LTE:
                  result = first <= second;
                  break;
                default:
                  throw new Error("Unknown comparator: " + node2.name);
              }
              return result;
            case TOK_FLATTEN:
              var original = this.visit(node2.children[0], value);
              if (!isArray(original)) {
                return null;
              }
              var merged = [];
              for (i = 0; i < original.length; i++) {
                current = original[i];
                if (isArray(current)) {
                  merged.push.apply(merged, current);
                } else {
                  merged.push(current);
                }
              }
              return merged;
            case "Identity":
              return value;
            case "MultiSelectList":
              if (value === null) {
                return null;
              }
              collected = [];
              for (i = 0; i < node2.children.length; i++) {
                collected.push(this.visit(node2.children[i], value));
              }
              return collected;
            case "MultiSelectHash":
              if (value === null) {
                return null;
              }
              collected = {};
              var child;
              for (i = 0; i < node2.children.length; i++) {
                child = node2.children[i];
                collected[child.name] = this.visit(child.value, value);
              }
              return collected;
            case "OrExpression":
              matched = this.visit(node2.children[0], value);
              if (isFalse(matched)) {
                matched = this.visit(node2.children[1], value);
              }
              return matched;
            case "AndExpression":
              first = this.visit(node2.children[0], value);
              if (isFalse(first) === true) {
                return first;
              }
              return this.visit(node2.children[1], value);
            case "NotExpression":
              first = this.visit(node2.children[0], value);
              return isFalse(first);
            case "Literal":
              return node2.value;
            case TOK_PIPE:
              left = this.visit(node2.children[0], value);
              return this.visit(node2.children[1], left);
            case TOK_CURRENT:
              return value;
            case "Function":
              var resolvedArgs = [];
              for (i = 0; i < node2.children.length; i++) {
                resolvedArgs.push(this.visit(node2.children[i], value));
              }
              return this.runtime.callFunction(node2.name, resolvedArgs);
            case "ExpressionReference":
              var refNode = node2.children[0];
              refNode.jmespathType = TOK_EXPREF;
              return refNode;
            default:
              throw new Error("Unknown node type: " + node2.type);
          }
        },
        computeSliceParams: function(arrayLength, sliceParams) {
          var start = sliceParams[0];
          var stop = sliceParams[1];
          var step = sliceParams[2];
          var computed = [null, null, null];
          if (step === null) {
            step = 1;
          } else if (step === 0) {
            var error2 = new Error("Invalid slice, step cannot be 0");
            error2.name = "RuntimeError";
            throw error2;
          }
          var stepValueNegative = step < 0 ? true : false;
          if (start === null) {
            start = stepValueNegative ? arrayLength - 1 : 0;
          } else {
            start = this.capSliceRange(arrayLength, start, step);
          }
          if (stop === null) {
            stop = stepValueNegative ? -1 : arrayLength;
          } else {
            stop = this.capSliceRange(arrayLength, stop, step);
          }
          computed[0] = start;
          computed[1] = stop;
          computed[2] = step;
          return computed;
        },
        capSliceRange: function(arrayLength, actualValue, step) {
          if (actualValue < 0) {
            actualValue += arrayLength;
            if (actualValue < 0) {
              actualValue = step < 0 ? -1 : 0;
            }
          } else if (actualValue >= arrayLength) {
            actualValue = step < 0 ? arrayLength - 1 : arrayLength;
          }
          return actualValue;
        }
      };
      function Runtime(interpreter) {
        this._interpreter = interpreter;
        this.functionTable = {
          // name: [function, <signature>]
          // The <signature> can be:
          //
          // {
          //   args: [[type1, type2], [type1, type2]],
          //   variadic: true|false
          // }
          //
          // Each arg in the arg list is a list of valid types
          // (if the function is overloaded and supports multiple
          // types.  If the type is "any" then no type checking
          // occurs on the argument.  Variadic is optional
          // and if not provided is assumed to be false.
          abs: { _func: this._functionAbs, _signature: [{ types: [TYPE_NUMBER] }] },
          avg: { _func: this._functionAvg, _signature: [{ types: [TYPE_ARRAY_NUMBER] }] },
          ceil: { _func: this._functionCeil, _signature: [{ types: [TYPE_NUMBER] }] },
          contains: {
            _func: this._functionContains,
            _signature: [
              { types: [TYPE_STRING, TYPE_ARRAY] },
              { types: [TYPE_ANY] }
            ]
          },
          "ends_with": {
            _func: this._functionEndsWith,
            _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }]
          },
          floor: { _func: this._functionFloor, _signature: [{ types: [TYPE_NUMBER] }] },
          length: {
            _func: this._functionLength,
            _signature: [{ types: [TYPE_STRING, TYPE_ARRAY, TYPE_OBJECT] }]
          },
          map: {
            _func: this._functionMap,
            _signature: [{ types: [TYPE_EXPREF] }, { types: [TYPE_ARRAY] }]
          },
          max: {
            _func: this._functionMax,
            _signature: [{ types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING] }]
          },
          "merge": {
            _func: this._functionMerge,
            _signature: [{ types: [TYPE_OBJECT], variadic: true }]
          },
          "max_by": {
            _func: this._functionMaxBy,
            _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }]
          },
          sum: { _func: this._functionSum, _signature: [{ types: [TYPE_ARRAY_NUMBER] }] },
          "starts_with": {
            _func: this._functionStartsWith,
            _signature: [{ types: [TYPE_STRING] }, { types: [TYPE_STRING] }]
          },
          min: {
            _func: this._functionMin,
            _signature: [{ types: [TYPE_ARRAY_NUMBER, TYPE_ARRAY_STRING] }]
          },
          "min_by": {
            _func: this._functionMinBy,
            _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }]
          },
          type: { _func: this._functionType, _signature: [{ types: [TYPE_ANY] }] },
          keys: { _func: this._functionKeys, _signature: [{ types: [TYPE_OBJECT] }] },
          values: { _func: this._functionValues, _signature: [{ types: [TYPE_OBJECT] }] },
          sort: { _func: this._functionSort, _signature: [{ types: [TYPE_ARRAY_STRING, TYPE_ARRAY_NUMBER] }] },
          "sort_by": {
            _func: this._functionSortBy,
            _signature: [{ types: [TYPE_ARRAY] }, { types: [TYPE_EXPREF] }]
          },
          join: {
            _func: this._functionJoin,
            _signature: [
              { types: [TYPE_STRING] },
              { types: [TYPE_ARRAY_STRING] }
            ]
          },
          reverse: {
            _func: this._functionReverse,
            _signature: [{ types: [TYPE_STRING, TYPE_ARRAY] }]
          },
          "to_array": { _func: this._functionToArray, _signature: [{ types: [TYPE_ANY] }] },
          "to_string": { _func: this._functionToString, _signature: [{ types: [TYPE_ANY] }] },
          "to_number": { _func: this._functionToNumber, _signature: [{ types: [TYPE_ANY] }] },
          "not_null": {
            _func: this._functionNotNull,
            _signature: [{ types: [TYPE_ANY], variadic: true }]
          }
        };
      }
      Runtime.prototype = {
        callFunction: function(name, resolvedArgs) {
          var functionEntry = this.functionTable[name];
          if (functionEntry === void 0) {
            throw new Error("Unknown function: " + name + "()");
          }
          this._validateArgs(name, resolvedArgs, functionEntry._signature);
          return functionEntry._func.call(this, resolvedArgs);
        },
        _validateArgs: function(name, args, signature) {
          var pluralized;
          if (signature[signature.length - 1].variadic) {
            if (args.length < signature.length) {
              pluralized = signature.length === 1 ? " argument" : " arguments";
              throw new Error("ArgumentError: " + name + "() takes at least" + signature.length + pluralized + " but received " + args.length);
            }
          } else if (args.length !== signature.length) {
            pluralized = signature.length === 1 ? " argument" : " arguments";
            throw new Error("ArgumentError: " + name + "() takes " + signature.length + pluralized + " but received " + args.length);
          }
          var currentSpec;
          var actualType;
          var typeMatched;
          for (var i = 0; i < signature.length; i++) {
            typeMatched = false;
            currentSpec = signature[i].types;
            actualType = this._getTypeName(args[i]);
            for (var j = 0; j < currentSpec.length; j++) {
              if (this._typeMatches(actualType, currentSpec[j], args[i])) {
                typeMatched = true;
                break;
              }
            }
            if (!typeMatched) {
              var expected = currentSpec.map(function(typeIdentifier) {
                return TYPE_NAME_TABLE[typeIdentifier];
              }).join(",");
              throw new Error("TypeError: " + name + "() expected argument " + (i + 1) + " to be type " + expected + " but received type " + TYPE_NAME_TABLE[actualType] + " instead.");
            }
          }
        },
        _typeMatches: function(actual, expected, argValue) {
          if (expected === TYPE_ANY) {
            return true;
          }
          if (expected === TYPE_ARRAY_STRING || expected === TYPE_ARRAY_NUMBER || expected === TYPE_ARRAY) {
            if (expected === TYPE_ARRAY) {
              return actual === TYPE_ARRAY;
            } else if (actual === TYPE_ARRAY) {
              var subtype;
              if (expected === TYPE_ARRAY_NUMBER) {
                subtype = TYPE_NUMBER;
              } else if (expected === TYPE_ARRAY_STRING) {
                subtype = TYPE_STRING;
              }
              for (var i = 0; i < argValue.length; i++) {
                if (!this._typeMatches(
                  this._getTypeName(argValue[i]),
                  subtype,
                  argValue[i]
                )) {
                  return false;
                }
              }
              return true;
            }
          } else {
            return actual === expected;
          }
        },
        _getTypeName: function(obj) {
          switch (Object.prototype.toString.call(obj)) {
            case "[object String]":
              return TYPE_STRING;
            case "[object Number]":
              return TYPE_NUMBER;
            case "[object Array]":
              return TYPE_ARRAY;
            case "[object Boolean]":
              return TYPE_BOOLEAN;
            case "[object Null]":
              return TYPE_NULL;
            case "[object Object]":
              if (obj.jmespathType === TOK_EXPREF) {
                return TYPE_EXPREF;
              } else {
                return TYPE_OBJECT;
              }
          }
        },
        _functionStartsWith: function(resolvedArgs) {
          return resolvedArgs[0].lastIndexOf(resolvedArgs[1]) === 0;
        },
        _functionEndsWith: function(resolvedArgs) {
          var searchStr = resolvedArgs[0];
          var suffix = resolvedArgs[1];
          return searchStr.indexOf(suffix, searchStr.length - suffix.length) !== -1;
        },
        _functionReverse: function(resolvedArgs) {
          var typeName = this._getTypeName(resolvedArgs[0]);
          if (typeName === TYPE_STRING) {
            var originalStr = resolvedArgs[0];
            var reversedStr = "";
            for (var i = originalStr.length - 1; i >= 0; i--) {
              reversedStr += originalStr[i];
            }
            return reversedStr;
          } else {
            var reversedArray = resolvedArgs[0].slice(0);
            reversedArray.reverse();
            return reversedArray;
          }
        },
        _functionAbs: function(resolvedArgs) {
          return Math.abs(resolvedArgs[0]);
        },
        _functionCeil: function(resolvedArgs) {
          return Math.ceil(resolvedArgs[0]);
        },
        _functionAvg: function(resolvedArgs) {
          var sum = 0;
          var inputArray = resolvedArgs[0];
          for (var i = 0; i < inputArray.length; i++) {
            sum += inputArray[i];
          }
          return sum / inputArray.length;
        },
        _functionContains: function(resolvedArgs) {
          return resolvedArgs[0].indexOf(resolvedArgs[1]) >= 0;
        },
        _functionFloor: function(resolvedArgs) {
          return Math.floor(resolvedArgs[0]);
        },
        _functionLength: function(resolvedArgs) {
          if (!isObject2(resolvedArgs[0])) {
            return resolvedArgs[0].length;
          } else {
            return Object.keys(resolvedArgs[0]).length;
          }
        },
        _functionMap: function(resolvedArgs) {
          var mapped = [];
          var interpreter = this._interpreter;
          var exprefNode = resolvedArgs[0];
          var elements = resolvedArgs[1];
          for (var i = 0; i < elements.length; i++) {
            mapped.push(interpreter.visit(exprefNode, elements[i]));
          }
          return mapped;
        },
        _functionMerge: function(resolvedArgs) {
          var merged = {};
          for (var i = 0; i < resolvedArgs.length; i++) {
            var current = resolvedArgs[i];
            for (var key in current) {
              merged[key] = current[key];
            }
          }
          return merged;
        },
        _functionMax: function(resolvedArgs) {
          if (resolvedArgs[0].length > 0) {
            var typeName = this._getTypeName(resolvedArgs[0][0]);
            if (typeName === TYPE_NUMBER) {
              return Math.max.apply(Math, resolvedArgs[0]);
            } else {
              var elements = resolvedArgs[0];
              var maxElement = elements[0];
              for (var i = 1; i < elements.length; i++) {
                if (maxElement.localeCompare(elements[i]) < 0) {
                  maxElement = elements[i];
                }
              }
              return maxElement;
            }
          } else {
            return null;
          }
        },
        _functionMin: function(resolvedArgs) {
          if (resolvedArgs[0].length > 0) {
            var typeName = this._getTypeName(resolvedArgs[0][0]);
            if (typeName === TYPE_NUMBER) {
              return Math.min.apply(Math, resolvedArgs[0]);
            } else {
              var elements = resolvedArgs[0];
              var minElement = elements[0];
              for (var i = 1; i < elements.length; i++) {
                if (elements[i].localeCompare(minElement) < 0) {
                  minElement = elements[i];
                }
              }
              return minElement;
            }
          } else {
            return null;
          }
        },
        _functionSum: function(resolvedArgs) {
          var sum = 0;
          var listToSum = resolvedArgs[0];
          for (var i = 0; i < listToSum.length; i++) {
            sum += listToSum[i];
          }
          return sum;
        },
        _functionType: function(resolvedArgs) {
          switch (this._getTypeName(resolvedArgs[0])) {
            case TYPE_NUMBER:
              return "number";
            case TYPE_STRING:
              return "string";
            case TYPE_ARRAY:
              return "array";
            case TYPE_OBJECT:
              return "object";
            case TYPE_BOOLEAN:
              return "boolean";
            case TYPE_EXPREF:
              return "expref";
            case TYPE_NULL:
              return "null";
          }
        },
        _functionKeys: function(resolvedArgs) {
          return Object.keys(resolvedArgs[0]);
        },
        _functionValues: function(resolvedArgs) {
          var obj = resolvedArgs[0];
          var keys = Object.keys(obj);
          var values = [];
          for (var i = 0; i < keys.length; i++) {
            values.push(obj[keys[i]]);
          }
          return values;
        },
        _functionJoin: function(resolvedArgs) {
          var joinChar = resolvedArgs[0];
          var listJoin = resolvedArgs[1];
          return listJoin.join(joinChar);
        },
        _functionToArray: function(resolvedArgs) {
          if (this._getTypeName(resolvedArgs[0]) === TYPE_ARRAY) {
            return resolvedArgs[0];
          } else {
            return [resolvedArgs[0]];
          }
        },
        _functionToString: function(resolvedArgs) {
          if (this._getTypeName(resolvedArgs[0]) === TYPE_STRING) {
            return resolvedArgs[0];
          } else {
            return JSON.stringify(resolvedArgs[0]);
          }
        },
        _functionToNumber: function(resolvedArgs) {
          var typeName = this._getTypeName(resolvedArgs[0]);
          var convertedValue;
          if (typeName === TYPE_NUMBER) {
            return resolvedArgs[0];
          } else if (typeName === TYPE_STRING) {
            convertedValue = +resolvedArgs[0];
            if (!isNaN(convertedValue)) {
              return convertedValue;
            }
          }
          return null;
        },
        _functionNotNull: function(resolvedArgs) {
          for (var i = 0; i < resolvedArgs.length; i++) {
            if (this._getTypeName(resolvedArgs[i]) !== TYPE_NULL) {
              return resolvedArgs[i];
            }
          }
          return null;
        },
        _functionSort: function(resolvedArgs) {
          var sortedArray = resolvedArgs[0].slice(0);
          sortedArray.sort();
          return sortedArray;
        },
        _functionSortBy: function(resolvedArgs) {
          var sortedArray = resolvedArgs[0].slice(0);
          if (sortedArray.length === 0) {
            return sortedArray;
          }
          var interpreter = this._interpreter;
          var exprefNode = resolvedArgs[1];
          var requiredType = this._getTypeName(
            interpreter.visit(exprefNode, sortedArray[0])
          );
          if ([TYPE_NUMBER, TYPE_STRING].indexOf(requiredType) < 0) {
            throw new Error("TypeError");
          }
          var that = this;
          var decorated = [];
          for (var i = 0; i < sortedArray.length; i++) {
            decorated.push([i, sortedArray[i]]);
          }
          decorated.sort(function(a, b) {
            var exprA = interpreter.visit(exprefNode, a[1]);
            var exprB = interpreter.visit(exprefNode, b[1]);
            if (that._getTypeName(exprA) !== requiredType) {
              throw new Error(
                "TypeError: expected " + requiredType + ", received " + that._getTypeName(exprA)
              );
            } else if (that._getTypeName(exprB) !== requiredType) {
              throw new Error(
                "TypeError: expected " + requiredType + ", received " + that._getTypeName(exprB)
              );
            }
            if (exprA > exprB) {
              return 1;
            } else if (exprA < exprB) {
              return -1;
            } else {
              return a[0] - b[0];
            }
          });
          for (var j = 0; j < decorated.length; j++) {
            sortedArray[j] = decorated[j][1];
          }
          return sortedArray;
        },
        _functionMaxBy: function(resolvedArgs) {
          var exprefNode = resolvedArgs[1];
          var resolvedArray = resolvedArgs[0];
          var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
          var maxNumber = -Infinity;
          var maxRecord;
          var current;
          for (var i = 0; i < resolvedArray.length; i++) {
            current = keyFunction(resolvedArray[i]);
            if (current > maxNumber) {
              maxNumber = current;
              maxRecord = resolvedArray[i];
            }
          }
          return maxRecord;
        },
        _functionMinBy: function(resolvedArgs) {
          var exprefNode = resolvedArgs[1];
          var resolvedArray = resolvedArgs[0];
          var keyFunction = this.createKeyFunction(exprefNode, [TYPE_NUMBER, TYPE_STRING]);
          var minNumber = Infinity;
          var minRecord;
          var current;
          for (var i = 0; i < resolvedArray.length; i++) {
            current = keyFunction(resolvedArray[i]);
            if (current < minNumber) {
              minNumber = current;
              minRecord = resolvedArray[i];
            }
          }
          return minRecord;
        },
        createKeyFunction: function(exprefNode, allowedTypes) {
          var that = this;
          var interpreter = this._interpreter;
          var keyFunc = function(x) {
            var current = interpreter.visit(exprefNode, x);
            if (allowedTypes.indexOf(that._getTypeName(current)) < 0) {
              var msg = "TypeError: expected one of " + allowedTypes + ", received " + that._getTypeName(current);
              throw new Error(msg);
            }
            return current;
          };
          return keyFunc;
        }
      };
      function compile(stream) {
        var parser = new Parser3();
        var ast = parser.parse(stream);
        return ast;
      }
      function tokenize(stream) {
        var lexer = new Lexer();
        return lexer.tokenize(stream);
      }
      function search(data, expression) {
        var parser = new Parser3();
        var runtime = new Runtime();
        var interpreter = new TreeInterpreter(runtime);
        runtime._interpreter = interpreter;
        var node2 = parser.parse(expression);
        return interpreter.search(node2, data);
      }
      exports2.tokenize = tokenize;
      exports2.compile = compile;
      exports2.search = search;
      exports2.strictDeepEqual = strictDeepEqual;
    })(typeof exports === "undefined" ? exports.jmespath = {} : exports);
  }
});

// src/bridge-message.ts
var PreviewBridgeMessageType = /* @__PURE__ */ ((PreviewBridgeMessageType2) => {
  PreviewBridgeMessageType2["A2UI_CATALOG"] = "A2UI_CATALOG";
  PreviewBridgeMessageType2["COMPONENT_USAGES"] = "COMPONENT_USAGES";
  PreviewBridgeMessageType2["CONSOLE_LOG"] = "CONSOLE_LOG";
  PreviewBridgeMessageType2["DATA_MODEL_CHANGE"] = "DATA_MODEL_CHANGE";
  PreviewBridgeMessageType2["FORCE_UNBLOCK"] = "FORCE_UNBLOCK";
  PreviewBridgeMessageType2["GET_CATALOG"] = "GET_CATALOG";
  PreviewBridgeMessageType2["GET_COMPONENT_USAGES"] = "GET_COMPONENT_USAGES";
  PreviewBridgeMessageType2["MCP_REQUEST"] = "MCP_REQUEST";
  PreviewBridgeMessageType2["MCP_RESPONSE"] = "MCP_RESPONSE";
  PreviewBridgeMessageType2["RENDER_A2UI"] = "RENDER_A2UI";
  PreviewBridgeMessageType2["RENDER_ERROR"] = "RENDER_ERROR";
  PreviewBridgeMessageType2["RENDER_SUCCESS"] = "RENDER_SUCCESS";
  PreviewBridgeMessageType2["RENDERER_READY"] = "RENDERER_READY";
  PreviewBridgeMessageType2["SEND_TO_SERVER"] = "SEND_TO_SERVER";
  PreviewBridgeMessageType2["SET_BLOCKING_STATE"] = "SET_BLOCKING_STATE";
  PreviewBridgeMessageType2["SET_THEME"] = "SET_THEME";
  PreviewBridgeMessageType2["SURFACE_RESIZE"] = "SURFACE_RESIZE";
  return PreviewBridgeMessageType2;
})(PreviewBridgeMessageType || {});
var ThemePreference = /* @__PURE__ */ ((ThemePreference2) => {
  ThemePreference2["LIGHT"] = "light";
  ThemePreference2["DARK"] = "dark";
  return ThemePreference2;
})(ThemePreference || {});
var A2UI_UPDATE_KEYS = [
  "createSurface",
  "updateComponents",
  "updateDataModel",
  "deleteSurface"
];

// src/domain-origin-verification.ts
var DomainOriginVerificationService = class {
  /**
   * Verifies if a given message event comes from an explicitly trusted origin.
   *
   * Depends on the `?origin=` URL parameter pairing contract to dynamically authenticate
   * cross-origin communication with the parent Shell context.
   *
   * Note: This Javascript-level origin validation assumes the presence of a strict
   * outgoing HTTP CSP `frame-ancestors` policy configured on the hosting server
   * to protect against raw clickjacking and malicious iframe embedding prior to bridging.
   */
  static verifyStrictOrigin(eventOrigin, eventSource, parentWindow) {
    if (!eventSource || eventSource !== parentWindow) {
      return false;
    }
    if (typeof window !== "undefined") {
      if (eventOrigin === window.location.origin) {
        return true;
      }
      if (window.location.search) {
        try {
          const params = new URLSearchParams(window.location.search);
          const expectedOrigin = params.get("origin");
          if (expectedOrigin && eventOrigin === expectedOrigin) {
            return true;
          }
        } catch {
        }
      }
    }
    return false;
  }
};

// src/instrumentation-overrides.ts
var isInstrumented;
var methods = [
  "log",
  "warn",
  "error",
  "info",
  "debug"
];
var originalConsoleMethods;
var originalOnError;
var rejectionHandler;
function deepCloneSafe(obj, ancestors = /* @__PURE__ */ new Set()) {
  if (obj instanceof Error) {
    return { message: obj.message, stack: obj.stack };
  }
  if (obj === void 0) return "undefined";
  if (obj instanceof Date) return obj.toISOString();
  if (obj instanceof RegExp) return obj.toString();
  if (obj instanceof Map) {
    return Array.from(obj.entries()).map(([k, v]) => [
      deepCloneSafe(k, ancestors),
      deepCloneSafe(v, ancestors)
    ]);
  }
  if (obj instanceof Set) {
    return Array.from(obj.values()).map((v) => deepCloneSafe(v, ancestors));
  }
  if (typeof obj === "function") return "[Function Callback]";
  if (typeof obj === "symbol") return obj.toString();
  if (typeof obj === "bigint") return `${obj.toString()}n`;
  if (typeof Node !== "undefined" && obj instanceof Node) return `[DOM Node: ${obj.nodeName}]`;
  if (typeof window !== "undefined" && obj === window) return "[Window Scope]";
  if (typeof obj === "object" && obj !== null) {
    if (ancestors.has(obj)) {
      return "[Circular Reference]";
    }
    ancestors.add(obj);
    try {
      if (Array.isArray(obj)) {
        return obj.map((item) => deepCloneSafe(item, ancestors));
      }
      const res = {};
      const record2 = obj;
      for (const key of Object.keys(record2)) {
        try {
          res[key] = deepCloneSafe(record2[key], ancestors);
        } catch {
          res[key] = "[Unserializable Property]";
        }
      }
      return res;
    } finally {
      ancestors.delete(obj);
    }
  }
  return obj;
}
function logTelemetryError(label, err) {
  const originalError = originalConsoleMethods && originalConsoleMethods.error || console.error;
  originalError.call(console, label, err);
}
function overrideConsoleMethods(sender) {
  if (!originalConsoleMethods) {
    originalConsoleMethods = {};
  }
  let isSerializing = false;
  methods.forEach((method) => {
    const current = console[method];
    if (current && current.__a2uiOriginal) {
      return;
    }
    const original = current;
    originalConsoleMethods[method] = original;
    const wrapper = (...args) => {
      original.apply(console, args);
      if (isSerializing) return;
      try {
        isSerializing = true;
        const message = args.map((arg) => {
          if (arg === void 0) return "undefined";
          if (arg instanceof Error) return arg.message;
          if (typeof arg === "string") return arg;
          const cloned = deepCloneSafe(arg);
          return typeof cloned === "string" ? cloned : JSON.stringify(cloned);
        }).join(" ");
        const errorArg = args.find((arg) => arg instanceof Error);
        const stack = errorArg ? errorArg.stack : void 0;
        sender.sendMessage({
          type: "CONSOLE_LOG" /* CONSOLE_LOG */,
          payload: {
            level: method,
            message,
            stack
          }
        });
      } catch (err) {
        logTelemetryError("A2UI Bridge Telemetry Error (Console):", err);
      } finally {
        isSerializing = false;
      }
    };
    wrapper.__a2uiOriginal = original;
    console[method] = wrapper;
  });
}
function overrideWindowError(sender) {
  originalOnError = window.onerror;
  window.onerror = (message, source, lineno, colno, error2) => {
    try {
      sender.sendMessage({
        type: "CONSOLE_LOG" /* CONSOLE_LOG */,
        payload: {
          level: "error",
          message: String(message),
          stack: error2 ? error2.stack : `${source || ""}:${lineno || 0}:${colno || 0}`
        }
      });
    } catch (err) {
      logTelemetryError("A2UI Bridge Telemetry Error (Window Error):", err);
    }
    if (originalOnError) {
      return originalOnError(message, source, lineno, colno, error2);
    }
    return false;
  };
}
function overrideUnhandledRejection(sender) {
  rejectionHandler = (event) => {
    try {
      const message = event.reason instanceof Error ? event.reason.message : String(event.reason);
      const stack = event.reason instanceof Error ? event.reason.stack : void 0;
      sender.sendMessage({
        type: "CONSOLE_LOG" /* CONSOLE_LOG */,
        payload: {
          level: "error",
          message: `Unhandled Rejection: ${message}`,
          stack
        }
      });
    } catch (err) {
      logTelemetryError("A2UI Bridge Telemetry Error (Unhandled Rejection):", err);
    }
  };
  window.addEventListener("unhandledrejection", rejectionHandler);
}
function setupInstrumentationOverrides(sender) {
  if (isInstrumented || typeof window === "undefined") return;
  isInstrumented = true;
  overrideConsoleMethods(sender);
  overrideWindowError(sender);
  overrideUnhandledRejection(sender);
}
function teardownInstrumentationOverrides() {
  if (!isInstrumented || typeof window === "undefined") return;
  methods.forEach((method) => {
    if (originalConsoleMethods[method]) {
      console[method] = originalConsoleMethods[method];
    }
  });
  originalConsoleMethods = {};
  window.onerror = originalOnError;
  originalOnError = null;
  if (rejectionHandler) {
    window.removeEventListener("unhandledrejection", rejectionHandler);
    rejectionHandler = null;
  }
  isInstrumented = false;
}

// src/mcp/functions/callMcpTool.ts
import {
  A2uiExpressionError,
  DynamicStringSchema,
  DynamicValueSchema,
  createFunctionImplementation
} from "@a2ui/web_core/v0_9";

// node_modules/zod/v4/core/util.js
var util_exports = {};
__export(util_exports, {
  BIGINT_FORMAT_RANGES: () => BIGINT_FORMAT_RANGES,
  CONSTANT_CATCH: () => CONSTANT_CATCH,
  Class: () => Class,
  NUMBER_FORMAT_RANGES: () => NUMBER_FORMAT_RANGES,
  aborted: () => aborted,
  allowsEval: () => allowsEval,
  assert: () => assert,
  assertEqual: () => assertEqual,
  assertIs: () => assertIs,
  assertNever: () => assertNever,
  assertNotEqual: () => assertNotEqual,
  assignProp: () => assignProp,
  attachSchema: () => attachSchema,
  base64ToUint8Array: () => base64ToUint8Array,
  base64urlToUint8Array: () => base64urlToUint8Array,
  cached: () => cached,
  captureStackTrace: () => captureStackTrace,
  cleanEnum: () => cleanEnum,
  cleanRegex: () => cleanRegex,
  clone: () => clone,
  cloneDef: () => cloneDef,
  codePointLength: () => codePointLength,
  constantCatch: () => constantCatch,
  createTransparentProxy: () => createTransparentProxy,
  defineLazy: () => defineLazy,
  defineLazyInternal: () => defineLazyInternal,
  derived: () => derived,
  esc: () => esc,
  escapeRegex: () => escapeRegex,
  explicitlyAborted: () => explicitlyAborted,
  extend: () => extend,
  finalizeIssue: () => finalizeIssue,
  floatSafeRemainder: () => floatSafeRemainder,
  getElementAtPath: () => getElementAtPath,
  getEnumValues: () => getEnumValues,
  getLengthableOrigin: () => getLengthableOrigin,
  getParsedType: () => getParsedType,
  getSizableOrigin: () => getSizableOrigin,
  hexToUint8Array: () => hexToUint8Array,
  hide: () => hide,
  installLazyProp: () => installLazyProp,
  isObject: () => isObject,
  isPlainObject: () => isPlainObject,
  issue: () => issue,
  joinValues: () => joinValues,
  jsonStringifyReplacer: () => jsonStringifyReplacer,
  members: () => members,
  merge: () => merge,
  mergeDefs: () => mergeDefs,
  normalizeParams: () => normalizeParams,
  nullish: () => nullish,
  numKeys: () => numKeys,
  objectClone: () => objectClone,
  omit: () => omit,
  optionalKeys: () => optionalKeys,
  own: () => own,
  parsedType: () => parsedType,
  partial: () => partial,
  pick: () => pick,
  prefixIssues: () => prefixIssues,
  primitiveTypes: () => primitiveTypes,
  promiseAllObject: () => promiseAllObject,
  propertyKeyTypes: () => propertyKeyTypes,
  randomString: () => randomString,
  rawShape: () => rawShape,
  required: () => required,
  safeExtend: () => safeExtend,
  shallowClone: () => shallowClone,
  slugify: () => slugify,
  stringifyPrimitive: () => stringifyPrimitive,
  toZod: () => toZod,
  uint8ArrayToBase64: () => uint8ArrayToBase64,
  uint8ArrayToBase64url: () => uint8ArrayToBase64url,
  uint8ArrayToHex: () => uint8ArrayToHex,
  unwrapMessage: () => unwrapMessage
});
function assertEqual(val) {
  return val;
}
function assertNotEqual(val) {
  return val;
}
function toZod() {
  return (schema) => schema;
}
function assertIs(_arg) {
}
function assertNever(_x) {
  throw new Error("Unexpected value in exhaustive check");
}
function assert(_) {
}
function getEnumValues(entries) {
  const numericValues = Object.values(entries).filter((v) => typeof v === "number");
  const values = Object.entries(entries).filter(([k, _]) => numericValues.indexOf(+k) === -1).map(([_, v]) => v);
  return values;
}
function joinValues(array2, separator = "|") {
  return array2.map((val) => stringifyPrimitive(val)).join(separator);
}
function jsonStringifyReplacer(_, value) {
  if (typeof value === "bigint")
    return value.toString();
  return value;
}
var Cached = class {
  constructor(getter) {
    this._getter = getter;
    this._value = void 0;
  }
  get value() {
    const getter = this._getter;
    if (getter !== void 0) {
      this._value = getter();
      this._getter = void 0;
    }
    return this._value;
  }
};
function cached(getter) {
  return new Cached(getter);
}
function nullish(input) {
  return input === null || input === void 0;
}
function cleanRegex(source) {
  const start = source.startsWith("^") ? 1 : 0;
  const end = source.endsWith("$") ? source.length - 1 : source.length;
  return source.slice(start, end);
}
function floatSafeRemainder(val, step) {
  const ratio = val / step;
  const roundedRatio = Math.round(ratio);
  const tolerance = 4 * Number.EPSILON * Math.max(Math.abs(ratio), 1);
  if (Math.abs(ratio - roundedRatio) < tolerance)
    return 0;
  return ratio - roundedRatio;
}
var EVALUATING = /* @__PURE__ */ Symbol("evaluating");
function defineLazy(object2, key, getter) {
  let value = void 0;
  Object.defineProperty(object2, key, {
    get() {
      if (value === EVALUATING) {
        return void 0;
      }
      if (value === void 0) {
        value = EVALUATING;
        value = getter();
      }
      return value;
    },
    set(v) {
      Object.defineProperty(object2, key, {
        value: v
        // configurable: true,
      });
    },
    configurable: true
  });
}
function objectClone(obj) {
  return Object.create(Object.getPrototypeOf(obj), Object.getOwnPropertyDescriptors(obj));
}
function assignProp(target, prop, value) {
  Object.defineProperty(target, prop, {
    value,
    writable: true,
    enumerable: true,
    configurable: true
  });
}
function rawShape(def) {
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  return desc?.get ? desc.get.raw : desc?.value;
}
function sourceShape(schema) {
  return rawShape(schema._zod.def) ?? schema._zod.def.shape;
}
function deferProp(target, key, getter) {
  Object.defineProperty(target, key, {
    get() {
      const value = getter();
      assignProp(this, key, value);
      return value;
    },
    enumerable: true,
    configurable: true
  });
}
function putProp(target, key, value) {
  if (key in target)
    assignProp(target, key, value);
  else
    target[key] = value;
}
function mirrorShape(target, source, keys, wrap) {
  const raw = sourceShape(source);
  for (const key of keys) {
    const desc = Object.getOwnPropertyDescriptor(raw, key);
    if (!desc.enumerable)
      continue;
    if (desc.get) {
      deferProp(target, key, () => {
        const value = source._zod.def.shape[key];
        return wrap ? wrap(value, key) : value;
      });
    } else
      putProp(target, key, wrap ? wrap(desc.value, key) : desc.value);
  }
}
function mirrorProps(target, source) {
  for (const key of Reflect.ownKeys(source)) {
    const desc = Object.getOwnPropertyDescriptor(source, key);
    if (!desc.enumerable)
      continue;
    if (desc.get)
      deferProp(target, key, () => source[key]);
    else
      putProp(target, key, desc.value);
  }
}
function mergeDefs(...defs) {
  const mergedDescriptors = {};
  for (const def of defs) {
    const descriptors = Object.getOwnPropertyDescriptors(def);
    Object.assign(mergedDescriptors, descriptors);
  }
  return Object.defineProperties({}, mergedDescriptors);
}
function cloneDef(schema) {
  return mergeDefs(schema._zod.def);
}
function getElementAtPath(obj, path) {
  if (!path)
    return obj;
  return path.reduce((acc, key) => acc?.[key], obj);
}
function promiseAllObject(promisesObj) {
  const keys = Object.keys(promisesObj);
  const promises = keys.map((key) => promisesObj[key]);
  return Promise.all(promises).then((results) => {
    const resolvedObj = {};
    for (let i = 0; i < keys.length; i++) {
      resolvedObj[keys[i]] = results[i];
    }
    return resolvedObj;
  });
}
function randomString(length = 10) {
  const chars = "abcdefghijklmnopqrstuvwxyz";
  let str = "";
  for (let i = 0; i < length; i++) {
    str += chars[Math.floor(Math.random() * chars.length)];
  }
  return str;
}
function esc(str) {
  return JSON.stringify(str);
}
function slugify(input) {
  return input.toLowerCase().trim().replace(/[^\w\s-]/g, "").replace(/[\s_-]+/g, "-").replace(/^-+|-+$/g, "");
}
var captureStackTrace = "captureStackTrace" in Error ? Error.captureStackTrace : (..._args) => {
};
function isObject(data) {
  return typeof data === "object" && data !== null && !Array.isArray(data);
}
var allowsEval = /* @__PURE__ */ cached(() => {
  if (globalConfig.jitless) {
    return false;
  }
  if (typeof navigator !== "undefined" && navigator?.userAgent?.includes("Cloudflare")) {
    return false;
  }
  try {
    const F = Function;
    new F("");
    return true;
  } catch (_) {
    return false;
  }
});
function isPlainObject(o) {
  if (isObject(o) === false)
    return false;
  const ctor = o.constructor;
  if (ctor === void 0)
    return true;
  if (typeof ctor !== "function")
    return true;
  const prot = ctor.prototype;
  if (isObject(prot) === false)
    return false;
  if (Object.prototype.hasOwnProperty.call(prot, "isPrototypeOf") === false) {
    return false;
  }
  return true;
}
function shallowClone(o) {
  if (isPlainObject(o))
    return { ...o };
  if (Array.isArray(o))
    return [...o];
  if (o instanceof Map)
    return new Map(o);
  if (o instanceof Set)
    return new Set(o);
  return o;
}
function numKeys(data) {
  let keyCount = 0;
  for (const key in data) {
    if (Object.prototype.hasOwnProperty.call(data, key)) {
      keyCount++;
    }
  }
  return keyCount;
}
var getParsedType = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return "undefined";
    case "string":
      return "string";
    case "number":
      return Number.isNaN(data) ? "nan" : "number";
    case "boolean":
      return "boolean";
    case "function":
      return "function";
    case "bigint":
      return "bigint";
    case "symbol":
      return "symbol";
    case "object":
      if (Array.isArray(data)) {
        return "array";
      }
      if (data === null) {
        return "null";
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return "promise";
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return "map";
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return "set";
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return "date";
      }
      if (typeof File !== "undefined" && data instanceof File) {
        return "file";
      }
      return "object";
    default:
      throw new Error(`Unknown data type: ${t}`);
  }
};
var propertyKeyTypes = /* @__PURE__ */ new Set(["string", "number", "symbol"]);
var primitiveTypes = /* @__PURE__ */ new Set([
  "string",
  "number",
  "bigint",
  "boolean",
  "symbol",
  "undefined"
]);
function escapeRegex(str) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function clone(inst, def, params) {
  const cl = new inst._zod.constr(def ?? inst._zod.def);
  if (!def || params?.parent)
    cl._zod.parent = inst;
  return cl;
}
function normalizeParams(_params) {
  const params = _params;
  if (!params)
    return {};
  if (typeof params === "string")
    return { error: () => params };
  if (params?.message !== void 0) {
    if (params?.error !== void 0)
      throw new Error("Cannot specify both `message` and `error` params");
    params.error = params.message;
  }
  delete params.message;
  if (typeof params.error === "string")
    return { ...params, error: () => params.error };
  return params;
}
function createTransparentProxy(getter) {
  let target;
  return new Proxy({}, {
    get(_, prop, receiver) {
      target ?? (target = getter());
      return Reflect.get(target, prop, receiver);
    },
    set(_, prop, value, receiver) {
      target ?? (target = getter());
      return Reflect.set(target, prop, value, receiver);
    },
    has(_, prop) {
      target ?? (target = getter());
      return Reflect.has(target, prop);
    },
    deleteProperty(_, prop) {
      target ?? (target = getter());
      return Reflect.deleteProperty(target, prop);
    },
    ownKeys(_) {
      target ?? (target = getter());
      return Reflect.ownKeys(target);
    },
    getOwnPropertyDescriptor(_, prop) {
      target ?? (target = getter());
      return Reflect.getOwnPropertyDescriptor(target, prop);
    },
    defineProperty(_, prop, descriptor) {
      target ?? (target = getter());
      return Reflect.defineProperty(target, prop, descriptor);
    }
  });
}
function stringifyPrimitive(value) {
  if (typeof value === "bigint")
    return value.toString() + "n";
  if (typeof value === "string")
    return `"${value}"`;
  return `${value}`;
}
function optionalKeys(shape) {
  return Object.keys(shape).filter((k) => {
    return shape[k]._zod.optin !== void 0 && shape[k]._zod.optout === "optional";
  });
}
var NUMBER_FORMAT_RANGES = /* @__PURE__ */ (() => ({
  safeint: [Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER],
  int32: [-2147483648, 2147483647],
  uint32: [0, 4294967295],
  float32: [-34028234663852886e22, 34028234663852886e22],
  float64: [-Number.MAX_VALUE, Number.MAX_VALUE]
}))();
var BIGINT_FORMAT_RANGES = {
  int64: [/* @__PURE__ */ BigInt("-9223372036854775808"), /* @__PURE__ */ BigInt("9223372036854775807")],
  uint64: [/* @__PURE__ */ BigInt(0), /* @__PURE__ */ BigInt("18446744073709551615")]
};
function pick(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".pick() cannot be used on object schemas containing refinements");
  }
  const newShape = {};
  mirrorShape(newShape, schema, maskedKeys(schema, mask));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function maskedKeys(schema, mask) {
  const raw = sourceShape(schema);
  const keys = [];
  for (const key of Reflect.ownKeys(mask)) {
    if (!Object.getOwnPropertyDescriptor(raw, key)?.enumerable) {
      throw new Error(`Unrecognized key: "${String(key)}"`);
    }
    if (mask[key])
      keys.push(key);
  }
  return keys;
}
function omit(schema, mask) {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(".omit() cannot be used on object schemas containing refinements");
  }
  const omitted = new Set(maskedKeys(schema, mask));
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)).filter((key) => !omitted.has(key)));
  return clone(schema, mergeDefs(currDef, { shape: newShape, checks: [] }));
}
function extend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to extend: expected a plain object");
  }
  const checks = schema._zod.def.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    const existingShape = sourceShape(schema);
    for (const key of Reflect.ownKeys(shape)) {
      if (Object.getOwnPropertyDescriptor(existingShape, key) !== void 0) {
        throw new Error("Cannot overwrite keys on object schemas containing refinements. Use `.safeExtend()` instead.");
      }
    }
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function extended(schema, shape) {
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)));
  mirrorProps(newShape, shape);
  return newShape;
}
function safeExtend(schema, shape) {
  if (!isPlainObject(shape)) {
    throw new Error("Invalid input to safeExtend: expected a plain object");
  }
  return clone(schema, mergeDefs(schema._zod.def, { shape: extended(schema, shape) }));
}
function merge(a, b) {
  if (!b?._zod?.def) {
    throw new Error("Invalid input to merge: expected an object schema. To merge a plain shape, use `.extend()`.");
  }
  if (a._zod.def.checks?.length) {
    throw new Error(".merge() cannot be used on object schemas containing refinements. Use .safeExtend() instead.");
  }
  const newShape = {};
  mirrorShape(newShape, a, Reflect.ownKeys(sourceShape(a)));
  mirrorShape(newShape, b, Reflect.ownKeys(sourceShape(b)));
  const def = mergeDefs(a._zod.def, {
    shape: newShape,
    get catchall() {
      return b._zod.def.catchall;
    },
    checks: b._zod.def.checks ?? []
  });
  return clone(a, def);
}
function partial(Class2, schema, mask, name = "partial") {
  const currDef = schema._zod.def;
  const checks = currDef.checks;
  const hasChecks = checks && checks.length > 0;
  if (hasChecks) {
    throw new Error(`.${name}() cannot be used on object schemas containing refinements`);
  }
  const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), Class2 && ((value, key) => selected && !selected.has(key) ? value : new Class2({ type: "optional", innerType: value })));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape, checks: [] }));
}
function required(Class2, schema, mask) {
  const selected = mask ? new Set(maskedKeys(schema, mask)) : void 0;
  const newShape = {};
  mirrorShape(newShape, schema, Reflect.ownKeys(sourceShape(schema)), (value, key) => (
    // overwrite with non-optional
    selected && !selected.has(key) ? value : new Class2({ type: "nonoptional", innerType: value })
  ));
  return clone(schema, mergeDefs(schema._zod.def, { shape: newShape }));
}
function aborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue !== true) {
      return true;
    }
  }
  return false;
}
function explicitlyAborted(x, startIndex = 0) {
  if (x.aborted === true)
    return true;
  for (let i = startIndex; i < x.issues.length; i++) {
    if (x.issues[i]?.continue === false) {
      return true;
    }
  }
  return false;
}
function prefixIssues(path, issues) {
  return issues.map((iss) => {
    var _a3;
    (_a3 = iss).path ?? (_a3.path = []);
    iss.path.unshift(path);
    return iss;
  });
}
function unwrapMessage(message) {
  return typeof message === "string" ? message : message?.message;
}
function attachSchema(issues, start, inst) {
  var _a3;
  for (let i = start; i < issues.length; i++) {
    (_a3 = issues[i]).schema ?? (_a3.schema = inst);
  }
}
function finalizeIssue(iss, ctx, config2) {
  var _a3;
  const traits = iss.inst?._zod?.traits;
  if (traits?.has("$ZodType")) {
    if (traits.has("$ZodCheck"))
      (_a3 = iss).schema ?? (_a3.schema = iss.inst);
    else
      iss.schema = iss.inst;
  }
  const schemaError = iss.schema !== iss.inst ? iss.schema?._zod.def?.error : void 0;
  const message = iss.message ? iss.message : unwrapMessage(iss.inst?._zod.def?.error?.(iss)) ?? unwrapMessage(schemaError?.(iss)) ?? unwrapMessage(ctx?.error?.(iss)) ?? unwrapMessage(config2.customError?.(iss)) ?? unwrapMessage(config2.localeError?.(iss)) ?? "Invalid input";
  const full = {};
  for (const k of Object.keys(iss)) {
    if (k === "inst" || k === "schema" || k === "continue" || k === "input" || k === "__proto__")
      continue;
    full[k] = iss[k];
  }
  full.path ?? (full.path = []);
  full.message = message;
  if (ctx?.reportInput) {
    full.input = iss.input;
  }
  return full;
}
function getSizableOrigin(input) {
  if (input instanceof Set)
    return "set";
  if (input instanceof Map)
    return "map";
  if (input instanceof File)
    return "file";
  return "unknown";
}
var highSurrogate = /[\uD800-\uDBFF]/;
function codePointLength(str) {
  const units = str.length;
  if (!highSurrogate.test(str))
    return units;
  let count = units;
  for (let i = 0; i < units - 1; i++) {
    if ((str.charCodeAt(i) & 64512) === 55296 && (str.charCodeAt(i + 1) & 64512) === 56320) {
      count--;
      i++;
    }
  }
  return count;
}
function getLengthableOrigin(input) {
  if (Array.isArray(input))
    return "array";
  if (typeof input === "string")
    return "string";
  return "unknown";
}
function parsedType(data) {
  const t = typeof data;
  switch (t) {
    case "number": {
      return Number.isNaN(data) ? "nan" : "number";
    }
    case "object": {
      if (data === null) {
        return "null";
      }
      if (Array.isArray(data)) {
        return "array";
      }
      const obj = data;
      if (obj && Object.getPrototypeOf(obj) !== Object.prototype && "constructor" in obj && obj.constructor) {
        return obj.constructor.name;
      }
    }
  }
  return t;
}
function issue(...args) {
  const [iss, input, inst] = args;
  if (typeof iss === "string") {
    return {
      message: iss,
      code: "custom",
      input,
      inst
    };
  }
  return { ...iss };
}
function cleanEnum(obj) {
  return Object.entries(obj).filter(([k, _]) => {
    return Number.isNaN(Number.parseInt(k, 10));
  }).map((el) => el[1]);
}
function base64ToUint8Array(base642) {
  const binaryString = atob(base642);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}
function uint8ArrayToBase64(bytes) {
  let binaryString = "";
  for (let i = 0; i < bytes.length; i++) {
    binaryString += String.fromCharCode(bytes[i]);
  }
  return btoa(binaryString);
}
function base64urlToUint8Array(base64url2) {
  const base642 = base64url2.replace(/-/g, "+").replace(/_/g, "/");
  const padding = "=".repeat((4 - base642.length % 4) % 4);
  return base64ToUint8Array(base642 + padding);
}
function uint8ArrayToBase64url(bytes) {
  return uint8ArrayToBase64(bytes).replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "");
}
function hexToUint8Array(hex) {
  const cleanHex = hex.replace(/^0x/, "");
  if (cleanHex.length % 2 !== 0) {
    throw new Error("Invalid hex string length");
  }
  const bytes = new Uint8Array(cleanHex.length / 2);
  for (let i = 0; i < cleanHex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(cleanHex.slice(i, i + 2), 16);
  }
  return bytes;
}
function uint8ArrayToHex(bytes) {
  return Array.from(bytes).map((b) => b.toString(16).padStart(2, "0")).join("");
}
var Class = class {
  constructor(..._args) {
  }
};
function members(proto, table) {
  for (const key in table) {
    const desc = Object.getOwnPropertyDescriptor(table, key);
    if (desc.get)
      Object.defineProperty(proto, key, { ...desc, enumerable: false });
    else
      defineBound(proto, key, desc.value);
  }
}
function own(inst, key, value, enumerable = true) {
  Object.defineProperty(inst, key, { configurable: true, writable: true, enumerable, value });
  return value;
}
function hide(inst, key, value) {
  return own(inst, key, value, false);
}
// @__NO_SIDE_EFFECTS__
function derived(computes, table) {
  for (const key in computes) {
    const compute = computes[key];
    Object.defineProperty(table, key, {
      configurable: true,
      enumerable: true,
      get() {
        return own(this, key, compute(this));
      },
      set(value) {
        own(this, key, value);
      }
    });
  }
  return table;
}
function defineBound(proto, key, fn) {
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      return this == null ? fn : own(this, key, fn.bind(this));
    },
    set(value) {
      own(this, key, value);
    }
  });
}
function claim(inst, sentinel) {
  const proto = Object.getPrototypeOf(inst);
  return sentinel in proto ? void 0 : proto;
}
var installing;
var broke = false;
var breaker = {
  configurable: true,
  get() {
    broke = true;
    return void 0;
  }
};
function defineLazyInternal(inst, key, compute) {
  const proto = Object.getPrototypeOf(inst._zod);
  if (key in proto && installing !== inst._zod) {
    installing = void 0;
    return;
  }
  installing = inst._zod;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      Object.defineProperty(this, key, breaker);
      const outer = broke;
      broke = false;
      try {
        const value = compute(this);
        if (broke)
          delete this[key];
        else
          Object.defineProperty(this, key, { configurable: true, writable: true, value });
        broke = broke || outer;
        return value;
      } catch (err) {
        delete this[key];
        broke = broke || outer;
        throw err;
      }
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, value });
    }
  });
}
function installLazyProp(inst, key, make, enumerable) {
  const proto = claim(inst, key);
  if (!proto)
    return;
  Object.defineProperty(proto, key, {
    configurable: true,
    get() {
      const desc = { configurable: true, writable: true, enumerable, value: void 0 };
      Object.defineProperty(this, key, desc);
      desc.value = make(this);
      Object.defineProperty(this, key, desc);
      return desc.value;
    },
    set(value) {
      Object.defineProperty(this, key, { configurable: true, writable: true, enumerable, value });
    }
  });
}
var CONSTANT_CATCH = "~constantCatch";
function constantCatch(value) {
  const fn = () => value;
  fn[CONSTANT_CATCH] = true;
  return fn;
}

// node_modules/zod/v4/core/core.js
var _a;
var _zodDesc = { value: void 0, enumerable: false };
var _E = "captureStackTrace" in Error ? Error : null;
function newError(Definition) {
  const E = _E;
  if (E) {
    const saved = E.stackTraceLimit;
    if (typeof saved === "number") {
      try {
        E.stackTraceLimit = 0;
      } catch {
        _E = null;
        return new Definition();
      }
      try {
        return new Definition();
      } finally {
        E.stackTraceLimit = saved;
      }
    }
  }
  return new Definition();
}
// @__NO_SIDE_EFFECTS__
function $constructor(name, initializer3, proto, params) {
  const zodProto = {};
  function Internals(def) {
    this.def = def;
    this.constr = _;
    this.traits = /* @__PURE__ */ new Set();
  }
  Internals.prototype = zodProto;
  const protoMembers = proto;
  const initialized = protoMembers && /* @__PURE__ */ new WeakSet();
  function init(inst, def) {
    if (!inst._zod) {
      _zodDesc.value = new Internals(def);
      try {
        Object.defineProperty(inst, "_zod", _zodDesc);
      } finally {
        _zodDesc.value = void 0;
      }
    } else if (inst._zod.traits.has(name)) {
      return;
    }
    inst._zod.traits.add(name);
    initializer3(inst, def);
    if (initialized) {
      const own2 = Object.getPrototypeOf(inst);
      const ctorProto = inst._zod.constr.prototype;
      let up = own2;
      while (up && up !== ctorProto)
        up = Object.getPrototypeOf(up);
      const target = up ?? own2;
      if (!initialized.has(target)) {
        initialized.add(target);
        members(target, protoMembers);
      }
    }
    const proto2 = _.prototype;
    for (const k in proto2) {
      if (!Object.prototype.hasOwnProperty.call(proto2, k))
        continue;
      if (!(k in inst)) {
        inst[k] = proto2[k].bind(inst);
      }
    }
  }
  const Parent = params?.Parent ?? Object;
  class Definition extends Parent {
  }
  Object.defineProperty(Definition, "name", { value: name });
  function _(def) {
    const inst = params?.Parent ? newError(Definition) : this;
    init(inst, def);
    const deferred = inst._zod.deferred;
    if (deferred) {
      for (const fn of deferred) {
        fn();
      }
      inst._zod.deferred = void 0;
    }
    const pp = globalThis.__zod_globalConfig?.postProcessor;
    if (pp)
      pp(inst);
    return inst;
  }
  Object.defineProperty(_, "init", { value: init });
  Object.defineProperty(_, Symbol.hasInstance, {
    value: (inst) => {
      if (params?.Parent && inst instanceof params.Parent)
        return true;
      return inst?._zod?.traits?.has(name);
    }
  });
  Object.defineProperty(_, "name", { value: name });
  return _;
}
var $ZodAsyncError = class extends Error {
  constructor() {
    super(`Encountered Promise during synchronous parse. Use .parseAsync() instead.`);
  }
};
var $ZodEncodeError = class extends Error {
  constructor(name) {
    super(`Encountered unidirectional transform during encode: ${name}`);
    this.name = "ZodEncodeError";
  }
};
(_a = globalThis).__zod_globalConfig ?? (_a.__zod_globalConfig = {});
var globalConfig = globalThis.__zod_globalConfig;
function config(newConfig) {
  if (newConfig)
    Object.assign(globalConfig, newConfig);
  return globalConfig;
}

// node_modules/zod/v4/core/errors.js
function _getMessage() {
  const internals = this._zod;
  internals.message ?? (internals.message = JSON.stringify(internals.def, jsonStringifyReplacer, 2));
  return internals.message;
}
function _setMessage(value) {
  this._zod.message = value;
}
var _messageDesc = {
  get: _getMessage,
  set: _setMessage,
  enumerable: true,
  configurable: true
};
var _issuesDesc = { value: void 0, enumerable: false };
var _installedToString = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
var initializer = (inst, def) => {
  inst.name = "$ZodError";
  _issuesDesc.value = def;
  Object.defineProperty(inst, "issues", _issuesDesc);
  _issuesDesc.value = void 0;
  Object.defineProperty(inst, "message", _messageDesc);
  const proto = Object.getPrototypeOf(inst);
  if (!_installedToString.has(proto)) {
    _installedToString.add(proto);
    Object.defineProperty(proto, "toString", {
      configurable: true,
      enumerable: false,
      get() {
        const value = () => this.message;
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
        return value;
      },
      set(value) {
        Object.defineProperty(this, "toString", { value, configurable: true, writable: true });
      }
    });
  }
};
var $ZodError = $constructor("$ZodError", initializer);
var $ZodRealError = $constructor("$ZodError", initializer, void 0, {
  Parent: Error
});
function node(obj, key, make) {
  if (!Object.prototype.hasOwnProperty.call(obj, key)) {
    if (key === "__proto__") {
      Object.defineProperty(obj, key, { value: make(), writable: true, enumerable: true, configurable: true });
    } else {
      obj[key] = make();
    }
  }
  return obj[key];
}
function flattenError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = {};
  const formErrors = [];
  for (const sub of error2.issues) {
    if (sub.path.length > 0) {
      node(fieldErrors, sub.path[0], () => []).push(mapper(sub));
    } else {
      formErrors.push(mapper(sub));
    }
  }
  return { formErrors, fieldErrors };
}
function formatError(error2, mapper = (issue2) => issue2.message) {
  const fieldErrors = { _errors: [] };
  const processError = (error3, path = []) => {
    for (const issue2 of error3.issues) {
      if (issue2.code === "invalid_union" && issue2.errors.length) {
        issue2.errors.map((issues) => processError({ issues }, [...path, ...issue2.path]));
      } else if (issue2.code === "invalid_key") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else if (issue2.code === "invalid_element") {
        processError({ issues: issue2.issues }, [...path, ...issue2.path]);
      } else {
        const fullpath = [...path, ...issue2.path];
        if (fullpath.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < fullpath.length) {
            const el = fullpath[i];
            const terminal = i === fullpath.length - 1;
            if (el === "_errors") {
              if (terminal)
                curr._errors.push(mapper(issue2));
              i++;
              continue;
            }
            if (!Object.prototype.hasOwnProperty.call(curr, el)) {
              Object.defineProperty(curr, el, {
                value: { _errors: [] },
                enumerable: true,
                writable: true,
                configurable: true
              });
            }
            const node2 = curr[el];
            if (terminal) {
              node2._errors.push(mapper(issue2));
            }
            curr = node2;
            i++;
          }
        }
      }
    }
  };
  processError(error2);
  return fieldErrors;
}

// node_modules/zod/v4/core/parse.js
function finalizeParams(callee, params) {
  return { callee: params?.callee ?? callee, Err: params?.Err };
}
var _parse = (_Err) => {
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
    const result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise) {
      throw new $ZodAsyncError();
    }
    if (result.issues.length) {
      const e = new (_params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, _params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _parseAsync = (_Err) => {
  const fn = async (schema, value, _ctx, params) => {
    const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
    let result = schema._zod.run({ value, issues: [] }, ctx);
    if (result instanceof Promise)
      result = await result;
    if (result.issues.length) {
      const e = new (params?.Err ?? _Err)(result.issues.map((iss) => finalizeIssue(iss, ctx, config())));
      captureStackTrace(e, params?.callee ?? fn);
      throw e;
    }
    return result.value;
  };
  return fn;
};
var _safeParse = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: false } : { async: false };
  const result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
function failure(Err, issues, ctx) {
  let error2;
  return {
    success: false,
    get error() {
      if (!error2) {
        error2 = new Err(issues.map((iss) => finalizeIssue(iss, ctx, config())));
        issues = void 0;
        ctx = void 0;
      }
      return error2;
    },
    set error(e) {
      error2 = e;
      issues = void 0;
      ctx = void 0;
    }
  };
}
var _safeParseAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true } : { async: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length ? failure(_Err, result.issues, ctx) : { success: true, data: result.value };
};
var COMPILE_INVALID = /* @__PURE__ */ Symbol.for("zod.compile.invalid");
var COMPILE_FALLBACK = /* @__PURE__ */ Symbol.for("zod.compile.fallback");
var validate = ((schema, value, _ctx) => {
  const validator = schema._zod.bag.validator;
  if (validator !== void 0) {
    if (validator(value) !== COMPILE_INVALID)
      return true;
    if (validator.definite === true && _ctx === void 0)
      return false;
  }
  return validateFallback(schema, value, _ctx);
});
function validateFallback(schema, value, _ctx) {
  const ctx = _ctx ? { ..._ctx, async: false, abortEarly: true } : { async: false, abortEarly: true };
  const fallbackRun = schema._zod.bag.fallbackRun;
  let result;
  if (fallbackRun) {
    ctx[COMPILE_FALLBACK] = true;
    result = fallbackRun({ value, issues: [] }, ctx);
  } else {
    result = schema._zod.run({ value, issues: [] }, ctx);
  }
  if (result instanceof Promise) {
    throw new $ZodAsyncError();
  }
  return result.issues.length === 0;
}
var validateAsync = async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, async: true, abortEarly: true } : { async: true, abortEarly: true };
  let result = schema._zod.run({ value, issues: [] }, ctx);
  if (result instanceof Promise)
    result = await result;
  return result.issues.length === 0;
};
var _encode = (_Err) => {
  const parse2 = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return parse2(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decode = (_Err) => {
  const parse2 = _parse(_Err);
  const fn = (schema, value, _ctx, _params) => {
    return parse2(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _encodeAsync = (_Err) => {
  const parseAsync2 = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
    return await parseAsync2(schema, value, ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _decodeAsync = (_Err) => {
  const parseAsync2 = _parseAsync(_Err);
  const fn = async (schema, value, _ctx, _params) => {
    return await parseAsync2(schema, value, _ctx, finalizeParams(fn, _params));
  };
  return fn;
};
var _safeEncode = (_Err) => (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParse(_Err)(schema, value, ctx);
};
var _safeDecode = (_Err) => (schema, value, _ctx) => {
  return _safeParse(_Err)(schema, value, _ctx);
};
var _safeEncodeAsync = (_Err) => async (schema, value, _ctx) => {
  const ctx = _ctx ? { ..._ctx, direction: "backward" } : { direction: "backward" };
  return _safeParseAsync(_Err)(schema, value, ctx);
};
var _safeDecodeAsync = (_Err) => async (schema, value, _ctx) => {
  return _safeParseAsync(_Err)(schema, value, _ctx);
};

// node_modules/zod/v4/core/regexes.js
var cuid = /^[cC][0-9a-z]{6,}$/;
var cuid2 = /^[0-9a-z]+$/;
var ulid = /^[0-7][0-9A-HJKMNP-TV-Za-hjkmnp-tv-z]{25}$/;
var xid = /^[0-9a-vA-V]{20}$/;
var ksuid = /^[A-Za-z0-9]{27}$/;
var nanoid = /^[a-zA-Z0-9_-]{21}$/;
function nanoidOfLength(length) {
  return new RegExp(`^[a-zA-Z0-9_-]{${length}}$`);
}
var duration = /^P(?:(\d+W)|(?!.*W)(?=\d|T\d)(\d+Y)?(\d+M)?(\d+D)?(T(?=\d)(\d+H)?(\d+M)?(\d+([.,]\d+)?S)?)?)$/;
var guid = /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
var uuid = (version2) => {
  if (!version2)
    return /^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-8][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}|00000000-0000-0000-0000-000000000000|ffffffff-ffff-ffff-ffff-ffffffffffff)$/;
  return new RegExp(`^([0-9a-fA-F]{8}-[0-9a-fA-F]{4}-${version2}[0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12})$`);
};
var email = /^(?:[A-Za-z0-9_'+\-]+\.)*[A-Za-z0-9_'+\-]*[A-Za-z0-9_+-]@(?:[A-Za-z0-9][A-Za-z0-9\-]*\.)+[A-Za-z]{2,}$/;
var _emoji = `^(?=[\\s\\S]*[\\p{Extended_Pictographic}\\p{Regional_Indicator}\\u20E3])[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
function emoji() {
  return new RegExp(_emoji, "u");
}
var ipv4 = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))$/;
var cidrv4 = /^((25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/([0-9]|[1-2][0-9]|3[0-2])$/;
var cidrv6 = /^(([0-9a-fA-F]{1,4}:){7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64 = /^$|^(?:[0-9a-zA-Z+/]{4})*(?:(?:[0-9a-zA-Z+/]{2}==)|(?:[0-9a-zA-Z+/]{3}=))?$/;
var base64url = /^(?:[A-Za-z0-9_-]{4})*(?:[A-Za-z0-9_-]{2,3})?$/;
var httpProtocol = /^https?$/;
var e164 = /^\+[1-9]\d{6,14}$/;
var dateSource = `(?:(?:\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-(?:(?:0[13578]|1[02])-(?:0[1-9]|[12]\\d|3[01])|(?:0[469]|11)-(?:0[1-9]|[12]\\d|30)|(?:02)-(?:0[1-9]|1\\d|2[0-8])))`;
function anchor(source) {
  return new RegExp(`^${source}$`);
}
var date = /* @__PURE__ */ anchor(dateSource);
function timeSource(args) {
  const hhmm = `(?:[01]\\d|2[0-3]):[0-5]\\d`;
  const regex = typeof args.precision === "number" ? args.precision === -1 ? `${hhmm}` : args.precision === 0 ? `${hhmm}:[0-5]\\d` : `${hhmm}:[0-5]\\d\\.\\d{${args.precision}}` : args.seconds ? `${hhmm}:[0-5]\\d(?:\\.\\d+)?` : `${hhmm}(?::[0-5]\\d(?:\\.\\d+)?)?`;
  return regex;
}
function time(args) {
  return new RegExp(`^${timeSource(args)}$`);
}
function datetime(args) {
  const opts = ["Z"];
  if (args.offset)
    opts.push(`([+-](?:[01]\\d|2[0-3]):[0-5]\\d)`);
  const qualified = `${timeSource({ precision: args.precision, seconds: true })}(?:${opts.join("|")})`;
  const timeRegex2 = args.local ? `${qualified}|${timeSource({ precision: args.precision })}` : qualified;
  return new RegExp(`^${dateSource}T(?:${timeRegex2})$`);
}
var anyString = /^[\s\S]{0,}$/;
var integer = /^-?\d+$/;
var number = /^-?\d+(?:\.\d+)?$/;
var boolean = /^(?:true|false)$/i;
var _null = /^null$/i;
var lowercase = /^[^A-Z]*$/;
var uppercase = /^[^a-z]*$/;

// node_modules/zod/v4/core/checks.js
var $ZodCheck = /* @__PURE__ */ $constructor("$ZodCheck", (inst, def) => {
  var _a3;
  inst._zod ?? (inst._zod = {});
  inst._zod.def = def;
  (_a3 = inst._zod).onattach ?? (_a3.onattach = []);
});
var _whenHasLength = (payload) => {
  const val = payload.value;
  return !nullish(val) && val.length !== void 0;
};
var numericOriginMap = {
  number: "number",
  bigint: "bigint",
  object: "date"
};
var $ZodCheckLessThan = /* @__PURE__ */ $constructor("$ZodCheckLessThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value <= def.value : payload.value < def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_big",
      maximum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckGreaterThan = /* @__PURE__ */ $constructor("$ZodCheckGreaterThan", (inst, def) => {
  $ZodCheck.init(inst, def);
  const origin = numericOriginMap[typeof def.value];
  inst._zod.check = (payload) => {
    if (def.inclusive ? payload.value >= def.value : payload.value > def.value) {
      return;
    }
    payload.issues.push({
      origin: numericOriginMap[typeof payload.value] ?? origin,
      code: "too_small",
      minimum: typeof def.value === "object" ? def.value.getTime() : def.value,
      input: payload.value,
      inclusive: def.inclusive,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMultipleOf = /* @__PURE__ */ $constructor("$ZodCheckMultipleOf", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    if (typeof payload.value !== typeof def.value)
      throw new Error("Cannot mix number and bigint in multiple_of check.");
    const isMultiple = typeof payload.value === "bigint" ? (
      // `value % 0n` throws, and nothing is a multiple of zero — the number branch already fails this way via NaN
      def.value !== BigInt(0) && payload.value % def.value === BigInt(0)
    ) : floatSafeRemainder(payload.value, def.value) === 0;
    if (isMultiple)
      return;
    payload.issues.push({
      origin: typeof payload.value,
      code: "not_multiple_of",
      divisor: def.value,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckNumberFormat = /* @__PURE__ */ $constructor("$ZodCheckNumberFormat", (inst, def) => {
  $ZodCheck.init(inst, def);
  def.format = def.format || "float64";
  const isInt = def.format?.includes("int");
  const origin = isInt ? "int" : "number";
  const [minimum, maximum] = NUMBER_FORMAT_RANGES[def.format];
  inst._zod.check = (payload) => {
    const input = payload.value;
    if (isInt) {
      if (!Number.isInteger(input)) {
        payload.issues.push({
          expected: origin,
          format: def.format,
          code: "invalid_type",
          continue: false,
          input,
          inst
        });
        return;
      }
      if (!Number.isSafeInteger(input)) {
        if (input > 0) {
          payload.issues.push({
            input,
            code: "too_big",
            maximum: Number.MAX_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        } else {
          payload.issues.push({
            input,
            code: "too_small",
            minimum: Number.MIN_SAFE_INTEGER,
            note: "Integers must be within the safe integer range.",
            inst,
            origin,
            inclusive: true,
            continue: !def.abort
          });
        }
        return;
      }
    }
    if (input < minimum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_small",
        minimum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
    if (input > maximum) {
      payload.issues.push({
        origin: "number",
        input,
        code: "too_big",
        maximum,
        inclusive: true,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCheckMaxLength = /* @__PURE__ */ $constructor("$ZodCheckMaxLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units > def.maximum ? codePointLength(input) : units;
    if (length <= def.maximum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_big",
      maximum: def.maximum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckMinLength = /* @__PURE__ */ $constructor("$ZodCheckMinLength", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.minimum && units < def.minimum * 2 ? codePointLength(input) : units;
    if (length >= def.minimum)
      return;
    const origin = getLengthableOrigin(input);
    payload.issues.push({
      origin,
      code: "too_small",
      minimum: def.minimum,
      inclusive: true,
      input,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLengthEquals = /* @__PURE__ */ $constructor("$ZodCheckLengthEquals", (inst, def) => {
  var _a3;
  $ZodCheck.init(inst, def);
  (_a3 = inst._zod.def).when ?? (_a3.when = _whenHasLength);
  inst._zod.check = (payload) => {
    const input = payload.value;
    const units = input.length;
    const length = typeof input === "string" && units >= def.length && units <= def.length * 2 ? codePointLength(input) : units;
    if (length === def.length)
      return;
    const origin = getLengthableOrigin(input);
    const tooBig = length > def.length;
    payload.issues.push({
      origin,
      ...tooBig ? { code: "too_big", maximum: def.length } : { code: "too_small", minimum: def.length },
      inclusive: true,
      exact: true,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStringFormat = /* @__PURE__ */ $constructor("$ZodCheckStringFormat", (inst, def) => {
  var _a3, _b;
  $ZodCheck.init(inst, def);
  if (def.pattern)
    (_a3 = inst._zod).check ?? (_a3.check = (payload) => {
      def.pattern.lastIndex = 0;
      if (def.pattern.test(payload.value))
        return;
      payload.issues.push({
        origin: "string",
        code: "invalid_format",
        format: def.format,
        input: payload.value,
        ...def.pattern ? { pattern: def.pattern.toString() } : {},
        inst,
        continue: !def.abort
      });
    });
  else
    (_b = inst._zod).check ?? (_b.check = () => {
    });
});
var $ZodCheckRegex = /* @__PURE__ */ $constructor("$ZodCheckRegex", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    def.pattern.lastIndex = 0;
    if (def.pattern.test(payload.value))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "regex",
      input: payload.value,
      pattern: def.pattern.toString(),
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckLowerCase = /* @__PURE__ */ $constructor("$ZodCheckLowerCase", (inst, def) => {
  def.pattern ?? (def.pattern = lowercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckUpperCase = /* @__PURE__ */ $constructor("$ZodCheckUpperCase", (inst, def) => {
  def.pattern ?? (def.pattern = uppercase);
  $ZodCheckStringFormat.init(inst, def);
});
var $ZodCheckIncludes = /* @__PURE__ */ $constructor("$ZodCheckIncludes", (inst, def) => {
  $ZodCheck.init(inst, def);
  const escapedRegex = escapeRegex(def.includes);
  const pattern2 = new RegExp(typeof def.position === "number" ? `^.{${def.position},}${escapedRegex}` : escapedRegex);
  def.pattern = pattern2;
  inst._zod.check = (payload) => {
    if (payload.value.includes(def.includes, def.position))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "includes",
      includes: def.includes,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckStartsWith = /* @__PURE__ */ $constructor("$ZodCheckStartsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern2 = new RegExp(`^${escapeRegex(def.prefix)}.*`);
  def.pattern ?? (def.pattern = pattern2);
  inst._zod.check = (payload) => {
    if (payload.value.startsWith(def.prefix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "starts_with",
      prefix: def.prefix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckEndsWith = /* @__PURE__ */ $constructor("$ZodCheckEndsWith", (inst, def) => {
  $ZodCheck.init(inst, def);
  const pattern2 = new RegExp(`.*${escapeRegex(def.suffix)}$`);
  def.pattern ?? (def.pattern = pattern2);
  inst._zod.check = (payload) => {
    if (payload.value.endsWith(def.suffix))
      return;
    payload.issues.push({
      origin: "string",
      code: "invalid_format",
      format: "ends_with",
      suffix: def.suffix,
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodCheckOverwrite = /* @__PURE__ */ $constructor("$ZodCheckOverwrite", (inst, def) => {
  $ZodCheck.init(inst, def);
  inst._zod.check = (payload) => {
    payload.value = def.tx(payload.value);
  };
});

// node_modules/zod/v4/core/doc.js
var Doc = class {
  constructor(args = [], closed = {}) {
    this.content = [];
    this.indent = 0;
    this.args = args;
    this.closed = closed;
  }
  // the compiler catches a child's throw and keeps writing into this doc, so the indent has to unwind with it
  indented(fn) {
    this.indent += 1;
    try {
      fn(this);
    } finally {
      this.indent -= 1;
    }
  }
  write(arg) {
    if (typeof arg === "function") {
      arg(this, { execution: "sync" });
      arg(this, { execution: "async" });
      return;
    }
    const content = arg;
    const lines = content.split("\n").filter((x) => x);
    const minIndent = Math.min(...lines.map((x) => x.length - x.trimStart().length));
    const dedented = lines.map((x) => x.slice(minIndent)).map((x) => " ".repeat(this.indent * 2) + x);
    for (const line of dedented) {
      this.content.push(line);
    }
  }
  compile() {
    const F = Function;
    const content = this?.content ?? [``];
    const factory = new F(...Object.keys(this.closed), `return function (${this.args.join(", ")}) {
${content.join("\n")}
};`);
    return factory(...Object.values(this.closed));
  }
};

// node_modules/zod/v4/core/versions.js
var version = {
  major: 4,
  minor: 6,
  patch: 5
};

// node_modules/zod/v4/core/schemas.js
var $ZodType = /* @__PURE__ */ $constructor("$ZodType", (inst, def) => {
  var _a3;
  inst ?? (inst = {});
  inst._zod.def = def;
  inst._zod.bag = inst._zod.bag || {};
  inst._zod.version = version;
  const defChecks = inst._zod.def.checks;
  const checks = inst._zod.traits.has("$ZodCheck") ? [inst, ...defChecks ?? []] : defChecks?.length ? [...defChecks] : [];
  for (const ch of checks) {
    for (const fn of ch._zod.onattach) {
      fn(inst);
    }
  }
  if (checks.length === 0) {
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred?.push(() => {
      inst._zod.run = inst._zod.parse;
    });
  } else {
    const runChecks = (payload, checks2, ctx) => {
      if (payload.memo)
        return payload;
      let isAborted2 = aborted(payload);
      let asyncResult;
      for (const ch of checks2) {
        if (ch._zod.def.when) {
          if (explicitlyAborted(payload))
            continue;
          const shouldRun = ch._zod.def.when(payload);
          if (!shouldRun)
            continue;
        } else if (isAborted2) {
          continue;
        }
        const currLen = payload.issues.length;
        const _ = ch._zod.check(payload);
        if (_ instanceof Promise && ctx?.async === false) {
          throw new $ZodAsyncError();
        }
        if (asyncResult || _ instanceof Promise) {
          asyncResult = (asyncResult ?? Promise.resolve()).then(async () => {
            await _;
            const nextLen = payload.issues.length;
            if (nextLen === currLen)
              return;
            attachSchema(payload.issues, currLen, inst);
            if (!isAborted2)
              isAborted2 = aborted(payload, currLen);
          });
        } else {
          const nextLen = payload.issues.length;
          if (nextLen === currLen)
            continue;
          attachSchema(payload.issues, currLen, inst);
          if (!isAborted2)
            isAborted2 = aborted(payload, currLen);
        }
      }
      if (asyncResult) {
        return asyncResult.then(() => {
          return payload;
        });
      }
      return payload;
    };
    const handleCanaryResult = (canary, payload, ctx) => {
      if (aborted(canary)) {
        canary.aborted = true;
        return canary;
      }
      const checkResult = runChecks(payload, checks, ctx);
      if (checkResult instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return checkResult.then((checkResult2) => inst._zod.parse(checkResult2, ctx));
      }
      return inst._zod.parse(checkResult, ctx);
    };
    inst._zod.run = (payload, ctx) => {
      if (ctx.skipChecks) {
        return inst._zod.parse(payload, ctx);
      }
      if (ctx.direction === "backward") {
        const canary = inst._zod.parse({ value: payload.value, issues: [] }, { ...ctx, skipChecks: true });
        if (canary instanceof Promise) {
          return canary.then((canary2) => {
            return handleCanaryResult(canary2, payload, ctx);
          });
        }
        return handleCanaryResult(canary, payload, ctx);
      }
      const result = inst._zod.parse(payload, ctx);
      if (result instanceof Promise) {
        if (ctx.async === false)
          throw new $ZodAsyncError();
        return result.then((result2) => runChecks(result2, checks, ctx));
      }
      return runChecks(result, checks, ctx);
    };
  }
}, {
  // Wrappers extend this by installing a richer factory over it; reading it eagerly would defeat the laziness.
  get "~standard"() {
    return hide(this, "~standard", standardProps(this));
  },
  set "~standard"(value) {
    own(this, "~standard", value);
  }
});
var toStandardResult = (r, ctx) => r.issues.length ? { issues: r.issues.map((iss) => finalizeIssue(iss, ctx, config())) } : { value: r.value };
async function validateAsync2(inst, value) {
  const ctx = { async: true };
  return toStandardResult(await inst._zod.run({ value, issues: [] }, ctx), ctx);
}
function standardProps(inst) {
  return {
    validate: (value) => {
      const ctx = { async: false };
      try {
        const r = inst._zod.run({ value, issues: [] }, ctx);
        if (!(r instanceof Promise))
          return toStandardResult(r, ctx);
      } catch (_) {
      }
      return validateAsync2(inst, value);
    },
    vendor: "zod",
    version: 1
  };
}
var $ZodString = /* @__PURE__ */ $constructor("$ZodString", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = def.pattern ?? anyString;
  inst._zod.parse = (payload, _) => {
    if (def.coerce)
      try {
        payload.value = String(payload.value);
      } catch (_2) {
      }
    if (typeof payload.value === "string")
      return payload;
    payload.issues.push({
      expected: "string",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
var $ZodStringFormat = /* @__PURE__ */ $constructor("$ZodStringFormat", (inst, def) => {
  $ZodCheckStringFormat.init(inst, def);
  $ZodString.init(inst, def);
});
var $ZodGUID = /* @__PURE__ */ $constructor("$ZodGUID", (inst, def) => {
  def.pattern ?? (def.pattern = guid);
  $ZodStringFormat.init(inst, def);
});
var $ZodUUID = /* @__PURE__ */ $constructor("$ZodUUID", (inst, def) => {
  if (def.version) {
    const versionMap = {
      v1: 1,
      v2: 2,
      v3: 3,
      v4: 4,
      v5: 5,
      v6: 6,
      v7: 7,
      v8: 8
    };
    const v = versionMap[def.version];
    if (v === void 0)
      throw new Error(`Invalid UUID version: "${def.version}"`);
    def.pattern ?? (def.pattern = uuid(v));
  } else
    def.pattern ?? (def.pattern = uuid());
  $ZodStringFormat.init(inst, def);
});
var $ZodEmail = /* @__PURE__ */ $constructor("$ZodEmail", (inst, def) => {
  def.pattern ?? (def.pattern = email);
  $ZodStringFormat.init(inst, def);
});
var URL_BAD_FORMAT = 1;
var URL_UNPARSEABLE = 2;
function canParseURL(input) {
  try {
    if (typeof URL !== "undefined" && typeof URL.canParse === "function")
      return URL.canParse(input);
    new URL(input);
    return true;
  } catch {
    return false;
  }
}
function validateURL(trimmed, def) {
  if (!("normalize" in def) && !("hostname" in def) && !("protocol" in def)) {
    return canParseURL(trimmed) || URL_UNPARSEABLE;
  }
  return parseURLObject(trimmed, def);
}
function parseURLObject(trimmed, def) {
  if (!def.normalize && def.protocol?.source === httpProtocol.source && !/^https?:\/\//i.test(trimmed)) {
    return URL_BAD_FORMAT;
  }
  try {
    if (typeof URL !== "undefined") {
      const URLStatic = URL;
      if (typeof URLStatic.parse === "function")
        return URLStatic.parse(trimmed) ?? URL_UNPARSEABLE;
    }
    return new URL(trimmed);
  } catch {
    return URL_UNPARSEABLE;
  }
}
var asciiTabOrNewline = /[\t\n\r]/g;
function stripTabAndNewline(value) {
  return value.replace(asciiTabOrNewline, "");
}
function urlHostnameOk(url, hostname) {
  hostname.lastIndex = 0;
  return hostname.test(url.hostname);
}
function urlProtocolOk(url, protocol) {
  protocol.lastIndex = 0;
  return protocol.test(url.protocol.endsWith(":") ? url.protocol.slice(0, -1) : url.protocol);
}
var $ZodURL = /* @__PURE__ */ $constructor("$ZodURL", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    try {
      const trimmed = payload.value.trim();
      const url = validateURL(trimmed, def);
      if (url === URL_BAD_FORMAT) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid URL format",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === URL_UNPARSEABLE) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          input: payload.value,
          inst,
          continue: !def.abort
        });
        return;
      }
      if (url === true) {
        payload.value = stripTabAndNewline(trimmed);
        return;
      }
      if (def.hostname && !urlHostnameOk(url, def.hostname)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid hostname",
          pattern: def.hostname.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      if (def.protocol && !urlProtocolOk(url, def.protocol)) {
        payload.issues.push({
          code: "invalid_format",
          format: "url",
          note: "Invalid protocol",
          pattern: def.protocol.source,
          input: payload.value,
          inst,
          continue: !def.abort
        });
      }
      payload.value = def.normalize ? url.href : stripTabAndNewline(trimmed);
      return;
    } catch (_) {
      payload.issues.push({
        code: "invalid_format",
        format: "url",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodEmoji = /* @__PURE__ */ $constructor("$ZodEmoji", (inst, def) => {
  def.pattern ?? (def.pattern = emoji());
  $ZodStringFormat.init(inst, def);
});
var $ZodNanoID = /* @__PURE__ */ $constructor("$ZodNanoID", (inst, def) => {
  if (def.length !== void 0 && (!Number.isInteger(def.length) || def.length < 1))
    throw new Error(`Invalid nanoid length: ${def.length}`);
  def.pattern ?? (def.pattern = def.length === void 0 ? nanoid : nanoidOfLength(def.length));
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID = /* @__PURE__ */ $constructor("$ZodCUID", (inst, def) => {
  def.pattern ?? (def.pattern = cuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodCUID2 = /* @__PURE__ */ $constructor("$ZodCUID2", (inst, def) => {
  def.pattern ?? (def.pattern = cuid2);
  $ZodStringFormat.init(inst, def);
});
var $ZodULID = /* @__PURE__ */ $constructor("$ZodULID", (inst, def) => {
  def.pattern ?? (def.pattern = ulid);
  $ZodStringFormat.init(inst, def);
});
var $ZodXID = /* @__PURE__ */ $constructor("$ZodXID", (inst, def) => {
  def.pattern ?? (def.pattern = xid);
  $ZodStringFormat.init(inst, def);
});
var $ZodKSUID = /* @__PURE__ */ $constructor("$ZodKSUID", (inst, def) => {
  def.pattern ?? (def.pattern = ksuid);
  $ZodStringFormat.init(inst, def);
});
var $ZodISODateTime = /* @__PURE__ */ $constructor("$ZodISODateTime", (inst, def) => {
  def.pattern ?? (def.pattern = datetime(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODate = /* @__PURE__ */ $constructor("$ZodISODate", (inst, def) => {
  def.pattern ?? (def.pattern = date);
  $ZodStringFormat.init(inst, def);
});
var $ZodISOTime = /* @__PURE__ */ $constructor("$ZodISOTime", (inst, def) => {
  def.pattern ?? (def.pattern = time(def));
  $ZodStringFormat.init(inst, def);
});
var $ZodISODuration = /* @__PURE__ */ $constructor("$ZodISODuration", (inst, def) => {
  def.pattern ?? (def.pattern = duration);
  $ZodStringFormat.init(inst, def);
});
var $ZodIPv4 = /* @__PURE__ */ $constructor("$ZodIPv4", (inst, def) => {
  def.pattern ?? (def.pattern = ipv4);
  $ZodStringFormat.init(inst, def);
});
var ipv6Alphabet = /^[0-9a-fA-F:.]+$/;
function isValidIPv6(value) {
  if (!ipv6Alphabet.test(value))
    return false;
  return canParseURL(`http://[${value}]`);
}
var $ZodIPv6 = /* @__PURE__ */ $constructor("$ZodIPv6", (inst, def) => {
  def.pattern ?? (def.pattern = ipv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidIPv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "ipv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
var $ZodCIDRv4 = /* @__PURE__ */ $constructor("$ZodCIDRv4", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv4);
  $ZodStringFormat.init(inst, def);
});
function isValidCIDRv6(value) {
  const parts = value.split("/");
  if (parts.length !== 2)
    return false;
  const [address, prefix] = parts;
  if (!prefix)
    return false;
  const prefixNum = Number(prefix);
  if (`${prefixNum}` !== prefix)
    return false;
  if (prefixNum < 0 || prefixNum > 128)
    return false;
  return isValidIPv6(address);
}
var $ZodCIDRv6 = /* @__PURE__ */ $constructor("$ZodCIDRv6", (inst, def) => {
  def.pattern ?? (def.pattern = cidrv6);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (!isValidCIDRv6(payload.value)) {
      payload.issues.push({
        code: "invalid_format",
        format: "cidrv6",
        input: payload.value,
        inst,
        continue: !def.abort
      });
    }
  };
});
function isValidBase64(data) {
  if (data === "")
    return true;
  if (/\s/.test(data))
    return false;
  if (data.length % 4 !== 0)
    return false;
  try {
    atob(data);
    return true;
  } catch {
    return false;
  }
}
var base64Charset = /^[0-9a-zA-Z+/]*={0,2}$/;
var $ZodBase64 = /* @__PURE__ */ $constructor("$ZodBase64", (inst, def) => {
  def.pattern ?? (def.pattern = base64Charset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var base64urlCharset = /^[A-Za-z0-9_-]*$/;
function isValidBase64URL(data) {
  if (!base64urlCharset.test(data))
    return false;
  const base642 = data.replace(/[-_]/g, (c) => c === "-" ? "+" : "/");
  const padded = base642.padEnd(Math.ceil(base642.length / 4) * 4, "=");
  return isValidBase64(padded);
}
var $ZodBase64URL = /* @__PURE__ */ $constructor("$ZodBase64URL", (inst, def) => {
  def.pattern ?? (def.pattern = base64urlCharset);
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidBase64URL(payload.value))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "base64url",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodE164 = /* @__PURE__ */ $constructor("$ZodE164", (inst, def) => {
  def.pattern ?? (def.pattern = e164);
  $ZodStringFormat.init(inst, def);
});
function isValidJWT(token, algorithm = null) {
  try {
    const tokensParts = token.split(".");
    if (tokensParts.length !== 3)
      return false;
    const [header] = tokensParts;
    if (!header)
      return false;
    const parsedHeader = JSON.parse(atob(header));
    if ("typ" in parsedHeader && parsedHeader?.typ !== "JWT")
      return false;
    if (!parsedHeader.alg)
      return false;
    if (algorithm && (!("alg" in parsedHeader) || parsedHeader.alg !== algorithm))
      return false;
    return true;
  } catch {
    return false;
  }
}
var $ZodJWT = /* @__PURE__ */ $constructor("$ZodJWT", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  inst._zod.check = (payload) => {
    if (isValidJWT(payload.value, def.alg))
      return;
    payload.issues.push({
      code: "invalid_format",
      format: "jwt",
      input: payload.value,
      inst,
      continue: !def.abort
    });
  };
});
var $ZodNumber = /* @__PURE__ */ $constructor("$ZodNumber", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = number;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Number(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "number" && !Number.isNaN(input) && Number.isFinite(input)) {
      return payload;
    }
    const received = typeof input === "number" ? Number.isNaN(input) ? "NaN" : !Number.isFinite(input) ? String(input) : void 0 : void 0;
    payload.issues.push({
      expected: "number",
      code: "invalid_type",
      input,
      inst,
      ...received ? { received } : {}
    });
    return payload;
  };
});
var $ZodNumberFormat = /* @__PURE__ */ $constructor("$ZodNumberFormat", (inst, def) => {
  $ZodCheckNumberFormat.init(inst, def);
  $ZodNumber.init(inst, def);
});
var $ZodBoolean = /* @__PURE__ */ $constructor("$ZodBoolean", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = boolean;
  inst._zod.parse = (payload, _ctx) => {
    if (def.coerce)
      try {
        payload.value = Boolean(payload.value);
      } catch (_) {
      }
    const input = payload.value;
    if (typeof input === "boolean")
      return payload;
    payload.issues.push({
      expected: "boolean",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodNull = /* @__PURE__ */ $constructor("$ZodNull", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.pattern = _null;
  inst._zod.values = /* @__PURE__ */ new Set([null]);
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (input === null)
      return payload;
    payload.issues.push({
      expected: "null",
      code: "invalid_type",
      input,
      inst
    });
    return payload;
  };
});
var $ZodUnknown = /* @__PURE__ */ $constructor("$ZodUnknown", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload) => payload;
});
var $ZodNever = /* @__PURE__ */ $constructor("$ZodNever", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _ctx) => {
    payload.issues.push({
      expected: "never",
      code: "invalid_type",
      input: payload.value,
      inst
    });
    return payload;
  };
});
function handleArrayResult(result, final, index) {
  if (result.issues.length) {
    final.issues.push(...prefixIssues(index, result.issues));
  }
  final.value[index] = result.value;
}
var $ZodArray = /* @__PURE__ */ $constructor("$ZodArray", (inst, def) => {
  $ZodType.init(inst, def);
  const memo2 = globalConfig.memoizer;
  memo2?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!Array.isArray(input)) {
      payload.issues.push({
        expected: "array",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo2 ? memo2.alloc(inst, payload, Array(input.length), ctx) : Array(input.length);
    const proms = [];
    const abortEarly = ctx?.abortEarly;
    for (let i = 0; i < input.length; i++) {
      const item = input[i];
      const result = def.element._zod.run({
        value: item,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        proms.push(result.then((result2) => handleArrayResult(result2, payload, i)));
      } else {
        handleArrayResult(result, payload, i);
        if (abortEarly && result.issues.length !== 0 && aborted(result))
          break;
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
function handlePropertyResult(result, final, key, input, optin, optout) {
  const isPresent = key in input;
  const isOptionalOut = optout === "optional";
  if (!isPresent && isOptionalOut && optin === "optional") {
    return;
  }
  if (result.issues.length) {
    if (optin !== void 0 && isOptionalOut && !isPresent) {
      return;
    }
    final.issues.push(...prefixIssues(key, result.issues));
  }
  if (!isPresent && optin === void 0) {
    if (!result.issues.length) {
      final.issues.push({
        code: "invalid_type",
        expected: "nonoptional",
        input: void 0,
        path: [key]
      });
    }
    return;
  }
  if (result.value === void 0) {
    if (isPresent || optin === "defaulted" && !isOptionalOut) {
      final.value[key] = void 0;
    }
  } else {
    final.value[key] = result.value;
  }
}
var NO_SYMBOL_KEYS = [];
function normalizeDef(def) {
  const keys = Object.keys(def.shape);
  const ownSymbols = Object.getOwnPropertySymbols(def.shape);
  const symbolKeys = ownSymbols.length ? ownSymbols : NO_SYMBOL_KEYS;
  const allKeys = symbolKeys.length ? [...keys, ...symbolKeys] : keys;
  for (const k of allKeys) {
    if (!def.shape?.[k]?._zod?.traits?.has("$ZodType")) {
      throw new Error(`Invalid element at key "${String(k)}": expected a Zod schema`);
    }
  }
  const okeys = optionalKeys(def.shape);
  return {
    ...def,
    allKeys,
    symbolKeys,
    // string-only: handleCatchall matches it against `for...in`, which never yields a symbol
    keySet: new Set(keys),
    numKeys: keys.length,
    optionalKeys: new Set(okeys)
  };
}
function handleCatchall(proms, input, payload, ctx, def, inst, abortEarly) {
  const unrecognized = [];
  const keySet = def.keySet;
  const _catchall = def.catchall._zod;
  const t = _catchall.def.type;
  const optin = _catchall.optin;
  const optout = _catchall.optout;
  let seen = 0;
  for (const key in input) {
    if (abortEarly && payload.issues.length !== seen) {
      if (aborted(payload, seen))
        break;
      seen = payload.issues.length;
    }
    if (keySet.has(key))
      continue;
    if (key === "__proto__") {
      if (t === "never")
        unrecognized.push(key);
      continue;
    }
    if (t === "never") {
      unrecognized.push(key);
      continue;
    }
    const r = _catchall.run({ value: input[key], issues: [] }, ctx);
    if (r instanceof Promise) {
      proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, optin, optout)));
    } else {
      handlePropertyResult(r, payload, key, input, optin, optout);
    }
  }
  if (unrecognized.length) {
    payload.issues.push({
      code: "unrecognized_keys",
      keys: unrecognized,
      input,
      inst,
      // Describes the shape of the input, not the validity of the parsed value, so it never aborts. The parse still fails; the schema's own checks just get to run first, and an enclosing intersection can reconcile the key against a sibling operand.
      continue: true
    });
  }
  if (!proms.length)
    return payload;
  return Promise.all(proms).then(() => {
    return payload;
  });
}
var $ZodObject = /* @__PURE__ */ $constructor("$ZodObject", (inst, def) => {
  $ZodType.init(inst, def);
  const desc = Object.getOwnPropertyDescriptor(def, "shape");
  const sh = desc?.get ? desc.get.raw : def.shape ?? {};
  if (sh) {
    const get = () => {
      const newSh = { ...sh };
      Object.defineProperty(def, "shape", { value: newSh });
      get.raw = newSh;
      return newSh;
    };
    get.raw = sh;
    Object.defineProperty(def, "shape", { get });
  }
  const _normalized = cached(() => normalizeDef(def));
  defineLazyInternal(inst, "propValues", (zod) => {
    const shape = zod.def.shape;
    const propValues = {};
    for (const key in shape) {
      const field = shape[key]._zod;
      if (field.values) {
        if (!Object.prototype.hasOwnProperty.call(propValues, key)) {
          assignProp(propValues, key, /* @__PURE__ */ new Set());
        }
        for (const v of field.values)
          propValues[key].add(v);
        if (field.optin !== void 0)
          propValues[key].add(void 0);
      }
    }
    return propValues;
  });
  const isObject2 = isObject;
  const catchall = def.catchall;
  let value;
  const memo2 = globalConfig.memoizer;
  memo2?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    payload.value = memo2 ? memo2.alloc(inst, payload, {}, ctx) : {};
    const proms = [];
    const shape = value.shape;
    const abortEarly = ctx?.abortEarly;
    let seen = payload.issues.length;
    for (const key of value.allKeys) {
      if (abortEarly && payload.issues.length !== seen) {
        if (aborted(payload, seen))
          break;
        seen = payload.issues.length;
      }
      if (key === "__proto__")
        continue;
      const el = shape[key];
      const optin = el._zod.optin;
      const optout = el._zod.optout;
      const r = el._zod.run({ value: input[key], issues: [] }, ctx);
      if (r instanceof Promise) {
        proms.push(r.then((r2) => handlePropertyResult(r2, payload, key, input, optin, optout)));
      } else {
        handlePropertyResult(r, payload, key, input, optin, optout);
      }
    }
    if (!catchall) {
      return proms.length ? Promise.all(proms).then(() => payload) : payload;
    }
    return handleCatchall(proms, input, payload, ctx, _normalized.value, inst, abortEarly === true);
  };
});
var $ZodObjectJIT = /* @__PURE__ */ $constructor("$ZodObjectJIT", (inst, def) => {
  $ZodObject.init(inst, def);
  const superParse = inst._zod.parse;
  const _normalized = cached(() => normalizeDef(def));
  const memo2 = globalConfig.memoizer;
  const generateFastpass = (shape) => {
    const normalized = _normalized.value;
    const syms = normalized.symbolKeys;
    const doc = new Doc(["payload", "ctx"], { shape, inst, memo: memo2, syms });
    const parseStr = (k) => `shape[${k}]._zod.run({ value: input[${k}], issues: [] }, ctx)`;
    const prefixStr = (id, k) => `
          let ${id}_ab = false;
          for (let i = 0; i < ${id}.issues.length; i++) {
            const iss = ${id}.issues[i];
            iss.path = iss.path ? [${k}, ...iss.path] : [${k}];
            payload.issues.push(iss);
            if (iss.continue !== true) ${id}_ab = true;
          }
          if (${id}_ab && ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }`;
    doc.write(`const input = payload.value;`);
    const ids = /* @__PURE__ */ Object.create(null);
    let counter = 0;
    for (const key of normalized.allKeys) {
      ids[key] = `key_${counter++}`;
    }
    doc.write(memo2 ? `const newResult = memo.alloc(inst, payload, {}, ctx);` : `const newResult = {};`);
    for (const key of normalized.allKeys) {
      if (key === "__proto__")
        continue;
      const id = ids[key];
      const k = typeof key === "symbol" ? `syms[${syms.indexOf(key)}]` : esc(key);
      const isPresent = `${k} in input`;
      const schema = shape[key];
      const optin = schema?._zod?.optin;
      const isOptionalIn = optin !== void 0;
      const isOptionalOut = schema?._zod?.optout === "optional";
      doc.write(`const ${id} = ${parseStr(k)};`);
      if (isOptionalIn && isOptionalOut) {
        const assign = optin === "optional" ? `${id}_present` : `${id}.value !== undefined || ${id}_present`;
        doc.write(`
        const ${id}_present = ${isPresent};
        if (!${id}.issues.length || ${id}_present) {
          if (${id}.issues.length) {${prefixStr(id, k)}
          }

          if (${assign}) {
            newResult[${k}] = ${id}.value;
          }
        }

      `);
      } else if (!isOptionalIn) {
        doc.write(`
        const ${id}_present = ${isPresent};
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
        if (!${id}_present && !${id}.issues.length) {
          payload.issues.push({
            code: "invalid_type",
            expected: "nonoptional",
            input: undefined,
            path: [${k}]
          });
          if (ctx && ctx.abortEarly) {
            payload.value = newResult;
            return payload;
          }
        }

        if (${id}_present) {
          newResult[${k}] = ${id}.value;
        }

      `);
      } else {
        doc.write(`
        if (${id}.issues.length) {${prefixStr(id, k)}
        }
      `);
        if (optin === "defaulted") {
          doc.write(`newResult[${k}] = ${id}.value;`);
        } else {
          doc.write(`
        if (${id}.value !== undefined || ${isPresent}) {
          newResult[${k}] = ${id}.value;
        }
      `);
        }
      }
    }
    doc.write(`payload.value = newResult;`);
    doc.write(`return payload;`);
    return doc.compile();
  };
  let fastpass;
  const isObject2 = isObject;
  const jit = !globalConfig.jitless;
  const allowsEval2 = allowsEval;
  const fastEnabled = jit && allowsEval2.value;
  const catchall = def.catchall;
  let value;
  inst._zod.parse = (payload, ctx) => {
    value ?? (value = _normalized.value);
    const input = payload.value;
    if (!isObject2(input)) {
      payload.issues.push({
        expected: "object",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    if (jit && fastEnabled && ctx?.async === false && ctx.jitless !== true) {
      if (!fastpass)
        fastpass = generateFastpass(def.shape);
      payload = fastpass(payload, ctx);
      if (!catchall)
        return payload;
      return handleCatchall([], input, payload, ctx, value, inst, ctx?.abortEarly === true);
    }
    return superParse(payload, ctx);
  };
});
function handleUnionResults(results, final, inst, ctx) {
  for (const result of results) {
    if (result.issues.length === 0) {
      final.value = result.value;
      return final;
    }
  }
  const nonaborted = results.filter((r) => !aborted(r));
  if (nonaborted.length === 1) {
    final.value = nonaborted[0].value;
    return nonaborted[0];
  }
  final.issues.push({
    code: "invalid_union",
    input: final.value,
    inst,
    errors: results.map((result) => result.issues.map((iss) => finalizeIssue(iss, ctx, config())))
  });
  return final;
}
var $ZodUnion = /* @__PURE__ */ $constructor("$ZodUnion", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.options.some((o) => o._zod.optin === "defaulted") ? "defaulted" : zod.def.options.some((o) => o._zod.optin !== void 0) ? "optional" : void 0);
  defineLazyInternal(inst, "optout", (zod) => zod.def.options.some((o) => o._zod.optout === "optional") ? "optional" : void 0);
  defineLazyInternal(inst, "values", (zod) => {
    if (zod.def.options.every((o) => o._zod.values)) {
      return new Set(zod.def.options.flatMap((option) => Array.from(option._zod.values)));
    }
    return void 0;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    if (zod.def.options.every((o) => o._zod.pattern)) {
      const patterns = zod.def.options.map((o) => o._zod.pattern);
      return new RegExp(`^(${patterns.map((p) => cleanRegex(p.source)).join("|")})$`);
    }
    return void 0;
  });
  const first = def.options.length === 1 ? def.options[0]._zod.run : null;
  inst._zod.parse = (payload, ctx) => {
    if (first) {
      return first(payload, ctx);
    }
    let async = false;
    const results = [];
    for (const option of def.options) {
      const result = option._zod.run({
        value: payload.value,
        issues: []
      }, ctx);
      if (result instanceof Promise) {
        results.push(result);
        async = true;
      } else {
        if (result.issues.length === 0)
          return result;
        results.push(result);
      }
    }
    if (!async)
      return handleUnionResults(results, payload, inst, ctx);
    return Promise.all(results).then((results2) => {
      return handleUnionResults(results2, payload, inst, ctx);
    });
  };
});
function discriminatorMap(def) {
  const map = /* @__PURE__ */ new Map();
  for (const option of def.options) {
    const values = option._zod.propValues?.[def.discriminator];
    if (!values || values.size === 0)
      throw new Error(`Invalid discriminated union option at index "${def.options.indexOf(option)}"`);
    for (const value of values) {
      if (map.has(value)) {
        if (value !== void 0)
          throw new Error(`Duplicate discriminator value "${String(value)}"`);
        map.set(value, null);
      } else {
        map.set(value, option);
      }
    }
  }
  return map;
}
var $ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("$ZodDiscriminatedUnion", (inst, def) => {
  def.inclusive = false;
  $ZodUnion.init(inst, def);
  const _super = inst._zod.parse;
  defineLazyInternal(inst, "propValues", (zod) => {
    const propValues = {};
    let undefinedCount = 0;
    for (const option of zod.def.options) {
      const pv = option._zod.propValues;
      if (!pv || Object.keys(pv).length === 0)
        throw new Error(`Invalid discriminated union option at index "${zod.def.options.indexOf(option)}"`);
      if (pv[zod.def.discriminator]?.has(void 0))
        undefinedCount++;
      for (const [k, v] of Object.entries(pv)) {
        if (!Object.prototype.hasOwnProperty.call(propValues, k)) {
          assignProp(propValues, k, /* @__PURE__ */ new Set());
        }
        for (const val of v) {
          propValues[k].add(val);
        }
      }
    }
    if (!zod.def.unionFallback && undefinedCount > 1)
      propValues[zod.def.discriminator]?.delete(void 0);
    return propValues;
  });
  def.options.forEach((option, i) => {
    const propShape = rawShape(option._zod.def);
    if (propShape && !Object.prototype.hasOwnProperty.call(propShape, def.discriminator)) {
      throw new Error(`Invalid discriminated union option at index "${i}"`);
    }
  });
  const disc = cached(() => discriminatorMap(def));
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isObject(input)) {
      payload.issues.push({
        code: "invalid_type",
        expected: "object",
        input,
        inst
      });
      return payload;
    }
    const value = input?.[def.discriminator];
    const opt = disc.value.get(value);
    if (opt && (value !== void 0 || ctx.direction !== "backward")) {
      return opt._zod.run(payload, ctx);
    }
    if (def.unionFallback || ctx.direction === "backward") {
      return _super(payload, ctx);
    }
    payload.issues.push({
      code: "invalid_union",
      errors: [],
      note: "No matching discriminator",
      discriminator: def.discriminator,
      options: Array.from(disc.value.keys()).filter((value2) => disc.value.get(value2) !== null),
      input,
      path: [def.discriminator],
      inst
    });
    return payload;
  };
});
var $ZodIntersection = /* @__PURE__ */ $constructor("$ZodIntersection", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    const left = def.left._zod.run({ value: input, issues: [] }, ctx);
    const right = def.right._zod.run({ value: input, issues: [] }, ctx);
    const async = left instanceof Promise || right instanceof Promise;
    if (async) {
      return Promise.all([left, right]).then(([left2, right2]) => {
        return handleIntersectionResults(payload, left2, right2);
      });
    }
    return handleIntersectionResults(payload, left, right);
  };
});
function mergeValues(a, b) {
  if (a === b) {
    return { valid: true, data: a };
  }
  if (a instanceof Date && b instanceof Date && +a === +b) {
    return { valid: true, data: a };
  }
  if (isPlainObject(a) && isPlainObject(b)) {
    const bKeys = Object.keys(b);
    const sharedKeys = Object.keys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (const key of sharedKeys) {
      if (key === "__proto__")
        continue;
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [key, ...sharedValue.mergeErrorPath]
        };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  }
  if (Array.isArray(a) && Array.isArray(b)) {
    if (a.length !== b.length) {
      return { valid: false, mergeErrorPath: [] };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return {
          valid: false,
          mergeErrorPath: [index, ...sharedValue.mergeErrorPath]
        };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  }
  return { valid: false, mergeErrorPath: [] };
}
function handleIntersectionResults(result, left, right) {
  const unrecKeys = /* @__PURE__ */ new Map();
  let unrecIssue;
  const keyIssues = /* @__PURE__ */ new Map();
  const collect = (iss, side) => {
    let keys;
    if (iss.code === "unrecognized_keys" && !iss.path?.length) {
      unrecIssue ?? (unrecIssue = iss);
      keys = iss.keys;
    } else if (iss.code === "invalid_key" && iss.origin === "record" && iss.path?.length === 1) {
      const k = String(iss.path[0]);
      if (!keyIssues.has(k))
        keyIssues.set(k, iss);
      keys = [k];
    } else {
      return false;
    }
    for (const k of keys) {
      if (!unrecKeys.has(k))
        unrecKeys.set(k, {});
      unrecKeys.get(k)[side] = true;
    }
    return true;
  };
  for (const iss of left.issues) {
    if (!collect(iss, "l"))
      result.issues.push(iss);
  }
  for (const iss of right.issues) {
    if (!collect(iss, "r"))
      result.issues.push(iss);
  }
  const bothKeys = [...unrecKeys].filter(([, f]) => f.l && f.r).map(([k]) => k);
  if (bothKeys.length) {
    const aggregated = unrecIssue ? bothKeys.filter((k) => unrecIssue.keys.includes(k)) : [];
    if (aggregated.length)
      result.issues.push({ ...unrecIssue, keys: aggregated });
    for (const k of bothKeys) {
      if (!aggregated.includes(k) && keyIssues.has(k))
        result.issues.push(keyIssues.get(k));
    }
  }
  const merged = mergeValues(left.value, right.value);
  if (!merged.valid) {
    if (aborted(result))
      return result;
    throw new Error(`Unmergable intersection. Error path: ${JSON.stringify(merged.mergeErrorPath)}`);
  }
  result.value = merged.data;
  return result;
}
var $ZodRecord = /* @__PURE__ */ $constructor("$ZodRecord", (inst, def) => {
  $ZodType.init(inst, def);
  const memo2 = globalConfig.memoizer;
  memo2?.attach(inst);
  inst._zod.parse = (payload, ctx) => {
    const input = payload.value;
    if (!isPlainObject(input)) {
      payload.issues.push({
        expected: "record",
        code: "invalid_type",
        input,
        inst
      });
      return payload;
    }
    const proms = [];
    const values = def.keyType._zod.values;
    if (values && !def.partial) {
      payload.value = memo2 ? memo2.alloc(inst, payload, {}, ctx) : {};
      const recordKeys = /* @__PURE__ */ new Set();
      for (const key of values) {
        if (typeof key === "string" || typeof key === "number" || typeof key === "symbol") {
          recordKeys.add(typeof key === "number" ? key.toString() : key);
          if (key === "__proto__")
            continue;
          const keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
          if (keyResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (keyResult.issues.length) {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
            continue;
          }
          const outKey = keyResult.value;
          if (outKey === "__proto__")
            continue;
          const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
          if (result instanceof Promise) {
            proms.push(result.then((result2) => {
              if (result2.issues.length) {
                payload.issues.push(...prefixIssues(key, result2.issues));
              }
              payload.value[outKey] = result2.value;
            }));
          } else {
            if (result.issues.length) {
              payload.issues.push(...prefixIssues(key, result.issues));
            }
            payload.value[outKey] = result.value;
          }
        }
      }
      let unrecognized;
      for (const key in input) {
        if (!recordKeys.has(key)) {
          if (def.mode === "loose") {
            if (key === "__proto__")
              continue;
            payload.value[key] = input[key];
          } else {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          }
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    } else {
      payload.value = memo2 ? memo2.alloc(inst, payload, {}, ctx) : {};
      let unrecognized;
      for (const key of Reflect.ownKeys(input)) {
        if (key === "__proto__")
          continue;
        if (!Object.prototype.propertyIsEnumerable.call(input, key))
          continue;
        let keyResult = def.keyType._zod.run({ value: key, issues: [] }, ctx);
        if (keyResult instanceof Promise) {
          throw new Error("Async schemas not supported in object keys currently");
        }
        const checkNumericKey = typeof key === "string" && number.test(key) && keyResult.issues.length;
        if (checkNumericKey) {
          const retryResult = def.keyType._zod.run({ value: Number(key), issues: [] }, ctx);
          if (retryResult instanceof Promise) {
            throw new Error("Async schemas not supported in object keys currently");
          }
          if (retryResult.issues.length === 0) {
            keyResult = retryResult;
          }
        }
        if (keyResult.issues.length) {
          if (def.mode === "loose") {
            payload.value[key] = input[key];
          } else if (values) {
            unrecognized = unrecognized ?? [];
            unrecognized.push(key);
          } else {
            payload.issues.push({
              code: "invalid_key",
              origin: "record",
              issues: keyResult.issues.map((iss) => finalizeIssue(iss, ctx, config())),
              input: key,
              path: [key],
              inst
            });
          }
          continue;
        }
        const outKey = keyResult.value;
        if (outKey === "__proto__")
          continue;
        const result = def.valueType._zod.run({ value: input[key], issues: [] }, ctx);
        if (result instanceof Promise) {
          proms.push(result.then((result2) => {
            if (result2.issues.length) {
              payload.issues.push(...prefixIssues(key, result2.issues));
            }
            payload.value[outKey] = result2.value;
          }));
        } else {
          if (result.issues.length) {
            payload.issues.push(...prefixIssues(key, result.issues));
          }
          payload.value[outKey] = result.value;
        }
      }
      if (unrecognized && unrecognized.length > 0) {
        payload.issues.push({
          code: "unrecognized_keys",
          input,
          inst,
          keys: unrecognized,
          continue: true
        });
      }
    }
    if (proms.length) {
      return Promise.all(proms).then(() => payload);
    }
    return payload;
  };
});
var $ZodEnum = /* @__PURE__ */ $constructor("$ZodEnum", (inst, def) => {
  $ZodType.init(inst, def);
  const values = getEnumValues(def.entries);
  const valuesSet = new Set(values);
  inst._zod.values = valuesSet;
  defineLazyInternal(inst, "pattern", (zod) => {
    const patternValues = getEnumValues(zod.def.entries).filter((k) => propertyKeyTypes.has(typeof k));
    return new RegExp(patternValues.length ? `^(${patternValues.map((o) => escapeRegex(o.toString())).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (valuesSet.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodLiteral = /* @__PURE__ */ $constructor("$ZodLiteral", (inst, def) => {
  $ZodType.init(inst, def);
  const values = new Set(def.values);
  inst._zod.values = values;
  defineLazyInternal(inst, "pattern", (zod) => {
    const vals = zod.def.values;
    return new RegExp(vals.length ? `^(${vals.map((o) => typeof o === "string" ? escapeRegex(o) : o ? escapeRegex(o.toString()) : String(o)).join("|")})$` : "^[^\\s\\S]$");
  });
  inst._zod.parse = (payload, _ctx) => {
    const input = payload.value;
    if (values.has(input)) {
      return payload;
    }
    payload.issues.push({
      code: "invalid_value",
      values: def.values,
      input,
      inst
    });
    return payload;
  };
});
var $ZodTransform = /* @__PURE__ */ $constructor("$ZodTransform", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "optional";
  globalConfig.memoizer?.guard(inst);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    const _out = def.transform(payload.value, payload);
    if (ctx.async) {
      const output = _out instanceof Promise ? _out : Promise.resolve(_out);
      return output.then((output2) => {
        payload.value = output2;
        return payload;
      });
    }
    if (_out instanceof Promise) {
      throw new $ZodAsyncError();
    }
    payload.value = _out;
    return payload;
  };
});
function handleOptionalResult(payload, result) {
  payload.value = result.issues.length ? void 0 : result.value;
  return payload;
}
var $ZodOptional = /* @__PURE__ */ $constructor("$ZodOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  inst._zod.optout = "optional";
  defineLazyInternal(inst, "values", (zod) => {
    const values = zod.def.innerType._zod.values;
    return values ? /* @__PURE__ */ new Set([...values, void 0]) : void 0;
  });
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern2 = zod.def.innerType._zod.pattern;
    return pattern2 ? new RegExp(`^(${cleanRegex(pattern2.source)})?$`) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === void 0) {
      if (def.innerType._zod.optin !== "defaulted")
        return payload;
      const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
      if (result instanceof Promise)
        return result.then((result2) => handleOptionalResult(payload, result2));
      return handleOptionalResult(payload, result);
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodExactOptional = /* @__PURE__ */ $constructor("$ZodExactOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "pattern", (zod) => zod.def.innerType._zod.pattern);
  inst._zod.parse = (payload, ctx) => {
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNullable = /* @__PURE__ */ $constructor("$ZodNullable", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "pattern", (zod) => {
    const pattern2 = zod.def.innerType._zod.pattern;
    return pattern2 ? new RegExp(`^(${cleanRegex(pattern2.source)}|null)$`) : void 0;
  });
  defineLazyInternal(inst, "values", (zod) => {
    return zod.def.innerType._zod.values ? /* @__PURE__ */ new Set([...zod.def.innerType._zod.values, null]) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    if (payload.value === null)
      return payload;
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodDefault = /* @__PURE__ */ $constructor("$ZodDefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
      return payload;
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleDefaultResult(result2, def));
    }
    return handleDefaultResult(result, def);
  };
});
function handleDefaultResult(payload, def) {
  if (payload.value === void 0) {
    payload.value = def.defaultValue;
  }
  return payload;
}
var $ZodPrefault = /* @__PURE__ */ $constructor("$ZodPrefault", (inst, def) => {
  $ZodType.init(inst, def);
  inst._zod.optin = "defaulted";
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    if (payload.value === void 0) {
      payload.value = def.defaultValue;
    }
    return def.innerType._zod.run(payload, ctx);
  };
});
var $ZodNonOptional = /* @__PURE__ */ $constructor("$ZodNonOptional", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => {
    const v = zod.def.innerType._zod.values;
    return v ? new Set([...v].filter((x) => x !== void 0)) : void 0;
  });
  inst._zod.parse = (payload, ctx) => {
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleNonOptionalResult(result2, inst));
    }
    return handleNonOptionalResult(result, inst);
  };
});
function handleNonOptionalResult(payload, inst) {
  if (!payload.issues.length && payload.value === void 0) {
    payload.issues.push({
      code: "invalid_type",
      expected: "nonoptional",
      input: payload.value,
      inst
    });
  }
  return payload;
}
function handleCatchResult(payload, result, def, ctx) {
  if (!result.issues.length) {
    payload.value = result.value;
    if (result.memo)
      payload.memo = true;
    return payload;
  }
  payload.value = def.catchValue({
    ...result,
    value: payload.value,
    error: {
      issues: result.issues.map((iss) => finalizeIssue(iss, ctx, config()))
    },
    input: payload.value
  });
  return payload;
}
var $ZodCatch = /* @__PURE__ */ $constructor("$ZodCatch", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType._zod.optin === "defaulted" ? "defaulted" : "optional");
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType._zod.optout);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run({ value: payload.value, issues: [] }, ctx);
    if (result instanceof Promise) {
      return result.then((result2) => handleCatchResult(payload, result2, def, ctx));
    }
    return handleCatchResult(payload, result, def, ctx);
  };
});
var $ZodPipe = /* @__PURE__ */ $constructor("$ZodPipe", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "values", (zod) => zod.def.in._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.in._zod.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.out._zod.optout);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.in._zod.propValues);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      const right = def.out._zod.run(payload, ctx);
      if (right instanceof Promise) {
        return right.then((right2) => handlePipeResult(right2, def.in, ctx));
      }
      return handlePipeResult(right, def.in, ctx);
    }
    const left = def.in._zod.run(payload, ctx);
    if (left instanceof Promise) {
      return left.then((left2) => handlePipeResult(left2, def.out, ctx));
    }
    return handlePipeResult(left, def.out, ctx);
  };
});
function handlePipeResult(left, next, ctx) {
  if (left.issues.some((iss) => iss.code !== "unrecognized_keys")) {
    left.aborted = true;
    return left;
  }
  return next._zod.run({ value: left.value, issues: left.issues }, ctx);
}
var $ZodPreprocess = /* @__PURE__ */ $constructor("$ZodPreprocess", (inst, def) => {
  $ZodPipe.init(inst, def);
});
var $ZodReadonly = /* @__PURE__ */ $constructor("$ZodReadonly", (inst, def) => {
  $ZodType.init(inst, def);
  defineLazyInternal(inst, "propValues", (zod) => zod.def.innerType._zod.propValues);
  defineLazyInternal(inst, "values", (zod) => zod.def.innerType._zod.values);
  defineLazyInternal(inst, "optin", (zod) => zod.def.innerType?._zod?.optin);
  defineLazyInternal(inst, "optout", (zod) => zod.def.innerType?._zod?.optout);
  inst._zod.parse = (payload, ctx) => {
    if (ctx.direction === "backward") {
      return def.innerType._zod.run(payload, ctx);
    }
    const result = def.innerType._zod.run(payload, ctx);
    if (result instanceof Promise) {
      return result.then(handleReadonlyResult);
    }
    return handleReadonlyResult(result);
  };
});
function handleReadonlyResult(payload) {
  if (!payload.memo)
    payload.value = Object.freeze(payload.value);
  return payload;
}
var $ZodCustom = /* @__PURE__ */ $constructor("$ZodCustom", (inst, def) => {
  $ZodCheck.init(inst, def);
  $ZodType.init(inst, def);
  inst._zod.parse = (payload, _) => {
    return payload;
  };
  inst._zod.check = (payload) => {
    const input = payload.value;
    const r = def.fn(input);
    if (r instanceof Promise) {
      return r.then((r2) => handleRefineResult(r2, payload, input, inst));
    }
    handleRefineResult(r, payload, input, inst);
    return;
  };
});
function handleRefineResult(result, payload, input, inst) {
  if (!result) {
    const _iss = {
      code: "custom",
      input,
      inst,
      // incorporates params.error into issue reporting
      path: [...inst._zod.def.path ?? []],
      // incorporates params.error into issue reporting
      continue: !inst._zod.def.abort
      // params: inst._zod.def.params,
    };
    if (inst._zod.def.params)
      _iss.params = inst._zod.def.params;
    payload.issues.push(issue(_iss));
  }
}

// node_modules/zod/v4/core/memoizer.js
var $ZodCyclicError = class extends Error {
  constructor() {
    super(`Cannot parse a reference cycle that closes through a transform`);
    this.name = "ZodCyclicError";
  }
};
var STATE = "~memo";
var NO_ISSUES = [];
function isRef(value) {
  return value !== null && typeof value === "object";
}
function cloneIssues(issues) {
  return issues.map((iss) => iss.path ? { ...iss, path: iss.path.slice() } : { ...iss });
}
var recursive = /* @__PURE__ */ new WeakMap();
var NONE = 0;
var ASSUMED = 1;
var PROVEN = 2;
function isRecursive(inst, stack, resolve) {
  const cached2 = recursive.get(inst);
  if (cached2 !== void 0)
    return cached2 ? PROVEN : NONE;
  if (stack.has(inst))
    return PROVEN;
  stack.add(inst);
  let result = NONE;
  const check = (child) => {
    if (result !== PROVEN && child?._zod) {
      const answer = isRecursive(child, stack, resolve);
      if (answer > result)
        result = answer;
    }
  };
  const shape = (sh, spread) => {
    let answer = NONE;
    for (const key of Reflect.ownKeys(sh)) {
      const desc = Object.getOwnPropertyDescriptor(sh, key);
      if (spread && !desc.enumerable)
        continue;
      const child = desc.get ? ASSUMED : desc.value?._zod ? isRecursive(desc.value, stack, resolve) : NONE;
      if (child > answer)
        answer = child;
    }
    return answer;
  };
  const merge2 = (answer) => {
    if (answer > result)
      result = answer;
  };
  const def = inst._zod.def;
  const kind = def.type;
  switch (kind) {
    case "object": {
      const raw = rawShape(def);
      merge2(raw ? shape(raw, true) : ASSUMED);
      check(def.catchall);
      break;
    }
    case "array":
      check(def.element);
      break;
    case "tuple":
      for (const el of def.items)
        check(el);
      check(def.rest);
      break;
    case "record":
    case "map":
      check(def.keyType);
      check(def.valueType);
      break;
    case "set":
      check(def.valueType);
      break;
    case "union":
      for (const el of def.options)
        check(el);
      break;
    case "intersection":
      check(def.left);
      check(def.right);
      break;
    case "optional":
    case "nullable":
    case "default":
    case "prefault":
    case "catch":
    case "readonly":
    case "nonoptional":
    case "promise":
    case "success":
      check(def.innerType);
      break;
    case "pipe":
      check(def.in);
      check(def.out);
      break;
    case "function":
      check(def.input);
      check(def.output);
      break;
    // `$ZodLazy` caches its inner on the def, so a resolved edge is followed exactly
    case "lazy": {
      const inner = def._cachedInner ?? (resolve ? inst._zod.innerType : void 0);
      merge2(inner ? isRecursive(inner, stack, false) : ASSUMED);
      break;
    }
    // a leaf by choice: `parts` are regex fragments, not data positions
    case "template_literal":
    // leaves
    case "string":
    case "number":
    case "int":
    case "boolean":
    case "bigint":
    case "symbol":
    case "undefined":
    case "null":
    case "void":
    case "never":
    case "any":
    case "unknown":
    case "date":
    case "nan":
    case "enum":
    case "literal":
    case "file":
    case "transform":
    case "custom":
      break;
    default: {
      kind;
      for (const key in def) {
        const desc = Object.getOwnPropertyDescriptor(def, key);
        if (!desc || desc.get)
          continue;
        const value = desc.value;
        if (!value || typeof value !== "object")
          continue;
        if (value._zod)
          check(value);
        else if (Array.isArray(value))
          for (const el of value)
            check(el);
      }
    }
  }
  stack.delete(inst);
  return settle(inst, result);
}
function settle(inst, answer) {
  if (answer !== ASSUMED)
    recursive.set(inst, answer === PROVEN);
  return answer;
}
function bucketFor(state, inst) {
  let bucket = state.buckets.get(inst);
  if (!bucket) {
    bucket = /* @__PURE__ */ new WeakMap();
    state.buckets.set(inst, bucket);
  }
  return bucket;
}
var handoff;
var open = [];
var memo = {
  alloc(_inst, payload, empty) {
    const bucket = handoff;
    if (!bucket)
      return empty;
    handoff = void 0;
    const entry = { value: empty, issues: null };
    bucket.set(payload.value, entry);
    open.push(entry);
    return empty;
  },
  guard(inst) {
    var _a3;
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (ctx.direction !== "backward" && isBackEdge(ctx, payload.value))
          throw new $ZodCyclicError();
        return base(payload, ctx);
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  },
  attach(inst) {
    var _a3;
    let isRecursiveInst;
    let rechecked = false;
    let lastCtx;
    let lastBucket;
    (_a3 = inst._zod).deferred ?? (_a3.deferred = []);
    inst._zod.deferred.push(() => {
      const base = inst._zod.parse;
      const wrapped = (payload, ctx) => {
        if (isRecursiveInst === void 0) {
          const walked = isRecursive(inst, /* @__PURE__ */ new Set(), false);
          if (walked === NONE) {
            inst._zod.parse = base;
            if (inst._zod.run === wrapped)
              inst._zod.run = base;
            return base(payload, ctx);
          }
          if (walked === PROVEN || rechecked)
            isRecursiveInst = true;
          else
            rechecked = true;
        }
        const input = payload.value;
        if (!isRef(input))
          return base(payload, ctx);
        let state = ctx[STATE];
        if (!state) {
          state = { buckets: /* @__PURE__ */ new WeakMap(), backEdges: void 0 };
          ctx[STATE] = state;
        }
        let bucket;
        if (lastCtx === ctx) {
          bucket = lastBucket;
        } else {
          bucket = bucketFor(state, inst);
          lastCtx = ctx;
          lastBucket = bucket;
        }
        const hit = bucket.get(input);
        if (hit) {
          payload.value = hit.value;
          if (hit.issues) {
            if (hit.issues.length)
              payload.issues.push(...cloneIssues(hit.issues));
          } else {
            payload.memo = true;
            state.backEdges ?? (state.backEdges = /* @__PURE__ */ new WeakSet());
            state.backEdges.add(hit.value);
          }
          return payload;
        }
        handoff = bucket;
        const depth = open.length;
        const result = base(payload, ctx);
        handoff = void 0;
        const entry = open.length > depth ? open.pop() : void 0;
        if (result instanceof Promise) {
          return result.then((r) => {
            if (entry)
              entry.issues = r.issues.length ? cloneIssues(r.issues) : NO_ISSUES;
            return r;
          });
        }
        if (entry)
          entry.issues = result.issues.length ? cloneIssues(result.issues) : NO_ISSUES;
        return result;
      };
      inst._zod.parse = wrapped;
      if (inst._zod.run === base)
        inst._zod.run = wrapped;
    });
  }
};
function memoizer() {
  return memo;
}
function isBackEdge(ctx, value) {
  const backEdges = ctx[STATE]?.backEdges;
  return backEdges !== void 0 && isRef(value) && backEdges.has(value);
}

// node_modules/zod/v4/locales/en.js
var error = () => {
  const Sizable = {
    string: { unit: "characters", verb: "to have" },
    file: { unit: "bytes", verb: "to have" },
    array: { unit: "items", verb: "to have" },
    set: { unit: "items", verb: "to have" },
    map: { unit: "entries", verb: "to have" }
  };
  function getSizing(origin) {
    return Sizable[origin] ?? null;
  }
  const FormatDictionary = {
    regex: "input",
    email: "email address",
    url: "URL",
    emoji: "emoji",
    uuid: "UUID",
    uuidv4: "UUIDv4",
    uuidv6: "UUIDv6",
    nanoid: "nanoid",
    guid: "GUID",
    cuid: "cuid",
    cuid2: "cuid2",
    ulid: "ULID",
    xid: "XID",
    ksuid: "KSUID",
    datetime: "ISO datetime",
    date: "ISO date",
    time: "ISO time",
    duration: "ISO duration",
    ipv4: "IPv4 address",
    ipv6: "IPv6 address",
    mac: "MAC address",
    cidrv4: "IPv4 range",
    cidrv6: "IPv6 range",
    base64: "base64-encoded string",
    base64url: "base64url-encoded string",
    json_string: "JSON string",
    e164: "E.164 number",
    currency_code: "currency code",
    credit_card: "credit card number",
    iban: "IBAN",
    jwt: "JWT",
    template_literal: "input"
  };
  const TypeDictionary = {
    // Compatibility: "nan" -> "NaN" for display
    nan: "NaN"
    // All other type names omitted - they fall back to raw values via ?? operator
  };
  function getTypeName(type, input) {
    if (type === "number" && typeof input === "number" && !Number.isFinite(input)) {
      return String(input);
    }
    return TypeDictionary[type] ?? type;
  }
  return (issue2) => {
    switch (issue2.code) {
      case "invalid_type": {
        const expected = getTypeName(issue2.expected);
        const receivedType = parsedType(issue2.input);
        const received = getTypeName(receivedType, issue2.input);
        return `Invalid input: expected ${expected}, received ${received}`;
      }
      case "invalid_value":
        if (issue2.values.length === 1)
          return `Invalid input: expected ${stringifyPrimitive(issue2.values[0])}`;
        return `Invalid option: expected one of ${joinValues(issue2.values, "|")}`;
      case "too_big": {
        const adj = issue2.exact ? "exactly " : issue2.inclusive ? "<=" : "<";
        const sizing = getSizing(issue2.origin);
        if (sizing)
          return `Too big: expected ${issue2.origin ?? "value"} to have ${adj}${issue2.maximum.toString()} ${sizing.unit ?? "elements"}`;
        return `Too big: expected ${issue2.origin ?? "value"} to be ${adj}${issue2.maximum.toString()}`;
      }
      case "too_small": {
        const adj = issue2.exact ? "exactly " : issue2.inclusive ? ">=" : ">";
        const sizing = getSizing(issue2.origin);
        if (sizing) {
          return `Too small: expected ${issue2.origin} to have ${adj}${issue2.minimum.toString()} ${sizing.unit}`;
        }
        return `Too small: expected ${issue2.origin} to be ${adj}${issue2.minimum.toString()}`;
      }
      case "invalid_format": {
        const _issue = issue2;
        if (_issue.format === "starts_with") {
          return `Invalid string: must start with "${_issue.prefix}"`;
        }
        if (_issue.format === "ends_with")
          return `Invalid string: must end with "${_issue.suffix}"`;
        if (_issue.format === "includes")
          return `Invalid string: must include "${_issue.includes}"`;
        if (_issue.format === "regex")
          return `Invalid string: must match pattern ${_issue.pattern}`;
        return `Invalid ${FormatDictionary[_issue.format] ?? issue2.format}`;
      }
      case "not_multiple_of":
        return `Invalid number: must be a multiple of ${issue2.divisor}`;
      case "unrecognized_keys":
        return `Unrecognized key${issue2.keys.length > 1 ? "s" : ""}: ${joinValues(issue2.keys, ", ")}`;
      case "invalid_key":
        return `Invalid key in ${issue2.origin}`;
      case "invalid_union":
        if (issue2.options && Array.isArray(issue2.options) && issue2.options.length > 0) {
          const opts = issue2.options.map((o) => `'${o}'`).join(" | ");
          return `Invalid discriminator value. Expected ${opts}`;
        }
        if (issue2.inclusive === false) {
          return "Invalid input: more than one option matched";
        }
        return "Invalid input";
      case "invalid_element":
        return `Invalid value in ${issue2.origin}`;
      default:
        return `Invalid input`;
    }
  };
};
function en_default() {
  return {
    localeError: error()
  };
}

// node_modules/zod/v4/core/registries.js
var _a2;
var $ZodRegistry = class {
  constructor() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
  }
  add(schema, ..._meta) {
    const meta2 = _meta[0];
    this._map.set(schema, meta2);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.set(meta2.id, schema);
    }
    return this;
  }
  clear() {
    this._map = /* @__PURE__ */ new WeakMap();
    this._idmap = /* @__PURE__ */ new Map();
    return this;
  }
  remove(schema) {
    const meta2 = this._map.get(schema);
    if (meta2 && typeof meta2 === "object" && "id" in meta2) {
      this._idmap.delete(meta2.id);
    }
    this._map.delete(schema);
    return this;
  }
  get(schema) {
    const p = schema._zod.parent;
    if (p) {
      const pm = { ...this.get(p) ?? {} };
      delete pm.id;
      const f = { ...pm, ...this._map.get(schema) };
      return Object.keys(f).length ? f : void 0;
    }
    return this._map.get(schema);
  }
  has(schema) {
    return this._map.has(schema);
  }
};
function registry() {
  return new $ZodRegistry();
}
(_a2 = globalThis).__zod_globalRegistry ?? (_a2.__zod_globalRegistry = registry());
var globalRegistry = globalThis.__zod_globalRegistry;

// node_modules/zod/v4/core/api.js
function snapshotChecks(def) {
  if (def.checks)
    def.checks = [...def.checks];
  return def;
}
// @__NO_SIDE_EFFECTS__
function _string(Class2, params) {
  return new Class2(snapshotChecks({ type: "string", ...normalizeParams(params) }));
}
// @__NO_SIDE_EFFECTS__
function _email(Class2, params) {
  return new Class2({
    type: "string",
    format: "email",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _guid(Class2, params) {
  return new Class2({
    type: "string",
    format: "guid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v4",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v6",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uuidv7(Class2, params) {
  return new Class2({
    type: "string",
    format: "uuid",
    check: "string_format",
    abort: false,
    version: "v7",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _url(Class2, params) {
  return new Class2({
    type: "string",
    format: "url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _emoji2(Class2, params) {
  return new Class2({
    type: "string",
    format: "emoji",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _nanoid(Class2, params) {
  return new Class2({
    type: "string",
    format: "nanoid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cuid2(Class2, params) {
  return new Class2({
    type: "string",
    format: "cuid2",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ulid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ulid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _xid(Class2, params) {
  return new Class2({
    type: "string",
    format: "xid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ksuid(Class2, params) {
  return new Class2({
    type: "string",
    format: "ksuid",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _ipv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "ipv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv4(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv4",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _cidrv6(Class2, params) {
  return new Class2({
    type: "string",
    format: "cidrv6",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _base64url(Class2, params) {
  return new Class2({
    type: "string",
    format: "base64url",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _e164(Class2, params) {
  return new Class2({
    type: "string",
    format: "e164",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _jwt(Class2, params) {
  return new Class2({
    type: "string",
    format: "jwt",
    check: "string_format",
    abort: false,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDateTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "datetime",
    check: "string_format",
    offset: false,
    local: false,
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDate(Class2, params) {
  return new Class2({
    type: "string",
    format: "date",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoTime(Class2, params) {
  return new Class2({
    type: "string",
    format: "time",
    check: "string_format",
    precision: null,
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _isoDuration(Class2, params) {
  return new Class2({
    type: "string",
    format: "duration",
    check: "string_format",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _number(Class2, params) {
  return new Class2(snapshotChecks({ type: "number", checks: [], ...normalizeParams(params) }));
}
// @__NO_SIDE_EFFECTS__
function _int(Class2, params) {
  return new Class2({
    type: "number",
    check: "number_format",
    abort: false,
    format: "safeint",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _boolean(Class2, params) {
  return new Class2({
    type: "boolean",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _null2(Class2, params) {
  return new Class2({
    type: "null",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _unknown(Class2) {
  return new Class2({
    type: "unknown"
  });
}
// @__NO_SIDE_EFFECTS__
function _never(Class2, params) {
  return new Class2({
    type: "never",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _lt(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _lte(value, params) {
  return new $ZodCheckLessThan({
    check: "less_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _gt(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: false
  });
}
// @__NO_SIDE_EFFECTS__
function _gte(value, params) {
  return new $ZodCheckGreaterThan({
    check: "greater_than",
    ...normalizeParams(params),
    value,
    inclusive: true
  });
}
// @__NO_SIDE_EFFECTS__
function _multipleOf(value, params) {
  return new $ZodCheckMultipleOf({
    check: "multiple_of",
    ...normalizeParams(params),
    value
  });
}
// @__NO_SIDE_EFFECTS__
function _maxLength(maximum, params) {
  const ch = new $ZodCheckMaxLength({
    check: "max_length",
    ...normalizeParams(params),
    maximum
  });
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _minLength(minimum, params) {
  return new $ZodCheckMinLength({
    check: "min_length",
    ...normalizeParams(params),
    minimum
  });
}
// @__NO_SIDE_EFFECTS__
function _length(length, params) {
  return new $ZodCheckLengthEquals({
    check: "length_equals",
    ...normalizeParams(params),
    length
  });
}
// @__NO_SIDE_EFFECTS__
function _regex(pattern2, params) {
  return new $ZodCheckRegex({
    check: "string_format",
    format: "regex",
    ...normalizeParams(params),
    pattern: pattern2
  });
}
// @__NO_SIDE_EFFECTS__
function _lowercase(params) {
  return new $ZodCheckLowerCase({
    check: "string_format",
    format: "lowercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _uppercase(params) {
  return new $ZodCheckUpperCase({
    check: "string_format",
    format: "uppercase",
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _includes(includes, params) {
  return new $ZodCheckIncludes({
    check: "string_format",
    format: "includes",
    ...normalizeParams(params),
    includes
  });
}
// @__NO_SIDE_EFFECTS__
function _startsWith(prefix, params) {
  return new $ZodCheckStartsWith({
    check: "string_format",
    format: "starts_with",
    ...normalizeParams(params),
    prefix
  });
}
// @__NO_SIDE_EFFECTS__
function _endsWith(suffix, params) {
  return new $ZodCheckEndsWith({
    check: "string_format",
    format: "ends_with",
    ...normalizeParams(params),
    suffix
  });
}
// @__NO_SIDE_EFFECTS__
function _overwrite(tx) {
  return new $ZodCheckOverwrite({
    check: "overwrite",
    tx
  });
}
// @__NO_SIDE_EFFECTS__
function _normalize(form) {
  return /* @__PURE__ */ _overwrite((input) => input.normalize(form));
}
// @__NO_SIDE_EFFECTS__
function _trim() {
  return /* @__PURE__ */ _overwrite((input) => input.trim());
}
// @__NO_SIDE_EFFECTS__
function _toLowerCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toLowerCase());
}
// @__NO_SIDE_EFFECTS__
function _toUpperCase() {
  return /* @__PURE__ */ _overwrite((input) => input.toUpperCase());
}
// @__NO_SIDE_EFFECTS__
function _slugify() {
  return /* @__PURE__ */ _overwrite((input) => slugify(input));
}
// @__NO_SIDE_EFFECTS__
function _array(Class2, element, params) {
  return new Class2({
    type: "array",
    element,
    // get element() {
    //   return element;
    // },
    ...normalizeParams(params)
  });
}
// @__NO_SIDE_EFFECTS__
function _custom(Class2, fn, _params) {
  const norm = normalizeParams(_params);
  norm.abort ?? (norm.abort = true);
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...norm
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _refine(Class2, fn, _params) {
  const schema = new Class2({
    type: "custom",
    check: "custom",
    fn,
    ...normalizeParams(_params)
  });
  return schema;
}
// @__NO_SIDE_EFFECTS__
function _superRefine(fn, params) {
  const ch = /* @__PURE__ */ _check((payload) => {
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(issue(issue2, payload.value, ch._zod.def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = ch);
        _issue.continue ?? (_issue.continue = !ch._zod.def.abort);
        payload.issues.push(issue(_issue));
      }
    };
    return fn(payload.value, payload);
  }, params);
  return ch;
}
// @__NO_SIDE_EFFECTS__
function _check(fn, params) {
  const ch = new $ZodCheck({
    check: "custom",
    ...normalizeParams(params)
  });
  ch._zod.check = fn;
  return ch;
}

// node_modules/zod/v4/core/to-json-schema.js
function assignProps(target, ...sources) {
  for (const source of sources) {
    for (const key of Reflect.ownKeys(source)) {
      if (Object.prototype.propertyIsEnumerable.call(source, key)) {
        assignProp(target, key, source[key]);
      }
    }
  }
  return target;
}
function initializeContext(params) {
  let target = params?.target ?? "draft-2020-12";
  if (target === "draft-4")
    target = "draft-04";
  if (target === "draft-7")
    target = "draft-07";
  return {
    processors: params.processors ?? {},
    metadataRegistry: params?.metadata ?? globalRegistry,
    target,
    unrepresentable: params?.unrepresentable ?? "throw",
    override: params?.override ?? (() => {
    }),
    io: params?.io ?? "output",
    counter: 0,
    seen: /* @__PURE__ */ new Map(),
    sharedDefsExtractedFor: void 0,
    sharedEmitDoneFor: void 0,
    cycles: params?.cycles ?? "ref",
    reused: params?.reused ?? "inline",
    intersections: [],
    deferred: [],
    external: params?.external ?? void 0
  };
}
function handleUnrepresentable(schema, ctx, json, params, message) {
  const result = typeof ctx.unrepresentable === "function" ? ctx.unrepresentable({ zodSchema: schema, path: params.path, message }) : ctx.unrepresentable;
  if (result === "any")
    return false;
  if (result === void 0 || result === "throw")
    throw new Error(message);
  Object.assign(json, result);
  return true;
}
function processSchema(schema, ctx, _params = { path: [], schemaPath: [] }) {
  var _a3;
  const def = schema._zod.def;
  const seen = ctx.seen.get(schema);
  if (seen) {
    seen.count++;
    const isCycle = _params.schemaPath.includes(schema);
    if (isCycle) {
      seen.cycle = _params.path;
    }
    return seen.schema;
  }
  const result = { schema: {}, count: 1, cycle: void 0, path: _params.path };
  ctx.seen.set(schema, result);
  ctx.sharedDefsExtractedFor = void 0;
  ctx.sharedEmitDoneFor = void 0;
  const overrideSchema = schema._zod.toJSONSchema?.();
  if (overrideSchema) {
    result.schema = overrideSchema;
  } else {
    const params = {
      ..._params,
      schemaPath: [..._params.schemaPath, schema],
      path: _params.path
    };
    if (schema._zod.processJSONSchema) {
      schema._zod.processJSONSchema(ctx, result.schema, params);
    } else {
      const _json = result.schema;
      const processor = ctx.processors[def.type];
      if (!processor) {
        throw new Error(`[toJSONSchema]: Non-representable type encountered: ${def.type}`);
      }
      processor(schema, ctx, _json, params);
    }
    const parent = schema._zod.parent;
    if (parent) {
      if (!result.ref)
        result.ref = parent;
      processSchema(parent, ctx, params);
      ctx.seen.get(parent).isParent = true;
    }
  }
  const meta2 = ctx.metadataRegistry.get(schema);
  if (meta2)
    assignProps(result.schema, meta2);
  if (ctx.io === "input" && isTransforming(schema)) {
    delete result.schema.examples;
    delete result.schema.default;
  }
  if (ctx.io === "input" && "_prefault" in result.schema)
    (_a3 = result.schema).default ?? (_a3.default = result.schema._prefault);
  delete result.schema._prefault;
  const _result = ctx.seen.get(schema);
  return _result.schema;
}
function encodeJSONPointerSegment(segment) {
  return segment.replace(/~/g, "~0").replace(/\//g, "~1");
}
function extractDefs(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  if (ctx.external && ctx.sharedDefsExtractedFor === ctx.external)
    return;
  const idToSchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.entries()) {
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      const existing = idToSchema.get(id);
      if (existing && existing !== entry[0]) {
        throw new Error(`Duplicate schema id "${id}" detected during JSON Schema conversion. Two different schemas cannot share the same id when converted together.`);
      }
      idToSchema.set(id, entry[0]);
    }
  }
  const makeURI = (entry) => {
    const defsSegment = ctx.target === "draft-2020-12" ? "$defs" : "definitions";
    if (ctx.external) {
      const externalId = ctx.external.registry.get(entry[0])?.id;
      const uriGenerator = ctx.external.uri ?? ((id2) => id2);
      if (externalId) {
        return { ref: uriGenerator(externalId) };
      }
      const id = entry[1].defId ?? entry[1].schema.id ?? `schema${ctx.counter++}`;
      entry[1].defId = id;
      return { defId: id, ref: `${uriGenerator("__shared")}#/${defsSegment}/${encodeJSONPointerSegment(id)}` };
    }
    const uriPrefix = `#`;
    const defUriPrefix = `${uriPrefix}/${defsSegment}/`;
    if (entry[1] === root && !entry[1].schema.id) {
      return { ref: uriPrefix };
    }
    const defId = entry[1].schema.id ?? `__schema${ctx.counter++}`;
    return { defId, ref: defUriPrefix + encodeJSONPointerSegment(defId) };
  };
  const extractToDef = (entry) => {
    if (entry[1].schema.$ref) {
      return;
    }
    const seen = entry[1];
    const { ref, defId } = makeURI(entry);
    seen.def = { ...seen.schema };
    if (defId)
      seen.defId = defId;
    const schema2 = seen.schema;
    for (const key in schema2) {
      delete schema2[key];
    }
    schema2.$ref = ref;
  };
  if (ctx.cycles === "throw") {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.cycle) {
        throw new Error(`Cycle detected: #/${seen.cycle?.join("/")}/<root>

Set the \`cycles\` parameter to \`"ref"\` to resolve cyclical schemas with defs.`);
      }
    }
  }
  for (const entry of ctx.seen.entries()) {
    const seen = entry[1];
    if (schema === entry[0]) {
      extractToDef(entry);
      continue;
    }
    if (ctx.external) {
      const ext = ctx.external.registry.get(entry[0])?.id;
      if (schema !== entry[0] && ext) {
        extractToDef(entry);
        continue;
      }
    }
    const id = ctx.metadataRegistry.get(entry[0])?.id;
    if (id) {
      extractToDef(entry);
      continue;
    }
    if (seen.cycle) {
      extractToDef(entry);
      continue;
    }
    if (seen.count > 1) {
      if (ctx.reused === "ref") {
        extractToDef(entry);
      }
    }
  }
  if (ctx.external)
    ctx.sharedDefsExtractedFor = ctx.external;
}
function compactTypeUnion(schema) {
  const options = schema.anyOf;
  if (!Array.isArray(options) || options.length === 0 || schema.type !== void 0)
    return;
  const types = [];
  for (const option of options) {
    if (!option || typeof option !== "object")
      return;
    compactTypeUnion(option);
    const keys = Object.keys(option);
    if (keys.length !== 1 || keys[0] !== "type")
      return;
    const type = option.type;
    for (const member of Array.isArray(type) ? type : [type]) {
      if (typeof member !== "string")
        return;
      if (!types.includes(member))
        types.push(member);
    }
  }
  delete schema.anyOf;
  schema.type = types.length === 1 ? types[0] : types;
}
var FOLDABLE_KEYS = /* @__PURE__ */ new Set(["type", "properties", "required", "additionalProperties"]);
var UNION_KEYS = ["oneOf", "anyOf"];
function undeclaredConstraint(member) {
  const extra = member.additionalProperties;
  if (extra === void 0 || extra === false || typeof extra !== "object" || extra === null)
    return null;
  return Object.keys(extra).length ? extra : null;
}
function foldObjects(members2) {
  const objects = [];
  for (const member of members2) {
    if (typeof member !== "object" || member.type !== "object")
      return null;
    for (const key in member) {
      if (!FOLDABLE_KEYS.has(key))
        return null;
    }
    objects.push(member);
  }
  const properties = {};
  const required2 = /* @__PURE__ */ new Set();
  for (const object2 of objects) {
    for (const key in object2.properties) {
      if (Object.prototype.hasOwnProperty.call(properties, key))
        continue;
      const parts = [];
      for (const other of objects) {
        const part = other.properties?.[key] ?? undeclaredConstraint(other);
        if (part === null || part === void 0)
          continue;
        if (!parts.some((seen) => JSON.stringify(seen) === JSON.stringify(part)))
          parts.push(part);
      }
      const merged = parts.length === 1 ? parts[0] : foldObjects(parts) ?? { allOf: parts };
      assignProp(properties, key, merged);
    }
    for (const key of object2.required ?? [])
      required2.add(key);
  }
  const folded = { type: "object", properties };
  if (required2.size)
    folded.required = [...required2];
  if (objects.every((object2) => object2.additionalProperties === false)) {
    folded.additionalProperties = false;
  } else {
    const constraints = [];
    for (const object2 of objects) {
      const constraint = undeclaredConstraint(object2);
      if (constraint && !constraints.some((seen) => JSON.stringify(seen) === JSON.stringify(constraint)))
        constraints.push(constraint);
    }
    if (constraints.length === 1)
      folded.additionalProperties = constraints[0];
    else if (constraints.length > 1)
      folded.additionalProperties = { allOf: constraints };
  }
  return folded;
}
function foldIntersection(json) {
  const allOf = json.allOf;
  if (!Array.isArray(allOf) || allOf.length < 2)
    return;
  for (const key of FOLDABLE_KEYS)
    if (key in json)
      return;
  const unions = allOf.filter((m) => UNION_KEYS.some((k) => Array.isArray(m[k])));
  let folded = null;
  if (!unions.length) {
    folded = foldObjects(allOf);
  } else {
    const union2 = unions[0];
    const keyword = UNION_KEYS.find((k) => Array.isArray(union2[k]));
    if (Object.keys(union2).length !== 1)
      return;
    const rest = allOf.filter((m) => m !== union2);
    const branches = union2[keyword].map((branch) => foldObjects([...rest, branch]));
    if (branches.some((b) => !b))
      return;
    folded = { [keyword]: branches };
  }
  if (!folded)
    return;
  delete json.allOf;
  assignProps(json, folded);
}
function finalize(ctx, schema) {
  const root = ctx.seen.get(schema);
  if (!root)
    throw new Error("Unprocessed schema. This is a bug in Zod.");
  const flattenRef = (zodSchema) => {
    const seen = ctx.seen.get(zodSchema);
    if (seen.ref === null)
      return;
    const schema2 = seen.def ?? seen.schema;
    const _cached = { ...schema2 };
    const ref = seen.ref;
    seen.ref = null;
    if (ref) {
      flattenRef(ref);
      const refSeen = ctx.seen.get(ref);
      const refSchema = refSeen.schema;
      if (refSchema.$ref && (ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0")) {
        schema2.allOf = schema2.allOf ?? [];
        schema2.allOf.push(refSchema);
      } else {
        assignProps(schema2, refSchema);
      }
      assignProps(schema2, _cached);
      const isParentRef = zodSchema._zod.parent === ref;
      if (isParentRef) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (!(key in _cached)) {
            delete schema2[key];
          }
        }
      }
      if (refSchema.$ref && refSeen.def) {
        for (const key in schema2) {
          if (key === "$ref" || key === "allOf")
            continue;
          if (key in refSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(refSeen.def[key])) {
            delete schema2[key];
          }
        }
      }
    }
    const parent = zodSchema._zod.parent;
    if (parent && parent !== ref) {
      flattenRef(parent);
      const parentSeen = ctx.seen.get(parent);
      if (parentSeen?.schema.$ref) {
        schema2.$ref = parentSeen.schema.$ref;
        if (parentSeen.def) {
          for (const key in schema2) {
            if (key === "$ref" || key === "allOf")
              continue;
            if (key in parentSeen.def && JSON.stringify(schema2[key]) === JSON.stringify(parentSeen.def[key])) {
              delete schema2[key];
            }
          }
        }
      }
    }
    ctx.override({
      zodSchema,
      jsonSchema: schema2,
      path: seen.path ?? []
    });
  };
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of [...ctx.seen.entries()].reverse()) {
      flattenRef(entry[0]);
    }
    if (ctx.target !== "openapi-3.0") {
      for (const entry of ctx.seen.entries()) {
        compactTypeUnion(entry[1].def ?? entry[1].schema);
      }
    }
    for (const rewrite of ctx.deferred)
      rewrite();
    if (ctx.intersections.length) {
      const carriers = /* @__PURE__ */ new Map();
      for (const seen of ctx.seen.values()) {
        for (const json of [seen.schema, seen.def]) {
          const allOf = json?.allOf;
          if (!Array.isArray(allOf))
            continue;
          const existing = carriers.get(allOf);
          if (existing)
            existing.push(json);
          else
            carriers.set(allOf, [json]);
        }
      }
      for (const allOf of ctx.intersections) {
        for (const json of carriers.get(allOf) ?? [])
          foldIntersection(json);
      }
    }
  }
  const result = {};
  if (ctx.target === "draft-2020-12") {
    result.$schema = "https://json-schema.org/draft/2020-12/schema";
  } else if (ctx.target === "draft-07") {
    result.$schema = "http://json-schema.org/draft-07/schema#";
  } else if (ctx.target === "draft-04") {
    result.$schema = "http://json-schema.org/draft-04/schema#";
  } else if (ctx.target === "openapi-3.0") {
  } else {
  }
  if (ctx.external?.uri) {
    const id = ctx.external.registry.get(schema)?.id;
    if (!id)
      throw new Error("Schema is missing an `id` property");
    result.$id = ctx.external.uri(id);
  }
  assignProps(result, root.defId ? root.schema : root.def ?? root.schema);
  const rootMetaId = ctx.metadataRegistry.get(schema)?.id;
  if (rootMetaId !== void 0 && result.id === rootMetaId)
    delete result.id;
  const defs = ctx.external?.defs ?? {};
  if (!ctx.external || ctx.sharedEmitDoneFor !== ctx.external) {
    for (const entry of ctx.seen.entries()) {
      const seen = entry[1];
      if (seen.def && seen.defId) {
        if (seen.def.id === seen.defId)
          delete seen.def.id;
        assignProp(defs, seen.defId, seen.def);
      }
    }
  }
  if (ctx.external)
    ctx.sharedEmitDoneFor = ctx.external;
  if (ctx.external) {
  } else {
    if (Object.keys(defs).length > 0) {
      if (ctx.target === "draft-2020-12") {
        result.$defs = defs;
      } else {
        result.definitions = defs;
      }
    }
  }
  try {
    const finalized = JSON.parse(JSON.stringify(result));
    Object.defineProperty(finalized, "~standard", {
      value: {
        ...schema["~standard"],
        jsonSchema: {
          input: createStandardJSONSchemaMethod(schema, "input", ctx.processors),
          output: createStandardJSONSchemaMethod(schema, "output", ctx.processors)
        }
      },
      enumerable: false,
      writable: false
    });
    return finalized;
  } catch (_err) {
    throw new Error("Error converting schema to JSON.");
  }
}
function isTransforming(_schema, _ctx) {
  const ctx = _ctx ?? { seen: /* @__PURE__ */ new Set() };
  if (ctx.seen.has(_schema))
    return false;
  ctx.seen.add(_schema);
  const def = _schema._zod.def;
  if (def.type === "transform")
    return true;
  if (def.type === "array")
    return isTransforming(def.element, ctx);
  if (def.type === "set")
    return isTransforming(def.valueType, ctx);
  if (def.type === "lazy")
    return isTransforming(def.getter(), ctx);
  if (def.type === "promise" || def.type === "optional" || def.type === "nonoptional" || def.type === "nullable" || def.type === "readonly" || def.type === "default" || def.type === "prefault" || def.type === "catch") {
    return isTransforming(def.innerType, ctx);
  }
  if (def.type === "intersection") {
    return isTransforming(def.left, ctx) || isTransforming(def.right, ctx);
  }
  if (def.type === "record" || def.type === "map") {
    return isTransforming(def.keyType, ctx) || isTransforming(def.valueType, ctx);
  }
  if (def.type === "pipe") {
    if (_schema._zod.traits.has("$ZodCodec"))
      return true;
    return isTransforming(def.in, ctx) || isTransforming(def.out, ctx);
  }
  if (def.type === "object") {
    for (const key in def.shape) {
      if (isTransforming(def.shape[key], ctx))
        return true;
    }
    return false;
  }
  if (def.type === "union") {
    for (const option of def.options) {
      if (isTransforming(option, ctx))
        return true;
    }
    return false;
  }
  if (def.type === "tuple") {
    for (const item of def.items) {
      if (isTransforming(item, ctx))
        return true;
    }
    if (def.rest && isTransforming(def.rest, ctx))
      return true;
    return false;
  }
  return false;
}
var createToJSONSchemaMethod = (schema, processors = {}) => (params) => {
  const ctx = initializeContext({ ...params, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};
var createStandardJSONSchemaMethod = (schema, io, processors = {}) => (params) => {
  const { libraryOptions, target } = params ?? {};
  const ctx = initializeContext({ ...libraryOptions ?? {}, target, io, processors });
  processSchema(schema, ctx);
  extractDefs(ctx, schema);
  return finalize(ctx, schema);
};

// node_modules/zod/v4/core/json-schema-processors.js
var narrowMin = (agg, key, value) => {
  if (agg[key] === void 0 || value > agg[key])
    agg[key] = value;
};
var narrowMax = (agg, key, value) => {
  if (agg[key] === void 0 || value < agg[key])
    agg[key] = value;
};
var narrowBoth = (agg, value) => {
  narrowMin(agg, "minimum", value);
  narrowMax(agg, "maximum", value);
};
var addDivisor = (agg, value) => {
  agg.multipleOf ?? (agg.multipleOf = []);
  if (!agg.multipleOf.includes(value))
    agg.multipleOf.push(value);
};
var addPattern = (agg, pattern2) => {
  agg.patterns ?? (agg.patterns = /* @__PURE__ */ new Set());
  agg.patterns.add(pattern2);
};
var intersectMime = (agg, mime) => {
  agg.mime = agg.mime ? agg.mime.filter((m) => mime.includes(m)) : [...mime];
};
var setFormat = (agg, format) => {
  agg.format = format;
  if (format.includes("int"))
    agg.isInt = true;
};
var minContributor = (agg, def) => narrowMin(agg, "minimum", def.minimum);
var maxContributor = (agg, def) => narrowMax(agg, "maximum", def.maximum);
var formatContributor = (ranges) => (agg, def) => {
  setFormat(agg, def.format);
  const [minimum, maximum] = ranges[def.format];
  narrowMin(agg, "minimum", minimum);
  narrowMax(agg, "maximum", maximum);
};
var contributors = {
  greater_than: (agg, def) => narrowMin(agg, def.inclusive ? "minimum" : "exclusiveMinimum", def.value),
  less_than: (agg, def) => narrowMax(agg, def.inclusive ? "maximum" : "exclusiveMaximum", def.value),
  multiple_of: (agg, def) => addDivisor(agg, def.value),
  number_format: formatContributor(NUMBER_FORMAT_RANGES),
  bigint_format: formatContributor(BIGINT_FORMAT_RANGES),
  min_length: minContributor,
  max_length: maxContributor,
  length_equals: (agg, def) => narrowBoth(agg, def.length),
  min_size: minContributor,
  max_size: maxContributor,
  size_equals: (agg, def) => narrowBoth(agg, def.size),
  string_format: (agg, def) => {
    setFormat(agg, def.format);
    if (def.pattern)
      addPattern(agg, def.pattern);
    if (def.format === "base64" || def.format === "base64url")
      agg.contentEncoding = def.format;
    if (def.local || def.precision === -1)
      agg.laxFormat = true;
  },
  mime_type: (agg, def) => intersectMime(agg, def.mime)
};
function aggregateChecks(schema) {
  const agg = {};
  const def = schema._zod.def;
  const list = schema._zod.traits.has("$ZodCheck") ? [schema, ...def.checks ?? []] : def.checks ?? [];
  for (const ch of list)
    contributors[ch._zod.def.check]?.(agg, ch._zod.def);
  const bag = schema._zod.bag;
  if (bag.minimum !== void 0)
    narrowMin(agg, "minimum", bag.minimum);
  if (bag.exclusiveMinimum !== void 0)
    narrowMin(agg, "exclusiveMinimum", bag.exclusiveMinimum);
  if (bag.maximum !== void 0)
    narrowMax(agg, "maximum", bag.maximum);
  if (bag.exclusiveMaximum !== void 0)
    narrowMax(agg, "exclusiveMaximum", bag.exclusiveMaximum);
  if (bag.multipleOf !== void 0)
    addDivisor(agg, bag.multipleOf);
  if (bag.format !== void 0) {
    agg.format ?? (agg.format = bag.format);
    if (bag.format.includes("int"))
      agg.isInt = true;
  }
  if (bag.mime)
    intersectMime(agg, bag.mime);
  for (const pattern2 of bag.patterns ?? [])
    addPattern(agg, pattern2);
  return agg;
}
var formatMap = {
  guid: "uuid",
  url: "uri",
  datetime: "date-time",
  json_string: "json-string",
  regex: ""
  // do not set
};
var exactPatterns = /* @__PURE__ */ new Map([
  [base64Charset, base64],
  [base64urlCharset, base64url]
]);
var exactPattern = (p) => exactPatterns.get(p) ?? p;
var stringProcessor = (schema, ctx, _json, _params) => {
  const json = _json;
  json.type = "string";
  const { minimum, maximum, format, patterns, contentEncoding, laxFormat } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minLength = minimum;
  if (typeof maximum === "number")
    json.maxLength = maximum;
  if (format) {
    json.format = formatMap[format] ?? format;
    if (json.format === "")
      delete json.format;
    if (format === "time" || laxFormat) {
      delete json.format;
    }
  }
  if (contentEncoding)
    json.contentEncoding = contentEncoding;
  if (patterns && patterns.size > 0) {
    const patternList = [...patterns].map(exactPattern);
    if (patternList.length === 1)
      json.pattern = patternList[0].source;
    else if (patternList.length > 1) {
      json.allOf = [
        ...patternList.map((regex) => ({
          ...ctx.target === "draft-07" || ctx.target === "draft-04" || ctx.target === "openapi-3.0" ? { type: "string" } : {},
          pattern: regex.source
        }))
      ];
    }
  }
};
var numberProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const { minimum, maximum, multipleOf, exclusiveMaximum, exclusiveMinimum, isInt } = aggregateChecks(schema);
  json.type = isInt ? "integer" : "number";
  const exMin = typeof exclusiveMinimum === "number" && exclusiveMinimum >= (minimum ?? Number.NEGATIVE_INFINITY);
  const exMax = typeof exclusiveMaximum === "number" && exclusiveMaximum <= (maximum ?? Number.POSITIVE_INFINITY);
  const legacy = ctx.target === "draft-04" || ctx.target === "openapi-3.0";
  if (exMin) {
    if (legacy) {
      json.minimum = exclusiveMinimum;
      json.exclusiveMinimum = true;
    } else {
      json.exclusiveMinimum = exclusiveMinimum;
    }
  } else if (typeof minimum === "number") {
    json.minimum = minimum;
  }
  if (exMax) {
    if (legacy) {
      json.maximum = exclusiveMaximum;
      json.exclusiveMaximum = true;
    } else {
      json.exclusiveMaximum = exclusiveMaximum;
    }
  } else if (typeof maximum === "number") {
    json.maximum = maximum;
  }
  if (multipleOf) {
    const divisors = /* @__PURE__ */ new Set();
    for (const divisor of multipleOf) {
      if (Number.isFinite(divisor) && divisor !== 0)
        divisors.add(Math.abs(divisor));
      else
        handleUnrepresentable(schema, ctx, json, params, `A multipleOf divisor of ${divisor} cannot be represented in JSON Schema`);
    }
    const [first, ...rest] = divisors;
    if (first !== void 0)
      json.multipleOf = first;
    if (rest.length)
      json.allOf = [...json.allOf ?? [], ...rest.map((m) => ({ multipleOf: m }))];
  }
};
var booleanProcessor = (_schema, _ctx, json, _params) => {
  json.type = "boolean";
};
var nullProcessor = (_schema, ctx, json, _params) => {
  if (ctx.target === "openapi-3.0") {
    json.type = "string";
    json.nullable = true;
    json.enum = [null];
  } else {
    json.type = "null";
  }
};
var neverProcessor = (_schema, _ctx, json, _params) => {
  json.not = {};
};
var unknownProcessor = (_schema, _ctx, _json, _params) => {
};
var enumProcessor = (schema, _ctx, json, _params) => {
  const def = schema._zod.def;
  const values = getEnumValues(def.entries);
  if (values.length === 0) {
    json.not = {};
    return;
  }
  if (values.every((v) => typeof v === "number"))
    json.type = "number";
  if (values.every((v) => typeof v === "string"))
    json.type = "string";
  json.enum = values;
};
var literalProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  if (def.values.length === 0) {
    json.not = {};
    return;
  }
  const vals = [];
  for (const val of def.values) {
    if (val === void 0) {
      if (handleUnrepresentable(schema, ctx, json, params, "Literal `undefined` cannot be represented in JSON Schema"))
        return;
    } else if (typeof val === "bigint") {
      if (handleUnrepresentable(schema, ctx, json, params, "BigInt literals cannot be represented in JSON Schema"))
        return;
      vals.push(Number(val));
    } else {
      vals.push(val);
    }
  }
  if (vals.length === 0) {
  } else if (vals.length === 1) {
    const val = vals[0];
    json.type = val === null ? "null" : typeof val;
    if (ctx.target === "draft-04" || ctx.target === "openapi-3.0") {
      json.enum = [val];
    } else {
      json.const = val;
    }
  } else {
    if (vals.every((v) => typeof v === "number"))
      json.type = "number";
    if (vals.every((v) => typeof v === "string"))
      json.type = "string";
    if (vals.every((v) => typeof v === "boolean"))
      json.type = "boolean";
    if (vals.every((v) => v === null))
      json.type = "null";
    json.enum = vals;
  }
};
var customProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Custom types cannot be represented in JSON Schema");
};
var transformProcessor = (schema, ctx, json, params) => {
  handleUnrepresentable(schema, ctx, json, params, "Transforms cannot be represented in JSON Schema");
};
var arrayProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const { minimum, maximum } = aggregateChecks(schema);
  if (typeof minimum === "number")
    json.minItems = minimum;
  if (typeof maximum === "number")
    json.maxItems = maximum;
  json.type = "array";
  json.items = processSchema(def.element, ctx, {
    ...params,
    path: [...params.path, "items"]
  });
};
function inputOptin(schema) {
  const def = schema._zod.def;
  if (def.type === "pipe" && def.in._zod.traits.has("$ZodTransform")) {
    return inputOptin(def.out);
  }
  if (def.type === "catch") {
    return inputOptin(def.innerType);
  }
  return schema._zod.optin;
}
var objectProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  const shape = def.shape;
  const symbolKeys = Object.getOwnPropertySymbols(shape);
  if (symbolKeys.length && handleUnrepresentable(schema, ctx, json, params, "Symbol keys cannot be represented in JSON Schema")) {
    return;
  }
  json.type = "object";
  json.properties = {};
  for (const key in shape) {
    assignProp(json.properties, key, processSchema(shape[key], ctx, {
      ...params,
      path: [...params.path, "properties", key]
    }));
  }
  const requiredKeys = [];
  for (const key of Object.keys(shape)) {
    const field = def.shape[key];
    if (ctx.io === "input" ? inputOptin(field) === void 0 : field._zod.optout === void 0) {
      requiredKeys.push(key);
    }
  }
  if (requiredKeys.length > 0) {
    json.required = requiredKeys;
  }
  if (def.catchall?._zod.def.type === "never") {
    json.additionalProperties = false;
  } else if (!def.catchall) {
    if (ctx.io === "output")
      json.additionalProperties = false;
  } else if (def.catchall) {
    json.additionalProperties = processSchema(def.catchall, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
};
var unionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const isExclusive = def.inclusive === false;
  const options = def.options.map((x, i) => processSchema(x, ctx, {
    ...params,
    path: [...params.path, isExclusive ? "oneOf" : "anyOf", i]
  }));
  if (isExclusive) {
    json.oneOf = options;
  } else {
    json.anyOf = options;
  }
};
var intersectionProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const a = processSchema(def.left, ctx, {
    ...params,
    path: [...params.path, "allOf", 0]
  });
  const b = processSchema(def.right, ctx, {
    ...params,
    path: [...params.path, "allOf", 1]
  });
  const isSimpleIntersection = (val) => "allOf" in val && Object.keys(val).length === 1;
  const allOf = [
    ...isSimpleIntersection(a) ? a.allOf : [a],
    ...isSimpleIntersection(b) ? b.allOf : [b]
  ];
  json.allOf = allOf;
  ctx.intersections.push(allOf);
};
function stringifyKeyNames(bySchema, json, visited) {
  if (json.$ref) {
    if (visited.has(json))
      return json;
    visited.add(json);
    const def = bySchema.get(json)?.def;
    if (!def)
      return json;
    const inlined = stringifyKeyNames(bySchema, def, visited);
    return inlined === def ? json : inlined;
  }
  for (const keyword of ["anyOf", "oneOf"]) {
    const branches = json[keyword];
    if (!Array.isArray(branches))
      continue;
    const mapped = branches.map((branch) => stringifyKeyNames(bySchema, branch, visited));
    if (mapped.some((branch, i) => branch !== branches[i]))
      json = { ...json, [keyword]: mapped };
  }
  const types = Array.isArray(json.type) ? json.type : [json.type];
  const numericType = !types.includes("string") && types.some((t) => t === "number" || t === "integer");
  const values = json.enum ?? (json.const !== void 0 ? [json.const] : void 0);
  if (!numericType && !values?.some((v) => typeof v === "number"))
    return json;
  const { minimum, maximum, exclusiveMinimum, exclusiveMaximum, multipleOf, format, id, ...rest } = json;
  if (rest.enum)
    rest.enum = rest.enum.map((v) => typeof v === "number" ? String(v) : v);
  else if (typeof rest.const === "number")
    rest.const = String(rest.const);
  if (!numericType)
    return rest;
  rest.type = "string";
  if (!values)
    rest.pattern = (types.includes("number") ? number : integer).source;
  return rest;
}
var pendingRecords = /* @__PURE__ */ new WeakMap();
function rewriteKeyNames(ctx) {
  const bySchema = /* @__PURE__ */ new Map();
  for (const entry of ctx.seen.values()) {
    if (entry.def && !bySchema.has(entry.schema))
      bySchema.set(entry.schema, entry);
  }
  const rewrites = /* @__PURE__ */ new Map();
  for (const record2 of pendingRecords.get(ctx) ?? []) {
    const seen = ctx.seen.get(record2);
    const names = (seen?.def ?? seen?.schema)?.propertyNames;
    if (!names || names === true || rewrites.has(names))
      continue;
    const rewritten = stringifyKeyNames(bySchema, names, /* @__PURE__ */ new Set());
    if (rewritten !== names)
      rewrites.set(names, rewritten);
  }
  if (!rewrites.size)
    return;
  for (const entry of ctx.seen.values()) {
    for (const carrier of [entry.schema, entry.def]) {
      const rewritten = carrier && rewrites.get(carrier.propertyNames);
      if (rewritten)
        carrier.propertyNames = rewritten;
    }
  }
}
var recordProcessor = (schema, ctx, _json, params) => {
  const json = _json;
  const def = schema._zod.def;
  json.type = "object";
  const keyType = def.keyType;
  const patterns = aggregateChecks(keyType).patterns;
  if (def.mode === "loose" && patterns && patterns.size > 0) {
    const valueSchema = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "patternProperties", "*"]
    });
    json.patternProperties = {};
    for (const pattern2 of patterns) {
      assignProp(json.patternProperties, exactPattern(pattern2).source, valueSchema);
    }
  } else {
    if (ctx.target === "draft-07" || ctx.target === "draft-2020-12") {
      json.propertyNames = processSchema(def.keyType, ctx, {
        ...params,
        path: [...params.path, "propertyNames"]
      });
      let pending = pendingRecords.get(ctx);
      if (!pending) {
        pending = [];
        pendingRecords.set(ctx, pending);
        ctx.deferred.push(() => rewriteKeyNames(ctx));
      }
      pending.push(schema);
    }
    json.additionalProperties = processSchema(def.valueType, ctx, {
      ...params,
      path: [...params.path, "additionalProperties"]
    });
  }
  const keyValues = keyType._zod.values;
  const omittableOnInput = ctx.io === "input" && inputOptin(def.valueType) !== void 0;
  if (keyValues && !def.partial && !omittableOnInput) {
    const validKeyValues = [...keyValues].filter((v) => typeof v === "string" || typeof v === "number");
    if (validKeyValues.length > 0) {
      json.required = validKeyValues.map(String);
    }
  }
};
var nullableProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  const inner = processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  if (ctx.target === "openapi-3.0") {
    seen.ref = def.innerType;
    json.nullable = true;
  } else {
    json.anyOf = [inner, { type: "null" }];
  }
};
var nonoptionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};
var UNREPRESENTABLE_DEFAULT = /* @__PURE__ */ Symbol();
function serializeDefaultValue(value, schema, ctx, json, params) {
  let unrepresentable = false;
  const serialized = JSON.stringify(value, (_, val) => {
    if (typeof val !== "bigint")
      return val;
    unrepresentable = true;
    return null;
  });
  if (!unrepresentable)
    return JSON.parse(serialized);
  handleUnrepresentable(schema, ctx, json, params, "BigInt defaults cannot be represented in JSON Schema");
  return UNREPRESENTABLE_DEFAULT;
}
var defaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json.default = value;
};
var prefaultProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  if (ctx.io !== "input")
    return;
  const value = serializeDefaultValue(def.defaultValue, schema, ctx, json, params);
  if (value !== UNREPRESENTABLE_DEFAULT)
    json._prefault = value;
};
var catchProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  let catchValue;
  try {
    catchValue = def.catchValue(void 0);
  } catch {
    handleUnrepresentable(schema, ctx, json, params, "Dynamic catch values are not supported in JSON Schema");
    return;
  }
  json.default = catchValue;
};
var pipeProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  const inIsTransform = def.in._zod.traits.has("$ZodTransform");
  const innerType = ctx.io === "input" ? inIsTransform ? def.out : def.in : def.out;
  processSchema(innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = innerType;
};
var readonlyProcessor = (schema, ctx, json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
  json.readOnly = true;
};
var optionalProcessor = (schema, ctx, _json, params) => {
  const def = schema._zod.def;
  processSchema(def.innerType, ctx, params);
  const seen = ctx.seen.get(schema);
  seen.ref = def.innerType;
};

// node_modules/zod/v4/classic/errors.js
var _installedErrorProtos = /* @__PURE__ */ new WeakSet([Object.prototype, Error.prototype]);
function _lazyMethod(proto, key, make) {
  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: false,
    get() {
      const value = make(this);
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
      return value;
    },
    set(value) {
      Object.defineProperty(this, key, { value, configurable: true, writable: true });
    }
  });
}
var initializer2 = (inst, issues) => {
  $ZodError.init(inst, issues);
  inst.name = "ZodError";
  const proto = Object.getPrototypeOf(inst);
  if (_installedErrorProtos.has(proto))
    return;
  _installedErrorProtos.add(proto);
  _lazyMethod(proto, "format", (self) => (mapper) => formatError(self, mapper));
  _lazyMethod(proto, "flatten", (self) => (mapper) => flattenError(self, mapper));
  _lazyMethod(proto, "addIssue", (self) => (issue2) => {
    self.issues.push(issue2);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  _lazyMethod(proto, "addIssues", (self) => (issues2) => {
    self.issues.push(...issues2);
    self.message = JSON.stringify(self.issues, jsonStringifyReplacer, 2);
  });
  Object.defineProperty(proto, "isEmpty", {
    configurable: true,
    enumerable: false,
    get() {
      return this.issues.length === 0;
    }
  });
};
var ZodRealError = /* @__PURE__ */ $constructor("ZodError", initializer2, void 0, {
  Parent: Error
});

// node_modules/zod/v4/classic/parse.js
var parse = /* @__PURE__ */ _parse(ZodRealError);
var parseAsync = /* @__PURE__ */ _parseAsync(ZodRealError);
var safeParse = /* @__PURE__ */ _safeParse(ZodRealError);
var safeParseAsync = /* @__PURE__ */ _safeParseAsync(ZodRealError);
var encode = /* @__PURE__ */ _encode(ZodRealError);
var decode = /* @__PURE__ */ _decode(ZodRealError);
var encodeAsync = /* @__PURE__ */ _encodeAsync(ZodRealError);
var decodeAsync = /* @__PURE__ */ _decodeAsync(ZodRealError);
var safeEncode = /* @__PURE__ */ _safeEncode(ZodRealError);
var safeDecode = /* @__PURE__ */ _safeDecode(ZodRealError);
var safeEncodeAsync = /* @__PURE__ */ _safeEncodeAsync(ZodRealError);
var safeDecodeAsync = /* @__PURE__ */ _safeDecodeAsync(ZodRealError);

// node_modules/zod/v4/classic/schemas.js
function _ensureDefaultLocale() {
  if (!globalConfig.localeError)
    config(en_default());
}
function _ensureDefaultMemoizer() {
  if (!globalConfig.memoizer)
    config({ memoizer: memoizer() });
}
var ZodType = /* @__PURE__ */ $constructor("ZodType", (inst, def) => {
  _ensureDefaultLocale();
  $ZodType.init(inst, def);
  inst.def = def;
  inst.type = def.type;
  return inst;
}, {
  check(...chks) {
    const def = this.def;
    return this.clone(util_exports.mergeDefs(def, {
      checks: [
        ...def.checks ?? [],
        ...chks.map((ch) => typeof ch === "function" ? { _zod: { check: ch, def: { check: "custom" }, onattach: [] } } : ch)
      ]
    }), { parent: true });
  },
  with(...chks) {
    return this.check(...chks);
  },
  clone(def, params) {
    return clone(this, def, params);
  },
  brand() {
    return this;
  },
  register(reg, meta2) {
    reg.add(this, meta2);
    return this;
  },
  refine(check, params) {
    return this.check(refine(check, params));
  },
  superRefine(refinement, params) {
    return this.check(superRefine(refinement, params));
  },
  overwrite(fn) {
    return this.check(_overwrite(fn));
  },
  optional() {
    return optional(this);
  },
  exactOptional() {
    return exactOptional(this);
  },
  nullable() {
    return nullable(this);
  },
  nullish() {
    return optional(nullable(this));
  },
  nonoptional(params) {
    return nonoptional(this, params);
  },
  array() {
    return array(this);
  },
  or(arg) {
    return union([this, arg]);
  },
  and(arg) {
    return intersection(this, arg);
  },
  transform(tx) {
    return pipe(this, transform(tx));
  },
  default(d) {
    return _default(this, d);
  },
  prefault(d) {
    return prefault(this, d);
  },
  catch(params) {
    return _catch(this, params);
  },
  pipe(target) {
    return pipe(this, target);
  },
  readonly() {
    return readonly(this);
  },
  describe(description) {
    const cl = this.clone();
    globalRegistry.add(cl, { description });
    return cl;
  },
  meta(...args) {
    if (args.length === 0)
      return globalRegistry.get(this);
    const cl = this.clone();
    globalRegistry.add(cl, args[0]);
    return cl;
  },
  isOptional() {
    return this.safeParse(void 0).success;
  },
  isNullable() {
    return this.safeParse(null).success;
  },
  apply(fn, ...args) {
    return args.length === 0 ? fn(this) : fn(this, ...args);
  },
  // Overrides core's `~standard` to add `jsonSchema`. Must stay a prototype entry: redefining it per instance demotes instances to dictionary mode.
  get "~standard"() {
    return util_exports.hide(this, "~standard", {
      ...standardProps(this),
      jsonSchema: {
        input: createStandardJSONSchemaMethod(this, "input"),
        output: createStandardJSONSchemaMethod(this, "output")
      }
    });
  },
  set "~standard"(value) {
    util_exports.own(this, "~standard", value);
  },
  parse: function _parse2(data, params) {
    return parse(this, data, params, { callee: _parse2 });
  },
  parseAsync: async function _parseAsync2(data, params) {
    return await parseAsync(this, data, params, { callee: _parseAsync2 });
  },
  safeParse(data, params) {
    return safeParse(this, data, params);
  },
  async safeParseAsync(data, params) {
    return safeParseAsync(this, data, params);
  },
  // `spa` is an alias: same function object as `safeParseAsync`, as before.
  get spa() {
    return this?.safeParseAsync;
  },
  set spa(value) {
    util_exports.own(this, "spa", value);
  },
  validate(data, params) {
    return validate(this, data, params);
  },
  validateAsync(data, params) {
    return validateAsync(this, data, params);
  },
  encode: function _encode2(data, params) {
    return encode(this, data, params, { callee: _encode2 });
  },
  decode: function _decode2(data, params) {
    return decode(this, data, params, { callee: _decode2 });
  },
  encodeAsync: async function _encodeAsync2(data, params) {
    return await encodeAsync(this, data, params, { callee: _encodeAsync2 });
  },
  decodeAsync: async function _decodeAsync2(data, params) {
    return await decodeAsync(this, data, params, { callee: _decodeAsync2 });
  },
  safeEncode(data, params) {
    return safeEncode(this, data, params);
  },
  safeDecode(data, params) {
    return safeDecode(this, data, params);
  },
  async safeEncodeAsync(data, params) {
    return safeEncodeAsync(this, data, params);
  },
  async safeDecodeAsync(data, params) {
    return safeDecodeAsync(this, data, params);
  },
  toJSONSchema(params) {
    return createToJSONSchemaMethod(this, {})(params);
  },
  // Reads through to the registry on every access, so it must not cache.
  get description() {
    return globalRegistry.get(this)?.description;
  },
  // No setter: `schema._def = x` throws, as it did when `_def` was a non-writable own property.
  get _def() {
    return this._zod.def;
  }
});
var _ZodString = /* @__PURE__ */ $constructor(
  "_ZodString",
  (inst, def) => {
    $ZodString.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => stringProcessor(inst, ctx, json, params);
  },
  /* @__PURE__ */ util_exports.derived({
    format: (inst) => aggregateChecks(inst).format ?? null,
    minLength: (inst) => aggregateChecks(inst).minimum ?? null,
    maxLength: (inst) => aggregateChecks(inst).maximum ?? null
  }, {
    regex(...args) {
      return this.check(_regex(...args));
    },
    includes(...args) {
      return this.check(_includes(...args));
    },
    startsWith(...args) {
      return this.check(_startsWith(...args));
    },
    endsWith(...args) {
      return this.check(_endsWith(...args));
    },
    min(...args) {
      return this.check(_minLength(...args));
    },
    max(...args) {
      return this.check(_maxLength(...args));
    },
    length(...args) {
      return this.check(_length(...args));
    },
    nonempty(...args) {
      return this.check(_minLength(1, ...args));
    },
    lowercase(params) {
      return this.check(_lowercase(params));
    },
    uppercase(params) {
      return this.check(_uppercase(params));
    },
    trim() {
      return this.check(_trim());
    },
    normalize(...args) {
      return this.check(_normalize(...args));
    },
    toLowerCase() {
      return this.check(_toLowerCase());
    },
    toUpperCase() {
      return this.check(_toUpperCase());
    },
    slugify() {
      return this.check(_slugify());
    }
  })
);
var ZodString = /* @__PURE__ */ $constructor("ZodString", (inst, def) => {
  $ZodString.init(inst, def);
  _ZodString.init(inst, def);
}, {
  email(params) {
    return this.check(_email(ZodEmail, params));
  },
  url(params) {
    return this.check(_url(ZodURL, params));
  },
  jwt(params) {
    return this.check(_jwt(ZodJWT, params));
  },
  emoji(params) {
    return this.check(_emoji2(ZodEmoji, params));
  },
  guid(params) {
    return this.check(_guid(ZodGUID, params));
  },
  uuid(params) {
    return this.check(_uuid(ZodUUID, params));
  },
  uuidv4(params) {
    return this.check(_uuidv4(ZodUUID, params));
  },
  uuidv6(params) {
    return this.check(_uuidv6(ZodUUID, params));
  },
  uuidv7(params) {
    return this.check(_uuidv7(ZodUUID, params));
  },
  nanoid(params) {
    return this.check(_nanoid(ZodNanoID, params));
  },
  cuid(params) {
    return this.check(_cuid(ZodCUID, params));
  },
  cuid2(params) {
    return this.check(_cuid2(ZodCUID2, params));
  },
  ulid(params) {
    return this.check(_ulid(ZodULID, params));
  },
  base64(params) {
    return this.check(_base64(ZodBase64, params));
  },
  base64url(params) {
    return this.check(_base64url(ZodBase64URL, params));
  },
  xid(params) {
    return this.check(_xid(ZodXID, params));
  },
  ksuid(params) {
    return this.check(_ksuid(ZodKSUID, params));
  },
  ipv4(params) {
    return this.check(_ipv4(ZodIPv4, params));
  },
  ipv6(params) {
    return this.check(_ipv6(ZodIPv6, params));
  },
  cidrv4(params) {
    return this.check(_cidrv4(ZodCIDRv4, params));
  },
  cidrv6(params) {
    return this.check(_cidrv6(ZodCIDRv6, params));
  },
  e164(params) {
    return this.check(_e164(ZodE164, params));
  },
  datetime(params) {
    return this.check(_isoDateTime(ZodISODateTime, params));
  },
  date(params) {
    return this.check(_isoDate(ZodISODate, params));
  },
  time(params) {
    return this.check(_isoTime(ZodISOTime, params));
  },
  duration(params) {
    return this.check(_isoDuration(ZodISODuration, params));
  }
});
function string2(params) {
  return _string(ZodString, params);
}
var ZodStringFormat = /* @__PURE__ */ $constructor("ZodStringFormat", (inst, def) => {
  $ZodStringFormat.init(inst, def);
  _ZodString.init(inst, def);
});
var ZodISODateTime = /* @__PURE__ */ $constructor("ZodISODateTime", (inst, def) => {
  $ZodISODateTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODate = /* @__PURE__ */ $constructor("ZodISODate", (inst, def) => {
  $ZodISODate.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISOTime = /* @__PURE__ */ $constructor("ZodISOTime", (inst, def) => {
  $ZodISOTime.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodISODuration = /* @__PURE__ */ $constructor("ZodISODuration", (inst, def) => {
  $ZodISODuration.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmail = /* @__PURE__ */ $constructor("ZodEmail", (inst, def) => {
  $ZodEmail.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodGUID = /* @__PURE__ */ $constructor("ZodGUID", (inst, def) => {
  $ZodGUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodUUID = /* @__PURE__ */ $constructor("ZodUUID", (inst, def) => {
  $ZodUUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodURL = /* @__PURE__ */ $constructor("ZodURL", (inst, def) => {
  $ZodURL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodEmoji = /* @__PURE__ */ $constructor("ZodEmoji", (inst, def) => {
  $ZodEmoji.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNanoID = /* @__PURE__ */ $constructor("ZodNanoID", (inst, def) => {
  $ZodNanoID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID = /* @__PURE__ */ $constructor("ZodCUID", (inst, def) => {
  $ZodCUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCUID2 = /* @__PURE__ */ $constructor("ZodCUID2", (inst, def) => {
  $ZodCUID2.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodULID = /* @__PURE__ */ $constructor("ZodULID", (inst, def) => {
  $ZodULID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodXID = /* @__PURE__ */ $constructor("ZodXID", (inst, def) => {
  $ZodXID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodKSUID = /* @__PURE__ */ $constructor("ZodKSUID", (inst, def) => {
  $ZodKSUID.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv4 = /* @__PURE__ */ $constructor("ZodIPv4", (inst, def) => {
  $ZodIPv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodIPv6 = /* @__PURE__ */ $constructor("ZodIPv6", (inst, def) => {
  $ZodIPv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv4 = /* @__PURE__ */ $constructor("ZodCIDRv4", (inst, def) => {
  $ZodCIDRv4.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodCIDRv6 = /* @__PURE__ */ $constructor("ZodCIDRv6", (inst, def) => {
  $ZodCIDRv6.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64 = /* @__PURE__ */ $constructor("ZodBase64", (inst, def) => {
  $ZodBase64.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodBase64URL = /* @__PURE__ */ $constructor("ZodBase64URL", (inst, def) => {
  $ZodBase64URL.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodE164 = /* @__PURE__ */ $constructor("ZodE164", (inst, def) => {
  $ZodE164.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodJWT = /* @__PURE__ */ $constructor("ZodJWT", (inst, def) => {
  $ZodJWT.init(inst, def);
  ZodStringFormat.init(inst, def);
});
var ZodNumber = /* @__PURE__ */ $constructor(
  "ZodNumber",
  (inst, def) => {
    $ZodNumber.init(inst, def);
    ZodType.init(inst, def);
    inst._zod.processJSONSchema = (ctx, json, params) => numberProcessor(inst, ctx, json, params);
    inst.isFinite = true;
  },
  /* @__PURE__ */ util_exports.derived({
    minValue: (inst) => {
      const { minimum, exclusiveMinimum } = aggregateChecks(inst);
      return Math.max(minimum ?? Number.NEGATIVE_INFINITY, exclusiveMinimum ?? Number.NEGATIVE_INFINITY);
    },
    maxValue: (inst) => {
      const { maximum, exclusiveMaximum } = aggregateChecks(inst);
      return Math.min(maximum ?? Number.POSITIVE_INFINITY, exclusiveMaximum ?? Number.POSITIVE_INFINITY);
    },
    isInt: (inst) => {
      const { isInt, multipleOf } = aggregateChecks(inst);
      return !!isInt || !!multipleOf?.some(Number.isSafeInteger);
    },
    format: (inst) => aggregateChecks(inst).format ?? null
  }, {
    gt(value, params) {
      return this.check(_gt(value, params));
    },
    gte(value, params) {
      return this.check(_gte(value, params));
    },
    min(value, params) {
      return this.check(_gte(value, params));
    },
    lt(value, params) {
      return this.check(_lt(value, params));
    },
    lte(value, params) {
      return this.check(_lte(value, params));
    },
    max(value, params) {
      return this.check(_lte(value, params));
    },
    int(params) {
      return this.check(int(params));
    },
    safe(params) {
      return this.check(int(params));
    },
    positive(params) {
      return this.check(_gt(0, params));
    },
    nonnegative(params) {
      return this.check(_gte(0, params));
    },
    negative(params) {
      return this.check(_lt(0, params));
    },
    nonpositive(params) {
      return this.check(_lte(0, params));
    },
    multipleOf(value, params) {
      return this.check(_multipleOf(value, params));
    },
    step(value, params) {
      return this.check(_multipleOf(value, params));
    },
    finite() {
      return this;
    }
  })
);
function number2(params) {
  return _number(ZodNumber, params);
}
var ZodNumberFormat = /* @__PURE__ */ $constructor("ZodNumberFormat", (inst, def) => {
  $ZodNumberFormat.init(inst, def);
  ZodNumber.init(inst, def);
});
function int(params) {
  return _int(ZodNumberFormat, params);
}
var ZodBoolean = /* @__PURE__ */ $constructor("ZodBoolean", (inst, def) => {
  $ZodBoolean.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => booleanProcessor(inst, ctx, json, params);
});
function boolean2(params) {
  return _boolean(ZodBoolean, params);
}
var ZodNull = /* @__PURE__ */ $constructor("ZodNull", (inst, def) => {
  $ZodNull.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullProcessor(inst, ctx, json, params);
});
function _null3(params) {
  return _null2(ZodNull, params);
}
var ZodUnknown = /* @__PURE__ */ $constructor("ZodUnknown", (inst, def) => {
  $ZodUnknown.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unknownProcessor(inst, ctx, json, params);
});
function unknown() {
  return _unknown(ZodUnknown);
}
var ZodNever = /* @__PURE__ */ $constructor("ZodNever", (inst, def) => {
  $ZodNever.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => neverProcessor(inst, ctx, json, params);
});
function never(params) {
  return _never(ZodNever, params);
}
var ZodArray = /* @__PURE__ */ $constructor("ZodArray", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodArray.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => arrayProcessor(inst, ctx, json, params);
  inst.element = def.element;
}, {
  min(n, params) {
    return this.check(_minLength(n, params));
  },
  nonempty(params) {
    return this.check(_minLength(1, params));
  },
  max(n, params) {
    return this.check(_maxLength(n, params));
  },
  length(n, params) {
    return this.check(_length(n, params));
  },
  unwrap() {
    return this.element;
  }
});
function array(element, params) {
  return _array(ZodArray, element, params);
}
var ZodObject = /* @__PURE__ */ $constructor("ZodObject", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodObjectJIT.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => objectProcessor(inst, ctx, json, params);
  util_exports.installLazyProp(inst, "shape", (self) => self._zod.def.shape, false);
}, {
  keyof() {
    return _enum(Object.keys(this._zod.def.shape));
  },
  catchall(catchall) {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall }));
  },
  passthrough() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  loose() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: unknown() }));
  },
  strict() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: never() }));
  },
  strip() {
    return this.clone(util_exports.mergeDefs(this._zod.def, { catchall: void 0 }));
  },
  extend(incoming) {
    return util_exports.extend(this, incoming);
  },
  safeExtend(incoming) {
    return util_exports.safeExtend(this, incoming);
  },
  merge(other) {
    return util_exports.merge(this, other);
  },
  pick(mask) {
    return util_exports.pick(this, mask);
  },
  omit(mask) {
    return util_exports.omit(this, mask);
  },
  partial(...args) {
    return util_exports.partial(ZodOptional, this, args[0]);
  },
  exactPartial(...args) {
    return util_exports.partial(ZodExactOptional, this, args[0], "exactPartial");
  },
  required(...args) {
    return util_exports.required(ZodNonOptional, this, args[0]);
  }
});
function object(shape, params) {
  const def = {
    type: "object",
    shape: shape ?? {},
    ...util_exports.normalizeParams(params)
  };
  return new ZodObject(def);
}
function looseObject(shape, params) {
  return new ZodObject({
    type: "object",
    shape,
    catchall: unknown(),
    ...util_exports.normalizeParams(params)
  });
}
var ZodUnion = /* @__PURE__ */ $constructor("ZodUnion", (inst, def) => {
  $ZodUnion.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => unionProcessor(inst, ctx, json, params);
  inst.options = def.options;
});
function union(options, params) {
  return new ZodUnion({
    type: "union",
    options,
    ...util_exports.normalizeParams(params)
  });
}
var ZodDiscriminatedUnion = /* @__PURE__ */ $constructor("ZodDiscriminatedUnion", (inst, def) => {
  ZodUnion.init(inst, def);
  $ZodDiscriminatedUnion.init(inst, def);
});
function discriminatedUnion(discriminator, options, params) {
  return new ZodDiscriminatedUnion({
    type: "union",
    options,
    discriminator,
    ...util_exports.normalizeParams(params)
  });
}
var ZodIntersection = /* @__PURE__ */ $constructor("ZodIntersection", (inst, def) => {
  $ZodIntersection.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => intersectionProcessor(inst, ctx, json, params);
});
function intersection(left, right) {
  return new ZodIntersection({
    type: "intersection",
    left,
    right
  });
}
var ZodRecord = /* @__PURE__ */ $constructor("ZodRecord", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodRecord.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => recordProcessor(inst, ctx, json, params);
  inst.keyType = def.keyType;
  inst.valueType = def.valueType;
});
function record(keyType, valueType, params) {
  if (!valueType || !valueType._zod) {
    return new ZodRecord({
      type: "record",
      keyType: string2(),
      valueType: keyType,
      ...util_exports.normalizeParams(valueType)
    });
  }
  return new ZodRecord({
    type: "record",
    keyType,
    valueType,
    ...util_exports.normalizeParams(params)
  });
}
var ZodEnum = /* @__PURE__ */ $constructor("ZodEnum", (inst, def) => {
  $ZodEnum.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => enumProcessor(inst, ctx, json, params);
  inst.enum = def.entries;
  inst.options = [...inst._zod.values];
  const keys = new Set(Object.keys(def.entries));
  inst.extract = (values, params) => {
    const newEntries = {};
    for (const value of values) {
      if (keys.has(value)) {
        newEntries[value] = def.entries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
  inst.exclude = (values, params) => {
    const newEntries = { ...def.entries };
    for (const value of values) {
      if (keys.has(value)) {
        delete newEntries[value];
      } else
        throw new Error(`Key ${value} not found in enum`);
    }
    return new ZodEnum({
      ...def,
      checks: [],
      ...util_exports.normalizeParams(params),
      entries: newEntries
    });
  };
});
function _enum(values, params) {
  const entries = Array.isArray(values) ? Object.fromEntries(values.map((v) => [v, v])) : values;
  return new ZodEnum({
    type: "enum",
    entries,
    ...util_exports.normalizeParams(params)
  });
}
var ZodLiteral = /* @__PURE__ */ $constructor("ZodLiteral", (inst, def) => {
  $ZodLiteral.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => literalProcessor(inst, ctx, json, params);
  inst.values = new Set(def.values);
  Object.defineProperty(inst, "value", {
    get() {
      if (def.values.length > 1) {
        throw new Error("This schema contains multiple valid literal values. Use `.values` instead.");
      }
      return def.values[0];
    }
  });
});
function literal(value, params) {
  return new ZodLiteral({
    type: "literal",
    values: Array.isArray(value) ? value : [value],
    ...util_exports.normalizeParams(params)
  });
}
var ZodTransform = /* @__PURE__ */ $constructor("ZodTransform", (inst, def) => {
  _ensureDefaultMemoizer();
  $ZodTransform.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => transformProcessor(inst, ctx, json, params);
  inst._zod.parse = (payload, _ctx) => {
    if (_ctx.direction === "backward") {
      throw new $ZodEncodeError(inst.constructor.name);
    }
    payload.addIssue = (issue2) => {
      if (typeof issue2 === "string") {
        payload.issues.push(util_exports.issue(issue2, payload.value, def));
      } else {
        const _issue = issue2;
        if (_issue.fatal)
          _issue.continue = false;
        _issue.code ?? (_issue.code = "custom");
        if (!("input" in _issue))
          _issue.input = payload.value;
        _issue.inst ?? (_issue.inst = inst);
        payload.issues.push(util_exports.issue(_issue));
      }
    };
    const output = def.transform(payload.value, payload);
    if (output instanceof Promise) {
      return output.then((output2) => {
        payload.value = output2;
        return payload;
      });
    }
    payload.value = output;
    return payload;
  };
});
function transform(fn) {
  return new ZodTransform({
    type: "transform",
    transform: fn
  });
}
var ZodOptional = /* @__PURE__ */ $constructor("ZodOptional", (inst, def) => {
  $ZodOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function optional(innerType) {
  return new ZodOptional({
    type: "optional",
    innerType
  });
}
var ZodExactOptional = /* @__PURE__ */ $constructor("ZodExactOptional", (inst, def) => {
  $ZodExactOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => optionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function exactOptional(innerType) {
  return new ZodExactOptional({
    type: "optional",
    innerType
  });
}
var ZodNullable = /* @__PURE__ */ $constructor("ZodNullable", (inst, def) => {
  $ZodNullable.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nullableProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nullable(innerType) {
  return new ZodNullable({
    type: "nullable",
    innerType
  });
}
var ZodDefault = /* @__PURE__ */ $constructor("ZodDefault", (inst, def) => {
  $ZodDefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => defaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeDefault = inst.unwrap;
});
function _default(innerType, defaultValue) {
  return new ZodDefault({
    type: "default",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
var ZodPrefault = /* @__PURE__ */ $constructor("ZodPrefault", (inst, def) => {
  $ZodPrefault.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => prefaultProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function prefault(innerType, defaultValue) {
  return new ZodPrefault({
    type: "prefault",
    innerType,
    get defaultValue() {
      return typeof defaultValue === "function" ? defaultValue() : util_exports.shallowClone(defaultValue);
    }
  });
}
var ZodNonOptional = /* @__PURE__ */ $constructor("ZodNonOptional", (inst, def) => {
  $ZodNonOptional.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => nonoptionalProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function nonoptional(innerType, params) {
  return new ZodNonOptional({
    type: "nonoptional",
    innerType,
    ...util_exports.normalizeParams(params)
  });
}
var ZodCatch = /* @__PURE__ */ $constructor("ZodCatch", (inst, def) => {
  $ZodCatch.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => catchProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
  inst.removeCatch = inst.unwrap;
});
function _catch(innerType, catchValue) {
  return new ZodCatch({
    type: "catch",
    innerType,
    catchValue: typeof catchValue === "function" ? catchValue : util_exports.constantCatch(catchValue)
  });
}
var ZodPipe = /* @__PURE__ */ $constructor("ZodPipe", (inst, def) => {
  $ZodPipe.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => pipeProcessor(inst, ctx, json, params);
  inst.in = def.in;
  inst.out = def.out;
});
function pipe(in_, out) {
  return new ZodPipe({
    type: "pipe",
    in: in_,
    out
    // ...util.normalizeParams(params),
  });
}
var ZodPreprocess = /* @__PURE__ */ $constructor("ZodPreprocess", (inst, def) => {
  ZodPipe.init(inst, def);
  $ZodPreprocess.init(inst, def);
});
var ZodReadonly = /* @__PURE__ */ $constructor("ZodReadonly", (inst, def) => {
  $ZodReadonly.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => readonlyProcessor(inst, ctx, json, params);
  inst.unwrap = () => inst._zod.def.innerType;
});
function readonly(innerType) {
  return new ZodReadonly({
    type: "readonly",
    innerType
  });
}
var ZodCustom = /* @__PURE__ */ $constructor("ZodCustom", (inst, def) => {
  $ZodCustom.init(inst, def);
  ZodType.init(inst, def);
  inst._zod.processJSONSchema = (ctx, json, params) => customProcessor(inst, ctx, json, params);
});
function custom(fn, _params) {
  return _custom(ZodCustom, fn ?? (() => true), _params);
}
function refine(fn, _params = {}) {
  return _refine(ZodCustom, fn, _params);
}
function superRefine(fn, params) {
  return _superRefine(fn, params);
}
function preprocess(fn, schema) {
  return new ZodPreprocess({
    type: "pipe",
    in: transform(fn),
    out: schema
  });
}

// node_modules/zod/v4/classic/iso.js
var iso_exports = {};
__export(iso_exports, {
  ZodISODate: () => ZodISODate,
  ZodISODateTime: () => ZodISODateTime,
  ZodISODuration: () => ZodISODuration,
  ZodISOTime: () => ZodISOTime,
  date: () => date2,
  datetime: () => datetime2,
  duration: () => duration2,
  time: () => time2
});
function datetime2(params) {
  return _isoDateTime(ZodISODateTime, params);
}
function date2(params) {
  return _isoDate(ZodISODate, params);
}
function time2(params) {
  return _isoTime(ZodISOTime, params);
}
function duration2(params) {
  return _isoDuration(ZodISODuration, params);
}

// node_modules/@modelcontextprotocol/sdk/dist/esm/types.js
var RELATED_TASK_META_KEY = "io.modelcontextprotocol/related-task";
var JSONRPC_VERSION = "2.0";
var AssertObjectSchema = custom((v) => v !== null && (typeof v === "object" || typeof v === "function"));
var ProgressTokenSchema = union([string2(), number2().int()]);
var CursorSchema = string2();
var TaskCreationParamsSchema = looseObject({
  /**
   * Requested duration in milliseconds to retain task from creation.
   */
  ttl: number2().optional(),
  /**
   * Time in milliseconds to wait between task status requests.
   */
  pollInterval: number2().optional()
});
var TaskMetadataSchema = object({
  ttl: number2().optional()
});
var RelatedTaskMetadataSchema = object({
  taskId: string2()
});
var RequestMetaSchema = looseObject({
  /**
   * If specified, the caller is requesting out-of-band progress notifications for this request (as represented by notifications/progress). The value of this parameter is an opaque token that will be attached to any subsequent notifications. The receiver is not obligated to provide these notifications.
   */
  progressToken: ProgressTokenSchema.optional(),
  /**
   * If specified, this request is related to the provided task.
   */
  [RELATED_TASK_META_KEY]: RelatedTaskMetadataSchema.optional()
});
var BaseRequestParamsSchema = object({
  /**
   * See [General fields: `_meta`](/specification/draft/basic/index#meta) for notes on `_meta` usage.
   */
  _meta: RequestMetaSchema.optional()
});
var TaskAugmentedRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * If specified, the caller is requesting task-augmented execution for this request.
   * The request will return a CreateTaskResult immediately, and the actual result can be
   * retrieved later via tasks/result.
   *
   * Task augmentation is subject to capability negotiation - receivers MUST declare support
   * for task augmentation of specific request types in their capabilities.
   */
  task: TaskMetadataSchema.optional()
});
var RequestSchema = object({
  method: string2(),
  params: BaseRequestParamsSchema.loose().optional()
});
var NotificationsParamsSchema = object({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: RequestMetaSchema.optional()
});
var NotificationSchema = object({
  method: string2(),
  params: NotificationsParamsSchema.loose().optional()
});
var ResultSchema = looseObject({
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: RequestMetaSchema.optional()
});
var RequestIdSchema = union([string2(), number2().int()]);
var JSONRPCRequestSchema = object({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  ...RequestSchema.shape
}).strict();
var JSONRPCNotificationSchema = object({
  jsonrpc: literal(JSONRPC_VERSION),
  ...NotificationSchema.shape
}).strict();
var JSONRPCResultResponseSchema = object({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema,
  result: ResultSchema
}).strict();
var ErrorCode;
(function(ErrorCode2) {
  ErrorCode2[ErrorCode2["ConnectionClosed"] = -32e3] = "ConnectionClosed";
  ErrorCode2[ErrorCode2["RequestTimeout"] = -32001] = "RequestTimeout";
  ErrorCode2[ErrorCode2["ParseError"] = -32700] = "ParseError";
  ErrorCode2[ErrorCode2["InvalidRequest"] = -32600] = "InvalidRequest";
  ErrorCode2[ErrorCode2["MethodNotFound"] = -32601] = "MethodNotFound";
  ErrorCode2[ErrorCode2["InvalidParams"] = -32602] = "InvalidParams";
  ErrorCode2[ErrorCode2["InternalError"] = -32603] = "InternalError";
  ErrorCode2[ErrorCode2["UrlElicitationRequired"] = -32042] = "UrlElicitationRequired";
})(ErrorCode || (ErrorCode = {}));
var JSONRPCErrorResponseSchema = object({
  jsonrpc: literal(JSONRPC_VERSION),
  id: RequestIdSchema.optional(),
  error: object({
    /**
     * The error type that occurred.
     */
    code: number2().int(),
    /**
     * A short description of the error. The message SHOULD be limited to a concise single sentence.
     */
    message: string2(),
    /**
     * Additional information about the error. The value of this member is defined by the sender (e.g. detailed error information, nested errors etc.).
     */
    data: unknown().optional()
  })
}).strict();
var JSONRPCMessageSchema = union([
  JSONRPCRequestSchema,
  JSONRPCNotificationSchema,
  JSONRPCResultResponseSchema,
  JSONRPCErrorResponseSchema
]);
var JSONRPCResponseSchema = union([JSONRPCResultResponseSchema, JSONRPCErrorResponseSchema]);
var EmptyResultSchema = ResultSchema.strict();
var CancelledNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The ID of the request to cancel.
   *
   * This MUST correspond to the ID of a request previously issued in the same direction.
   */
  requestId: RequestIdSchema.optional(),
  /**
   * An optional string describing the reason for the cancellation. This MAY be logged or presented to the user.
   */
  reason: string2().optional()
});
var CancelledNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/cancelled"),
  params: CancelledNotificationParamsSchema
});
var IconSchema = object({
  /**
   * URL or data URI for the icon.
   */
  src: string2(),
  /**
   * Optional MIME type for the icon.
   */
  mimeType: string2().optional(),
  /**
   * Optional array of strings that specify sizes at which the icon can be used.
   * Each string should be in WxH format (e.g., `"48x48"`, `"96x96"`) or `"any"` for scalable formats like SVG.
   *
   * If not provided, the client should assume that the icon can be used at any size.
   */
  sizes: array(string2()).optional(),
  /**
   * Optional specifier for the theme this icon is designed for. `light` indicates
   * the icon is designed to be used with a light background, and `dark` indicates
   * the icon is designed to be used with a dark background.
   *
   * If not provided, the client should assume the icon can be used with any theme.
   */
  theme: _enum(["light", "dark"]).optional()
});
var IconsSchema = object({
  /**
   * Optional set of sized icons that the client can display in a user interface.
   *
   * Clients that support rendering icons MUST support at least the following MIME types:
   * - `image/png` - PNG images (safe, universal compatibility)
   * - `image/jpeg` (and `image/jpg`) - JPEG images (safe, universal compatibility)
   *
   * Clients that support rendering icons SHOULD also support:
   * - `image/svg+xml` - SVG images (scalable but requires security precautions)
   * - `image/webp` - WebP images (modern, efficient format)
   */
  icons: array(IconSchema).optional()
});
var BaseMetadataSchema = object({
  /** Intended for programmatic or logical use, but used as a display name in past specs or fallback */
  name: string2(),
  /**
   * Intended for UI and end-user contexts — optimized to be human-readable and easily understood,
   * even by those unfamiliar with domain-specific terminology.
   *
   * If not provided, the name should be used for display (except for Tool,
   * where `annotations.title` should be given precedence over using `name`,
   * if present).
   */
  title: string2().optional()
});
var ImplementationSchema = BaseMetadataSchema.extend({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  version: string2(),
  /**
   * An optional URL of the website for this implementation.
   */
  websiteUrl: string2().optional(),
  /**
   * An optional human-readable description of what this implementation does.
   *
   * This can be used by clients or servers to provide context about their purpose
   * and capabilities. For example, a server might describe the types of resources
   * or tools it provides, while a client might describe its intended use case.
   */
  description: string2().optional()
});
var FormElicitationCapabilitySchema = intersection(object({
  applyDefaults: boolean2().optional()
}), record(string2(), unknown()));
var ElicitationCapabilitySchema = preprocess((value) => {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    if (Object.keys(value).length === 0) {
      return { form: {} };
    }
  }
  return value;
}, intersection(object({
  form: FormElicitationCapabilitySchema.optional(),
  url: AssertObjectSchema.optional()
}), record(string2(), unknown()).optional()));
var ClientTasksCapabilitySchema = looseObject({
  /**
   * Present if the client supports listing tasks.
   */
  list: AssertObjectSchema.optional(),
  /**
   * Present if the client supports cancelling tasks.
   */
  cancel: AssertObjectSchema.optional(),
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: looseObject({
    /**
     * Task support for sampling requests.
     */
    sampling: looseObject({
      createMessage: AssertObjectSchema.optional()
    }).optional(),
    /**
     * Task support for elicitation requests.
     */
    elicitation: looseObject({
      create: AssertObjectSchema.optional()
    }).optional()
  }).optional()
});
var ServerTasksCapabilitySchema = looseObject({
  /**
   * Present if the server supports listing tasks.
   */
  list: AssertObjectSchema.optional(),
  /**
   * Present if the server supports cancelling tasks.
   */
  cancel: AssertObjectSchema.optional(),
  /**
   * Capabilities for task creation on specific request types.
   */
  requests: looseObject({
    /**
     * Task support for tool requests.
     */
    tools: looseObject({
      call: AssertObjectSchema.optional()
    }).optional()
  }).optional()
});
var ClientCapabilitiesSchema = object({
  /**
   * Experimental, non-standard capabilities that the client supports.
   */
  experimental: record(string2(), AssertObjectSchema).optional(),
  /**
   * Present if the client supports sampling from an LLM.
   */
  sampling: object({
    /**
     * Present if the client supports context inclusion via includeContext parameter.
     * If not declared, servers SHOULD only use `includeContext: "none"` (or omit it).
     */
    context: AssertObjectSchema.optional(),
    /**
     * Present if the client supports tool use via tools and toolChoice parameters.
     */
    tools: AssertObjectSchema.optional()
  }).optional(),
  /**
   * Present if the client supports eliciting user input.
   */
  elicitation: ElicitationCapabilitySchema.optional(),
  /**
   * Present if the client supports listing roots.
   */
  roots: object({
    /**
     * Whether the client supports issuing notifications for changes to the roots list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the client supports task creation.
   */
  tasks: ClientTasksCapabilitySchema.optional(),
  /**
   * Extensions that the client supports. Keys are extension identifiers (vendor-prefix/extension-name).
   */
  extensions: record(string2(), AssertObjectSchema).optional()
});
var InitializeRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The latest version of the Model Context Protocol that the client supports. The client MAY decide to support older versions as well.
   */
  protocolVersion: string2(),
  capabilities: ClientCapabilitiesSchema,
  clientInfo: ImplementationSchema
});
var InitializeRequestSchema = RequestSchema.extend({
  method: literal("initialize"),
  params: InitializeRequestParamsSchema
});
var ServerCapabilitiesSchema = object({
  /**
   * Experimental, non-standard capabilities that the server supports.
   */
  experimental: record(string2(), AssertObjectSchema).optional(),
  /**
   * Present if the server supports sending log messages to the client.
   */
  logging: AssertObjectSchema.optional(),
  /**
   * Present if the server supports sending completions to the client.
   */
  completions: AssertObjectSchema.optional(),
  /**
   * Present if the server offers any prompt templates.
   */
  prompts: object({
    /**
     * Whether this server supports issuing notifications for changes to the prompt list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server offers any resources to read.
   */
  resources: object({
    /**
     * Whether this server supports clients subscribing to resource updates.
     */
    subscribe: boolean2().optional(),
    /**
     * Whether this server supports issuing notifications for changes to the resource list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server offers any tools to call.
   */
  tools: object({
    /**
     * Whether this server supports issuing notifications for changes to the tool list.
     */
    listChanged: boolean2().optional()
  }).optional(),
  /**
   * Present if the server supports task creation.
   */
  tasks: ServerTasksCapabilitySchema.optional(),
  /**
   * Extensions that the server supports. Keys are extension identifiers (vendor-prefix/extension-name).
   */
  extensions: record(string2(), AssertObjectSchema).optional()
});
var InitializeResultSchema = ResultSchema.extend({
  /**
   * The version of the Model Context Protocol that the server wants to use. This may not match the version that the client requested. If the client cannot support this version, it MUST disconnect.
   */
  protocolVersion: string2(),
  capabilities: ServerCapabilitiesSchema,
  serverInfo: ImplementationSchema,
  /**
   * Instructions describing how to use the server and its features.
   *
   * This can be used by clients to improve the LLM's understanding of available tools, resources, etc. It can be thought of like a "hint" to the model. For example, this information MAY be added to the system prompt.
   */
  instructions: string2().optional()
});
var InitializedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/initialized"),
  params: NotificationsParamsSchema.optional()
});
var PingRequestSchema = RequestSchema.extend({
  method: literal("ping"),
  params: BaseRequestParamsSchema.optional()
});
var ProgressSchema = object({
  /**
   * The progress thus far. This should increase every time progress is made, even if the total is unknown.
   */
  progress: number2(),
  /**
   * Total number of items to process (or total progress required), if known.
   */
  total: optional(number2()),
  /**
   * An optional message describing the current progress.
   */
  message: optional(string2())
});
var ProgressNotificationParamsSchema = object({
  ...NotificationsParamsSchema.shape,
  ...ProgressSchema.shape,
  /**
   * The progress token which was given in the initial request, used to associate this notification with the request that is proceeding.
   */
  progressToken: ProgressTokenSchema
});
var ProgressNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/progress"),
  params: ProgressNotificationParamsSchema
});
var PaginatedRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * An opaque token representing the current pagination position.
   * If provided, the server should return results starting after this cursor.
   */
  cursor: CursorSchema.optional()
});
var PaginatedRequestSchema = RequestSchema.extend({
  params: PaginatedRequestParamsSchema.optional()
});
var PaginatedResultSchema = ResultSchema.extend({
  /**
   * An opaque token representing the pagination position after the last returned result.
   * If present, there may be more results available.
   */
  nextCursor: CursorSchema.optional()
});
var TaskStatusSchema = _enum(["working", "input_required", "completed", "failed", "cancelled"]);
var TaskSchema = object({
  taskId: string2(),
  status: TaskStatusSchema,
  /**
   * Time in milliseconds to keep task results available after completion.
   * If null, the task has unlimited lifetime until manually cleaned up.
   */
  ttl: union([number2(), _null3()]),
  /**
   * ISO 8601 timestamp when the task was created.
   */
  createdAt: string2(),
  /**
   * ISO 8601 timestamp when the task was last updated.
   */
  lastUpdatedAt: string2(),
  pollInterval: optional(number2()),
  /**
   * Optional diagnostic message for failed tasks or other status information.
   */
  statusMessage: optional(string2())
});
var CreateTaskResultSchema = ResultSchema.extend({
  task: TaskSchema
});
var TaskStatusNotificationParamsSchema = NotificationsParamsSchema.merge(TaskSchema);
var TaskStatusNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/tasks/status"),
  params: TaskStatusNotificationParamsSchema
});
var GetTaskRequestSchema = RequestSchema.extend({
  method: literal("tasks/get"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var GetTaskResultSchema = ResultSchema.merge(TaskSchema);
var GetTaskPayloadRequestSchema = RequestSchema.extend({
  method: literal("tasks/result"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var GetTaskPayloadResultSchema = ResultSchema.loose();
var ListTasksRequestSchema = PaginatedRequestSchema.extend({
  method: literal("tasks/list")
});
var ListTasksResultSchema = PaginatedResultSchema.extend({
  tasks: array(TaskSchema)
});
var CancelTaskRequestSchema = RequestSchema.extend({
  method: literal("tasks/cancel"),
  params: BaseRequestParamsSchema.extend({
    taskId: string2()
  })
});
var CancelTaskResultSchema = ResultSchema.merge(TaskSchema);
var ResourceContentsSchema = object({
  /**
   * The URI of this resource.
   */
  uri: string2(),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: optional(string2()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var TextResourceContentsSchema = ResourceContentsSchema.extend({
  /**
   * The text of the item. This must only be set if the item can actually be represented as text (not binary data).
   */
  text: string2()
});
var Base64Schema = string2().refine((val) => {
  try {
    atob(val);
    return true;
  } catch {
    return false;
  }
}, { message: "Invalid Base64 string" });
var BlobResourceContentsSchema = ResourceContentsSchema.extend({
  /**
   * A base64-encoded string representing the binary data of the item.
   */
  blob: Base64Schema
});
var RoleSchema = _enum(["user", "assistant"]);
var AnnotationsSchema = object({
  /**
   * Intended audience(s) for the resource.
   */
  audience: array(RoleSchema).optional(),
  /**
   * Importance hint for the resource, from 0 (least) to 1 (most).
   */
  priority: number2().min(0).max(1).optional(),
  /**
   * ISO 8601 timestamp for the most recent modification.
   */
  lastModified: iso_exports.datetime({ offset: true }).optional()
});
var ResourceSchema = object({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * The URI of this resource.
   */
  uri: string2(),
  /**
   * A description of what this resource represents.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: optional(string2()),
  /**
   * The MIME type of this resource, if known.
   */
  mimeType: optional(string2()),
  /**
   * The size of the raw resource content, in bytes (i.e., before base64 encoding or any tokenization), if known.
   *
   * This can be used by Hosts to display file sizes and estimate context window usage.
   */
  size: optional(number2()),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ResourceTemplateSchema = object({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * A URI template (according to RFC 6570) that can be used to construct resource URIs.
   */
  uriTemplate: string2(),
  /**
   * A description of what this template is for.
   *
   * This can be used by clients to improve the LLM's understanding of available resources. It can be thought of like a "hint" to the model.
   */
  description: optional(string2()),
  /**
   * The MIME type for all resources that match this template. This should only be included if all resources matching this template have the same type.
   */
  mimeType: optional(string2()),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ListResourcesRequestSchema = PaginatedRequestSchema.extend({
  method: literal("resources/list")
});
var ListResourcesResultSchema = PaginatedResultSchema.extend({
  resources: array(ResourceSchema)
});
var ListResourceTemplatesRequestSchema = PaginatedRequestSchema.extend({
  method: literal("resources/templates/list")
});
var ListResourceTemplatesResultSchema = PaginatedResultSchema.extend({
  resourceTemplates: array(ResourceTemplateSchema)
});
var ResourceRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The URI of the resource to read. The URI can use any protocol; it is up to the server how to interpret it.
   *
   * @format uri
   */
  uri: string2()
});
var ReadResourceRequestParamsSchema = ResourceRequestParamsSchema;
var ReadResourceRequestSchema = RequestSchema.extend({
  method: literal("resources/read"),
  params: ReadResourceRequestParamsSchema
});
var ReadResourceResultSchema = ResultSchema.extend({
  contents: array(union([TextResourceContentsSchema, BlobResourceContentsSchema]))
});
var ResourceListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/resources/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var SubscribeRequestParamsSchema = ResourceRequestParamsSchema;
var SubscribeRequestSchema = RequestSchema.extend({
  method: literal("resources/subscribe"),
  params: SubscribeRequestParamsSchema
});
var UnsubscribeRequestParamsSchema = ResourceRequestParamsSchema;
var UnsubscribeRequestSchema = RequestSchema.extend({
  method: literal("resources/unsubscribe"),
  params: UnsubscribeRequestParamsSchema
});
var ResourceUpdatedNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The URI of the resource that has been updated. This might be a sub-resource of the one that the client actually subscribed to.
   */
  uri: string2()
});
var ResourceUpdatedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/resources/updated"),
  params: ResourceUpdatedNotificationParamsSchema
});
var PromptArgumentSchema = object({
  /**
   * The name of the argument.
   */
  name: string2(),
  /**
   * A human-readable description of the argument.
   */
  description: optional(string2()),
  /**
   * Whether this argument must be provided.
   */
  required: optional(boolean2())
});
var PromptSchema = object({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * An optional description of what this prompt provides
   */
  description: optional(string2()),
  /**
   * A list of arguments to use for templating the prompt.
   */
  arguments: optional(array(PromptArgumentSchema)),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: optional(looseObject({}))
});
var ListPromptsRequestSchema = PaginatedRequestSchema.extend({
  method: literal("prompts/list")
});
var ListPromptsResultSchema = PaginatedResultSchema.extend({
  prompts: array(PromptSchema)
});
var GetPromptRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The name of the prompt or prompt template.
   */
  name: string2(),
  /**
   * Arguments to use for templating the prompt.
   */
  arguments: record(string2(), string2()).optional()
});
var GetPromptRequestSchema = RequestSchema.extend({
  method: literal("prompts/get"),
  params: GetPromptRequestParamsSchema
});
var TextContentSchema = object({
  type: literal("text"),
  /**
   * The text content of the message.
   */
  text: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ImageContentSchema = object({
  type: literal("image"),
  /**
   * The base64-encoded image data.
   */
  data: Base64Schema,
  /**
   * The MIME type of the image. Different providers may support different image types.
   */
  mimeType: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var AudioContentSchema = object({
  type: literal("audio"),
  /**
   * The base64-encoded audio data.
   */
  data: Base64Schema,
  /**
   * The MIME type of the audio. Different providers may support different audio types.
   */
  mimeType: string2(),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ToolUseContentSchema = object({
  type: literal("tool_use"),
  /**
   * The name of the tool to invoke.
   * Must match a tool name from the request's tools array.
   */
  name: string2(),
  /**
   * Unique identifier for this tool call.
   * Used to correlate with ToolResultContent in subsequent messages.
   */
  id: string2(),
  /**
   * Arguments to pass to the tool.
   * Must conform to the tool's inputSchema.
   */
  input: record(string2(), unknown()),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var EmbeddedResourceSchema = object({
  type: literal("resource"),
  resource: union([TextResourceContentsSchema, BlobResourceContentsSchema]),
  /**
   * Optional annotations for the client.
   */
  annotations: AnnotationsSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ResourceLinkSchema = ResourceSchema.extend({
  type: literal("resource_link")
});
var ContentBlockSchema = union([
  TextContentSchema,
  ImageContentSchema,
  AudioContentSchema,
  ResourceLinkSchema,
  EmbeddedResourceSchema
]);
var PromptMessageSchema = object({
  role: RoleSchema,
  content: ContentBlockSchema
});
var GetPromptResultSchema = ResultSchema.extend({
  /**
   * An optional description for the prompt.
   */
  description: string2().optional(),
  messages: array(PromptMessageSchema)
});
var PromptListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/prompts/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ToolAnnotationsSchema = object({
  /**
   * A human-readable title for the tool.
   */
  title: string2().optional(),
  /**
   * If true, the tool does not modify its environment.
   *
   * Default: false
   */
  readOnlyHint: boolean2().optional(),
  /**
   * If true, the tool may perform destructive updates to its environment.
   * If false, the tool performs only additive updates.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: true
   */
  destructiveHint: boolean2().optional(),
  /**
   * If true, calling the tool repeatedly with the same arguments
   * will have no additional effect on the its environment.
   *
   * (This property is meaningful only when `readOnlyHint == false`)
   *
   * Default: false
   */
  idempotentHint: boolean2().optional(),
  /**
   * If true, this tool may interact with an "open world" of external
   * entities. If false, the tool's domain of interaction is closed.
   * For example, the world of a web search tool is open, whereas that
   * of a memory tool is not.
   *
   * Default: true
   */
  openWorldHint: boolean2().optional()
});
var ToolExecutionSchema = object({
  /**
   * Indicates the tool's preference for task-augmented execution.
   * - "required": Clients MUST invoke the tool as a task
   * - "optional": Clients MAY invoke the tool as a task or normal request
   * - "forbidden": Clients MUST NOT attempt to invoke the tool as a task
   *
   * If not present, defaults to "forbidden".
   */
  taskSupport: _enum(["required", "optional", "forbidden"]).optional()
});
var ToolSchema = object({
  ...BaseMetadataSchema.shape,
  ...IconsSchema.shape,
  /**
   * A human-readable description of the tool.
   */
  description: string2().optional(),
  /**
   * A JSON Schema 2020-12 object defining the expected parameters for the tool.
   * Must have type: 'object' at the root level per MCP spec.
   */
  inputSchema: object({
    type: literal("object"),
    properties: record(string2(), AssertObjectSchema).optional(),
    required: array(string2()).optional()
  }).catchall(unknown()),
  /**
   * An optional JSON Schema 2020-12 object defining the structure of the tool's output
   * returned in the structuredContent field of a CallToolResult.
   * Must have type: 'object' at the root level per MCP spec.
   */
  outputSchema: object({
    type: literal("object"),
    properties: record(string2(), AssertObjectSchema).optional(),
    required: array(string2()).optional()
  }).catchall(unknown()).optional(),
  /**
   * Optional additional tool information.
   */
  annotations: ToolAnnotationsSchema.optional(),
  /**
   * Execution-related properties for this tool.
   */
  execution: ToolExecutionSchema.optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ListToolsRequestSchema = PaginatedRequestSchema.extend({
  method: literal("tools/list")
});
var ListToolsResultSchema = PaginatedResultSchema.extend({
  tools: array(ToolSchema)
});
var CallToolResultSchema = ResultSchema.extend({
  /**
   * A list of content objects that represent the result of the tool call.
   *
   * If the Tool does not define an outputSchema, this field MUST be present in the result.
   * For backwards compatibility, this field is always present, but it may be empty.
   */
  content: array(ContentBlockSchema).default([]),
  /**
   * An object containing structured tool output.
   *
   * If the Tool defines an outputSchema, this field MUST be present in the result, and contain a JSON object that matches the schema.
   */
  structuredContent: record(string2(), unknown()).optional(),
  /**
   * Whether the tool call ended in an error.
   *
   * If not set, this is assumed to be false (the call was successful).
   *
   * Any errors that originate from the tool SHOULD be reported inside the result
   * object, with `isError` set to true, _not_ as an MCP protocol-level error
   * response. Otherwise, the LLM would not be able to see that an error occurred
   * and self-correct.
   *
   * However, any errors in _finding_ the tool, an error indicating that the
   * server does not support tool calls, or any other exceptional conditions,
   * should be reported as an MCP error response.
   */
  isError: boolean2().optional()
});
var CompatibilityCallToolResultSchema = CallToolResultSchema.or(ResultSchema.extend({
  toolResult: unknown()
}));
var CallToolRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The name of the tool to call.
   */
  name: string2(),
  /**
   * Arguments to pass to the tool.
   */
  arguments: record(string2(), unknown()).optional()
});
var CallToolRequestSchema = RequestSchema.extend({
  method: literal("tools/call"),
  params: CallToolRequestParamsSchema
});
var ToolListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/tools/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ListChangedOptionsBaseSchema = object({
  /**
   * If true, the list will be refreshed automatically when a list changed notification is received.
   * The callback will be called with the updated list.
   *
   * If false, the callback will be called with null items, allowing manual refresh.
   *
   * @default true
   */
  autoRefresh: boolean2().default(true),
  /**
   * Debounce time in milliseconds for list changed notification processing.
   *
   * Multiple notifications received within this timeframe will only trigger one refresh.
   * Set to 0 to disable debouncing.
   *
   * @default 300
   */
  debounceMs: number2().int().nonnegative().default(300)
});
var LoggingLevelSchema = _enum(["debug", "info", "notice", "warning", "error", "critical", "alert", "emergency"]);
var SetLevelRequestParamsSchema = BaseRequestParamsSchema.extend({
  /**
   * The level of logging that the client wants to receive from the server. The server should send all logs at this level and higher (i.e., more severe) to the client as notifications/logging/message.
   */
  level: LoggingLevelSchema
});
var SetLevelRequestSchema = RequestSchema.extend({
  method: literal("logging/setLevel"),
  params: SetLevelRequestParamsSchema
});
var LoggingMessageNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The severity of this log message.
   */
  level: LoggingLevelSchema,
  /**
   * An optional name of the logger issuing this message.
   */
  logger: string2().optional(),
  /**
   * The data to be logged, such as a string message or an object. Any JSON serializable type is allowed here.
   */
  data: unknown()
});
var LoggingMessageNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/message"),
  params: LoggingMessageNotificationParamsSchema
});
var ModelHintSchema = object({
  /**
   * A hint for a model name.
   */
  name: string2().optional()
});
var ModelPreferencesSchema = object({
  /**
   * Optional hints to use for model selection.
   */
  hints: array(ModelHintSchema).optional(),
  /**
   * How much to prioritize cost when selecting a model.
   */
  costPriority: number2().min(0).max(1).optional(),
  /**
   * How much to prioritize sampling speed (latency) when selecting a model.
   */
  speedPriority: number2().min(0).max(1).optional(),
  /**
   * How much to prioritize intelligence and capabilities when selecting a model.
   */
  intelligencePriority: number2().min(0).max(1).optional()
});
var ToolChoiceSchema = object({
  /**
   * Controls when tools are used:
   * - "auto": Model decides whether to use tools (default)
   * - "required": Model MUST use at least one tool before completing
   * - "none": Model MUST NOT use any tools
   */
  mode: _enum(["auto", "required", "none"]).optional()
});
var ToolResultContentSchema = object({
  type: literal("tool_result"),
  toolUseId: string2().describe("The unique identifier for the corresponding tool call."),
  content: array(ContentBlockSchema).default([]),
  structuredContent: object({}).loose().optional(),
  isError: boolean2().optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var SamplingContentSchema = discriminatedUnion("type", [TextContentSchema, ImageContentSchema, AudioContentSchema]);
var SamplingMessageContentBlockSchema = discriminatedUnion("type", [
  TextContentSchema,
  ImageContentSchema,
  AudioContentSchema,
  ToolUseContentSchema,
  ToolResultContentSchema
]);
var SamplingMessageSchema = object({
  role: RoleSchema,
  content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)]),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var CreateMessageRequestParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  messages: array(SamplingMessageSchema),
  /**
   * The server's preferences for which model to select. The client MAY modify or omit this request.
   */
  modelPreferences: ModelPreferencesSchema.optional(),
  /**
   * An optional system prompt the server wants to use for sampling. The client MAY modify or omit this prompt.
   */
  systemPrompt: string2().optional(),
  /**
   * A request to include context from one or more MCP servers (including the caller), to be attached to the prompt.
   * The client MAY ignore this request.
   *
   * Default is "none". Values "thisServer" and "allServers" are soft-deprecated. Servers SHOULD only use these values if the client
   * declares ClientCapabilities.sampling.context. These values may be removed in future spec releases.
   */
  includeContext: _enum(["none", "thisServer", "allServers"]).optional(),
  temperature: number2().optional(),
  /**
   * The requested maximum number of tokens to sample (to prevent runaway completions).
   *
   * The client MAY choose to sample fewer tokens than the requested maximum.
   */
  maxTokens: number2().int(),
  stopSequences: array(string2()).optional(),
  /**
   * Optional metadata to pass through to the LLM provider. The format of this metadata is provider-specific.
   */
  metadata: AssertObjectSchema.optional(),
  /**
   * Tools that the model may use during generation.
   * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
   */
  tools: array(ToolSchema).optional(),
  /**
   * Controls how the model uses tools.
   * The client MUST return an error if this field is provided but ClientCapabilities.sampling.tools is not declared.
   * Default is `{ mode: "auto" }`.
   */
  toolChoice: ToolChoiceSchema.optional()
});
var CreateMessageRequestSchema = RequestSchema.extend({
  method: literal("sampling/createMessage"),
  params: CreateMessageRequestParamsSchema
});
var CreateMessageResultSchema = ResultSchema.extend({
  /**
   * The name of the model that generated the message.
   */
  model: string2(),
  /**
   * The reason why sampling stopped, if known.
   *
   * Standard values:
   * - "endTurn": Natural end of the assistant's turn
   * - "stopSequence": A stop sequence was encountered
   * - "maxTokens": Maximum token limit was reached
   *
   * This field is an open string to allow for provider-specific stop reasons.
   */
  stopReason: optional(_enum(["endTurn", "stopSequence", "maxTokens"]).or(string2())),
  role: RoleSchema,
  /**
   * Response content. Single content block (text, image, or audio).
   */
  content: SamplingContentSchema
});
var CreateMessageResultWithToolsSchema = ResultSchema.extend({
  /**
   * The name of the model that generated the message.
   */
  model: string2(),
  /**
   * The reason why sampling stopped, if known.
   *
   * Standard values:
   * - "endTurn": Natural end of the assistant's turn
   * - "stopSequence": A stop sequence was encountered
   * - "maxTokens": Maximum token limit was reached
   * - "toolUse": The model wants to use one or more tools
   *
   * This field is an open string to allow for provider-specific stop reasons.
   */
  stopReason: optional(_enum(["endTurn", "stopSequence", "maxTokens", "toolUse"]).or(string2())),
  role: RoleSchema,
  /**
   * Response content. May be a single block or array. May include ToolUseContent if stopReason is "toolUse".
   */
  content: union([SamplingMessageContentBlockSchema, array(SamplingMessageContentBlockSchema)])
});
var BooleanSchemaSchema = object({
  type: literal("boolean"),
  title: string2().optional(),
  description: string2().optional(),
  default: boolean2().optional()
});
var StringSchemaSchema = object({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  minLength: number2().optional(),
  maxLength: number2().optional(),
  format: _enum(["email", "uri", "date", "date-time"]).optional(),
  default: string2().optional()
});
var NumberSchemaSchema = object({
  type: _enum(["number", "integer"]),
  title: string2().optional(),
  description: string2().optional(),
  minimum: number2().optional(),
  maximum: number2().optional(),
  default: number2().optional()
});
var UntitledSingleSelectEnumSchemaSchema = object({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  enum: array(string2()),
  default: string2().optional()
});
var TitledSingleSelectEnumSchemaSchema = object({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  oneOf: array(object({
    const: string2(),
    title: string2()
  })),
  default: string2().optional()
});
var LegacyTitledEnumSchemaSchema = object({
  type: literal("string"),
  title: string2().optional(),
  description: string2().optional(),
  enum: array(string2()),
  enumNames: array(string2()).optional(),
  default: string2().optional()
});
var SingleSelectEnumSchemaSchema = union([UntitledSingleSelectEnumSchemaSchema, TitledSingleSelectEnumSchemaSchema]);
var UntitledMultiSelectEnumSchemaSchema = object({
  type: literal("array"),
  title: string2().optional(),
  description: string2().optional(),
  minItems: number2().optional(),
  maxItems: number2().optional(),
  items: object({
    type: literal("string"),
    enum: array(string2())
  }),
  default: array(string2()).optional()
});
var TitledMultiSelectEnumSchemaSchema = object({
  type: literal("array"),
  title: string2().optional(),
  description: string2().optional(),
  minItems: number2().optional(),
  maxItems: number2().optional(),
  items: object({
    anyOf: array(object({
      const: string2(),
      title: string2()
    }))
  }),
  default: array(string2()).optional()
});
var MultiSelectEnumSchemaSchema = union([UntitledMultiSelectEnumSchemaSchema, TitledMultiSelectEnumSchemaSchema]);
var EnumSchemaSchema = union([LegacyTitledEnumSchemaSchema, SingleSelectEnumSchemaSchema, MultiSelectEnumSchemaSchema]);
var PrimitiveSchemaDefinitionSchema = union([EnumSchemaSchema, BooleanSchemaSchema, StringSchemaSchema, NumberSchemaSchema]);
var ElicitRequestFormParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The elicitation mode.
   *
   * Optional for backward compatibility. Clients MUST treat missing mode as "form".
   */
  mode: literal("form").optional(),
  /**
   * The message to present to the user describing what information is being requested.
   */
  message: string2(),
  /**
   * A restricted subset of JSON Schema.
   * Only top-level properties are allowed, without nesting.
   */
  requestedSchema: object({
    type: literal("object"),
    properties: record(string2(), PrimitiveSchemaDefinitionSchema),
    required: array(string2()).optional()
  })
});
var ElicitRequestURLParamsSchema = TaskAugmentedRequestParamsSchema.extend({
  /**
   * The elicitation mode.
   */
  mode: literal("url"),
  /**
   * The message to present to the user explaining why the interaction is needed.
   */
  message: string2(),
  /**
   * The ID of the elicitation, which must be unique within the context of the server.
   * The client MUST treat this ID as an opaque value.
   */
  elicitationId: string2(),
  /**
   * The URL that the user should navigate to.
   */
  url: string2().url()
});
var ElicitRequestParamsSchema = union([ElicitRequestFormParamsSchema, ElicitRequestURLParamsSchema]);
var ElicitRequestSchema = RequestSchema.extend({
  method: literal("elicitation/create"),
  params: ElicitRequestParamsSchema
});
var ElicitationCompleteNotificationParamsSchema = NotificationsParamsSchema.extend({
  /**
   * The ID of the elicitation that completed.
   */
  elicitationId: string2()
});
var ElicitationCompleteNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/elicitation/complete"),
  params: ElicitationCompleteNotificationParamsSchema
});
var ElicitResultSchema = ResultSchema.extend({
  /**
   * The user action in response to the elicitation.
   * - "accept": User submitted the form/confirmed the action
   * - "decline": User explicitly decline the action
   * - "cancel": User dismissed without making an explicit choice
   */
  action: _enum(["accept", "decline", "cancel"]),
  /**
   * The submitted form data, only present when action is "accept".
   * Contains values matching the requested schema.
   * Per MCP spec, content is "typically omitted" for decline/cancel actions.
   * We normalize null to undefined for leniency while maintaining type compatibility.
   */
  content: preprocess((val) => val === null ? void 0 : val, record(string2(), union([string2(), number2(), boolean2(), array(string2())])).optional())
});
var ResourceTemplateReferenceSchema = object({
  type: literal("ref/resource"),
  /**
   * The URI or URI template of the resource.
   */
  uri: string2()
});
var PromptReferenceSchema = object({
  type: literal("ref/prompt"),
  /**
   * The name of the prompt or prompt template
   */
  name: string2()
});
var CompleteRequestParamsSchema = BaseRequestParamsSchema.extend({
  ref: union([PromptReferenceSchema, ResourceTemplateReferenceSchema]),
  /**
   * The argument's information
   */
  argument: object({
    /**
     * The name of the argument
     */
    name: string2(),
    /**
     * The value of the argument to use for completion matching.
     */
    value: string2()
  }),
  context: object({
    /**
     * Previously-resolved variables in a URI template or prompt.
     */
    arguments: record(string2(), string2()).optional()
  }).optional()
});
var CompleteRequestSchema = RequestSchema.extend({
  method: literal("completion/complete"),
  params: CompleteRequestParamsSchema
});
var CompleteResultSchema = ResultSchema.extend({
  completion: looseObject({
    /**
     * An array of completion values. Must not exceed 100 items.
     */
    values: array(string2()).max(100),
    /**
     * The total number of completion options available. This can exceed the number of values actually sent in the response.
     */
    total: optional(number2().int()),
    /**
     * Indicates whether there are additional completion options beyond those provided in the current response, even if the exact total is unknown.
     */
    hasMore: optional(boolean2())
  })
});
var RootSchema = object({
  /**
   * The URI identifying the root. This *must* start with file:// for now.
   */
  uri: string2().startsWith("file://"),
  /**
   * An optional name for the root.
   */
  name: string2().optional(),
  /**
   * See [MCP specification](https://github.com/modelcontextprotocol/modelcontextprotocol/blob/47339c03c143bb4ec01a26e721a1b8fe66634ebe/docs/specification/draft/basic/index.mdx#general-fields)
   * for notes on _meta usage.
   */
  _meta: record(string2(), unknown()).optional()
});
var ListRootsRequestSchema = RequestSchema.extend({
  method: literal("roots/list"),
  params: BaseRequestParamsSchema.optional()
});
var ListRootsResultSchema = ResultSchema.extend({
  roots: array(RootSchema)
});
var RootsListChangedNotificationSchema = NotificationSchema.extend({
  method: literal("notifications/roots/list_changed"),
  params: NotificationsParamsSchema.optional()
});
var ClientRequestSchema = union([
  PingRequestSchema,
  InitializeRequestSchema,
  CompleteRequestSchema,
  SetLevelRequestSchema,
  GetPromptRequestSchema,
  ListPromptsRequestSchema,
  ListResourcesRequestSchema,
  ListResourceTemplatesRequestSchema,
  ReadResourceRequestSchema,
  SubscribeRequestSchema,
  UnsubscribeRequestSchema,
  CallToolRequestSchema,
  ListToolsRequestSchema,
  GetTaskRequestSchema,
  GetTaskPayloadRequestSchema,
  ListTasksRequestSchema,
  CancelTaskRequestSchema
]);
var ClientNotificationSchema = union([
  CancelledNotificationSchema,
  ProgressNotificationSchema,
  InitializedNotificationSchema,
  RootsListChangedNotificationSchema,
  TaskStatusNotificationSchema
]);
var ClientResultSchema = union([
  EmptyResultSchema,
  CreateMessageResultSchema,
  CreateMessageResultWithToolsSchema,
  ElicitResultSchema,
  ListRootsResultSchema,
  GetTaskResultSchema,
  ListTasksResultSchema,
  CreateTaskResultSchema
]);
var ServerRequestSchema = union([
  PingRequestSchema,
  CreateMessageRequestSchema,
  ElicitRequestSchema,
  ListRootsRequestSchema,
  GetTaskRequestSchema,
  GetTaskPayloadRequestSchema,
  ListTasksRequestSchema,
  CancelTaskRequestSchema
]);
var ServerNotificationSchema = union([
  CancelledNotificationSchema,
  ProgressNotificationSchema,
  LoggingMessageNotificationSchema,
  ResourceUpdatedNotificationSchema,
  ResourceListChangedNotificationSchema,
  ToolListChangedNotificationSchema,
  PromptListChangedNotificationSchema,
  TaskStatusNotificationSchema,
  ElicitationCompleteNotificationSchema
]);
var ServerResultSchema = union([
  EmptyResultSchema,
  InitializeResultSchema,
  CompleteResultSchema,
  GetPromptResultSchema,
  ListPromptsResultSchema,
  ListResourcesResultSchema,
  ListResourceTemplatesResultSchema,
  ReadResourceResultSchema,
  CallToolResultSchema,
  ListToolsResultSchema,
  GetTaskResultSchema,
  ListTasksResultSchema,
  CreateTaskResultSchema
]);

// node_modules/zod/v3/external.js
var external_exports = {};
__export(external_exports, {
  BRAND: () => BRAND,
  DIRTY: () => DIRTY,
  EMPTY_PATH: () => EMPTY_PATH,
  INVALID: () => INVALID,
  NEVER: () => NEVER,
  OK: () => OK,
  ParseStatus: () => ParseStatus,
  Schema: () => ZodType2,
  ZodAny: () => ZodAny,
  ZodArray: () => ZodArray2,
  ZodBigInt: () => ZodBigInt,
  ZodBoolean: () => ZodBoolean2,
  ZodBranded: () => ZodBranded,
  ZodCatch: () => ZodCatch2,
  ZodDate: () => ZodDate,
  ZodDefault: () => ZodDefault2,
  ZodDiscriminatedUnion: () => ZodDiscriminatedUnion2,
  ZodEffects: () => ZodEffects,
  ZodEnum: () => ZodEnum2,
  ZodError: () => ZodError,
  ZodFirstPartyTypeKind: () => ZodFirstPartyTypeKind,
  ZodFunction: () => ZodFunction,
  ZodIntersection: () => ZodIntersection2,
  ZodIssueCode: () => ZodIssueCode,
  ZodLazy: () => ZodLazy,
  ZodLiteral: () => ZodLiteral2,
  ZodMap: () => ZodMap,
  ZodNaN: () => ZodNaN,
  ZodNativeEnum: () => ZodNativeEnum,
  ZodNever: () => ZodNever2,
  ZodNull: () => ZodNull2,
  ZodNullable: () => ZodNullable2,
  ZodNumber: () => ZodNumber2,
  ZodObject: () => ZodObject2,
  ZodOptional: () => ZodOptional2,
  ZodParsedType: () => ZodParsedType,
  ZodPipeline: () => ZodPipeline,
  ZodPromise: () => ZodPromise,
  ZodReadonly: () => ZodReadonly2,
  ZodRecord: () => ZodRecord2,
  ZodSchema: () => ZodType2,
  ZodSet: () => ZodSet,
  ZodString: () => ZodString2,
  ZodSymbol: () => ZodSymbol,
  ZodTransformer: () => ZodEffects,
  ZodTuple: () => ZodTuple,
  ZodType: () => ZodType2,
  ZodUndefined: () => ZodUndefined,
  ZodUnion: () => ZodUnion2,
  ZodUnknown: () => ZodUnknown2,
  ZodVoid: () => ZodVoid,
  addIssueToContext: () => addIssueToContext,
  any: () => anyType,
  array: () => arrayType,
  bigint: () => bigIntType,
  boolean: () => booleanType,
  coerce: () => coerce,
  custom: () => custom2,
  date: () => dateType,
  datetimeRegex: () => datetimeRegex,
  defaultErrorMap: () => en_default2,
  discriminatedUnion: () => discriminatedUnionType,
  effect: () => effectsType,
  enum: () => enumType,
  function: () => functionType,
  getErrorMap: () => getErrorMap,
  getParsedType: () => getParsedType2,
  instanceof: () => instanceOfType,
  intersection: () => intersectionType,
  isAborted: () => isAborted,
  isAsync: () => isAsync,
  isDirty: () => isDirty,
  isValid: () => isValid,
  late: () => late,
  lazy: () => lazyType,
  literal: () => literalType,
  makeIssue: () => makeIssue,
  map: () => mapType,
  nan: () => nanType,
  nativeEnum: () => nativeEnumType,
  never: () => neverType,
  null: () => nullType,
  nullable: () => nullableType,
  number: () => numberType,
  object: () => objectType,
  objectUtil: () => objectUtil,
  oboolean: () => oboolean,
  onumber: () => onumber,
  optional: () => optionalType,
  ostring: () => ostring,
  pipeline: () => pipelineType,
  preprocess: () => preprocessType,
  promise: () => promiseType,
  quotelessJson: () => quotelessJson,
  record: () => recordType,
  set: () => setType,
  setErrorMap: () => setErrorMap,
  strictObject: () => strictObjectType,
  string: () => stringType,
  symbol: () => symbolType,
  transformer: () => effectsType,
  tuple: () => tupleType,
  undefined: () => undefinedType,
  union: () => unionType,
  unknown: () => unknownType,
  util: () => util,
  void: () => voidType
});

// node_modules/zod/v3/helpers/util.js
var util;
(function(util2) {
  util2.assertEqual = (_) => {
  };
  function assertIs2(_arg) {
  }
  util2.assertIs = assertIs2;
  function assertNever2(_x) {
    throw new Error();
  }
  util2.assertNever = assertNever2;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object2) => {
    const keys = [];
    for (const key in object2) {
      if (Object.prototype.hasOwnProperty.call(object2, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return void 0;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && Number.isFinite(val) && Math.floor(val) === val;
  function joinValues2(array2, separator = " | ") {
    return array2.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues2;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
      // second overwrites first
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType2 = (data) => {
  const t = typeof data;
  switch (t) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return Number.isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};

// node_modules/zod/v3/ZodError.js
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};
var ZodError = class _ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue2) {
      return issue2.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error2) => {
      for (const issue2 of error2.issues) {
        if (issue2.code === "invalid_union") {
          issue2.unionErrors.map(processError);
        } else if (issue2.code === "invalid_return_type") {
          processError(issue2.returnTypeError);
        } else if (issue2.code === "invalid_arguments") {
          processError(issue2.argumentsError);
        } else if (issue2.path.length === 0) {
          fieldErrors._errors.push(mapper(issue2));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue2.path.length) {
            const el = issue2.path[i];
            const terminal = i === issue2.path.length - 1;
            if (el === "_errors") {
              if (terminal)
                curr._errors.push(mapper(issue2));
              i++;
              continue;
            }
            if (!Object.prototype.hasOwnProperty.call(curr, el)) {
              if (el === "__proto__") {
                Object.defineProperty(curr, el, {
                  value: { _errors: [] },
                  writable: true,
                  enumerable: true,
                  configurable: true
                });
              } else {
                curr[el] = { _errors: [] };
              }
            }
            curr = curr[el];
            if (terminal) {
              curr._errors.push(mapper(issue2));
            }
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof _ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue2) => issue2.message) {
    const fieldErrors = /* @__PURE__ */ Object.create(null);
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        const firstEl = sub.path[0];
        fieldErrors[firstEl] = fieldErrors[firstEl] || [];
        fieldErrors[firstEl].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
};
ZodError.create = (issues) => {
  const error2 = new ZodError(issues);
  return error2;
};

// node_modules/zod/v3/locales/en.js
var errorMap = (issue2, _ctx) => {
  let message;
  switch (issue2.code) {
    case ZodIssueCode.invalid_type:
      if (issue2.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue2.expected}, received ${issue2.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue2.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue2.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue2.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue2.options)}, received '${issue2.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue2.validation === "object") {
        if ("includes" in issue2.validation) {
          message = `Invalid input: must include "${issue2.validation.includes}"`;
          if (typeof issue2.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue2.validation.position}`;
          }
        } else if ("startsWith" in issue2.validation) {
          message = `Invalid input: must start with "${issue2.validation.startsWith}"`;
        } else if ("endsWith" in issue2.validation) {
          message = `Invalid input: must end with "${issue2.validation.endsWith}"`;
        } else {
          util.assertNever(issue2.validation);
        }
      } else if (issue2.validation !== "regex") {
        message = `Invalid ${issue2.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue2.type === "array")
        message = `Array must contain ${issue2.exact ? "exactly" : issue2.inclusive ? `at least` : `more than`} ${issue2.minimum} element(s)`;
      else if (issue2.type === "string")
        message = `String must contain ${issue2.exact ? "exactly" : issue2.inclusive ? `at least` : `over`} ${issue2.minimum} character(s)`;
      else if (issue2.type === "number")
        message = `Number must be ${issue2.exact ? `exactly equal to ` : issue2.inclusive ? `greater than or equal to ` : `greater than `}${issue2.minimum}`;
      else if (issue2.type === "bigint")
        message = `Number must be ${issue2.exact ? `exactly equal to ` : issue2.inclusive ? `greater than or equal to ` : `greater than `}${issue2.minimum}`;
      else if (issue2.type === "date")
        message = `Date must be ${issue2.exact ? `exactly equal to ` : issue2.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue2.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue2.type === "array")
        message = `Array must contain ${issue2.exact ? `exactly` : issue2.inclusive ? `at most` : `less than`} ${issue2.maximum} element(s)`;
      else if (issue2.type === "string")
        message = `String must contain ${issue2.exact ? `exactly` : issue2.inclusive ? `at most` : `under`} ${issue2.maximum} character(s)`;
      else if (issue2.type === "number")
        message = `Number must be ${issue2.exact ? `exactly` : issue2.inclusive ? `less than or equal to` : `less than`} ${issue2.maximum}`;
      else if (issue2.type === "bigint")
        message = `BigInt must be ${issue2.exact ? `exactly` : issue2.inclusive ? `less than or equal to` : `less than`} ${issue2.maximum}`;
      else if (issue2.type === "date")
        message = `Date must be ${issue2.exact ? `exactly` : issue2.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue2.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue2.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue2);
  }
  return { message };
};
var en_default2 = errorMap;

// node_modules/zod/v3/errors.js
var overrideErrorMap = en_default2;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}

// node_modules/zod/v3/helpers/parseUtil.js
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== void 0) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue2 = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      // contextual error map is first priority
      ctx.schemaErrorMap,
      // then schema-bound map if available
      overrideMap,
      // then global override map
      overrideMap === en_default2 ? void 0 : en_default2
      // then global default map
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue2);
}
var ParseStatus = class _ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return _ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
};
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;

// node_modules/zod/v3/helpers/errorUtil.js
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message?.message;
})(errorUtil || (errorUtil = {}));

// node_modules/zod/v3/types.js
var ParseInputLazyPath = class {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (Array.isArray(this._key)) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
};
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error2 = new ZodError(ctx.common.issues);
        this._error = error2;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message ?? ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: message ?? required_error ?? ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: message ?? invalid_type_error ?? ctx.defaultError };
  };
  return { errorMap: customMap, description };
}
var ZodType2 = class {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType2(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType2(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus(),
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType2(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    const ctx = {
      common: {
        issues: [],
        async: params?.async ?? false,
        contextualErrorMap: params?.errorMap
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType2(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType2(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if (err?.message?.toLowerCase()?.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params?.errorMap,
        async: true
      },
      path: params?.path || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType2(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional2.create(this, this._def);
  }
  nullable() {
    return ZodNullable2.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray2.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion2.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection2.create(this, incoming, this._def);
  }
  transform(transform2) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform: transform2 }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault2({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch2({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly2.create(this);
  }
  isOptional() {
    return this.safeParse(void 0).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
};
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^[\\p{Extended_Pictographic}\\p{Emoji_Component}]+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let secondsRegexSource = `[0-5]\\d`;
  if (args.precision) {
    secondsRegexSource = `${secondsRegexSource}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    secondsRegexSource = `${secondsRegexSource}(\\.\\d+)?`;
  }
  const secondsQuantifier = args.precision ? "+" : "?";
  return `([01]\\d|2[0-3]):[0-5]\\d(:${secondsRegexSource})${secondsQuantifier}`;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT2(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    if (!header)
      return false;
    const base642 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base642));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if ("typ" in decoded && decoded?.typ !== "JWT")
      return false;
    if (!decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch {
    return false;
  }
}
function isValidCidr(ip, version2) {
  if ((version2 === "v4" || !version2) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version2 === "v6" || !version2) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}
var ZodString2 = class _ZodString2 extends ZodType2 {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT2(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new _ZodString2({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      offset: options?.offset ?? false,
      local: options?.local ?? false,
      ...errorUtil.errToObj(options?.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof options?.precision === "undefined" ? null : options?.precision,
      ...errorUtil.errToObj(options?.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options?.position,
      ...errorUtil.errToObj(options?.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  /**
   * Equivalent to `.min(1)`
   */
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new _ZodString2({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new _ZodString2({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new _ZodString2({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodString2.create = (params) => {
  return new ZodString2({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder2(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = Number.parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = Number.parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / 10 ** decCount;
}
var ZodNumber2 = class _ZodNumber extends ZodType2 {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder2(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null;
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
};
ZodNumber2.create = (params) => {
  return new ZodNumber2({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodBigInt = class _ZodBigInt extends ZodType2 {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch {
        return this._getInvalidInput(input);
      }
    }
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = void 0;
    const status = new ParseStatus();
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new _ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new _ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
};
ZodBigInt.create = (params) => {
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: params?.coerce ?? false,
    ...processCreateParams(params)
  });
};
var ZodBoolean2 = class extends ZodType2 {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodBoolean2.create = (params) => {
  return new ZodBoolean2({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: params?.coerce || false,
    ...processCreateParams(params)
  });
};
var ZodDate = class _ZodDate extends ZodType2 {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (Number.isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus();
    let ctx = void 0;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new _ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
};
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: params?.coerce || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};
var ZodSymbol = class extends ZodType2 {
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};
var ZodUndefined = class extends ZodType2 {
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};
var ZodNull2 = class extends ZodType2 {
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodNull2.create = (params) => {
  return new ZodNull2({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};
var ZodAny = class extends ZodType2 {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};
var ZodUnknown2 = class extends ZodType2 {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
};
ZodUnknown2.create = (params) => {
  return new ZodUnknown2({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};
var ZodNever2 = class extends ZodType2 {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
};
ZodNever2.create = (params) => {
  return new ZodNever2({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};
var ZodVoid = class extends ZodType2 {
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
};
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};
var ZodArray2 = class _ZodArray extends ZodType2 {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : void 0,
          maximum: tooBig ? def.exactLength.value : void 0,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new _ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new _ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new _ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodArray2.create = (schema, params) => {
  return new ZodArray2({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject2) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional2.create(deepPartialify(fieldSchema));
    }
    return new ZodObject2({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray2) {
    return new ZodArray2({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional2) {
    return ZodOptional2.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable2) {
    return ZodNullable2.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}
var ZodObject2 = class _ZodObject extends ZodType2 {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    this._cached = { shape, keys };
    return this._cached;
  }
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever2 && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever2) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip") {
      } else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(
            new ParseInputLazyPath(ctx, value, ctx.path, key)
            //, ctx.child(key), value, getParsedType(value)
          ),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== void 0 ? {
        errorMap: (issue2, ctx) => {
          const defaultError = this._def.errorMap?.(issue2, ctx).message ?? ctx.defaultError;
          if (issue2.code === "unrecognized_keys")
            return {
              message: errorUtil.errToObj(message).message ?? defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new _ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  // const AugmentFactory =
  //   <Def extends ZodObjectDef>(def: Def) =>
  //   <Augmentation extends ZodRawShape>(
  //     augmentation: Augmentation
  //   ): ZodObject<
  //     extendShape<ReturnType<Def["shape"]>, Augmentation>,
  //     Def["unknownKeys"],
  //     Def["catchall"]
  //   > => {
  //     return new ZodObject({
  //       ...def,
  //       shape: () => ({
  //         ...def.shape(),
  //         ...augmentation,
  //       }),
  //     }) as any;
  //   };
  extend(augmentation) {
    return new _ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  /**
   * Prior to zod@1.0.12 there was a bug in the
   * inferred type of merged objects. Please
   * upgrade if you are experiencing issues.
   */
  merge(merging) {
    const merged = new _ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  // merge<
  //   Incoming extends AnyZodObject,
  //   Augmentation extends Incoming["shape"],
  //   NewOutput extends {
  //     [k in keyof Augmentation | keyof Output]: k extends keyof Augmentation
  //       ? Augmentation[k]["_output"]
  //       : k extends keyof Output
  //       ? Output[k]
  //       : never;
  //   },
  //   NewInput extends {
  //     [k in keyof Augmentation | keyof Input]: k extends keyof Augmentation
  //       ? Augmentation[k]["_input"]
  //       : k extends keyof Input
  //       ? Input[k]
  //       : never;
  //   }
  // >(
  //   merging: Incoming
  // ): ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"],
  //   NewOutput,
  //   NewInput
  // > {
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  // merge<Incoming extends AnyZodObject>(
  //   merging: Incoming
  // ): //ZodObject<T & Incoming["_shape"], UnknownKeys, Catchall> = (merging) => {
  // ZodObject<
  //   extendShape<T, ReturnType<Incoming["_def"]["shape"]>>,
  //   Incoming["_def"]["unknownKeys"],
  //   Incoming["_def"]["catchall"]
  // > {
  //   // const mergedShape = objectUtil.mergeShapes(
  //   //   this._def.shape(),
  //   //   merging._def.shape()
  //   // );
  //   const merged: any = new ZodObject({
  //     unknownKeys: merging._def.unknownKeys,
  //     catchall: merging._def.catchall,
  //     shape: () =>
  //       objectUtil.mergeShapes(this._def.shape(), merging._def.shape()),
  //     typeName: ZodFirstPartyTypeKind.ZodObject,
  //   }) as any;
  //   return merged;
  // }
  catchall(index) {
    return new _ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    for (const key of util.objectKeys(mask)) {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  /**
   * @deprecated
   */
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    for (const key of util.objectKeys(this.shape)) {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional2) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    }
    return new _ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
};
ZodObject2.create = (shape, params) => {
  return new ZodObject2({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever2.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject2.strictCreate = (shape, params) => {
  return new ZodObject2({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever2.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject2.lazycreate = (shape, params) => {
  return new ZodObject2({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever2.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
var ZodUnion2 = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = void 0;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
};
ZodUnion2.create = (types, params) => {
  return new ZodUnion2({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral2) {
    return [type.value];
  } else if (type instanceof ZodEnum2) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault2) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [void 0];
  } else if (type instanceof ZodNull2) {
    return [null];
  } else if (type instanceof ZodOptional2) {
    return [void 0, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable2) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly2) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch2) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};
var ZodDiscriminatedUnion2 = class _ZodDiscriminatedUnion extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  /**
   * The constructor of the discriminated union schema. Its behaviour is very similar to that of the normal z.union() constructor.
   * However, it only allows a union of objects, all of which need to share a discriminator property. This property must
   * have a different value for each object in the union.
   * @param discriminator the name of the discriminator property
   * @param types an array of object schemas
   * @param params
   */
  static create(discriminator, options, params) {
    const optionsMap = /* @__PURE__ */ new Map();
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new _ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
};
function mergeValues2(a, b) {
  const aType = getParsedType2(a);
  const bType = getParsedType2(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    if (Object.prototype.hasOwnProperty.call(newObj, "__proto__"))
      delete newObj.__proto__;
    for (const key of sharedKeys) {
      if (key === "__proto__")
        continue;
      const sharedValue = mergeValues2(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0; index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues2(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}
var ZodIntersection2 = class extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues2(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
};
ZodIntersection2.create = (left, right, params) => {
  return new ZodIntersection2({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};
var ZodTuple = class _ZodTuple extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new _ZodTuple({
      ...this._def,
      rest
    });
  }
};
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};
var ZodRecord2 = class _ZodRecord extends ZodType2 {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType2) {
      return new _ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new _ZodRecord({
      keyType: ZodString2.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
};
var ZodMap = class extends ZodType2 {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = /* @__PURE__ */ new Map();
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = /* @__PURE__ */ new Map();
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
};
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};
var ZodSet = class _ZodSet extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = /* @__PURE__ */ new Set();
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new _ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new _ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
};
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};
var ZodFunction = class _ZodFunction extends ZodType2 {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error2) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default2].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error2
        }
      });
    }
    function makeReturnsIssue(returns, error2) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [ctx.common.contextualErrorMap, ctx.schemaErrorMap, getErrorMap(), en_default2].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error2
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error2 = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error2.addIssue(makeArgsIssue(args, e));
          throw error2;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error2.addIssue(makeReturnsIssue(result, e));
          throw error2;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new _ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown2.create())
    });
  }
  returns(returnType) {
    return new _ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new _ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown2.create()),
      returns: returns || ZodUnknown2.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
};
var ZodLazy = class extends ZodType2 {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
};
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};
var ZodLiteral2 = class extends ZodType2 {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
};
ZodLiteral2.create = (value, params) => {
  return new ZodLiteral2({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum2({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}
var ZodEnum2 = class _ZodEnum extends ZodType2 {
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(this._def.values);
    }
    if (!this._cache.has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return _ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return _ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
};
ZodEnum2.create = createZodEnum;
var ZodNativeEnum = class extends ZodType2 {
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!this._cache) {
      this._cache = new Set(util.getValidEnumValues(this._def.values));
    }
    if (!this._cache.has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
};
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};
var ZodPromise = class extends ZodType2 {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
};
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};
var ZodEffects = class extends ZodType2 {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return INVALID;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return INVALID;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({
            status: status.value,
            value: result
          }));
        });
      }
    }
    util.assertNever(effect);
  }
};
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess2, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess2 },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};
var ZodOptional2 = class extends ZodType2 {
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 === ZodParsedType.undefined) {
      return OK(void 0);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodOptional2.create = (type, params) => {
  return new ZodOptional2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};
var ZodNullable2 = class extends ZodType2 {
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodNullable2.create = (type, params) => {
  return new ZodNullable2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};
var ZodDefault2 = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
};
ZodDefault2.create = (type, params) => {
  return new ZodDefault2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};
var ZodCatch2 = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
};
ZodCatch2.create = (type, params) => {
  return new ZodCatch2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};
var ZodNaN = class extends ZodType2 {
  _parse(input) {
    const parsedType2 = this._getType(input);
    if (parsedType2 !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
};
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = /* @__PURE__ */ Symbol("zod_brand");
var ZodBranded = class extends ZodType2 {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
};
var ZodPipeline = class _ZodPipeline extends ZodType2 {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new _ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
};
var ZodReadonly2 = class extends ZodType2 {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
};
ZodReadonly2.create = (type, params) => {
  return new ZodReadonly2({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom2(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = params.fatal ?? fatal ?? true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = params.fatal ?? fatal ?? true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject2.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom2((data) => data instanceof cls, params);
var stringType = ZodString2.create;
var numberType = ZodNumber2.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean2.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull2.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown2.create;
var neverType = ZodNever2.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray2.create;
var objectType = ZodObject2.create;
var strictObjectType = ZodObject2.strictCreate;
var unionType = ZodUnion2.create;
var discriminatedUnionType = ZodDiscriminatedUnion2.create;
var intersectionType = ZodIntersection2.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord2.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral2.create;
var enumType = ZodEnum2.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional2.create;
var nullableType = ZodNullable2.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: ((arg) => ZodString2.create({ ...arg, coerce: true })),
  number: ((arg) => ZodNumber2.create({ ...arg, coerce: true })),
  boolean: ((arg) => ZodBoolean2.create({
    ...arg,
    coerce: true
  })),
  bigint: ((arg) => ZodBigInt.create({ ...arg, coerce: true })),
  date: ((arg) => ZodDate.create({ ...arg, coerce: true }))
};
var NEVER = INVALID;

// src/mcp/dynamic-values.ts
var MAX_RESOLUTION_DEPTH = 100;
function isRecord(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function isDataBinding(value) {
  return isRecord(value) && typeof value["path"] === "string" && Object.keys(value).length === 1;
}
function isFunctionCall(value) {
  if (!isRecord(value) || typeof value["call"] !== "string") {
    return false;
  }
  const args = value["args"];
  const returnType = value["returnType"];
  return (args === void 0 || isRecord(args)) && (returnType === void 0 || typeof returnType === "string");
}
function resolveDynamicValueDeep(value, context, depth = 0) {
  if (depth >= MAX_RESOLUTION_DEPTH) {
    return value;
  }
  if (!isRecord(value) && !Array.isArray(value)) {
    return value;
  }
  if (typeof value.then === "function") {
    return value;
  }
  if (Array.isArray(value)) {
    return value.map((item) => resolveDynamicValueDeep(item, context, depth + 1));
  }
  if (isDataBinding(value)) {
    const resolved = context.resolveDynamicValue(value);
    if (resolved === value) {
      return resolved;
    }
    return resolveDynamicValueDeep(resolved, context, depth + 1);
  }
  if (isFunctionCall(value)) {
    const dynamicCall = value.args !== void 0 && value.returnType !== void 0 ? value : {
      call: value.call,
      args: value.args ?? {},
      returnType: value.returnType ?? "any"
    };
    const resolved = context.resolveDynamicValue(dynamicCall);
    if (resolved === value || resolved === dynamicCall) {
      return resolved;
    }
    return resolveDynamicValueDeep(resolved, context, depth + 1);
  }
  return resolveDynamicRecord(value, context, depth);
}
function resolveDynamicRecord(record2, context, depth = 0) {
  const resolved = {};
  for (const [key, value] of Object.entries(record2)) {
    resolved[key] = resolveDynamicValueDeep(value, context, depth + 1);
  }
  return resolved;
}

// src/mcp/functions/callMcpTool.ts
var A2UI_MIME_TYPE = "application/a2ui+json";
var MAX_CACHED_RESOURCES = 100;
var CallMcpToolApi = {
  name: "callMcpTool",
  returnType: "any",
  schema: external_exports.object({
    name: DynamicStringSchema.describe(
      "The name of the MCP tool to execute."
    ),
    arguments: external_exports.record(DynamicValueSchema).optional().default({}).describe("The arguments to pass to the MCP tool.")
  })
};
function createCallMcpToolImplementation(getMcpClientForTool, processor) {
  const declaredUiResourceUris = /* @__PURE__ */ new WeakMap();
  const cachedA2uiResources = /* @__PURE__ */ new Map();
  async function readA2uiResource(client, uri) {
    const cached2 = cachedA2uiResources.get(uri);
    if (cached2 !== void 0) {
      cachedA2uiResources.delete(uri);
      cachedA2uiResources.set(uri, cached2);
      return cached2;
    }
    if (!client.readResource) {
      return [];
    }
    const resource = await client.readResource({ uri });
    const messages = parseA2uiMessages(resource, uri);
    if (cachedA2uiResources.size >= MAX_CACHED_RESOURCES) {
      const oldestKey = cachedA2uiResources.keys().next().value;
      if (oldestKey !== void 0) {
        cachedA2uiResources.delete(oldestKey);
      }
    }
    cachedA2uiResources.set(uri, messages);
    return messages;
  }
  function getDeclaredUiResourceUris(client) {
    const cached2 = declaredUiResourceUris.get(client);
    if (cached2) {
      return cached2;
    }
    const discovery = (async () => {
      const uris = /* @__PURE__ */ new Map();
      if (!client.listTools) {
        return uris;
      }
      try {
        const res = await client.listTools();
        const tools = res?.tools ?? [];
        for (const tool of tools) {
          const toolUris = readUiResourceUris(tool);
          if (toolUris.length > 0) {
            uris.set(tool.name, toolUris);
          }
        }
      } catch (err) {
        console.warn("Could not query MCP tool UI resources:", err);
      }
      return uris;
    })();
    declaredUiResourceUris.set(client, discovery);
    return discovery;
  }
  return createFunctionImplementation(
    CallMcpToolApi,
    async (args, context) => {
      const toolName = context.resolveDynamicValue(args["name"]);
      try {
        const resolvedArguments = resolveDynamicRecord(
          args["arguments"] ?? {},
          context
        );
        const client = await getMcpClientForTool(toolName);
        if (!client) {
          throw new Error(`MCP client for tool '${toolName}' could not be resolved.`);
        }
        let result;
        if (typeof client.callTool === "function") {
          result = await client.callTool({
            name: toolName,
            arguments: resolvedArguments
          });
        } else if (typeof client.request === "function") {
          result = await client.request(
            { method: "tools/call", params: { name: toolName, arguments: resolvedArguments } },
            CallToolResultSchema,
            { onprogress: () => {
            }, resetTimeoutOnProgress: true }
          );
        } else {
          throw new Error(`MCP client for tool '${toolName}' does not support tool calls.`);
        }
        if (!result) {
          throw new Error(`MCP tool '${toolName}' did not return a result.`);
        }
        if (result.isError) {
          throw new Error(`MCP tool '${toolName}' execution failed: ${JSON.stringify(result)}`);
        }
        const named = readUiResourceUris(result);
        const uris = named.length > 0 ? named : (await getDeclaredUiResourceUris(client)).get(toolName) ?? [];
        for (const uri of uris) {
          const resourceMessages = await readA2uiResource(client, uri);
          if (!createsExistingSurface(resourceMessages, processor)) {
            processor.processMessages(resourceMessages);
          }
        }
        const messages = extractA2uiMessages(result.content);
        if (messages.length > 0) {
          processor.processMessages(messages);
        }
        return result;
      } catch (error2) {
        if (error2 instanceof A2uiExpressionError) {
          throw error2;
        }
        const message = error2 instanceof Error ? error2.message : String(error2);
        throw new A2uiExpressionError(
          `Failed to execute MCP tool '${toolName}': ${message}`,
          "callMcpTool",
          error2
        );
      }
    }
  );
}
function readUiResourceUris(source) {
  const meta2 = source?._meta;
  const declared = meta2?.ui?.resourceUri;
  const uris = Array.isArray(declared) ? declared : [declared];
  return [...new Set(uris.filter((uri) => typeof uri === "string" && uri !== ""))];
}
function extractA2uiMessages(content) {
  const messages = [];
  for (const item of content ?? []) {
    const block = item;
    if (block?.type !== "resource" || block.resource?.mimeType !== A2UI_MIME_TYPE) {
      continue;
    }
    const { text, uri } = block.resource;
    if (typeof text !== "string") {
      continue;
    }
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`Resource ${uri} declares ${A2UI_MIME_TYPE} but does not hold valid JSON.`);
    }
    messages.push(...Array.isArray(parsed) ? parsed : [parsed]);
  }
  return messages;
}
function parseA2uiMessages(resource, uri) {
  const texts = (resource?.contents ?? []).filter((content) => content.mimeType === A2UI_MIME_TYPE).map((content) => content.text).filter((text) => typeof text === "string");
  return texts.flatMap((text) => {
    let parsed;
    try {
      parsed = JSON.parse(text);
    } catch {
      throw new Error(`Resource ${uri} declares ${A2UI_MIME_TYPE} but does not hold valid JSON.`);
    }
    return Array.isArray(parsed) ? parsed : [parsed];
  });
}
function createsExistingSurface(messages, processor) {
  return messages.some((message) => {
    if (!message || typeof message !== "object" || !("createSurface" in message)) {
      return false;
    }
    const surfaceId = message.createSurface?.surfaceId;
    return !!surfaceId && !!processor.model?.getSurface?.(surfaceId);
  });
}

// src/mcp/functions/jmespath.ts
var import_jmespath = __toESM(require_jmespath(), 1);
import {
  A2uiExpressionError as A2uiExpressionError3,
  createFunctionImplementation as createFunctionImplementation2
} from "@a2ui/web_core/v0_9";

// src/mcp/functions/common.ts
import { A2uiExpressionError as A2uiExpressionError2 } from "@a2ui/web_core/v0_9";

// ../node_modules/re2js/build/index.js
var RE2Flags = class RE2Flags2 {
  static FOLD_CASE = 1;
  static LITERAL = 2;
  static CLASS_NL = 4;
  static DOT_NL = 8;
  static ONE_LINE = 16;
  static NON_GREEDY = 32;
  static PERL_X = 64;
  static UNICODE_GROUPS = 128;
  static WAS_DOLLAR = 256;
  static LOOKBEHIND = 512;
  static MATCH_NL = RE2Flags2.CLASS_NL | RE2Flags2.DOT_NL;
  static PERL = RE2Flags2.CLASS_NL | RE2Flags2.ONE_LINE | RE2Flags2.PERL_X | RE2Flags2.UNICODE_GROUPS;
  static POSIX = 0;
  static UNANCHORED = 0;
  static ANCHOR_START = 1;
  static ANCHOR_BOTH = 2;
};
var PublicFlags = {
  CASE_INSENSITIVE: 1,
  DOTALL: 2,
  MULTILINE: 4,
  DISABLE_UNICODE_GROUPS: 8,
  LONGEST_MATCH: 16,
  LOOKBEHINDS: 512
};
var ASCII_SIZE = 128;
var ASCII_TO_UPPER = new Int32Array(ASCII_SIZE);
var ASCII_TO_LOWER = new Int32Array(ASCII_SIZE);
var MAX_BMP = 65535;
for (let i = 0; i < ASCII_SIZE; i++) {
  if (i >= 97 && i <= 122) ASCII_TO_UPPER[i] = i - 32;
  else ASCII_TO_UPPER[i] = i;
  if (i >= 65 && i <= 90) ASCII_TO_LOWER[i] = i + 32;
  else ASCII_TO_LOWER[i] = i;
}
var Codepoint = class {
  static CODES = /* @__PURE__ */ new Map([
    ["\x07", 7],
    ["\b", 8],
    ["	", 9],
    ["\n", 10],
    ["\v", 11],
    ["\f", 12],
    ["\r", 13],
    [" ", 32],
    ['"', 34],
    ["$", 36],
    ["&", 38],
    ["'", 39],
    ["(", 40],
    [")", 41],
    ["*", 42],
    ["+", 43],
    ["-", 45],
    [".", 46],
    ["0", 48],
    ["1", 49],
    ["2", 50],
    ["3", 51],
    ["4", 52],
    ["5", 53],
    ["6", 54],
    ["7", 55],
    ["8", 56],
    ["9", 57],
    [":", 58],
    ["<", 60],
    [">", 62],
    ["?", 63],
    ["A", 65],
    ["B", 66],
    ["C", 67],
    ["F", 70],
    ["P", 80],
    ["Q", 81],
    ["U", 85],
    ["Z", 90],
    ["[", 91],
    ["\\", 92],
    ["]", 93],
    ["^", 94],
    ["_", 95],
    ["`", 96],
    ["a", 97],
    ["b", 98],
    ["f", 102],
    ["i", 105],
    ["m", 109],
    ["n", 110],
    ["r", 114],
    ["s", 115],
    ["t", 116],
    ["v", 118],
    ["x", 120],
    ["z", 122],
    ["{", 123],
    ["|", 124],
    ["}", 125]
  ]);
  static toUpperCase(codepoint) {
    if (codepoint < ASCII_SIZE) return ASCII_TO_UPPER[codepoint];
    const s = String.fromCodePoint(codepoint).toUpperCase();
    const expectedLen = s.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (s.length > expectedLen) return codepoint;
    const sOrigin = String.fromCodePoint(s.codePointAt(0)).toLowerCase();
    const originExpectedLen = sOrigin.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (sOrigin.length > originExpectedLen || sOrigin.codePointAt(0) !== codepoint) return codepoint;
    return s.codePointAt(0);
  }
  static toLowerCase(codepoint) {
    if (codepoint < ASCII_SIZE) return ASCII_TO_LOWER[codepoint];
    const s = String.fromCodePoint(codepoint).toLowerCase();
    const expectedLen = s.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (s.length > expectedLen) return codepoint;
    const sOrigin = String.fromCodePoint(s.codePointAt(0)).toUpperCase();
    const originExpectedLen = sOrigin.codePointAt(0) > MAX_BMP ? 2 : 1;
    if (sOrigin.length > originExpectedLen || sOrigin.codePointAt(0) !== codepoint) return codepoint;
    return s.codePointAt(0);
  }
};
var UnicodeRangeTable = class {
  /**
  * @param {Uint32Array | number[]} data
  * @param {boolean} isStride1
  */
  constructor(data, isStride1 = false) {
    this.data = data;
    this.isStride1 = isStride1;
    this.SIZE = isStride1 ? 2 : 3;
  }
  getLo(index) {
    return this.data[index * this.SIZE];
  }
  getHi(index) {
    return this.data[index * this.SIZE + 1];
  }
  getStride(index) {
    return this.isStride1 ? 1 : this.data[index * this.SIZE + 2];
  }
  get length() {
    return this.data.length / this.SIZE;
  }
};
var B64_MAP = /* @__PURE__ */ new Uint8Array(256);
for (let i = 0, b = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-"; i < 64; i++) B64_MAP[b.charCodeAt(i)] = i;
var decodeVLQ = (str) => {
  const res = [];
  let value = 0, shift = 0;
  for (let i = 0; i < str.length; i++) {
    let digit = B64_MAP[str.charCodeAt(i)];
    value |= (digit & 31) << shift;
    if ((digit & 32) === 0) {
      res.push(value);
      value = 0;
      shift = 0;
    } else shift += 5;
  }
  return res;
};
var decodeRanges = (str, isStride1) => {
  const res = decodeVLQ(str);
  const numRanges = isStride1 ? res.length / 2 : res.length / 3;
  const out = new Uint32Array(numRanges * 3);
  let current = 0, resIdx = 0;
  for (let i = 0; i < numRanges; i++) {
    current += res[resIdx++];
    out[i * 3] = current;
    current += res[resIdx++];
    out[i * 3 + 1] = current;
    out[i * 3 + 2] = isStride1 ? 1 : res[resIdx++];
  }
  return out;
};
var decodeOrbit = (str) => {
  const res = decodeVLQ(str);
  const map = /* @__PURE__ */ new Map();
  let currentKey = 0;
  for (let i = 0; i < res.length; i += 2) {
    currentKey += res[i];
    const zz = res[i + 1];
    const delta = zz >>> 1 ^ -(zz & 1);
    map.set(currentKey, currentKey + delta);
  }
  return map;
};
var LazyMap = class {
  constructor(initializer3) {
    this.initializer = initializer3;
    this.cache = /* @__PURE__ */ new Map();
  }
  has(key) {
    return key in this.initializer;
  }
  get(key) {
    if (this.cache.has(key)) return this.cache.get(key);
    const fn = this.initializer[key];
    const val = fn ? fn() : null;
    this.cache.set(key, val);
    return val;
  }
};
var UnicodeTables = class {
  static _CASE_ORBIT = null;
  static get CASE_ORBIT() {
    if (!this._CASE_ORBIT) this._CASE_ORBIT = decodeOrbit("rCgCIgCY+rQI4QiCuuBLgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCCgCBgCBgCBgCBgCBgCBgCB+7OB-BB-BB-BB-BB-BBskQB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BC-BB-BB-BB-BB-BB-BB-BByHBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBxHBCBBBCBBBCBBB3SBmMBkNBCBBBCBBB8MBCBBB6MB6MBCBBC+EB0MB2MBCBBB6MB+MBiGBmNBiNBCBBBmKBikzCBmNBqNBkIBsNBCBBBCBBBCBBB0NBCBBB0NDCBBB0NBCBBByNByNBCBBBCBBB2NBCBBDCBBCwDFCBCBDBCBCBDBCBCBDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB9EBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCCBCBDBCBBBhGBvDBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBjICCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBH2iVBCBBBlKBwiVB+jVB+jVBCBBBlMBqEBuEBCBBBCBBBCBBBCBBBCBBB+hVB4hVB8hVBjNB7MC5MB5MCzMC1MB+0yCE5MB20yCC9MBu2yCBwyyCBo0yCChNBlNBo0yCBu-UBi0yCDlNC6-UBpNDrNIu+UDzNCm0yCBzNE0yyCBzNBpEBxNBxNBtEG1NLqxyCBkxyCnFoFrBCBBBCBBDCBBEkIBkIBkICoHHsCCqCBqCBqCCgEC+DB+DBmkOBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCC+BBgCBgCBgCBgCBgCBgCBgCBgCBrCBpCBpCBpCBmjOB-BB8BB-BB-BBgEB-BB-BByBBqgOBsDB-BBtwBB-BB-BB-BBsBBgDBCB-BB-BB-BBeB-BB-BB61OB-BB-BB-DB9DB9DBQB7DBmCE9CBrDBPBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBrFB-EBOBnHB3FB-FCCBBBNBCBBCjIBjIBjIBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgFBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB8kMB-BB6kMB-BB-BB-BB-BB-BB-BB-BB-BB-BBokMB-BB-BBkkMBkkMB-BB-BB-BB-BB-BB-BB-BB4jMB-BB-BB-BB-BB-BB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EB-EBCBBBCBoiMBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBJCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBeBCBBBCBBBCBBBCBBBCBBBCBBBCBBBdBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBCgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDL-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-C64CgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOBgmOCgmOGgmODg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FBg8FDg8FBg8FBg8FhVg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBg9rCBQBQBQBQBQBQDPBPBPBPBPBPjkC7mMB5mMBnmMBjmMBCBlmMB3lMBpiMBk8kCBCBBG-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FB-7FD-7FB-7FB-7F6FoglCEsuHRwjlCyDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCB0DBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBG1DD97OCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQDPBPBPBPBPBPEQCQCQCQCPCPCPCPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPB0EB0EBsFBsFBsFBsFBoGBoGBgIBgIBgHBgHB8HB8HDQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQBQBQBQBQBQBQBPBPBPBPBPBPBPBPBQBQCSFPBPBzEBzEBRCxnOFSFrFBrFBrFBrFBREQBQClkOFPBPBnGBnGFQBQCljOCODPBPB-GB-GBNHSF-HB-HB7HB7HBRqJ53OE9tQBrmQH4Bc3BSgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBgBBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfBfECBByZ0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BB0BBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzBBzB34BgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDBgDB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CB-CBCBBBt-UBruHBt+UB1iVBviVBCBBBCBBBCBBB3hVB5-UB9hVB7hVCCBBCCBBI9jVB9jVBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBICBBBCBBECBBN-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOB-lOC-lOG-lOzoeCBBBCBBBCBBBCBBBCBBBCBl8kCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBTCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBnECBBBCBBBCBBBCBBBCBBBCBBBCBBDCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBKCBBBCBBBnglCBCBBBCBBBCBBBCBBBCBBECBBBvyyCDCBBBCBBBgDCCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBn0yCB90yCB10yCBh0yCBn0yCCjxyCBzyyCBpxyCBg6BBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBB-CBl0yCBvjlCBCBBBCBBBt2yCBCBBBCBBBCBBBCBBBCBBBCBBBCBBBCBBBhkzCZCBB9a-5Bd-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCB-8rCm6TCBB7gBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCH-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BmlBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvChDwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCBwCFvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvCBvC1DuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCBuCCuCBuCBuCBuCBuCBuCBuCCuCBuCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCBtCCtCBtCBtCBtCBtCBtCBtCCtCBtCk2BgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEBgEO-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-DB-D+CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCL-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-B74CgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhrVgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCBgCB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BB-BhB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BB2BD1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BB1BtxekCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBkCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjCBjC");
    return this._CASE_ORBIT;
  }
  static _Print = null;
  static get Print() {
    if (!this._Print) this._Print = new UnicodeRangeTable(decodeRanges("hB9CBjBLBCpWBDFBFGBCCCBSBCsMBClBBDxBBDCBC2BBJaBFFBSVBC-FBCvBBD6BBDkDBP6BBDwBBDOBCbBDCCBJBGfBIqCBCgFBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYBDCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPBLCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGBCCBCHBDBBDVBCGBCBBCEBDIBDBBDCBICBFBBCEBDRBLBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBGMBCCBCWBCPBDIBCCBCDBIBBCCBCBBDDBDJBIVBCCBCWBCJBCEBDIBCCBCDBIBBGCBCDBDJBCCBNMBCCBCyBBCCBCFBFPBDZBCCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBN5BBFcBmBBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDBhBnCBCjBBFmBBCjBBCOBCMBmBlGBCGGD4LBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBH1CBDFBD-TBCbBE4CBIVBKXBKTBNMBCCBCBBN9CBDJBHJBHNBCKBH4CBIqBBGlCBLeBCLBFLBFEEBoBBDEBMrBBFZBHKBE9BBDgCBCcBDKBHJBHNBDtBBDLBVsCBClFBJ7BBEOBE9BBGqBBDKBJqBBG1QBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBSXBJuBBSBBDaBCMBEhBBPgBBQrEBF5UBXKBWz4BBD9LBGsBBCGGD3BBIBBPXBKGBCGBCGBCGBCGBCGBCGBCGBC9DBjBZBC4CBN1GBbPBC+BBC1CBDmDBGqBBC9CBC1CBKvBBCszcBE2BBK7KBV3FBJ8GBV7BBEJBH3BBJlCBJLBHzDBMdBEtCBCKBFgBBC2BBKNBDJBDmDBZbBLFBDFBDFBKGBCGBC7BBF9DBDJBHj9KBNWBFwBBloItLBDpDBnBGBNEBGZBCEBCCCBCCBCCBoUBhBpBBHyBBCSBCDBFEBCmEBF9FBEFBDFBDFBDCBEGBCGBOBBDLBCZBCSBCBBCOBDNBjB6DBGCBFsBBE3CBCMBEwBwBBsBBjEcBEwBBQbBFjBBKdBGqBBGdBCkBBFNBrB9EBDJBHjBBFjBBFnBBJzBBMLBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBCnCBJIBxBSBCBBGgBBEaBGaBnB3BBFTBDxBBCBBGHBCCBCcBDCBFJBIIBI-BBhBmBBFLBK1BBEcBDaBGZBIDBNGBxCoCB4ByBBOyBBItBBJJBHlBBEcBJBBxGeBCpBBCCBDBBRFBJIBiBtBBJpBBXZBnBbBVWBKtCBFjBBK9BBCEBOYBIJBH0BBCRBJmBBK-CBCTBMRBCuBB-BGBCCCBCBCOBCKBH6BBGJBHDBCHBDBBDVBCGBCBBCEBCJBDBBDCBDHHGGBDGBEEBMJBCDDClBBCJBCDDCDBCJBCBBJBBe7CBCEBfnCBJJBnF1BBDlBBjBkCBMJBHMBU5BBHJBHTBdaBDOBFWB6F7BBlDyCBNHBDDDBGBCBBCdBCBBDLBKJBnCHBDtBBDKBcnCBJyCBOoCBIJB3CHB5ChBBPJBHIBCsBBCNBLcBEfBDVBCNBqCGBCBBCrBBECCBCCBHBJJBHFBCBBCkBBCBBCFBIJBHrBBFJB3HYBIQBCoBBEcB2CQQBwBBO6cBnDuDBCEBMjGBtyCiDBOvhBBRVBL68DBGmSB61G5BBn2B4RBIeBCJBFwCBCJBHdBDFBLlCBLJBCGBCUBGSBxN5BBnG6CBGYBDYBtBqCBF4BBIQBhCEBMGBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBDDBh7D8HBEzNBHWBQQBQtBBDWBKzDB9B1HBLmBBDpCBJvDBWlCB7DTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBD9VBQEBCOBxiBeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBENBDJBFBBhKeBS5BBGxOxOBoBB3GqBBFhGhGBdBCVBJBBhHGBCDBCBBCOBCkGBDPBqBrCBFJBFBByYjCBtC8BBjGDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBBvIrBBFjDBNOBDOBCOBCkBBLtFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBmgB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIBnkzVvHB", false));
    return this._Print;
  }
  static CATEGORIES = new LazyMap({
    C: () => new UnicodeRangeTable(decodeRanges("AfBgDgBBOrWrWBHHBCBICCVuMuMnBBBzBBBE4B4BBGBcDBHQBXhGhGxBBB8BBBmDNB8BBByBBBQddBCCMEBhBGBsCiFiFJBBDBBXIICCBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBPMMBEB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKMMBDBbEByBPBDBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCB-FCBHBBHBBHBBECBIIIBLBDBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIB-BGGBLBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMBxhBPBXJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBF-6DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBrCHBxDUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIlkzVBxHvw-FB", false)),
    Cc: () => new UnicodeRangeTable(decodeRanges("AfgDgB", true)),
    Cf: () => new UnicodeRangeTable(decodeRanges("tFzqBzqBBEBXhGhGyBhMhMBxCxCs5D9-B9-BBDBbEByBEBCJBw03B6H6HBBBimEQQj7IPBhjiBDBwmFHBn0rYffB+CB", false)),
    Cn: () => new UnicodeRangeTable(decodeRanges("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBDBvzIBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-BB---BBB---BBB", false)),
    Co: () => new UnicodeRangeTable(decodeRanges("gg4B-nGh4hc9--BD9--B", true)),
    Cs: () => new UnicodeRangeTable(decodeRanges("gg2B--B", true)),
    L: () => new UnicodeRangeTable(decodeRanges("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICCiEEBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoCaBFDBuBqBBkBBBCiDBCQQBIIBLLBBBDRRCdBe4CBMZZBfBKBBFGGBUBFKKEYYBXBIKBGXBCGBRpBB7B1BBETTIJBQPBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNGB7BBBCCCBDBCXBCCCBIBCBBKDDBDBCWWBCBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNSSBkBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBkBFFkC4CBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBzC+C+CBtBBSHB3BdBOBBLrBBbjBBqBCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBhC1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBF1B1BB8zC8zCBjHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBxC2O2OBrBrBBDBGBBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBReBDlCByBIBDmDBDxCBVQBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBdRRBDBCJBLEBCoBBYCBCHBVWBEEEBwBBCEEBDDBDBDCCZCBDKBICBNFBDFBDFBKGBCGBCqBBCNBHyDBej9KBNWBFwBBloItLBDpDBnBGBNEBGCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBxB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOjBBnBbBKWB7HpBBHBBRFB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB1D-BBgBHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBqBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBGjCjCBLBhCBBCPPBNNB0mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBn7F0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFBmI9BBzEsBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCCBCBBCGBDEBKBBhHGBCDBCBBCOBCkGB8BjCBI1lB1lBBCBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    LC: () => new UnicodeRangeTable(decodeRanges("hCZBHZB7BLLBVBCeBCiGBCDBFvGBDZBhGDBDBBECBCHHCCBCCCBSBCyCBCqEBJlFBClBBKoBB44ClBBCGGDqBBDCBhV1CBDFBjkCKBGqBBDCBhCrBBgCMBChBBmD1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGBmIFFDJBCEEBDBHGCBCBCFBFDDBCBGEBF1B1BB8zC8zCB6DBDmDBHDBEBBNlBBCGGzoetBBTbBnEtCBCWBEDBCsCBZBBE2Z2ZBpBBGIBIvCBh6TGBNEBqgBZBHZBmlBvCBhDjBBFjBB1DKBCOBCGBCBBCKBCOBCGBCBBk2ByBBOyBB+CVBLVB74C-BBhrV-BBhBYBDYBtpZ0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BJBCTBHFB2uCjCB", false)),
    Ll: () => new UnicodeRangeTable(decodeRanges("hDZB7BqBqBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDZBiGCCEEEBBBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBDCB5XFBjkCIBC2D2DBqBBgCMBChBBnD0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBBzIEEBEEcKFDBBJDBF2B2Bs1CvBBCEEBGCFCCBCCBEBGiDCBIICFFNlBBCGG0oesBCUaCoEMCBBBC+BCBGBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCbEE2ZqBBGIBIvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFB4vChBB", false)),
    Lm: () => new UnicodeRangeTable(decodeRanges("wVRBFLBPEBICCmEGG-OnHnHlFBBuIBBFgBgBKEEhFoFoF1mBgEgE2R72B72BsDkTkTxOFBvF+BBOjBjBBjBByVOORMBg-CBByHgGgG2OsBsBBDBGiDiDB+C+CBBB34bjnBjnBBEBvIzDzDdBB6DIBxCYYpDDBEBB2OXXqEtDtDWBBoDDBKngVngVuBBBh-BFBCpBBCIB0sBhBhB2K04D04DnrTDB9PCBpBBBnRMBhCBBCPPB9-P9-PBCBCGBCBByhM9BBqGGBud0Q0QsSAB", false)),
    Lo: () => new UnicodeRangeTable(decodeRanges("qFQQhIFFBCBxGBB7ZaBFDBuBfBCJBkBBBCiDBCZZBLLBBBDRRCdBe4CBMZZBfBWVBrBYBIKBGXBCGBRoBB8B1BBETTIJBROBFHBDBBDVBCGBCEEBCBERROBBCCBPBBLJJBEBFBBDVBCGBCBBCBBCBBgBDBCUUBBBRIBCCBCVBCGBCBBCEBETTQBBYMMBGBDBBDVBCGBCBBCEBEffBCCBBBQSSCFBECBCDBEBBCCCBEEBEEBBBELBX1B1BBGBCCBCWBCPBEbbBBBCBBDBBfFFBGBCCBCWBCJBCEBEffBBBCBBQBBSIBCCBCoBBDRRGCBJCBZFBGRBEXBCIBCDDBFB7BvBBCBBNFB8BBBCCCBDBCXBCCCBIBCBBKDDBDBYDBhBgCgCBGBCjBBcEB0DqBBVRRBEBFDBEEEBIIBBBFMBNyDyDBnKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPByDrTBDQBCZBGqCBHHBIRBOSBPRBPMBCCBQzBBpBkCkCBhBBC0BBIEBDhBBCGGBkCBLeByBdBDEBMrBBFZB3BWBK0BBxFuBBSHB3BdBOBBLrBBbjBBqBCBLdByDDBCFBCBBE7hB7hBBCB4-C3BBZWBKGBCGBCGBCGBCGBCGBCGBCGBoR2B2BF1CBJCCB4CBFGGBpBBC9CBSfBxBPBhQ-tGBhC0wUBC2jBBkCnBBJrIBFPBLBBjCyByBBkCBqFoDoDEGBCCBCDBCWBezBBPxBB-BFBECCBMMBaBLWBacBIuBBuBEBDIBLEBCoBBYCBCHBVPBCFBEEEBwBBCEEBDDBDBDCCZBBEKBIPPBEBDFBDFBKGBCGByEiBBej9KBNWBFwBBloItLBDpDBkCCCBIBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBqDJBCsBBDeBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmMcBEwBBwBfBOTBCHBHlBBLdBDjBBFHBhEtCBjDnBBJzBB9CzBBN2JBKVBLHB5EFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCQQBCBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4FjBBnBDBCxJxJBoBBHBBRCBCBB5BcBLJJBUBrBRBvBUBcWBN0BB6BBBDOOBrBBhBYBbjBBeDDJiBBENNBuBBPDBWCCkBRBCYBUBBgCGBCCCBCBCOBCJBIuBBnBHBDBBDVBCGBCBBCEBETTNEBfJBCDDClBBCaaCtBtBBzBBTDBVCBfvBBVBBC5F5FBtBBqBDBlBvBBV8B8BBpBBOoCoCBZBmBGB6FrBB0GHBDDDBGBCBBCXBQCC-CHBDmBBRCCdLLBmBBIWWMtBBUTTBnCBoGgBBgBIBCkBBSyByBBcBxDGBCBBClBBWaaBEBCBBCfBPYYBnBBCBBlISBQCCBLBChBB9DwCwCB4cBnHjGBtyCgDBQvhBBSFBa68DBGmSB61GdBj3B4RBIeBSuCBSdBTvBB0BUBGSB0NnBB2MqCBGwFwFB0mHBqBfBiDyDBuwIiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBxzI2P2PBrBBiBiKiKBcBTrBBlPaBmHdBDwGwGBdBCCBCBBCGBDEBKiHiHBFBCDBCBBCOBCkGB8pBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQBlqE-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    Lt: () => new UnicodeRangeTable(decodeRanges("lOGDnB2sH2sHBGBJHBJHBNQQwBAB", false)),
    Lu: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBG+B+B9zCvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBB", false)),
    M: () => new UnicodeRangeTable(decodeRanges("gYvDB0IGBoIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCgBB3BCBCRBCGBLBBeCB5BCCBFBDBBDCBKLLBbbDCB5BCCBDBFBBDCBEffBEEMCB5BCCBGBCCBCCBVBBXFBCCB5BCCBFBDBBDCBICBLBBf8B8BBDBECBCDBKpBpBBDB4BCCBFBCCBCDBIBBMBBeCB5BCCBFBCCBCDBIBBMBBQNNBCB4BBBCGBCCBCDBKLLBeeBBBnCFFBEBCCCBGBTBB+BDDBFBNHBjDDDBHBMGBqCBBcECFBByBTBCBBGKBCjBBKlDlDBSBYDBFCBCCBDGBEDBOLBCLLBCBgWCBzdDBdCBeBBfBBhCfBKuBuBBBBC2D2DBjBjB3DLBFLB8GEB6BJBCcBDxBxBBsBBDLBVEBwBQBnBIBNCBfMB5BNBxBTB5ECBCUBFHHDCBnG-BBxWgBB--CCBuEhDhDBeBrRFBqDBB1udDBCJBhBBBxCBBxIEEFYYBDBF0C0CBzBzBBQBbRBOnBnBBGBaMBtBDBwBNBlBkCkCBMBNJJBuBuBBBBzBCCBBBDBBGBBCqBqBBDBGBBtHHBCBBx5TiXiXBOBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB7DCB2BOBqBDDBLLBCBuBKBI+B+BBBBlBNBRBBtBNNBBBxBNBJDBCBB9CLBHDD+ELBWDB4BBBCGBDBBDCBKLLBDDBFBEEBkCIBCDDCDBCEBCPPBzCzCBQBYyCyCBSBsHGBDIBcBBzCQBrDMBmDOBhIOB2HFBCBBDDBCCCBuEuEBFBDGBEddBIBpBGBCDBJKKBJBvBPBnGHBoGHBCHBzCVBCNB7DFBECCBCCBFBCjCjCBDBCBBCEB8KDBKBBCxBxBBFBEEBYmnFmnFHOBpmLRBhuCEB8BGB5gBCCB1BBIDByCMMBslTslTBizEizEBsBBDWB-QEBEFBJHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB", false)),
    Mc: () => new UnicodeRangeTable(decodeRanges("joC4B4BDCBJDBCBBzBBB7BCBHBBDBBLsBsB7BCBjC7B7BBBBJCCB2B2BB7B7BCHHBDDBLLnDBBCBBECBCCBLqBqBBBB+BDB+BBB7BCCBDBDBBCBBKBBdPPB7B7BBBBGCBCCBLrBrBBsCsCBBBHHBTBBrKBBgCsFsFBFFHDDBaaBLLBBBDGBWBBDFBDLLBBB5zBffiEIIBGBCBB7KDBDCBFBBCFBhHBB7BCCKCCBJJBEByExBxBGCCBDBCBB+BffFBBD9B9BDCBCEEBxBxBBGBJBBsFWW35EBB0-dBBD5C5CBzBzBBOBvEBBwBxBxBBFFBDDBBBvDBBDBBZuBuBCuDuDDBBGuHuHBCCBCCBCC0gZCCgEuBuBBBBFBB0DZZB8B8BxBCBKBBO+C+CBBBEBBCrFrFBBBgBBB7BBBCDBDBBDCBKLLB1C1CBBBIDDCDBCBBCmDmDBBBJBBErDrDBBBHCCBCBDuHuHBBBHDBDyDyDBBBJBBCuDuDCBBHoDoDCBBFmImIBBBK4H4HBEBCBBFDDCvEvEBBBJDBF1C1CeBB-BqGqGECCoGPPrDIID2G2GBDBFBBC-K-KBNNxBBBJBBCpvQpvQBBBlxD2BBpDBB0rYBBHFB", false)),
    Me: () => new UnicodeRangeTable(decodeRanges("okBBB1xF-wB-wBBCBCCBsshBCB", false)),
    Mn: () => new UnicodeRangeTable(decodeRanges("gYvDB0IEBqIsBBCCCBCCBCCpCKBxBUBRmDmDBFBDFBDBBCDBkBffBZB8CKB7BIBKZZBCBCIBCCBCEBsBCB8BIBrBXBCfB4BCCFHBFEEBFBLBBe7B7BFDBJVVBbbDBB6BFFBFFBDDBBBEffBEEMBB6BFFBDBCBBFVVBXXBEBC7B7BDCCBCBJIIBMMBff+BNNzBEE4BCCBBBGCBCDBIBBMBBe7B7BDHHGBBVBBdBB6BBBFDBJVVBeepCIIBBBC7C7CDGBNHBjDDDBHBMGBqCBBcEC4BNBCEBCBBGKBCjBBKnDnDBCBCFBCBBDBBaBBFCBRDBODDBHHQgWgWBBBzdCBeBBfBBfBBhCBBCGBJDDBJBKuBuBBBBC2D2DBjBjB3DCBFBBKHHBBB8GBBD7B7BCGBCCCDHBHJBDxBxBBMBCeBDLBVDBxBCCBDBCGGpBIBNBBhBDBDBBCCB5BCCBEECCB7BHBDBB5ECBCMBCGBFHHEBBnG-BBxWMBFEEBKB--CCBuEhDhDBeBrRDBsDBB1udFFBIBhBBBxCBBxIEEFaaBGG4EBBbRBOnBnBBGBaKBvBCBxBDDBCBDBBoBkCkCBEBDBBDBBNJJwB0B0BCCBDBBGBBCrBrBBJJvHDDFx5Tx5TiXPBRPBuejHjH2EEBn0BCBCBBGDBpBCBFmFmFB+R+RBCBiCEB+JBBuCFBnCKByBDB8D3B3BBNBqBDDBLLBBByBDBDBBI+B+BBBBlBEBCHB-BNNB1B1BBHBLDBDgDgDBBBDCCBHHD+E+EEHBWBB6BBBEmBmBBFBEEBnCFBOECPBB2CHBDCBCYY1CFBCFFBCCBvHvHBCBHBBCBBcBB2CHBDCCBrDrDCDDBEBCmDmDCDDBCBCEBkIIBCBBhIBBCFFxEDBDBBFhBhBBIBpBFBDDBJKKBEBDCBvBMBCBBnGCCBBBCqGqGBFBCFBCzCzCBUBDGBCBBCBB7DFBECCBCCBFBCpCpCBEEC8K8KBMMB1B1BBDBGCCYmnFmnFHOBpmLLBECBhuCEB8BGB5gBgCgCBCByC5lT5lTBizEizEBsBBDWBhRCBSHBDGBfDB1ECB89B2BBFxBBJPPXEBCOBxqBGBCQBDGBCBBCEBlDhFhFBFB4L+B+BBCB9PDB-HBB0HDDIBBG7O7OBFBuDGB29lYvHB", false)),
    N: () => new UnicodeRangeTable(decodeRanges("wBJB5DBBGDDBBBitBJBnEJBnGJB9MJB3DJBFFBtDJB3DJB3DJBDFBvDMB0DJBJGBoDJBpDGBISBuDJBhDJB3DJBnCTBtIJBnCJBwWTBybCBwHJBHJBXJBtJJBhEKBmFJBHJB3FJB3CJBnEJBHJB3gBEEBEBHJBnGyBBDEB3W7BBvCVB3TdBqrBqYqYaIBPCB4KDBrEJBfHBCOBhBJBoBOBh7cJB9FJBhKFB7EJBnBJBnGJBXJB3CJB3MJB34UJBuPsBBN4BBSBB2KaBlBDBeJJnEEBrGJBvdHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBxBJBHJB3IeB-EJBrBDBxDGBnEdBhEJB9BJBxEJBITB8HJB3KJB3DJB3LJBnDJBHTBtCLBlNSB+CJB3UJB3CcBkHJBnCJB3BJBnLJBnDUBshBuDBimPJBnpCJB3CJBnEJBCGBvQJBnIWB+KCB6nXJBnuBTBNTBtDYB2iBxBBhqCJBnNJB3PJB4HJBtWIBhEJB4Y6BBCCBCDBtCsBBCOBjeMBk3CJB", false)),
    Nd: () => new UnicodeRangeTable(decodeRanges("wBJnxBJnEJnGJ9MJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJ3DJhDJ3DJnCJ3IJnCJn6BJnBJtJJhEJnFJHJ3FJ3CJnEJHJnuiBJnVJnBJnGJXJ3CJ3MJ34UJnsBJnkCJHJ9YJhEJ9BJxEJ3IJ3KJ3DJ3LJnDJHTtCJnNJnDJ3UJ3CJ3HJnCJ3BJnLJ3uQJnpCJ3CJnEJ3QJ37XJ12CxBhqCJnNJ3PJ4HJ2aJ30EJ", true)),
    Nl: () => new UnicodeRangeTable(decodeRanges("u3FCBwzCiBBDDB-zDaaBHBPCBs1dJBxyW0BBtOJJnEEBrhIuDBm8SCB", false)),
    No: () => new UnicodeRangeTable(decodeRanges("yFBBGDDBBB2pCFB5LFB5DCBmEGB6GGBSIByNJB2hBTB0jBJBhP20B20BEFBHJBnGPBqB3W3WB6BBvCVB3TdBqrB1kB1kBBCBrEJBfHBCOBhBJBoBOBxrdFBymWsBBiCDBSBB2KaBlBDB1pBHBaGBoBIBsCEBXFBhFBBDPBDtBBhCIB1BBBfCBsCEBpDHBZHBqBGBrKFBhLeB-EJBrBDBxDGBnETB8LTBmqBBBvNIBobSB0aUBn8SGB-YWBqhZTBNTBtDYBvqFIBid6BBCCBCDBtCsBBCOBjeMB", false)),
    P: () => new UnicodeRangeTable(decodeRanges("hBCBCFBCDBLBBEBBbCBCccCkBkBGEELBBEEE-VJJzOFBqBBB0BCCDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCmBmBBCBoCrCrCBDBFBBwDFBsFlTlTBHB4EuTuTtBBBvCCBoCBB+ECBCCBmBKB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBM9Z9ZBWBJTBCMBCLBfBBPBB6TDBeBB+hBNBwCBBgBJB0MVBgCDBhBBB8XDBCBBxDwEwEBtBBCfBDLBkNCBFJBDLBRNNjD7C7CjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HzqUzqUBxGxGBIBXiBBCNBCFFCBB2ECBCFBCDBLBBEBBbCBCccCCCBFB7MCB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDByO-J-JjBlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB", false)),
    Pc: () => new UnicodeRangeTable(decodeRanges("-Cg-Hg-HBUU-u3BBBZCBwHAB", false)),
    Pd: () => new UnicodeRangeTable(decodeRanges("tB9qB9qB0BiyDiyDmgBqgCqgCBEBiwDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J", false)),
    Pe: () => new UnicodeRangeTable(decodeRanges("pB0B0BgB+1D+1DC-6B-6BqtC4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECtBGCtNICEGCDBB-ozB6G6GeOCESSCCCrF0B0BgBGD", false)),
    Pf: () => new UnicodeRangeTable(decodeRanges("7F+6H+6HEddpuDCCFDDQEE", false)),
    Pi: () => new UnicodeRangeTable(decodeRanges("rFt7Ht7HDBBDaapuDCCFDDQEE", false)),
    Po: () => new UnicodeRangeTable(decodeRanges("hBCBCCBDECBLLBEEBcclCGGPBBI-V-VJzOzOBEBqB3B3BDDDtBBBVBBCBBOCCBBBrCDBnDsBsBBMBqHCB3BOBgBmImIBLLtE5D5D6DnMnMNwLwL7CLLBpFpFBNBCxDxDrCEBFBBwDFBsFlTlTBHBmY9D9DBBBoCBB+ECBCCBmBFBCDB6JBB5GBBhEGBCFBhFBBLGBdCB9DDB8BEB-BBBhCHBMjajaBJJBGBJIBDDBDCBEKBCCCBIB7kDDBCBBxDwEwEBFFBBBDDDBHBCBBCDDBLLBDBCJBDDBCCCBLBDCBtNCB6B+F+FjgdBBuICBkDLL0DFB9LDB3CBBpBCBCyByBBwBwBiDMBRBB9DDB-DBBRBB6HlxUlxUBFBDXXVBBDDBECBCDBICBHCCB2E2EBBBCCBDECBLLBEEBcclBDDB7M7MBBB9UxBxB-MoXoXoGgBgBxIIBnBxDxDBFBjCGB6CDB0ZlElEBDBtBDB+FGBuDBBCDB-DDBxBBBwCDBFOOCCB5CFBsDrJrJBCCBzDzDBDBLBBCpDpD7HWBqDCBdMBtCjEjEBBB9HpIpIBBB8E9C9CBGB0CCBCEB+CJB4GgDgDBDBrBBBmUBBrCMBwFxjBxjBBDB97CBB8zOBBmEiCiCBDBJpRpRBBBoJDBoK9lT9lTovHEB07C-a-aBAB", false)),
    Ps: () => new UnicodeRangeTable(decodeRanges("oBzBzBgB-1D-1DC-6B-6B-rCEEnB4B4BQ7T7TCff-hBMCxChBhBCGC1MUChCCCiBmhBmhBCECaTTCECtNICEGCDipzBipzB4GeeCMCESSCCCrFzBzBgBEEDAB", false)),
    S: () => new UnicodeRangeTable(decodeRanges("kBHHRCBgBCCcCCkBEBCBBDCCBCBDEEfgBgBrODBNNBGGBCCCBPB2DPPBxDxDsErIrIBBB3DCBDDDBvGvGLUUB4H4HIBBpEqLqLBHHB2H2H-DjEjEBGBlEwGwGqBmGmGiGCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WuLuLlL+E+EBgBBiLJBKIBhiBCCBBBMCBOCBOCBOBBmCOOoBCBOCBUhBB-BBBCDBCBBLCCBBBGFBCECFMMBFFBDBGDBC7B7BBFFB2LBFcBD+HBXKByCtCBXnTBtBwBBDeBLyMBX+BBFfBD1LBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBB8CBB0HBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BB6RWBKBBoDBB+EDBLDB+RCBiHPPB+9T+9TpEgBBuLPBhCBB3BHBtBDBjDCCBBBD7E7EHRRBBBgBCCcCCiEGBCGBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSmWmWBiKiKBGBnjC2kC2kCBbBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQQBgDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBrbaagBaagBaagBaagBaa9B-PB4BDBzBHBCNBCBBp2BwNwNttCEE+DiOiOBvIvIBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB", false)),
    Sc: () => new UnicodeRangeTable(decodeRanges("kB+D+DBCBqnB8D8DzPBBzPBBI2H2HoImSmS8sClmClmCBgBB37hBkuVkuVtD7E7E8GBBEBB3-HDB-4wBxtCxtC", false)),
    Sk: () => new UnicodeRangeTable(decodeRanges("+CCCoCHHFEEqQDBNNBGGBCCCBPB2DPPBjoBjoB15FCCBBBMCBOCBOCBOBB9kEBBkzdWBKBBoDBBxePPBniUniUBPB8bCCjF4g9B4g9BBDB", false)),
    Sm: () => new UnicodeRangeTable(decodeRanges("rBRRBBB+BCCuBFFmBgBgB-XwQwQBBB8xGOOoBCBOCBsEoBoBBDBHlClCBDBGBBFGDIgBgBBDDCgBgBBqIBhBBB7CffBXBpBFB2OKK3BHBwDxKxKBDBDeBLPBhIiEBX+BBFfBDhIBxBUBDFB9+zB5Z5ZCCBlFRRBBB+BCCkEHHBCBitDBBhrwBx+Bx+BagBgBagBgBagBgBagBgBat5Ft5FB-uC-uCBHB", false)),
    So: () => new UnicodeRangeTable(decodeRanges("mFDDFCCyerIrIBgEgEBvGvGLUUB4H4HkQ2L2LjEFBClElEwGqBqBoMCBQCCBBBDFBVECmEHBCFBCBBGDBmGBBxXJB0WzWzW+EhBBiLJBKIBksBBBCDBCBBLCCBHHBEBCECFMMBPPCBBC7B7BBKKBDBDDBCBBCBBCGBCeBDBBCCCBdBtIHBFTBDGBDwCBCdBanBBHnCBXKByCtCBX2FBCIBC1BBJuDBC3HBtBrBBhC-HBhQvBBWBBHmBBDpEBmHFBmLBBvBZBC4CBN1GBbPBFOOBNNWBBHBBxKBBFJBhBlBBKRRBdBMdBJQQBeBLmBBQ-JBhuG-BBx0V2BBibDBLBBC+R+RBBBqqUPBuLPBhCBB3BHBuBCBlPEEFBBOBB6JIB6BQBDCBCMBEwBwBBrBB7zBBBwSpgBpgBBGBnjC2kC2kCBGBFQBr6SDBG3qU3qUk7DvHBLCBEzNBHWBQPBhDzDB9B1HBLmBBD7BBGCBXBBIdBF8BBWhCBE7F7FB1CBqlB-PB4BDBzBHBCNBCBBp2B96C96CiEyWyWBqBBFjDBNOBDOBCOBCkBBYgFB5BcBOrBBFIBIBBPFB7E6HBG4WBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBB-B3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBC7CBLAB", false)),
    Z: () => new UnicodeRangeTable(decodeRanges("gBgEgEgvFgsCgsCBJBeBBGwBwBh9DAB", false)),
    Zl: () => new UnicodeRangeTable(decodeRanges("ohIA", true)),
    Zp: () => new UnicodeRangeTable(decodeRanges("phIA", true)),
    Zs: () => new UnicodeRangeTable(decodeRanges("gBgEgEgvFgsCgsCBJBlBwBwBh9DAB", false)),
    ASCII_Hex_Digit: () => new UnicodeRangeTable(decodeRanges("wBJIFbF", true)),
    Alphabetic: () => new UnicodeRangeTable(decodeRanges("hCZBHZBwBLLFGGBVBCeBCpOBFLBPEBICC3CeeBQBCBBDDBCHHCCBCCCBSBCyCBCqEBJlFBClBBDHHBnBBoBNBCCCBCCBCCJaBFDBeKBG3BBCGBPlDBCHBFHBFCBLCBDRRBuBBOkDBZgBBKBBFGGBWBDSBUYBIKBGXBCGBIJJBoBBLLBEGBHrCBCPBCCBFOBOSBCHBDBBDVBCGBCEEBCBEHBDBBDBBCJJFBBCEBNBBLFFBBBCFBFBBDVBCGBCBBCBBCBBFEBFBBDBBFIIBCBCSSBEBMCBCIBCCBCVBCGBCBBCEBEIBCCBCBBEQQBCBWDBFCBCHBDBBDVBCGBCBBCEBEHBDBBDBBKBBFBBCEBORRBCCBEBECBCDBEBBCCCBEEBEEBBBELBFEBECBCCBEHHpBMBCCBCWBCPBEHBCCBCCBJBBCCBCBBDDBdDBCHBCCBCWBCJBCEBEHBCCBCCBJBBGCBCDBOCBNMBCCBCoBBDHBCCBCCBCGGBCBIEBXFBCCBCRBEXBCIBCDDBFBJFBCCCBGBTBBO5BBGGBH0B0BBECBDBCXBCCCBRBCCBDEBCHHPDBhBgCgCBGBCjBBFSBFPBCjBBkC2BBCDDBDBR-BBLDBDlBBCGGDqBBCsKBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBmBPBR1CBDFBErTBDQBCZBGqCBEKBITBMUBNTBNMBCCBCBBNzBBDSBPFFkC4CBIqBBGlCBLeBCLBFIBYdBDEBMrBBFZB3BbBF+BBDTBzBYYBMMBBByBzBBCOBCHB0BpBBDDBLrBBCKBP2BBXCBLjBBDKBGqBBDCBqBDBCFBCBBEGGB+FBUhBBM1IBDFBDlBBDFBDHBCGCBdBD0BBCGBCEEBBBCGBEDBDFBFMBGCBCGB1DOORMBmDFFDJBCEEBDBHGCBCBCKBDDBGEBFSSBnBBuZzBB34BkHBHDBEBBNlBBCGGD3BBIRRBVBKGBCGBCGBCGBCGBCGBCGBCGBCfBwB2O2OBBBaIBIEBDEBF1CBHCBC5CBCDBGqBBC9CBSfBxBPBhQ-tGBhCs0VBkCtBBDsIBEPBLBBVuBBGHBEwDBoBIBDmDBDxCBVUBCgBBZzBBNjCBCtBtBBEBECCBBBLgBBGiBBOcBEyBBCLBQRRBOBLEBC2BBKNBTWBEkCBCCCZCBDPBDDBMFBDFBDFBKGBCGBCqBBCNBH6DBWj9KBNWBFwBBloItLBDpDBnBGBNEBGLBCMBCEBCCCBCCBCCBqDBiBqLBT-BBD1BBpBLB1DEBCmEBlBZBHZBM4CBEFBDFBDFBDCBkBLBCZBCSBCBBCOBDNBjB6DBmC0BBsIcBEwBBwBfBOdBGqBBGdBDjBBFHBCEBrB9EBTjBBFjBBFnBBJzBBNKBCOBCGBCBBCKBCOBCGBCBBEzBBN2JBKVBLHBZFBCpBBCIBmCFBDCCBqBBCBBEDDBVBLWBKeBiCSBCBBLVBLZBHZBnB3BBHBBhCDBCBBGHBCCBCcBrBcBEcBkBHBCbBc1BBLVBLSBORBvDoCB4ByBBOyBBOnBBjBbBEGGBVB7HpBBCBBEBBRFBzBCBEcBLJJBUBrBRBvBUBcWBKlCBsBEBL4BBKOOBXBYyBBSDBJiBBEKKB+BBCDBKBBLCCkBRBChBBDHHBCB-BGBCCCBCBCOBCJBI4BBYDBCHBDBBDVBCGBCBBCEBEHBDBBDBBEHHGGBdJBCDDClBBCJBCDDCDBCBBECCtBhCBCCBCDBVCBfhCBDBBC5F5FB0BBDGBaFBjB+BBCEE8B1BBDoCoCBZBDNBWGB6F4BBoD-BBgBHBDDDBGBCBBCdBCBBDBBDDB+CHBDtBBDFBCCCBccBxBBDJBSnCBGTTBnCBoDHB5CgBBgBIBCsBBCGBCyByBBcBDVBCNBqCGBCBBCrBBECCBCCBBBCDDBZZBEBCBBCkBBCBBCDBCYYBqBBlIWBKQBCoBBECBwDwCwCB4cBnDuDBSjGBtyCgDBQvhBBSFBa68DBGmSB61GuBBy2B4RBIeBSuCBSdBTvBBRDBgBUBGSBxNsBB0G-BBhBYBDYBtBqCBF4BBIQBhCBBCNNBFBK1mHBqBfBiDyDB+vIDBCGBCBBCiJBQeeBBBDPPBCBJrMBloCqDBGMBEIBIJBFi7Fi7FBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDYBCYBCeBCYBCeBCYBCeBCYBCeBCYBCHB15BeBHFB2GGBCQBDGBCBBCEBG9BBiBxDxDBrBBLGBRiKiKBcBTrBBlPbBlHdBDwGwGBdBCVBJBBhHGBCDBCBBCOBCkGB8BjCBEEE1lBDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1TZBHZBHZB3zD-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    Dash: () => new UnicodeRangeTable(decodeRanges("tB9qB9qB0BiyDiyDmgBqgCqgCBEB+BoBoBQnMnMlgDDDgBBBFdd-NUUwDxszBxszBBmBmBLqFqFhzD-J-J", false)),
    Emoji: () => new UnicodeRangeTable(decodeRanges("jBHHGJBwDFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDrGrGhFBBNBBPDDBIBsCZBCBBYVVDIBWBBvFhBBDvDBDBBCCBDyCBDCBCmIBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDDBEJBECCBEEDJBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB", false)),
    Emoji_Component: () => new UnicodeRangeTable(decodeRanges("jBHHGJB0+H2G2Gsp3B3+8B3+8BBYB8PEBxtBDBtzhY-CB", false)),
    Emoji_Modifier: () => new UnicodeRangeTable(decodeRanges("7-8DE", true)),
    Emoji_Modifier_Base: () => new UnicodeRangeTable(decodeRanges("9wJ8G8GRDB4jzD9B9BBBBDDDBBB2DBBDKBWSBEFFBBBCCBICCZqGqGBFFWFFBvFvFBBBEEB0CRRBBBKMMgSDDJHBHKKBIBDCB5B+B+BBCCBCCSCBCMBmHCBrBIB", false)),
    Emoji_Presentation: () => new UnicodeRangeTable(decodeRanges("64IBBuGDBEDDqQBBWBBzBLBsBUUOJJBSSBGGBJJGWWIBBCFFDIIFBBdkBkBCFFBBBC+B+BBBBZPP8aBB0BFFvlxDrGrG-FDDBIBsCZBCZZVDDBDBCCBWBBvFgBBNIBClCBCVBNqBBFEBNQBEEEBlCBCCCB5FBD+BBODBCXBTbbBOO3C0CBxBlCBHEEBBBDDBEDBMBBIIBkHLBF8I8IBtBBCJBC4FBxDMBEKBE4BBCFFBOBDLBFJB", false)),
    Extended_Pictographic: () => new UnicodeRangeTable(decodeRanges("pFFFu8HNN5GXX7CFBQBBwLBBNnFnFaKBFCBoGoHoHBLLK7B7BBCBCEBKGDBDDFDDCBBDIEBJJBBBGCCGLBMBBDCCBCCTDDBTTBEBCCCBEEBGGDBBFBBMBBGBBDGGBECBVVBGGBEBCDBDFFDDDBEBCDDCCCHEEHLLBQQDFFCFFBBBCMMBxBxBBBBKeP1LBBwOCBUBB0BFF7mBNN6SCCrrvDoBoBBCBlDLBQBBQPPBmBmBBIBxDBBNBBPDDBIBU3BBcOBLVVDIBCDBKWBH7FBDvDBDBBCCBDyCBDCBCDBG9HBC+BBMFBCXBIBBDHBNDDBCBDFFBOOBDDJBBKGGBBBNCBJCBDCCFHHEHHB0CBxBlCBGHBDQBECCBEBDMB7GlBBNDB5BHBLFBpBHBfBBNDBDNBKmBBNuBBCJBC4FB5CHBPxEBhI9fB", false)),
    Hex_Digit: () => new UnicodeRangeTable(decodeRanges("wBJIFbFq1-BJIFbF", true)),
    Lowercase: () => new UnicodeRangeTable(decodeRanges("hDZBwBLLFlBlBBWBCHBC2BCBQCBuBCDECBBBDCCDEEBFFDEEBBBDDDCCCDCCBCCDEECDDBDDBBBHGDCOCBSCBDDCEEC4BCBFBDDDBCCFICBjCBDiBBIBBfEBhDsBsBCEEDDBTccBhBBCBBECBCWCBDBCGDB0B0BBuBBCgBCK0BCDMCBgDCxBoBBo6CqBBCDB5XFBjkCIBC2D2DB+FBiC0ECBHBCgDCBHBJFBLHBJHBJFBLHBJHBJNBDHBJHBJHBJEBCBBHEEBBBCBBJDBDBBJHBLCBCBB6DOORMBuDEEBEEcKFDBBJDBFiBiBBOBFsasaBYBn6BvBBCEEBGCFCCBCCBGBEiDCBIICFFNlBBCGG0oesBCUaCBBBmEMCBBBC8BCBIBCCCDICFCCDCCBBBCSCGGGCMCFCCDOCWDBCCCBBB2ZqBBCNBHvCBh6TGBNEBqhBZBumBnBBpEjBB8EKBCOBCGBCBBkODDBBBCpBBCIBmoByBB+DVB75CfBhsVfB8BYBnqZZBbGBCRBbZBbDBCCCBFBCKBbZBbZBbZBbZBbZBbZBbZBbZBbbBdYBCFBbYBCFBbYBCFBbYBCFBbYBCFBC15B15BBIBCTBHFBmI9BB1lChBB", false)),
    Math: () => new UnicodeRangeTable(decodeRanges("rBRRBBBgBeeCuBuBFmBmBgB5W5WBBBDbbBDDBBBwQCBuwGccBBBMEEOPPBCBWEBMEBiCMBFEEBFFBDBTFFDJBCDDBEBHEEBDDBCCBBBCFBENBClClCBWBCFBCBBFBBFfBCHHBPPBqIBJDBVBB7CffBZBCZZMGB+NBBNJBFFBFBBDBBEEBPCCDFBMHBGBB6BCCeDBKCBxK-BBhI-PBxBUBDFB9+zB4Z4ZBEBCjFjFRCBeCCeCCkEHHBCBitDBBhrwBwoBwoBBzCBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBBhwFDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB-uCIB", false)),
    Quotation_Mark: () => new UnicodeRangeTable(decodeRanges("iBFFkEQQ96HHBaBBowDqOqOBCBOCBixzBDB+FFF7CBB", false)),
    Terminal_Punctuation: () => new UnicodeRangeTable(decodeRanges("hBLLCMMBEE-ZJJiQ6B6BpCPPCCB1FsBsBBJBCsHsHB3B3BBEBCHBgBmImIB1nB1nBBtFtFFFB4JBB2YHBmY9D9DBBBoCBB+ECBEoBoBBCBDBB7JBBjLDBjFBBLBBCCBeCB8FEB-BBBldYYBKKBBBwlDCBzJOOFLLCBBEBBtNBB8ndBBuICBkHEB-LBB3CBBgD4E4EBBB0ECBgERRB6H6HnxUDDB6B6BBBBCDBqFLLCMMBEEiCDD7hBxBxBnkBoGoG3JBB5EFBlCFB6CDB5dEBtBDB+FGBxDDBgECBiEBBHRRB5C5CBDBtDrJrJB2D2DBBBNBBnLDBEOBqDBB6HCBmQCC8HBB4CBBFBB-MCBuBmUmUBrCrCBspBspBBDB6vRBBmEiCiCBBBLqRqRBoJoJBnwTnwTovHDB", false)),
    Uppercase: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiB2BCDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIJDCMCDQCDDDCCBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBDDBBBEWCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBpCDBNDBNDBNEBMDBnIFFECBDCBDEEBDBHGCBCBDDBLBBGbbBOBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoqZZBbZBbZBbCCBGDBDDBCBCHBbZBbBBCDBDHBCGBcBBCDBCEBCEEBFBcZBbZBbZBbZBbZBbZBfYBiBYBiBYBiBYBiBYBiB2pE2pEBgBBvgCZBHZBHZB", false)),
    White_Space: () => new UnicodeRangeTable(decodeRanges("JEBTlDlDbgvFgvFgsCKBeBBGwBwBh9DAB", false))
  });
  static get Upper() {
    return this.CATEGORIES.get("Lu");
  }
  static SCRIPTS = new LazyMap({
    Adlam: () => new UnicodeRangeTable(decodeRanges("go6DrCFJFB", true)),
    Ahom: () => new UnicodeRangeTable(decodeRanges("g4lCaDOFW", true)),
    Anatolian_Hieroglyphs: () => new UnicodeRangeTable(decodeRanges("ggxCmS", true)),
    Arabic: () => new UnicodeRangeTable(decodeRanges("gwBEBCFBCNBCCBCfBCJBMZBCrDBChBBxCvBBxHhBBGqCBCcBxy8BtPBDvEBhBPBxDEBCmEBk7DeBkCFBJIBiBFBh43BDBCaBCBBCDDCJBCDBCCCHFFCECBBBCBBCDDCICBCCDDBCGBCDBCDBCCCBIBCQBGCBCEBCQB1BBB", false)),
    Armenian: () => new UnicodeRangeTable(decodeRanges("xpBlBDxBDCks9BE", true)),
    Avestan: () => new UnicodeRangeTable(decodeRanges("g4iC1BEG", true)),
    Balinese: () => new UnicodeRangeTable(decodeRanges("g4GsCCxB", true)),
    Bamum: () => new UnicodeRangeTable(decodeRanges("g1pB3CpowB4R", true)),
    Bassa_Vah: () => new UnicodeRangeTable(decodeRanges("w26CdDF", true)),
    Batak: () => new UnicodeRangeTable(decodeRanges("g+GzBJD", true)),
    Bengali: () => new UnicodeRangeTable(decodeRanges("gsCDBCHBDBBDVBCGBCEEBCBDIBDBBDDBJFFBCCBDBDYB", false)),
    Beria_Erfe: () => new UnicodeRangeTable(decodeRanges("g17CYDY", true)),
    Bhaiksuki: () => new UnicodeRangeTable(decodeRanges("ggnCICsBCNLc", true)),
    Bopomofo: () => new UnicodeRangeTable(decodeRanges("qXB6wLqBxDf", true)),
    Brahmi: () => new UnicodeRangeTable(decodeRanges("ggkCtCFjBKA", true)),
    Braille: () => new UnicodeRangeTable(decodeRanges("ggK-H", true)),
    Buginese: () => new UnicodeRangeTable(decodeRanges("gwGbDB", true)),
    Buhid: () => new UnicodeRangeTable(decodeRanges("g6FT", true)),
    Canadian_Aboriginal: () => new UnicodeRangeTable(decodeRanges("ggF-TxRlC7tgCP", true)),
    Carian: () => new UnicodeRangeTable(decodeRanges("g1gCwB", true)),
    Caucasian_Albanian: () => new UnicodeRangeTable(decodeRanges("wphCzBMA", true)),
    Chakma: () => new UnicodeRangeTable(decodeRanges("gokC0BCR", true)),
    Cham: () => new UnicodeRangeTable(decodeRanges("gwqB2BKNDJDD", true)),
    Cherokee: () => new UnicodeRangeTable(decodeRanges("g9E1CDFz7lBvC", true)),
    Chorasmian: () => new UnicodeRangeTable(decodeRanges("w9jCb", true)),
    Common: () => new UnicodeRangeTable(decodeRanges("AgCBbFBbuBBCOBCEBYgBgBiOmBBGEBDTB1DKKHCC+THHPEEhB9E9ElQiEiEB6mB6mB2MDBjJwvBwvBBBBoCBBsGBBCumBumBOIIBCBCFBCCBDmYmYBKBD2CBCKBEKBCOBShBB-BlBBCCBDFBCaBCQBqBCBF5UBXKBW-cBhIzTBDpEBhQ9CBzMUBCCCBXBQHBFDB8CBBE7C7CB0E0EBOBhBlBBKxBxBB+BBgBwCBwB5C5CBmFBhuG-BBhoWhBBnDCBmFJB1HhFhFsMPPBzuUzuUBxGxGBIBXiBBCSBCDB0ECCBeBbFBbKBLuBuBBhChCBFBCGBLEBjICBFsBBEIBxCMB0BsBBlHaBltuBDB96D8HBEzNBHWBQQBgDzDB9B1HBLmBBD9BBEQBJBBIdBF8BB2GTBNTBN2CBKYBoE0CBCmCBCBBDDDBDDBCBCLBCCCBFBCgCBCDBDHBCGBCbBCDBCEBCEEBFBCzKBDjJBDxBByjFjCBtC8BBjWrBBFjDBNOBDOBCOBCkBBLtFB5BZBCBBOrBBFIBIBBPFB7E4eBEQBEMBE5GBHLBFQQBKBF3BBJJBHnBBJdBDLBFBBPIBoB3KBJNBDMBEKBE4BBCFFBOBDLBFJBIyEBCmDBnghYffB+CB", false)),
    Coptic: () => new UnicodeRangeTable(decodeRanges("ifNxkKzDGG", true)),
    Cuneiform: () => new UnicodeRangeTable(decodeRanges("ggoC5cnDuDCEMjG", true)),
    Cypriot: () => new UnicodeRangeTable(decodeRanges("ggiCFBDCCBqBBCBBEDD", false)),
    Cypro_Minoan: () => new UnicodeRangeTable(decodeRanges("w8rCiD", true)),
    Cyrillic: () => new UnicodeRangeTable(decodeRanges("ggBkEBDoFBx6FKBhFtCtCojEfBhie-CBv8VBBhw4B9BBiBAB", false)),
    Deseret: () => new UnicodeRangeTable(decodeRanges("gghCvC", true)),
    Devanagari: () => new UnicodeRangeTable(decodeRanges("goCwCFODZh7nBfhwcJ", true)),
    Dives_Akuru: () => new UnicodeRangeTable(decodeRanges("gomCGBDDDBGBCBBCdBCBBDLBKJB", false)),
    Dogra: () => new UnicodeRangeTable(decodeRanges("ggmC7B", true)),
    Duployan: () => new UnicodeRangeTable(decodeRanges("ggvDqDGMEIIJDD", true)),
    Egyptian_Hieroglyphs: () => new UnicodeRangeTable(decodeRanges("ggsC1iBL68D", true)),
    Elbasan: () => new UnicodeRangeTable(decodeRanges("gohCnB", true)),
    Elymaic: () => new UnicodeRangeTable(decodeRanges("g-jCW", true)),
    Ethiopic: () => new UnicodeRangeTable(decodeRanges("gwEoCBCDBDGBCCCBCBDoBBCDBDgBBCDBDGBCCCBCBDOBC4BBCDBDiCBDfBEZBnvGWBKGBCGBCGBCGBCGBCGBCGBCGBjpfFBDFBDFBKGBCGBylvCGBCDBCBBCOB", false)),
    Garay: () => new UnicodeRangeTable(decodeRanges("gqjClBEcJB", true)),
    Georgian: () => new UnicodeRangeTable(decodeRanges("glElBBCGGDqBBCDBx8CqBBDCBhiElBBCGG", false)),
    Glagolitic: () => new UnicodeRangeTable(decodeRanges("ggL-Ch9sDGCQDGCBCE", true)),
    Gothic: () => new UnicodeRangeTable(decodeRanges("w5gCa", true)),
    Grantha: () => new UnicodeRangeTable(decodeRanges("g4kCDBCHBDBBDVBCGBCBBCEBDIBDBBDCBDHHGGBDGBEEB", false)),
    Greek: () => new UnicodeRangeTable(decodeRanges("wbDBCCBDDBCFFCCCBBBCCCBSBC+BBPPBnpGEBzBEBFEB1ChKhKBUBDFBDlBBDFBDHBCGCBdBD0BBCOBCNBDFBCSBDCBCIBoJ-xiB-xiB7uVuCBSgj0Bgj0BBkCB", false)),
    Gujarati: () => new UnicodeRangeTable(decodeRanges("h0CCBCIBCCBCVBCGBCBBCEBDJBCCBCCBDQQBCBDLBIGB", false)),
    Gunjala_Gondi: () => new UnicodeRangeTable(decodeRanges("grnCFCBCkBCBCFIJ", true)),
    Gurmukhi: () => new UnicodeRangeTable(decodeRanges("hwCCBCFBFBBDVBCGBCBBCBBCBBDCCBDBFBBDCBEIIBCBCIIBPB", false)),
    Gurung_Khema: () => new UnicodeRangeTable(decodeRanges("go4C5B", true)),
    Han: () => new UnicodeRangeTable(decodeRanges("g0LZBC4CBN1GBwBCCaIBPDBle-tGBhC-vUBhoWtLBDpDBpodBBNGBqgkB-2pBBhB9oEBDt0FBDwpHBQtTBjtC9QBjvBq6EBGppIB", false)),
    Hangul: () => new UnicodeRangeTable(decodeRanges("goE-HvxHBiI9CyDeiCei3dckUj9KNWFwBl9JeEFDFDFDC", true)),
    Hanifi_Rohingya: () => new UnicodeRangeTable(decodeRanges("gojCnBJJ", true)),
    Hanunoo: () => new UnicodeRangeTable(decodeRanges("g5FU", true)),
    Hatran: () => new UnicodeRangeTable(decodeRanges("gniCSCBGE", true)),
    Hebrew: () => new UnicodeRangeTable(decodeRanges("xsB2BBJaBFFBpp9BZBCEBCCCBCCBCCBIB", false)),
    Hiragana: () => new UnicodeRangeTable(decodeRanges("hiM1CBHCBi7-C+IBTeeBBBulQAB", false)),
    Imperial_Aramaic: () => new UnicodeRangeTable(decodeRanges("giiCVCI", true)),
    Inherited: () => new UnicodeRangeTable(decodeRanges("gYvDB2IBBlOKBbhXhXBCB8qEtBBDLBlPCBCMBCGBFHHEBBnG-BBtQBBjGgBB65DDBsDBBmrzBPBRNBwejHjH7iEl+uBl+uBBsBBDWBhRCBSHBDGBfDBz6rYvHB", false)),
    Inscriptional_Pahlavi: () => new UnicodeRangeTable(decodeRanges("g7iCSGH", true)),
    Inscriptional_Parthian: () => new UnicodeRangeTable(decodeRanges("g6iCVDH", true)),
    Javanese: () => new UnicodeRangeTable(decodeRanges("gsqBtCDJFB", true)),
    Kaithi: () => new UnicodeRangeTable(decodeRanges("gkkCiCLA", true)),
    Kannada: () => new UnicodeRangeTable(decodeRanges("gkDMCCCWCJCEDICCCDIBGCCDDJCC", true)),
    Katakana: () => new UnicodeRangeTable(decodeRanges("hlM5CBDCBxHPBxGuBBC3CBvgzBJBCsBBzisBDBCGBCBBCgJgJBBBzBPPBCB", false)),
    Kawi: () => new UnicodeRangeTable(decodeRanges("g4nCQCoBEc", true)),
    Kayah_Li: () => new UnicodeRangeTable(decodeRanges("goqBtBCA", true)),
    Kharoshthi: () => new UnicodeRangeTable(decodeRanges("gwiCDCBGHCCCcDCFJII", true)),
    Khitan_Small_Script: () => new UnicodeRangeTable(decodeRanges("k-7C84G84GB0OBqBAB", false)),
    Khmer: () => new UnicodeRangeTable(decodeRanges("g8F9CDJHJnPf", true)),
    Khojki: () => new UnicodeRangeTable(decodeRanges("gwkCRCuB", true)),
    Khudawadi: () => new UnicodeRangeTable(decodeRanges("w1kC6BGJ", true)),
    Kirat_Rai: () => new UnicodeRangeTable(decodeRanges("gq7C5B", true)),
    Lao: () => new UnicodeRangeTable(decodeRanges("h0DBBCCCBDBCXBCCCBVBDEBCCCBFBCJBDDB", false)),
    Latin: () => new UnicodeRangeTable(decodeRanges("hCZBHZBwBQQGWBCeBCgOBoBEB8wGlBBHwBBGDBGMBClCBiC-HByLOORMBuEBBHccSoBB42CfBj1elDBExCBVOBxZqBBCIBCDB38TGB7gBZBHZBmhCFBCpBBCIBm61BeBHFB", false)),
    Lepcha: () => new UnicodeRangeTable(decodeRanges("ggH3BEOEC", true)),
    Limbu: () => new UnicodeRangeTable(decodeRanges("goGeBCLBFLBFEEBKB", false)),
    Linear_A: () => new UnicodeRangeTable(decodeRanges("gwhC2JKVLH", true)),
    Linear_B: () => new UnicodeRangeTable(decodeRanges("gggCLCZCSCBCODNjB6D", true)),
    Lisu: () => new UnicodeRangeTable(decodeRanges("wmpBvBx1eA", true)),
    Lycian: () => new UnicodeRangeTable(decodeRanges("g0gCc", true)),
    Lydian: () => new UnicodeRangeTable(decodeRanges("gpiCZGA", true)),
    Mahajani: () => new UnicodeRangeTable(decodeRanges("wqkCmB", true)),
    Makasar: () => new UnicodeRangeTable(decodeRanges("g3nCY", true)),
    Malayalam: () => new UnicodeRangeTable(decodeRanges("goDMCCCyBCCCFFPDZ", true)),
    Mandaic: () => new UnicodeRangeTable(decodeRanges("giCbDA", true)),
    Manichaean: () => new UnicodeRangeTable(decodeRanges("g2iCmBFL", true)),
    Marchen: () => new UnicodeRangeTable(decodeRanges("wjnCfDVCN", true)),
    Masaram_Gondi: () => new UnicodeRangeTable(decodeRanges("gonCGBCBBCrBBECCBCCBHBJJB", false)),
    Medefaidrin: () => new UnicodeRangeTable(decodeRanges("gy7C6C", true)),
    Meetei_Mayek: () => new UnicodeRangeTable(decodeRanges("g3qBWqGtBDJ", true)),
    Mende_Kikakui: () => new UnicodeRangeTable(decodeRanges("gg6DkGDP", true)),
    Meroitic_Cursive: () => new UnicodeRangeTable(decodeRanges("gtiCXFTDtB", true)),
    Meroitic_Hieroglyphs: () => new UnicodeRangeTable(decodeRanges("gsiCf", true)),
    Miao: () => new UnicodeRangeTable(decodeRanges("g47CqCF4BIQ", true)),
    Modi: () => new UnicodeRangeTable(decodeRanges("gwlCkCMJ", true)),
    Mongolian: () => new UnicodeRangeTable(decodeRanges("ggGBBDCCBSBH4CBIqBB2t-BMB", false)),
    Mro: () => new UnicodeRangeTable(decodeRanges("gy6CeCJFB", true)),
    Multani: () => new UnicodeRangeTable(decodeRanges("g0kCGBCCCBCBCOBCKB", false)),
    Myanmar: () => new UnicodeRangeTable(decodeRanges("ggE-EhqmBeiDfxibT", true)),
    Nabataean: () => new UnicodeRangeTable(decodeRanges("gkiCeJI", true)),
    Nag_Mundari: () => new UnicodeRangeTable(decodeRanges("wm5DpB", true)),
    Nandinagari: () => new UnicodeRangeTable(decodeRanges("gtmCHDtBDK", true)),
    New_Tai_Lue: () => new UnicodeRangeTable(decodeRanges("gsGrBFZHKEB", true)),
    Newa: () => new UnicodeRangeTable(decodeRanges("gglC7CCE", true)),
    Nko: () => new UnicodeRangeTable(decodeRanges("g+B6BDC", true)),
    Nushu: () => new UnicodeRangeTable(decodeRanges("h-7CvsQvsQBqMB", false)),
    Nyiakeng_Puachue_Hmong: () => new UnicodeRangeTable(decodeRanges("go4DsBENDJFB", true)),
    Ogham: () => new UnicodeRangeTable(decodeRanges("g0Fc", true)),
    Ol_Chiki: () => new UnicodeRangeTable(decodeRanges("wiHvB", true)),
    Ol_Onal: () => new UnicodeRangeTable(decodeRanges("wu5DqBFA", true)),
    Old_Hungarian: () => new UnicodeRangeTable(decodeRanges("gkjCyBOyBIF", true)),
    Old_Italic: () => new UnicodeRangeTable(decodeRanges("g4gCjBKC", true)),
    Old_North_Arabian: () => new UnicodeRangeTable(decodeRanges("g0iCf", true)),
    Old_Permic: () => new UnicodeRangeTable(decodeRanges("w6gCqB", true)),
    Old_Persian: () => new UnicodeRangeTable(decodeRanges("g9gCjBFN", true)),
    Old_Sogdian: () => new UnicodeRangeTable(decodeRanges("g4jCnB", true)),
    Old_South_Arabian: () => new UnicodeRangeTable(decodeRanges("gziCf", true)),
    Old_Turkic: () => new UnicodeRangeTable(decodeRanges("ggjCoC", true)),
    Old_Uyghur: () => new UnicodeRangeTable(decodeRanges("w7jCZ", true)),
    Oriya: () => new UnicodeRangeTable(decodeRanges("h4CCCHDBDVCGCBCEDIDBDCICFBCEDR", true)),
    Osage: () => new UnicodeRangeTable(decodeRanges("wlhCjBFjB", true)),
    Osmanya: () => new UnicodeRangeTable(decodeRanges("gkhCdDJ", true)),
    Pahawh_Hmong: () => new UnicodeRangeTable(decodeRanges("g46ClCLJCGCUGS", true)),
    Palmyrene: () => new UnicodeRangeTable(decodeRanges("gjiCf", true)),
    Pau_Cin_Hau: () => new UnicodeRangeTable(decodeRanges("g2mC4B", true)),
    Phags_Pa: () => new UnicodeRangeTable(decodeRanges("giqB3B", true)),
    Phoenician: () => new UnicodeRangeTable(decodeRanges("goiCbEA", true)),
    Psalter_Pahlavi: () => new UnicodeRangeTable(decodeRanges("g8iCRIDNG", true)),
    Rejang: () => new UnicodeRangeTable(decodeRanges("wpqBjBMA", true)),
    Runic: () => new UnicodeRangeTable(decodeRanges("g1FqCEK", true)),
    Samaritan: () => new UnicodeRangeTable(decodeRanges("ggCtBDO", true)),
    Saurashtra: () => new UnicodeRangeTable(decodeRanges("gkqBlCJL", true)),
    Sharada: () => new UnicodeRangeTable(decodeRanges("gskC-ChsCH", true)),
    Shavian: () => new UnicodeRangeTable(decodeRanges("wihCvB", true)),
    Siddham: () => new UnicodeRangeTable(decodeRanges("gslC1BDlB", true)),
    Sidetic: () => new UnicodeRangeTable(decodeRanges("gqiCZ", true)),
    SignWriting: () => new UnicodeRangeTable(decodeRanges("gg2DrUQECO", true)),
    Sinhala: () => new UnicodeRangeTable(decodeRanges("hsDCBCRBEXBCIBCDDBFBEFFBEBCCCBGBHJBDCBt-gCTB", false)),
    Sogdian: () => new UnicodeRangeTable(decodeRanges("w5jCpB", true)),
    Sora_Sompeng: () => new UnicodeRangeTable(decodeRanges("wmkCYIJ", true)),
    Soyombo: () => new UnicodeRangeTable(decodeRanges("wymCyC", true)),
    Sundanese: () => new UnicodeRangeTable(decodeRanges("g8G-BhIH", true)),
    Sunuwar: () => new UnicodeRangeTable(decodeRanges("g+mChBPJ", true)),
    Syloti_Nagri: () => new UnicodeRangeTable(decodeRanges("ggqBsB", true)),
    Syriac: () => new UnicodeRangeTable(decodeRanges("g4BNC7BDCxIK", true)),
    Tagalog: () => new UnicodeRangeTable(decodeRanges("g4FVKA", true)),
    Tagbanwa: () => new UnicodeRangeTable(decodeRanges("g7FMCCCB", true)),
    Tai_Le: () => new UnicodeRangeTable(decodeRanges("wqGdDE", true)),
    Tai_Tham: () => new UnicodeRangeTable(decodeRanges("gxG+BCcDKHJHN", true)),
    Tai_Viet: () => new UnicodeRangeTable(decodeRanges("g0qBiCZE", true)),
    Tai_Yo: () => new UnicodeRangeTable(decodeRanges("g25DeCVJB", true)),
    Takri: () => new UnicodeRangeTable(decodeRanges("g0lC5BHJ", true)),
    Tamil: () => new UnicodeRangeTable(decodeRanges("i8CBBCFBECBCDBEBBCCCBEEBEEBBBELBFEBECBCDBDHHPUBm+kCxBBOAB", false)),
    Tangsa: () => new UnicodeRangeTable(decodeRanges("wz6CuCCJ", true)),
    Tangut: () => new UnicodeRangeTable(decodeRanges("g-7CgBgBB+3GBhQeBiDyDB", false)),
    Telugu: () => new UnicodeRangeTable(decodeRanges("ggDMCCCWCPDICCCDIBCCCBDDDJII", true)),
    Thaana: () => new UnicodeRangeTable(decodeRanges("g8BxB", true)),
    Thai: () => new UnicodeRangeTable(decodeRanges("hwD5BGb", true)),
    Tibetan: () => new UnicodeRangeTable(decodeRanges("g4DnCCjBFmBCjBCOCGFB", true)),
    Tifinagh: () => new UnicodeRangeTable(decodeRanges("wpL3BIBPA", true)),
    Tirhuta: () => new UnicodeRangeTable(decodeRanges("gklCnCJJ", true)),
    Todhri: () => new UnicodeRangeTable(decodeRanges("guhCzB", true)),
    Tolong_Siki: () => new UnicodeRangeTable(decodeRanges("wtnCrBFJ", true)),
    Toto: () => new UnicodeRangeTable(decodeRanges("w04De", true)),
    Tulu_Tigalari: () => new UnicodeRangeTable(decodeRanges("g8kCJBCDDClBBCJBCDDCDBCJBCBBJBB", false)),
    Ugaritic: () => new UnicodeRangeTable(decodeRanges("g8gCdCA", true)),
    Unknown: () => new UnicodeRangeTable(decodeRanges("4bBBHDBICCVuMuMnBBBzBBBE4B4BBGBcDBHKBvI9B9BBmDmDBMB8BBByBBBQddBCCMEBjBEBuHJJBDDBXXICCBBBFBBKBBDBBFHBCDBDGGBaaBEEHDBDBBXIIDGDBCCGDBDBBECBCGBFCCBFBSJBEKKEXXIDDGBBLIEBCCBNBFBBNGBIEEJBBDBBXIIDGGBKKBDDBEEBFBEDBDGGBTTBIBDHHBBBEFFBBBDCCDCBDCBECBNDBGCBEFFBCCBEBCNBWEBOEEYRRBKKEFFBFBDEEDBBFBBLGBXEEYLLGBBKEEFGBDEBEFFBLLELBOEE0BEEHDBRBBbEETCBZKKCBBICBCDBHCCJFBLBBELB7BDBekBBDCCGZZCYYBGGCIILBBFfBpClBlBBCBoBlBlBQOOBjBBnGCCBDBCBB6LFFBIICFFBqBqBFBBiBFFBIICFFBQQ6BFFBkCkCBhBhBBBBbFB3CBBHBB+UCB6CGBXIBZIBVLBOEEDLB-CBBLFBLFBbFB6CGBsBEBnCJBgBNNBCBNDBCCBrBBBGKBtBDBbFBMCB-BBBiCeeBMMBEBLFBPBBvBBBNTBuCnFnFBGB9BCBQCB-BEBsBBBMHBsBEB3QBBHBBnBBBHBBJGCgBBB2BQQPBBHUUBEEKmDmDNBBcOOBBBjBNBiBOBtEDB7UVBMUB14BBB-LEBuBCCBDBCBB5BGBDNBZIBI4BI-DhBBb6C6CBKB3GZBxC3C3CBoDoDBDBsB-C-C3CIBxBuzcuzcBBB4BIB9KTB5FHB+GTB9BCBLFB5BHBnCHBNFB1DKBfCBvCMMBCBiB4B4BBHBPBBLBBoDXBdJBHBBHBBHIBIII9BDB-DBBLFBl9KLBYDByBjoIBvLBBrDlBBILBGEBbGGCGDrUfBrBFB0BUUFDBGoEoEBCC-FCBHBBHBBHBBECBIIIBIBGBBNbbUDDQBBPhBB8DEBEDBuBCB5COOBBBCuBBvBhEBeCByBOBdDBlBIBfEBsBEBfmBmBBCBPpBB-EBBLFBlBDBlBDBpBHB1BKBNQQIDDMQQIDDBBB1BLB4JIBXJBJXBHrBrBKkCBHBBCtBtBDCBCBBYpCpCBGBKvBBUDDBDBiBCBcEBclBB5BDBVBBzBDDBDBJEEeBBEDBLGBKGBhCfBoBDBNIB3BCBeBBcEBbGBFLBIvCBqC2BB0BMB0BGBvBHBLFBnBCBeHBDvGBgBrBrBEBBDPBHHBKgBBvBHBrBVBblBBdTBYIBvCDBlBIBlCJBCBBaGBLFB2BTTBGBoBIBhDVVBJBTwBwBB8BBICCFQQMFB8BEBLFBFJJBDDBXXIDDGLLBDDBEEBCCBEBCEBIBBICBGKBLCCBCCnBLLCBBCFFLDDBGBDcB9CGGBcBpCHBLlFB3BBBnBhBBmCKBLFBOSB7BFBLFBVbBcBBQDBY4FB9BjDB0CLBJBBCBBJDDfDDBNNBHBLlCBJBBvBBBMaBpCHB0CMBqCGBL1CBJ3CBjBNBLFBKuBuBPJBeCBhBBBXPPBnCBIDDtBCBCDDKHBLFBHDDmBDDHGBLFBtBDBL1HBaGBSqBqBBBBe0CBCOBzBMB8clDBwDGGBJBlGryCBkDMB3iBJB88DEBoS41GB7Bl2BB6RGBgBLLBCByCLLBEBfBBHJBnCJBLIIWEBUvNB7BlGB8CEBaBBarBBsCDB6BGBS-BBGKBIIB3mHoBBhBgDB0D8vIBFIIDkJkJBNBCcBEBBCNBFHBtMjoCBsDEBOCBKGBLBBJ76DB+HCB1NFBYOBSOBvBBBYIB1D7BB3HJBoBBBjGUBnC5DBVLBVLB4CIBamEB2CoCoCDBBCBBDBBFNNCIIiCFFBJJIddFGGCCBI1K1KBlJlJB-V-VBNBGQQBuiBBgBFBH0GBISSBIIDGGBDB-BgBBCvDBuBCBPBBLDBD-JBgBQB7BEBCvOBrB1GBsBDBC-FBgBXXBGBD-GBIFFDQQmGBBRoBBtCDBLDBDwYBlCrCB+BhGBFccDCCBCCLFFCCCBEBCDBCECEDDCBBCICDCCBFFIKFCLLSEBEGGSzBBDtIBtBDBlDLBQBBQQQmBJBvF3BBeMBtBDBKGBDNBH5EB6eCBSCBOCB7GFBNDBCOBNDB5BHBLFBpBHBfBBNDBDNBKmBB5KHBPBBOCBMCB6BCCBCBRBBNDBLGB0EoDoDBjgBBh3pBfB-oEBBv0FBBypHOBvThtCB-QhvBBs6EEBrpIm8yVBCdBhD-DBxHvw-FB", false)),
    Vai: () => new UnicodeRangeTable(decodeRanges("gopBrJ", true)),
    Vithkuqi: () => new UnicodeRangeTable(decodeRanges("wrhCKCOCGCBCKCOCGCB", true)),
    Wancho: () => new UnicodeRangeTable(decodeRanges("g24D5BGA", true)),
    Warang_Citi: () => new UnicodeRangeTable(decodeRanges("glmCyCNA", true)),
    Yezidi: () => new UnicodeRangeTable(decodeRanges("g0jCpBCCDB", true)),
    Yi: () => new UnicodeRangeTable(decodeRanges("ggoBskBE2B", true)),
    Zanabazar_Square: () => new UnicodeRangeTable(decodeRanges("gwmCnC", true))
  });
  static FOLD_CATEGORIES = new LazyMap({
    L: () => new UnicodeRangeTable(decodeRanges("laA", true)),
    LC: () => new UnicodeRangeTable(decodeRanges("laA", true)),
    Ll: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGC3HrBrBCEEJHHCCBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHxC9zC9zCBuBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB", false)),
    Lt: () => new UnicodeRangeTable(decodeRanges("kOCCBCCBCClBCCtsHHBJHBJHBMQQwBAB", false)),
    Lu: () => new UnicodeRangeTable(decodeRanges("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpL2B2Bs1CvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB", false)),
    M: () => new UnicodeRangeTable(decodeRanges("5cgBgBlgHAB", false)),
    Mn: () => new UnicodeRangeTable(decodeRanges("5cgBgBlgHAB", false)),
    Emoji: () => new UnicodeRangeTable(decodeRanges("8mJA", true)),
    Extended_Pictographic: () => new UnicodeRangeTable(decodeRanges("8mJA", true)),
    Lowercase: () => new UnicodeRangeTable(decodeRanges("hCZBmDWBCGBiBuBCEECDOCDuBCBECEBBCCCBCCBBBDDBCBBCCBEBBCBBCECBCCDCCBCCBBBCCCBEEIBBCBBCBBCOCDQCDBBCCCBBBC4BCIBBCBBDCCBCBCGCiJCCEJJHCCBBBCCCBCCBPBCIBkBJJCUCGDDCBBDyBBxBgBCK2BCBMCD+CCDlBBq6ClBBCGGzW1CB0kCHHBpBBDCBhK0ECKgDCKHBJFBLHBJHBJFBMGCJHBZHBJHBJHBJEBMEBMDBNEBMEBqJEEBHHuBPBUzZzZBYBx5BvBBxBCCBBBDGCBCBCDDJCBCgDCJCCFuqeuqeCqBCUaCoEMCE8BCLECBICFCCDCCEUCBDBCEBCOCBCBCCCBQCZs5Vs5VBYBmmBnBBpEjBB9EKBCOBCGBCBBr3ByBB+EVB75CfBhsVfBhCYBoyehBB", false)),
    Math: () => new UnicodeRangeTable(decodeRanges("ycGDCHHFMMDDDCHHFAB", false)),
    Uppercase: () => new UnicodeRangeTable(decodeRanges("hDZB7BqBqBBWBCHBCuBCEECDOCDsBCDECBBBDCCDEEGDDECBDDDCCCDFFDEECDDECCGBBCBBCBBCOCBSCDBBCEECkBCEQCJDDBCCFICBEBCBBCCCBEEBCCBCBCEBDCCBDDIDDCBBEFBGLLBnFnFsBCCEEEBBBvBDBCdBCBBECBCWCBDBCGD1BvBBCgBCK0BCDMCBgDCyBlBBq6CqBBDCB5XFBjkCIBCvHvHERRzD0ECGGGC8CCBHBJFBLHBJHBJFBMGCJHBJNBzBBBNSSBPPBEEpLiBiBBOBFsasaBYBn6BvBBCEEBGCHDDLiDCJCCFNNBkBBCGG0oesBCUaCoEMCE8BCLCCDICFFFCBBDSCMOCFCCDOCb9a9advCBi8UZBumBnBBpEjBB8EKBCOBCGBCBBk4ByBB+DVB75CfBhsVfB8BYBvyehBB", false))
  });
  static FOLD_SCRIPT = new LazyMap({
    Common: () => new UnicodeRangeTable(decodeRanges("8cgBgB", false)),
    Greek: () => new UnicodeRangeTable(decodeRanges("1FwUwU", false)),
    Inherited: () => new UnicodeRangeTable(decodeRanges("5cgBgBlgHAB", false))
  });
};
var Unicode = class Unicode2 {
  static MAX_RUNE = 1114111;
  static MAX_ASCII = 127;
  static MAX_LATIN1 = 255;
  static MAX_BMP = 65535;
  static MIN_FOLD = 65;
  static MAX_FOLD = 125251;
  static MIN_HIGH_SURROGATE = 55296;
  static MAX_HIGH_SURROGATE = 56319;
  static MIN_LOW_SURROGATE = 56320;
  static MAX_LOW_SURROGATE = 57343;
  static MIN_SUPPLEMENTARY_CODE_POINT = 65536;
  static is32(ranges, r) {
    let lo = 0;
    let hi = ranges.length;
    while (lo < hi) {
      const m = lo + Math.floor((hi - lo) / 2);
      const rlo = ranges.getLo(m);
      const rhi = ranges.getHi(m);
      if (rlo <= r && r <= rhi) {
        const stride = ranges.getStride(m);
        return (r - rlo) % stride === 0;
      }
      if (r < rlo) hi = m;
      else lo = m + 1;
    }
    return false;
  }
  static is(ranges, r) {
    if (r <= Unicode2.MAX_LATIN1) {
      for (let i = 0; i < ranges.length; i++) {
        if (r > ranges.getHi(i)) continue;
        const rlo = ranges.getLo(i);
        if (r < rlo) return false;
        const stride = ranges.getStride(i);
        return (r - rlo) % stride === 0;
      }
      return false;
    }
    return ranges.length > 0 && r >= ranges.getLo(0) && Unicode2.is32(ranges, r);
  }
  static isUpper(r) {
    if (r <= Unicode2.MAX_LATIN1) {
      const s = String.fromCodePoint(r);
      return s.toUpperCase() === s && s.toLowerCase() !== s;
    }
    return Unicode2.is(UnicodeTables.Upper, r);
  }
  static isPrint(r) {
    if (r <= Unicode2.MAX_LATIN1) return r >= 32 && r < Unicode2.MAX_ASCII || r >= 161 && r !== 173;
    return Unicode2.is(UnicodeTables.Print, r);
  }
  static simpleFold(r) {
    if (UnicodeTables.CASE_ORBIT.has(r)) return UnicodeTables.CASE_ORBIT.get(r);
    const l = Codepoint.toLowerCase(r);
    if (l !== r) return l;
    return Codepoint.toUpperCase(r);
  }
  static equalsIgnoreCase(r1, r2) {
    if (r1 === r2) return true;
    if (r1 < 0 || r2 < 0) return false;
    if (r1 <= Unicode2.MAX_ASCII && r2 <= Unicode2.MAX_ASCII) {
      if (65 <= r1 && r1 <= 90) r1 |= 32;
      if (65 <= r2 && r2 <= 90) r2 |= 32;
      return r1 === r2;
    }
    for (let r = Unicode2.simpleFold(r1); r !== r1; r = Unicode2.simpleFold(r)) if (r === r2) return true;
    return false;
  }
};
var FAST_PATH_TABLE_SIZE = 256;
var WORD_RUNE_TABLE = new Uint8Array(FAST_PATH_TABLE_SIZE);
for (let i = 0; i < FAST_PATH_TABLE_SIZE; i++) WORD_RUNE_TABLE[i] = 97 <= i && i <= 122 || 65 <= i && i <= 90 || 48 <= i && i <= 57 || i === 95 ? 1 : 0;
var cachedNativeEncoder = null;
var cachedNativeDecoder = null;
var Utils = class Utils2 {
  static METACHARACTERS = "\\.+*?()|[]{}^$";
  static EMPTY_BEGIN_LINE = 1;
  static EMPTY_END_LINE = 2;
  static EMPTY_BEGIN_TEXT = 4;
  static EMPTY_END_TEXT = 8;
  static EMPTY_WORD_BOUNDARY = 16;
  static EMPTY_NO_WORD_BOUNDARY = 32;
  static EMPTY_ALL = -1;
  static emptyInts() {
    return [];
  }
  static isByteArray(input) {
    return Array.isArray(input) || input instanceof Uint8Array;
  }
  static isalnum(c) {
    return Codepoint.CODES.get("0") <= c && c <= Codepoint.CODES.get("9") || Codepoint.CODES.get("a") <= c && c <= Codepoint.CODES.get("z") || Codepoint.CODES.get("A") <= c && c <= Codepoint.CODES.get("Z");
  }
  static unhex(c) {
    if (Codepoint.CODES.get("0") <= c && c <= Codepoint.CODES.get("9")) return c - Codepoint.CODES.get("0");
    if (Codepoint.CODES.get("a") <= c && c <= Codepoint.CODES.get("f")) return c - Codepoint.CODES.get("a") + 10;
    if (Codepoint.CODES.get("A") <= c && c <= Codepoint.CODES.get("F")) return c - Codepoint.CODES.get("A") + 10;
    return -1;
  }
  static escapeRune(rune) {
    let out = "";
    if (Unicode.isPrint(rune)) {
      if (Utils2.METACHARACTERS.indexOf(String.fromCodePoint(rune)) >= 0) out += "\\";
      out += String.fromCodePoint(rune);
    } else switch (rune) {
      case Codepoint.CODES.get('"'):
        out += '\\"';
        break;
      case Codepoint.CODES.get("\\"):
        out += "\\\\";
        break;
      case Codepoint.CODES.get("	"):
        out += "\\t";
        break;
      case Codepoint.CODES.get("\n"):
        out += "\\n";
        break;
      case Codepoint.CODES.get("\r"):
        out += "\\r";
        break;
      case Codepoint.CODES.get("\b"):
        out += "\\b";
        break;
      case Codepoint.CODES.get("\f"):
        out += "\\f";
        break;
      default: {
        let s = rune.toString(16);
        if (rune < 256) {
          out += "\\x";
          if (s.length === 1) out += "0";
          out += s;
        } else out += `\\x{${s}}`;
        break;
      }
    }
    return out;
  }
  static stringToRunes(str) {
    const string3 = String(str);
    const runes = [];
    let i = 0;
    while (i < string3.length) {
      const cp = string3.codePointAt(i);
      runes.push(cp);
      i += cp > Unicode.MAX_BMP ? 2 : 1;
    }
    return runes;
  }
  static runeToString(r) {
    return String.fromCodePoint(r);
  }
  static isWordRune(r) {
    return r < FAST_PATH_TABLE_SIZE ? WORD_RUNE_TABLE[r] === 1 : false;
  }
  static emptyOpContext(r1, r2) {
    let op = 0;
    if (r1 < 0) op |= Utils2.EMPTY_BEGIN_TEXT | Utils2.EMPTY_BEGIN_LINE;
    if (r1 === 10) op |= Utils2.EMPTY_BEGIN_LINE;
    if (r2 < 0) op |= Utils2.EMPTY_END_TEXT | Utils2.EMPTY_END_LINE;
    if (r2 === 10) op |= Utils2.EMPTY_END_LINE;
    if (Utils2.isWordRune(r1) !== Utils2.isWordRune(r2)) op |= Utils2.EMPTY_WORD_BOUNDARY;
    else op |= Utils2.EMPTY_NO_WORD_BOUNDARY;
    return op;
  }
  /**
  * Returns a string that quotes all regular expression metacharacters inside the argument text;
  * the returned string is a regular expression matching the literal text. For example,
  * {@code quoteMeta("[foo]").equals("\\[foo\\]")}.
  * @param {string} str
  * @returns {string}
  */
  static quoteMeta(str) {
    return str.split("").map((s) => {
      if (Utils2.METACHARACTERS.indexOf(s) >= 0) return `\\${s}`;
      return s;
    }).join("");
  }
  static charCount(codePoint) {
    return codePoint > Unicode.MAX_BMP ? 2 : 1;
  }
  /**
  * High-speed conversion from TypedArrays to standard JS Arrays.
  * Bypasses the expensive Symbol.iterator overhead of Array.from()
  */
  static toArray(typedArray) {
    const len = typedArray.length;
    const res = new Array(len);
    for (let i = 0; i < len; i++) res[i] = typedArray[i];
    return res;
  }
  static stringToUtf8ByteArray(str) {
    if (globalThis.TextEncoder) {
      if (!cachedNativeEncoder) cachedNativeEncoder = new TextEncoder();
      return cachedNativeEncoder.encode(str);
    } else {
      let out = [], p = 0;
      for (let i = 0; i < str.length; i++) {
        let c = str.charCodeAt(i);
        if (c < 128) out[p++] = c;
        else if (c < 2048) {
          out[p++] = c >> 6 | 192;
          out[p++] = c & 63 | 128;
        } else if ((c & 64512) === Unicode.MIN_HIGH_SURROGATE && i + 1 < str.length && (str.charCodeAt(i + 1) & 64512) === Unicode.MIN_LOW_SURROGATE) {
          c = Unicode.MIN_SUPPLEMENTARY_CODE_POINT + ((c & 1023) << 10) + (str.charCodeAt(++i) & 1023);
          out[p++] = c >> 18 | 240;
          out[p++] = c >> 12 & 63 | 128;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        } else {
          out[p++] = c >> 12 | 224;
          out[p++] = c >> 6 & 63 | 128;
          out[p++] = c & 63 | 128;
        }
      }
      return out;
    }
  }
  static utf8ByteArrayToString(bytes) {
    if (globalThis.TextDecoder) {
      if (!cachedNativeDecoder) cachedNativeDecoder = new TextDecoder("utf-8");
      const view = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
      return cachedNativeDecoder.decode(view);
    } else {
      let out = [], pos = 0, c = 0;
      while (pos < bytes.length) {
        let c1 = bytes[pos++];
        if (c1 < 128) out[c++] = String.fromCharCode(c1);
        else if (c1 > 191 && c1 < 224) {
          let c2 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 31) << 6 | c2 & 63);
        } else if (c1 > 239 && c1 < 365) {
          let c2 = bytes[pos++];
          let c3 = bytes[pos++];
          let c4 = bytes[pos++];
          let u = ((c1 & 7) << 18 | (c2 & 63) << 12 | (c3 & 63) << 6 | c4 & 63) - Unicode.MIN_SUPPLEMENTARY_CODE_POINT;
          out[c++] = String.fromCharCode(Unicode.MIN_HIGH_SURROGATE + (u >> 10));
          out[c++] = String.fromCharCode(Unicode.MIN_LOW_SURROGATE + (u & 1023));
        } else {
          let c2 = bytes[pos++];
          let c3 = bytes[pos++];
          out[c++] = String.fromCharCode((c1 & 15) << 12 | (c2 & 63) << 6 | c3 & 63);
        }
      }
      return out.join("");
    }
  }
};
var createEnum = (values = [], initNum = 0) => {
  const enumObject = /* @__PURE__ */ Object.create(null);
  for (let i = 0; i < values.length; i++) {
    const val = values[i];
    const keyVal = initNum + i;
    enumObject[val] = keyVal;
    enumObject[keyVal] = val;
  }
  return Object.freeze(enumObject);
};
var MatcherInputBase = class MatcherInputBase2 {
  static Encoding = createEnum(["UTF_16", "UTF_8"]);
  getEncoding() {
    throw Error("not implemented");
  }
  /** @returns {string} */
  asCharSequence() {
    throw Error("not implemented");
  }
  /** @returns {Uint8Array|number[]} */
  asBytes() {
    throw Error("not implemented");
  }
  /** @returns {number} */
  length() {
    throw Error("not implemented");
  }
  /**
  *
  * @returns {boolean}
  */
  isUTF8Encoding() {
    return this.getEncoding() === MatcherInputBase2.Encoding.UTF_8;
  }
  /**
  *
  * @returns {boolean}
  */
  isUTF16Encoding() {
    return this.getEncoding() === MatcherInputBase2.Encoding.UTF_16;
  }
};
var Utf8MatcherInput = class extends MatcherInputBase {
  /** @param {Uint8Array|number[]|null} bytes */
  constructor(bytes = null) {
    super();
    this.bytes = bytes;
  }
  getEncoding() {
    return MatcherInputBase.Encoding.UTF_8;
  }
  /**
  *
  * @returns {string}
  */
  asCharSequence() {
    return Utils.utf8ByteArrayToString(this.bytes);
  }
  /**
  *
  * @returns {Uint8Array|number[]|null}
  */
  asBytes() {
    return this.bytes;
  }
  /**
  *
  * @returns {number}
  */
  length() {
    return this.bytes.length;
  }
};
var Utf16MatcherInput = class extends MatcherInputBase {
  /** @param {string|null} charSequence */
  constructor(charSequence = null) {
    super();
    this.charSequence = charSequence;
  }
  getEncoding() {
    return MatcherInputBase.Encoding.UTF_16;
  }
  /**
  *
  * @returns {string}
  */
  asCharSequence() {
    return this.charSequence;
  }
  /**
  *
  * @returns {number[]}
  */
  asBytes() {
    return Utils.stringToUtf8ByteArray(this.charSequence.toString());
  }
  /**
  *
  * @returns {number}
  */
  length() {
    return this.charSequence.length;
  }
};
var MatcherInput = class {
  /**
  * Return the MatcherInput for UTF_16 encoding.
  * @returns {Utf16MatcherInput}
  */
  static utf16(charSequence) {
    return new Utf16MatcherInput(charSequence);
  }
  /**
  * Return the MatcherInput for UTF_8 encoding.
  * @returns {Utf8MatcherInput}
  */
  static utf8(input) {
    if (Utils.isByteArray(input)) return new Utf8MatcherInput(input);
    return new Utf8MatcherInput(Utils.stringToUtf8ByteArray(input));
  }
};
var MachineInputBase = class {
  static EOF() {
    return -8;
  }
  constructor() {
    this.end = 0;
  }
  canCheckPrefix() {
    return true;
  }
  endPos() {
    return this.end;
  }
  hasString() {
    return false;
  }
  hasAnyString() {
    return false;
  }
  prefixLength() {
    return 0;
  }
};
var MachineUTF8Input = class extends MachineInputBase {
  constructor(bytes, start = 0, end = bytes.length) {
    super();
    this.bytes = bytes;
    this.start = start;
    this.end = end;
  }
  hasString(prefilter, pos) {
    const target = prefilter.bytes;
    if (target.length === 0) return true;
    const idx = this.indexOf(this.bytes, target, this.start + pos);
    return idx !== -1 && idx <= this.end - target.length;
  }
  hasAnyString(prefilter, pos) {
    if (!prefilter.ac8) return false;
    return prefilter.ac8.searchUTF8(this.bytes, this.start + pos, this.end);
  }
  step(pos) {
    pos += this.start;
    if (pos >= this.end) return MachineInputBase.EOF();
    const c = this.bytes[pos] & 255;
    if (c < 128) return c << 3 | 1;
    else if (c >= 194 && c <= 223 && pos + 1 < this.end) {
      const c1 = this.bytes[pos + 1] & 255;
      if ((c1 & 192) !== 128) return c << 3 | 1;
      return ((c & 31) << 6 | c1 & 63) << 3 | 2;
    } else if (c >= 224 && c <= 239 && pos + 2 < this.end) {
      const c1 = this.bytes[pos + 1] & 255;
      if ((c1 & 192) !== 128) return c << 3 | 1;
      const c2 = this.bytes[pos + 2] & 255;
      if ((c2 & 192) !== 128) return c << 3 | 1;
      return ((c & 15) << 12 | (c1 & 63) << 6 | c2 & 63) << 3 | 3;
    } else if (c >= 240 && c <= 244 && pos + 3 < this.end) {
      const c1 = this.bytes[pos + 1] & 255;
      if ((c1 & 192) !== 128) return c << 3 | 1;
      const c2 = this.bytes[pos + 2] & 255;
      if ((c2 & 192) !== 128) return c << 3 | 1;
      const c3 = this.bytes[pos + 3] & 255;
      if ((c3 & 192) !== 128) return c << 3 | 1;
      return ((c & 7) << 18 | (c1 & 63) << 12 | (c2 & 63) << 6 | c3 & 63) << 3 | 4;
    } else return c << 3 | 1;
  }
  index(re2, pos) {
    pos += this.start;
    const i = this.indexOf(this.bytes, re2.prefixUTF8, pos);
    return i < 0 ? i : i - pos;
  }
  context(pos) {
    pos += this.start;
    let r1 = -1;
    if (pos > this.start && pos <= this.end) {
      let start = pos - 1;
      r1 = this.bytes[start--];
      if (r1 >= 128) {
        let lim = pos - 4;
        if (lim < this.start) lim = this.start;
        while (start >= lim && (this.bytes[start] & 192) === 128) start--;
        if (start < this.start) start = this.start;
        r1 = this.step(start - this.start) >> 3;
      }
    }
    const r2 = pos < this.end ? this.step(pos - this.start) >> 3 : -1;
    return Utils.emptyOpContext(r1, r2);
  }
  indexOf(source, target, fromIndex = 0) {
    let targetLength = target.length;
    if (targetLength === 0) return fromIndex <= this.end ? fromIndex : -1;
    const firstByte = target[0];
    let limit = this.end - targetLength;
    const hasNativeIndexOf = typeof source.indexOf === "function";
    let i = fromIndex;
    while (i <= limit) {
      if (hasNativeIndexOf) {
        i = source.indexOf(firstByte, i);
        if (i === -1 || i > limit) return -1;
      } else {
        while (i <= limit && source[i] !== firstByte) i++;
        if (i > limit) return -1;
      }
      let match = true;
      for (let j = 1; j < targetLength; j++) if (source[i + j] !== target[j]) {
        match = false;
        break;
      }
      if (match) return i;
      i++;
    }
    return -1;
  }
  prefixLength(re2) {
    return re2.prefixUTF8.length;
  }
};
var MachineUTF16Input = class extends MachineInputBase {
  constructor(charSequence, start = 0, end = charSequence.length) {
    super();
    this.charSequence = charSequence;
    this.start = start;
    this.end = end;
  }
  hasString(prefilter, pos) {
    const idx = this.charSequence.indexOf(prefilter.str, this.start + pos);
    return idx !== -1 && idx <= this.end - prefilter.str.length;
  }
  hasAnyString(prefilter, pos) {
    if (!prefilter.ac16) return false;
    return prefilter.ac16.searchUTF16(this.charSequence, this.start + pos, this.end);
  }
  step(pos) {
    pos += this.start;
    if (pos >= this.end) return MachineInputBase.EOF();
    const c1 = this.charSequence.charCodeAt(pos);
    if (c1 < Unicode.MIN_HIGH_SURROGATE || c1 > Unicode.MAX_HIGH_SURROGATE || pos + 1 >= this.end) return c1 << 3 | 1;
    const c2 = this.charSequence.charCodeAt(pos + 1);
    if (c2 >= Unicode.MIN_LOW_SURROGATE && c2 <= Unicode.MAX_LOW_SURROGATE) return (c1 - Unicode.MIN_HIGH_SURROGATE) * 1024 + (c2 - Unicode.MIN_LOW_SURROGATE) + Unicode.MIN_SUPPLEMENTARY_CODE_POINT << 3 | 2;
    return c1 << 3 | 1;
  }
  index(re2, pos) {
    pos += this.start;
    const i = this.charSequence.indexOf(re2.prefix, pos);
    if (i < 0 || i > this.end - re2.prefix.length) return -1;
    return i - pos;
  }
  context(pos) {
    pos += this.start;
    const r1 = pos > this.start && pos <= this.end ? this.charSequence.charCodeAt(pos - 1) : -1;
    const r2 = pos < this.end ? this.charSequence.charCodeAt(pos) : -1;
    return Utils.emptyOpContext(r1, r2);
  }
  prefixLength(re2) {
    return re2.prefix.length;
  }
};
var MachineInput = class {
  static fromUTF8(bytes, start = 0, end = bytes.length) {
    return new MachineUTF8Input(bytes, start, end);
  }
  static fromUTF16(charSequence, start = 0, end = charSequence.length) {
    return new MachineUTF16Input(charSequence, start, end);
  }
};
var RE2JSException = class extends Error {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSException";
  }
};
var RE2JSSyntaxException = class extends RE2JSException {
  /**
  * @param {string} error
  * @param {string|null} [input=null]
  */
  constructor(error2, input = null) {
    let message = `error parsing regexp: ${error2}`;
    if (input) message += `: \`${input}\``;
    super(message);
    this.name = "RE2JSSyntaxException";
    this.message = message;
    this.error = error2;
    this.input = input;
  }
  /**
  * Retrieves the description of the error.
  * @returns {string}
  */
  getDescription() {
    return this.error;
  }
  /**
  * Retrieves the erroneous regular-expression pattern.
  * @returns {string|null}
  */
  getPattern() {
    return this.input;
  }
};
var RE2JSCompileException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSCompileException";
  }
};
var RE2JSGroupException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSGroupException";
  }
};
var RE2JSFlagsException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSFlagsException";
  }
};
var RE2JSInternalException = class extends RE2JSException {
  /** @param {string} message */
  constructor(message) {
    super(message);
    this.name = "RE2JSInternalException";
  }
};
var Matcher = class Matcher2 {
  /**
  * V8 and WebKit have historical hard limits on the number of arguments
  * that can be passed to a function. We cap replacer arguments to prevent
  * Call Stack Overflow (DoS) vulnerabilities on massive ASTs.
  */
  static MAX_REPLACER_ARGS = 65535;
  /**
  * Quotes '\' and '$' in {@code s}, so that the returned string could be used in
  * {@link #appendReplacement} as a literal replacement of {@code s}.
  *
  * @param {string} str the string to be quoted
  * @param {boolean} [javaMode=false] whether the replacement will be used in javaMode
  * @returns {string} the quoted string
  */
  static quoteReplacement(str, javaMode = false) {
    if (javaMode) {
      if (str.indexOf("\\") < 0 && str.indexOf("$") < 0) return str;
      return str.split("").map((s) => {
        const c = s.codePointAt(0);
        if (c === Codepoint.CODES.get("\\") || c === Codepoint.CODES.get("$")) return `\\${s}`;
        return s;
      }).join("");
    }
    if (str.indexOf("$") < 0) return str;
    return str.split("").map((s) => {
      if (s.codePointAt(0) === Codepoint.CODES.get("$")) return "$$";
      return s;
    }).join("");
  }
  /**
  *
  * @param {import('./index.js').RE2JS} pattern
  * @param {string|number[]|Uint8Array|MatcherInputBase} input
  */
  constructor(pattern2, input) {
    if (pattern2 === null) throw new Error("pattern is null");
    this.patternInput = pattern2;
    const re2 = this.patternInput.re2();
    this.patternGroupCount = re2.numberOfCapturingGroups();
    this.groups = [];
    this.namedGroups = re2.namedGroups;
    this.numberOfInstructions = re2.numberOfInstructions();
    if (input instanceof MatcherInputBase) this.resetMatcherInput(input);
    else if (Utils.isByteArray(input)) this.resetMatcherInput(MatcherInput.utf8(input));
    else this.resetMatcherInput(MatcherInput.utf16(input));
  }
  /**
  * Returns the {@code RE2JS} associated with this {@code Matcher}.
  * @returns {import('./index.js').RE2JS}
  */
  pattern() {
    return this.patternInput;
  }
  /**
  * Resets the {@code Matcher}, rewinding input and discarding any match information.
  *
  * @returns {Matcher} the {@code Matcher} itself, for chained method calls
  */
  reset() {
    this.matcherInputLength = this.matcherInput.length();
    this.appendPos = 0;
    this.hasMatch = false;
    this.hasGroups = false;
    this.anchorFlag = 0;
    return this;
  }
  /**
  * Resets the {@code Matcher} and changes the input.
  * @param {string|number[]|Uint8Array|MatcherInputBase} input
  * @returns {Matcher} the {@code Matcher} itself, for chained method calls
  */
  resetMatcherInput(input) {
    if (input === null) throw new Error("input is null");
    if (!(input instanceof MatcherInputBase)) if (Utils.isByteArray(input)) input = MatcherInput.utf8(input);
    else input = MatcherInput.utf16(input);
    this.matcherInput = input;
    this.reset();
    return this;
  }
  /**
  * Returns the start of the named group of the most recent match, or -1 if the group was not
  * matched.
  * @param {string|number} [group=0]
  * @returns {number}
  */
  start(group = 0) {
    if (typeof group === "string") {
      const groupInt = this.namedGroups[group];
      if (!Number.isFinite(groupInt)) throw new RE2JSGroupException(`group '${group}' not found`);
      group = groupInt;
    }
    this.loadGroup(group);
    return this.groups[2 * group];
  }
  /**
  * Returns the end of the named group of the most recent match, or -1 if the group was not
  * matched.
  * @param {string|number} [group=0]
  * @returns {number}
  */
  end(group = 0) {
    if (typeof group === "string") {
      const groupInt = this.namedGroups[group];
      if (!Number.isFinite(groupInt)) throw new RE2JSGroupException(`group '${group}' not found`);
      group = groupInt;
    }
    this.loadGroup(group);
    return this.groups[2 * group + 1];
  }
  /**
  * Returns the program size of this pattern.
  *
  * <p>
  * Similar to the C++ implementation, the program size is a very approximate measure of a regexp's
  * "cost". Larger numbers are more expensive than smaller numbers.
  * </p>
  *
  * @returns {number} the program size of this pattern
  */
  programSize() {
    return this.numberOfInstructions;
  }
  /**
  * Returns the named group of the most recent match, or {@code null} if the group was not matched.
  * @param {string|number} [group=0]
  * @returns {string|null}
  */
  group(group = 0) {
    if (typeof group === "string") {
      const groupInt = this.namedGroups[group];
      if (!Number.isFinite(groupInt)) throw new RE2JSGroupException(`group '${group}' not found`);
      group = groupInt;
    }
    const start = this.start(group);
    const end = this.end(group);
    if (start < 0 && end < 0) return null;
    return this.substring(start, end);
  }
  /**
  * Returns a dictionary map of all named capturing groups and their matched values.
  * If a group was not matched, its value will be `null`.
  * @returns {Record<string, string|null>}
  */
  getNamedGroups() {
    if (!this.hasMatch) throw new RE2JSGroupException("perhaps no match attempted");
    const result = /* @__PURE__ */ Object.create(null);
    for (const name of Object.keys(this.namedGroups)) result[name] = this.group(name);
    return result;
  }
  /**
  * Returns the number of subgroups in this pattern.
  *
  * @returns {number} the number of subgroups; the overall match (group 0) does not count
  */
  groupCount() {
    return this.patternGroupCount;
  }
  /**
  * Helper: finds subgroup information if needed for group.
  * @param {number} group
  * @private
  */
  loadGroup(group) {
    if (group < 0 || group > this.patternGroupCount) throw new RE2JSGroupException(`Group index out of bounds: ${group}`);
    if (!this.hasMatch) throw new RE2JSGroupException("perhaps no match attempted");
    if (group === 0 || this.hasGroups) return;
    const end = this.matcherInputLength;
    const res = this.patternInput.re2().matchMachineInput(this.matcherInput, this.groups[0], end, this.anchorFlag, 1 + this.patternGroupCount);
    if (!res[0]) throw new RE2JSGroupException("inconsistency in matching group data");
    this.groups = res[1];
    this.hasGroups = true;
  }
  /**
  * Matches the entire input against the pattern (anchored start and end). If there is a match,
  * {@code matches} sets the match state to describe it.
  *
  * @returns {boolean} true if the entire input matches the pattern
  */
  matches() {
    return this.genMatch(0, RE2Flags.ANCHOR_BOTH);
  }
  /**
  * Matches the beginning of input against the pattern (anchored start). If there is a match,
  * {@code lookingAt} sets the match state to describe it.
  *
  * @returns {boolean} true if the beginning of the input matches the pattern
  */
  lookingAt() {
    return this.genMatch(0, RE2Flags.ANCHOR_START);
  }
  /**
  * Matches the input against the pattern (unanchored), starting at a specified position. If there
  * is a match, {@code find} sets the match state to describe it.
  *
  * @param {number|null} [start=null] the input position where the search begins
  * @returns {boolean} if it finds a match
  * @throws IndexOutOfBoundsException if start is not a valid input position
  */
  find(start = null) {
    if (start !== null) {
      if (start < 0 || start > this.matcherInputLength) throw new RE2JSGroupException(`start index out of bounds: ${start}`);
      this.reset();
      return this.genMatch(start, 0);
    }
    start = 0;
    if (this.hasMatch) {
      start = this.groups[1];
      if (this.groups[0] === this.groups[1]) {
        const r = (this.matcherInput.isUTF16Encoding() ? MachineInput.fromUTF16(this.matcherInput.asCharSequence(), 0, this.matcherInputLength) : MachineInput.fromUTF8(this.matcherInput.asBytes(), 0, this.matcherInputLength)).step(start);
        if (r < 0) start++;
        else start += r & 7;
      }
    }
    return this.genMatch(start, RE2Flags.UNANCHORED);
  }
  /**
  * Helper: does match starting at start, with RE2 anchor flag.
  * @param {number} startByte
  * @param {number} anchor
  * @returns {boolean}
  * @private
  */
  genMatch(startByte, anchor2) {
    const res = this.patternInput.re2().matchMachineInput(this.matcherInput, startByte, this.matcherInputLength, anchor2, 1);
    if (!res[0]) {
      this.hasMatch = false;
      return false;
    }
    this.groups = res[1];
    this.hasMatch = true;
    this.hasGroups = this.patternGroupCount === 0;
    this.anchorFlag = anchor2;
    return true;
  }
  /**
  * Helper: return substring for [start, end).
  * @param {number} start
  * @param {number} end
  * @returns {string}
  */
  substring(start, end) {
    if (this.matcherInput.isUTF8Encoding()) return Utils.utf8ByteArrayToString(this.matcherInput.asBytes().slice(start, end));
    return this.matcherInput.asCharSequence().substring(start, end).toString();
  }
  /**
  * Helper for Pattern: return input length.
  * @returns {number}
  */
  inputLength() {
    return this.matcherInputLength;
  }
  /**
  * Appends to result two strings: the text from the append position up to the beginning of the
  * most recent match, and then the replacement with submatch groups substituted for references of
  * the form {@code $n}, where {@code n} is the group number in decimal. It advances the append
  * position to where the most recent match ended.
  *
  * To embed a literal {@code $}, use \$ (actually {@code "\\$"} with string escapes). The escape
  * is only necessary when {@code $} is followed by a digit, but it is always allowed. Only
  * {@code $} and {@code \} need escaping, but any character can be escaped.
  *
  * The group number {@code n} in {@code $n} is always at least one digit and expands to use more
  * digits as long as the resulting number is a valid group number for this pattern. To cut it off
  * earlier, escape the first digit that should not be used.
  *
  * @param {string} replacement the replacement string
  * @param {boolean} [javaMode=false] activate java mode (different behaviour for capture groups and special characters)
  * @returns {string}
  * @throws IllegalStateException if there was no most recent match
  * @throws IndexOutOfBoundsException if replacement refers to an invalid group
  * @private
  */
  appendReplacement(replacement, javaMode = false) {
    let res = "";
    const s = this.start();
    const e = this.end();
    if (this.appendPos < s) res += this.substring(this.appendPos, s);
    this.appendPos = e;
    res += javaMode ? this.appendReplacementInternalJava(replacement) : this.appendReplacementInternalJs(replacement);
    return res;
  }
  /**
  * @param {string} replacement - the replacement string
  * @returns {string}
  * @private
  */
  appendReplacementInternalJava(replacement) {
    let res = "";
    let last = 0;
    const m = replacement.length;
    let i = 0;
    while (i < m) {
      const cCode = replacement.codePointAt(i);
      if (cCode === Codepoint.CODES.get("\\")) {
        if (last < i) res += replacement.substring(last, i);
        i++;
        if (i >= m) throw new RE2JSGroupException("character to be escaped is missing");
        last = i;
        i++;
        continue;
      }
      if (cCode === Codepoint.CODES.get("$")) {
        if (last < i) res += replacement.substring(last, i);
        if (i + 1 >= m) throw new RE2JSGroupException("Illegal group reference: group index is missing");
        const nextCode = replacement.codePointAt(i + 1);
        if (Codepoint.CODES.get("0") <= nextCode && nextCode <= Codepoint.CODES.get("9")) {
          let n = nextCode - Codepoint.CODES.get("0");
          let j = i + 2;
          for (; j < m; j++) {
            const digit = replacement.codePointAt(j);
            if (digit < Codepoint.CODES.get("0") || digit > Codepoint.CODES.get("9") || n * 10 + digit - Codepoint.CODES.get("0") > this.patternGroupCount) break;
            n = n * 10 + digit - Codepoint.CODES.get("0");
          }
          if (n > this.patternGroupCount) throw new RE2JSGroupException(`n > number of groups: ${n}`);
          const group = this.group(n);
          if (group !== null) res += group;
          i = j;
          last = i;
        } else if (nextCode === Codepoint.CODES.get("{")) {
          let j = i + 2;
          while (j < m && replacement.codePointAt(j) !== Codepoint.CODES.get("}")) j++;
          if (j >= m) throw new RE2JSGroupException("named capture group is missing trailing '}'");
          const groupName = replacement.substring(i + 2, j);
          const groupVal = this.group(groupName);
          if (groupVal !== null) res += groupVal;
          i = j + 1;
          last = i;
        } else throw new RE2JSGroupException("Illegal group reference");
        continue;
      }
      i++;
    }
    if (last < m) res += replacement.substring(last, m);
    return res;
  }
  /**
  * @param {string} replacement - the replacement string
  * @returns {string}
  * @private
  */
  appendReplacementInternalJs(replacement) {
    let res = "";
    let last = 0;
    const m = replacement.length;
    for (let i = 0; i < m - 1; i++) if (replacement.codePointAt(i) === Codepoint.CODES.get("$")) {
      let c = replacement.codePointAt(i + 1);
      if (Codepoint.CODES.get("$") === c) {
        if (last < i) res += replacement.substring(last, i);
        res += "$";
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("&") === c) {
        if (last < i) res += replacement.substring(last, i);
        const group = this.group(0);
        if (group !== null) res += group;
        else res += "$&";
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("`") === c) {
        if (last < i) res += replacement.substring(last, i);
        res += this.substring(0, this.start(0));
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("'") === c) {
        if (last < i) res += replacement.substring(last, i);
        res += this.substring(this.end(0), this.matcherInputLength);
        i++;
        last = i + 1;
        continue;
      } else if (Codepoint.CODES.get("1") <= c && c <= Codepoint.CODES.get("9")) {
        let n = c - Codepoint.CODES.get("0");
        if (last < i) res += replacement.substring(last, i);
        for (i += 2; i < m; i++) {
          c = replacement.codePointAt(i);
          if (c < Codepoint.CODES.get("0") || c > Codepoint.CODES.get("9") || n * 10 + c - Codepoint.CODES.get("0") > this.patternGroupCount) break;
          n = n * 10 + c - Codepoint.CODES.get("0");
        }
        if (n > this.patternGroupCount) {
          res += `$${n}`;
          last = i;
          i--;
          continue;
        }
        const group = this.group(n);
        if (group !== null) res += group;
        last = i;
        i--;
        continue;
      } else if (c === Codepoint.CODES.get("<")) {
        if (last < i) res += replacement.substring(last, i);
        i++;
        let j = i + 1;
        while (j < replacement.length && replacement.codePointAt(j) !== Codepoint.CODES.get(">") && replacement.codePointAt(j) !== Codepoint.CODES.get(" ")) j++;
        if (j === replacement.length || replacement.codePointAt(j) !== Codepoint.CODES.get(">")) {
          res += replacement.substring(i - 1, j + 1);
          last = j + 1;
          i = j;
          continue;
        }
        const groupName = replacement.substring(i + 1, j);
        if (Object.prototype.hasOwnProperty.call(this.namedGroups, groupName)) {
          const groupVal = this.group(groupName);
          if (groupVal !== null) res += groupVal;
        } else res += `$<${groupName}>`;
        last = j + 1;
        i = j;
        continue;
      }
    }
    if (last < m) res += replacement.substring(last, m);
    return res;
  }
  /**
  * Return the substring of the input from the append position to the end of the
  * input.
  * @returns {string}
  */
  appendTail() {
    return this.substring(this.appendPos, this.matcherInputLength);
  }
  /**
  * Returns the input with all matches replaced by {@code replacement}, interpreted as for
  * {@code appendReplacement}.
  *
  * @param {string|((...args: any[]) => string)} replacement - the replacement string or a replacer function
  * @param {boolean} [javaMode=false] - activate java mode (different behaviour for capture groups and special characters)
  * @returns {string} the input string with the matches replaced
  * @throws IndexOutOfBoundsException if replacement refers to an invalid group and javaMode is true
  */
  replaceAll(replacement, javaMode = false) {
    return this.replace(replacement, true, javaMode);
  }
  /**
  * Returns the input with the first match replaced by {@code replacement}, interpreted as for
  * {@code appendReplacement}.
  *
  * @param {string|((...args: any[]) => string)} replacement - the replacement string or a replacer function
  * @param {boolean} [javaMode=false] - activate java mode (different behaviour for capture groups and special characters)
  * @returns {string} the input string with the first match replaced
  * @throws IndexOutOfBoundsException if replacement refers to an invalid group and javaMode is true
  */
  replaceFirst(replacement, javaMode = false) {
    return this.replace(replacement, false, javaMode);
  }
  /**
  * Helper: replaceAll/replaceFirst hybrid.
  * @param {string|((...args: any[]) => string)} replacement - the replacement string or a replacer function
  * @param {boolean} [all=true] - replace all matches
  * @param {boolean} [javaMode=false] - activate java mode (different behaviour for capture groups and special characters)
  * @returns {string}
  * @private
  */
  replace(replacement, all = true, javaMode = false) {
    let res = "";
    this.reset();
    const isFunc = typeof replacement === "function";
    const hasNamedGroups = Object.keys(this.namedGroups).length > 0;
    let originalInput = null;
    if (isFunc) {
      if (this.groupCount() >= Matcher2.MAX_REPLACER_ARGS) throw new RE2JSGroupException("Too many capture groups to safely invoke replacer function");
      originalInput = this.matcherInput.isUTF8Encoding() ? this.matcherInput.asBytes() : this.matcherInput.asCharSequence();
    }
    while (this.find()) {
      res += isFunc ? this.appendReplacementFunc(replacement, hasNamedGroups, originalInput) : this.appendReplacement(replacement, javaMode);
      if (!all) break;
    }
    res += this.appendTail();
    return res;
  }
  /**
  * Evaluates a replacer function for the current match and appends the result,
  * along with any un-matched preceding text, advancing the append position.
  * @param {Function} replacer - the replacer function
  * @param {boolean} hasNamedGroups - cached flag if pattern has named groups
  * @param {string|Uint8Array|number[]} originalInput - the cached original input reference
  * @returns {string} the evaluated string to append
  * @private
  */
  appendReplacementFunc(replacer, hasNamedGroups, originalInput) {
    let res = "";
    const s = this.start();
    const e = this.end();
    if (this.appendPos < s) res += this.substring(this.appendPos, s);
    this.appendPos = e;
    const args = this.buildReplacerArgs(s, hasNamedGroups, originalInput);
    res += String(replacer(...args));
    return res;
  }
  /**
  * Builds the argument array for the replacer function matching the standard
  * JS String.prototype.replace(regex, replacer) signature.
  * @param {number} matchStart - the start index of the match
  * @param {boolean} hasNamedGroups - cached flag if pattern has named groups
  * @param {string|Uint8Array|number[]} originalInput - the cached original input reference
  * @returns {Array} array of arguments
  * @private
  */
  buildReplacerArgs(matchStart, hasNamedGroups, originalInput) {
    const args = [this.group(0)];
    const numGroups = this.groupCount();
    for (let i = 1; i <= numGroups; i++) {
      const start = this.start(i);
      if (start < 0) args.push(void 0);
      else args.push(this.substring(start, this.end(i)));
    }
    args.push(matchStart);
    args.push(originalInput);
    if (hasNamedGroups) {
      const parsedGroups = this.getNamedGroups();
      for (const key in parsedGroups) if (parsedGroups[key] === null) parsedGroups[key] = void 0;
      args.push(parsedGroups);
    }
    return args;
  }
};
var Inst = class Inst2 {
  static ALT = 1;
  static ALT_MATCH = 2;
  static CAPTURE = 3;
  static EMPTY_WIDTH = 4;
  static FAIL = 5;
  static MATCH = 6;
  static NOP = 7;
  static RUNE = 8;
  static RUNE1 = 9;
  static RUNE_ANY = 10;
  static RUNE_ANY_NOT_NL = 11;
  static LB_WRITE = 12;
  static LB_CHECK = 13;
  static isRuneOp(op) {
    return Inst2.RUNE <= op && op <= Inst2.RUNE_ANY_NOT_NL;
  }
  static escapeRunes(runes) {
    let out = '"';
    for (let rune of runes) out += Utils.escapeRune(rune);
    out += '"';
    return out;
  }
  constructor(op) {
    this.op = op;
    this.out = 0;
    this.arg = 0;
    this.runes = [];
    this.next = null;
  }
  matchRune(r) {
    if (this.runes.length === 1) {
      const r0 = this.runes[0];
      if ((this.arg & RE2Flags.FOLD_CASE) !== 0) return Unicode.equalsIgnoreCase(r0, r);
      return r === r0;
    }
    const len = this.runes.length;
    if (len === 0) return false;
    if (len === 2 || len === 4 || len === 6 || len === 8) {
      for (let j = 0; j < len; j += 2) {
        if (r < this.runes[j]) return false;
        if (r <= this.runes[j + 1]) return true;
      }
      return false;
    }
    let base = 0;
    let n = len >> 1;
    while (n > 1) {
      const half = n >> 1;
      base += this.runes[base + half << 1] <= r ? half : 0;
      n -= half;
    }
    base += this.runes[base << 1] <= r ? 1 : 0;
    const m = base - 1;
    return m >= 0 && r <= this.runes[m << 1 | 1];
  }
  matchRunePos(r) {
    if (this.runes.length === 1) {
      const r0 = this.runes[0];
      if ((this.arg & RE2Flags.FOLD_CASE) !== 0) return Unicode.equalsIgnoreCase(r0, r) ? 0 : -1;
      return r === r0 ? 0 : -1;
    }
    const len = this.runes.length;
    if (len === 0) return -1;
    if (len === 2 || len === 4 || len === 6 || len === 8) {
      for (let j = 0; j < len; j += 2) {
        if (r < this.runes[j]) return -1;
        if (r <= this.runes[j + 1]) return Math.floor(j / 2);
      }
      return -1;
    }
    let base = 0;
    let n = len >> 1;
    while (n > 1) {
      const half = n >> 1;
      base += this.runes[base + half << 1] <= r ? half : 0;
      n -= half;
    }
    base += this.runes[base << 1] <= r ? 1 : 0;
    const m = base - 1;
    return m >= 0 && r <= this.runes[m << 1 | 1] ? m : -1;
  }
  /**
  *
  * @returns {string}
  */
  toString() {
    switch (this.op) {
      case Inst2.ALT:
        return `alt -> ${this.out}, ${this.arg}`;
      case Inst2.ALT_MATCH:
        return `altmatch -> ${this.out}, ${this.arg}`;
      case Inst2.CAPTURE:
        return `cap ${this.arg} -> ${this.out}`;
      case Inst2.EMPTY_WIDTH:
        return `empty ${this.arg} -> ${this.out}`;
      case Inst2.MATCH:
        return `match${this.arg !== 0 ? ` ${this.arg}` : ""}`;
      case Inst2.FAIL:
        return "fail";
      case Inst2.NOP:
        return `nop -> ${this.out}`;
      case Inst2.LB_WRITE:
        return `lbwrite ${this.arg} -> ${this.out}`;
      case Inst2.LB_CHECK:
        return `lbcheck ${this.arg} -> ${this.out}`;
      case Inst2.RUNE:
        if (this.runes === null) return "rune <null>";
        return [
          "rune ",
          Inst2.escapeRunes(this.runes),
          (this.arg & RE2Flags.FOLD_CASE) !== 0 ? "/i" : "",
          " -> ",
          this.out
        ].join("");
      case Inst2.RUNE1:
        return `rune1 ${Inst2.escapeRunes(this.runes)} -> ${this.out}`;
      case Inst2.RUNE_ANY:
        return `any -> ${this.out}`;
      case Inst2.RUNE_ANY_NOT_NL:
        return `anynotnl -> ${this.out}`;
      default:
        throw new Error("unhandled case in Inst.toString");
    }
  }
};
var Queue = class {
  constructor(numInst) {
    this.sparse = new Int32Array(numInst);
    this.densePcs = new Int32Array(numInst);
    this.denseCaps = null;
    this.size = 0;
    this.ncap = 0;
  }
  init(ncap) {
    this.ncap = ncap;
    const needed = this.densePcs.length * ncap;
    if (!this.denseCaps || this.denseCaps.length < needed) this.denseCaps = new Int32Array(needed);
  }
  contains(pc) {
    const j = this.sparse[pc];
    return j < this.size && this.densePcs[j] === pc;
  }
  isEmpty() {
    return this.size === 0;
  }
  add(pc) {
    const j = this.size++;
    this.sparse[pc] = j;
    this.densePcs[j] = pc;
    return j;
  }
  clear() {
    this.size = 0;
  }
  toString() {
    let out = "{";
    for (let i = 0; i < this.size; i++) {
      if (i !== 0) out += ", ";
      out += this.densePcs[i];
    }
    out += "}";
    return out;
  }
};
var Machine = class Machine2 {
  static fromRE2(re2) {
    const m = new Machine2();
    m.prog = re2.prog;
    m.re2 = re2;
    m.q0 = new Queue(m.prog.numInst());
    m.q1 = new Queue(m.prog.numInst());
    m.matched = false;
    m.matchcap = new Int32Array(m.prog.numCap < 2 ? 2 : m.prog.numCap);
    m.ncap = 0;
    return m;
  }
  static fromMachine(machine) {
    return Machine2.fromRE2(machine.re2);
  }
  constructor() {
    this.prog = null;
    this.re2 = null;
    this.q0 = null;
    this.q1 = null;
    this.matched = false;
    this.matchcap = null;
    this.ncap = 0;
    this.lbTable = null;
  }
  init(ncap) {
    this.ncap = ncap;
    if (ncap > this.matchcap.length) this.matchcap = new Int32Array(ncap).fill(-1);
    else this.matchcap.fill(-1);
    this.q0.init(ncap);
    this.q1.init(ncap);
    if (this.prog.numLb > 0) {
      if (!this.lbTable || this.lbTable.length < this.prog.numLb + 1) this.lbTable = new Int32Array(this.prog.numLb + 1);
      this.lbTable.fill(-1);
    }
  }
  submatches() {
    if (this.ncap === 0) return Utils.emptyInts();
    return Utils.toArray(this.matchcap.subarray(0, this.ncap));
  }
  match(input, pos, anchor2) {
    const startCond = this.re2.cond;
    if (startCond === Utils.EMPTY_ALL) return false;
    if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && pos !== 0) return false;
    this.matched = false;
    this.matchcap.fill(-1);
    let currentPos = this.prog.numLb > 0 ? 0 : pos;
    let matchStartPos = pos;
    let runq = this.q0;
    let nextq = this.q1;
    let r = input.step(currentPos);
    let rune = r >> 3;
    let width = r & 7;
    let rune1 = -1;
    let width1 = 0;
    if (r !== MachineInputBase.EOF()) {
      r = input.step(currentPos + width);
      rune1 = r >> 3;
      width1 = r & 7;
    }
    let flag;
    if (currentPos === 0) flag = Utils.emptyOpContext(-1, rune);
    else flag = input.context(currentPos);
    while (true) {
      if (runq.isEmpty()) {
        if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 && currentPos !== 0) break;
        if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && currentPos !== 0) break;
        if (this.matched) break;
        if (this.prog.numLb === 0 && !(this.re2.prefix.length === 0) && rune1 !== this.re2.prefixRune && input.canCheckPrefix()) {
          const advance = input.index(this.re2, currentPos);
          if (advance < 0) break;
          currentPos += advance;
          r = input.step(currentPos);
          rune = r >> 3;
          width = r & 7;
          r = input.step(currentPos + width);
          rune1 = r >> 3;
          width1 = r & 7;
          flag = input.context(currentPos);
        }
      }
      if (currentPos === 0 && this.prog.numLb > 0) for (let i = 0; i < this.prog.lbStarts.length; i++) this.add(runq, this.prog.lbStarts[i], currentPos, this.matchcap, 0, flag);
      if (!this.matched && (currentPos === 0 || anchor2 === RE2Flags.UNANCHORED)) {
        if (currentPos >= matchStartPos) {
          if (this.ncap > 0) this.matchcap[0] = currentPos;
          this.add(runq, this.prog.start, currentPos, this.matchcap, 0, flag);
        }
      }
      const nextPos = currentPos + width;
      flag = input.context(nextPos);
      this.step(runq, nextq, currentPos, nextPos, rune, flag, anchor2, currentPos === input.endPos());
      if (width === 0) break;
      if (this.ncap === 0 && this.matched) break;
      currentPos += width;
      rune = rune1;
      width = width1;
      if (rune !== -1) {
        r = input.step(currentPos + width);
        rune1 = r >> 3;
        width1 = r & 7;
      }
      const tmpq = runq;
      runq = nextq;
      nextq = tmpq;
    }
    nextq.clear();
    return this.matched;
  }
  matchSet(input, pos, anchor2) {
    const startCond = this.re2.cond;
    if (startCond === Utils.EMPTY_ALL) return [];
    if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && pos !== 0) return [];
    let currentPos = this.prog.numLb > 0 ? 0 : pos;
    let matchStartPos = pos;
    let runq = this.q0;
    let nextq = this.q1;
    let r = input.step(currentPos);
    let rune = r >> 3;
    let width = r & 7;
    let rune1 = -1;
    let width1 = 0;
    if (r !== MachineInputBase.EOF()) {
      r = input.step(currentPos + width);
      rune1 = r >> 3;
      width1 = r & 7;
    }
    let flag = currentPos === 0 ? Utils.emptyOpContext(-1, rune) : input.context(currentPos);
    const matches = /* @__PURE__ */ new Set();
    while (true) {
      if (runq.isEmpty()) {
        if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 && currentPos !== 0) break;
        if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && currentPos !== 0) break;
      }
      if (currentPos === 0 && this.prog.numLb > 0) for (let i = 0; i < this.prog.lbStarts.length; i++) this.add(runq, this.prog.lbStarts[i], currentPos, this.matchcap, 0, flag);
      if (currentPos === 0 || anchor2 === RE2Flags.UNANCHORED) {
        if (currentPos >= matchStartPos) this.add(runq, this.prog.start, currentPos, this.matchcap, 0, flag);
      }
      const nextPos = currentPos + width;
      flag = input.context(nextPos);
      for (let j = 0; j < runq.size; j++) {
        const pc = runq.densePcs[j];
        const i = this.prog.inst[pc];
        const capOffset = j * this.ncap;
        let add = false;
        switch (i.op) {
          case Inst.MATCH:
            if (anchor2 === RE2Flags.ANCHOR_BOTH && currentPos !== input.endPos()) break;
            matches.add(i.arg);
            break;
          case Inst.RUNE:
            add = i.matchRune(rune);
            break;
          case Inst.RUNE1:
            add = rune === i.runes[0];
            break;
          case Inst.RUNE_ANY:
            add = true;
            break;
          case Inst.RUNE_ANY_NOT_NL:
            add = rune !== 10;
            break;
          default:
            continue;
        }
        if (add) this.add(nextq, i.out, nextPos, runq.denseCaps, capOffset, flag);
      }
      runq.clear();
      if (width === 0) break;
      currentPos += width;
      rune = rune1;
      width = width1;
      if (rune !== -1) {
        r = input.step(currentPos + width);
        rune1 = r >> 3;
        width1 = r & 7;
      }
      const tmpq = runq;
      runq = nextq;
      nextq = tmpq;
    }
    nextq.clear();
    return Array.from(matches).sort((a, b) => a - b);
  }
  step(runq, nextq, pos, nextPos, c, nextCond, anchor2, atEnd) {
    const longest = this.re2.longest;
    for (let j = 0; j < runq.size; j++) {
      const pc = runq.densePcs[j];
      const capOffset = j * this.ncap;
      if (longest && this.matched && this.ncap > 0 && this.matchcap[0] < runq.denseCaps[capOffset]) continue;
      const i = this.prog.inst[pc];
      let add = false;
      switch (i.op) {
        case Inst.MATCH:
          if (anchor2 === RE2Flags.ANCHOR_BOTH && !atEnd) break;
          if (this.ncap > 0 && (!longest || !this.matched || this.matchcap[1] < pos)) {
            runq.denseCaps[capOffset + 1] = pos;
            for (let k = 0; k < this.ncap; k++) this.matchcap[k] = runq.denseCaps[capOffset + k];
          }
          if (!longest) runq.size = 0;
          this.matched = true;
          break;
        case Inst.RUNE:
          add = i.matchRune(c);
          break;
        case Inst.RUNE1:
          add = c === i.runes[0];
          break;
        case Inst.RUNE_ANY:
          add = true;
          break;
        case Inst.RUNE_ANY_NOT_NL:
          add = c !== 10;
          break;
        default:
          continue;
      }
      if (add) this.add(nextq, i.out, nextPos, runq.denseCaps, capOffset, nextCond);
    }
    runq.clear();
  }
  add(q, pc, pos, capArray, capOffset, cond) {
    while (true) {
      if (pc === 0) return;
      if (q.contains(pc)) return;
      const d = q.add(pc);
      const inst = this.prog.inst[pc];
      switch (inst.op) {
        case Inst.FAIL:
          return;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          this.add(q, inst.out, pos, capArray, capOffset, cond);
          pc = inst.arg;
          continue;
        case Inst.EMPTY_WIDTH:
          if ((inst.arg & ~cond) === 0) {
            pc = inst.out;
            continue;
          }
          return;
        case Inst.NOP:
          pc = inst.out;
          continue;
        case Inst.CAPTURE:
          if (inst.arg < this.ncap) {
            const opos = capArray[capOffset + inst.arg];
            capArray[capOffset + inst.arg] = pos;
            this.add(q, inst.out, pos, capArray, capOffset, cond);
            capArray[capOffset + inst.arg] = opos;
            return;
          } else {
            pc = inst.out;
            continue;
          }
        case Inst.LB_WRITE:
          this.lbTable[Math.abs(inst.arg)] = pos;
          pc = inst.out;
          continue;
        case Inst.LB_CHECK:
          if (inst.arg > 0) {
            if (this.lbTable[inst.arg] === pos) {
              pc = inst.out;
              continue;
            }
          } else if (this.lbTable[-inst.arg] !== pos) {
            pc = inst.out;
            continue;
          }
          return;
        case Inst.MATCH:
        case Inst.RUNE:
        case Inst.RUNE1:
        case Inst.RUNE_ANY:
        case Inst.RUNE_ANY_NOT_NL:
          if (this.ncap > 0) {
            const destOffset = d * this.ncap;
            for (let c = 0; c < this.ncap; c++) q.denseCaps[destOffset + c] = capArray[capOffset + c];
          }
          return;
        default:
          throw new RE2JSInternalException("unhandled");
      }
    }
  }
};
var hashPCs = (pcs) => {
  let h = -2128831035;
  for (let i = 0; i < pcs.length; i++) {
    h ^= pcs[i];
    h = Math.imul(h, 16777619);
  }
  return h;
};
var arraysEqual = (a, b) => {
  if (a.length !== b.length) return false;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return false;
  return true;
};
var DFAState = class {
  constructor(nfaStates, isMatch, matchIDs = []) {
    this.nfaStates = nfaStates;
    this.isMatch = isMatch;
    this.matchIDs = matchIDs;
    this.nextLatin1 = new Array(Unicode.MAX_LATIN1 + 1).fill(null);
    this.nextLatin1Anchored = new Array(Unicode.MAX_LATIN1 + 1).fill(null);
    this.transKeys = [];
    this.transVals = [];
    this.lastSeen = 0;
  }
};
var DFA = class DFA2 {
  static MAX_CACHE_CLEARS = 5;
  static STATE_MEMORY_ESTIMATE = 838;
  constructor(prog, maxMem = 8388608) {
    this.prog = prog;
    this.stateCache = /* @__PURE__ */ new Map();
    this.stateCount = 0;
    this.startState = null;
    this.stateLimit = Math.max(1, Math.floor(maxMem / DFA2.STATE_MEMORY_ESTIMATE));
    this.cacheClears = 0;
    this.failed = false;
    this.clock = 0;
  }
  computeClosure(pcs) {
    const closure = /* @__PURE__ */ new Set();
    const stack = [...pcs];
    let isMatch = false;
    const matchIDs = [];
    while (stack.length > 0) {
      const pc = stack.pop();
      if (closure.has(pc)) continue;
      closure.add(pc);
      const inst = this.prog.getInst(pc);
      switch (inst.op) {
        case Inst.MATCH:
          isMatch = true;
          if (!matchIDs.includes(inst.arg)) matchIDs.push(inst.arg);
          break;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          stack.push(inst.out);
          stack.push(inst.arg);
          break;
        case Inst.NOP:
        case Inst.CAPTURE:
          stack.push(inst.out);
          break;
        case Inst.EMPTY_WIDTH:
        case Inst.LB_WRITE:
        case Inst.LB_CHECK:
          return null;
      }
    }
    const sortedPCs = Int32Array.from(closure).sort();
    matchIDs.sort((a, b) => a - b);
    return {
      pcs: sortedPCs,
      isMatch,
      matchIDs
    };
  }
  getState(pcs) {
    const closureResult = this.computeClosure(pcs);
    if (!closureResult) return null;
    const sortedPCs = closureResult.pcs;
    const hash = hashPCs(sortedPCs);
    let bucket = this.stateCache.get(hash);
    if (bucket) for (let i = 0; i < bucket.length; i++) {
      const state2 = bucket[i];
      if (arraysEqual(state2.nfaStates, sortedPCs)) {
        state2.lastSeen = ++this.clock;
        return state2;
      }
    }
    else {
      bucket = [];
      this.stateCache.set(hash, bucket);
    }
    if (this.failed) return null;
    if (this.stateCount >= this.stateLimit) {
      this.cacheClears++;
      if (this.cacheClears >= DFA2.MAX_CACHE_CLEARS) {
        this.failed = true;
        this.stateCache.clear();
        this.stateCount = 0;
        this.startState = null;
        return null;
      }
      this.evictCache();
      bucket = this.stateCache.get(hash);
      if (!bucket) {
        bucket = [];
        this.stateCache.set(hash, bucket);
      }
    }
    const state = new DFAState(sortedPCs, closureResult.isMatch, closureResult.matchIDs);
    state.lastSeen = ++this.clock;
    bucket.push(state);
    this.stateCount++;
    return state;
  }
  evictCache() {
    const allStates = [];
    for (const bucket of this.stateCache.values()) for (let i = 0; i < bucket.length; i++) allStates.push(bucket[i]);
    allStates.sort((a, b) => a.lastSeen - b.lastSeen);
    const keepCount = Math.max(1, Math.floor(this.stateLimit / 2));
    const startIndex = allStates.length - keepCount;
    const survivorsArray = allStates.slice(startIndex);
    const survivors = new Set(survivorsArray);
    this.stateCache.clear();
    this.stateCount = 0;
    for (let i = 0; i < survivorsArray.length; i++) {
      const state = survivorsArray[i];
      state.nextLatin1.fill(null);
      state.nextLatin1Anchored.fill(null);
      state.transKeys.length = 0;
      state.transVals.length = 0;
      const hash = hashPCs(state.nfaStates);
      let bucket = this.stateCache.get(hash);
      if (!bucket) {
        bucket = [];
        this.stateCache.set(hash, bucket);
      }
      bucket.push(state);
      this.stateCount++;
    }
    if (this.startState && !survivors.has(this.startState)) this.startState = null;
  }
  step(state, charCode, anchor2) {
    if (charCode <= Unicode.MAX_LATIN1) if (anchor2 === RE2Flags.UNANCHORED) {
      const next = state.nextLatin1[charCode];
      if (next !== null) return next;
    } else {
      const next = state.nextLatin1Anchored[charCode];
      if (next !== null) return next;
    }
    else {
      const key = charCode + (anchor2 === RE2Flags.UNANCHORED ? 0 : Unicode.MAX_RUNE + 1);
      const keys = state.transKeys;
      const len = keys.length;
      for (let i = 0; i < len; i++) if (keys[i] === key) return state.transVals[i];
    }
    const nextPCs = [];
    for (let i = 0; i < state.nfaStates.length; i++) {
      const pc = state.nfaStates[i];
      const inst = this.prog.getInst(pc);
      if (Inst.isRuneOp(inst.op) && inst.matchRune(charCode)) nextPCs.push(inst.out);
    }
    if (anchor2 === RE2Flags.UNANCHORED) nextPCs.push(this.prog.start);
    const nextState = this.getState(nextPCs);
    if (charCode <= Unicode.MAX_LATIN1) if (anchor2 === RE2Flags.UNANCHORED) state.nextLatin1[charCode] = nextState;
    else state.nextLatin1Anchored[charCode] = nextState;
    else {
      const key = charCode + (anchor2 === RE2Flags.UNANCHORED ? 0 : Unicode.MAX_RUNE + 1);
      state.transKeys.push(key);
      state.transVals.push(nextState);
    }
    return nextState;
  }
  match(input, pos, anchor2) {
    if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && pos !== 0) return false;
    if (!this.startState) {
      this.startState = this.getState([this.prog.start]);
      if (!this.startState) return null;
    }
    let endPos = input.endPos();
    let currentState = this.startState;
    if (currentState.isMatch) if (anchor2 === RE2Flags.ANCHOR_BOTH) {
      if (pos === endPos) return true;
    } else return true;
    let i = pos;
    while (i < endPos) {
      const r = input.step(i);
      const rune = r >> 3;
      const width = r & 7;
      if (width === 0) break;
      currentState = anchor2 === RE2Flags.UNANCHORED && rune <= Unicode.MAX_LATIN1 && currentState.nextLatin1[rune] || this.step(currentState, rune, anchor2);
      if (currentState === null) return null;
      currentState.lastSeen = ++this.clock;
      if (currentState.isMatch) if (anchor2 === RE2Flags.ANCHOR_BOTH) {
        if (i + width === endPos) return true;
      } else return true;
      if (currentState.nfaStates.length === 0) {
        if (anchor2 !== RE2Flags.UNANCHORED) return false;
      }
      i += width;
    }
    return false;
  }
  matchSet(input, pos, anchor2) {
    if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && pos !== 0) return [];
    if (!this.startState) {
      this.startState = this.getState([this.prog.start]);
      if (!this.startState) return null;
    }
    let endPos = input.endPos();
    let currentState = this.startState;
    const matches = /* @__PURE__ */ new Set();
    const checkMatch = (state, currentPos) => {
      if (state.isMatch) if (anchor2 === RE2Flags.ANCHOR_BOTH) {
        if (currentPos === endPos) state.matchIDs.forEach((id) => matches.add(id));
      } else state.matchIDs.forEach((id) => matches.add(id));
    };
    checkMatch(currentState, pos);
    let i = pos;
    while (i < endPos) {
      const r = input.step(i);
      const rune = r >> 3;
      const width = r & 7;
      if (width === 0) break;
      currentState = anchor2 === RE2Flags.UNANCHORED && rune <= Unicode.MAX_LATIN1 && currentState.nextLatin1[rune] || this.step(currentState, rune, anchor2);
      if (currentState === null) return null;
      currentState.lastSeen = ++this.clock;
      i += width;
      checkMatch(currentState, i);
      if (currentState.nfaStates.length === 0) {
        if (anchor2 !== RE2Flags.UNANCHORED) break;
      }
    }
    return Array.from(matches).sort((a, b) => a - b);
  }
};
var VISITED_BITS = 32;
var MAX_BACKTRACK_PROG = 500;
var INITIAL_JOB_CAPACITY = 256;
var MAX_BACKTRACK_VECTOR = 256 * 1024;
var BitState = class {
  constructor() {
    this.end = 0;
    this.cap = /* @__PURE__ */ new Int32Array(0);
    this.matchcap = /* @__PURE__ */ new Int32Array(0);
    this.ncap = 0;
    this.jobPc = new Int32Array(INITIAL_JOB_CAPACITY);
    this.jobArg = new Uint8Array(INITIAL_JOB_CAPACITY);
    this.jobPos = new Int32Array(INITIAL_JOB_CAPACITY);
    this.jobLen = 0;
    this.visited = /* @__PURE__ */ new Uint32Array(0);
  }
  reset(prog, end, ncap) {
    this.end = end;
    this.jobLen = 0;
    this.ncap = ncap;
    const visitedSize = prog.numInst() * (end + 1) + VISITED_BITS - 1 >>> 5;
    if (this.visited.length < visitedSize) this.visited = new Uint32Array(visitedSize);
    else this.visited.fill(0, 0, visitedSize);
    if (this.cap.length < ncap) this.cap = new Int32Array(ncap).fill(-1);
    else this.cap.fill(-1, 0, ncap);
    if (this.matchcap.length < ncap) this.matchcap = new Int32Array(ncap).fill(-1);
    else this.matchcap.fill(-1, 0, ncap);
  }
  shouldVisit(pc, pos) {
    const n = pc * (this.end + 1) + pos;
    const idx = n >>> 5;
    const mask = 1 << (n & 31);
    if ((this.visited[idx] & mask) !== 0) return false;
    this.visited[idx] |= mask;
    return true;
  }
  push(re2, pc, pos, arg) {
    if (re2.prog.getInst(pc).op !== Inst.FAIL && (arg || this.shouldVisit(pc, pos))) {
      if (this.jobLen >= this.jobPc.length) {
        const newSize = this.jobPc.length * 2;
        const newPc = new Int32Array(newSize);
        newPc.set(this.jobPc);
        this.jobPc = newPc;
        const newArg = new Uint8Array(newSize);
        newArg.set(this.jobArg);
        this.jobArg = newArg;
        const newPos = new Int32Array(newSize);
        newPos.set(this.jobPos);
        this.jobPos = newPos;
      }
      this.jobPc[this.jobLen] = pc;
      this.jobArg[this.jobLen] = arg ? 1 : 0;
      this.jobPos[this.jobLen] = pos;
      this.jobLen++;
    }
  }
  tryBacktrack(re2, input, pc, pos, anchor2) {
    const longest = re2.longest;
    this.push(re2, pc, pos, false);
    while (this.jobLen > 0) {
      this.jobLen--;
      let currentPc = this.jobPc[this.jobLen];
      let arg = this.jobArg[this.jobLen] === 1;
      let currentPos = this.jobPos[this.jobLen];
      let skipShouldVisit = true;
      while (true) {
        if (!skipShouldVisit) {
          if (!this.shouldVisit(currentPc, currentPos)) break;
        }
        skipShouldVisit = false;
        const inst = re2.prog.getInst(currentPc);
        switch (inst.op) {
          case Inst.FAIL:
            throw new RE2JSInternalException("unexpected InstFail");
          case Inst.ALT:
            if (arg) {
              arg = false;
              currentPc = inst.arg;
              continue;
            } else {
              this.push(re2, currentPc, currentPos, true);
              currentPc = inst.out;
              continue;
            }
          case Inst.ALT_MATCH: {
            const outInst = re2.prog.getInst(inst.out);
            if (Inst.isRuneOp(outInst.op)) {
              this.push(re2, inst.arg, currentPos, false);
              currentPc = inst.arg;
              currentPos = this.end;
              continue;
            }
            this.push(re2, inst.out, this.end, false);
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            if (!inst.matchRune(r >> 3)) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE1: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            if (r >> 3 !== inst.runes[0]) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE_ANY_NOT_NL: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            if (r >> 3 === 10) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.RUNE_ANY: {
            const r = input.step(currentPos);
            if (r === MachineInputBase.EOF()) break;
            currentPos += r & 7;
            currentPc = inst.out;
            continue;
          }
          case Inst.CAPTURE:
            if (arg) {
              this.cap[inst.arg] = currentPos;
              break;
            } else {
              if (inst.arg < this.ncap) {
                this.push(re2, currentPc, this.cap[inst.arg], true);
                this.cap[inst.arg] = currentPos;
              }
              currentPc = inst.out;
              continue;
            }
          case Inst.EMPTY_WIDTH: {
            const flag = input.context(currentPos);
            if ((inst.arg & ~flag) !== 0) break;
            currentPc = inst.out;
            continue;
          }
          case Inst.NOP:
            currentPc = inst.out;
            continue;
          case Inst.MATCH: {
            if (anchor2 === RE2Flags.ANCHOR_BOTH && currentPos !== this.end) break;
            if (this.ncap === 0) return true;
            if (this.ncap > 1) this.cap[1] = currentPos;
            const old = this.matchcap[1];
            if (old === -1 || longest && currentPos > 0 && currentPos > old) this.matchcap.set(this.cap);
            if (!longest) return true;
            if (currentPos === this.end) return true;
            break;
          }
          case Inst.LB_WRITE:
          case Inst.LB_CHECK:
            throw new RE2JSInternalException("Backtracker cannot evaluate Lookbehind instructions");
          default:
            throw new RE2JSInternalException("bad inst");
        }
        break;
      }
    }
    return longest && this.matchcap.length > 1 && this.matchcap[1] >= 0;
  }
};
var bitStatePool = [];
var Backtracker = class Backtracker2 {
  static shouldBacktrack(prog) {
    return prog.numInst() <= MAX_BACKTRACK_PROG;
  }
  static maxBitStateLen(prog) {
    if (!Backtracker2.shouldBacktrack(prog)) return 0;
    return Math.floor(MAX_BACKTRACK_VECTOR / prog.numInst());
  }
  static execute(re2, input, pos, anchor2, ncap) {
    const startCond = re2.cond;
    if (startCond === Utils.EMPTY_ALL) return null;
    if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && pos !== 0) return null;
    if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 && pos !== 0) return null;
    const b = bitStatePool.length > 0 ? bitStatePool.pop() : new BitState();
    const end = input.endPos();
    b.reset(re2.prog, end, ncap);
    let matched = false;
    if ((startCond & Utils.EMPTY_BEGIN_TEXT) !== 0 || anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) {
      if (b.ncap > 0) b.cap[0] = pos;
      if (b.tryBacktrack(re2, input, re2.prog.start, pos, anchor2)) matched = true;
    } else {
      let width = -1;
      for (; pos <= end && width !== 0; pos += width) {
        if (re2.prefix.length > 0) {
          const advance = input.index(re2, pos);
          if (advance < 0) break;
          pos += advance;
        }
        if (b.ncap > 0) b.cap[0] = pos;
        if (b.tryBacktrack(re2, input, re2.prog.start, pos, anchor2)) {
          matched = true;
          break;
        }
        const r = input.step(pos);
        width = r === MachineInputBase.EOF() ? 0 : r & 7;
      }
    }
    if (!matched) {
      bitStatePool.push(b);
      return null;
    }
    const result = ncap === 0 ? [] : Utils.toArray(b.matchcap.subarray(0, ncap));
    bitStatePool.push(b);
    return result;
  }
};
var QueueOnePass = class {
  constructor(size) {
    this.sparse = new Uint32Array(size);
    this.dense = new Uint32Array(size);
    this.size = 0;
    this.nextIndex = 0;
  }
  empty() {
    return this.nextIndex >= this.size;
  }
  next() {
    return this.dense[this.nextIndex++];
  }
  clear() {
    this.size = 0;
    this.nextIndex = 0;
  }
  contains(u) {
    return u < this.sparse.length && this.sparse[u] < this.size && this.dense[this.sparse[u]] === u;
  }
  insert(u) {
    if (!this.contains(u)) this.insertNew(u);
  }
  insertNew(u) {
    if (u >= this.sparse.length) return;
    this.sparse[u] = this.size;
    this.dense[this.size] = u;
    this.size++;
  }
};
var mergeRuneSets = (leftRunes, rightRunes, leftPC, rightPC) => {
  const leftLen = leftRunes.length;
  const rightLen = rightRunes.length;
  let lx = 0, rx = 0;
  const merged = [];
  const next = [];
  let ok = true;
  let ix = -1;
  const extend2 = (isLeft) => {
    const newArray = isLeft ? leftRunes : rightRunes;
    const low = isLeft ? lx : rx;
    const pc = isLeft ? leftPC : rightPC;
    if (ix > 0 && newArray[low] <= merged[ix]) return false;
    merged.push(newArray[low], newArray[low + 1]);
    if (isLeft) lx += 2;
    else rx += 2;
    ix += 2;
    next.push(pc);
    return true;
  };
  while (lx < leftLen || rx < rightLen) {
    if (rx >= rightLen) ok = extend2(true);
    else if (lx >= leftLen) ok = extend2(false);
    else if (rightRunes[rx] < leftRunes[lx]) ok = extend2(false);
    else ok = extend2(true);
    if (!ok) return null;
  }
  return {
    merged,
    next
  };
};
var OnePassProg = class {
  constructor(prog) {
    this.start = prog.start;
    this.numCap = prog.numCap;
    this.inst = new Array(prog.inst.length);
    for (let i = 0; i < prog.inst.length; i++) {
      const orig = prog.inst[i];
      const inst = new Inst(orig.op);
      inst.out = orig.out;
      inst.arg = orig.arg;
      inst.runes = orig.runes ? orig.runes.slice() : [];
      inst.next = null;
      this.inst[i] = inst;
    }
  }
};
var onePassCopy = (prog) => {
  const p = new OnePassProg(prog);
  for (let pc = 0; pc < p.inst.length; pc++) {
    const inst = p.inst[pc];
    if (inst.op !== Inst.ALT && inst.op !== Inst.ALT_MATCH) continue;
    let pAOther = "out";
    let pAAlt = "arg";
    let instAlt = p.inst[inst[pAAlt]];
    if (instAlt.op !== Inst.ALT && instAlt.op !== Inst.ALT_MATCH) {
      pAOther = "arg";
      pAAlt = "out";
      instAlt = p.inst[inst[pAAlt]];
      if (instAlt.op !== Inst.ALT && instAlt.op !== Inst.ALT_MATCH) continue;
    }
    const instOther = p.inst[inst[pAOther]];
    if (instOther.op === Inst.ALT || instOther.op === Inst.ALT_MATCH) continue;
    let pBAlt = "out";
    let pBOther = "arg";
    let patch = false;
    if (instAlt.out === pc) patch = true;
    else if (instAlt.arg === pc) {
      patch = true;
      pBAlt = "arg";
      pBOther = "out";
    }
    if (patch) instAlt[pBAlt] = inst[pAOther];
    if (inst[pAOther] === instAlt[pBAlt]) inst[pAAlt] = instAlt[pBOther];
  }
  return p;
};
var makeOnePass = (p) => {
  if (p.inst.length >= 1e3) return null;
  const instQueue = new QueueOnePass(p.inst.length);
  const visitQueue = new QueueOnePass(p.inst.length);
  const onePassRunes = new Array(p.inst.length);
  const m = new Array(p.inst.length).fill(false);
  const check = (pc) => {
    let ok = true;
    const inst = p.inst[pc];
    if (visitQueue.contains(pc)) return true;
    visitQueue.insert(pc);
    switch (inst.op) {
      case Inst.ALT:
      case Inst.ALT_MATCH: {
        ok = check(inst.out) && check(inst.arg);
        let matchOut = m[inst.out];
        let matchArg = m[inst.arg];
        if (matchOut && matchArg) return false;
        if (matchArg) {
          const tempOut = inst.out;
          inst.out = inst.arg;
          inst.arg = tempOut;
          const tempMatch = matchOut;
          matchOut = matchArg;
          matchArg = tempMatch;
        }
        if (matchOut) {
          m[pc] = true;
          inst.op = Inst.ALT_MATCH;
        }
        const leftRunes = onePassRunes[inst.out] || [];
        const rightRunes = onePassRunes[inst.arg] || [];
        const mergeRes = mergeRuneSets(leftRunes, rightRunes, inst.out, inst.arg);
        if (!mergeRes) return false;
        onePassRunes[pc] = mergeRes.merged;
        inst.next = new Uint32Array(mergeRes.next);
        break;
      }
      case Inst.CAPTURE:
      case Inst.EMPTY_WIDTH:
      case Inst.NOP:
        ok = check(inst.out);
        m[pc] = m[inst.out];
        onePassRunes[pc] = onePassRunes[inst.out] ? onePassRunes[inst.out].slice() : [];
        inst.next = new Uint32Array(Math.floor(onePassRunes[pc].length / 2) + 1).fill(inst.out);
        break;
      case Inst.MATCH:
      case Inst.FAIL:
        m[pc] = inst.op === Inst.MATCH;
        break;
      case Inst.RUNE: {
        m[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        if (!inst.runes || inst.runes.length === 0) {
          onePassRunes[pc] = [];
          inst.next = new Uint32Array([inst.out]);
          break;
        }
        let runes = [];
        if (inst.runes.length === 1 && (inst.arg & RE2Flags.FOLD_CASE) !== 0) {
          const r0 = inst.runes[0];
          runes.push(r0, r0);
          for (let r1 = Unicode.simpleFold(r0); r1 !== r0; r1 = Unicode.simpleFold(r1)) runes.push(r1, r1);
          runes.sort((a, b) => a - b);
        } else for (let j = 0; j < inst.runes.length; j++) runes.push(inst.runes[j]);
        onePassRunes[pc] = runes;
        inst.next = new Uint32Array(Math.floor(runes.length / 2) + 1).fill(inst.out);
        inst.op = Inst.RUNE;
        break;
      }
      case Inst.RUNE1: {
        m[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        let runes = [];
        if ((inst.arg & RE2Flags.FOLD_CASE) !== 0) {
          const r0 = inst.runes[0];
          runes.push(r0, r0);
          for (let r1 = Unicode.simpleFold(r0); r1 !== r0; r1 = Unicode.simpleFold(r1)) runes.push(r1, r1);
          runes.sort((a, b) => a - b);
        } else runes.push(inst.runes[0], inst.runes[0]);
        onePassRunes[pc] = runes;
        inst.next = new Uint32Array(Math.floor(runes.length / 2) + 1).fill(inst.out);
        inst.op = Inst.RUNE;
        break;
      }
      case Inst.RUNE_ANY:
        m[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        onePassRunes[pc] = [0, Unicode.MAX_RUNE];
        inst.next = new Uint32Array([inst.out]);
        break;
      case Inst.RUNE_ANY_NOT_NL:
        m[pc] = false;
        if (inst.next && inst.next.length > 0) break;
        instQueue.insert(inst.out);
        onePassRunes[pc] = [
          0,
          9,
          11,
          Unicode.MAX_RUNE
        ];
        inst.next = new Uint32Array(Math.floor(onePassRunes[pc].length / 2) + 1).fill(inst.out);
        break;
    }
    return ok;
  };
  instQueue.clear();
  instQueue.insert(p.start);
  while (!instQueue.empty()) {
    visitQueue.clear();
    if (!check(instQueue.next())) return null;
  }
  for (let i = 0; i < p.inst.length; i++) if (onePassRunes[i]) p.inst[i].runes = onePassRunes[i];
  return p;
};
var cleanupOnePass = (p, original) => {
  for (let ix = 0; ix < original.inst.length; ix++) {
    const instOriginal = original.inst[ix];
    switch (instOriginal.op) {
      case Inst.ALT:
      case Inst.ALT_MATCH:
      case Inst.RUNE:
        break;
      case Inst.CAPTURE:
      case Inst.EMPTY_WIDTH:
      case Inst.NOP:
      case Inst.MATCH:
      case Inst.FAIL:
        p.inst[ix].next = null;
        break;
      case Inst.RUNE1:
      case Inst.RUNE_ANY:
      case Inst.RUNE_ANY_NOT_NL:
        p.inst[ix].next = null;
        p.inst[ix].op = instOriginal.op;
        p.inst[ix].runes = instOriginal.runes ? instOriginal.runes.slice() : [];
        break;
    }
  }
};
var OnePass = class OnePass2 {
  static compile(prog) {
    if (prog.start === 0) return null;
    if (prog.numLb > 0) return null;
    const startInst = prog.inst[prog.start];
    if (startInst.op !== Inst.EMPTY_WIDTH || (startInst.arg & Utils.EMPTY_BEGIN_TEXT) === 0) return null;
    let hasAlt = false;
    for (let i = 0; i < prog.inst.length; i++) if (prog.inst[i].op === Inst.ALT || prog.inst[i].op === Inst.ALT_MATCH) {
      hasAlt = true;
      break;
    }
    for (let i = 0; i < prog.inst.length; i++) {
      const inst = prog.inst[i];
      const opOut = prog.inst[inst.out].op;
      switch (inst.op) {
        case Inst.ALT:
        case Inst.ALT_MATCH:
          if (opOut === Inst.MATCH || prog.inst[inst.arg].op === Inst.MATCH) return null;
          break;
        case Inst.EMPTY_WIDTH:
          if (opOut === Inst.MATCH) {
            if ((inst.arg & Utils.EMPTY_END_TEXT) === Utils.EMPTY_END_TEXT) continue;
            return null;
          }
          break;
        default:
          if (opOut === Inst.MATCH && hasAlt) return null;
          break;
      }
    }
    let p = onePassCopy(prog);
    p = makeOnePass(p);
    if (p !== null) cleanupOnePass(p, prog);
    return p;
  }
  static next(inst, r) {
    const nextIdx = inst.matchRunePos(r);
    if (nextIdx >= 0) return inst.next[nextIdx];
    if (inst.op === Inst.ALT_MATCH) return inst.out;
    return 0;
  }
  static execute(re2, input, pos, anchor2, ncap) {
    const onepass = re2.onepass;
    if (!onepass) return null;
    const matchcap = new Int32Array(ncap).fill(-1);
    let matched = false;
    let r = input.step(pos);
    let rune = r >> 3;
    let width = r & 7;
    let r1 = MachineInputBase.EOF();
    let rune1 = -1;
    let width1 = 0;
    if (r !== MachineInputBase.EOF()) {
      r1 = input.step(pos + width);
      if (r1 !== MachineInputBase.EOF()) {
        rune1 = r1 >> 3;
        width1 = r1 & 7;
      }
    }
    let flag = pos === 0 ? Utils.emptyOpContext(-1, rune) : input.context(pos);
    let pc = onepass.start;
    let inst;
    while (true) {
      inst = onepass.inst[pc];
      pc = inst.out;
      switch (inst.op) {
        case Inst.MATCH:
          if (anchor2 === RE2Flags.ANCHOR_BOTH && pos !== input.endPos()) return null;
          matched = true;
          if (matchcap.length > 0) {
            matchcap[0] = 0;
            matchcap[1] = pos;
          }
          return ncap === 0 ? [] : Utils.toArray(matchcap);
        case Inst.RUNE:
          if (!inst.matchRune(rune)) return null;
          break;
        case Inst.RUNE1:
          if (rune !== inst.runes[0]) return null;
          break;
        case Inst.RUNE_ANY:
          break;
        case Inst.RUNE_ANY_NOT_NL:
          if (rune === 10) return null;
          break;
        case Inst.ALT:
        case Inst.ALT_MATCH:
          pc = OnePass2.next(inst, rune);
          continue;
        case Inst.FAIL:
          return null;
        case Inst.NOP:
          continue;
        case Inst.EMPTY_WIDTH:
          if ((inst.arg & ~flag) !== 0) return null;
          continue;
        case Inst.CAPTURE:
          if (inst.arg < matchcap.length) matchcap[inst.arg] = pos;
          continue;
        default:
          throw new RE2JSInternalException("bad inst");
      }
      if (width === 0) break;
      flag = Utils.emptyOpContext(rune, rune1);
      pos += width;
      rune = rune1;
      width = width1;
      if (rune !== -1) {
        r1 = input.step(pos + width);
        if (r1 !== MachineInputBase.EOF()) {
          rune1 = r1 >> 3;
          width1 = r1 & 7;
        } else {
          rune1 = -1;
          width1 = 0;
        }
      }
    }
    if (!matched) return null;
    return ncap === 0 ? [] : Utils.toArray(matchcap);
  }
};
var Regexp = class Regexp2 {
  static Op = createEnum([
    "NO_MATCH",
    "EMPTY_MATCH",
    "LITERAL",
    "CHAR_CLASS",
    "ANY_CHAR_NOT_NL",
    "ANY_CHAR",
    "BEGIN_LINE",
    "END_LINE",
    "BEGIN_TEXT",
    "END_TEXT",
    "WORD_BOUNDARY",
    "NO_WORD_BOUNDARY",
    "CAPTURE",
    "STAR",
    "PLUS",
    "QUEST",
    "REPEAT",
    "CONCAT",
    "ALTERNATE",
    "PLB",
    "NLB",
    "LEFT_PAREN",
    "VERTICAL_BAR"
  ]);
  static isPseudoOp(op) {
    return op >= Regexp2.Op.LEFT_PAREN;
  }
  static emptySubs() {
    return [];
  }
  static quoteIfHyphen(rune) {
    if (rune === Codepoint.CODES.get("-")) return "\\";
    return "";
  }
  static fromRegexp(re) {
    const regex = new Regexp2(re.op);
    regex.flags = re.flags;
    regex.subs = re.subs;
    regex.runes = re.runes;
    regex.cap = re.cap;
    regex.min = re.min;
    regex.max = re.max;
    regex.name = re.name;
    regex.namedGroups = re.namedGroups;
    regex.lb = re.lb;
    return regex;
  }
  constructor(op) {
    this.op = op;
    this.flags = 0;
    this.subs = Regexp2.emptySubs();
    this.runes = [];
    this.min = 0;
    this.max = 0;
    this.cap = 0;
    this.name = null;
    this.namedGroups = /* @__PURE__ */ Object.create(null);
    this.lb = 0;
  }
  reinit() {
    this.flags = 0;
    this.subs = Regexp2.emptySubs();
    this.runes = [];
    this.cap = 0;
    this.min = 0;
    this.max = 0;
    this.name = null;
    this.namedGroups = /* @__PURE__ */ Object.create(null);
    this.lb = 0;
  }
  toString() {
    return this.appendTo();
  }
  appendTo() {
    let out = "";
    switch (this.op) {
      case Regexp2.Op.NO_MATCH:
        out += "[^\\x00-\\x{10FFFF}]";
        break;
      case Regexp2.Op.EMPTY_MATCH:
        out += "(?:)";
        break;
      case Regexp2.Op.STAR:
      case Regexp2.Op.PLUS:
      case Regexp2.Op.QUEST:
      case Regexp2.Op.REPEAT: {
        const sub = this.subs[0];
        if (sub.op > Regexp2.Op.CAPTURE || sub.op === Regexp2.Op.LITERAL && sub.runes.length > 1) out += `(?:${sub.appendTo()})`;
        else out += sub.appendTo();
        switch (this.op) {
          case Regexp2.Op.STAR:
            out += "*";
            break;
          case Regexp2.Op.PLUS:
            out += "+";
            break;
          case Regexp2.Op.QUEST:
            out += "?";
            break;
          case Regexp2.Op.REPEAT:
            out += `{${this.min}`;
            if (this.min !== this.max) {
              out += ",";
              if (this.max >= 0) out += this.max;
            }
            out += "}";
            break;
        }
        if ((this.flags & RE2Flags.NON_GREEDY) !== 0) out += "?";
        break;
      }
      case Regexp2.Op.CONCAT:
        for (let sub of this.subs) if (sub.op === Regexp2.Op.ALTERNATE) out += `(?:${sub.appendTo()})`;
        else out += sub.appendTo();
        break;
      case Regexp2.Op.ALTERNATE: {
        let sep = "";
        for (let sub of this.subs) {
          out += sep;
          sep = "|";
          out += sub.appendTo();
        }
        break;
      }
      case Regexp2.Op.LITERAL:
        if ((this.flags & RE2Flags.FOLD_CASE) !== 0) out += "(?i:";
        for (let rune of this.runes) out += Utils.escapeRune(rune);
        if ((this.flags & RE2Flags.FOLD_CASE) !== 0) out += ")";
        break;
      case Regexp2.Op.ANY_CHAR_NOT_NL:
        out += "(?-s:.)";
        break;
      case Regexp2.Op.ANY_CHAR:
        out += "(?s:.)";
        break;
      case Regexp2.Op.PLB:
        out += `(?<=${this.subs[0].appendTo()})`;
        break;
      case Regexp2.Op.NLB:
        out += `(?<!${this.subs[0].appendTo()})`;
        break;
      case Regexp2.Op.CAPTURE:
        if (this.name === null || this.name.length === 0) out += "(";
        else out += `(?P<${this.name}>`;
        if (this.subs[0].op !== Regexp2.Op.EMPTY_MATCH) out += this.subs[0].appendTo();
        out += ")";
        break;
      case Regexp2.Op.BEGIN_TEXT:
        out += "\\A";
        break;
      case Regexp2.Op.END_TEXT:
        if ((this.flags & RE2Flags.WAS_DOLLAR) !== 0) out += "(?-m:$)";
        else out += "\\z";
        break;
      case Regexp2.Op.BEGIN_LINE:
        out += "^";
        break;
      case Regexp2.Op.END_LINE:
        out += "$";
        break;
      case Regexp2.Op.WORD_BOUNDARY:
        out += "\\b";
        break;
      case Regexp2.Op.NO_WORD_BOUNDARY:
        out += "\\B";
        break;
      case Regexp2.Op.CHAR_CLASS:
        if (this.runes.length % 2 !== 0) {
          out += "[invalid char class]";
          break;
        }
        out += "[";
        if (this.runes.length === 0) out += "^\\x00-\\x{10FFFF}";
        else if (this.runes[0] === 0 && this.runes[this.runes.length - 1] === Unicode.MAX_RUNE) {
          out += "^";
          for (let i = 1; i < this.runes.length - 1; i += 2) {
            const lo = this.runes[i] + 1;
            const hi = this.runes[i + 1] - 1;
            out += Regexp2.quoteIfHyphen(lo);
            out += Utils.escapeRune(lo);
            if (lo !== hi) {
              out += "-";
              out += Regexp2.quoteIfHyphen(hi);
              out += Utils.escapeRune(hi);
            }
          }
        } else for (let i = 0; i < this.runes.length; i += 2) {
          const lo = this.runes[i];
          const hi = this.runes[i + 1];
          out += Regexp2.quoteIfHyphen(lo);
          out += Utils.escapeRune(lo);
          if (lo !== hi) {
            out += "-";
            out += Regexp2.quoteIfHyphen(hi);
            out += Utils.escapeRune(hi);
          }
        }
        out += "]";
        break;
      default:
        out += this.op;
        break;
    }
    return out;
  }
  maxCap() {
    let m = 0;
    if (this.op === Regexp2.Op.CAPTURE) m = this.cap;
    if (this.subs !== null) for (let sub of this.subs) {
      const n = sub.maxCap();
      if (m < n) m = n;
    }
    return m;
  }
  equals(that) {
    if (!(that !== null && that instanceof Regexp2)) return false;
    if (this.op !== that.op) return false;
    switch (this.op) {
      case Regexp2.Op.END_TEXT:
        if ((this.flags & RE2Flags.WAS_DOLLAR) !== (that.flags & RE2Flags.WAS_DOLLAR)) return false;
        break;
      case Regexp2.Op.LITERAL:
      case Regexp2.Op.CHAR_CLASS:
        if (this.runes === null && that.runes === null) break;
        if (this.runes === null || that.runes === null) return false;
        if (this.runes.length !== that.runes.length) return false;
        for (let i = 0; i < this.runes.length; i++) if (this.runes[i] !== that.runes[i]) return false;
        break;
      case Regexp2.Op.ALTERNATE:
      case Regexp2.Op.CONCAT:
        if (this.subs.length !== that.subs.length) return false;
        for (let i = 0; i < this.subs.length; ++i) if (!this.subs[i].equals(that.subs[i])) return false;
        break;
      case Regexp2.Op.STAR:
      case Regexp2.Op.PLUS:
      case Regexp2.Op.QUEST:
        if ((this.flags & RE2Flags.NON_GREEDY) !== (that.flags & RE2Flags.NON_GREEDY) || !this.subs[0].equals(that.subs[0])) return false;
        break;
      case Regexp2.Op.REPEAT:
        if ((this.flags & RE2Flags.NON_GREEDY) !== (that.flags & RE2Flags.NON_GREEDY) || this.min !== that.min || this.max !== that.max || !this.subs[0].equals(that.subs[0])) return false;
        break;
      case Regexp2.Op.CAPTURE:
        if (this.cap !== that.cap || (this.name === null ? that.name !== null : this.name !== that.name) || !this.subs[0].equals(that.subs[0])) return false;
        break;
      case Regexp2.Op.PLB:
      case Regexp2.Op.NLB:
        if (this.lb !== that.lb || !this.subs[0].equals(that.subs[0])) return false;
        break;
    }
    return true;
  }
};
var AhoCorasick = class {
  constructor(wordArrays) {
    this.next = [/* @__PURE__ */ Object.create(null)];
    this.fail = [0];
    this.match = [false];
    for (const word of wordArrays) {
      let node2 = 0;
      for (let i = 0; i < word.length; i++) {
        const val = word[i];
        if (!(val in this.next[node2])) {
          this.next.push(/* @__PURE__ */ Object.create(null));
          this.fail.push(0);
          this.match.push(false);
          this.next[node2][val] = this.next.length - 1;
        }
        node2 = this.next[node2][val];
      }
      this.match[node2] = true;
    }
    const queue = [];
    for (const val in this.next[0]) if (Object.prototype.hasOwnProperty.call(this.next[0], val)) {
      const child = this.next[0][val];
      this.fail[child] = 0;
      queue.push(child);
    }
    while (queue.length > 0) {
      const curr = queue.shift();
      for (const val in this.next[curr]) if (Object.prototype.hasOwnProperty.call(this.next[curr], val)) {
        const child = this.next[curr][val];
        let failNode = this.fail[curr];
        while (failNode !== 0 && !(val in this.next[failNode])) failNode = this.fail[failNode];
        if (val in this.next[failNode]) this.fail[child] = this.next[failNode][val];
        else this.fail[child] = 0;
        this.match[child] = this.match[child] || this.match[this.fail[child]];
        queue.push(child);
      }
    }
  }
  searchUTF16(charSeq, start, end) {
    let node2 = 0;
    for (let i = start; i < end; i++) {
      const val = charSeq.charCodeAt(i);
      while (node2 !== 0 && !(val in this.next[node2])) node2 = this.fail[node2];
      if (val in this.next[node2]) node2 = this.next[node2][val];
      if (this.match[node2]) return true;
    }
    return false;
  }
  searchUTF8(bytes, start, end) {
    let node2 = 0;
    for (let i = start; i < end; i++) {
      const val = bytes[i];
      while (node2 !== 0 && !(val in this.next[node2])) node2 = this.fail[node2];
      if (val in this.next[node2]) node2 = this.next[node2][val];
      if (this.match[node2]) return true;
    }
    return false;
  }
};
var Prefilter = class Prefilter2 {
  static Type = {
    NONE: 0,
    EXACT: 1,
    AND: 2,
    OR: 3
  };
  constructor(type) {
    this.type = type;
    this.subs = [];
    this.str = "";
    this.bytes = null;
    this.ac16 = null;
    this.ac8 = null;
  }
  eval(input, pos) {
    switch (this.type) {
      case Prefilter2.Type.NONE:
        return true;
      case Prefilter2.Type.EXACT:
        return input.hasString(this, pos);
      case Prefilter2.Type.AND:
        for (let i = 0; i < this.subs.length; i++) if (!this.subs[i].eval(input, pos)) return false;
        return true;
      case Prefilter2.Type.OR:
        if (this.ac16 && this.ac8) return input.hasAnyString(this, pos);
        for (let i = 0; i < this.subs.length; i++) if (this.subs[i].eval(input, pos)) return true;
        return false;
      default:
        return true;
    }
  }
};
var PrefilterTree = class PrefilterTree2 {
  static build(re) {
    const pf = PrefilterTree2.fromRegexp(re);
    return PrefilterTree2.simplify(pf);
  }
  static fromRegexp(re) {
    if (!re) return new Prefilter(Prefilter.Type.NONE);
    switch (re.op) {
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
      case Regexp.Op.NO_MATCH:
      case Regexp.Op.EMPTY_MATCH:
      case Regexp.Op.BEGIN_LINE:
      case Regexp.Op.END_LINE:
      case Regexp.Op.BEGIN_TEXT:
      case Regexp.Op.END_TEXT:
      case Regexp.Op.WORD_BOUNDARY:
      case Regexp.Op.NO_WORD_BOUNDARY:
      case Regexp.Op.CHAR_CLASS:
      case Regexp.Op.ANY_CHAR_NOT_NL:
      case Regexp.Op.ANY_CHAR:
        return new Prefilter(Prefilter.Type.NONE);
      case Regexp.Op.LITERAL: {
        if (re.runes.length === 0 || (re.flags & RE2Flags.FOLD_CASE) !== 0) return new Prefilter(Prefilter.Type.NONE);
        const pf = new Prefilter(Prefilter.Type.EXACT);
        let str = "";
        for (let i = 0; i < re.runes.length; i++) str += String.fromCodePoint(re.runes[i]);
        pf.str = str;
        pf.bytes = Utils.stringToUtf8ByteArray(pf.str);
        return pf;
      }
      case Regexp.Op.CAPTURE:
      case Regexp.Op.PLUS:
        return PrefilterTree2.fromRegexp(re.subs[0]);
      case Regexp.Op.REPEAT:
        if (re.min >= 1) return PrefilterTree2.fromRegexp(re.subs[0]);
        return new Prefilter(Prefilter.Type.NONE);
      case Regexp.Op.CONCAT: {
        const pf = new Prefilter(Prefilter.Type.AND);
        for (const sub of re.subs) pf.subs.push(PrefilterTree2.fromRegexp(sub));
        return pf;
      }
      case Regexp.Op.ALTERNATE: {
        const pf = new Prefilter(Prefilter.Type.OR);
        for (const sub of re.subs) pf.subs.push(PrefilterTree2.fromRegexp(sub));
        return pf;
      }
      default:
        return new Prefilter(Prefilter.Type.NONE);
    }
  }
  static simplify(pf) {
    if (pf.type === Prefilter.Type.EXACT || pf.type === Prefilter.Type.NONE) return pf;
    if (pf.type === Prefilter.Type.AND) {
      const newSubs = [];
      for (const sub of pf.subs) {
        const s = PrefilterTree2.simplify(sub);
        if (s.type !== Prefilter.Type.NONE) if (s.type === Prefilter.Type.AND) for (let j = 0; j < s.subs.length; j++) newSubs.push(s.subs[j]);
        else newSubs.push(s);
      }
      if (newSubs.length === 0) return new Prefilter(Prefilter.Type.NONE);
      if (newSubs.length === 1) return newSubs[0];
      pf.subs = newSubs;
      return pf;
    }
    if (pf.type === Prefilter.Type.OR) {
      const newSubs = [];
      for (const sub of pf.subs) {
        const s = PrefilterTree2.simplify(sub);
        if (s.type === Prefilter.Type.NONE) return new Prefilter(Prefilter.Type.NONE);
        if (s.type === Prefilter.Type.OR) for (let j = 0; j < s.subs.length; j++) newSubs.push(s.subs[j]);
        else newSubs.push(s);
      }
      if (newSubs.length === 0) return new Prefilter(Prefilter.Type.NONE);
      if (newSubs.length === 1) return newSubs[0];
      const seen = /* @__PURE__ */ new Set();
      const uniqueSubs = [];
      for (const sub of newSubs) if (sub.type === Prefilter.Type.EXACT) {
        if (!seen.has(sub.str)) {
          seen.add(sub.str);
          uniqueSubs.push(sub);
        }
      } else uniqueSubs.push(sub);
      pf.subs = uniqueSubs;
      let allExact = true;
      for (const sub of uniqueSubs) if (sub.type !== Prefilter.Type.EXACT) {
        allExact = false;
        break;
      }
      if (allExact && uniqueSubs.length > 1) {
        pf.ac16 = new AhoCorasick(uniqueSubs.map((s) => {
          const arr = [];
          for (let i = 0; i < s.str.length; i++) arr.push(s.str.charCodeAt(i));
          return arr;
        }));
        pf.ac8 = new AhoCorasick(uniqueSubs.map((s) => s.bytes));
      }
      return pf;
    }
    return pf;
  }
};
var PatchList = class {
  /**
  * @param {number} head - Encoded pointer to the start of the patch list.
  * @param {number} tail - Encoded pointer to the end of the patch list.
  */
  constructor(head = 0, tail = 0) {
    this.head = head;
    this.tail = tail;
  }
};
var Prog = class {
  constructor() {
    this.inst = [];
    this.start = 0;
    this.numCap = 2;
    this.lbStarts = [];
    this.numLb = 0;
  }
  getInst(pc) {
    return this.inst[pc];
  }
  numInst() {
    return this.inst.length;
  }
  addInst(op) {
    this.inst.push(new Inst(op));
  }
  skipNop(pc) {
    let i = this.inst[pc];
    while (i.op === Inst.NOP || i.op === Inst.CAPTURE) {
      i = this.inst[pc];
      pc = i.out;
    }
    return i;
  }
  prefix() {
    let prefix = "";
    let i = this.skipNop(this.start);
    if (!Inst.isRuneOp(i.op) || i.runes.length !== 1) return [i.op === Inst.MATCH, prefix];
    while (Inst.isRuneOp(i.op) && i.runes.length === 1 && (i.arg & RE2Flags.FOLD_CASE) === 0) {
      prefix += String.fromCodePoint(i.runes[0]);
      i = this.skipNop(i.out);
    }
    return [i.op === Inst.MATCH, prefix];
  }
  startCond() {
    let flag = 0;
    let pc = this.start;
    loop: for (; ; ) {
      const i = this.inst[pc];
      switch (i.op) {
        case Inst.EMPTY_WIDTH:
          flag |= i.arg;
          break;
        case Inst.FAIL:
          return -1;
        case Inst.CAPTURE:
        case Inst.NOP:
          break;
        default:
          break loop;
      }
      pc = i.out;
    }
    return flag;
  }
  patch(l, val) {
    let head = l.head;
    while (head !== 0) {
      const i = this.inst[head >> 1];
      if ((head & 1) === 0) {
        head = i.out;
        i.out = val;
      } else {
        head = i.arg;
        i.arg = val;
      }
    }
  }
  append(l1, l2) {
    if (l1.head === 0) return l2;
    if (l2.head === 0) return l1;
    const i = this.inst[l1.tail >> 1];
    if ((l1.tail & 1) === 0) i.out = l2.head;
    else i.arg = l2.head;
    return new PatchList(l1.head, l2.tail);
  }
  /**
  *
  * @returns {string}
  */
  toString() {
    let out = "";
    for (let pc = 0; pc < this.inst.length; pc++) {
      const len = out.length;
      out += pc;
      if (pc === this.start) out += "*";
      out += "        ".substring(out.length - len);
      out += this.inst[pc];
      out += "\n";
    }
    return out;
  }
};
var Frag = class {
  constructor(i = 0, out = new PatchList(), nullable2 = false) {
    this.i = i;
    this.out = out;
    this.nullable = nullable2;
  }
};
var Compiler = class Compiler2 {
  static ANY_RUNE_NOT_NL() {
    return [
      0,
      Codepoint.CODES.get("\n") - 1,
      Codepoint.CODES.get("\n") + 1,
      Unicode.MAX_RUNE
    ];
  }
  static ANY_RUNE() {
    return [0, Unicode.MAX_RUNE];
  }
  static compileRegexp(re) {
    const c = new Compiler2();
    const f = c.compile(re);
    c.prog.patch(f.out, c.newInst(Inst.MATCH).i);
    c.prog.start = f.i;
    return c.prog;
  }
  static compileSet(regexps) {
    const c = new Compiler2();
    if (regexps.length === 0) {
      c.prog.start = c.newInst(Inst.FAIL).i;
      return c.prog;
    }
    let starts = [];
    for (let i = 0; i < regexps.length; i++) {
      const f = c.compile(regexps[i]);
      const m = c.newInst(Inst.MATCH);
      c.prog.getInst(m.i).arg = i;
      c.prog.patch(f.out, m.i);
      starts.push(f.i);
    }
    let start = starts[0];
    for (let i = 1; i < starts.length; i++) {
      const f = c.newInst(Inst.ALT);
      const inst = c.prog.getInst(f.i);
      inst.out = start;
      inst.arg = starts[i];
      start = f.i;
    }
    c.prog.start = start;
    return c.prog;
  }
  constructor() {
    this.prog = new Prog();
    this.newInst(Inst.FAIL);
  }
  newInst(op) {
    this.prog.addInst(op);
    return new Frag(this.prog.numInst() - 1, new PatchList(), true);
  }
  nop() {
    const f = this.newInst(Inst.NOP);
    f.out = new PatchList(f.i << 1, f.i << 1);
    return f;
  }
  fail() {
    return new Frag();
  }
  cap(arg) {
    const f = this.newInst(Inst.CAPTURE);
    f.out = new PatchList(f.i << 1, f.i << 1);
    this.prog.getInst(f.i).arg = arg;
    if (this.prog.numCap < arg + 1) this.prog.numCap = arg + 1;
    return f;
  }
  cat(f1, f2) {
    if (f1.i === 0 || f2.i === 0) return this.fail();
    this.prog.patch(f1.out, f2.i);
    return new Frag(f1.i, f2.out, f1.nullable && f2.nullable);
  }
  alt(f1, f2) {
    if (f1.i === 0) return f2;
    if (f2.i === 0) return f1;
    const f = this.newInst(Inst.ALT);
    const i = this.prog.getInst(f.i);
    i.out = f1.i;
    i.arg = f2.i;
    f.out = this.prog.append(f1.out, f2.out);
    f.nullable = f1.nullable || f2.nullable;
    return f;
  }
  loop(f1, nongreedy) {
    const f = this.newInst(Inst.ALT);
    const i = this.prog.getInst(f.i);
    if (nongreedy) {
      i.arg = f1.i;
      f.out = new PatchList(f.i << 1, f.i << 1);
    } else {
      i.out = f1.i;
      f.out = new PatchList(f.i << 1 | 1, f.i << 1 | 1);
    }
    this.prog.patch(f1.out, f.i);
    return f;
  }
  quest(f1, nongreedy) {
    const f = this.newInst(Inst.ALT);
    const i = this.prog.getInst(f.i);
    if (nongreedy) {
      i.arg = f1.i;
      f.out = new PatchList(f.i << 1, f.i << 1);
    } else {
      i.out = f1.i;
      f.out = new PatchList(f.i << 1 | 1, f.i << 1 | 1);
    }
    f.out = this.prog.append(f.out, f1.out);
    return f;
  }
  star(f1, nongreedy) {
    if (f1.nullable) return this.quest(this.plus(f1, nongreedy), nongreedy);
    return this.loop(f1, nongreedy);
  }
  plus(f1, nongreedy) {
    return new Frag(f1.i, this.loop(f1, nongreedy).out, f1.nullable);
  }
  empty(op) {
    const f = this.newInst(Inst.EMPTY_WIDTH);
    this.prog.getInst(f.i).arg = op;
    f.out = new PatchList(f.i << 1, f.i << 1);
    return f;
  }
  rune(runes, flags) {
    const f = this.newInst(Inst.RUNE);
    f.nullable = false;
    const i = this.prog.getInst(f.i);
    i.runes = runes;
    flags &= RE2Flags.FOLD_CASE;
    if (runes.length !== 1 || Unicode.simpleFold(runes[0]) === runes[0]) flags &= ~RE2Flags.FOLD_CASE;
    i.arg = flags;
    f.out = new PatchList(f.i << 1, f.i << 1);
    if ((flags & RE2Flags.FOLD_CASE) === 0 && runes.length === 1 || runes.length === 2 && runes[0] === runes[1]) i.op = Inst.RUNE1;
    else if (runes.length === 2 && runes[0] === 0 && runes[1] === Unicode.MAX_RUNE) i.op = Inst.RUNE_ANY;
    else if (runes.length === 4 && runes[0] === 0 && runes[1] === Codepoint.CODES.get("\n") - 1 && runes[2] === Codepoint.CODES.get("\n") + 1 && runes[3] === Unicode.MAX_RUNE) i.op = Inst.RUNE_ANY_NOT_NL;
    return f;
  }
  lookBehind(a, lb) {
    const id = this.newInst(Inst.LB_WRITE);
    this.prog.getInst(id.i).arg = lb;
    const any = this.rune(Compiler2.ANY_RUNE(), 0);
    const dotStar = this.star(any, true);
    const lbAutomaton = this.cat(dotStar, a);
    this.prog.patch(lbAutomaton.out, id.i);
    const checkId = this.newInst(Inst.LB_CHECK);
    this.prog.getInst(checkId.i).arg = lb;
    this.prog.lbStarts.push(lbAutomaton.i);
    if (Math.abs(lb) > this.prog.numLb) this.prog.numLb = Math.abs(lb);
    checkId.out = new PatchList(checkId.i << 1, checkId.i << 1);
    return checkId;
  }
  compile(re) {
    switch (re.op) {
      case Regexp.Op.NO_MATCH:
        return this.fail();
      case Regexp.Op.EMPTY_MATCH:
        return this.nop();
      case Regexp.Op.LITERAL:
        if (re.runes.length === 0) return this.nop();
        else {
          let f = null;
          for (let r of re.runes) {
            const f1 = this.rune([r], re.flags);
            f = f === null ? f1 : this.cat(f, f1);
          }
          return f;
        }
      case Regexp.Op.CHAR_CLASS:
        return this.rune(re.runes, re.flags);
      case Regexp.Op.ANY_CHAR_NOT_NL:
        return this.rune(Compiler2.ANY_RUNE_NOT_NL(), 0);
      case Regexp.Op.ANY_CHAR:
        return this.rune(Compiler2.ANY_RUNE(), 0);
      case Regexp.Op.BEGIN_LINE:
        return this.empty(Utils.EMPTY_BEGIN_LINE);
      case Regexp.Op.END_LINE:
        return this.empty(Utils.EMPTY_END_LINE);
      case Regexp.Op.BEGIN_TEXT:
        return this.empty(Utils.EMPTY_BEGIN_TEXT);
      case Regexp.Op.END_TEXT:
        return this.empty(Utils.EMPTY_END_TEXT);
      case Regexp.Op.WORD_BOUNDARY:
        return this.empty(Utils.EMPTY_WORD_BOUNDARY);
      case Regexp.Op.NO_WORD_BOUNDARY:
        return this.empty(Utils.EMPTY_NO_WORD_BOUNDARY);
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
        return this.lookBehind(this.compile(re.subs[0]), re.lb);
      case Regexp.Op.CAPTURE: {
        const bra = this.cap(re.cap << 1);
        const sub = this.compile(re.subs[0]);
        const ket = this.cap(re.cap << 1 | 1);
        return this.cat(this.cat(bra, sub), ket);
      }
      case Regexp.Op.STAR:
        return this.star(this.compile(re.subs[0]), (re.flags & RE2Flags.NON_GREEDY) !== 0);
      case Regexp.Op.PLUS:
        return this.plus(this.compile(re.subs[0]), (re.flags & RE2Flags.NON_GREEDY) !== 0);
      case Regexp.Op.QUEST:
        return this.quest(this.compile(re.subs[0]), (re.flags & RE2Flags.NON_GREEDY) !== 0);
      case Regexp.Op.CONCAT:
        if (re.subs.length === 0) return this.nop();
        else {
          let f = null;
          for (let sub of re.subs) {
            const f1 = this.compile(sub);
            f = f === null ? f1 : this.cat(f, f1);
          }
          return f;
        }
      case Regexp.Op.ALTERNATE:
        if (re.subs.length === 0) return this.nop();
        else {
          let f = null;
          for (let sub of re.subs) {
            const f1 = this.compile(sub);
            f = f === null ? f1 : this.alt(f, f1);
          }
          return f;
        }
      default:
        throw new RE2JSCompileException("regexp: unhandled case in compile");
    }
  }
};
var Simplify = class Simplify2 {
  static simplify(re) {
    if (re === null) return null;
    switch (re.op) {
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
      case Regexp.Op.CAPTURE: {
        const sub = Simplify2.simplify(re.subs[0]);
        if (sub !== re.subs[0]) {
          const nre = Regexp.fromRegexp(re);
          nre.runes = [];
          nre.subs = [sub];
          return nre;
        }
        return re;
      }
      case Regexp.Op.CONCAT:
      case Regexp.Op.ALTERNATE: {
        const newSubs = [];
        let changed = false;
        for (let i = 0; i < re.subs.length; i++) {
          const sub = re.subs[i];
          const nsub = Simplify2.simplify(sub);
          if (nsub !== sub) changed = true;
          if (re.op === Regexp.Op.CONCAT) {
            if (nsub.op === Regexp.Op.NO_MATCH) return new Regexp(Regexp.Op.NO_MATCH);
            if (nsub.op === Regexp.Op.EMPTY_MATCH) {
              changed = true;
              continue;
            }
            if (nsub.op === Regexp.Op.CONCAT) {
              changed = true;
              for (let j = 0; j < nsub.subs.length; j++) newSubs.push(nsub.subs[j]);
              continue;
            }
          } else if (re.op === Regexp.Op.ALTERNATE) {
            if (nsub.op === Regexp.Op.NO_MATCH) {
              changed = true;
              continue;
            }
            if (nsub.op === Regexp.Op.ALTERNATE) {
              changed = true;
              for (let j = 0; j < nsub.subs.length; j++) newSubs.push(nsub.subs[j]);
              continue;
            }
          }
          newSubs.push(nsub);
        }
        if (changed) {
          if (newSubs.length === 0) return new Regexp(re.op === Regexp.Op.CONCAT ? Regexp.Op.EMPTY_MATCH : Regexp.Op.NO_MATCH);
          if (newSubs.length === 1) return newSubs[0];
          const nre = Regexp.fromRegexp(re);
          nre.runes = [];
          nre.subs = newSubs;
          return nre;
        }
        return re;
      }
      case Regexp.Op.CHAR_CLASS:
        if (re.runes === null) return re;
        if (re.runes.length === 0) return new Regexp(Regexp.Op.NO_MATCH);
        if (re.runes.length === 2 && re.runes[0] === 0 && re.runes[1] === Unicode.MAX_RUNE) return new Regexp(Regexp.Op.ANY_CHAR);
        if (re.runes.length === 4 && re.runes[0] === 0 && re.runes[1] === Codepoint.CODES.get("\n") - 1 && re.runes[2] === Codepoint.CODES.get("\n") + 1 && re.runes[3] === Unicode.MAX_RUNE) return new Regexp(Regexp.Op.ANY_CHAR_NOT_NL);
        return re;
      case Regexp.Op.STAR:
      case Regexp.Op.PLUS:
      case Regexp.Op.QUEST: {
        const sub = Simplify2.simplify(re.subs[0]);
        return Simplify2.simplify1(re.op, re.flags, sub, re);
      }
      case Regexp.Op.REPEAT: {
        if (re.min === 0 && re.max === 0) return new Regexp(Regexp.Op.EMPTY_MATCH);
        const sub = Simplify2.simplify(re.subs[0]);
        if (re.max === -1) {
          if (re.min === 0) return Simplify2.simplify1(Regexp.Op.STAR, re.flags, sub, null);
          if (re.min === 1) return Simplify2.simplify1(Regexp.Op.PLUS, re.flags, sub, null);
          const nre = new Regexp(Regexp.Op.CONCAT);
          const subs = [];
          for (let i = 0; i < re.min - 1; i++) subs.push(sub);
          subs.push(Simplify2.simplify1(Regexp.Op.PLUS, re.flags, sub, null));
          nre.subs = subs.slice(0);
          return Simplify2.simplify(nre);
        }
        if (re.min === 1 && re.max === 1) return sub;
        let prefixSubs = null;
        if (re.min > 0) {
          prefixSubs = [];
          for (let i = 0; i < re.min; i++) prefixSubs.push(sub);
        }
        if (re.max > re.min) {
          let suffix = Simplify2.simplify1(Regexp.Op.QUEST, re.flags, sub, null);
          for (let i = re.min + 1; i < re.max; i++) {
            const nre2 = new Regexp(Regexp.Op.CONCAT);
            nre2.subs = [sub, suffix];
            suffix = Simplify2.simplify1(Regexp.Op.QUEST, re.flags, nre2, null);
          }
          if (prefixSubs === null) return suffix;
          prefixSubs.push(suffix);
        }
        if (prefixSubs !== null) {
          const prefix = new Regexp(Regexp.Op.CONCAT);
          prefix.subs = prefixSubs.slice(0);
          return Simplify2.simplify(prefix);
        }
        return new Regexp(Regexp.Op.NO_MATCH);
      }
    }
    return re;
  }
  static simplify1(op, flags, sub, re) {
    if (sub.op === Regexp.Op.EMPTY_MATCH) return sub;
    if (sub.op === Regexp.Op.NO_MATCH) {
      if (op === Regexp.Op.PLUS) return sub;
      return new Regexp(Regexp.Op.EMPTY_MATCH);
    }
    if (op === sub.op && (flags & RE2Flags.NON_GREEDY) === (sub.flags & RE2Flags.NON_GREEDY)) return sub;
    if (re !== null && re.op === op && (re.flags & RE2Flags.NON_GREEDY) === (flags & RE2Flags.NON_GREEDY) && sub === re.subs[0]) return re;
    const nre = new Regexp(op);
    nre.flags = flags;
    nre.subs = [sub];
    return nre;
  }
};
var CharGroup = class {
  constructor(sign, cls) {
    this.sign = sign;
    this.cls = cls;
  }
};
var code1 = [48, 57];
var code2 = [
  9,
  10,
  12,
  13,
  32,
  32
];
var code3 = [
  48,
  57,
  65,
  90,
  95,
  95,
  97,
  122
];
var PERL_GROUPS = /* @__PURE__ */ new Map([
  ["\\d", new CharGroup(1, code1)],
  ["\\D", new CharGroup(-1, code1)],
  ["\\s", new CharGroup(1, code2)],
  ["\\S", new CharGroup(-1, code2)],
  ["\\w", new CharGroup(1, code3)],
  ["\\W", new CharGroup(-1, code3)]
]);
var code4 = [
  48,
  57,
  65,
  90,
  97,
  122
];
var code5 = [
  65,
  90,
  97,
  122
];
var code6 = [0, 127];
var code7 = [
  9,
  9,
  32,
  32
];
var code8 = [
  0,
  31,
  127,
  127
];
var code9 = [48, 57];
var code10 = [33, 126];
var code11 = [97, 122];
var code12 = [32, 126];
var code13 = [
  33,
  47,
  58,
  64,
  91,
  96,
  123,
  126
];
var code14 = [
  9,
  13,
  32,
  32
];
var code15 = [65, 90];
var code16 = [
  48,
  57,
  65,
  90,
  95,
  95,
  97,
  122
];
var code17 = [
  48,
  57,
  65,
  70,
  97,
  102
];
var POSIX_GROUPS = /* @__PURE__ */ new Map([
  ["[:alnum:]", new CharGroup(1, code4)],
  ["[:^alnum:]", new CharGroup(-1, code4)],
  ["[:alpha:]", new CharGroup(1, code5)],
  ["[:^alpha:]", new CharGroup(-1, code5)],
  ["[:ascii:]", new CharGroup(1, code6)],
  ["[:^ascii:]", new CharGroup(-1, code6)],
  ["[:blank:]", new CharGroup(1, code7)],
  ["[:^blank:]", new CharGroup(-1, code7)],
  ["[:cntrl:]", new CharGroup(1, code8)],
  ["[:^cntrl:]", new CharGroup(-1, code8)],
  ["[:digit:]", new CharGroup(1, code9)],
  ["[:^digit:]", new CharGroup(-1, code9)],
  ["[:graph:]", new CharGroup(1, code10)],
  ["[:^graph:]", new CharGroup(-1, code10)],
  ["[:lower:]", new CharGroup(1, code11)],
  ["[:^lower:]", new CharGroup(-1, code11)],
  ["[:print:]", new CharGroup(1, code12)],
  ["[:^print:]", new CharGroup(-1, code12)],
  ["[:punct:]", new CharGroup(1, code13)],
  ["[:^punct:]", new CharGroup(-1, code13)],
  ["[:space:]", new CharGroup(1, code14)],
  ["[:^space:]", new CharGroup(-1, code14)],
  ["[:upper:]", new CharGroup(1, code15)],
  ["[:^upper:]", new CharGroup(-1, code15)],
  ["[:word:]", new CharGroup(1, code16)],
  ["[:^word:]", new CharGroup(-1, code16)],
  ["[:xdigit:]", new CharGroup(1, code17)],
  ["[:^xdigit:]", new CharGroup(-1, code17)]
]);
var CharClass = class CharClass2 {
  static charClassToString(r, len) {
    let result = "[";
    for (let i = 0; i < len; i += 2) {
      if (i > 0) result += " ";
      const lo = r[i];
      const hi = r[i + 1];
      if (lo === hi) result += `0x${lo.toString(16)}`;
      else result += `0x${lo.toString(16)}-0x${hi.toString(16)}`;
    }
    result += "]";
    return result;
  }
  static cmp(array2, i, pivotFrom, pivotTo) {
    const cmp = array2[i] - pivotFrom;
    return cmp !== 0 ? cmp : pivotTo - array2[i + 1];
  }
  static qsortIntPair(array2, left, right) {
    const pivotIndex = ((left + right) / 2 | 0) & -2;
    const pivotFrom = array2[pivotIndex];
    const pivotTo = array2[pivotIndex + 1];
    let i = left;
    let j = right;
    while (i <= j) {
      while (i < right && CharClass2.cmp(array2, i, pivotFrom, pivotTo) < 0) i += 2;
      while (j > left && CharClass2.cmp(array2, j, pivotFrom, pivotTo) > 0) j -= 2;
      if (i <= j) {
        if (i !== j) {
          let temp = array2[i];
          array2[i] = array2[j];
          array2[j] = temp;
          temp = array2[i + 1];
          array2[i + 1] = array2[j + 1];
          array2[j + 1] = temp;
        }
        i += 2;
        j -= 2;
      }
    }
    if (left < j) CharClass2.qsortIntPair(array2, left, j);
    if (i < right) CharClass2.qsortIntPair(array2, i, right);
  }
  constructor(r = Utils.emptyInts()) {
    this.r = r;
    this.len = r.length;
  }
  toArray() {
    if (this.len === this.r.length) return this.r;
    else return this.r.slice(0, this.len);
  }
  cleanClass() {
    if (this.len < 4) return this;
    CharClass2.qsortIntPair(this.r, 0, this.len - 2);
    let w = 2;
    for (let i = 2; i < this.len; i += 2) {
      const lo = this.r[i];
      const hi = this.r[i + 1];
      if (lo <= this.r[w - 1] + 1) {
        if (hi > this.r[w - 1]) this.r[w - 1] = hi;
        continue;
      }
      this.r[w] = lo;
      this.r[w + 1] = hi;
      w += 2;
    }
    this.len = w;
    return this;
  }
  appendLiteral(x, flags) {
    return (flags & RE2Flags.FOLD_CASE) !== 0 ? this.appendFoldedRange(x, x) : this.appendRange(x, x);
  }
  appendRange(lo, hi) {
    if (this.len > 0) {
      for (let i = 2; i <= 4; i += 2) if (this.len >= i) {
        const rlo = this.r[this.len - i];
        const rhi = this.r[this.len - i + 1];
        if (lo <= rhi + 1 && rlo <= hi + 1) {
          if (lo < rlo) this.r[this.len - i] = lo;
          if (hi > rhi) this.r[this.len - i + 1] = hi;
          return this;
        }
      }
    }
    this.r[this.len++] = lo;
    this.r[this.len++] = hi;
    return this;
  }
  appendFoldedRange(lo, hi) {
    if (lo <= Unicode.MIN_FOLD && hi >= Unicode.MAX_FOLD) return this.appendRange(lo, hi);
    if (hi < Unicode.MIN_FOLD || lo > Unicode.MAX_FOLD) return this.appendRange(lo, hi);
    if (lo < Unicode.MIN_FOLD) {
      this.appendRange(lo, Unicode.MIN_FOLD - 1);
      lo = Unicode.MIN_FOLD;
    }
    if (hi > Unicode.MAX_FOLD) {
      this.appendRange(Unicode.MAX_FOLD + 1, hi);
      hi = Unicode.MAX_FOLD;
    }
    for (let c = lo; c <= hi; c++) {
      this.appendRange(c, c);
      for (let f = Unicode.simpleFold(c); f !== c; f = Unicode.simpleFold(f)) this.appendRange(f, f);
    }
    return this;
  }
  appendClass(x) {
    for (let i = 0; i < x.length; i += 2) this.appendRange(x[i], x[i + 1]);
    return this;
  }
  appendFoldedClass(x) {
    for (let i = 0; i < x.length; i += 2) this.appendFoldedRange(x[i], x[i + 1]);
    return this;
  }
  appendNegatedClass(x) {
    let nextLo = 0;
    for (let i = 0; i < x.length; i += 2) {
      const lo = x[i];
      const hi = x[i + 1];
      if (nextLo <= lo - 1) this.appendRange(nextLo, lo - 1);
      nextLo = hi + 1;
    }
    if (nextLo <= Unicode.MAX_RUNE) this.appendRange(nextLo, Unicode.MAX_RUNE);
    return this;
  }
  appendTable(table) {
    for (let i = 0; i < table.length; ++i) {
      const lo = table.getLo(i);
      const hi = table.getHi(i);
      const stride = table.getStride(i);
      if (stride === 1) {
        this.appendRange(lo, hi);
        continue;
      }
      for (let c = lo; c <= hi; c += stride) this.appendRange(c, c);
    }
    return this;
  }
  appendNegatedTable(table) {
    let nextLo = 0;
    for (let i = 0; i < table.length; ++i) {
      const lo = table.getLo(i);
      const hi = table.getHi(i);
      const stride = table.getStride(i);
      if (stride === 1) {
        if (nextLo <= lo - 1) this.appendRange(nextLo, lo - 1);
        nextLo = hi + 1;
        continue;
      }
      for (let c = lo; c <= hi; c += stride) {
        if (nextLo <= c - 1) this.appendRange(nextLo, c - 1);
        nextLo = c + 1;
      }
    }
    if (nextLo <= Unicode.MAX_RUNE) this.appendRange(nextLo, Unicode.MAX_RUNE);
    return this;
  }
  appendTableWithSign(table, sign) {
    return sign < 0 ? this.appendNegatedTable(table) : this.appendTable(table);
  }
  negateClass() {
    let nextLo = 0;
    let w = 0;
    for (let i = 0; i < this.len; i += 2) {
      const lo = this.r[i];
      const hi = this.r[i + 1];
      if (nextLo <= lo - 1) {
        this.r[w] = nextLo;
        this.r[w + 1] = lo - 1;
        w += 2;
      }
      nextLo = hi + 1;
    }
    this.len = w;
    if (nextLo <= Unicode.MAX_RUNE) {
      this.r[this.len++] = nextLo;
      this.r[this.len++] = Unicode.MAX_RUNE;
    }
    return this;
  }
  appendClassWithSign(x, sign) {
    return sign < 0 ? this.appendNegatedClass(x) : this.appendClass(x);
  }
  appendGroup(g, foldCase) {
    let cls = g.cls;
    if (foldCase) cls = new CharClass2().appendFoldedClass(cls).cleanClass().toArray();
    return this.appendClassWithSign(cls, g.sign);
  }
  toString() {
    return CharClass2.charClassToString(this.r, this.len);
  }
};
var StringIterator = class {
  constructor(str) {
    this.str = str;
    this.position = 0;
  }
  pos() {
    return this.position;
  }
  rewindTo(pos) {
    this.position = pos;
  }
  more() {
    return this.position < this.str.length;
  }
  peek() {
    return this.str.codePointAt(this.position);
  }
  skip(n) {
    this.position += n;
  }
  skipString(s) {
    this.position += s.length;
  }
  pop() {
    const r = this.str.codePointAt(this.position);
    this.position += Utils.charCount(r);
    return r;
  }
  lookingAt(s) {
    return this.str.startsWith(s, this.position);
  }
  rest() {
    return this.str.substring(this.position);
  }
  from(beforePos) {
    return this.str.substring(beforePos, this.position);
  }
  toString() {
    return this.rest();
  }
};
var Parser = class Parser2 {
  static ERR_INTERNAL_ERROR = "regexp/syntax: internal error";
  static ERR_INVALID_CHAR_RANGE = "invalid character class range";
  static ERR_INVALID_ESCAPE = "invalid escape sequence";
  static ERR_INVALID_NAMED_CAPTURE = "invalid named capture";
  static ERR_INVALID_PERL_OP = "invalid or unsupported Perl syntax";
  static ERR_INVALID_REPEAT_OP = "invalid nested repetition operator";
  static ERR_INVALID_REPEAT_SIZE = "invalid repeat count";
  static ERR_MISSING_BRACKET = "missing closing ]";
  static ERR_MISSING_PAREN = "missing closing )";
  static ERR_MISSING_REPEAT_ARGUMENT = "missing argument to repetition operator";
  static ERR_TRAILING_BACKSLASH = "trailing backslash at end of expression";
  static ERR_DUPLICATE_NAMED_CAPTURE = "duplicate capture group name";
  static ERR_UNEXPECTED_PAREN = "unexpected )";
  static ERR_NESTING_DEPTH = "expression nests too deeply";
  static ERR_LARGE = "expression too large";
  static ERR_INVALID_CAPTURE_IN_LOOKBEHIND = "invalid capture in lookbehind";
  static MAX_HEIGHT = 1e3;
  static MAX_SIZE = 3355443;
  static MAX_RUNES = 33554432;
  static ANY_TABLE = new UnicodeRangeTable(new Uint32Array([
    0,
    Unicode.MAX_RUNE,
    1
  ]));
  static ASCII_TABLE = new UnicodeRangeTable(new Uint32Array([
    0,
    127,
    1
  ]));
  static ASCII_FOLD_TABLE = new UnicodeRangeTable(new Uint32Array([
    0,
    127,
    1,
    383,
    383,
    1,
    8490,
    8490,
    1
  ]));
  static unicodeTable(name) {
    if (name === "Any") return {
      tab: Parser2.ANY_TABLE,
      fold: Parser2.ANY_TABLE,
      sign: 1
    };
    if (name === "Ascii") return {
      tab: Parser2.ASCII_TABLE,
      fold: Parser2.ASCII_FOLD_TABLE,
      sign: 1
    };
    if (name === "Assigned") return {
      tab: UnicodeTables.CATEGORIES.get("Cn"),
      fold: UnicodeTables.CATEGORIES.get("Cn"),
      sign: -1
    };
    if (name === "Lc") return {
      tab: UnicodeTables.CATEGORIES.get("LC"),
      fold: UnicodeTables.FOLD_CATEGORIES.get("LC"),
      sign: 1
    };
    if (UnicodeTables.CATEGORIES.has(name)) return {
      tab: UnicodeTables.CATEGORIES.get(name),
      fold: UnicodeTables.FOLD_CATEGORIES.get(name),
      sign: 1
    };
    if (UnicodeTables.SCRIPTS.has(name)) return {
      tab: UnicodeTables.SCRIPTS.get(name),
      fold: UnicodeTables.FOLD_SCRIPT.get(name),
      sign: 1
    };
    return null;
  }
  static minFoldRune(r) {
    if (r < Unicode.MIN_FOLD || r > Unicode.MAX_FOLD) return r;
    let min = r;
    const r0 = r;
    for (r = Unicode.simpleFold(r); r !== r0; r = Unicode.simpleFold(r)) if (min > r) min = r;
    return min;
  }
  static leadingRegexp(re) {
    if (re.op === Regexp.Op.EMPTY_MATCH) return null;
    if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) {
      const sub = re.subs[0];
      if (sub.op === Regexp.Op.EMPTY_MATCH) return null;
      return sub;
    }
    return re;
  }
  static literalRegexp(s, flags) {
    const re = new Regexp(Regexp.Op.LITERAL);
    re.flags = flags;
    re.runes = Utils.stringToRunes(s);
    return re;
  }
  /**
  * Parse regular expression pattern {@code pattern} with mode flags {@code flags}.
  * @param {string} pattern
  * @param {number} flags
  */
  static parse(pattern2, flags) {
    return new Parser2(pattern2, flags).parseInternal();
  }
  static parseRepeat(t) {
    const start = t.pos();
    if (!t.more() || !t.lookingAt("{")) return -1;
    t.skip(1);
    const min = Parser2.parseInt(t);
    if (min === -1) return -1;
    if (!t.more()) return -1;
    let max;
    if (!t.lookingAt(",")) max = min;
    else {
      t.skip(1);
      if (!t.more()) return -1;
      if (t.lookingAt("}")) max = -1;
      else if ((max = Parser2.parseInt(t)) === -1) return -1;
    }
    if (!t.more() || !t.lookingAt("}")) return -1;
    t.skip(1);
    if (min < 0 || min > 1e3 || max === -2 || max > 1e3 || max >= 0 && min > max) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_SIZE, t.from(start));
    return min << 16 | max & Unicode.MAX_BMP;
  }
  static isValidCaptureName(name) {
    if (name.length === 0) return false;
    for (let i = 0; i < name.length; i++) {
      const c = name.codePointAt(i);
      if (c !== Codepoint.CODES.get("_") && !Utils.isalnum(c)) return false;
    }
    return true;
  }
  static parseInt(t) {
    const start = t.pos();
    while (t.more() && t.peek() >= Codepoint.CODES.get("0") && t.peek() <= Codepoint.CODES.get("9")) t.skip(1);
    const n = t.from(start);
    if (n.length === 0 || n.length > 1 && n.codePointAt(0) === Codepoint.CODES.get("0")) return -1;
    if (n.length > 8) return -2;
    return parseInt(n, 10);
  }
  static isCharClass(re) {
    return re.op === Regexp.Op.LITERAL && re.runes.length === 1 || re.op === Regexp.Op.CHAR_CLASS || re.op === Regexp.Op.ANY_CHAR_NOT_NL || re.op === Regexp.Op.ANY_CHAR;
  }
  static matchRune(re, r) {
    switch (re.op) {
      case Regexp.Op.LITERAL:
        return re.runes.length === 1 && re.runes[0] === r;
      case Regexp.Op.CHAR_CLASS:
        for (let i = 0; i < re.runes.length; i += 2) if (re.runes[i] <= r && r <= re.runes[i + 1]) return true;
        return false;
      case Regexp.Op.ANY_CHAR_NOT_NL:
        return r !== Codepoint.CODES.get("\n");
      case Regexp.Op.ANY_CHAR:
        return true;
    }
    return false;
  }
  static mergeCharClass(dst, src) {
    switch (dst.op) {
      case Regexp.Op.ANY_CHAR:
        break;
      case Regexp.Op.ANY_CHAR_NOT_NL:
        if (Parser2.matchRune(src, Codepoint.CODES.get("\n"))) dst.op = Regexp.Op.ANY_CHAR;
        break;
      case Regexp.Op.CHAR_CLASS:
        if (src.op === Regexp.Op.LITERAL) dst.runes = new CharClass(dst.runes).appendLiteral(src.runes[0], src.flags).toArray();
        else dst.runes = new CharClass(dst.runes).appendClass(src.runes).toArray();
        break;
      case Regexp.Op.LITERAL:
        if (src.runes[0] === dst.runes[0] && src.flags === dst.flags) break;
        dst.op = Regexp.Op.CHAR_CLASS;
        dst.runes = new CharClass().appendLiteral(dst.runes[0], dst.flags).appendLiteral(src.runes[0], src.flags).toArray();
        break;
    }
  }
  static parseEscape(t) {
    const startPos = t.pos();
    t.skip(1);
    if (!t.more()) throw new RE2JSSyntaxException(Parser2.ERR_TRAILING_BACKSLASH);
    let c = t.pop();
    bigswitch: switch (c) {
      case Codepoint.CODES.get("1"):
      case Codepoint.CODES.get("2"):
      case Codepoint.CODES.get("3"):
      case Codepoint.CODES.get("4"):
      case Codepoint.CODES.get("5"):
      case Codepoint.CODES.get("6"):
      case Codepoint.CODES.get("7"):
        if (!t.more() || t.peek() < Codepoint.CODES.get("0") || t.peek() > Codepoint.CODES.get("7")) break;
      case Codepoint.CODES.get("0"): {
        let r = c - Codepoint.CODES.get("0");
        for (let i = 1; i < 3; i++) {
          if (!t.more() || t.peek() < Codepoint.CODES.get("0") || t.peek() > Codepoint.CODES.get("7")) break;
          r = r * 8 + t.peek() - Codepoint.CODES.get("0");
          t.skip(1);
        }
        return r;
      }
      case Codepoint.CODES.get("x"): {
        if (!t.more()) break;
        c = t.pop();
        if (c === Codepoint.CODES.get("{")) {
          let nhex = 0;
          let r = 0;
          while (true) {
            if (!t.more()) break bigswitch;
            c = t.pop();
            if (c === Codepoint.CODES.get("}")) break;
            const v = Utils.unhex(c);
            if (v < 0) break bigswitch;
            r = r * 16 + v;
            if (r > Unicode.MAX_RUNE) break bigswitch;
            nhex++;
          }
          if (nhex === 0) break bigswitch;
          return r;
        }
        const x = Utils.unhex(c);
        if (!t.more()) break;
        c = t.pop();
        const y = Utils.unhex(c);
        if (x < 0 || y < 0) break;
        return x * 16 + y;
      }
      case Codepoint.CODES.get("a"):
        return Codepoint.CODES.get("\x07");
      case Codepoint.CODES.get("f"):
        return Codepoint.CODES.get("\f");
      case Codepoint.CODES.get("n"):
        return Codepoint.CODES.get("\n");
      case Codepoint.CODES.get("r"):
        return Codepoint.CODES.get("\r");
      case Codepoint.CODES.get("t"):
        return Codepoint.CODES.get("	");
      case Codepoint.CODES.get("v"):
        return Codepoint.CODES.get("\v");
      default:
        if (c <= Unicode.MAX_ASCII && !Utils.isalnum(c)) return c;
        break;
    }
    throw new RE2JSSyntaxException(Parser2.ERR_INVALID_ESCAPE, t.from(startPos));
  }
  static parseClassChar(t, wholeClassPos) {
    if (!t.more()) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_BRACKET, t.from(wholeClassPos));
    if (t.lookingAt("\\")) return Parser2.parseEscape(t);
    return t.pop();
  }
  static concatRunes(x, y) {
    for (let i = 0; i < y.length; i++) x.push(y[i]);
    return x;
  }
  static hasCapture(re) {
    if (re === null) return false;
    if (re.op === Regexp.Op.CAPTURE) return true;
    if (re.subs) {
      for (let sub of re.subs) if (Parser2.hasCapture(sub)) return true;
    }
    return false;
  }
  constructor(wholeRegexp, flags = 0) {
    this.wholeRegexp = wholeRegexp;
    this.flags = flags;
    this.numCap = 0;
    this.namedGroups = /* @__PURE__ */ Object.create(null);
    this.stack = [];
    this.free = null;
    this.numRegexp = 0;
    this.numRunes = 0;
    this.repeats = 0;
    this.height = null;
    this.size = null;
    this.nlb = 0;
  }
  newRegexp(op) {
    let re = this.free;
    if (re !== null && re.subs !== null && re.subs.length > 0) {
      this.free = re.subs[0];
      re.reinit();
      re.op = op;
    } else {
      re = new Regexp(op);
      this.numRegexp += 1;
    }
    return re;
  }
  reuse(re) {
    if (this.height !== null && this.height.has(re)) this.height.delete(re);
    if (re.subs !== null && re.subs.length > 0) re.subs[0] = this.free;
    this.free = re;
  }
  checkLimits(re) {
    if (this.numRunes > Parser2.MAX_RUNES) throw new RE2JSSyntaxException(Parser2.ERR_LARGE);
    this.checkSize(re);
    this.checkHeight(re);
  }
  checkSize(re) {
    if (this.size === null) {
      if (this.repeats === 0) this.repeats = 1;
      if (re.op === Regexp.Op.REPEAT) {
        let n = re.max;
        if (n === -1) n = re.min;
        if (n <= 0) n = 1;
        if (n > Math.floor(Parser2.MAX_SIZE / this.repeats)) this.repeats = Parser2.MAX_SIZE;
        else this.repeats *= n;
      }
      if (this.numRegexp < Math.floor(Parser2.MAX_SIZE / this.repeats)) return;
      this.size = /* @__PURE__ */ new Map();
      for (let reEx of this.stack) this.checkSize(reEx);
    }
    if (this.calcSize(re, true) > Parser2.MAX_SIZE) throw new RE2JSSyntaxException(Parser2.ERR_LARGE);
  }
  calcSize(re, force = false) {
    if (!force && this.size !== null) {
      if (this.size.has(re)) return this.size.get(re);
    }
    let size = 0;
    switch (re.op) {
      case Regexp.Op.LITERAL:
        size = re.runes.length;
        break;
      case Regexp.Op.PLB:
      case Regexp.Op.NLB:
      case Regexp.Op.CAPTURE:
      case Regexp.Op.STAR:
        size = 2 + this.calcSize(re.subs[0]);
        break;
      case Regexp.Op.PLUS:
      case Regexp.Op.QUEST:
        size = 1 + this.calcSize(re.subs[0]);
        break;
      case Regexp.Op.CONCAT:
        for (let sub of re.subs) size = size + this.calcSize(sub);
        break;
      case Regexp.Op.ALTERNATE:
        for (let sub of re.subs) size = size + this.calcSize(sub);
        if (re.subs.length > 1) size = size + re.subs.length - 1;
        break;
      case Regexp.Op.REPEAT: {
        let sub = this.calcSize(re.subs[0]);
        if (re.max === -1) {
          if (re.min === 0) size = 2 + sub;
          else size = 1 + re.min * sub;
          break;
        }
        size = re.max * sub + (re.max - re.min);
        break;
      }
    }
    size = Math.max(1, size);
    if (this.size === null) this.size = /* @__PURE__ */ new Map();
    this.size.set(re, size);
    return size;
  }
  checkHeight(re) {
    if (this.numRegexp < Parser2.MAX_HEIGHT) return;
    if (this.height === null) {
      this.height = /* @__PURE__ */ new Map();
      for (let reEx of this.stack) this.checkHeight(reEx);
    }
    if (this.calcHeight(re, true) > Parser2.MAX_HEIGHT) throw new RE2JSSyntaxException(Parser2.ERR_NESTING_DEPTH);
  }
  calcHeight(re, force = false) {
    if (!force && this.height !== null) {
      if (this.height.has(re)) return this.height.get(re);
    }
    let h = 1;
    for (let sub of re.subs) {
      const hsub = this.calcHeight(sub);
      if (h < 1 + hsub) h = 1 + hsub;
    }
    if (this.height === null) this.height = /* @__PURE__ */ new Map();
    this.height.set(re, h);
    return h;
  }
  pop() {
    return this.stack.pop();
  }
  popToPseudo() {
    const n = this.stack.length;
    let i = n;
    while (i > 0 && !Regexp.isPseudoOp(this.stack[i - 1].op)) i--;
    const r = this.stack.slice(i, n);
    this.stack = this.stack.slice(0, i);
    return r;
  }
  push(re) {
    this.numRunes += re.runes.length;
    if (re.op === Regexp.Op.CHAR_CLASS && re.runes.length === 2 && re.runes[0] === re.runes[1]) {
      if (this.maybeConcat(re.runes[0], this.flags & ~RE2Flags.FOLD_CASE)) return null;
      re.op = Regexp.Op.LITERAL;
      re.runes = [re.runes[0]];
      re.flags = this.flags & ~RE2Flags.FOLD_CASE;
    } else if (re.op === Regexp.Op.CHAR_CLASS && re.runes.length === 4 && re.runes[0] === re.runes[1] && re.runes[2] === re.runes[3] && Unicode.simpleFold(re.runes[0]) === re.runes[2] && Unicode.simpleFold(re.runes[2]) === re.runes[0] || re.op === Regexp.Op.CHAR_CLASS && re.runes.length === 2 && re.runes[0] + 1 === re.runes[1] && Unicode.simpleFold(re.runes[0]) === re.runes[1] && Unicode.simpleFold(re.runes[1]) === re.runes[0]) {
      if (this.maybeConcat(re.runes[0], this.flags | RE2Flags.FOLD_CASE)) return null;
      re.op = Regexp.Op.LITERAL;
      re.runes = [re.runes[0]];
      re.flags = this.flags | RE2Flags.FOLD_CASE;
    } else this.maybeConcat(-1, 0);
    this.stack.push(re);
    this.checkLimits(re);
    return re;
  }
  maybeConcat(r, flags) {
    const n = this.stack.length;
    if (n < 2) return false;
    const re1 = this.stack[n - 1];
    const re2 = this.stack[n - 2];
    if (re1.op !== Regexp.Op.LITERAL || re2.op !== Regexp.Op.LITERAL || (re1.flags & RE2Flags.FOLD_CASE) !== (re2.flags & RE2Flags.FOLD_CASE)) return false;
    re2.runes = Parser2.concatRunes(re2.runes, re1.runes);
    if (r >= 0) {
      re1.runes = [r];
      re1.flags = flags;
      return true;
    }
    this.pop();
    this.reuse(re1);
    return false;
  }
  newLiteral(r, flags) {
    const re = this.newRegexp(Regexp.Op.LITERAL);
    re.flags = flags;
    if ((flags & RE2Flags.FOLD_CASE) !== 0) r = Parser2.minFoldRune(r);
    re.runes = [r];
    return re;
  }
  literal(r) {
    this.push(this.newLiteral(r, this.flags));
  }
  op(op) {
    const re = this.newRegexp(op);
    re.flags = this.flags;
    return this.push(re);
  }
  repeat(op, min, max, beforePos, t, lastRepeatPos) {
    let flags = this.flags;
    if ((flags & RE2Flags.PERL_X) !== 0) {
      if (t.more() && t.lookingAt("?")) {
        t.skip(1);
        flags ^= RE2Flags.NON_GREEDY;
      }
      if (lastRepeatPos !== -1) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_OP, t.from(lastRepeatPos));
    }
    const n = this.stack.length;
    if (n === 0) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos));
    const sub = this.stack[n - 1];
    if (Regexp.isPseudoOp(sub.op)) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_REPEAT_ARGUMENT, t.from(beforePos));
    const re = this.newRegexp(op);
    re.min = min;
    re.max = max;
    re.flags = flags;
    re.subs = [sub];
    this.stack[n - 1] = re;
    this.checkLimits(re);
    if (op === Regexp.Op.REPEAT && (min >= 2 || max >= 2) && !this.repeatIsValid(re, 1e3)) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_REPEAT_SIZE, t.from(beforePos));
  }
  repeatIsValid(re, n) {
    if (re.op === Regexp.Op.REPEAT) {
      let m = re.max;
      if (m === 0) return true;
      if (m < 0) m = re.min;
      if (m > n) return false;
      if (m > 0) n = Math.trunc(n / m);
    }
    for (let sub of re.subs) if (!this.repeatIsValid(sub, n)) return false;
    return true;
  }
  concat() {
    this.maybeConcat(-1, 0);
    const subs = this.popToPseudo();
    if (subs.length === 0) return this.push(this.newRegexp(Regexp.Op.EMPTY_MATCH));
    return this.push(this.collapse(subs, Regexp.Op.CONCAT));
  }
  alternate() {
    const subs = this.popToPseudo();
    if (subs.length > 0) this.cleanAlt(subs[subs.length - 1]);
    if (subs.length === 0) return this.push(this.newRegexp(Regexp.Op.NO_MATCH));
    return this.push(this.collapse(subs, Regexp.Op.ALTERNATE));
  }
  cleanAlt(re) {
    if (re.op === Regexp.Op.CHAR_CLASS) {
      re.runes = new CharClass(re.runes).cleanClass().toArray();
      if (re.runes.length === 2 && re.runes[0] === 0 && re.runes[1] === Unicode.MAX_RUNE) {
        re.runes = [];
        re.op = Regexp.Op.ANY_CHAR;
      } else if (re.runes.length === 4 && re.runes[0] === 0 && re.runes[1] === Codepoint.CODES.get("\n") - 1 && re.runes[2] === Codepoint.CODES.get("\n") + 1 && re.runes[3] === Unicode.MAX_RUNE) {
        re.runes = [];
        re.op = Regexp.Op.ANY_CHAR_NOT_NL;
      }
    }
  }
  collapse(subs, op) {
    if (subs.length === 1) return subs[0];
    let len = 0;
    for (let sub of subs) len += sub.op === op ? sub.subs.length : 1;
    let newsubs = new Array(len).fill(null);
    let i = 0;
    for (let sub of subs) if (sub.op === op) {
      for (let j = 0; j < sub.subs.length; j++) newsubs[i++] = sub.subs[j];
      this.reuse(sub);
    } else newsubs[i++] = sub;
    let re = this.newRegexp(op);
    re.subs = newsubs;
    if (op === Regexp.Op.ALTERNATE) {
      re.subs = this.factor(re.subs);
      if (re.subs.length === 1) {
        const old = re;
        re = re.subs[0];
        this.reuse(old);
      }
    }
    return re;
  }
  factor(array2) {
    if (array2.length < 2) return array2;
    let s = 0;
    let lensub = array2.length;
    let lenout = 0;
    let str = null;
    let strlen = 0;
    let strflags = 0;
    let start = 0;
    for (let i = 0; i <= lensub; i++) {
      let istr = null;
      let istrlen = 0;
      let iflags = 0;
      if (i < lensub) {
        let re = array2[s + i];
        if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) re = re.subs[0];
        if (re.op === Regexp.Op.LITERAL) {
          istr = re.runes;
          istrlen = re.runes.length;
          iflags = re.flags & RE2Flags.FOLD_CASE;
        }
        if (iflags === strflags) {
          let same = 0;
          while (same < strlen && same < istrlen && str[same] === istr[same]) same++;
          if (same > 0) {
            strlen = same;
            continue;
          }
        }
      }
      if (i === start) {
      } else if (i === start + 1) array2[lenout++] = array2[s + start];
      else {
        const prefix = this.newRegexp(Regexp.Op.LITERAL);
        prefix.flags = strflags;
        prefix.runes = str.slice(0, strlen);
        for (let j = start; j < i; j++) {
          array2[s + j] = this.removeLeadingString(array2[s + j], strlen);
          this.checkLimits(array2[s + j]);
        }
        const suffix = this.collapse(array2.slice(s + start, s + i), Regexp.Op.ALTERNATE);
        const re = this.newRegexp(Regexp.Op.CONCAT);
        re.subs = [prefix, suffix];
        array2[lenout++] = re;
      }
      start = i;
      str = istr;
      strlen = istrlen;
      strflags = iflags;
    }
    lensub = lenout;
    s = 0;
    start = 0;
    lenout = 0;
    let first = null;
    for (let i = 0; i <= lensub; i++) {
      let ifirst = null;
      if (i < lensub) {
        ifirst = Parser2.leadingRegexp(array2[s + i]);
        if (first !== null && first.equals(ifirst) && (Parser2.isCharClass(first) || first.op === Regexp.Op.REPEAT && first.min === first.max && Parser2.isCharClass(first.subs[0]))) continue;
      }
      if (i === start) {
      } else if (i === start + 1) array2[lenout++] = array2[s + start];
      else {
        const prefix = first;
        for (let j = start; j < i; j++) {
          const reuse = j !== start;
          array2[s + j] = this.removeLeadingRegexp(array2[s + j], reuse);
          this.checkLimits(array2[s + j]);
        }
        const suffix = this.collapse(array2.slice(s + start, s + i), Regexp.Op.ALTERNATE);
        const re = this.newRegexp(Regexp.Op.CONCAT);
        re.subs = [prefix, suffix];
        array2[lenout++] = re;
      }
      start = i;
      first = ifirst;
    }
    lensub = lenout;
    s = 0;
    start = 0;
    lenout = 0;
    for (let i = 0; i <= lensub; i++) {
      if (i < lensub && Parser2.isCharClass(array2[s + i])) continue;
      if (i === start) {
      } else if (i === start + 1) array2[lenout++] = array2[s + start];
      else {
        let max = start;
        for (let j = start + 1; j < i; j++) {
          const subMax = array2[s + max];
          const subJ = array2[s + j];
          if (subMax.op < subJ.op || subMax.op === subJ.op && (subMax.runes !== null ? subMax.runes.length : 0) < (subJ.runes !== null ? subJ.runes.length : 0)) max = j;
        }
        const tmp = array2[s + start];
        array2[s + start] = array2[s + max];
        array2[s + max] = tmp;
        for (let j = start + 1; j < i; j++) {
          Parser2.mergeCharClass(array2[s + start], array2[s + j]);
          this.reuse(array2[s + j]);
        }
        this.cleanAlt(array2[s + start]);
        array2[lenout++] = array2[s + start];
      }
      if (i < lensub) array2[lenout++] = array2[s + i];
      start = i + 1;
    }
    lensub = lenout;
    s = 0;
    start = 0;
    lenout = 0;
    for (let i = 0; i < lensub; ++i) {
      if (i + 1 < lensub && array2[s + i].op === Regexp.Op.EMPTY_MATCH && array2[s + i + 1].op === Regexp.Op.EMPTY_MATCH) continue;
      array2[lenout++] = array2[s + i];
    }
    lensub = lenout;
    s = 0;
    return array2.slice(s, lensub);
  }
  removeLeadingString(re, n) {
    if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) {
      const sub = this.removeLeadingString(re.subs[0], n);
      re.subs[0] = sub;
      if (sub.op === Regexp.Op.EMPTY_MATCH) {
        this.reuse(sub);
        switch (re.subs.length) {
          case 0:
          case 1:
            re.op = Regexp.Op.EMPTY_MATCH;
            re.subs = Regexp.emptySubs();
            break;
          case 2: {
            const old = re;
            re = re.subs[1];
            this.reuse(old);
            break;
          }
          default:
            re.subs = re.subs.slice(1, re.subs.length);
            break;
        }
      }
      return re;
    }
    if (re.op === Regexp.Op.LITERAL) {
      re.runes = re.runes.slice(n, re.runes.length);
      if (re.runes.length === 0) re.op = Regexp.Op.EMPTY_MATCH;
    }
    return re;
  }
  removeLeadingRegexp(re, reuse) {
    if (re.op === Regexp.Op.CONCAT && re.subs.length > 0) {
      if (reuse) this.reuse(re.subs[0]);
      re.subs = re.subs.slice(1, re.subs.length);
      switch (re.subs.length) {
        case 0:
          re.op = Regexp.Op.EMPTY_MATCH;
          re.subs = Regexp.emptySubs();
          break;
        case 1: {
          const old = re;
          re = re.subs[0];
          this.reuse(old);
          break;
        }
      }
      return re;
    }
    if (reuse) this.reuse(re);
    return this.newRegexp(Regexp.Op.EMPTY_MATCH);
  }
  parseInternal() {
    if ((this.flags & RE2Flags.LITERAL) !== 0) return Parser2.literalRegexp(this.wholeRegexp, this.flags);
    let lastRepeatPos = -1;
    let min = -1;
    let max = -1;
    const t = new StringIterator(this.wholeRegexp);
    while (t.more()) {
      let repeatPos = -1;
      bigswitch: switch (t.peek()) {
        case Codepoint.CODES.get("("):
          if ((this.flags & RE2Flags.LOOKBEHIND) !== 0) {
            if (t.lookingAt("(?<=")) {
              this.parsePosLookBehind();
              t.skip(4);
              break;
            }
            if (t.lookingAt("(?<!")) {
              this.parseNegLookBehind();
              t.skip(4);
              break;
            }
          }
          if ((this.flags & RE2Flags.PERL_X) !== 0 && t.lookingAt("(?")) {
            this.parsePerlFlags(t);
            break;
          }
          this.op(Regexp.Op.LEFT_PAREN).cap = ++this.numCap;
          t.skip(1);
          break;
        case Codepoint.CODES.get("|"):
          this.parseVerticalBar();
          t.skip(1);
          break;
        case Codepoint.CODES.get(")"):
          this.parseRightParen();
          t.skip(1);
          break;
        case Codepoint.CODES.get("^"):
          if ((this.flags & RE2Flags.ONE_LINE) !== 0) this.op(Regexp.Op.BEGIN_TEXT);
          else this.op(Regexp.Op.BEGIN_LINE);
          t.skip(1);
          break;
        case Codepoint.CODES.get("$"):
          if ((this.flags & RE2Flags.ONE_LINE) !== 0) this.op(Regexp.Op.END_TEXT).flags |= RE2Flags.WAS_DOLLAR;
          else this.op(Regexp.Op.END_LINE);
          t.skip(1);
          break;
        case Codepoint.CODES.get("."):
          if ((this.flags & RE2Flags.DOT_NL) !== 0) this.op(Regexp.Op.ANY_CHAR);
          else this.op(Regexp.Op.ANY_CHAR_NOT_NL);
          t.skip(1);
          break;
        case Codepoint.CODES.get("["):
          this.parseClass(t);
          break;
        case Codepoint.CODES.get("*"):
        case Codepoint.CODES.get("+"):
        case Codepoint.CODES.get("?"): {
          repeatPos = t.pos();
          let op = null;
          switch (t.pop()) {
            case Codepoint.CODES.get("*"):
              op = Regexp.Op.STAR;
              break;
            case Codepoint.CODES.get("+"):
              op = Regexp.Op.PLUS;
              break;
            case Codepoint.CODES.get("?"):
              op = Regexp.Op.QUEST;
              break;
          }
          this.repeat(op, min, max, repeatPos, t, lastRepeatPos);
          break;
        }
        case Codepoint.CODES.get("{"): {
          repeatPos = t.pos();
          const minMax = Parser2.parseRepeat(t);
          if (minMax < 0) {
            t.rewindTo(repeatPos);
            this.literal(t.pop());
            break;
          }
          min = minMax >> 16;
          max = (minMax & Unicode.MAX_BMP) << 16 >> 16;
          this.repeat(Regexp.Op.REPEAT, min, max, repeatPos, t, lastRepeatPos);
          break;
        }
        case Codepoint.CODES.get("\\"): {
          const savedPos = t.pos();
          t.skip(1);
          if ((this.flags & RE2Flags.PERL_X) !== 0 && t.more()) switch (t.pop()) {
            case Codepoint.CODES.get("A"):
              this.op(Regexp.Op.BEGIN_TEXT);
              break bigswitch;
            case Codepoint.CODES.get("b"):
              this.op(Regexp.Op.WORD_BOUNDARY);
              break bigswitch;
            case Codepoint.CODES.get("B"):
              this.op(Regexp.Op.NO_WORD_BOUNDARY);
              break bigswitch;
            case Codepoint.CODES.get("C"):
              throw new RE2JSSyntaxException(Parser2.ERR_INVALID_ESCAPE, "\\C");
            case Codepoint.CODES.get("Q"): {
              let lit = t.rest();
              const i = lit.indexOf("\\E");
              if (i >= 0) {
                lit = lit.substring(0, i);
                t.skipString(lit);
                t.skipString("\\E");
              } else t.skipString(lit);
              let j = 0;
              while (j < lit.length) {
                const codepoint = lit.codePointAt(j);
                this.literal(codepoint);
                j += Utils.charCount(codepoint);
              }
              break bigswitch;
            }
            case Codepoint.CODES.get("z"):
              this.op(Regexp.Op.END_TEXT);
              break bigswitch;
            default:
              t.rewindTo(savedPos);
              break;
          }
          else t.rewindTo(savedPos);
          const re = this.newRegexp(Regexp.Op.CHAR_CLASS);
          re.flags = this.flags;
          if (t.lookingAt("\\p") || t.lookingAt("\\P")) {
            const cc2 = new CharClass();
            if (this.parseUnicodeClass(t, cc2)) {
              re.runes = cc2.toArray();
              this.push(re);
              break bigswitch;
            }
          }
          const cc = new CharClass();
          if (this.parsePerlClassEscape(t, cc)) {
            re.runes = cc.toArray();
            this.push(re);
            break bigswitch;
          }
          t.rewindTo(savedPos);
          this.reuse(re);
          this.literal(Parser2.parseEscape(t));
          break;
        }
        default:
          this.literal(t.pop());
          break;
      }
      lastRepeatPos = repeatPos;
    }
    this.concat();
    if (this.swapVerticalBar()) this.pop();
    this.alternate();
    if (this.stack.length !== 1) throw new RE2JSSyntaxException(Parser2.ERR_MISSING_PAREN, this.wholeRegexp);
    this.stack[0].namedGroups = this.namedGroups;
    return this.stack[0];
  }
  parsePerlFlags(t) {
    const startPos = t.pos();
    const s = t.rest();
    if (s.startsWith("(?P<") || s.startsWith("(?<")) {
      const begin = s.charAt(2) === "P" ? 4 : 3;
      const end = s.indexOf(">");
      if (end < 0) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_NAMED_CAPTURE, s);
      const name = s.substring(begin, end);
      t.skipString(name);
      t.skip(begin + 1);
      if (!Parser2.isValidCaptureName(name)) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_NAMED_CAPTURE, s.substring(0, end + 1));
      const re = this.op(Regexp.Op.LEFT_PAREN);
      re.cap = ++this.numCap;
      if (this.namedGroups[name]) throw new RE2JSSyntaxException(Parser2.ERR_DUPLICATE_NAMED_CAPTURE, name);
      this.namedGroups[name] = this.numCap;
      re.name = name;
      return;
    }
    t.skip(2);
    let flags = this.flags;
    let sign = 1;
    let sawFlag = false;
    loop: while (t.more()) {
      const c = t.pop();
      switch (c) {
        case Codepoint.CODES.get("i"):
          flags |= RE2Flags.FOLD_CASE;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("m"):
          flags &= ~RE2Flags.ONE_LINE;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("s"):
          flags |= RE2Flags.DOT_NL;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("U"):
          flags |= RE2Flags.NON_GREEDY;
          sawFlag = true;
          break;
        case Codepoint.CODES.get("-"):
          if (sign < 0) break loop;
          sign = -1;
          flags = ~flags;
          sawFlag = false;
          break;
        case Codepoint.CODES.get(":"):
        case Codepoint.CODES.get(")"):
          if (sign < 0) {
            if (!sawFlag) break loop;
            flags = ~flags;
          }
          if (c === Codepoint.CODES.get(":")) this.op(Regexp.Op.LEFT_PAREN);
          this.flags = flags;
          return;
        default:
          break loop;
      }
    }
    throw new RE2JSSyntaxException(Parser2.ERR_INVALID_PERL_OP, t.from(startPos));
  }
  parsePosLookBehind() {
    const re = this.newRegexp(Regexp.Op.LEFT_PAREN);
    re.flags = this.flags;
    re.lb = ++this.nlb;
    return this.push(re);
  }
  parseNegLookBehind() {
    const re = this.newRegexp(Regexp.Op.LEFT_PAREN);
    re.flags = this.flags;
    re.lb = -++this.nlb;
    return this.push(re);
  }
  parseVerticalBar() {
    this.concat();
    if (!this.swapVerticalBar()) this.op(Regexp.Op.VERTICAL_BAR);
  }
  swapVerticalBar() {
    const n = this.stack.length;
    if (n >= 3 && this.stack[n - 2].op === Regexp.Op.VERTICAL_BAR && Parser2.isCharClass(this.stack[n - 1]) && Parser2.isCharClass(this.stack[n - 3])) {
      let re1 = this.stack[n - 1];
      let re3 = this.stack[n - 3];
      if (re1.op > re3.op) {
        const tmp = re3;
        re3 = re1;
        re1 = tmp;
        this.stack[n - 3] = re3;
      }
      Parser2.mergeCharClass(re3, re1);
      this.reuse(re1);
      this.pop();
      return true;
    }
    if (n >= 2) {
      const re1 = this.stack[n - 1];
      const re2 = this.stack[n - 2];
      if (re2.op === Regexp.Op.VERTICAL_BAR) {
        if (n >= 3) this.cleanAlt(this.stack[n - 3]);
        this.stack[n - 2] = re1;
        this.stack[n - 1] = re2;
        return true;
      }
    }
    return false;
  }
  parseRightParen() {
    this.concat();
    if (this.swapVerticalBar()) this.pop();
    this.alternate();
    if (this.stack.length < 2) throw new RE2JSSyntaxException(Parser2.ERR_UNEXPECTED_PAREN, this.wholeRegexp);
    const re1 = this.pop();
    const re2 = this.pop();
    if (re2.op !== Regexp.Op.LEFT_PAREN) throw new RE2JSSyntaxException(Parser2.ERR_UNEXPECTED_PAREN, this.wholeRegexp);
    this.flags = re2.flags;
    if (re2.lb !== 0) {
      if (Parser2.hasCapture(re1)) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CAPTURE_IN_LOOKBEHIND, this.wholeRegexp);
      if (re2.lb > 0) re2.op = Regexp.Op.PLB;
      else re2.op = Regexp.Op.NLB;
      re2.subs = [re1];
      this.push(re2);
      return;
    }
    if (re2.cap === 0) this.push(re1);
    else {
      re2.op = Regexp.Op.CAPTURE;
      re2.subs = [re1];
      this.push(re2);
    }
  }
  parsePerlClassEscape(t, cc) {
    const beforePos = t.pos();
    if ((this.flags & RE2Flags.PERL_X) === 0 || !t.more() || t.pop() !== Codepoint.CODES.get("\\") || !t.more()) return false;
    t.pop();
    const p = t.from(beforePos);
    const g = PERL_GROUPS.has(p) ? PERL_GROUPS.get(p) : null;
    if (g === null) return false;
    cc.appendGroup(g, (this.flags & RE2Flags.FOLD_CASE) !== 0);
    return true;
  }
  parseNamedClass(t, cc) {
    const cls = t.rest();
    const i = cls.indexOf(":]");
    if (i < 0) return false;
    const name = cls.substring(0, i + 2);
    t.skipString(name);
    const g = POSIX_GROUPS.has(name) ? POSIX_GROUPS.get(name) : null;
    if (g === null) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, name);
    cc.appendGroup(g, (this.flags & RE2Flags.FOLD_CASE) !== 0);
    return true;
  }
  parseUnicodeClass(t, cc) {
    const startPos = t.pos();
    if ((this.flags & RE2Flags.UNICODE_GROUPS) === 0 || !t.lookingAt("\\p") && !t.lookingAt("\\P")) return false;
    t.skip(1);
    let sign = 1;
    let c = t.pop();
    if (c === Codepoint.CODES.get("P")) sign = -1;
    if (!t.more()) {
      t.rewindTo(startPos);
      throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.rest());
    }
    c = t.pop();
    let name;
    if (c !== Codepoint.CODES.get("{")) name = Utils.runeToString(c);
    else {
      const rest = t.rest();
      const end = rest.indexOf("}");
      if (end < 0) {
        t.rewindTo(startPos);
        throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.rest());
      }
      name = rest.substring(0, end);
      t.skipString(name);
      t.skip(1);
    }
    if (!(name.length === 0) && name.codePointAt(0) === Codepoint.CODES.get("^")) {
      sign = 0 - sign;
      name = name.substring(1);
    }
    const pair = Parser2.unicodeTable(name);
    if (pair === null) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.from(startPos));
    if (pair.sign < 0) sign = 0 - sign;
    const tab = pair.tab;
    const fold = pair.fold;
    if ((this.flags & RE2Flags.FOLD_CASE) === 0 || fold === null) cc.appendTableWithSign(tab, sign);
    else {
      const tmp = new CharClass().appendTable(tab).appendTable(fold).cleanClass().toArray();
      cc.appendClassWithSign(tmp, sign);
    }
    return true;
  }
  parseClass(t) {
    const startPos = t.pos();
    t.skip(1);
    const re = this.newRegexp(Regexp.Op.CHAR_CLASS);
    re.flags = this.flags;
    const cc = new CharClass();
    let sign = 1;
    if (t.more() && t.lookingAt("^")) {
      sign = -1;
      t.skip(1);
      if ((this.flags & RE2Flags.CLASS_NL) === 0) cc.appendRange(Codepoint.CODES.get("\n"), Codepoint.CODES.get("\n"));
    }
    let first = true;
    while (!t.more() || t.peek() !== Codepoint.CODES.get("]") || first) {
      if (t.more() && t.lookingAt("-") && (this.flags & RE2Flags.PERL_X) === 0 && !first) {
        const s = t.rest();
        if (s === "-" || !s.startsWith("-]")) {
          t.rewindTo(startPos);
          throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.rest());
        }
      }
      first = false;
      const beforePos = t.pos();
      if (t.lookingAt("[:")) {
        if (this.parseNamedClass(t, cc)) continue;
        t.rewindTo(beforePos);
      }
      if (this.parseUnicodeClass(t, cc)) continue;
      if (this.parsePerlClassEscape(t, cc)) continue;
      t.rewindTo(beforePos);
      const lo = Parser2.parseClassChar(t, startPos);
      let hi = lo;
      if (t.more() && t.lookingAt("-")) {
        t.skip(1);
        if (t.more() && t.lookingAt("]")) t.skip(-1);
        else {
          hi = Parser2.parseClassChar(t, startPos);
          if (hi < lo) throw new RE2JSSyntaxException(Parser2.ERR_INVALID_CHAR_RANGE, t.from(beforePos));
        }
      }
      if ((this.flags & RE2Flags.FOLD_CASE) === 0) cc.appendRange(lo, hi);
      else cc.appendFoldedRange(lo, hi);
    }
    t.skip(1);
    cc.cleanClass();
    if (sign < 0) cc.negateClass();
    re.runes = cc.toArray();
    this.push(re);
  }
};
var RE2 = class RE22 {
  static initTest(expr) {
    const re2 = RE22.compile(expr);
    const res = new RE22(re2.expr, re2.prog, re2.numSubexp, re2.longest);
    res.cond = re2.cond;
    res.prefix = re2.prefix;
    res.prefixUTF8 = re2.prefixUTF8;
    res.prefixComplete = re2.prefixComplete;
    res.prefixRune = re2.prefixRune;
    res.prefilter = re2.prefilter;
    return res;
  }
  /**
  * Parses a regular expression and returns, if successful, an {@code RE2} instance that can be
  * used to match against text.
  *
  * When matching against text, the regexp returns a match that begins as early as possible in the
  * input (leftmost), and among those it chooses the one that a backtracking search would have
  * found first. This so-called leftmost-first matching is the same semantics that Perl, Python,
  * and other implementations use, although this package implements it without the expense of
  * backtracking. For POSIX leftmost-longest matching, see {@link #compilePOSIX}.
  */
  static compile(expr) {
    return RE22.compileImpl(expr, RE2Flags.PERL, false);
  }
  /**
  * {@code compilePOSIX} is like {@link #compile} but restricts the regular expression to POSIX ERE
  * (egrep) syntax and changes the match semantics to leftmost-longest.
  *
  * That is, when matching against text, the regexp returns a match that begins as early as
  * possible in the input (leftmost), and among those it chooses a match that is as long as
  * possible. This so-called leftmost-longest matching is the same semantics that early regular
  * expression implementations used and that POSIX specifies.
  *
  * However, there can be multiple leftmost-longest matches, with different submatch choices, and
  * here this package diverges from POSIX. Among the possible leftmost-longest matches, this
  * package chooses the one that a backtracking search would have found first, while POSIX
  * specifies that the match be chosen to maximize the length of the first subexpression, then the
  * second, and so on from left to right. The POSIX rule is computationally prohibitive and not
  * even well-defined. See http://swtch.com/~rsc/regexp/regexp2.html#posix
  */
  static compilePOSIX(expr) {
    return RE22.compileImpl(expr, RE2Flags.POSIX, true);
  }
  static compileImpl(expr, mode, longest) {
    let re = Parser.parse(expr, mode);
    const maxCap = re.maxCap();
    re = Simplify.simplify(re);
    const prefilter = PrefilterTree.build(re);
    const prog = Compiler.compileRegexp(re);
    const re2 = new RE22(expr, prog, maxCap, longest);
    re2.prefilter = prefilter.type === Prefilter.Type.NONE ? null : prefilter;
    const [prefixCompl, prefixStr] = prog.prefix();
    re2.prefixComplete = prefixCompl;
    re2.prefix = prefixStr;
    re2.prefixUTF8 = Utils.stringToUtf8ByteArray(re2.prefix);
    if (re2.prefix.length > 0) re2.prefixRune = re2.prefix.codePointAt(0);
    re2.namedGroups = re.namedGroups;
    return re2;
  }
  /**
  * Returns true iff textual regular expression {@code pattern} matches string {@code s}.
  *
  * More complicated queries need to use {@link #compile} and the full {@code RE2} interface.
  */
  static match(pattern2, s) {
    return RE22.compile(pattern2).match(s);
  }
  constructor(expr, prog, numSubexp = 0, longest = 0) {
    this.expr = expr;
    this.prog = prog;
    this.numSubexp = numSubexp;
    this.longest = longest;
    this.cond = prog.startCond();
    this.prefix = null;
    this.prefixUTF8 = null;
    this.prefixComplete = false;
    this.prefixRune = 0;
    this.machinePool = [];
    this.dfa = new DFA(this.prog);
    this.onepass = OnePass.compile(this.prog);
    this.prefilter = null;
  }
  matchPrefixComplete(input, pos, anchor2, ncap) {
    if ((anchor2 === RE2Flags.ANCHOR_START || anchor2 === RE2Flags.ANCHOR_BOTH) && pos !== 0) return null;
    let matchStart = -1;
    let matchEnd = -1;
    const pLen = input.prefixLength(this);
    if (anchor2 === RE2Flags.UNANCHORED) {
      const idx = input.index(this, pos);
      if (idx < 0) return null;
      matchStart = pos + idx;
      matchEnd = matchStart + pLen;
    } else if (anchor2 === RE2Flags.ANCHOR_BOTH) {
      if (input.endPos() !== pLen) return null;
      if (input.index(this, 0) !== 0) return null;
      matchStart = 0;
      matchEnd = pLen;
    } else if (anchor2 === RE2Flags.ANCHOR_START) {
      if (input.index(this, 0) !== 0) return null;
      matchStart = 0;
      matchEnd = pLen;
    }
    if (matchStart < 0) return null;
    if (ncap > 0) {
      const matchcap = new Int32Array(ncap).fill(-1);
      matchcap[0] = matchStart;
      matchcap[1] = matchEnd;
      return Array.from(matchcap);
    }
    return [];
  }
  executeEngine(input, pos, anchor2, ncap) {
    if (this.prefixComplete && (ncap === 0 || this.numSubexp === 0)) return this.matchPrefixComplete(input, pos, anchor2, ncap);
    if (this.prefilter !== null && anchor2 === RE2Flags.UNANCHORED) {
      if (!this.prefilter.eval(input, pos)) return null;
    }
    if (this.onepass !== null) return OnePass.execute(this, input, pos, anchor2, ncap);
    if (ncap > 0) {
      if (this.prog.numLb === 0 && input.endPos() <= Backtracker.maxBitStateLen(this.prog)) return Backtracker.execute(this, input, pos, anchor2, ncap);
      return this.doExecuteNFA(input, pos, anchor2, ncap);
    }
    if (this.prog.numLb === 0) {
      const dfaResult = this.dfa.match(input, pos, anchor2);
      if (dfaResult !== null) return dfaResult ? [] : null;
      if (input.endPos() <= Backtracker.maxBitStateLen(this.prog)) return Backtracker.execute(this, input, pos, anchor2, ncap);
    }
    return this.doExecuteNFA(input, pos, anchor2, ncap);
  }
  /**
  * Returns the number of parenthesized subexpressions in this regular expression.
  */
  numberOfCapturingGroups() {
    return this.numSubexp;
  }
  /**
  * Returns the number of instructions in this compiled regular expression program.
  */
  numberOfInstructions() {
    return this.prog.numInst();
  }
  get() {
    return this.machinePool.length > 0 ? this.machinePool.pop() : null;
  }
  reset() {
    this.machinePool.length = 0;
  }
  put(m) {
    this.machinePool.push(m);
  }
  toString() {
    return this.expr;
  }
  doExecuteNFA(input, pos, anchor2, ncap) {
    let m = this.get();
    if (!m) m = Machine.fromRE2(this);
    m.init(ncap);
    const cap = m.match(input, pos, anchor2) ? m.submatches() : null;
    this.put(m);
    return cap;
  }
  match(s) {
    return this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, 0) !== null;
  }
  /**
  * Matches the regular expression against input starting at position start and ending at position
  * end, with the given anchoring. Records the submatch boundaries in group, which is [start, end)
  * pairs of byte offsets. The number of boundaries needed is inferred from the size of the group
  * array. It is most efficient not to ask for submatch boundaries.
  *
  * @param input the input byte array
  * @param start the beginning position in the input
  * @param end the end position in the input
  * @param anchor the anchoring flag (UNANCHORED, ANCHOR_START, ANCHOR_BOTH)
  * @param group the array to fill with submatch positions
  * @param ngroup the number of array pairs to fill in
  * @returns true if a match was found
  */
  matchWithGroup(input, start, end, anchor2, ngroup) {
    if (!(input instanceof MatcherInputBase)) if (Utils.isByteArray(input)) input = MatcherInput.utf8(input);
    else input = MatcherInput.utf16(input);
    return this.matchMachineInput(input, start, end, anchor2, ngroup);
  }
  matchMachineInput(input, start, end, anchor2, ngroup) {
    if (start > end) return [false, null];
    const machineInput = input.isUTF16Encoding() ? MachineInput.fromUTF16(input.asCharSequence(), 0, end) : MachineInput.fromUTF8(input.asBytes(), 0, end);
    const groupMatch = this.executeEngine(machineInput, start, anchor2, 2 * ngroup);
    if (groupMatch === null) return [false, null];
    return [true, groupMatch];
  }
  /**
  * Returns true iff this regexp matches the UTF-8 byte array {@code b}.
  */
  matchUTF8(b) {
    return this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, 0) !== null;
  }
  /**
  * Returns a copy of {@code src} in which all matches for this regexp have been replaced by
  * {@code repl}. No support is provided for expressions (e.g. {@code \1} or {@code $1}) in the
  * replacement string.
  */
  replaceAll(src, repl) {
    return this.replaceAllFunc(src, () => repl, 2 * src.length + 1);
  }
  /**
  * Returns a copy of {@code src} in which only the first match for this regexp has been replaced
  * by {@code repl}. No support is provided for expressions (e.g. {@code \1} or {@code $1}) in the
  * replacement string.
  */
  replaceFirst(src, repl) {
    return this.replaceAllFunc(src, () => repl, 1);
  }
  /**
  * Returns a copy of {@code src} in which at most {@code maxReplaces} matches for this regexp have
  * been replaced by the return value of of function {@code repl} (whose first argument is the
  * matched string). No support is provided for expressions (e.g. {@code \1} or {@code $1}) in the
  * replacement string.
  */
  replaceAllFunc(src, replFunc, maxReplaces) {
    let lastMatchEnd = 0;
    let searchPos = 0;
    let out = "";
    const input = MachineInput.fromUTF16(src);
    let numReplaces = 0;
    while (searchPos <= src.length) {
      const a = this.executeEngine(input, searchPos, RE2Flags.UNANCHORED, 2);
      if (a === null || a.length === 0) break;
      out += src.substring(lastMatchEnd, a[0]);
      if (a[1] > lastMatchEnd || a[0] === 0) {
        out += replFunc(src.substring(a[0], a[1]));
        numReplaces++;
      }
      lastMatchEnd = a[1];
      const width = input.step(searchPos) & 7;
      if (searchPos + width > a[1]) searchPos += width;
      else if (searchPos + 1 > a[1]) searchPos++;
      else searchPos = a[1];
      if (numReplaces >= maxReplaces) break;
    }
    out += src.substring(lastMatchEnd);
    return out;
  }
  pad(a) {
    if (a === null) return null;
    let n = (1 + this.numSubexp) * 2;
    if (a.length < n) {
      let a2 = new Array(n).fill(-1);
      for (let i = 0; i < a.length; i++) a2[i] = a[i];
      a = a2;
    }
    return a;
  }
  allMatches(input, n, deliverFun = (v) => v) {
    let result = [];
    const end = input.endPos();
    if (n < 0) n = end + 1;
    let pos = 0;
    let i = 0;
    let prevMatchEnd = -1;
    while (i < n && pos <= end) {
      const matches = this.executeEngine(input, pos, RE2Flags.UNANCHORED, this.prog.numCap);
      if (matches === null || matches.length === 0) break;
      let accept = true;
      if (matches[1] === pos) {
        if (matches[0] === prevMatchEnd) accept = false;
        const r = input.step(pos);
        if (r < 0) pos = end + 1;
        else pos += r & 7;
      } else pos = matches[1];
      prevMatchEnd = matches[1];
      if (accept) {
        result.push(deliverFun(this.pad(matches)));
        i++;
      }
    }
    return result;
  }
  /**
  * Returns an array holding the text of the leftmost match in {@code b} of this regular
  * expression.
  *
  * A return value of null indicates no match.
  */
  findUTF8(b) {
    const a = this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, 2);
    if (a === null) return null;
    return b.slice(a[0], a[1]);
  }
  /**
  * Returns a two-element array of integers defining the location of the leftmost match in
  * {@code b} of this regular expression. The match itself is at {@code b[loc[0]...loc[1]]}.
  *
  * A return value of null indicates no match.
  */
  findUTF8Index(b) {
    const a = this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, 2);
    if (a === null) return null;
    return a.slice(0, 2);
  }
  /**
  * Returns a string holding the text of the leftmost match in {@code s} of this regular
  * expression.
  *
  * If there is no match, the return value is an empty string, but it will also be empty if the
  * regular expression successfully matches an empty string. Use {@link #findIndex} or
  * {@link #findSubmatch} if it is necessary to distinguish these cases.
  */
  find(s) {
    const a = this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, 2);
    if (a === null) return "";
    return s.substring(a[0], a[1]);
  }
  /**
  * Returns a two-element array of integers defining the location of the leftmost match in
  * {@code s} of this regular expression. The match itself is at
  * {@code s.substring(loc[0], loc[1])}.
  *
  * A return value of null indicates no match.
  */
  findIndex(s) {
    return this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, 2);
  }
  /**
  * Returns an array of arrays the text of the leftmost match of the regular expression in
  * {@code b} and the matches, if any, of its subexpressions, as defined by the <a
  * href='#submatch'>Submatch</a> description above.
  *
  * A return value of null indicates no match.
  */
  findUTF8Submatch(b) {
    const a = this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, this.prog.numCap);
    if (a === null) return null;
    const ret = new Array(1 + this.numSubexp).fill(null);
    for (let i = 0; i < ret.length; i++) if (2 * i < a.length && a[2 * i] >= 0) ret[i] = b.slice(a[2 * i], a[2 * i + 1]);
    return ret;
  }
  /**
  * Returns an array holding the index pairs identifying the leftmost match of this regular
  * expression in {@code b} and the matches, if any, of its subexpressions, as defined by the the
  * <a href='#submatch'>Submatch</a> and <a href='#index'>Index</a> descriptions above.
  *
  * A return value of null indicates no match.
  */
  findUTF8SubmatchIndex(b) {
    return this.pad(this.executeEngine(MachineInput.fromUTF8(b), 0, RE2Flags.UNANCHORED, this.prog.numCap));
  }
  /**
  * Returns an array of strings holding the text of the leftmost match of the regular expression in
  * {@code s} and the matches, if any, of its subexpressions, as defined by the <a
  * href='#submatch'>Submatch</a> description above.
  *
  * A return value of null indicates no match.
  */
  findSubmatch(s) {
    const a = this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, this.prog.numCap);
    if (a === null) return null;
    const ret = new Array(1 + this.numSubexp).fill(null);
    for (let i = 0; i < ret.length; i++) if (2 * i < a.length && a[2 * i] >= 0) ret[i] = s.substring(a[2 * i], a[2 * i + 1]);
    return ret;
  }
  /**
  * Returns an array holding the index pairs identifying the leftmost match of this regular
  * expression in {@code s} and the matches, if any, of its subexpressions, as defined by the <a
  * href='#submatch'>Submatch</a> description above.
  *
  * A return value of null indicates no match.
  */
  findSubmatchIndex(s) {
    return this.pad(this.executeEngine(MachineInput.fromUTF16(s), 0, RE2Flags.UNANCHORED, this.prog.numCap));
  }
  /**
  * {@code findAllUTF8()} is the <a href='#all'>All</a> version of {@link #findUTF8}; it returns a
  * list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  *
  * TODO(adonovan): think about defining a byte slice view class, like a read-only Go slice backed
  * by |b|.
  */
  findAllUTF8(b, n) {
    const result = this.allMatches(MachineInput.fromUTF8(b), n, (match) => b.slice(match[0], match[1]));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllUTF8Index} is the <a href='#all'>All</a> version of {@link #findUTF8Index}; it
  * returns a list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllUTF8Index(b, n) {
    const result = this.allMatches(MachineInput.fromUTF8(b), n, (match) => match.slice(0, 2));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAll} is the <a href='#all'>All</a> version of {@link #find}; it returns a list of up
  * to {@code n} successive matches of the expression, as defined by the <a href='#all'>All</a>
  * description above.
  *
  * A return value of null indicates no match.
  */
  findAll(s, n) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n, (match) => s.substring(match[0], match[1]));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllIndex} is the <a href='#all'>All</a> version of {@link #findIndex}; it returns a
  * list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllIndex(s, n) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n, (match) => match.slice(0, 2));
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllUTF8Submatch} is the <a href='#all'>All</a> version of {@link #findUTF8Submatch};
  * it returns a list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllUTF8Submatch(b, n) {
    const result = this.allMatches(MachineInput.fromUTF8(b), n, (match) => {
      let slice = new Array(match.length / 2 | 0).fill(null);
      for (let j = 0; j < slice.length; j++) if (match[2 * j] >= 0) slice[j] = b.slice(match[2 * j], match[2 * j + 1]);
      return slice;
    });
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllUTF8SubmatchIndex} is the <a href='#all'>All</a> version of
  * {@link #findUTF8SubmatchIndex}; it returns a list of up to {@code n} successive matches of the
  * expression, as defined by the <a href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllUTF8SubmatchIndex(b, n) {
    const result = this.allMatches(MachineInput.fromUTF8(b), n);
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllSubmatch} is the <a href='#all'>All</a> version of {@link #findSubmatch}; it
  * returns a list of up to {@code n} successive matches of the expression, as defined by the <a
  * href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllSubmatch(s, n) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n, (match) => {
      let slice = new Array(match.length / 2 | 0).fill(null);
      for (let j = 0; j < slice.length; j++) if (match[2 * j] >= 0) slice[j] = s.substring(match[2 * j], match[2 * j + 1]);
      return slice;
    });
    if (result.length === 0) return null;
    return result;
  }
  /**
  * {@code findAllSubmatchIndex} is the <a href='#all'>All</a> version of
  * {@link #findSubmatchIndex}; it returns a list of up to {@code n} successive matches of the
  * expression, as defined by the <a href='#all'>All</a> description above.
  *
  * A return value of null indicates no match.
  */
  findAllSubmatchIndex(s, n) {
    const result = this.allMatches(MachineInput.fromUTF16(s), n);
    if (result.length === 0) return null;
    return result;
  }
};
var RE2Set = class RE2Set2 {
  /** @type {number} */
  static UNANCHORED = RE2Flags.UNANCHORED;
  /** @type {number} */
  static ANCHOR_START = RE2Flags.ANCHOR_START;
  /** @type {number} */
  static ANCHOR_BOTH = RE2Flags.ANCHOR_BOTH;
  /**
  * Constructs a new RE2Set with the specified anchor mode and flags.
  * @param {number} [anchor=RE2Set.UNANCHORED] - The anchoring mode (e.g., RE2Set.UNANCHORED).
  * @param {number} [flags=0] - The public flags to apply to all patterns in the set.
  * @param {number} [maxMem=8388608] - The maximum memory in bytes to use for the DFA (default 8MB).
  */
  constructor(anchor2 = RE2Set2.UNANCHORED, flags = 0, maxMem = 8388608) {
    this.anchor = anchor2;
    this.jsFlags = flags;
    this.maxMem = maxMem;
    let re2Flags = RE2Flags.PERL;
    if ((flags & PublicFlags.DISABLE_UNICODE_GROUPS) !== 0) re2Flags &= ~RE2Flags.UNICODE_GROUPS;
    if ((flags & PublicFlags.LOOKBEHINDS) !== 0) re2Flags |= RE2Flags.LOOKBEHIND;
    this.re2Flags = re2Flags;
    this.regexps = [];
    this.prog = null;
    this.dfa = null;
    this.dummyRe2 = null;
  }
  /**
  * Adds a new regular expression pattern to the set.
  * Patterns cannot be added after the set has been compiled.
  * @param {string} pattern - The regular expression pattern to add.
  * @returns {number} The integer index assigned to the added pattern.
  * @throws {RE2JSCompileException} If patterns are added after compilation.
  */
  add(pattern2) {
    if (this.prog) throw new RE2JSCompileException("Cannot add patterns after compile");
    let fregex = pattern2;
    if ((this.jsFlags & PublicFlags.CASE_INSENSITIVE) !== 0) fregex = `(?i)${fregex}`;
    if ((this.jsFlags & PublicFlags.DOTALL) !== 0) fregex = `(?s)${fregex}`;
    if ((this.jsFlags & PublicFlags.MULTILINE) !== 0) fregex = `(?m)${fregex}`;
    const re = Parser.parse(fregex, this.re2Flags);
    this.regexps.push(Simplify.simplify(re));
    return this.regexps.length - 1;
  }
  /**
  * Compiles the added patterns into a single state machine.
  * This is automatically called on the first match if not called explicitly.
  * @returns {void}
  */
  compile() {
    if (this.prog) return;
    this.prog = Compiler.compileSet(this.regexps);
    this.dfa = new DFA(this.prog, this.maxMem);
    this.dummyRe2 = {
      prog: this.prog,
      cond: this.prog.startCond(),
      prefix: "",
      prefixRune: 0,
      longest: false
    };
  }
  /**
  * Matches the input against the compiled set of regular expressions.
  * @param {string|number[]|Uint8Array} input - The input string or UTF-8 byte array to match against.
  * @returns {number[]} An array of indices representing the patterns that successfully matched the input.
  */
  match(input) {
    if (!this.prog) this.compile();
    const machineInput = Utils.isByteArray(input) ? MachineInput.fromUTF8(input) : MachineInput.fromUTF16(input);
    let internalAnchor = RE2Flags.UNANCHORED;
    if (this.anchor === RE2Set2.ANCHOR_START) internalAnchor = RE2Flags.ANCHOR_START;
    else if (this.anchor === RE2Set2.ANCHOR_BOTH) internalAnchor = RE2Flags.ANCHOR_BOTH;
    const dfaResult = this.dfa.matchSet(machineInput, 0, internalAnchor);
    if (dfaResult !== null) return dfaResult;
    const machine = Machine.fromRE2(this.dummyRe2);
    machine.init(0);
    return machine.matchSet(machineInput, 0, internalAnchor);
  }
};
var TranslateRegExpString = class TranslateRegExpString2 {
  static isHexadecimal(ch) {
    return "0" <= ch && ch <= "9" || "A" <= ch && ch <= "F" || "a" <= ch && ch <= "f";
  }
  static translate(data) {
    let prefixFlags = "";
    if (data instanceof RegExp) {
      if (data.ignoreCase) prefixFlags += "i";
      if (data.multiline) prefixFlags += "m";
      if (data.dotAll) prefixFlags += "s";
      data = data.source;
    }
    if (typeof data !== "string") return data;
    let result = "";
    let changed = false;
    let size = data.length;
    if (size === 0) {
      result = "(?:)";
      changed = true;
    }
    let inCharClass = false;
    let i = 0;
    while (i < size) {
      let ch = data[i];
      if (ch === "\\") {
        if (i + 1 < size) {
          ch = data[i + 1];
          switch (ch) {
            case "\\":
              result += "\\\\";
              i += 2;
              continue;
            case "c":
              if (i + 2 < size) {
                let code = data[i + 2].charCodeAt(0);
                if (code >= 65 && code <= 90 || code >= 97 && code <= 122) {
                  let val = code % 32;
                  result += "\\x";
                  result += (val >> 4).toString(16).toUpperCase();
                  result += (val & 15).toString(16).toUpperCase();
                  i += 3;
                  changed = true;
                  continue;
                }
              }
              result += "c";
              i += 2;
              changed = true;
              continue;
            case "u":
              if (i + 2 < size) {
                if (data[i + 2] === "{") {
                  let j = i + 3;
                  let hasHex = false;
                  let closed = false;
                  while (j < size) {
                    const hexChar = data[j];
                    if (hexChar === "}") {
                      closed = true;
                      break;
                    }
                    if (!TranslateRegExpString2.isHexadecimal(hexChar)) break;
                    hasHex = true;
                    j++;
                  }
                  if (closed && hasHex) {
                    result += "\\x";
                    i += 2;
                    changed = true;
                    continue;
                  }
                } else if (i + 5 < size) {
                  let isHex4 = true;
                  for (let j = 0; j < 4; j++) if (!TranslateRegExpString2.isHexadecimal(data[i + 2 + j])) {
                    isHex4 = false;
                    break;
                  }
                  if (isHex4) {
                    result += "\\x{" + data.substring(i + 2, i + 6) + "}";
                    i += 6;
                    changed = true;
                    continue;
                  }
                }
              }
              result += "u";
              i += 2;
              changed = true;
              continue;
            case "x": {
              let isValidHex = false;
              if (i + 2 < size && data[i + 2] === "{") {
                let j = i + 3;
                let hasHex = false;
                let closed = false;
                while (j < size) {
                  const hexChar = data[j];
                  if (hexChar === "}") {
                    closed = true;
                    break;
                  }
                  if (!TranslateRegExpString2.isHexadecimal(hexChar)) break;
                  hasHex = true;
                  j++;
                }
                if (closed && hasHex) isValidHex = true;
              } else if (i + 3 < size && TranslateRegExpString2.isHexadecimal(data[i + 2]) && TranslateRegExpString2.isHexadecimal(data[i + 3])) isValidHex = true;
              if (isValidHex) {
                result += "\\x";
                i += 2;
              } else {
                result += "x";
                i += 2;
                changed = true;
              }
              continue;
            }
            case "n":
            case "r":
            case "t":
            case "a":
            case "f":
            case "v":
            case "d":
            case "D":
            case "s":
            case "S":
            case "w":
            case "W":
            case "b":
            case "B":
            case "p":
            case "P":
            case "A":
            case "z":
            case "Q":
            case "E":
            case "0":
            case "1":
            case "2":
            case "3":
            case "4":
            case "5":
            case "6":
            case "7":
              result += "\\" + ch;
              i += 2;
              continue;
            default: {
              let cp2 = data.codePointAt(i + 1);
              if (cp2 >= 48 && cp2 <= 57 || cp2 >= 65 && cp2 <= 90 || cp2 >= 97 && cp2 <= 122) {
                let symSize2 = Utils.charCount(cp2);
                result += data.substring(i + 1, i + 1 + symSize2);
                i += symSize2 + 1;
                changed = true;
              } else {
                result += "\\";
                let symSize2 = Utils.charCount(cp2);
                result += data.substring(i + 1, i + 1 + symSize2);
                i += symSize2 + 1;
              }
              continue;
            }
          }
        }
      } else if (ch === "/") {
        result += "\\/";
        i += 1;
        changed = true;
        continue;
      } else if (ch === "[") inCharClass = true;
      else if (ch === "]") inCharClass = false;
      else if (!inCharClass && ch === "(" && i + 2 < size && data[i + 1] === "?" && data[i + 2] === "<") {
        if (i + 3 < size && !"=!>)".includes(data[i + 3])) {
          result += "(?P<";
          i += 3;
          changed = true;
          continue;
        }
      }
      let cp = data.codePointAt(i);
      let symSize = Utils.charCount(cp);
      result += data.substring(i, i + symSize);
      i += symSize;
    }
    const finalResult = changed ? result : data;
    if (prefixFlags.length > 0) return `(?${prefixFlags})${finalResult}`;
    return finalResult;
  }
};
var RE2JS = class RE2JS2 {
  /**
  * Flag: case insensitive matching.
  */
  static CASE_INSENSITIVE = PublicFlags.CASE_INSENSITIVE;
  /**
  * Flag: dot ({@code .}) matches all characters, including newline.
  */
  static DOTALL = PublicFlags.DOTALL;
  /**
  * Flag: multiline matching: {@code ^} and {@code $} match at beginning and end of line, not just
  * beginning and end of input.
  */
  static MULTILINE = PublicFlags.MULTILINE;
  /**
  * Flag: Unicode groups (e.g. {@code \p\ Greek\} ) will be syntax errors.
  */
  static DISABLE_UNICODE_GROUPS = PublicFlags.DISABLE_UNICODE_GROUPS;
  /**
  * Flag: matches longest possible string.
  */
  static LONGEST_MATCH = PublicFlags.LONGEST_MATCH;
  /**
  * Flag: enable linear-time captureless lookbehinds.
  */
  static LOOKBEHINDS = PublicFlags.LOOKBEHINDS;
  /**
  * Returns a literal pattern string for the specified string.
  *
  * This method produces a string that can be used to create a <code>RE2JS</code> that would
  * match the string <code>s</code> as if it were a literal pattern.
  *
  * Metacharacters or escape sequences in the input sequence will be given no special meaning.
  *
  * @param {string} str The string to be literalized
  * @returns {string} A literal string replacement
  */
  static quote(str) {
    return Utils.quoteMeta(str);
  }
  /**
  * Quotes '\' and '$' in {@code str}, so that the returned string could be used in
  * replacement methods as a literal replacement of {@code str}.
  *
  * This is a convenience delegation to {@link Matcher.quoteReplacement}.
  *
  * @param {string} str the string to be quoted
  * @param {boolean} [javaMode=false] whether the replacement will be used in javaMode
  * @returns {string} the quoted string
  */
  static quoteReplacement(str, javaMode = false) {
    return Matcher.quoteReplacement(str, javaMode);
  }
  /**
  * Translates a given regular expression string to ensure compatibility with RE2JS.
  *
  * This function preprocesses the input regex string by applying necessary transformations,
  * such as escaping special characters (e.g., `/`), converting named capture groups to
  * RE2JS-compatible syntax, and handling Unicode sequences properly. It ensures that the
  * resulting regex is safe and properly formatted before compilation.
  *
  * @param {string|RegExp} expr - The regular expression string to be translated.
  * @returns {string} - The transformed regular expression string, ready for compilation.
  */
  static translateRegExp(expr) {
    return TranslateRegExpString.translate(expr);
  }
  /**
  * Helper: create new RE2JS with given regex and flags. Flregex is the regex with flags applied.
  * @param {string} regex
  * @param {number} [flags=0]
  * @returns {RE2JS}
  */
  static compile(regex, flags = 0) {
    let fregex = regex;
    if ((flags & RE2JS2.CASE_INSENSITIVE) !== 0) fregex = `(?i)${fregex}`;
    if ((flags & RE2JS2.DOTALL) !== 0) fregex = `(?s)${fregex}`;
    if ((flags & RE2JS2.MULTILINE) !== 0) fregex = `(?m)${fregex}`;
    if ((flags & ~(RE2JS2.MULTILINE | RE2JS2.DOTALL | RE2JS2.CASE_INSENSITIVE | RE2JS2.DISABLE_UNICODE_GROUPS | RE2JS2.LONGEST_MATCH | RE2JS2.LOOKBEHINDS)) !== 0) throw new RE2JSFlagsException("Flags should only be a combination of MULTILINE, DOTALL, CASE_INSENSITIVE, DISABLE_UNICODE_GROUPS, LONGEST_MATCH, LOOKBEHINDS");
    let re2Flags = RE2Flags.PERL;
    if ((flags & RE2JS2.DISABLE_UNICODE_GROUPS) !== 0) re2Flags &= ~RE2Flags.UNICODE_GROUPS;
    if ((flags & RE2JS2.LOOKBEHINDS) !== 0) re2Flags |= RE2Flags.LOOKBEHIND;
    const p = new RE2JS2(regex, flags);
    p.re2Input = RE2.compileImpl(fregex, re2Flags, (flags & RE2JS2.LONGEST_MATCH) !== 0);
    return p;
  }
  /**
  * Matches a string against a regular expression.
  *
  * @param {string} regex the regular expression
  * @param {string|number[]|Uint8Array} input the input
  * @returns {boolean} true if the regular expression matches the entire input
  * @throws RE2JSSyntaxException if the regular expression is malformed
  */
  static matches(regex, input) {
    return RE2JS2.compile(regex).testExact(input);
  }
  /**
  * This is visible for testing.
  * @private
  */
  static initTest(pattern2, flags, re2) {
    if (pattern2 == null) throw new Error("pattern is null");
    if (re2 == null) throw new Error("re2 is null");
    const p = new RE2JS2(pattern2, flags);
    p.re2Input = re2;
    return p;
  }
  /**
  *
  * @param {string} pattern
  * @param {number} flags
  */
  constructor(pattern2, flags) {
    this.patternInput = pattern2;
    this.flagsInput = flags;
    this.re2Input = null;
  }
  /**
  * Releases memory used by internal caches associated with this pattern. Does not change the
  * observable behaviour. Useful for tests that detect memory leaks via allocation tracking.
  */
  reset() {
    this.re2Input.reset();
  }
  /**
  * Returns the flags used in the constructor.
  * @returns {number}
  */
  flags() {
    return this.flagsInput;
  }
  /**
  * Returns the pattern used in the constructor.
  * @returns {string}
  */
  pattern() {
    return this.patternInput;
  }
  re2() {
    return this.re2Input;
  }
  /**
  * Matches a string against a regular expression.
  *
  * @param {string|number[]|Uint8Array} input the input
  * @returns {boolean} true if the regular expression matches the entire input
  */
  matches(input) {
    return this.testExact(input);
  }
  /**
  * Creates a new {@code Matcher} matching the pattern against the input.
  *
  * @param {string|number[]|Uint8Array|MatcherInputBase} input the input string
  * @returns {Matcher}
  */
  matcher(input) {
    if (Utils.isByteArray(input)) input = MatcherInput.utf8(input);
    return new Matcher(this, input);
  }
  /**
  * Tests whether the regular expression matches any part of the input string.
  * Performance Note: This method is highly optimized. Because it only returns
  * a boolean and does not extract capture groups, it bypasses the `Matcher` overhead
  * and guarantees execution on the high-speed DFA engine whenever possible.
  *
  * @param {string|number[]|Uint8Array} input - The input string or UTF-8 byte array to test against.
  * @returns {boolean} `true` if the pattern is found anywhere in the input, `false` otherwise.
  */
  test(input) {
    if (Utils.isByteArray(input)) return this.re2Input.matchUTF8(input);
    return this.re2Input.match(input);
  }
  /**
  * Tests whether the regular expression matches the ENTIRE input string.
  * * **Performance Note:** This operates identically to `.matches()`, but is significantly
  * faster because it does not request capture group data. By requesting 0 capture groups,
  * it securely routes execution through the DFA fast-path.
  *
  * @param {string|number[]|Uint8Array} input - The input string or UTF-8 byte array to test against.
  * @returns {boolean} `true` if the exact input string fully matches the pattern, `false` otherwise.
  */
  testExact(input) {
    const machineInput = Utils.isByteArray(input) ? MachineInput.fromUTF8(input) : MachineInput.fromUTF16(input);
    return this.re2Input.executeEngine(machineInput, 0, RE2Flags.ANCHOR_BOTH, 0) !== null;
  }
  /**
  * Executes a search for a match in a specified string.
  * Returns a result array, or null if no match is found.
  * The returned array perfectly mirrors standard JavaScript `RegExpExecArray`,
  * including `.index`, `.input`, and `.groups` properties.
  *
  * @param {string|number[]|Uint8Array} input the input string or byte array
  * @returns {Array|null} the match array with index, input, and groups properties, or null
  */
  exec(input) {
    const m = this.matcher(input);
    if (!m.find()) return null;
    const result = [m.group(0)];
    for (let i = 1; i <= m.groupCount(); i++) {
      const val = m.group(i);
      result.push(val === null ? void 0 : val);
    }
    result.index = m.start(0);
    result.input = input;
    const namedGroups = this.namedGroups();
    if (Object.keys(namedGroups).length > 0) {
      const parsedGroups = m.getNamedGroups();
      for (const key in parsedGroups) if (parsedGroups[key] === null) parsedGroups[key] = void 0;
      result.groups = parsedGroups;
    } else result.groups = void 0;
    return result;
  }
  /**
  * Splits input around instances of the regular expression. It returns an array giving the strings
  * that occur before, between, and after instances of the regular expression.
  *
  * If {@code limit <= 0}, there is no limit on the size of the returned array. If
  * {@code limit == 0}, empty strings that would occur at the end of the array are omitted. If
  * {@code limit > 0}, at most limit strings are returned. The final string contains the remainder
  * of the input, possibly including additional matches of the pattern.
  *
  * @param {string} input the input string to be split
  * @param {number} [limit=0] the limit
  * @returns {string[]} the split strings
  */
  split(input, limit = 0) {
    const m = this.matcher(input);
    const result = [];
    let emptiesSkipped = 0;
    let last = 0;
    while (m.find()) {
      if (last === 0 && m.end() === 0) {
        last = m.end();
        continue;
      }
      if (limit > 0 && result.length === limit - 1) break;
      if (last === m.start()) {
        if (limit === 0) {
          emptiesSkipped += 1;
          last = m.end();
          continue;
        }
      } else while (emptiesSkipped > 0) {
        result.push("");
        emptiesSkipped -= 1;
      }
      result.push(m.substring(last, m.start()));
      last = m.end();
    }
    if (limit === 0 && last !== m.inputLength()) {
      while (emptiesSkipped > 0) {
        result.push("");
        emptiesSkipped -= 1;
      }
      result.push(m.substring(last, m.inputLength()));
    }
    if (limit !== 0 || result.length === 0 && !(last === m.inputLength() && last > 0)) result.push(m.substring(last, m.inputLength()));
    return result;
  }
  /**
  * Returns an iterator of all results matching a string against the regular expression,
  * including capturing groups.
  *
  * @param {string|number[]|Uint8Array} input the input string or byte array
  * @returns {IterableIterator<RegExpMatchArray>}
  */
  *matchAll(input) {
    const m = this.matcher(input);
    while (m.find()) {
      const result = [m.group(0)];
      for (let i = 1; i <= m.groupCount(); i++) {
        const groupVal = m.group(i);
        result.push(groupVal === null ? void 0 : groupVal);
      }
      result.index = m.start(0);
      result.input = input;
      const namedGroups = this.namedGroups();
      if (Object.keys(namedGroups).length > 0) {
        const parsedGroups = m.getNamedGroups();
        for (const key in parsedGroups) if (parsedGroups[key] === null) parsedGroups[key] = void 0;
        result.groups = parsedGroups;
      } else result.groups = void 0;
      yield result;
    }
  }
  /**
  *
  * @returns {string}
  */
  toString() {
    return this.patternInput;
  }
  /**
  * Returns the program size of this pattern.
  *
  * <p>
  * Similar to the C++ implementation, the program size is a very approximate measure of a regexp's
  * "cost". Larger numbers are more expensive than smaller numbers.
  * </p>
  *
  * @returns {number} the program size of this pattern
  */
  programSize() {
    return this.re2Input.numberOfInstructions();
  }
  /**
  * Returns the number of capturing groups in this matcher's pattern. Group zero denotes the entire
  * pattern and is excluded from this count.
  *
  * @returns {number} the number of capturing groups in this pattern
  */
  groupCount() {
    return this.re2Input.numberOfCapturingGroups();
  }
  /**
  * Return a map of the capturing groups in this matcher's pattern, where key is the name and value
  * is the index of the group in the pattern.
  * @returns {Record<string, number>}
  */
  namedGroups() {
    return this.re2Input.namedGroups;
  }
  /**
  *
  * @param {*} other
  * @returns {boolean}
  */
  equals(other) {
    if (this === other) return true;
    if (other === null || this.constructor !== other.constructor) return false;
    return this.flagsInput === other.flagsInput && this.patternInput === other.patternInput;
  }
};

// src/mcp/functions/common.ts
function isThenable(value) {
  return typeof value === "object" && value !== null && typeof value.then === "function";
}
function asyncable(schema) {
  return external_exports.union([schema, external_exports.custom(isThenable)]);
}
function isPlainObject2(value) {
  if (typeof value !== "object" || value === null || Array.isArray(value)) {
    return false;
  }
  const proto = Object.getPrototypeOf(value);
  return proto === Object.prototype || proto === null;
}
function settleDeep(value) {
  if (isThenable(value)) {
    return Promise.resolve(value).then(settleDeep);
  }
  if (Array.isArray(value)) {
    const items = value.map(settleDeep);
    return items.some(isThenable) ? Promise.all(items) : value;
  }
  if (isPlainObject2(value)) {
    const entries = Object.entries(value).map(([key, item]) => [key, settleDeep(item)]);
    if (!entries.some(([, item]) => isThenable(item))) {
      return value;
    }
    return Promise.all(entries.map(([, item]) => item)).then(
      (settled) => Object.fromEntries(entries.map(([key], i) => [key, settled[i]]))
    );
  }
  return value;
}
function withSettledArgs(args, body) {
  const settled = settleDeep(args);
  return isThenable(settled) ? Promise.resolve(settled).then((value) => body(value)) : body(settled);
}
var MAX_CACHED_PATTERNS = 100;
var compiledPatterns = /* @__PURE__ */ new Map();
function pattern(source, fn) {
  let compiled = compiledPatterns.get(source);
  if (!compiled) {
    try {
      compiled = RE2JS.compile(source);
    } catch (error2) {
      throw new A2uiExpressionError2(
        `Invalid RE2 pattern '${source}': ${error2 instanceof Error ? error2.message : error2}`,
        fn,
        error2
      );
    }
    if (compiledPatterns.size >= MAX_CACHED_PATTERNS) {
      const oldestKey = compiledPatterns.keys().next().value;
      if (oldestKey !== void 0) {
        compiledPatterns.delete(oldestKey);
      }
    }
    compiledPatterns.set(source, compiled);
  }
  return compiled;
}
function overValue(value, fn) {
  const asText = (item) => String(item ?? "");
  return Array.isArray(value) ? value.map((item) => fn(asText(item))) : fn(asText(value));
}

// src/mcp/functions/jmespath.ts
var JmespathApi = {
  name: "jmespath",
  returnType: "any",
  schema: external_exports.object({
    expression: asyncable(external_exports.any()).describe(
      "A standard JMESPath expression evaluated against `data`."
    ),
    data: asyncable(external_exports.any()).describe("The input data to evaluate the expression against.")
  })
};
var JmespathImplementation = createFunctionImplementation2(
  JmespathApi,
  (args, context) => {
    const document2 = resolveDynamicValueDeep(args["data"], context);
    const expression = resolveDynamicValueDeep(args["expression"], context);
    return withSettledArgs({ expression, data: document2 }, (settled) => {
      const expr = settled["expression"];
      if (typeof expr !== "string") {
        const kind = expr === null ? "null" : Array.isArray(expr) ? "an array" : `a ${typeof expr}`;
        throw new A2uiExpressionError3(
          `jmespath expects a string expression, got ${kind}.`,
          "jmespath"
        );
      }
      try {
        return (0, import_jmespath.search)(
          settled["data"] ?? null,
          expr
        );
      } catch (error2) {
        throw new A2uiExpressionError3(
          `${error2 instanceof Error ? error2.message : String(error2)} in JMESPath expression: ${expr}`,
          "jmespath",
          error2
        );
      }
    });
  }
);

// src/mcp/functions/regexCapture.ts
import { createFunctionImplementation as createFunctionImplementation3 } from "@a2ui/web_core/v0_9";
var RegexCaptureApi = {
  name: "regexCapture",
  returnType: "any",
  schema: external_exports.object({
    value: asyncable(external_exports.any()).describe("The string or array of strings to match against."),
    pattern: asyncable(external_exports.any()).describe(
      "An RE2 regular expression. Returns an array of capture groups from the first match, or null if there is no match. Unmatched optional groups return empty strings."
    )
  })
};
var RegexCaptureImplementation = createFunctionImplementation3(
  RegexCaptureApi,
  (args) => withSettledArgs(args, (settled) => {
    const compiled = pattern(String(settled["pattern"] ?? ""), "regexCapture");
    return overValue(settled["value"], (item) => {
      const matcher = compiled.matcher(item);
      if (!matcher.find()) {
        return null;
      }
      const groups = [];
      for (let i = 1; i <= matcher.groupCount(); i++) {
        groups.push(matcher.group(i) ?? "");
      }
      return groups;
    });
  })
);

// src/mcp/functions/regexReplace.ts
import { createFunctionImplementation as createFunctionImplementation4 } from "@a2ui/web_core/v0_9";
var RegexReplaceApi = {
  name: "regexReplace",
  returnType: "any",
  schema: external_exports.object({
    value: asyncable(external_exports.any()).describe(
      "The string or array of strings to perform replacements on."
    ),
    pattern: asyncable(external_exports.any()).describe(
      "An RE2 regular expression matching substrings to replace."
    ),
    replacement: asyncable(external_exports.any()).describe(
      "Literal replacement string. Capture group references like $1 are treated as literal text."
    )
  })
};
var RegexReplaceImplementation = createFunctionImplementation4(
  RegexReplaceApi,
  (args) => withSettledArgs(args, (settled) => {
    const compiled = pattern(String(settled["pattern"] ?? ""), "regexReplace");
    const replacement = RE2JS.quoteReplacement(String(settled["replacement"] ?? ""));
    return overValue(settled["value"], (item) => compiled.matcher(item).replaceAll(replacement));
  })
);

// src/mcp/functions/split.ts
import { createFunctionImplementation as createFunctionImplementation5 } from "@a2ui/web_core/v0_9";
var SplitApi = {
  name: "split",
  returnType: "any",
  schema: external_exports.object({
    value: asyncable(external_exports.any()).describe("The string or array of strings to split."),
    separator: asyncable(external_exports.any()).describe(
      "The delimiter string to split on. An empty string splits into individual characters."
    )
  })
};
var SplitImplementation = createFunctionImplementation5(
  SplitApi,
  (args) => withSettledArgs(args, (settled) => {
    const separator = String(settled["separator"] ?? "");
    return overValue(settled["value"], (item) => item.split(separator));
  })
);

// src/mcp/functions/updateDataModel.ts
import {
  A2uiExpressionError as A2uiExpressionError4,
  createFunctionImplementation as createFunctionImplementation6
} from "@a2ui/web_core/v0_9";
var UpdateDataModelApi = {
  name: "updateDataModel",
  returnType: "any",
  schema: external_exports.object({
    updates: asyncable(external_exports.any()).describe(
      'An object mapping data model paths to the values to write (e.g., {"/entries": [...], "/title": "Home"}). Paths starting with "/" are absolute; relative paths resolve against the current data context.'
    )
  })
};
var UpdateDataModelImplementation = createFunctionImplementation6(
  UpdateDataModelApi,
  (args, context) => {
    const requested = resolveDynamicValueDeep(args["updates"], context);
    return withSettledArgs({ updates: requested }, (settled) => {
      const updates = settled["updates"];
      if (updates === null || updates === void 0) {
        return;
      }
      if (typeof updates !== "object" || Array.isArray(updates)) {
        const kind = Array.isArray(updates) ? "an array" : `a ${typeof updates}`;
        throw new A2uiExpressionError4(
          `updateDataModel expects an object of data model paths, got ${kind}.`,
          "updateDataModel"
        );
      }
      for (const [path, value] of Object.entries(updates)) {
        context.set(
          path,
          typeof value === "object" && value !== null ? structuredClone(value) : value
        );
      }
    });
  }
);

// src/mcp/index.ts
var MCP_CATALOG_ID = "https://a2ui.org/specification/v0_9/catalogs/mcp/mcp_catalog.json";
var DATA_FUNCTION_APIS = [
  JmespathApi,
  SplitApi,
  RegexCaptureApi,
  RegexReplaceApi,
  UpdateDataModelApi
];
var DATA_FUNCTIONS = [
  JmespathImplementation,
  SplitImplementation,
  RegexCaptureImplementation,
  RegexReplaceImplementation,
  UpdateDataModelImplementation
];
function createMcpCatalogFunctions(first, second) {
  if (typeof first === "function") {
    return [
      createCallMcpToolImplementation(first, second),
      ...DATA_FUNCTIONS
    ];
  }
  return [
    createCallMcpToolImplementation(second, first),
    ...DATA_FUNCTIONS
  ];
}

// src/iframe-mcp-client.ts
var IframeMcpClient = class {
  constructor(sendMcpRequest, timeoutMs = 3e4) {
    this.sendMcpRequest = sendMcpRequest;
    this.timeoutMs = timeoutMs;
    this.pendingRequests = /* @__PURE__ */ new Map();
  }
  async callTool(params) {
    const requestId = typeof crypto !== "undefined" && typeof crypto.randomUUID === "function" ? crypto.randomUUID() : `mcp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pendingRequests.delete(requestId);
        reject(new Error(`MCP tool call "${params.name}" timed out after ${this.timeoutMs}ms`));
      }, this.timeoutMs);
      this.pendingRequests.set(requestId, { resolve, reject, timer });
      this.sendMcpRequest({
        requestId,
        toolName: params.name,
        args: params.arguments ?? {}
      });
    });
  }
  handleResponse(payload) {
    const pending = this.pendingRequests.get(payload.requestId);
    if (!pending) {
      return;
    }
    clearTimeout(pending.timer);
    this.pendingRequests.delete(payload.requestId);
    if (payload.error) {
      pending.reject(new Error(payload.error));
    } else {
      pending.resolve(payload.result);
    }
  }
};

// src/surface-resize-observer.ts
var SurfaceResizeObserver = class {
  constructor(onResize) {
    this.onResize = onResize;
    this.lastKnownHeight = null;
    this.lastKnownWidth = null;
    this.init();
  }
  /**
   * Initializes window resize listeners and DOM element observers.
   */
  init() {
    if (typeof window === "undefined") return;
    if (!this.windowViewportResizeListener) {
      this.windowViewportResizeListener = () => this.measureAndDispatch();
      window.addEventListener("resize", this.windowViewportResizeListener);
    }
    if (typeof document !== "undefined" && document.readyState === "loading") {
      if (!this.domContentLoadedListener) {
        this.domContentLoadedListener = () => {
          this.setupDomElementObservers();
          this.measureAndDispatch();
          this.domContentLoadedListener = void 0;
        };
        document.addEventListener("DOMContentLoaded", this.domContentLoadedListener, { once: true });
      }
      return;
    }
    this.setupDomElementObservers();
  }
  setupDomElementObservers() {
    if (typeof ResizeObserver === "undefined") return;
    if (!this.domResizeObserver) {
      this.domResizeObserver = new ResizeObserver(() => {
        this.measureAndDispatch();
      });
    }
    if (typeof document !== "undefined") {
      if (document.body) {
        this.domResizeObserver.observe(document.body);
      }
      if (document.documentElement && document.documentElement !== document.body) {
        this.domResizeObserver.observe(document.documentElement);
      }
    }
  }
  /**
   * Measures current scroll and offset dimensions of document body/documentElement,
   * dispatching a callback only if dimensions have changed since last measurement (or if forced).
   */
  measureAndDispatch(force = false) {
    if (typeof document === "undefined") return;
    const body = document.body;
    const docEl = document.documentElement;
    const height = Math.max(
      body?.scrollHeight || 0,
      body?.offsetHeight || 0,
      docEl?.offsetHeight || 0
    );
    const width = Math.max(body?.scrollWidth || 0, body?.offsetWidth || 0, docEl?.offsetWidth || 0);
    if (height <= 0) return;
    if (force || height !== this.lastKnownHeight || width !== this.lastKnownWidth) {
      this.lastKnownHeight = height;
      this.lastKnownWidth = width;
      this.onResize({ height, width });
    }
  }
  /**
   * Cleans up observers, window listeners, and resets cached dimensions.
   */
  destroy() {
    if (this.domResizeObserver) {
      this.domResizeObserver.disconnect();
      this.domResizeObserver = void 0;
    }
    if (this.windowViewportResizeListener) {
      if (typeof window !== "undefined") {
        window.removeEventListener("resize", this.windowViewportResizeListener);
      }
      this.windowViewportResizeListener = void 0;
    }
    if (this.domContentLoadedListener) {
      if (typeof document !== "undefined") {
        document.removeEventListener("DOMContentLoaded", this.domContentLoadedListener);
      }
      this.domContentLoadedListener = void 0;
    }
    this.lastKnownHeight = null;
    this.lastKnownWidth = null;
  }
};

// src/preview-bridge.ts
var ERROR_OVERLAY_DEBOUNCE_MS = 350;
function isErrorLike(val) {
  if (val instanceof Error || Object.prototype.toString.call(val) === "[object Error]") {
    return true;
  }
  return typeof val === "object" && val !== null && "message" in val && typeof val["message"] === "string" && "stack" in val && typeof val["stack"] === "string" && !("nodeType" in val) && !("component" in val);
}
function safeSerialize(val) {
  function sanitize(v, seen) {
    if (typeof v === "bigint") return `${v.toString()}n`;
    if (v !== null && typeof v === "object") {
      if (seen.has(v)) return "[Circular]";
      seen.add(v);
      let result;
      if (isErrorLike(v)) {
        result = {
          name: v.name || "Error",
          message: v.message,
          stack: v.stack
        };
      } else if ("nodeType" in v && v["nodeType"] === 1 && typeof v["tagName"] === "string") {
        result = `[Element: <${v["tagName"].toLowerCase()}>]`;
      } else if (Array.isArray(v)) {
        result = v.map((curr) => sanitize(curr, seen));
      } else {
        const objResult = {};
        for (const k of Object.keys(v)) {
          objResult[k] = sanitize(v[k], seen);
        }
        result = objResult;
      }
      seen.delete(v);
      return result;
    }
    return v;
  }
  try {
    const res = JSON.stringify(sanitize(val, /* @__PURE__ */ new WeakSet()));
    return res === void 0 ? "undefined" : res;
  } catch {
    return "[Unserializable]";
  }
}
var PreviewBridge = class {
  /**
   * Initializes a new PreviewBridge instance.
   * Sets up the global window message listener, observes layout dimensions, and applies initial theme from URL if present.
   */
  constructor() {
    /** The single active framework rendering stack connection hook. */
    this.activeRenderer = null;
    /** Indicates whether the bridge is actively listening for incoming messages. */
    this.isListening = false;
    /**
     * A reference to the dynamically injected blocking overlay element in the DOM, or null if no overlay is active.
     * Used to prevent user interaction and display status messages during layout processing.
     */
    this.overlayElement = null;
    /** The registry of active framework surface connections currently linked and managed by the bridge. */
    this.activeConnections = /* @__PURE__ */ new Set();
    /** Handles DOM mutations and window viewport resizing to broadcast dimension updates to the host. */
    this.surfaceResizeObserver = new SurfaceResizeObserver((dimensions) => {
      this.sendMessage({
        type: "SURFACE_RESIZE" /* SURFACE_RESIZE */,
        payload: dimensions
      });
    });
    this.cachedParentOrigin = null;
    /** Cached iframe MCP proxy client. */
    this.mcpClient = null;
    /**
     * Event listener callback for the incoming messages from the Shell.
     *
     * Safely filters messages to ensure they originate from the same window or the parent window,
     * and dispatches incoming messaging events to specialized static methods.
     *
     * @param event The raw window message event.
     */
    this.messageListener = (event) => {
      if (!DomainOriginVerificationService.verifyStrictOrigin(event.origin, event.source, window.parent))
        return;
      const data = event.data;
      if (!data || typeof data !== "object" || !data.type) return;
      switch (data.type) {
        case "SET_BLOCKING_STATE" /* SET_BLOCKING_STATE */:
          this.handleSetBlockingState(data.payload);
          break;
        case "DATA_MODEL_CHANGE" /* DATA_MODEL_CHANGE */:
          this.handleIncomingDataModelChange(data.payload);
          break;
        case "RENDER_A2UI" /* RENDER_A2UI */:
          this.dispatchRenderA2ui(
            data.payload !== void 0 ? data.payload : data,
            Boolean(data.isStreaming)
          );
          break;
        case "GET_CATALOG" /* GET_CATALOG */:
          void this.handleGetCatalog();
          break;
        case "GET_COMPONENT_USAGES" /* GET_COMPONENT_USAGES */:
          void this.handleGetComponentUsages();
          break;
        case "MCP_RESPONSE" /* MCP_RESPONSE */:
          this.handleMcpResponse(data.payload);
          break;
        case "SET_THEME" /* SET_THEME */:
          this.handleSetTheme(data.payload);
          break;
        default:
          console.warn(`PreviewBridge: Unrecognized incoming message type: ${data.type}`);
      }
    };
    if (typeof window !== "undefined" && window.location?.search) {
      const params = new URLSearchParams(window.location.search);
      this.cachedParentOrigin = params.get("origin");
    }
    this.initMessageListener();
    setupInstrumentationOverrides(this);
    this.initThemeFromUrl();
  }
  /**
   * Returns the IframeMcpClient proxy, creating and caching it if needed.
   */
  getMcpClient() {
    if (!this.mcpClient) {
      this.mcpClient = new IframeMcpClient((payload) => {
        this.sendMessage({
          type: "MCP_REQUEST" /* MCP_REQUEST */,
          payload
        });
      });
    }
    return this.mcpClient;
  }
  /**
   * Returns the currently attached renderer processor, if any.
   */
  getActiveProcessor() {
    return this.activeRenderer?.processor;
  }
  /**
   * Measures the rendered content's maximum scroll/offset dimensions and dispatches a
   * `SURFACE_RESIZE` message to the host window if dimensions have changed.
   *
   * This is triggered on:
   * 1. DOM mutations and element resize events via ResizeObserver.
   * 2. Window viewport resize events.
   * 3. Initial renderer attachment (`attachRenderer`).
   * 4. A2UI surface lifecycle events (`RENDER_A2UI` and surface clearing).
   *
   * @param force When true, bypasses the dimension deduplication cache.
   */
  dispatchSurfaceResize(force = false) {
    this.surfaceResizeObserver.measureAndDispatch(force);
  }
  /**
   * Applies light/dark mode theme styles and attributes to document.documentElement and document.body.
   * Toggles the `.dark-theme` class, sets `color-scheme` CSS style, and `data-theme` attribute.
   *
   * @param theme The target theme ('light' or 'dark').
   */
  applyThemeToDom(theme) {
    if (typeof document === "undefined" || !document.documentElement) return;
    this.currentAppliedTheme = theme;
    const isDark = theme === "dark" /* DARK */;
    document.documentElement.classList.toggle("dark-theme", isDark);
    document.documentElement.style.colorScheme = theme;
    document.documentElement.setAttribute("data-theme", theme);
    if (document.body) {
      document.body.classList.toggle("dark-theme", isDark);
      document.body.style.colorScheme = theme;
      document.body.setAttribute("data-theme", theme);
    }
  }
  initThemeFromUrl() {
    if (typeof window === "undefined" || !window.location || !window.location.search) return;
    const params = new URLSearchParams(window.location.search);
    const theme = params.get("theme");
    if (theme && Object.values(ThemePreference).includes(theme)) {
      this.applyThemeToDom(theme);
    }
  }
  /**
   * Attaches a framework rendering processor to the bridge, centralizing payload processing,
   * dynamic surface ID extraction, and connection management.
   *
   * @param processor The framework-specific message processor.
   * @param config The configuration object containing the surface group and lifecycle callbacks.
   * @return A subscription handle to detach the renderer and clean up surface connections.
   */
  attachRenderer(processor, config2) {
    if (!config2) {
      console.error("PreviewBridge: config parameter is required in RendererConfig.");
      return { unsubscribe: () => {
      } };
    }
    if (!config2.surfaceGroup) {
      console.error("PreviewBridge: surfaceGroup parameter is required in RendererConfig.");
      return { unsubscribe: () => {
      } };
    }
    if (this.activeRenderer) {
      console.warn(
        "PreviewBridge: A renderer is already attached. Replacing the previous renderer."
      );
      this.resetActiveRendererState();
    }
    const surfaceConnection = this.connectSurfaceGroup(config2.surfaceGroup);
    const activeSurfaceIds = /* @__PURE__ */ new Set();
    this.activeRenderer = {
      processor,
      config: config2,
      activeSurfaceIds
    };
    if (this.currentAppliedTheme) {
      this.applyThemeToDom(this.currentAppliedTheme);
      if (config2.onThemeChange) {
        try {
          config2.onThemeChange(this.currentAppliedTheme);
        } catch (error2) {
          console.error(
            "PreviewBridge: Error inside onThemeChange callback during attachment:",
            error2
          );
        }
      }
    }
    this.sendMessage({
      type: "RENDERER_READY" /* RENDERER_READY */
    });
    this.dispatchSurfaceResize();
    const attachConnection = {
      unsubscribe: () => {
        if (this.activeRenderer?.processor === processor) {
          this.activeRenderer = null;
        }
        surfaceConnection.unsubscribe();
        this.activeConnections.delete(attachConnection);
      }
    };
    this.activeConnections.add(attachConnection);
    return attachConnection;
  }
  /**
   * Cleanly tears down the active bridge instance, disposing of resources and removing event listeners.
   * Unsubscribes all active surface group connections, clears pending timers, removes global window
   * listeners, deletes any active blocking overlay DOM elements, and resets internal registries.
   * Highly critical to invoke in hot-reloads or test tear-downs to avoid memory leaks and test pollution.
   */
  destroy() {
    teardownInstrumentationOverrides();
    this.surfaceResizeObserver.destroy();
    if (typeof window !== "undefined") {
      window.removeEventListener("message", this.messageListener);
    }
    if (this.renderTimeoutId !== void 0) {
      clearTimeout(this.renderTimeoutId);
      this.renderTimeoutId = void 0;
    }
    this.handleBlockingOverlay(false);
    this.isListening = false;
    this.activeRenderer = null;
    this.currentAppliedTheme = void 0;
    const connections = Array.from(this.activeConnections);
    for (const connection of connections) {
      try {
        connection.unsubscribe();
      } catch (err) {
        console.error("PreviewBridge: Error during connection unsubscribe:", err);
      }
    }
    this.activeConnections.clear();
    this.mcpClient = null;
  }
  resolveExpectedParentOrigin() {
    if (typeof window === "undefined") {
      return "*";
    }
    if (this.cachedParentOrigin && /^https?:\/\/[^/]+$/.test(this.cachedParentOrigin)) {
      return this.cachedParentOrigin;
    }
    return window.location.origin || "*";
  }
  /**
   * Safe cross-origin messenger that transmits a bridge message upward to the parent host window.
   * Incorporates environment checks to prevent errors in non-browser contexts and permits
   * self-transmission in test environments.
   *
   * @param message The structured bridge message package containing type and payload.
   */
  sendMessage(message) {
    if (typeof window !== "undefined" && window.parent && window.parent !== window) {
      const targetOrigin = this.resolveExpectedParentOrigin();
      try {
        window.parent.postMessage(message, targetOrigin);
      } catch (error2) {
        if (error2 instanceof DOMException) {
          console.error("[PreviewBridge] Blocked cross-origin postMessage:", error2);
        } else {
          throw error2;
        }
      }
    }
  }
  /**
   * Envelopes and dispatches a user interaction or catalog event payload back to the Composer parent frame.
   * Wraps the event payload into a standard `SEND_TO_SERVER` message.
   *
   * @param action The declarative action payload containing click, input, or navigation events.
   * @param [version='v0.9'] The A2UI protocol specification version.
   */
  sendAction(action, version2 = "v0.9") {
    this.sendMessage({
      type: "SEND_TO_SERVER" /* SEND_TO_SERVER */,
      payload: {
        version: version2,
        action
      }
    });
  }
  /**
   * Routes incoming MCP_RESPONSE messages to the IframeMcpClient pending request.
   */
  handleMcpResponse(payload) {
    const payloadObj = payload;
    if (!payloadObj || typeof payloadObj.requestId !== "string") return;
    this.mcpClient?.handleResponse(payloadObj);
  }
  /**
   * Handles incoming theme change requests.
   */
  handleSetTheme(payload) {
    const payloadObj = payload;
    if (payloadObj && Object.values(ThemePreference).includes(payloadObj.theme)) {
      const theme = payloadObj.theme;
      this.applyThemeToDom(theme);
      if (this.activeRenderer?.config.onThemeChange) {
        try {
          this.activeRenderer.config.onThemeChange(theme);
        } catch (error2) {
          console.error("PreviewBridge: Error inside onThemeChange callback:", error2);
        }
      }
    } else {
      console.warn("PreviewBridge: Malformed SET_THEME payload received:", payload);
    }
  }
  /**
   * Handles incoming blocking overlay requests.
   */
  handleSetBlockingState(payload) {
    const payloadObj = payload;
    const blocked = !!(payloadObj && payloadObj.blocked);
    const messageStr = payloadObj && payloadObj.message;
    this.handleBlockingOverlay(blocked, messageStr);
  }
  /**
   * Dynamic interceptor mapping incoming state changes back into a standard render lifecycle payload.
   */
  handleIncomingDataModelChange(payload) {
    const payloadObj = payload;
    if (payloadObj && payloadObj.updateDataModel) {
      const renderPayload = [
        {
          version: "v0.9",
          updateDataModel: payloadObj.updateDataModel
        }
      ];
      this.dispatchRenderA2ui(renderPayload);
    }
  }
  /**
   * Orchestrates applying rendering payloads using the Two-Step Dispatch pattern.
   * If a createSurface instruction is present, it synchronously triggers a clear/unmount,
   * then defers the rendering actual layout command payload to a clean event cycle task.
   */
  dispatchRenderA2ui(payload, isStreaming = false) {
    if (!this.activeRenderer) {
      console.warn(
        "PreviewBridge: Received RENDER_A2UI but no active renderer is attached. Ignoring payload."
      );
      return;
    }
    const hasCreateSurface = Array.isArray(payload) && payload.some((item) => item && typeof item === "object" && "createSurface" in item);
    if (hasCreateSurface) {
      try {
        this.handleRenderA2ui(null, isStreaming, false);
      } catch (err) {
        console.error("PreviewBridge: Error during RENDER_A2UI null reset dispatch:", err);
      }
      if (this.renderTimeoutId) {
        clearTimeout(this.renderTimeoutId);
      }
      this.renderTimeoutId = setTimeout(() => {
        try {
          this.handleRenderA2ui(payload, isStreaming);
        } catch (err) {
          console.error("PreviewBridge: Error during deferred RENDER_A2UI payload dispatch:", err);
        }
      }, 0);
    } else {
      try {
        this.handleRenderA2ui(payload, isStreaming);
      } catch (err) {
        console.error("PreviewBridge: Error during direct RENDER_A2UI payload dispatch:", err);
      }
    }
  }
  /**
   * Renders the specified payload array, mapping surface creation handles,
   * or delegates a resetting null command.
   */
  handleRenderA2ui(payload, isStreaming = false, scheduleResize = true) {
    if (!this.activeRenderer) return;
    if (payload === null) {
      this.resetActiveRendererState(scheduleResize);
      return;
    }
    if (Array.isArray(payload)) {
      const createSurfaceCommand = payload.find(
        (item) => item && typeof item === "object" && "createSurface" in item
      );
      let hasCreateSurface = false;
      let surfaceId;
      const createSurface = createSurfaceCommand && createSurfaceCommand.createSurface;
      if (createSurface) {
        hasCreateSurface = true;
        const catalogId = createSurface.catalogId;
        if (catalogId) {
          this.notifyCatalogResolved(catalogId);
        }
        surfaceId = createSurface.surfaceId;
        if (surfaceId) {
          const deleteMessage = {
            version: "v0.9",
            deleteSurface: {
              surfaceId
            }
          };
          try {
            this.activeRenderer.processor.processMessages([deleteMessage]);
          } catch (err) {
            console.debug("PreviewBridge: pre-delete of surface failed", surfaceId, err);
          }
          this.activeRenderer.activeSurfaceIds.add(surfaceId);
        } else {
          console.warn("PreviewBridge: createSurface command found, but no surfaceId present.");
        }
      }
      let clonedPayload = payload;
      if (typeof structuredClone === "function") {
        try {
          clonedPayload = structuredClone(payload);
        } catch {
          clonedPayload = payload;
        }
      }
      let rendered = false;
      try {
        this.activeRenderer.processor.processMessages(clonedPayload);
        rendered = true;
        if (this.activeRenderer.config.onError) {
          this.activeRenderer.config.onError(null);
        }
        this.sendMessage({ type: "RENDER_SUCCESS" /* RENDER_SUCCESS */ });
      } catch (err) {
        console.error("PreviewBridge: Error during message processing:", err);
        if (!isStreaming && this.activeRenderer.config.onError) {
          this.activeRenderer.config.onError(err instanceof Error ? err : new Error(String(err)));
        }
        this.sendMessage({
          type: "RENDER_ERROR" /* RENDER_ERROR */,
          error: safeSerialize(err)
        });
      }
      if (rendered && hasCreateSurface && surfaceId) {
        this.activeRenderer.config.onSurfaceReady(surfaceId);
      }
      setTimeout(() => this.dispatchSurfaceResize(), 0);
    } else {
      console.warn("PreviewBridge: Unexpected non-array RENDER_A2UI payload received:", payload);
    }
  }
  /**
   * Resets active renderer properties, clearing tracking handles and posting delete signals.
   */
  resetActiveRendererState(scheduleResize = true) {
    if (!this.activeRenderer) return;
    const { processor, config: config2, activeSurfaceIds } = this.activeRenderer;
    for (const surfaceId of activeSurfaceIds) {
      try {
        processor.processMessages([
          {
            version: "v0.9",
            deleteSurface: {
              surfaceId
            }
          }
        ]);
      } catch (e) {
        console.warn(`PreviewBridge: Error clearing surface ${surfaceId} during reset:`, e);
      }
    }
    activeSurfaceIds.clear();
    if (config2.onSurfaceCleared) {
      config2.onSurfaceCleared();
    }
    if (scheduleResize) {
      setTimeout(() => this.dispatchSurfaceResize(), 0);
    }
  }
  /**
   * Encapsulates the multi-level reactive subscription pipeline between surface lifecycle
   * events and data model mutations, automatically formatting and transmitting synchronization
   * payloads (`DATA_MODEL_CHANGE`) back to the parent Composer window.
   * Incorporates defensive guards for mock structures and a Map Connection Registry to prevent
   * duplicate listeners and memory leaks during tab switching or hot-reloading.
   *
   * @param surfaceGroup The surface group or catalog renderer service model to connect.
   * @return A unified teardown handle exposing a single unsubscribe method to cleanly reclaim all child observers.
   */
  connectSurfaceGroup(surfaceGroup) {
    const subscriptions = /* @__PURE__ */ new Map();
    if (!surfaceGroup || !surfaceGroup.onSurfaceCreated) {
      return { unsubscribe: () => {
      } };
    }
    const groupSubscription = surfaceGroup.onSurfaceCreated.subscribe(
      (surface) => {
        if (!surface || typeof surface !== "object" || !surface.id || !surface.dataModel) return;
        const existing = subscriptions.get(surface.id);
        if (existing) {
          existing.unsubscribe();
          subscriptions.delete(surface.id);
        }
        try {
          const modelSub = surface.dataModel.subscribe("", (newValue) => {
            this.sendMessage({
              type: "DATA_MODEL_CHANGE" /* DATA_MODEL_CHANGE */,
              payload: {
                updateDataModel: {
                  surfaceId: surface.id,
                  value: newValue
                }
              }
            });
          });
          if (modelSub) {
            subscriptions.set(surface.id, modelSub);
          }
        } catch (err) {
          console.error(`Error subscribing to data model for surface ${surface.id}:`, err);
        }
      }
    );
    const connection = {
      unsubscribe: () => {
        if (groupSubscription) {
          groupSubscription.unsubscribe();
        }
        subscriptions.forEach((sub) => sub.unsubscribe());
        subscriptions.clear();
        this.activeConnections.delete(connection);
      }
    };
    this.activeConnections.add(connection);
    return connection;
  }
  /**
   * Attaches the incoming postMessage listener to the global window object.
   * Prevents redundant registrations by guarding with the `isListening` state flag
   * and checking for the presence of a browser window context.
   */
  initMessageListener() {
    if (this.isListening || typeof window === "undefined") return;
    window.addEventListener("message", this.messageListener);
    this.isListening = true;
  }
  /**
   * Manages the lifecycle and styling of the full-screen user-blocking overlay.
   * Displays status messages when layout rendering processes are active and injects a
   * manual fallback button to force-unblock interactions by notifying the parent frame.
   *
   * @param blocked Indicates if the user-blocking overlay should be shown (true) or removed (false).
   * @param [customMessage] Optional text message to display on the overlay.
   */
  handleBlockingOverlay(blocked, customMessage) {
    if (typeof document === "undefined" || !document.body) return;
    if (blocked) {
      if (!this.overlayElement || !this.overlayElement.isConnected) {
        this.overlayElement = document.createElement("div");
        this.overlayElement.id = "a2ui-blocking-overlay";
        Object.assign(this.overlayElement.style, {
          position: "fixed",
          top: "0",
          left: "0",
          width: "100vw",
          height: "100vh",
          backgroundColor: "rgba(0, 0, 0, 0.6)",
          zIndex: "999999",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          color: "#ffffff",
          fontFamily: "sans-serif",
          backdropFilter: "blur(4px)"
        });
        const messageNode = document.createElement("p");
        messageNode.id = "a2ui-blocking-message";
        messageNode.innerText = customMessage || "Processing framework layouts...";
        this.overlayElement.appendChild(messageNode);
        const button = document.createElement("button");
        button.innerText = "Force Unblock";
        Object.assign(button.style, {
          marginTop: "16px",
          padding: "10px 20px",
          fontSize: "15px",
          fontWeight: "bold",
          cursor: "pointer",
          backgroundColor: "#f44336",
          color: "#ffffff",
          border: "none",
          borderRadius: "4px",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)"
        });
        button.addEventListener("click", () => {
          this.sendMessage({
            type: "FORCE_UNBLOCK" /* FORCE_UNBLOCK */,
            payload: {}
          });
          this.handleBlockingOverlay(false);
        });
        this.overlayElement.appendChild(button);
        document.body.appendChild(this.overlayElement);
      } else {
        const msgElement = this.overlayElement.querySelector("#a2ui-blocking-message");
        if (msgElement) {
          msgElement.innerText = customMessage || "Processing framework layouts...";
        }
      }
    } else {
      if (this.overlayElement) {
        if (this.overlayElement.parentNode) {
          this.overlayElement.parentNode.removeChild(this.overlayElement);
        }
        this.overlayElement = null;
      }
    }
  }
  /**
   * Handles static requests to retrieve catalog configuration definitions.
   * Attempts to fetch from the catalog endpoint, implements fallback mechanisms to handle SPA
   * router redirects, strips JSON vulnerability safety prefixes, and transmits the resulting
   * JSON payload or error status back to the host container.
   */
  async fetchWithTimeout(url, timeoutMs = 3e3) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeoutMs);
    try {
      return await window.fetch(url, { signal: controller.signal });
    } finally {
      clearTimeout(id);
    }
  }
  /**
   * Coordinates in-memory retrieval (`catalogJson`) vs. HTTP network fetching
   * (including SPA HTML fallback to `/catalog.json`).
   */
  async resolveCatalog() {
    const config2 = this.activeRenderer?.config;
    const inMemoryCatalog = config2?.catalogJson ?? config2?.catalog;
    if (inMemoryCatalog !== void 0) {
      return { rawData: inMemoryCatalog, isInMemory: true };
    }
    if (typeof window === "undefined" || !window.fetch) return null;
    let res = await this.fetchWithTimeout("catalog");
    if (!res.ok) {
      throw new Error(`Catalog fetch failed with status: ${res.status}`);
    }
    let rawText = await res.text();
    const trimmedLower = rawText.trim().toLowerCase();
    const isHtml = trimmedLower.startsWith("<!doctype") || trimmedLower.startsWith("<html");
    if (isHtml) {
      const fallbackRes = await this.fetchWithTimeout("catalog.json");
      if (!fallbackRes.ok) {
        throw new Error(
          `Catalog fetch returned HTML and fallback to catalog.json failed with status: ${fallbackRes.status}`
        );
      }
      const fallbackText = await fallbackRes.text();
      const fallbackTrimmedLower = fallbackText.trim().toLowerCase();
      if (fallbackTrimmedLower.startsWith("<!doctype") || fallbackTrimmedLower.startsWith("<html")) {
        throw new Error(
          "Catalog fetch returned HTML (SPA fallback) for both catalog and catalog.json. Ensure the catalog JSON is correctly hosted and served."
        );
      }
      res = fallbackRes;
      rawText = fallbackText;
    }
    return { rawData: rawText, isInMemory: false };
  }
  /**
   * Strips potential XSSI vulnerability prefixes (`)]}'\n`) and executes `JSON.parse()`.
   */
  parseCatalogData(data) {
    if (typeof data === "string") {
      const safetyPrefix = ")]}'\n";
      const jsonText = data.startsWith(safetyPrefix) ? data.substring(safetyPrefix.length) : data;
      return JSON.parse(jsonText);
    }
    return data;
  }
  /**
   * Handles static requests to retrieve catalog configuration definitions.
   * Attempts to fetch from the catalog endpoint, implements fallback mechanisms to handle SPA
   * router redirects, strips JSON vulnerability safety prefixes, and transmits the resulting
   * JSON payload or error status back to the host container.
   */
  async handleGetCatalog() {
    let resolved = null;
    try {
      resolved = await this.resolveCatalog();
      if (!resolved) return;
      const catalog = this.parseCatalogData(resolved.rawData);
      const catalogId = catalog?.catalogId;
      if (catalogId) {
        this.notifyCatalogResolved(catalogId);
      }
      this.sendMessage({
        type: "A2UI_CATALOG" /* A2UI_CATALOG */,
        payload: catalog
      });
    } catch (error2) {
      const errorMessage = error2 instanceof Error ? error2.message : String(error2);
      if (resolved?.isInMemory) {
        console.error("PreviewBridge: Error processing/parsing in-memory catalog:", error2);
      }
      this.sendMessage({
        type: "A2UI_CATALOG" /* A2UI_CATALOG */,
        payload: {
          error: {
            message: errorMessage
          }
        }
      });
    }
  }
  /**
   * Invokes the getComponentUsages callback and returns the resolved usages.
   */
  async handleGetComponentUsages() {
    let usages = {};
    if (this.activeRenderer?.config.getComponentUsages) {
      try {
        usages = await this.activeRenderer.config.getComponentUsages();
      } catch (error2) {
        console.error("PreviewBridge: Error invoking getComponentUsages:", error2);
      }
    }
    this.sendMessage({
      type: "COMPONENT_USAGES" /* COMPONENT_USAGES */,
      payload: usages
    });
  }
  /**
   * Safely triggers the onCatalogResolved callback if registered in the active renderer config.
   */
  notifyCatalogResolved(catalogId) {
    if (this.activeRenderer?.config.onCatalogResolved) {
      try {
        this.activeRenderer.config.onCatalogResolved(catalogId);
      } catch (error2) {
        console.error("PreviewBridge: Error inside onCatalogResolved callback:", error2);
      }
    }
  }
};
var bridgeInstance = new PreviewBridge();
if (typeof window !== "undefined") {
  window.a2uiBridge = bridgeInstance;
}
var a2uiBridge = bridgeInstance;
export {
  A2UI_MIME_TYPE,
  A2UI_UPDATE_KEYS,
  CallMcpToolApi,
  DATA_FUNCTIONS,
  DATA_FUNCTION_APIS,
  DomainOriginVerificationService,
  ERROR_OVERLAY_DEBOUNCE_MS,
  IframeMcpClient,
  JmespathApi,
  JmespathImplementation,
  MCP_CATALOG_ID,
  PreviewBridge,
  PreviewBridgeMessageType,
  RegexCaptureApi,
  RegexCaptureImplementation,
  RegexReplaceApi,
  RegexReplaceImplementation,
  SplitApi,
  SplitImplementation,
  SurfaceResizeObserver,
  ThemePreference,
  UpdateDataModelApi,
  UpdateDataModelImplementation,
  a2uiBridge,
  createCallMcpToolImplementation,
  createMcpCatalogFunctions,
  extractA2uiMessages,
  isErrorLike,
  isThenable,
  parseA2uiMessages,
  readUiResourceUris,
  safeSerialize,
  setupInstrumentationOverrides,
  teardownInstrumentationOverrides
};
/*! Bundled license information:

re2js/build/index.js:
  (*!
  * re2js
  * RE2JS is the JavaScript port of RE2, a regular expression engine that provides linear time matching
  *
  * @version v2.8.6
  * @author Oleksii Vasyliev
  * @homepage https://github.com/le0pard/re2js#readme
  * @repository github:le0pard/re2js
  * @license MIT
  *)
*/
