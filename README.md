# Paylocity Senior Engineer Take-home Assigment
Application allows users to preview their benefit cost history as well as change their settings for benefit cost calculation with a preview of an estimate.
Users with permissions can manage users and view their cost history as well.

## How to run
| Script        | Description                                                                                                                                         |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `dev`         | Starts the Vite development server. Hot module replacement and fast refresh are enabled.                                                            |
| `build`       | Runs TypeScript type checking (`tsc -b`) and builds the production bundle using Vite.                                                               |
| `test`        | Executes all tests using [Vitest](https://vitest.dev) once with code coverage reporting.                                                            |
| `test-ui`     | Launches the Vitest interactive test UI in the browser with live test feedback and coverage.                                                        |
| `clean`       | Removes generated files: `node_modules`, build output (`dist`, `coverage`, `build`), and lockfiles.                                                 |

## Design decisions and limitations
### Routing
I decided to use `react-router-dom` instead of making this a single page application to save myself some time on checking what should be visible when. Also from the assignment it seems like there is pretty well defined separation of responsibilities which leads one towards routing.

App could be done as a SPA too, I would have probably used Tabs from Chakra in place of navigation.

Also I left some routes unused. No reason to go into that much detail especially given 24-48h to complete this.

### Authentication and authorization
I went with function-ish user permissions. You could go with just roles (user can see their own data, admins can admin). But function based permissions are more granular and can be scaled if new role is created. For example if we wanted a new user role which can create new users but can't see their benefit history. This obviously assumes that users would have more data to them and more complicated creation process.

There are some basic guards against users forcing their way into restricted areas by manually editing the url. For the sake of saving time. Currently they are thrown back to login. But ideally you would want to show some page says "Oh you don't have permissions to access this. But you tried and now the authorities have been notified." and log it to some audit table on the api.

Also users are logged out on page reload. Data changes are persisted though.

### User management
For the sake of sanity there aren't too many guards against what can users do. Editing is unrestricted besides being unable to submit blank forms. In a real world case self editing of users would be likely more restricted. For example to add a dependent or change a name you would have to submit a document proving such action and the change would have to be reviewed by a HR admin before being saved. But process tracking and approval is WAY out of scope for this example.

Also I skipped much user data since it would be just filler. In a real world scenario there would be a very separate storage of user data (names, addresses, DOB, etc) and that would link to benefit history and settings. And these two branches would likely be managed by users of different roles. ie HR can create/edit/delete users and Payroll can see their benefit history and change their settings.
Also there is no delete user function. Since you probably wouldn't want to do that anyway but rather deactivate the user showing they left the company.

### Testing
There is some test coverage, I focused on "most bang for my test" areas. So whatever common components and high traffic areas. Main goal was to have a solid test setup in place so the test set can be expanded as needed. Also the depth of testing would depend on complexity of data and API responses. 

For an actual product I would go with a similar approach. If starting from 0 coverage I would start with common components and most frequent user journeys and expand the test set from there. Plus the obvious "test your chages manually before you push". Also from a very high level standpoint having a full e2e test suite would be nice, with whatever framework of choice, I heard Playwright is pretty solid. But I would ideally offload that work onto a testing automation engineer and keep small scale unit and integration tests in the actuall app repo.

### Tech stack and performance/bundle size
Stack on this is pretty simple:
- Vite as the framework/bundler
  - faster build times and lower complexity over webpack
- Chakra UI v3 for components
  - accessibility out of the box and lots of premade components
  - v3 needs some extra work over v2 but overall worth it
  - also the largest part of the bundle but can be reduced with clever use of components
- react-query for queries/mutations
- react-hook-form for forms