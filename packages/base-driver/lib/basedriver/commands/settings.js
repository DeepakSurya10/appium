// @ts-check

/**
 *
 * @param {ReturnType<import('./log').LogMixin>} Base
 * @returns {import('../driver').BaseDriverBase<import('@appium/types').TimeoutCommands & import('@appium/types').EventCommands & import('@appium/types').FindCommands & import('@appium/types').LogCommands & import('@appium/types').SettingsCommands>}
 */
export function SettingsMixin (Base) {
  return class SettingsCommands extends Base {

    async updateSettings (newSettings) {
      if (!this.settings) {
        this.log.errorAndThrow('Cannot update settings; settings object not found');
      }
      return await this.settings.update(newSettings);
    }

    async getSettings () {
      if (!this.settings) {
        this.log.errorAndThrow('Cannot get settings; settings object not found');
      }
      return await this.settings.getSettings();
    }

  };
}

