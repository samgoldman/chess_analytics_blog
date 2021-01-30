---
title: "Analysis of ECO Category Usage by Player Rating and Time Control"
layout: d3_post
data: 2021-01-31 00:00
hidden: false
published: true
headerImage: false
projects: false
tag:
- Chess
- D3
star: false
category: blog
author: samgoldman
description: Test
---
<script src="{{ base.url | prepend: site.url }}/assets/javascript/posts/1-eco-by-rating-timecontrol.js"></script>


I would like to start off my mentioning that I'm pretty new to studying chess. I've played casually with friends for years, but have never really studied strategies. I discovered Lichess back in September/October after a recommendation from a coworker and really started playing in November.

I eventually stumbled across Lichess' [database](database.lichess.org/) and as someone who loves data, I immediately started figuring out what I would be able to do with. I'll save the technical details for another post eventually, but I tried a few different things before settling on transforming the provided PGN files into a binary format that I could process quicker. It took over four days to convert all eight years (2013-2020) of data, but now that I have I'm able to generate results in three to four hours (depending on what processing has to be done).

One of my initial goals with this project was to see if there was a noticable spike in players using the [Queen's Gambit Opening](https://en.wikipedia.org/wiki/Queen%27s_Gambit). While I intend to return to look at that eventually, I got side-tracked by curiousity over whether players at different levels used different openings. Brief research on Wikipedia and elsewhere indicated that they do, but I wanted to demonstrate that. 

Long story short, I posted the results for several openings on [Reddit](https://www.reddit.com/r/chess/comments/kzb9f5/selected_opening_usage_in_17_billion_lichess/) a couple of weeks ago and got some good feedback, including [creating a blog post](https://www.reddit.com/r/chess/comments/kzb9f5/selected_opening_usage_in_17_billion_lichess/gjnf7vu). So here I am! I decided to take a step back and first look at broader patterns with main [Encyclopaedia of Chess Openings (ECO)](https://en.wikipedia.org/wiki/Encyclopaedia_of_Chess_Openings) usage by game rating.

## Terminology 

I'll start by going over some of the chess terminology that I'm using in this post. This is mostly for my benefit, but if you're reading this and you learn something, great! And if you're reading this and you spot a mistake, please let me know!

### ECO Codes

The ECO system is a method for defining openings in chess. Openings are broken down into five main categories:

* A: Flank Openings
* B: Semi-Open Games
* C: Open Games
* D: Close and Semi-Closed Games
* E: Indian Defences

Openings are then further dividing into 100 subcategories for each main category, 00-99, but for this analysis I stuck to the main categories.

### Game Rating

Game rating is pretty straightforward: average the two player's ratings and you have a game rating. Lichess uses the [Glicko-2](https://en.wikipedia.org/wiki/Glicko_rating_system), although I have definitely messed up and used the term Elo in several places in the code. Also, I've limited the rating range on the following charts to anything below 3000, for two reasons:

1. Above that rating, sample sizes get small. They get small before that too, but 3000 seemed like a natural cutoff initially.
2. I sampled several games with ratings above 3000 and every one was played by players suspected of or suspended for rating manipulation.

In hindsight, I should have place the cutoff at 2800 since that Lichess' own cutoff on their [rating distribution charts](https://lichess.org/stat/rating/distribution/rapid). I'll do that in the future, but for now I'll leave it.

### Time Control

Rated games are generally timed with two components, the initial time that each player is allotted and the time increment that each player is given when making a move. Lichess categorizes time controls into six categories:

1. UltraBullet: games where the estimated game duration (initial time + time increment * 40, since 40 is the expected number of moves) is <29 seconds
2. Bullet: games where the estimated duration is <179 seconds
3. Blitz: games where the estimated duration is <479 seconds
4. Rapid: games where the estimated duration is <1499 seconds
5. Classical: games where the estimated duration is >=1500 seconds
6. Correspondence: these games are not played under typical time constraints. Instead players are given a set number of *days* to play, not seconds or minutes

**Note**: I did not take into account beserking which is when, in a tournament, a player may opt to start with half the time on their clock in exchange for a point bonus if they win.

Now, onto the charts!

## All Time Controls
<svg id="chart-all"></svg>

This chart shows two things: the lines show the percent of games in each rating bin that use an opening in a given ECO category. The bar chart shows the number of games in each of those rating bins. Additionally, the black line shows the overall average game rating. So across all time controls, the average game rating is 1610. Each rating bin corresponds to a rating range of 50 points, calculated like so: floor(game_rating/50)*50, so a game rating of 1699 would fall in the 1650 bin.

Some points of interest:
* Categories A and C start with almost equal shares of games at the low end of the spectrum
* Category C openings gain popularity with lower ranked players before steadily dropping off starting around the 1200 rating range
* Meanwhile, category A openings fall initially before starting a steady rise around 1200 and peaking with around 50% of the game share
* Categories B and D are relatively steady, although B does gain some share progressing through the lower ratings
* Category E openings are the least common overall, only gaining a noticeable number of games around 1200 and peaking with about 6% of games in the 2300-2400 rating range

## UltraBullet
<svg id="chart-ultrabullet"></svg>

UltraBullet games represent about 24 million (1.3%) of all games in the database, and there's not really much of an interesting difference between the overall usage of category B, D, or E openings. However the difference for openings in the A and C categories is very interesting. Unlike in the overall dataset, C openings never overtake A openings (exect for at the very end, but with a sample size of <2000 games, I'm not counting that). 

My leading theory is that in the overall dataset, the progression of A and C show the learning curve of new players. My assumption is that UltraBullet players (save for the few that just want to give it a shot) are not new to chess. I'm at best okay when playing rapid, but when I tried playing the computer at mere Bullet times, I barely stood a chance. So even players who are new to UltraBullet have gone through the learning phase seen in the full dataset, resulting in category A openings dominating Ultrabullet.

## Bullet
<svg id="chart-bullet"></svg>

Bullet games (33% of the total) shows a progression that more closely resembles the overall chart than UltraBullet's does, but is noticeably accelerated. The second switch between A and C occurs earlier. This is likely the result of a similar playerbase to UltraBullet's, but not as extreme (i.e, more players newer to chess overall mixed in) because the timing is more manageable.

## Blitz
<svg id="chart-blitz"></svg>

With just over 48% of the total games, it makes sense that it's graph pretty closely resembles that of the overall dataset's. However, there are still two interesting points:

* Category B openings spend a little more time at the top (and by a larger margin), and end more or less even with A. My guess - more time equals more time to experiment with lesser known openings (and recover if you mess up)
* Similarly, Category E grows to take a larger share, peaking with 10%

## Rapid
<svg id="chart-rapid"></svg>

Rapid games represent only 15% of the overall games and show similar patterns to Blitz, but a bit more exaggerated. Most notably, category B openings keep the lead (at least until the 2600+ choas of small sample sizes). Other than that, I don't really have much to say about this chart.

## Classical
<svg id="chart-classical"></svg>

Again, classical games (2.3%) don't differ too much from the overall dataset, with the main exception being the use of category B openings at higher levels. Also of note: classical has the lowest average game rating of all time controls. I'm not entirely sure why that may be, but it may be a similar case to the correspondence games, where due to the length of the game, players will only play once or twice and not develop their rating.

## Correspondence
<svg id="chart-correspondence"></svg>

While you can *sort* *of* see similar patterns in this dataset, it's pretty obvious that the relatively small sample size makes this data not so helpful. One interesting thing here though is is the distribution of the game counts - over a third of all correspondence games are in the 1400-1500 rating range, compared to only 10% in the overall dataset. Without much evidence, since Lichess doesn't specify provisional ratings in the PGN data, my hypothesis is that players tend to play correspondence games once or twice before moving on, and since provisional ratings start at 1500, most games for this time control will be in that ballpark.

Going forward I'll probably exclude correspondence games from time-control based analysis. It just doesn't seem to add much.

## Conclusion

While the idea that UltraBullet and Bullet games attract more experienced players over beginners isn't exactly a novel concept, I find it interesting to see the standard learning progression of players (through what openings they use) and then see that the same progression doesn't apply in high speed games. It makes sense, but I find it cool to visualize.

## Data

The data for these charts can be found here:

* [Combined Time Controls]({{ base.url | prepend: site.url }}/assets/data/eco_category_by_rating.tsv)
* [Split Time Controls]({{ base.url | prepend: site.url }}/assets/data/eco_category_by_rating_and_timecontrol.tsv)

These were created using the tool in this repository: [Chess Analytics](https://github.com/samgoldman/chess_analytics), which uses data from the Lichess database.

<script>
    init_post('{{ base.url | prepend: site.url }}');
</script>