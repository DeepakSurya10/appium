/* eslint-disable require-await */
// @ts-check

import _ from 'lodash';

/**
 *
 * @param {ReturnType<import('./find').FindMixin>} Base
 * @returns {import('../driver').BaseDriverBase<import('@appium/types').TimeoutCommands & import('@appium/types').EventCommands & import('@appium/types').FindCommands & import('@appium/types').LogCommands>}
 */
export function LogMixin (Base) {
  return class LogCommands extends Base {
    /**
     * XXX: dubious
     * @type {Record<string,import('@appium/types').LogType<LogCommands>>}
     */
    supportedLogTypes;

    async getLogTypes () {
      this.log.debug('Retrieving supported log types');
      return _.keys(this.supportedLogTypes);
    }
    async getLog (logType) {
      this.log.debug(`Retrieving '${logType}' logs`);

      if (!(await this.getLogTypes()).includes(logType)) {
        const logsTypesWithDescriptions = _.reduce(
          this.supportedLogTypes,
          (acc, value, key) => {
            acc[key] = value.description;
            return acc;
          },
          {},
        );
        throw new Error(
          `Unsupported log type '${logType}'. ` +
            `Supported types: ${JSON.stringify(logsTypesWithDescriptions)}`,
        );
      }

      return await this.supportedLogTypes[logType].getter(this);
    }
  };
}

