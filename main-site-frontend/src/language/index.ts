import highlight from 'highlight.js';

// @ts-ignore
highlight.registerLanguage('samlang', hljs => ({
  keywords: {
    keyword: 'class util val function method as public if then else match',
    literal: 'false true _',
    built_in: 'unit int bool string this panic',
  },
  contains: [
    // @ts-ignore
    hljs.QUOTE_STRING_MODE,
    // @ts-ignore
    hljs.C_LINE_COMMENT_MODE,
    // @ts-ignore
    hljs.C_BLOCK_COMMENT_MODE,
    // @ts-ignore
    hljs.NUMBER_MODE,
    {
      className: 'type',
      begin: '(?<![A-Za-z0-9])[A-Z][A-Za-z0-9]*',
      end: '',
    },
    {
      className: 'method',
      begin: /::/,
      end: /\(/,
      excludeBegin: true,
      excludeEnd: true,
    },
    {
      className: 'type-params',
      begin: /<(?!(int|string|bool))/,
      end: />/,
      excludeBegin: true,
      excludeEnd: true,
    },
    {
      className: 'punctuations',
      begin: /,|\[|]|::|=| |:/,
      end: '',
    },
  ],
}));