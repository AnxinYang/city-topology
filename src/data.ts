
import { state, city, link, reachable_city } from './definitions';
import all_cities from './all-cities';
let cities: city[] = [
    {

        "name": "San Jose",
        "state": "CA",
        "reachable_cities": [
            {
                "name": "Mountain View", "state": "CA", "transport": "land"
            }, {
                "name": "New York City", "state": "NY", "transport": "air"
            }]
    }, {

        "name": "Mountain View",
        "state": "CA"
        , "reachable_cities": [
            {
                "name": "San Jose", "state": "CA", "transport": "land"
            }]
    }, {

        "name": "New York City",
        "state": "NY",
        "reachable_cities": [
            {
                "name": "San Jose", "state": "CA", "transport": "air"
            }]
    }];

function randomGenerator(size: number = 20, link_number_for_each_city: number = 2, stateNames?: string[]) {
    let cities: city[] = [];
    let city_pool = all_cities;
    if (stateNames) {
        city_pool = all_cities.filter((c) => {
            return stateNames.indexOf(c.state) > -1
        })
    }
    for (let i = 0; i < size && i < city_pool.length; i++) {
        let c = city_pool[getRandomNum(city_pool.length)];
        let city: city = {
            name: c.city,
            state: c.state,
            reachable_cities: [],

        }
        cities.push(city)
    }

    cities.forEach((city) => {
        let connected = [city.name];
        for (let j = 0; j < getRandomNum(link_number_for_each_city) && j < cities.length - 1; j++) {
            let rc = cities[getRandomNum(cities.length)];
            if (connected.indexOf(rc.name) < 0) {
                city.reachable_cities.push({
                    name: rc.name,
                    state: rc.state,
                    transport: getRandomNum(1) >= 0.5 ? 'air' : 'land'
                });
                connected.push(rc.name)
            }
        }
    })

    console.log(cities)

    return cities;
}

function getRandomNum(max: number) {
    return Math.floor(Math.random() * max)
}
export default cities;
export {
    randomGenerator
}



