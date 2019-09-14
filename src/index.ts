import './definitions';
import cities, { randomGenerator } from './data';
import render from './render';
import store, { storeCitiesAndStates, state_array } from './store';


let test = [{ "name": "Baldwin Park", "state": "California", "reachable_cities": [{ "name": "Paramount", "state": "California", "transport": "land" }, { "name": "Modesto", "state": "California", "transport": "land" }] }, { "name": "Paramount", "state": "California", "reachable_cities": [] }, { "name": "Grass Valley", "state": "California", "reachable_cities": [] }, { "name": "Modesto", "state": "California", "reachable_cities": [{ "name": "Shafter", "state": "California", "transport": "land" }, { "name": "Grosse Pointe Woods", "state": "Michigan", "transport": "land" }, { "name": "Modesto", "state": "California", "transport": "land" }, { "name": "Baldwin Park", "state": "California", "transport": "land" }] }, { "name": "Howell", "state": "Michigan", "reachable_cities": [] }, { "name": "Port Hueneme", "state": "California", "reachable_cities": [] }, { "name": "Bermuda Dunes", "state": "California", "reachable_cities": [{ "name": "Howell", "state": "Michigan", "transport": "land" }, { "name": "Paramount", "state": "California", "transport": "land" }, { "name": "Grosse Pointe Woods", "state": "Michigan", "transport": "land" }] }, { "name": "Shafter", "state": "California", "reachable_cities": [{ "name": "Bermuda Dunes", "state": "California", "transport": "land" }, { "name": "Paramount", "state": "California", "transport": "land" }, { "name": "Baldwin Park", "state": "California", "transport": "land" }] }, { "name": "Moraga", "state": "California", "reachable_cities": [{ "name": "Grass Valley", "state": "California", "transport": "land" }] }, { "name": "Grosse Pointe Woods", "state": "Michigan", "reachable_cities": [{ "name": "Howell", "state": "Michigan", "transport": "land" }] }]


storeCitiesAndStates(<any>test)
//storeCitiesAndStates(randomGenerator(10, 10, ['California', 'Michigan']))
render()


