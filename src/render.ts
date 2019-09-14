import { ccd3 as d3 } from 'ccts';
import { createTopologyData, state_array, getState, getCity } from './store';
import { state, city, link } from './definitions';
const circle_size = {
    city: 12,
    state: 20,
}

const transport_color = {
    'inter-state': '#6ab04c',
    'land': '#fdcb6e',
    'air': '#74b9ff'
}
let zoom_handler = d3.zoom()
    .scaleExtent([0.5, 3])
    .on("zoom", function () {
        svg.select('.links')
            .attr("transform", d3.event.transform)
        svg.select('.nodes')
            .attr("transform", d3.event.transform)
    });

let svg = d3.select('svg')
    .call(zoom_handler)
let linkForce = d3.forceLink()
    .distance((d: any) => {
        return d.distance;
    }).strength(0.01);
let charge = d3.forceManyBody().strength(-100);
let xScale = d3.scaleLinear()

let yScale = d3.scaleLinear()
let zoomScale = d3.scaleLinear()
    .domain([1, 6])
    .range([1, 6])
    .clamp(true);



export default function render(expandedState?: state) {
    let topologyData = createTopologyData(state_array, expandedState);
    console.log(topologyData);
    let { nodes, links } = topologyData;


    let width = window.innerWidth, height = window.innerHeight;

    svg.attr('height', height)
        .attr('width', width)
        .on('zoom', function () {

        });

    xScale.domain([0, width])
        .range([0, width]);
    yScale
        .domain([0, height])
        .range([0, height]);
    zoomScale

    linkForce.links(links);

    let simulation = d3.forceSimulation(nodes)
        .force('link', linkForce)
        .force('charge', charge)
        .force("center", d3.forceCenter(width / 2, height / 2))
        .force('x', d3.forceX().x(function (d: (city | state)) {
            return d.type === 'state' ? width * 0.66 : width * 0.33;
        }).strength(0.02))
        .force('y', d3.forceY().y(height / 2).strength(0.02))
        .force('collision', d3.forceCollide().radius(function (d: (city | state)) {
            return circle_size[d.type];
        }))
        .on('tick', ticked)



    d3.select('.links')
        .selectAll('line')
        .data(links)
        .exit()
        .remove();

    d3.select('.links')
        .selectAll('line')
        .data(links)
        .enter()
        .append('line')
        .attr('stroke-width', '2px')
        .attr('stroke-opacity', 0.1);

    let lines = d3.selectAll('.links line')
        .attr('stroke', (d: link) => {
            return transport_color[d.transport]
        })


    d3.select('.nodes')
        .selectAll('g')
        .data(nodes)
        .exit()
        .remove();

    d3.select('.nodes')
        .selectAll('g')
        .data(nodes)
        .enter()
        .append('g')
        .append('circle')
        .attr('fill', '#f9ca24')
        .attr('stroke', '#636e72')
        .attr('stroke-width', '0')
        .parent()
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('stroke', 'black')
        .attr('dy', (d: (city | state)) => {
            return d.type === 'city' ? 24 : 32;
        });

    let circles = d3.selectAll('.nodes g')
        .style('cursor', 'pointer')
        .attr('transform', (d: (city | state)) => {
            if (d.type === 'city') {
                let state = getState(d.state)
                return `translate(${state.x},${state.y})`
            }
            return `translate(${d.x},${d.y})`
        })
        .on('click', function (d: (city | state)) {
            if (d.type === 'state') {
                render(d)
            }
        })
        .on('mouseover', function (c: (city | state)) {
            d3.select(this)
                .select('circle')
                .transition()
                .duration(200)
                .attr('stroke-width', '2px')
            lines
                .transition()
                .duration(200)
                .attr('stroke-opacity', (l: link) => {
                    return l.source === c || l.target === c ? 1 : 0.1
                })
        })
        .on('mouseleave', function (c: (city | state)) {
            d3.select(this)
                .select('circle')
                .transition()
                .duration(200)
                .attr('stroke-width', '0')
            lines
                .transition()
                .duration(200)
                .delay(300)
                .attr('stroke-opacity', 0.1)
        })
        .select('circle')
        .attr('r', function (d: (city | state)) {
            return circle_size[d.type];
        })
        .parent()
        .select('text')
        .text(function (d: (city | state)) {
            return d.name
        })
        .parent()
        .call(drag(simulation));


    function updateLinks() {
        lines.attr('x1', function (d: link) {
            return d.source.x
        })
            .attr('y1', function (d: link) {
                return d.source.y
            })
            .attr('x2', function (d: link) {
                return d.target.x
            })
            .attr('y2', function (d: link) {
                return d.target.y
            });


    }

    function updateNodes() {
        circles.attr('transform', (d: (city | state)) => {
            return `translate(${d.x},${d.y})`
        })
    }

    function ticked() {
        updateLinks()
        updateNodes()
    }

    function drag(simulation: any) {

        let dragstarted = (d: any) => {
            if (!d3.event.active) simulation.alphaTarget(0.3).restart();
            d.fx = d.x;
            d.fy = d.y;
        }

        let dragged = (d: any) => {
            d.fx = d3.event.x;
            d.fy = d3.event.y;
        }

        let dragended = (d: any) => {
            if (!d3.event.active) simulation.alphaTarget(0);
            d.fx = null;
            d.fy = null;
        }

        return d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended);
    }
};