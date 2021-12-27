import pluginTester from 'babel-plugin-tester';
import plugin from '../src';
import * as prettier from 'prettier';
import * as path from 'path';

const prettierOptions: prettier.Options = {
  parser: 'typescript'
};

pluginTester({
  plugin,
  formatResult: (r) => {
    return prettier.format(r, prettierOptions);
  },
  fixtures: path.resolve(__dirname, './fixtures'),
  snapshot: true
});
