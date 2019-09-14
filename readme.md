## Build Instruction.
### Development
1. Install lastest NodeJS and Typescript.
2. Clone this repository.
3. Open terminal and enter the root directory of this project.
4. In terminal enter 'npm install'.
5. After installition is completed, run 'node packager.js' to start build process and http server.
6. Open browser and enter 'localhost:1992' and for Mac enter '0.0.0.0:1992', or you can config server in 'webpack.config.dev.js'

### Production
1. Install lastest NodeJS and Typescript.
2. Clone this repository.
3. Open terminal and enter the root directory of this project.
4. In terminal enter 'npm install'.
5. After installition is completed, run 'node packager.js production' to start build process.
Note: Production process will not start a http server.

### Other
Your can change number of state and city and link by modify this line:

storeCitiesAndStates(randomGenerator(100, 10, ['California', 'Ohio', 'Texas']));

in './src/index.ts'
randomGenerator takes three parameters:
(size: number = 20, link_number_for_each_city: number = 2, stateNames?: string[]) 

size : for how many city, default to 20,
link_number_for_each_city: max reachable_city for each city, default to 2.
stateNames: Take a string array of state FULL NAME.