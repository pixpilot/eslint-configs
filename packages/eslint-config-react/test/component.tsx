import type { ReactNode } from 'react';

/*
 * Intentionally no explicit return-type annotation here.
 * TypeScript infers: JSX.Element | ReactNode (expanded union that includes
 * Promise<AwaitedReactNode> in React 19).
 *
 * Expected behaviour in TSX files:
 *  - ts/promise-function-async is OFF   → no error, no autofix
 *  - ts-no-autofix/promise-function-async is WARN → advisory only, no autofix
 */
function renderTooltipContent(content: ReactNode | undefined) {
  if (typeof content === 'string') {
    return <p>{content}</p>;
  }

  return content;
}

function Component() {
  return <div>{renderTooltipContent('Tooltip content')}</div>;
}

export { Component };
