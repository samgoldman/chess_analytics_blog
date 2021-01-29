function init_post(path) {
    const all = d3.select('#chart-all');
    const ultrabullet = d3.select('#chart-ultrabullet');
    const bullet = d3.select('#chart-bullet');
    const blitz = d3.select('#chart-blitz');
    const rapid = d3.select('#chart-rapid');
    const classical = d3.select('#chart-classical');
    const correspondence = d3.select('#chart-correspondence');

    window.onload = async () => {
        await load_data(`${url}/assets/data/eco_category_by_rating.tsv`, 'ECO_BY_RATING');
        await load_data(`${url}/assets/data/eco_category_by_rating_and_timecontrol.tsv`, 'ECO_BY_RATING_TC');
        draw_ratings_chart(all, "ECO_BY_RATING", ["A", "B", "C", "D", "E"], true, "Percent of Games", ["A", "B", "C", "D", "E"], true);
        draw_ratings_chart(ultrabullet, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], true, "Percent of Games", ["A", "B", "C", "D", "E"], true, filter_key="TimeControl", filter_value="UltraBullet");
        draw_ratings_chart(bullet, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], true, "Percent of Games", ["A", "B", "C", "D", "E"], true, filter_key="TimeControl", filter_value="Bullet");
        draw_ratings_chart(blitz, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], true, "Percent of Games", ["A", "B", "C", "D", "E"], true, filter_key="TimeControl", filter_value="Blitz");
        draw_ratings_chart(rapid, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], true, "Percent of Games", ["A", "B", "C", "D", "E"], true, filter_key="TimeControl", filter_value="Rapid");
        draw_ratings_chart(classical, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], true, "Percent of Games", ["A", "B", "C", "D", "E"], true, filter_key="TimeControl", filter_value="Classical");
        draw_ratings_chart(correspondence, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], true, "Percent of Games", ["A", "B", "C", "D", "E"], true, filter_key="TimeControl", filter_value="Correspondence");
    };
}
