const global_data = {};
async function load_data(path, name) {
    let raw_data = await d3.tsv(path, d3.autoType);

    let data = raw_data.map(d => {
        d["gameCount.sum"] /= 1000000;
        return d;
    })
    global_data[name] = data;
};

function get_line_for(x, y, statname) {
    return d3.line()
    .x(d => x(d.Rating) + x.bandwidth() / 2)
    .y(d => y(d[statname]))
}

// https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function calc_mean(dataset, x_key, count_key) {
    let total_count = 0;
    let weighted_sum  = 0;

    dataset.forEach(d => {
        total_count += d[count_key];
        weighted_sum += d[count_key] * d[x_key];
    });

    return Math.round(weighted_sum / total_count);
}

function calc_stddev(dataset, mean, x_key, count_key) {
    let sum = 0;
    let total_count = 0;

    dataset.forEach(d => {
        total_count += d[count_key];
        sum += Math.pow(d[x_key] - mean, 2) * d[count_key];
    });

    return Math.sqrt(sum/total_count);
}

const LINE_COLORS = ["#1f77b4","#ff7f0e","#2ca02c","#d62728","#9467bd","#8c564b","#e377c2","#7f7f7f","#bcbd22","#17becf"];

// Up to 4 stats + game count (required)
/**
 * SVG: the SVG to draw on (will be cleared and resized)
 * data: the dataset to draw using (requires gameCount.sum)
 * stats: the stats (other than gameCount.sum) in data to include (max 10)
 * is_main_data_percentages: if true, will draw main vertical axis with percents
 * heading: main vertical axis label
 * legend_keys: human readable versions of the stats
 */
function draw_ratings_chart(svg, 
    dataset_name, 
    stats, 
    is_main_data_percentages, 
    heading, 
    legend_keys, 
    include_game_count = false, 
    filter_key = undefined, 
    filter_value = undefined,
    left_y_max=undefined,
    min_rating=600, 
    max_rating=2999) {
    
    svg.selectAll("*").remove();

    const height = 320;
    const width  = 560;
    const margin = ({top: 40, right: 30, bottom: 50, left: 40});

    // Filter data: if filter_key is defined and the value does not match filter_value, discard the data
    // If the rating is outside the limits, discard the data
    let filtered_data = global_data[dataset_name].filter(d => d["Rating"] >= min_rating && d["Rating"] <= max_rating && (filter_key === undefined || d[filter_key] === filter_value));

    // Setup SVG size
    svg = svg.attr("viewBox", [0, 0, width, height]);

    const x = d3.scaleBand()
        .domain(d3.map(filtered_data, d => d.Rating))
        .rangeRound([margin.left, width - margin.right])
        .padding(0.1);
    const x_linear = d3.scaleLinear()
        .domain(d3.extent(d3.map(filtered_data, d => d.Rating)))
        .range([margin.left, width - margin.right])

    if (include_game_count) {
        const game_count_mean   = calc_mean(filtered_data, "Rating", "gameCount.sum");

        const y_game_count = d3.scaleLinear()
            .domain([0, d3.max(filtered_data, d => d["gameCount.sum"])])
            .rangeRound([height - margin.bottom, margin.top]);

        svg.append("g")
            .attr("fill", "grey")
            .attr("fill-opacity", 0.8)
            .selectAll("rect")
            .data(filtered_data)
            .join("rect")
            .attr("x", d => x(d.Rating))
            .attr("width", x.bandwidth())
            .attr("y", d => y_game_count(d["gameCount.sum"]))
            .attr("height", d => y_game_count(0) - y_game_count(d["gameCount.sum"]));

        svg.append("g")
            .attr("stroke", "black")
            .selectAll("line")
            .data([game_count_mean])
                .join("line")
                .attr("x1", d => x_linear(d))
                .attr("x2", d => x_linear(d))
                .attr("stroke-width", 5)
                .attr("y1", d => y_game_count(0))
                .attr("y2", d => y_game_count(d3.max(filtered_data, d => d["gameCount.sum"])))

        let sum = filtered_data.reduce((a, c) => a + c["gameCount.sum"], 0);

        const y_game_count_axis = g => g
            .attr("transform", `translate(${width - margin.right},0)`)
            .call(d3.axisRight(y_game_count))
            .call(g => g.select(".domain").remove())
            .call(g => g.append("text")
                .attr("x", margin.right)
                .attr("y", margin.top - 6)
                .attr("fill", "grey")
                .attr("text-anchor", "end")
                .text(`Game Count (millions)`))
            .call(g => g.append("text")
                .attr("x", margin.right)
                .attr("y", margin.top - 18)
                .attr("fill", "grey")
                .attr("text-anchor", "end")
                .text(`${numberWithCommas(Math.round(sum))} million total games`));
            
            svg.append("g")
                .call(y_game_count_axis);
    }

    const y_stats = d3.scaleLinear()
        .domain([0, d3.max(filtered_data, d => {
            if (left_y_max === undefined) {
                // Make axis fit all selected stats
                points = []
                stats.forEach(stat => points.push(d[stat]));
                return d3.max(points);
            } else return left_y_max;
        })]).rangeRound([height - margin.bottom, margin.top])

    const x_axis = g => g
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x)
            .tickValues(d3.ticks(...d3.extent(x.domain()), width / 40).filter(v => x(v) !== undefined))
            .tickSizeOuter(0))

    const y_stats_axis = g => g
        .attr("transform", `translate(${margin.left},0)`)
        .style("color", "steelblue")
        .call(d3.axisLeft(y_stats).ticks(null, is_main_data_percentages ? "%" : null))
        .call(g => g.select(".domain").remove())
        .call(g => g.append("text")
            .attr("x", -margin.left)
            .attr("y", margin.top - 10)
            .attr("fill", "steelblue")
            .attr("text-anchor", "start")
            .text(heading));

    stats.forEach((stat, i) => {
        // "Outline" line in white
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", "white")
            .attr("stroke-miterlimit", 1)
            .attr("stroke-width", 6)
            .attr("d", get_line_for(x, y_stats, stat)(filtered_data));

        // Colorful lines on top of the white line
        svg.append("path")
            .attr("fill", "none")
            .attr("stroke", LINE_COLORS[i])
            .attr("stroke-miterlimit", 1)
            .attr("stroke-width", 3)
            .attr("d", get_line_for(x, y_stats, stat)(filtered_data));
    });

    svg.append("g")
      .attr("fill", "none")
      .attr("pointer-events", "all")
      .selectAll("rect")
      .data(filtered_data)
      .join("rect")
        .attr("x", d => x(d.Rating))
        .attr("width", x.bandwidth())
        .attr("y", 0)
        .attr("height", height)
      .append("title")
        .text(d => {
            let text = `${d.Rating}\n`
            stats.forEach((stat, i) => {
                text += `${legend_keys[i]}: ${Math.round(d[stat] * 100)}%\n`
            });
            text += `${numberWithCommas(d["gameCount.sum"]*1000000, 0)} games\n`
            const game_count_mean   = calc_mean(filtered_data, "Rating", "gameCount.sum");
            text += `Average rating: ${game_count_mean}`;
            return text;
        });

    svg.append("g")
        .call(x_axis);
  
    svg.append("g")
        .call(y_stats_axis);

    svg.append("text")
      .attr("x", width/2)
      .attr("y", height - 15)
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .style('font-size', "12px")
      .text("Game Rating");

    const lineLegend = svg.selectAll(".lineLegend").data(legend_keys)
        .enter().append("g")
        .attr("class","lineLegend")
        .attr("transform", (_, i) => `translate(${i*(width/stats.length)},0)`);

    lineLegend.append("text").text(d => d)
        .style('font-size', "12px")
        .attr("transform", "translate(15,9)");

    lineLegend.append("rect")
        .attr("fill", (_, i) => LINE_COLORS[i])
        .attr("width", 10).attr("height", 10);

}