const { logger } = require("../middlewares/logger");
const { processPointsAndTiers } = require("./tier_downgrade.job");

/**
 * Schedule a job to run at a specific time each day
 * @param {Function} job - The job function to run
 * @param {number} hour - Hour of the day (0-23)
 * @param {number} minute - Minute of the hour (0-59)
 * @returns {NodeJS.Timeout} - The timer object
 */
function scheduleDaily(job, hour, minute) {
  const now = new Date();
  let scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hour,
    minute,
    0
  );

  // If the time has already passed today, schedule for tomorrow
  if (scheduledTime <= now) {
    scheduledTime.setDate(scheduledTime.getDate() + 1);
  }

  const timeUntilExecution = scheduledTime - now;

  logger.info(
    `Scheduling job to run at ${scheduledTime.toLocaleTimeString()} (in ${Math.round(
      timeUntilExecution / 60000
    )} minutes)`
  );

  // Schedule the first execution
  const timer = setTimeout(async () => {
    try {
      await job();
    } catch (error) {
      logger.error(`Error executing scheduled job: ${error.message}`, {
        stack: error.stack,
      });
    }

    // Schedule the job to run again tomorrow
    scheduleDaily(job, hour, minute);
  }, timeUntilExecution);

  return timer;
}

/**
 * Schedule a job to run at midnight on the first day of each month
 * @param {Function} job - The job function to run
 * @returns {NodeJS.Timeout} - The timer object
 */
function scheduleMonthly(job) {
  const now = new Date();
  let scheduledTime = new Date(
    now.getFullYear(),
    now.getMonth() + 1, // Next month
    1, // First day of month
    0, // Midnight (00:00)
    0,
    0
  );

  const timeUntilExecution = scheduledTime - now;

  logger.info(
    `Scheduling monthly job to run at ${scheduledTime.toLocaleString()} (in ${Math.round(
      timeUntilExecution / 3600000
    )} hours)`
  );

  // Schedule the first execution
  const timer = setTimeout(async () => {
    try {
      await job();
    } catch (error) {
      logger.error(`Error executing monthly scheduled job: ${error.message}`, {
        stack: error.stack,
      });
    }

    // Schedule the job to run again next month
    scheduleMonthly(job);
  }, timeUntilExecution);

  return timer;
}

/**
 * Initialize all scheduled jobs
 */
function initializeScheduledJobs() {
  try {
    logger.info("Initializing scheduled jobs");

    // Schedule expired points processing to run at 1:00 AM daily

    // Schedule points expiration and tier downgrade to run at midnight on first day of each month
    scheduleMonthly(processPointsAndTiers);

    // Add more scheduled jobs here as needed

    logger.info("All jobs scheduled successfully");
  } catch (error) {
    logger.error(`Error initializing scheduled jobs: ${error.message}`, {
      stack: error.stack,
    });
  }
}

module.exports = {
  initializeScheduledJobs,
};
