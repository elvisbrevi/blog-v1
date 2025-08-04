---
title: "Advent of Code 2015, Day 3: Perfectly Spherical Houses in a Vacuum"
date: "2023-12-07 21:05:53"
description: "Puzzle Part One:
Santa is delivering presents to an infinite two-dimensional grid of houses.
He begins by delivering a present to the house at his starting location, and then an elf at the North Pole calls him via radio and tells him where to move ne..."
tags: ["adventofcode2015"]
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1701982955506/68506e8a-dd52-4f3c-bf4b-077cc31829bd.png"
---

# Advent of Code 2015, Day 3: Perfectly Spherical Houses in a Vacuum

## Puzzle Part One:

Santa is delivering presents to an infinite two-dimensional grid of houses.

He begins by delivering a present to the house at his starting location, and then an elf at the North Pole calls him via radio and tells him where to move next. Moves are always exactly one house to the north (`^`), south (`v`), east (`>`), or west (`<`). After each move, he delivers another present to the house at his new location.

However, the elf back at the north pole has had a little too much eggnog, and so his directions are a little off, and Santa ends up visiting some houses more than once. How many houses receive *at least one present*?

For example:

* `>` delivers presents to `2` houses: one at the starting location, and one to the east.
    
* `^>v<` delivers presents to `4` houses in a square, including twice to the house at his starting/ending location.
    
* `^v^v^v^v^v` delivers a bunch of presents to some very lucky children at only `2` houses.
    

## My Solution:

* First, I created a mod to store the extensive original input.
    
* Then, I obtained the character sequence from the input, which represents Santa's movement directions, and stored it in the variable `locations`.
    
* I created the variable `visited_houses` to keep track of all the houses visited by Santa.
    
* Each house is represented by a tuple `(i32, i32)`, which are coordinates on a 2D plane.
    
* Next, I iterated over each character in `locations`, and depending on the character (direction), I updated Santa's location.
    
* I then checked if Santa's location was not already in the `visited_houses` list. If it wasn't, I added it.
    
* Finally, I printed the total number of unique houses visited by Santa.
    

```rust
mod input;

fn main() {
    let locations = input::get_input();
    let mut visited_houses: Vec<(i32, i32)> = vec![(0, 0)];
    let mut santa_location = (0, 0);

    for location in locations.chars() {
        match location {
            '^' => santa_location.1 += -1,
            'v' => santa_location.1 += 1,
            '>' => santa_location.0 += 1,
            '<' => santa_location.0 += -1,
            _ => {}
        }

        if !visited_houses.iter().any(|&i| i == santa_location) {
            visited_houses.push(santa_location);
        }
    }

    println!(
        "Santa 🎅 ended up delivering presents 🎁 to {:?} houses 🏠! ",
        visited_houses.len()
    );
}
```

`input.rs`

```rust
pub fn get_input() -> &'static str {
    "^^<<v<<v><v^^<><>^^<v<v^>>^^^><^>v^>v><><><<vv^^"
}
```

## Puzzle Part Two:

The next year, to speed up the process, Santa creates a robot version of himself, *Robo-Santa*, to deliver presents with him.

Santa and Robo-Santa start at the same location (delivering two presents to the same starting house), then take turns moving based on instructions from the elf, who is eggnoggedly reading from the same script as the previous year.

This year, how many houses receive *at least one present*?

For example:

* `^v` delivers presents to `3` houses, because Santa goes north, and then Robo-Santa goes south.
    
* `^>v<` now delivers presents to `3` houses, and Santa and Robo-Santa end up back where they started.
    
* `^v^v^v^v^v` now delivers presents to `11` houses, with Santa going one direction and Robo-Santa going the other.
    

## My Solution:

* I added a robot helper to assist Santa, indicated by using two locations in the `current_location` vector.
    
* I changed the `current_location` variable to be a vector containing two tuples, one for Santa and one for the robot, unlike the original code where it was just one tuple for Santa.
    
* I implemented an alternating delivery mechanism using the `enumerate` method on the `locations.chars()` iterator, which alternates between Santa and the robot for each move.
    
* I used the calculation `index % 2` to determine who makes each delivery, Santa or the robot.
    
* I modified the movement logic within the `match` block to update the location of either Santa or the robot based on who is delivering at that moment.
    
* I ensured the `visited_houses` list is updated with the current location of either Santa or the robot, depending on who is making the delivery.
    
* Finally, I updated the print statement at the end to reflect that both Santa and his robot helper are involved in delivering presents.
    

```rust
mod input;

fn main() {
    let locations = input::get_input();
    let mut visited_houses: Vec<(i32, i32)> = vec![(0, 0)];
    let mut current_location = vec![(0, 0), (0, 0)];

    for (index, location) in locations.chars().enumerate() {
        let delivery = index % 2;

        match location {
            '^' => current_location[delivery].1 += -1,
            'v' => current_location[delivery].1 += 1,
            '>' => current_location[delivery].0 += 1,
            '<' => current_location[delivery].0 += -1,
            _ => {}
        }

        if !visited_houses
            .iter()
            .any(|&i| i == current_location[delivery])
        {
            visited_houses.push(current_location[delivery]);
        }
    }

    println!(
        "Santa 🎅 and his robot 🤖 ended up delivering presents 🎁 to {:?} houses 🏠!",
        visited_houses.len()
    );
}
```