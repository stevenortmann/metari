# Metari Command Center investor demo

Deploy as a separate Vercel project named `metari-command-center`. Set the encrypted production environment variable `COMMAND_PASSWORD` before deploying. The username is `investor`. Add `command.metari.io` to this project and follow the domain's returned DNS instructions. The main Metari website remains in its existing project.

All routes, including media and scripts, require server-side authentication. An unset password denies access. No password is included in the source. All operational records and heat maps remain simulated. This demo uses browser-local storage and does not connect to live cameras, robotics hardware, model training or a production audit backend.

The original v10 design and runtime assets are preserved. The seven original domain test suites pass. Deployment, domain configuration and browser verification remain pending.
