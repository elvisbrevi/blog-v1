---
title: "Advent of Code 2015, Day 2: I Was Told There Would Be No Math"
date: "2023-12-06 18:35:21"
description: "The Puzzle Part One:
The elves are running low on wrapping paper, and so they need to submit an order for more. They have a list of the dimensions (length l, width w, and height h) of each present, and only want to order exactly as much as they need...."
tags: ["adventofcode2015"]
cover: "https://cdn.hashnode.com/res/hashnode/image/upload/v1701887652025/152a0e54-85aa-48cb-ad82-d6c2a6845a49.png"
---

# Advent of Code 2015, Day 2: I Was Told There Would Be No Math

## The Puzzle Part One:

The elves are running low on wrapping paper, and so they need to submit an order for more. They have a list of the dimensions (length `l`, width `w`, and height `h`) of each present, and only want to order exactly as much as they need.

Fortunately, every present is a box (a perfect [right rectangular prism](https://en.wikipedia.org/wiki/Cuboid#Rectangular_cuboid)), which makes calculating the required wrapping paper for each gift a little easier: find the surface area of the box, which is `2*l*w + 2*w*h + 2*h*l`. The elves also need a little extra paper for each present: the area of the smallest side.

For example:

* A present with dimensions `2x3x4` requires `2*6 + 2*12 + 2*8 = 52` square feet of wrapping paper plus `6` square feet of slack, for a total of `58` square feet.
    
* A present with dimensions `1x1x10` requires `2*1 + 2*10 + 2*10 = 42` square feet of wrapping paper plus `1` square foot of slack, for a total of `43` square feet.
    

All numbers in the elves' list are in feet. How many total *square feet of wrapping paper* should they order?

## My Solution:

* I create a file `Input.rs` the module for storing input of puzzles, and read this in `sizes_string` variable.
    
* In `sizes_vec` stored input separate by break lines ('\\n') in a Vec of str.
    
* for each size in size\_vec:
    
    * first trim the string
        
    * then convert the string "2x4x6" in a Vec of numbers \[2, 4, 6\].
        
    * create an area vector for storing the area of each group of size, multiply by two because those are rectangles.
        
    * finally, I obtained the smallest area, of the previous vec divide for two because is a rectangle and I need only one face.
        
    * and sum areas values and smallest\_face in every iteration.
        

```rust
mod input;

fn main() {
    let mut total_paper = 0;

    let sizes_string = input::get_sizes();
    let sizes_vec: Vec<&str> = sizes_string.split('\n').collect();

    for sizes in sizes_vec {
        let sizes_trimmed = sizes.trim();
        let sizes_i32: Vec<i32> = sizes_trimmed
            .split('x')
            .map(|s| s.parse::<i32>().unwrap())
            .collect();

        let areas = vec![
            2 * sizes_i32[0] * sizes_i32[1],
            2 * sizes_i32[1] * sizes_i32[2],
            2 * sizes_i32[2] * sizes_i32[0],
        ];

        let smallest_face = areas.iter().min().unwrap() / 2;
        total_paper += areas.iter().sum::<i32>() + smallest_face;
    }

    println!(
        "They need to order {} square feet of wrapping paper 🎁.",
        total_paper
    );
}
```

`Input.rs`

```rust
pub fn get_sizes() -> &'static str {
    "3x11x24
    13x5x19
    1x9x27
    24x8x21
    6x8x17
    19x18x22"
}
```

## Part Two:

The elves are also running low on the ribbon. Ribbon is all the same width, so they only have to worry about the length they need to order, which they would again like to be exact.

The ribbon required to wrap a present is the shortest distance around its sides, or the smallest perimeter of any one face. Each present also requires a bow made out of ribbon as well; the feet of ribbon required for the perfect bow is equal to the cubic feet of volume of the present. Don't ask how they tie the bow, though; they'll never tell.

For example:

* A present with dimensions `2x3x4` requires `2+2+3+3 = 10` feet of ribbon to wrap the present plus `2*3*4 = 24` feet of ribbon for the bow, for a total of `34` feet.
    
* A present with dimensions `1x1x10` requires `1+1+1+1 = 4` feet of ribbon to wrap the present plus `1*1*10 = 10` feet of ribbon for the bow, for a total of `14` feet.
    

How many total *feet of ribbon* should they order?

## My Solution:

The total ribbon needed is the sum of the perimeter plus the volume of sizes.

I create the `perimeter` from the sum of all `sizes_i32` values minus the highest value in this vec, multiplied by two. For `volume`, multiply all `sizes_i32` values. Then sum the `perimeter` and `volume` in every iteration for `total_ribbon`.

```rust
mod input;

fn main() {
    let mut total_paper = 0;
    let mut total_ribbon = 0;

    let sizes_string = input::get_sizes();
    let sizes_vec: Vec<&str> = sizes_string.split('\n').collect();

    for sizes in sizes_vec {
        let sizes_trimmed = sizes.trim();
        let sizes_i32: Vec<i32> = sizes_trimmed
            .split('x')
            .map(|s| s.parse::<i32>().unwrap())
            .collect();

        let areas = vec![
            2 * sizes_i32[0] * sizes_i32[1],
            2 * sizes_i32[1] * sizes_i32[2],
            2 * sizes_i32[2] * sizes_i32[0],
        ];

        let smallest_face = areas.iter().min().unwrap() / 2;
        total_paper += areas.iter().sum::<i32>() + smallest_face;

        // perimeter
        let sizes_sum = sizes_i32.iter().sum::<i32>();
        let perimeter = 2 * (sizes_sum - sizes_i32.iter().max().unwrap());

        // volume
        let mut volume = 1;
        for size in sizes_i32 {
            volume *= size
        }

        total_ribbon += volume + perimeter;
    }

    println!(
        "They need to order {} square feet of wrapping paper 🎁.",
        total_paper
    );
    println!("We need {} feet of ribbon in total 🎀.", total_ribbon);
}
```

## Updated!

I refactored the code because I learned that using the `unwrap()` function is not a good practice.

* remove `unwarp()` from `.map(|s| s.parse::<i32>().unwrap()` operation because parse eventually can fail, and instead declare `sizes_i32_result` variable that stores a `Result<Vec<i32>, _>`.
    
* then I get the `ok()` value from the `sizes_i32_result` variable and assign it to the `sizes_i32` variable.
    
* then I removed the `unwrap()` function from `areas.iter().min()` and `areas.iter().max()` and change it to `if let Some()`.
    
* in all cases, I could use a `match` to catch an error, but that would be over-engineering because in this case, I know the input, and I know that no returning an `Error Result` or a `None Option`.
    

```rust
mod input;

fn main() {
    let mut total_paper = 0;
    let mut total_ribbon = 0;

    let sizes_string = input::get_sizes();
    let sizes_vec: Vec<&str> = sizes_string.split('\n').collect();

    for sizes in sizes_vec {
        let sizes_trimmed = sizes.trim();
        // try to parse map and get the result
        let sizes_i32_result: Result<Vec<i32>, _> =
            sizes_trimmed.split('x').map(|s| s.parse::<i32>()).collect();

        let mut sizes_i32 = vec![];
        // get the ok() value of result
        if let Some(result) = sizes_i32_result.ok() {
            sizes_i32 = result;
        }

        let areas = vec![
            2 * sizes_i32[0] * sizes_i32[1],
            2 * sizes_i32[1] * sizes_i32[2],
            2 * sizes_i32[2] * sizes_i32[0],
        ];

        // get the Some value
        if let Some(min) = areas.iter().min() {
            let smallest_face = min / 2;
            total_paper += areas.iter().sum::<i32>() + smallest_face;
        }

        // perimeter
        let sizes_sum = sizes_i32.iter().sum::<i32>();
        let mut perimeter = 0;
        // get the Some value
        if let Some(max) = sizes_i32.iter().max() {
            perimeter = 2 * (sizes_sum - max);
        }

        // volume
        let mut volume = 1;
        for size in sizes_i32 {
            volume *= size
        }

        total_ribbon += volume + perimeter;
    }

    println!(
        "They need to order {} square feet of wrapping paper 🎁.",
        total_paper
    );
    println!("We need {} feet of ribbon in total 🎀.", total_ribbon);
}
```