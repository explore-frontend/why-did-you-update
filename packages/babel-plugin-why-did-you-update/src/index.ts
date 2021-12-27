import type * as b from '@babel/core';
import * as path from 'path';
import {
  defaultHelperFunctionName,
  defaultAsyncHelperFunctionName
} from './constants';
import {
  assertDef,
  signle,
  Flush,
  FunctionNames,
  Types,
  WatchEffectFunctionNames
} from '@why-did-you-update/shared';
import {
  getInfoHelperTemplate,
  getAsyncWrapperHelperTemplate,
  getWrapperHelperTemplate,
  getFlagInjectTemplate
} from './template';
import { tryRequireTsSyntax } from './inherits';

type FunctionLikePath =
  | b.NodePath<b.types.FunctionExpression>
  | b.NodePath<b.types.ArrowFunctionExpression>;

export default function whyDidYouUpdatePlugin(
  babel: typeof b
): babel.PluginObj {
  const { types: t, template } = babel;

  let uid = 1;
  let needHelper = false;
  let needAsyncHelper = false;
  let helperUniqueName = defaultHelperFunctionName;
  let asyncHelperUniqueName = defaultAsyncHelperFunctionName;
  const wrapperHelper = getWrapperHelperTemplate(template);
  const asyncWrapperHelper = getAsyncWrapperHelperTemplate(template);
  const infoHelper = getInfoHelperTemplate(template);
  const injectHelper = getFlagInjectTemplate(template);

  return {
    inherits: tryRequireTsSyntax(),
    visitor: {
      Program: {
        enter(path) {
          needHelper = false;
          needAsyncHelper = false;
          helperUniqueName = path.scope.generateUid(helperUniqueName);
          asyncHelperUniqueName = path.scope.generateUid(asyncHelperUniqueName);
        },
        exit(path) {
          if (needAsyncHelper || needHelper) {
            const injectStmt = injectHelper();
            path.node.body.unshift(injectStmt);
          }

          if (needHelper) {
            const stmt = wrapperHelper({
              WRAP_FUNCTION_NAME: t.identifier(helperUniqueName)
            });

            path.node.body.unshift(stmt);
          }
          if (needAsyncHelper) {
            const stmt = asyncWrapperHelper({
              ASYNC_WRAP_FUNCTION_NAME: t.identifier(asyncHelperUniqueName)
            });
            path.node.body.unshift(stmt);
          }
        }
      },
      CallExpression(path, state) {
        if (t.isIdentifier(path.node.callee)) {
          switch (path.node.callee.name) {
            case FunctionNames.computed:
              transformComputed(state, path, FunctionNames.computed);
              break;
            case FunctionNames.watch:
              transformWatch(state, path, FunctionNames.watch);
              break;
            case FunctionNames.watchEffect:
            case FunctionNames.watchPostEffect:
            case FunctionNames.watchSyncEffect:
              transformWatchEffect(
                state,
                path,
                path.node.callee.name as WatchEffectFunctionNames
              );
              break;
          }
        }
      }
    }
  };

  function transformWatch(
    state: babel.PluginPass,
    path: b.NodePath<b.types.CallExpression>,
    name: FunctionNames
  ) {
    if (path.node.arguments.length < 2 || !isBindingComeFromVue(path, name)) {
      return;
    }

    const callbackArg = getWatchCallback(path);
    if (callbackArg) {
      const watchOptions = getWatchOptions(path);
      transformCallbackArg(
        state,
        callbackArg,
        Types.watch,
        watchOptions?.flush
      );
    }
  }

  function transformWatchEffect(
    state: babel.PluginPass,
    path: b.NodePath<b.types.CallExpression>,
    name: WatchEffectFunctionNames
  ) {
    if (path.node.arguments.length < 1 || !isBindingComeFromVue(path, name)) {
      return;
    }

    const callbackArg = getWatchEffectCallback(path);
    if (callbackArg) {
      const watchEffectOptions = getWatchEffectOptions(name, path);
      transformCallbackArg(
        state,
        callbackArg,
        Types.watchEffect,
        watchEffectOptions?.flush
      );
    }
  }

  function transformComputed(
    state: babel.PluginPass,
    path: b.NodePath<b.types.CallExpression>,
    name: FunctionNames
  ) {
    if (path.node.arguments.length !== 1 || !isBindingComeFromVue(path, name)) {
      return;
    }

    const callbackArg = getComputedCallback(path);
    if (callbackArg) {
      transformCallbackArg(
        state,
        callbackArg,
        Types.computed,
        undefined,
        inferNodeName(path)
      );
    }
  }

  function transformCallbackArg(
    state: babel.PluginPass,
    argument: FunctionLikePath,
    type: Types,
    flush?: Flush,
    name?: string
  ) {
    const loc = argument.node.loc;
    assertDef(loc);
    const filename = getFilename(state);

    const isAsync = !!argument.node.async;
    if (isAsync) {
      needAsyncHelper = true;
    } else {
      needHelper = true;
    }

    argument.replaceWith(
      t.callExpression(
        t.identifier(isAsync ? asyncHelperUniqueName : helperUniqueName),
        [
          argument.node,
          generateInfo(
            filename,
            loc.start.line,
            loc.start.column,
            type,
            isAsync,
            flush,
            name
          )
        ]
      )
    );
  }

  function isBindingComeFromVue(path: b.NodePath, name: FunctionNames) {
    const binding = path.scope.getBinding(name);
    if (!binding || binding.kind !== 'module') {
      return false;
    }
    return true;
  }

  function inferNodeName(path: b.NodePath) {
    if (
      path.parent.type === 'VariableDeclarator' &&
      t.isIdentifier(path.parent.id)
    ) {
      return path.parent.id.name;
    }
    return undefined;
  }

  function getFilename(state: babel.PluginPass) {
    if (!state.filename) {
      return 'unknown filename';
    }
    return path.relative(process.cwd(), state.filename);
  }

  function generateInfo(
    filename: string,
    line: number,
    column: number,
    type: Types,
    isAsync: boolean,
    flush?: Flush,
    name?: string
  ) {
    return infoHelper({
      ID: t.numericLiteral(uid++),
      FILENAME: t.stringLiteral(filename),
      LINE: t.numericLiteral(line),
      COLUMN: t.numericLiteral(column),
      ASYNC: t.booleanLiteral(isAsync),
      NAME: name ? t.stringLiteral(name) : t.identifier('undefined'),
      TYPE: t.stringLiteral(type),
      FLUSH: flush ? t.stringLiteral(flush) : t.identifier('undefined')
    });
  }

  function findFlushProperty(node: b.types.ObjectExpression) {
    for (const property of node.properties) {
      if (
        t.isProperty(property) &&
        t.isIdentifier(property.key) &&
        property.key.name === 'flush' &&
        t.isStringLiteral(property.value)
      ) {
        const flush = property.value.value;
        switch (flush) {
          case 'pre':
            return Flush.pre;
          case 'post':
            return Flush.post;
          case 'sync':
            return Flush.sync;
          default:
            return undefined;
        }
      }
    }
    return undefined;
  }

  function getWatchOptions(path: b.NodePath<b.types.CallExpression>) {
    const optionsArg = signle(path.get('arguments.2'));
    return getWatchOptionsWorker(optionsArg);
  }

  function getWatchEffectOptions(
    name: WatchEffectFunctionNames,
    path: b.NodePath<b.types.CallExpression>
  ) {
    if (name === FunctionNames.watchPostEffect) {
      return {
        flush: Flush.post
      };
    }
    if (name === FunctionNames.watchSyncEffect) {
      return {
        flush: Flush.sync
      };
    }

    const optionsArg = signle(path.get('arguments.1'));
    return getWatchOptionsWorker(optionsArg);
  }

  function getWatchOptionsWorker(
    optionsArg: b.NodePath<b.types.Node> | undefined
  ) {
    if (
      !optionsArg ||
      !t.isObjectExpression(optionsArg.node) ||
      optionsArg.node.properties.length === 0
    ) {
      return undefined;
    }

    return {
      flush: findFlushProperty(optionsArg.node)
    };
  }

  function getWatchCallback(path: b.NodePath<b.types.CallExpression>) {
    const callbackArg = signle(path.get('arguments.1'));
    return getCallbackWorker(callbackArg);
  }

  function getWatchEffectCallback(path: b.NodePath<b.types.CallExpression>) {
    const callbackArg = signle(path.get('arguments.0'));
    return getCallbackWorker(callbackArg);
  }

  function getComputedCallback(path: b.NodePath<b.types.CallExpression>) {
    const callbackArg = signle(path.get('arguments.0'));
    return getCallbackWorker(callbackArg);
  }

  function getCallbackWorker(
    callbackArg: b.NodePath<b.types.Node> | undefined
  ) {
    if (
      !callbackArg ||
      (!t.isFunctionExpression(callbackArg) &&
        !t.isArrowFunctionExpression(callbackArg))
    ) {
      return undefined;
    }

    return callbackArg as FunctionLikePath;
  }
}
