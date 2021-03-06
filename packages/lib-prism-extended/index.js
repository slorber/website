const initialize = (Prism) => {
  // eslint-disable-next-line no-param-reassign
  Prism.languages.samlang = {
    comment: [
      {
        pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
        lookbehind: true,
      },
      {
        pattern: /(^|[^\\:])\/\/.*/,
        lookbehind: true,
        greedy: true,
      },
    ],
    string: {
      pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
      greedy: true,
    },
    keyword: [
      {
        pattern: /(class|val|function|method|import|private|if|then|else|match|from|unit|int|bool|string|this)\b/,
      },
    ],
    boolean: /\b(?:true|false)\b/,
    'class-name': [
      {
        pattern: /(\b)[A-Z][A-Za-z0-9]*/,
        lookbehind: true,
      },
    ],
    operator: /-|\+|\*|\/|%|&&|\|\|/,
    function: /[a-z][A-Za-z0-9]*\s*(?=\()/,
  };
};

module.exports = initialize;
