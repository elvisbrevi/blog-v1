---
title: "Advent of Code 2015, Day 6: Probably a Fire Hazard"
date: "2023-12-15 14:34:28"
description: "Puzzle Part One:
Because your neighbors keep defeating you in the holiday house decorating contest year after year, you've decided to deploy one million lights in a 1000x1000 grid.
Furthermore, because you've been especially nice this year, Santa has..."
tags: ["adventofcode2015"]
cover: "/images/covers/aoc-day-6-cover.png"
---

# Advent of Code 2015, Day 6: Probably a Fire Hazard

## Puzzle Part One:

Because your neighbors keep defeating you in the holiday house decorating contest year after year, you've decided to deploy one million lights in a 1000x1000 grid.

Furthermore, because you've been especially nice this year, Santa has mailed you instructions on how to display the ideal lighting configuration.

Lights in your grid are numbered from 0 to 999 in each direction; the lights at each corner are at `0,0`, `0,999`, `999,999`, and `999,0`. The instructions include whether to `turn on`, `turn off`, or `toggle` various inclusive ranges given as coordinate pairs. Each coordinate pair represents opposite corners of a rectangle, inclusive; a coordinate pair like `0,0 through 2,2` therefore refers to 9 lights in a 3x3 square. The lights all start turned off.

To defeat your neighbors this year, all you have to do is set up your lights by doing the instructions Santa sent you in order.

For example:

* `turn on 0,0 through 999,999` would turn on (or leave on) every light.
    
* `toggle 0,0 through 999,0` would toggle the first line of 1000 lights, turning off the ones that were on, and turning on the ones that were off.
    
* `turn off 499,499 through 500,500` would turn off (or leave off) the middle four lights.
    

After following the instructions, *how many lights are lit*?

## My Solution

For this time I added a dependency in `Cargo.toml` file for manipulating regex patterns.

```ini
[package]
name = "day-6"
version = "0.1.0"
edition = "2021"

[dependencies]
regex = "1.5.4"
```

In `main.rs`:

* It imports the `regex` module for working with regular expressions.
    
* An `Action` enum with three variants (`Toggle`, `TurnOff`, `TurnOn`) is defined. Each variant represents an action that can be performed on the lights. An `execute` method is implemented to change the state of a light according to the action.
    
* **Main Function** `main()`**:**
    
    * Initializes a `lights` matrix representing a 1000x1000 grid of lights, all initially turned off.
        
    * Reads input instructions, determining the action (`Toggle`, `TurnOff`, or `TurnOn`) for each line.
        
    * Uses regular expressions to extract coordinates from the instructions.
        
    * Calls the `do_something` function to apply the determined action to the specified lights.
        
* **Function** `do_something()`**:**
    
    * Modifies the lights matrix according to the action and given coordinates.
        
* At the end of the `main` process, counts and displays the number of lights turned on.
    

```rust
mod input;

use regex::Regex;

enum Action {
    Toggle,
    TurnOff,
    TurnOn,
}

impl Action {
    fn execute(&self, state: &mut i8) {
        match self {
            Action::Toggle => {
                if *state == 0 {
                    *state = 1
                } else {
                    *state = 0
                }
            }
            Action::TurnOff => *state = 0,
            Action::TurnOn => *state = 1,
        };
    }
}

fn main() {
    let row_num = 1000;
    let col_num = 1000;
    let mut lights = vec![vec![0; col_num]; row_num];
    let input: Vec<&str> = input::get_input().split("\n").collect();

    for i in 0..input.len() {
        let action = if input[i].contains("turn off") {
            Action::TurnOff
        } else if input[i].contains("turn on") {
            Action::TurnOn
        } else {
            Action::Toggle
        };

        // extract positions
        let trimmed_input = &input[i]
            .trim()
            .replace("toggle", "")
            .replace("turn off", "")
            .replace("turn on", "")
            .replace("through", "");

        let reg = Regex::new(r"\d+,\d+").unwrap();
        let positions_raw: Vec<&str> = reg
            .find_iter(&trimmed_input)
            .map(|mat| mat.as_str())
            .collect();

        let from: Vec<i32> = positions_raw[0]
            .split(',')
            .filter_map(|s| s.trim().parse::<i32>().ok())
            .collect();

        let to: Vec<i32> = positions_raw[1]
            .split(',')
            .filter_map(|s| s.trim().parse::<i32>().ok())
            .collect();

        do_something(action, &mut lights, from, to);
    }

    let mut count_on: i32 = 0;
    for x in 0..row_num {
        for y in 0..col_num {
            count_on += lights[x][y] as i32;
        }
    }
    println!("{} lights are on.", count_on);
}

fn do_something(action: Action, lights: &mut Vec<Vec<i8>>, from: Vec<i32>, to: Vec<i32>) {
    for x in from[1]..=to[1] {
        for y in from[0]..=to[0] {
            action.execute(&mut lights[x as usize][y as usize]);
        }
    }
}
```

`input.rs`

```rust
pub fn get_input() -> &'static str {
    "turn on 599,989 through 806,993
    turn on 376,415 through 768,548
    turn on 606,361 through 892,600
    turn off 448,208 through 645,684
    toggle 50,472 through 452,788
    toggle 205,417 through 703,826
    toggle 533,331 through 906,873
    toggle 857,493 through 989,970
    turn off 631,950 through 894,975
    turn on 565,226 through 944,880
    turn on 214,319 through 805,722
    toggle 532,276 through 636,847
    toggle 619,80 through 689,507
    turn on 390,706 through 884,722
    toggle 17,634 through 537,766
    toggle 706,440 through 834,441
    toggle 318,207 through 499,530
    toggle 698,185 through 830,343
    toggle 566,679 through 744,716"
}
```

## Puzzle Part Two:

You just finish implementing your winning light pattern when you realize you mistranslated Santa's message from Ancient Nordic Elvish.

The light grid you bought actually has individual brightness controls; each light can have a brightness of zero or more. The lights all start at zero.

The phrase `turn on` actually means that you should increase the brightness of those lights by `1`.

The phrase `turn off` actually means that you should decrease the brightness of those lights by `1`, to a minimum of zero.

The phrase `toggle` actually means that you should increase the brightness of those lights by `2`.

What is the *total brightness* of all lights combined after following Santa's instructions?

For example:

* `turn on 0,0 through 0,0` would increase the total brightness by `1`.
    
* `toggle 0,0 through 999,999` would increase the total brightness by `2000000`.
    

## My Solution:

The main difference in the `Action` implementation in this code compared to the previous one lies in how the `Toggle`, `TurnOff`, and `TurnOn` actions are handled:

1. **Toggle:** In the previous code, `Toggle` switched a light's state from on (1) to off (0) or vice versa. In this code, `Toggle` increases the light's state by 2 units. This suggests that the light's state is no longer binary (on/off), but might represent brightness levels.
    
2. **TurnOff:** In the previous code, `TurnOff` simply set the light's state to 0 (off). In this code, `TurnOff` decreases the light's state by 1 unit, but only if the current state is greater than 0. This implies that it dims the light instead of turning it off completely, provided the light is not already completely off.
    
3. **TurnOn:** In the previous code, `TurnOn` changed the state to 1 (on). In this code, `TurnOn` increases the light's state by 1 unit, suggesting that it increases the light's brightness.
    

In summary, the main difference is that the new code seems to work with a concept of "brightness" for the lights, where lights can have various levels of intensity instead of simply being on or off.

```rust
mod input;

use regex::Regex;

enum Action {
    Toggle,
    TurnOff,
    TurnOn,
}

impl Action {
    fn execute(&self, state: &mut i8) {
        match self {
            Action::Toggle => *state += 2,
            Action::TurnOff => {
                if *state > 0 {
                    *state -= 1
                }
            }
            Action::TurnOn => *state += 1,
        };
    }
}

fn main() {
    let row_num = 1000;
    let col_num = 1000;
    let mut lights = vec![vec![0; col_num]; row_num];
    let input: Vec<&str> = input::get_input().split("\n").collect();

    for i in 0..input.len() {
        let action = if input[i].contains("turn off") {
            Action::TurnOff
        } else if input[i].contains("turn on") {
            Action::TurnOn
        } else {
            Action::Toggle
        };

        // extract positions
        let trimmed_input = &input[i]
            .trim()
            .replace("toggle", "")
            .replace("turn off", "")
            .replace("turn on", "")
            .replace("through", "");

        let reg = Regex::new(r"\d+,\d+").unwrap();
        let positions_raw: Vec<&str> = reg
            .find_iter(&trimmed_input)
            .map(|mat| mat.as_str())
            .collect();

        let from: Vec<i32> = positions_raw[0]
            .split(',')
            .filter_map(|s| s.trim().parse::<i32>().ok())
            .collect();

        let to: Vec<i32> = positions_raw[1]
            .split(',')
            .filter_map(|s| s.trim().parse::<i32>().ok())
            .collect();

        do_something(action, &mut lights, from, to);
    }

    let mut count_on: i32 = 0;
    for x in 0..row_num {
        for y in 0..col_num {
            count_on += lights[x][y] as i32;
        }
    }
    println!(
        "The total brightness of all lights combined after following Santa's instructions is {}",
        count_on
    );
}

fn do_something(action: Action, lights: &mut Vec<Vec<i8>>, from: Vec<i32>, to: Vec<i32>) {
    for x in from[1]..=to[1] {
        for y in from[0]..=to[0] {
            action.execute(&mut lights[x as usize][y as usize]);
        }
    }
}
```