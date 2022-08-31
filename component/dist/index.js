function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = require('react');
var React__default = _interopDefault(React);
var parser = require('@linkedmd/parser');

var IPFS_GATEWAY = 'https://cf-ipfs.com/ipfs';

var fetchAndParse = function fetchAndParse(fileURI) {
  try {
    var ipfsURI = fileURI.startsWith('ipfs://') ? IPFS_GATEWAY + "/" + fileURI.split('ipfs://')[1] : false;
    return Promise.resolve(fetch(ipfsURI ? ipfsURI : fileURI)).then(function (data) {
      return Promise.resolve(data.text()).then(function (file) {
        var parser$1 = new parser.LinkedMarkdown(file);
        return Promise.resolve(parser$1.parse()).then(function () {
          return {
            file: file,
            parser: parser$1
          };
        });
      });
    });
  } catch (e) {
    return Promise.reject(e);
  }
};

var getUrlParams = function getUrlParams(search) {
  var hashes = search.slice(search.indexOf('#') + 1).split('&');
  return hashes.reduce(function (params, hash) {
    var _Object$assign;

    var _hash$split = hash.split('='),
        key = _hash$split[0],
        val = _hash$split[1];

    return Object.assign(params, (_Object$assign = {}, _Object$assign[key] = decodeURIComponent(val), _Object$assign));
  }, {});
};

var LinkedMarkdownViewer = function LinkedMarkdownViewer(_ref) {
  var fileURI = _ref.fileURI,
      onFileURIChange = _ref.onFileURIChange;

  var _useState = React.useState([]),
      fileStack = _useState[0],
      setFileStack = _useState[1];

  var _useState2 = React.useState(''),
      output = _useState2[0],
      setOutput = _useState2[1];

  var fetchAndSet = function fetchAndSet(newFileURI) {
    fetchAndParse(newFileURI).then(function (_ref2) {
      var parser = _ref2.parser;
      setFileStack(fileStack.concat([newFileURI]));
      setOutput(parser.toHTML() || '');
      console.log(newFileURI);
      onFileURIChange && onFileURIChange(newFileURI);
    });
  };

  React.useEffect(function () {
    fetchAndSet(fileURI);
  }, []);
  window.addEventListener('hashchange', function () {
    var params = getUrlParams(window.location.hash);
    var newFileURI = params['LinkedMD-URI'];
    newFileURI && fetchAndSet(newFileURI);
  });
  return React__default.createElement("div", {
    className: "LM-output",
    dangerouslySetInnerHTML: {
      __html: output
    }
  });
};
var LinkedMarkdownEditor = function LinkedMarkdownEditor(_ref3) {
  var fileURI = _ref3.fileURI;

  var _useState3 = React.useState(''),
      input = _useState3[0],
      setInput = _useState3[1];

  var _useState4 = React.useState(''),
      output = _useState4[0],
      setOutput = _useState4[1];

  var fetchAndSet = function fetchAndSet(newFileURI) {
    fetchAndParse(newFileURI).then(function (_ref4) {
      var file = _ref4.file,
          parser = _ref4.parser;
      setInput(file || '');
      setOutput(parser.toHTML() || '');
      !!file && localStorage.setItem('saved-input', file);
    });
  };

  React.useEffect(function () {
    fetchAndSet(fileURI);
  }, [fileURI]);
  React.useEffect(function () {
    var parser$1 = new parser.LinkedMarkdown(input);
    parser$1.parse().then(function () {
      setOutput(parser$1.toHTML());
    });
    input !== '' && localStorage.setItem('saved-input', input);
  }, [input]);
  React.useEffect(function () {
    fetchAndSet(fileURI);
    var savedInput = localStorage.getItem('saved-input');
    !!savedInput && setInput(savedInput || '');
  }, []);

  var handleInput = function handleInput(e) {
    var target = e.target;
    setInput(target.value);
  };

  return React__default.createElement("div", {
    className: "LM-split-screen"
  }, React__default.createElement("textarea", {
    className: "LM-input",
    onChange: handleInput,
    value: input
  }), React__default.createElement("div", {
    className: "LM-output",
    dangerouslySetInnerHTML: {
      __html: output
    }
  }));
};

exports.LinkedMarkdownEditor = LinkedMarkdownEditor;
exports.LinkedMarkdownViewer = LinkedMarkdownViewer;
//# sourceMappingURL=index.js.map
