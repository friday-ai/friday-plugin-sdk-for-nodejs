/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable max-len */
import logger from '@friday-ai/logger';

//      ____                                        __                                          __     _     __
//     / __ \  ___   _____  ____    _____  ____ _  / /_  ____    _____   _____         __  __  / /_   (_)   / /   _____
//    / / / / / _ \ / ___/ / __ \  / ___/ / __ `/ / __/ / __ \  / ___/  / ___/        / / / / / __/  / /   / /   / ___/
//   / /_/ / /  __// /__  / /_/ / / /    / /_/ / / /_  / /_/ / / /     (__  )        / /_/ / / /_   / /   / /   (__  )
//  /_____/  \___/ \___/  \____/ /_/     \__,_/  \__/  \____/ /_/     /____/         \__,_/  \__/  /_/   /_/   /____/
//

//      ____                                        __                                   ____                  __                    _
//     / __ \  ___   _____  ____    _____  ____ _  / /_  ____    _____   _____          / __/  ____ _  _____  / /_  ____    _____   (_)  ___    _____
//    / / / / / _ \ / ___/ / __ \  / ___/ / __ `/ / __/ / __ \  / ___/  / ___/         / /_   / __ `/ / ___/ / __/ / __ \  / ___/  / /  / _ \  / ___/
//   / /_/ / /  __// /__  / /_/ / / /    / /_/ / / /_  / /_/ / / /     (__  )         / __/  / /_/ / / /__  / /_  / /_/ / / /     / /  /  __/ (__  )
//  /_____/  \___/ \___/  \____/ /_/     \__,_/  \__/  \____/ /_/     /____/         /_/     \__,_/  \___/  \__/  \____/ /_/     /_/   \___/ /____/
//

const Catch = () => (_: any, __: string, descriptor: PropertyDescriptor) => {
  // save a reference to the original method
  const originalMethod = descriptor.value;

  // rewrite original method with custom wrapper
  descriptor.value = function f(...args: any[]) {
    try {
      const result = originalMethod.apply(this, args);

      // check if method is asynchronous
      if (result && typeof result.then === 'function' && typeof result.catch === 'function') {
        // return promise
        return result.catch((e: Error) => {
          logger.error(e.message);
          throw e;
        });
      }

      // return actual result
      return result;
    } catch (e) {
      const error = e as Error;
      logger.error(error.message);
      throw e;
    }
  };

  return descriptor;
};

export default Catch;
