---
title: "Analysis of ECO Category Usage by Player Rating and Time Control"
layout: d3_post
date: 2021-01-24 00:00
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
<script src="{{ base.url | prepend: site.url }}/assets/javascript/posts/2021-01-31-eco-by-rating-timecontrol.js"></script>


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

Now, onto the charts!

## All Time Controls
<svg id="chart-all"></svg>

This chart shows ECO main category usage by game rating

## UltraBullet
<svg id="chart-ultrabullet"></svg>
## Bullet
<svg id="chart-bullet"></svg>
## Blitz
<svg id="chart-blitz"></svg>
## Rapid
<svg id="chart-rapid"></svg>
## Classical
<svg id="chart-classical"></svg>
## Correspondence
<svg id="chart-correspondence"></svg>

While you can *sort* *of* see similar patterns in this dataset, it's pretty obvious that the relatively small sample size makes this data not so helpful. One interesting thing here though is is the distribution of the game counts - over a third of all correspondence games are in the 1400-1500 rating range, compared to only 10% in the overall dataset. Without much evidence, since Lichess doesn't specify provisional ratings in the PGN data, my hypothesis is that players tend to play correspondence games once or twice before moving on, and since provisional ratings start at 1500, most games for this time control will be in that ballpark.

Overall, I'll probably exclude correspondence games from future time-control based analysis. It just doesn't seem to add much.


## Conclusion


<script>
    init_post('{{ base.url | prepend: site.url }}');
</script>