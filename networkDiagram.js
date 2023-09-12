export function makeNetworkChart(
  group,
  preferences,
  width = 300,
  height = 300
) {
  // sort our data into nodes and links
  // as d3 requires
  let nodes = group.students;
  let links = [];
  // Map our data into nodes and links...
  for (let p of preferences) {
    if (nodes.includes(p.student)) {
      for (let other of p.keepWith) {
        if (nodes.includes(other)) {
          let link = {
            source: p.student.id,
            target: other.id,
          };
          links.push(link);
        }
      }
    }
  }

  // Create an SVG element to put our diagram in
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", width);
  svg.setAttribute("height", height);

  // Define the boundaries for nodes to stay within
  const margin = 10; // Adjust as needed
  const xMin = margin;
  const xMax = width - margin;
  const yMin = margin;
  const yMax = height - margin;

  // Create a force-directed network diagram
  const simulation = d3
    .forceSimulation(nodes)
    .force(
      "link",
      d3.forceLink(links).id((d) => d.id)
    )
    .force("charge", d3.forceManyBody().strength(-100)) // You can adjust the strength as needed
    .force("center", d3.forceCenter(width / 2, height / 2)) // Center the graph
    .force("collision", d3.forceCollide().radius(5)); // Radius should match the node radius

  // Create links as SVG lines
  const link = d3
    .select(svg)
    .selectAll(".link")
    .data(links)
    .enter()
    .append("line")
    .attr("class", "link")
    .style("stroke", "gray") // You can specify a color for the links
    .style("stroke-width", 2); // You can adjust the stroke width as needed

  // Create nodes as SVG circles
  const node = d3
    .select(svg)
    .selectAll(".node")
    .data(nodes)
    .enter()
    .append("circle")
    .attr("class", "node")
    .attr("r", 5) // You can adjust the radius as needed
    .style("fill", "blue") // You can specify a color for nodes
    .call(
      d3
        .drag() // Add drag behavior to nodes
        .on("start", dragstarted)
        .on("drag", dragged)
        .on("end", dragended)
    );

  // Add labels to nodes
  const label = d3
    .select(svg)
    .selectAll(".label")
    .data(nodes)
    .enter()
    .append("text")
    .attr("class", "label")
    .attr("x", (d) => d.x + 8) // Adjust the x-position for label placement
    .attr("y", (d) => d.y + 3) // Adjust the y-position for label placement
    .text((d) => d.name); // Use the 'name' property for the label text

  // Update node and link positions on each tick of the simulation
  simulation.on("tick", () => {
    // Enforce bounds for nodes
    node
      .attr("cx", (d) => Math.max(xMin, Math.min(xMax, d.x)))
      .attr("cy", (d) => Math.max(yMin, Math.min(yMax, d.y)));

    // Update link positions
    link
      .attr("x1", (d) => d.source.x)
      .attr("y1", (d) => d.source.y)
      .attr("x2", (d) => d.target.x)
      .attr("y2", (d) => d.target.y);

    // Update label positions
    label
      .attr("x", (d) => Math.max(xMin, Math.min(xMax, d.x + 8)))
      .attr("y", (d) => Math.max(yMin, Math.min(yMax, d.y + 3)));
  });

  // Define drag functions
  function dragstarted(d, id) {
    if (!d3.event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  function dragged(d, id) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  function dragended(d, id) {
    if (!d3.event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
  }

  return svg; // Return the created SVG element
}
