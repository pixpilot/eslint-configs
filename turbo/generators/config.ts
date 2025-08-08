import { packageGenerator } from '@pixpilot/pnpm-workspace-package-generator';
import { repository } from '../../package.json';

module.exports = function generator(plop: unknown) {
  packageGenerator(plop, {
    author: 'm.doaie <m.doaie@hotmail.com> (https://github.com/ccpu)',
    baseRepoUrl: repository.type,
    orgName: 'pixpilot',
  });
};
