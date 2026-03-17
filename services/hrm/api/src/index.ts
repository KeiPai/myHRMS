import { LoggerFactory } from '@venizia/ignis';
import { HrmApplication, appConfigs } from './application';

const logger = LoggerFactory.getLogger(['HrmApplication']);

// ------------------------------------------------------------------------------------------------
const main = async () => {
  const application = new HrmApplication({
    scope: 'HrmApplication',
    config: appConfigs,
  });

  application.init();

  const applicationName = process.env.APP_ENV_APPLICATION_NAME?.toUpperCase() ?? '';
  logger.info(' Getting ready to start up %s Application...', applicationName);

  return application
    .boot()
    .then(() => {
      application.start().catch(err => {
        logger.error(
          '[main] Application start failed | Application Name: %s | Error: %s',
          applicationName,
          err,
        );
        process.exit(1);
      });
    })
    .catch(err => {
      logger.error(
        '[main] Application boot failed | Application Name: %s | Error: %s',
        applicationName,
        err,
      );
      process.exit(1);
    });
};

export default main();