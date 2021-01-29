function init_post(url) {
    const all = d3.select('#chart-all');
    const ultrabullet = d3.select('#chart-ultrabullet');
    const bullet = d3.select('#chart-bullet');
    const blitz = d3.select('#chart-blitz');
    const rapid = d3.select('#chart-rapid');
    const classical = d3.select('#chart-classical');
    const correspondence = d3.select('#chart-correspondence');

    const options_base = {
        left_y_axis: "Percent of Games",
        include_game_count: true,
        left_y_max: 1.0
    }

    window.onload = async () => {
        await load_data(`${url}/assets/data/eco_category_by_rating.tsv`, 'ECO_BY_RATING');
        await load_data(`${url}/assets/data/eco_category_by_rating_and_timecontrol.tsv`, 'ECO_BY_RATING_TC');
        draw_ratings_chart(all, "ECO_BY_RATING", ["A", "B", "C", "D", "E"], options_base);

        options_base.filter_key = "TimeControl";

        options_base.filter_value = "UltraBullet";
        draw_ratings_chart(ultrabullet, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], options_base);
        
        options_base.filter_value = "Bullet";
        draw_ratings_chart(bullet, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], options_base);
        
        options_base.filter_value = "Blitz";
        draw_ratings_chart(blitz, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], options_base);
        
        options_base.filter_value = "Rapid";
        draw_ratings_chart(rapid, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], options_base);
        
        options_base.filter_value = "Classical";
        draw_ratings_chart(classical, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], options_base);
        
        options_base.filter_value = "Correspondence";
        draw_ratings_chart(correspondence, "ECO_BY_RATING_TC", ["A", "B", "C", "D", "E"], options_base);
    };
}
