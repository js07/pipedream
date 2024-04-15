# Overview

The Cronfree API allows you to create and manage cron jobs, which are scheduled tasks that run automatically at specified intervals. With Pipedream's infrastructure, you can trigger workflows based on the schedule you set with Cronfree, opening a wide range of possibilities for automation. From data backup to periodic API polling, you can align various tasks with precise timing without managing the crontab on a server.

# Example Use Cases

- **Automated Data Backup**: Schedule regular data backups by triggering a Pipedream workflow that archives your project files to a cloud storage service like Google Drive or Dropbox whenever Cronfree fires the event.

- **Periodic API Data Polling**: Use Cronfree to set up a schedule for hitting an API, like Twitter or Shopify, at regular intervals. The Pipedream workflow then processes and stores the data, or sends it to another service for analysis or monitoring.

- **Scheduled Report Generation**: Have reports created and sent out daily, weekly, or monthly by initiating a workflow with Cronfree that pulls data from databases or services such as Airtable or Google Sheets, compiles it into a report, and emails it to pertinent stakeholders.
