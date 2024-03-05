import { test, assert, describe } from 'poku';
import { createPoolCluster } from '../../../../promise.js';
import common from '../../../common.test.js';

(async () => {
  describe('Test pool cluster', common.describeOptions);

  await test(async () => {
    const poolCluster = createPoolCluster();

    poolCluster.once('warn', async function () {
      await new Promise((resolve) => {
        assert.equal(
          // eslint-disable-next-line no-invalid-this
          this,
          poolCluster,
          'should propagate warn event to promise wrapper',
        );
        resolve(true);
      });
    });

    poolCluster.poolCluster.emit('warn', new Error());
  });

  await test(async () => {
    const poolCluster = createPoolCluster();

    poolCluster.once('remove', async function () {
      await new Promise((resolve) => {
        assert.equal(
          // eslint-disable-next-line no-invalid-this
          this,
          poolCluster,
          'should propagate remove event to promise wrapper',
        );
        resolve(true);
      });
    });

    poolCluster.poolCluster.emit('remove');
  });
})();
