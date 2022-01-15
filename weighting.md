# Problem Statement

Skiers submit reviews of trail conditions after skiing at a particular venue.  They rank the the venue based on the ski technique used (classical or skate) and use a 5-point scale (running: excellent (5), good (4), fair (3), poor (2), or no-go (1)).  Skiers may also include an optional comment detailing conditions.

We do not receive reviews on any regular cadence and more popular venues generally will git more frequent -- and thus more up-to-date -- reviews.  A popular venue may have multiple reviews for the current day (giving a signal with strong confidence) and a less-popular venue may have only one review from over a week ago.

Currently reviews are presented by venue, ordered newest to oldest, including all details in the same type face (color, weight, size).  This format does not lend itself to good analyis of the data for practical questions like: where should I go skiing right now?

What we need is an effective way to visualy summarize all of the current review data and distill each venue down to a discreet score that can be used for easy ranking.  Because of the variables in the data we are interested in showing both a best-estimate current score for a venue _and_ the confidence we have in that score (given the age of the data).

# Proposed Method

## Scoring

Newer reviews should always carry more weight than older reviews but we can't entirely discount older reviews.  To account for this, let's imagine a hypothetical week (days of the week/month don't really matter).

```
| Today | -1 day | -2 days | -3 days | -4 days | -5 days | -6 days |
```

Let's say we've gotten the follow reviews (we'll ignore technique for this):

```
| Today | -1 day | -2 days | -3 days | -4 days | -5 days | -6 days |
|   4   |    5   |         |         |         |    1    |    2    |
|       |    4   |         |         |         |         |    1    |
```

Looking at this, we can see that our latest reviews are higher than our older ones.  These are theoretically more accurate so we'll give them higher weight by stepping through the days.  Let's start with today:

1. We encounter a score of `4` "today", so we add that to our list of scores encountered: `[4]`
1. We take our scores encountered and add a copy of them to the full tally: `[4]`
1. We encounter a score of `5` for "one day ago", so we add that to our list of scores encountered: `[4, 5]`
1. We _also_ encounter a score of `4` for "one day ago", so we add that to our list of scores encountered: `[4, 5, 4]`
1. We take our scores encountered and add a copy of them to the full tally:" `[4, 4, 5, 4]`

At this point, we can see that "today's" score is represented twice, while the "one day ago" scores are only expressed once:

```
   Tally => [4, 4, 5, 4]
Days Ago => [0, 0, 1, 1]
```

We continue stepping back days:

6. We encounter _no_ scores for "two days ago", so we leave the scores encountered untouched: `[4, 5, 4`]
6. We _still_ put a copy of the scores encountered so far onto the tally for the day, thus giving more weight to those new scores: [`4, 4, 5, 5, 4, 5, 4]`
6. We have a few more days with no scores, but we will continue to weight the newer scores, thus we see the tally with dates they represent.  When we're at -4 days ago, our tally, and the days of the scores represented is:
```
   Tally => [4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4]
Days Ago => [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1]
```

So, we can see that the "today" score is represented 5 times and each of "one day ago" scores is represented 4 times.

9. We encounter a score of `1` for "five days ago", so we add that to our list of scores encountered: `[4, 5, 4, 1]`
9. We take our scores encountered and add a copy of them to the full tally: `[4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 1]`
9. We encounter a score of `2` for "six days ago", so we add that to our list of scores encountered: `[4, 5, 4, 1, 2]`
9. We _also_ encounter a score of `1` for "one day ago", so we add that to our list of scores encountered: `[4, 5, 4, 1, 2, 1]`
9. We take our scores encountered and add a copy of them to the full tally: `[4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 1, 4, 5, 4, 1, 2, 1]`

We've now covered all of the days data and we can see the full tally list, along with the days represented:

```
   Tally => [4, 4, 5, 5, 4, 5, 4, 4, 5, 4, 4, 5, 4, 4, 5, 4, 1, 4, 5, 4, 1, 2, 1]
Days Ago => [0, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 5, 0, 1, 1, 5, 6, 6]
```

Now we begin to see the weighting take effect.  Here's the effective weight of our day-scores:

```
 day 0, score 4 = 7x
day -1, score 5 = 6x
day -1, score 4 = 6x
day -5, score 1 = 2x
day -6, score 2 = 1x
day -6, score 1 = 1x
```

So, as you can see, today's score exerts a much stronger pull than the scores from 6 days ago.  At this point, we just calculate a simple average:

```
Tally Sum of 88 = [4 + 4 + 5 + 5 + 4 + 5 + 4 + 4 + 5 + 4 + 4 + 5 + 4 + 4 + 5 + 4 + 1 + 4 + 5 + 4 + 1 + 2 + 1]
Tally Count of 23

Calculated score = 3.8 = 88 / 23
```

## Presentation

The format I settled on for presenting the data is:

 * A simple, tabular layout
 * One line per venue
 * Display venue name, calculated score, and date of newest review (e.g. `| Ski Venue    | 3.5 | 4 days ago |`)
 * Color code the line by score (rounded up) using (5 = blue, 4 = green, 3 = yellow, 2 = orange, 1 = red)
 * Indicate _confidence_ in the data (how old it is) by shading the particular color band darker as it ages

# Preview

You can see the results of [this experiment](https://theraccoonbear.github.io/site-customizations/improved.html), alongside the [original setup](https://theraccoonbear.github.io/site-customizations/original.html).

The code in question [begins here](https://github.com/theraccoonbear/site-customizations/blob/a8fba2c948a099180f6ad3498e2e71fc853a8e89/madnorski.org.js#L154).