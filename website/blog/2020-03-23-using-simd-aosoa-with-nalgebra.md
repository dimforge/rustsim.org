---
title: SIMD Array-of-Structures-of-Arrays in nalgebra and comparison with ultraviolet
author: Sébastien Crozet
---

__Hello everyone!__

In this post I'd like to introduce the next major change that will be released in **nalgebra** at the end of this month (March 2020).
This change is about adding the support for SIMD AoSoA to **nalgebra**. I'll explain what I mean by SIMD AoSoA (Array-of-Structures-of-Arrays with explicit SIMD) and how it relates
to SoA (Structure-of-Arrays) and AoS (Array-of-Structures). To give you an idea, SIMD AoSoA is actually what the recent [ultraviolet](https://crates.io/crates/ultraviolet)
crate has been using to achieve its amazing performances.


Here is a benchmark including the next (to-be-released) version of __nalgebra__. The best times within a 2.5% range of the minimum of each row are highlighted.
Here, the __ultraviolet__ column uses the non-_wide_ types
of `ultraviolet` (`Vec2`, `Mat2`, `Isometry3`, etc.) while the column __ultraviolet_f32x4__ uses its _wide_ types (`Wec2`, `Wat2`, `WIsometry3`, etc.):

| benchmark                      |   nalgebra_f32x4   |   ultraviolet_f32x4   |      nalgebra   |   ultraviolet   |         glam   |           vek   |        cgmath   |        euclid   |
|--------------------------------|--------------------|-----------------------|-----------------|-----------------|----------------|-----------------|-----------------|-----------------|
| euler 2d x10000                |       __2.992 us__ |          __3.014 us__ |      9.028 us   |       5.28 us   |     5.166 us   |      5.258 us   |      5.259 us   |      8.631 us   |
| euler 3d x10000                |       __4.546 us__ |          __4.587 us__ |      17.84 us   |      18.34 us   |     6.311 us   |      17.57 us   |      18.04 us   |      17.97 us   |
| isometry transform point2 x1   |      __8.1024 ns__ |           8.6412 ns   |    23.4637 ns   |    54.5840 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point2 x100 |       __2.801 us__ |          __2.837 us__ |      3.109 us   |      4.918 us   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point3 x1   |     __16.1052 ns__ |          20.6723 ns   |    61.8824 ns   |   330.1143 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point3 x100 |       __4.515 us__ |            4.794 us   |      6.546 us   |      18.19 us   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry2 inverse              |      __7.3004 ns__ |           7.7692 ns   |    24.8090 ns   |    59.3838 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry2 mul isometry2        |     __12.3278 ns__ |          12.7816 ns   |    34.5714 ns   |   110.7837 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry3 inverse              |     __17.1929 ns__ |          21.4199 ns   |    63.9200 ns   |   212.2193 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry3 mul isometry3        |     __27.3814 ns__ |          40.3955 ns   |   100.4628 ns   |   447.4780 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| matrix2 determinant            |          N/A       |             N/A       |    16.0198 ns   |       N/A       | __11.2070 ns__ |    15.8621 ns   |    16.0906 ns   |       N/A       |
| matrix2 inverse                |          N/A       |             N/A       |    26.5165 ns   |       N/A       | __18.9069 ns__ |       N/A       |    26.2478 ns   |       N/A       |
| matrix2 mul matrix2            |       12.5352 ns   |        __10.7532 ns__ |    25.4533 ns   |    25.7148 ns   |   16.3060 ns   |   301.3775 ns   |    25.6988 ns   |       N/A       |
| matrix2 mul vector2 x1         |      __7.1695 ns__ |           8.0907 ns   |    23.0932 ns   |    24.4506 ns   |   16.4141 ns   |    93.3601 ns   |    25.0774 ns   |       N/A       |
| matrix2 mul vector2 x100       |       __2.684 us__ |          __2.698 us__ |      3.137 us   |      3.174 us   |     2.828 us   |      9.558 us   |      3.122 us   |       N/A       |
| matrix2 transpose              |      __6.4984 ns__ |             N/A       |    11.0205 ns   |       N/A       |   10.9890 ns   |    10.8180 ns   |    10.3812 ns   |       N/A       |
| matrix3 determinant            |          N/A       |             N/A       |    33.1252 ns   |       N/A       | __22.2592 ns__ |    31.8128 ns   |    31.7086 ns   |       N/A       |
| matrix3 inverse                |          N/A       |        __26.7493 ns__ |    92.8270 ns   |   284.1032 ns   |   93.5328 ns   |       N/A       |    82.3820 ns   |       N/A       |
| matrix3 mul matrix3            |       0.02883 us   |        __0.02638 us__ |    0.09077 us   |    0.08728 us   |    0.0474 us   |      1.005 us   |    0.08579 us   |       N/A       |
| matrix3 mul vector3 x1         |     __13.7548 ns__ |        __13.6309 ns__ |    46.4205 ns   |    46.5016 ns   |   21.5466 ns   |   317.8168 ns   |    47.3542 ns   |       N/A       |
| matrix3 mul vector3 x100       |       __4.835 us__ |          __4.917 us__ |      6.138 us   |      6.261 us   |     6.633 us   |      32.93 us   |      6.297 us   |       N/A       |
| matrix3 transpose              |     __15.7501 ns__ |        __15.4925 ns__ |    52.7300 ns   |    53.0845 ns   |   24.1975 ns   |    55.4793 ns   |    52.0874 ns   |       N/A       |
| matrix4 determinant            |          N/A       |             N/A       |   690.7027 ns   |       N/A       | __85.5778 ns__ |   176.1770 ns   |   110.6990 ns   |   174.6754 ns   |
| matrix4 inverse                |          N/A       |        __0.08342 us__ |     0.5282 us   |     0.3953 us   |     0.257 us   |      3.792 us   |     0.5096 us   |      0.651 us   |
| matrix4 mul matrix4            |     __0.06897 us__ |        __0.07068 us__ |     0.1285 us   |     0.1493 us   |   0.07653 us   |      2.024 us   |     0.1185 us   |     0.1152 us   |
| matrix4 mul vector4 x1         |     __21.1243 ns__ |        __20.6690 ns__ |    31.5352 ns   |    30.3570 ns   |   24.7876 ns   |   512.0570 ns   |    30.9776 ns   |       N/A       |
| matrix4 mul vector4 x100       |       __7.595 us__ |          __7.662 us__ |      8.472 us   |      8.379 us   |     7.823 us   |      51.42 us   |      8.366 us   |       N/A       |
| matrix4 transpose              |     __26.2948 ns__ |          27.1962 ns   |   103.0829 ns   |   101.3104 ns   |   29.2236 ns   |   105.6003 ns   |    98.1151 ns   |       N/A       |
| quaternion conjugate           |      __6.6130 ns__ |         __6.6179 ns__ |    24.5468 ns   |    25.5657 ns   |   11.1447 ns   |    24.2229 ns   |    25.7246 ns   |    24.9413 ns   |
| quaternion mul quaternion      |     __14.6380 ns__ |          16.6299 ns   |    39.3908 ns   |   274.4676 ns   |   27.3533 ns   |    62.0697 ns   |    35.0299 ns   |    59.5286 ns   |
| quaternion mul vector3         |     __14.7579 ns__ |          18.5064 ns   |    52.7303 ns   |   170.8328 ns   |   44.1336 ns   |    81.1243 ns   |    52.5011 ns   |    54.1958 ns   |
| transform point2 x1            |          N/A       |             N/A       |    36.6350 ns   |       N/A       | __25.6516 ns__ |   337.3442 ns   |    30.5781 ns   |    28.5532 ns   |
| transform point2 x100          |          N/A       |             N/A       |      5.475 us   |       N/A       |     5.732 us   |      33.81 us   |      5.118 us   |    __4.003 us__ |
| transform point3 x1            |          N/A       |             N/A       |    66.3694 ns   |       N/A       | __24.0601 ns__ |   517.9224 ns   |    67.8205 ns   |    68.0836 ns   |
| transform point3 x100          |          N/A       |             N/A       |      9.403 us   |       N/A       |   __7.824 us__ |       52.5 us   |      9.559 us   |      10.07 us   |
| transform vector2 x1           |          N/A       |             N/A       |    32.5667 ns   |       N/A       | __21.3971 ns__ |   330.5713 ns   |       N/A       |    23.5693 ns   |
| transform vector2 x100         |          N/A       |             N/A       |      5.392 us   |       N/A       |     5.579 us   |      33.45 us   |       N/A       |    __3.909 us__ |
| transform vector3 x1           |          N/A       |             N/A       |    55.3600 ns   |       N/A       | __24.3628 ns__ |   515.1730 ns   |    59.1129 ns   |    47.9383 ns   |
| transform vector3 x100         |          N/A       |             N/A       |      9.185 us   |       N/A       |   __7.958 us__ |      52.39 us   |      8.992 us   |      8.665 us   |
| transform2 inverse             |          N/A       |             N/A       |    87.2060 ns   |       N/A       |      N/A       |       N/A       |       N/A       |  __45.0272 ns__ |
| transform2 mul transform2      |          N/A       |             N/A       |    87.5702 ns   |       N/A       |      N/A       |       N/A       |       N/A       |  __40.1995 ns__ |
| transform3 inverse             |          N/A       |             N/A       | __542.8401 ns__ |       N/A       |      N/A       |       N/A       |       N/A       |   748.2648 ns   |
| transform3 mul transform3d     |          N/A       |             N/A       | __118.0659 ns__ |       N/A       |      N/A       |       N/A       |       N/A       | __115.3294 ns__ |
| vector3 cross                  |        6.4232 ns   |         __6.2395 ns__ |    25.0006 ns   |    36.5961 ns   |   15.0303 ns   |    28.6082 ns   |    28.6343 ns   |    29.5467 ns   |
| vector3 dot                    |        6.6820 ns   |         __6.3391 ns__ |    25.5593 ns   |    26.1824 ns   |   13.6831 ns   |    25.4740 ns   |    25.9099 ns   |    26.1271 ns   |
| vector3 length                 |        5.3741 ns   |         __5.2332 ns__ |    20.5369 ns   |    34.2988 ns   |   20.5652 ns   |    20.6259 ns   |    20.9281 ns   |    20.6052 ns   |
| vector3 normalize              |     __15.5892 ns__ |        __15.6585 ns__ |    59.1804 ns   |    60.9510 ns   |   35.7763 ns   |    61.3666 ns   |    36.7304 ns   |    61.3199 ns   |

Please see the [last section](http://localhost:3000/blog/2020/03/23/using-simd-aosoa-with-nalgebra#benchmarks-of-rust-linear-algebra-crates) of this post for a more comprehensive benchmark (including the use of `f32x8` and `f32x16`
with nalgebra) and details about the benchmark conditions.

## What is AoSoA with explicit SIMD?
The data layout I call here __AoSoA with explicit SIMD__ (or __SIMD AoSoA__ for short) is a straightforward variant of the __AoSoA__ (Array-of-Structures-of-Arrays) layout which is itself a
combination of two more common layouts: __SoA__ (Structure-of-Arrays) and __AoS__ (Array-of-Structures). So let's see what is the difference
of all those layouts with the simple example using 3D vectors (vectors with three components `x, y, z`): given two arrays of
1024 3D vectors, we want to compute the sum of each pairs of vectors with the same index.

_Note:_ The explanations here are merely a superficial introduction of the AoS vs SoA vs AoSoA concepts. I just want to explain
 some of the differences and some of their advantages/disadvantages. I won't give any detailed analysis of the generated
assembly code after compiling the examples provided. The benchmarks at the end of this post will show the performance difference
between AoS and SIMD AoSoA. You may be interested by [that article too](https://software.intel.com/en-us/articles/memory-layout-transformations).

_Note 2:_ For iterating through the arrays, I'll be using explicit indices `for i in 0..1024` instead of iterators. This
is on purpose to make the number of iterations explicit and to make the code easier to understand for readers that are not
used to Rust iterators.

### Array-of-Structures (AoS)
The Array-of-Structures layout is the most common and intuitive layout. You define a structure as the aggregation of all its
fields. And multiple structures of the same type are simply stored one after the other inside of an array. Here is what our
3D vector would look like:

```rust
struct Vector3 {
    x: f32,
    y: f32,
    z: f32
}

/// An array containing 1024 vectors.
type SetOfVector3 = [Vector3; 1024];

fn add_arrays_of_vectors(a: &mut SetOfVector3, b: &SetOfVector3) {
    for i in 0..1024 {
        va.x += vb.x;
        va.y += vb.y;
        va.z += vb.z;
    }
}
```

Here, we need to iterate through each pair of vectors, one from each set, and execute our sum. This is arguably the most
intuitive way of doing this, but not necessarily the most efficient. All Rust linear algebra crates from this benchmark can work with this layout.

#### Pros of AoS
- It is easy to read/write/modify each vector individually.
- AoS are generally easier to reason with when designing algorithms.

#### Cons of AoS
- Not as efficient as other layouts when working on a large number of elements of the same type.

### Structure-of-Arrays (SoA)
The Structure-of-Arrays layout is less intuitive to work with because it will store each field of a struct into its own
array. Thus, our set of vector set would look like that:

```rust
struct SetOfVector3 {
    x: [f32; 1024],
    y: [f32; 1024],
    z: [f32; 1024],
}
```

These is no explicit `Vector3` structure here because they are all packed into the array. Accessing the components of the `i`-th
vector of the set means we access `set.x[i]`, `set.y[i]` and `set.z[i]`. With this structure, our vector sum becomes the following:

```rust
fn add_arrays_of_vectors(a: &mut SetOfVector3, b: &SetOfVector3) {
    for i in 0..1024 {
        a.x[i] += b.x[i];
    }

    for i in 0..1024 {
        a.y[i] += b.y[i];
    }

    for i in 0..1024 {
        a.z[i] += b.z[i];
    }
}
```

There is more code here than in our AoS example because we need to iterate on each components individually. However this
will be much more efficient than our AoS approach because this is extremely vectorization-friendly: the compiler will be 
able to group consecutive vector entries for each component, and use SIMD instructions to perform the 2, 4, 8, or even 16
additions at a time instead of a single one.

#### Pros of SoA
- Extremely fast.

#### Cons of SoA
- Algorithms need to be explicitly designed with SoA in mind to be efficient.
- Manipulating vectors individually is more difficult and can be less efficient than AoS.
- It is more difficult to think in terms of SoA than in terms of AoS.

### Array-of-Structures-of-Arrays (AoSoA)
Now let's combine both SoA and AoS to obtain: Array-of-Structures-of-Arrays (AoSoA). The idea is to first define a _wide_
3D vector, i.e., we pack several vectors into a single struct:

```rust
struct WideVector3 {
    x: [f32; 4],
    y: [f32; 4],
    z: [f32; 4],
}
```
The term _wide_ 3D vector is inspired from the terminology used in the [ultraviolet](https://crates.io/crates/ultraviolet) crate's documentation.
Here, our `WideVector3` actually represents 4 vectors laid out in a SoA fashion. If we want our set of vector to contain more than just
4 vectors, we can define an array of `WideVector3` (so we end up with an array of structure of array) with only `1024 / 4` elements
because each element already represent 4 vectors:

```rust
type SetOfWideVector3 = [WideVector3; 1024 / 4];
```

Our vector sum then becomes quite similar to the AoS approach, except that we have to add each 4 components in the inner
loop in an SoA fashion:

```rust
fn add_arrays_of_vectors(a: &mut SetOfWideVector3, b: &SetOfWideVector3) {
    for i in 0..1024 / 4 {
        // NOTE: each of those groups of four sums can be executed as
        // a single SIMD instruction.
        va[i].x[0] += vb[i].x[0];
        va[i].x[1] += vb[i].x[1];
        va[i].x[2] += vb[i].x[2];
        va[i].x[3] += vb[i].x[3];

        va[i].y[0] += vb[i].y[0];
        va[i].y[1] += vb[i].y[1];
        va[i].y[2] += vb[i].y[2];
        va[i].y[3] += vb[i].y[3];

        va[i].z[0] += vb[i].z[0];
        va[i].z[1] += vb[i].z[1];
        va[i].z[2] += vb[i].z[2];
        va[i].z[3] += vb[i].z[3];
    }
}
```

So with this data layout, we still achieve great performances because components are grouped by 4, and thus their sum can
easily be auto-vectorized to a single SIMD instruction. To manipulate an individual vector we first have to access the corresponding _wide_
vector, and then its components on the `x,y,z` arrays.

#### Pros of AoSoA
- Great performances compared to AoS.
- Can even beat the performances of SoA considering AoSoA can be more cache-friendly in modern architecture.
- Designing algorithms around AoSoA is somewhat easier than with plain SoA.
- Using AoSoA, most linear-algebra operations can be easily vectorized as long as they don't rely too much on branching.

#### Cons of AoSoA
- We still need to design our algorithms carefully to use AoSoA efficiently.

### Array-of-Structures-of-arrays with explicit SIMD (SIMD AoSoA)
Finally, let's talk about what I call here _SIMD AoSoA_. This layout is actually exactly the same as AoSoA presented before,
except we that we use explicit SIMD primitives like, e.g., the types from
the [packed_simd](https://crates.io/crates/packed_simd) crate instead of plain arrays. For example we can use 4-lanes SIMD
floats `packed_simd::f32x4` instead of `[f32; 4]`:

```rust
struct WideVector3 {
    x: packed_simd::f32x4,
    y: packed_simd::f32x4,
    z: packed_simd::f32x4,
}

type SetOfWideVector3 = [WideVector3; 1024 / 4];
```

Then our sum will be exactly the same as in the AoSoA approach, except that we don't have to deal with each 4 lanes
explicitly because `packed_simd::f32x4` implements the `Add` trait:

```rust
fn add_arrays_of_vectors(a: &mut SetOfWideVector3, b: &SetOfWideVector3) {
    for i in 0..1024 / 4 {
        // NOTE: each 4-lanes sum will be executed as a single SIMD operation.
        va[i].x += vb[i].x;
        va[i].y += vb[i].y;
        va[i].z += vb[i].z;
    }
}
```

If we wanted to use 16-lanes vectors here (based on AVX instructions), we could simply do:

```rust
struct WideVector3 {
    x: packed_simd::f32x16,
    y: packed_simd::f32x16,
    z: packed_simd::f32x16,
}

type SetOfWideVector3 = [WideVector3; 1024 / 16];
```

Another benefit of using SIMD types explicitly here is that we no longer rely on the compiler's auto-vectorization.
So we can get SIMD instructions even in debug mode, and in some situations where the compiler would fail to auto-vectorize
properly.

### Using SIMD AoSoA for linear-algebra in Rust: ultraviolet and nalgebra
As far as I know, the first crate that implemented this concept for (gamedev) linear algebra in Rust is [ultraviolet](https://crates.io/crates/ultraviolet).
At the end of this month (March 2020), you will also be able to use this approach with [nalgebra](https://nalgebra.org), in its upcoming version 0.21.0.

With `ultraviolet`, you have the choice between two families of types: regular types (`Vec2`, `Mat3`, `Isometry3`, etc.) and _wide_ types (`Wec2`, `Wat3`, `WIsometry3`).
The regular types are designed to be usable with the common AoS layout, with vector/matrix components set to `f32`.
The _wide_ types on the other hand are designed to be used with the SIMD AoSoA layout: each _wide_ type packs the corresponding four non-wide types into a single structure
(e.g. one `Wec3` represents four `Vec3`), and the wide vector/wide matrix components are of type `f32x4`
from the [wide crate](https://crates.io/crates/wide). As of today, `ultraviolet` is limited to 32-bits floats, and 4-lanes 32-bits SIMD floats.
You can't use it with SIMD integers, nor with 64-bits floats or 32-bits SIMD floats with a number of lanes different from 4.

With `nalgebra`, all types of vectors/matrices/tansformations are generic wrt. their component type. Therefore, for a
AoS layout, you can use, e.g., the `Vector2<f32>` type. And if you want to leverage SIMD AoSoA, you can use `Vector2<f32x4>` instead and
that will give you four 2D vectors for the price of one. Note that the `f32x4` type here comes from the new [simba](https://crates.io/crates/simba)
crate and is a newtype for the `f32x4` from [packed_simd](https://crates.io/crates/packed_simd) (the upcoming standard safe SIMD implementation in Rust).
A newtype was required because of the orphan rules, and the need to implement some traits from the __num__ crate for the SIMD types.
__Simba__ is not limited to `f32x4` though as it defines a newtype for every single numeric type of __packed_simd__. Therefore __nalgebra__
will also support all the integer and float SIMD types, with 2, 4, 8, or 16 lanes. You can for example write and use `Isometry2<simba::f32x16>` as
a SoA set of 16 `Isometry2<f32>`.
Finally __nalgebra__ has support for SIMD on all the platforms supported by __packed_simd__ itself.

Here are some (subjective) pros and cons for __ultraviolet__ and __nalgebra__:
- _Pros of ultraviolet_: no generics so it is simple to use, and efficient even without compiler optimizations enabled. Works on stable Rust.
- _Pros of nalgebra_: generics allow the use of all SIMD types. More feature-complete and tested than __ultraviolet__. Based on __packed_simd__ with great platform support
but we could make it work with the __wide__ crate too.
- _Cons of ultraviolet_: cannot use 64-bits floats nor SIMD types other than 32-bit 4-lanes floats. It has a more limited feature set (but that may be enough for gamedev).
- _Cons of nalgebra_: generics make it harder to use, and make the doc harder to browse. Also _nalgebra_ is much less efficient without compiler optimizations enabled. Because
SIMD AoSoA is based on __packed_simd__, the use of SIMD types will only work with the nightly compiler.

## Benchmarks of Rust linear-algebra crates
Now is the time to see if SIMD AoSoA is useful at all. The benchmarks I run here are a modified version of the
__mathbench-rs__ benchmark suite you may have already head of. For example it
was used when `glam` and `ultraviolet` were published.

If you want to run the benchmarks on your machine, you can [clone my fork](https://github.com/sebcrozet/mathbench-rs) and
either run `cargo bench` or `RUSTFLAGS='-C target-cpu=native' cargo bench`.

The modifications I made to the benchmark were the following:

- I added `codegen-units = 1` to the `[profile.bench]` section. This allows to get as much optimization as we can get from 
the compiler (this is typically what you want before releasing a binary). It turns out that this can affect the performance
of __nalgebra__ which benefits significantly from compiler optimizations.
- I added support for __ultraviolet__ regular types (identified by the column __ultraviolet__ in the benchmarks) as well
as its _wide_ types (identified by the column __ultraviolet_f32x4__).
- Because __ultraviolet__ use the concepts of rotors instead of quaternions for its rotation, I used its `Rotor/WRotor` types for
all its _quaternion_ benchmark rows.
- I added support for using __nalgebra__ with f32 SIMD with 4, 8, and 16 lanes identified by __nalgebra_f32x4__, __nalgebra_f32x8__
and __nalgebra_f32x16__.
- I added benchmarks for 3D isometries of both __ultraviolet__ and __nalgebra__.
- I modified the benchmark of unary and binary operations so they measure the time to process 16 elements. For example
when benchmarking 2D matrix transposition, we are actually seeing the computation time for transposing 16 matrices (instead
of just one). This allows us to measure the gain of SIMD AoSoA without penalizing neither non-AoSoA crates nor AoSoA crates.

This last modification follows the same principle as the one introduced for the benchmarks presented by `ultraviolet` in
their [README](https://github.com/sebcrozet/mathbench-rs#benchmark-results).

### Benchmark with `-C target-cpu=native`
In this benchmark I am compiling with the `RUSTFLAGS='-C target-cpu=native` option so that the compiler emits AVX instructions
for `f32x8` and `f32x16`. It appears that some crates (namely __glam__ and __vek__) are not as efficient as they could be
when this option is enabled so you will find a second benchmark without this option enabled in the next section.

Benchmark options:
- command line: `RUSTFLAGS='-C target-cpu=native' cargo bench`
- profiling option in `Cargo.toml`: `codegen-units = 1`
- CPU: `AMD Ryzen 9 3900X 12-Core Processor`

| benchmark                      |   nalgebra_f32x16   |   nalgebra_f32x8   |   nalgebra_f32x4   |   ultraviolet_f32x4   |      nalgebra   |   ultraviolet   |          glam   |           vek   |        cgmath   |        euclid   |
|--------------------------------|---------------------|--------------------|--------------------|-----------------------|-----------------|-----------------|-----------------|-----------------|-----------------|-----------------|
| euler 2d x10000                |        __2.076 us__ |         2.224 us   |          3.05 us   |             3.05 us   |      9.674 us   |       12.0 us   |      12.42 us   |      11.85 us   |      11.92 us   |      9.585 us   |
| euler 3d x10000                |          3.014 us   |       __2.809 us__ |         4.791 us   |            4.639 us   |      18.18 us   |      17.58 us   |       6.27 us   |      18.12 us   |      18.05 us   |      17.91 us   |
| isometry transform point2 x1   |       __5.7179 ns__ |      __5.6563 ns__ |        7.8197 ns   |           8.1874 ns   |    22.8197 ns   |    24.4878 ns   |       N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point2 x100 |        __2.582 us__ |       __2.587 us__ |         2.739 us   |            2.787 us   |      3.007 us   |      3.169 us   |       N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point3 x1   |        10.5417 ns   |     __10.1237 ns__ |       15.4410 ns   |          19.5679 ns   |    60.0877 ns   |    64.7755 ns   |       N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point3 x100 |          4.704 us   |       __4.377 us__ |          4.64 us   |            4.941 us   |      6.567 us   |       6.68 us   |       N/A       |       N/A       |       N/A       |       N/A       |
| isometry2 inverse              |       __6.0317 ns__ |        6.4494 ns   |        6.9687 ns   |           7.4126 ns   |    24.2412 ns   |    24.8876 ns   |       N/A       |       N/A       |       N/A       |       N/A       |
| isometry2 mul isometry2        |       __8.1413 ns__ |        9.2351 ns   |       10.1867 ns   |          10.2618 ns   |    34.5250 ns   |    33.1397 ns   |       N/A       |       N/A       |       N/A       |       N/A       |
| isometry3 inverse              |        12.3065 ns   |     __11.2699 ns__ |       16.2452 ns   |          21.6418 ns   |    62.2947 ns   |    76.3882 ns   |       N/A       |       N/A       |       N/A       |       N/A       |
| isometry3 mul isometry3        |        29.0822 ns   |     __16.5287 ns__ |       26.0439 ns   |          31.5684 ns   |    97.8058 ns   |   109.7477 ns   |       N/A       |       N/A       |       N/A       |       N/A       |
| matrix2 determinant            |           N/A       |          N/A       |          N/A       |             N/A       |    15.4800 ns   |       N/A       |   __9.9942 ns__ |    15.5422 ns   |    15.6876 ns   |       N/A       |
| matrix2 inverse                |           N/A       |          N/A       |          N/A       |             N/A       |    25.0731 ns   |       N/A       |  __15.7486 ns__ |       N/A       |    25.8362 ns   |       N/A       |
| matrix2 mul matrix2            |        10.6500 ns   |      __9.0379 ns__ |       10.3309 ns   |          10.4283 ns   |    24.7601 ns   |    24.9938 ns   |    16.1426 ns   |   291.7833 ns   |    25.0133 ns   |       N/A       |
| matrix2 mul vector2 x1         |         5.7680 ns   |      __5.2159 ns__ |        6.7758 ns   |           6.9242 ns   |    22.9934 ns   |    24.4428 ns   |    15.5422 ns   |    85.4171 ns   |    23.7398 ns   |       N/A       |
| matrix2 mul vector2 x100       |        __2.641 us__ |       __2.663 us__ |       __2.647 us__ |          __2.617 us__ |       3.14 us   |      3.182 us   |      2.953 us   |      8.998 us   |      3.232 us   |       N/A       |
| matrix2 transpose              |       __5.8718 ns__ |        6.8760 ns   |        6.6906 ns   |             N/A       |    10.6439 ns   |       N/A       |    10.9130 ns   |    10.6631 ns   |    10.5080 ns   |       N/A       |
| matrix3 determinant            |           N/A       |          N/A       |          N/A       |             N/A       |    31.9111 ns   |       N/A       |  __19.7343 ns__ |    31.3051 ns   |    32.2809 ns   |       N/A       |
| matrix3 inverse                |           N/A       |          N/A       |          N/A       |        __25.6965 ns__ |    83.4324 ns   |    82.1388 ns   |   120.2562 ns   |       N/A       |    79.4379 ns   |       N/A       |
| matrix3 mul matrix3            |        70.6877 ns   |     __19.6932 ns__ |       27.7722 ns   |          26.8799 ns   |    83.2946 ns   |    83.9021 ns   |    44.3916 ns   |   944.3034 ns   |    80.8441 ns   |       N/A       |
| matrix3 mul vector3 x1         |      __10.6031 ns__ |     __10.7913 ns__ |       13.6117 ns   |          13.7169 ns   |    46.1231 ns   |    47.5651 ns   |    20.6856 ns   |   315.4715 ns   |    45.3403 ns   |       N/A       |
| matrix3 mul vector3 x100       |          __4.7 us__ |       __4.807 us__ |         4.845 us   |          __4.738 us__ |      6.163 us   |      6.142 us   |      6.701 us   |      32.47 us   |      6.091 us   |       N/A       |
| matrix3 transpose              |        14.3912 ns   |     __12.8725 ns__ |       15.0385 ns   |          15.9171 ns   |    19.9624 ns   |    19.7458 ns   |    22.7494 ns   |    19.5610 ns   |    20.0838 ns   |       N/A       |
| matrix4 determinant            |           N/A       |          N/A       |          N/A       |             N/A       |      1.489 us   |       N/A       |    __0.083 us__ |     0.1515 us   |     0.1021 us   |     0.1565 us   |
| matrix4 inverse                |           N/A       |          N/A       |          N/A       |        __0.09051 us__ |     0.5339 us   |     0.3744 us   |     0.2844 us   |      4.203 us   |     0.4745 us   |     0.5851 us   |
| matrix4 mul matrix4            |         0.2354 us   |     __0.06835 us__ |       0.07657 us   |          0.07581 us   |     0.1247 us   |      0.135 us   |    0.07736 us   |      1.916 us   |     0.1146 us   |     0.1089 us   |
| matrix4 mul vector4 x1         |        39.0102 ns   |     __15.4389 ns__ |       20.7324 ns   |          22.1028 ns   |    30.6785 ns   |    30.8711 ns   |    25.6006 ns   |   487.1873 ns   |    30.3248 ns   |       N/A       |
| matrix4 mul vector4 x100       |          8.339 us   |       __7.419 us__ |       __7.437 us__ |          __7.428 us__ |       8.14 us   |      8.209 us   |      8.078 us   |      47.98 us   |      8.332 us   |       N/A       |
| matrix4 transpose              |        95.1337 ns   |     __23.2408 ns__ |       25.8665 ns   |          25.7914 ns   |    97.9916 ns   |   101.3651 ns   |    30.0239 ns   |   103.5180 ns   |   102.0192 ns   |       N/A       |
| quaternion conjugate           |       __6.0223 ns__ |        6.3760 ns   |        7.5628 ns   |           6.9775 ns   |    23.2724 ns   |    23.0902 ns   |    10.3465 ns   |    23.2522 ns   |    23.2696 ns   |    23.0664 ns   |
| quaternion mul quaternion      |       __9.3504 ns__ |      __9.4567 ns__ |       12.3669 ns   |          12.6805 ns   |    30.0095 ns   |    38.4430 ns   |    25.8066 ns   |    42.2113 ns   |    42.6575 ns   |    40.9668 ns   |
| quaternion mul vector3         |         8.5309 ns   |      __7.7526 ns__ |       13.3755 ns   |          16.7836 ns   |    49.3278 ns   |    56.7010 ns   |    41.2790 ns   |    71.9719 ns   |    48.9911 ns   |    48.2763 ns   |
| transform point2 x1            |           N/A       |          N/A       |          N/A       |             N/A       |    35.6464 ns   |       N/A       |  __23.5642 ns__ |   325.1071 ns   |    29.7918 ns   |    28.4816 ns   |
| transform point2 x100          |           N/A       |          N/A       |          N/A       |             N/A       |      5.386 us   |       N/A       |      5.612 us   |      33.66 us   |      5.255 us   |    __4.066 us__ |
| transform point3 x1            |           N/A       |          N/A       |          N/A       |             N/A       |    68.6997 ns   |       N/A       |  __23.9545 ns__ |   504.0400 ns   |    67.0988 ns   |    68.1284 ns   |
| transform point3 x100          |           N/A       |          N/A       |          N/A       |             N/A       |      9.393 us   |       N/A       |    __7.898 us__ |      49.31 us   |      9.282 us   |       10.0 us   |
| transform vector2 x1           |           N/A       |          N/A       |          N/A       |             N/A       |    32.5603 ns   |       N/A       |  __24.0791 ns__ |   327.3927 ns   |       N/A       |    24.8445 ns   |
| transform vector2 x100         |           N/A       |          N/A       |          N/A       |             N/A       |      5.385 us   |       N/A       |      5.649 us   |      33.51 us   |       N/A       |    __3.891 us__ |
| transform vector3 x1           |           N/A       |          N/A       |          N/A       |             N/A       |    52.9997 ns   |       N/A       |  __25.2423 ns__ |   487.6624 ns   |    55.1891 ns   |    46.3865 ns   |
| transform vector3 x100         |           N/A       |          N/A       |          N/A       |             N/A       |      9.083 us   |       N/A       |    __7.963 us__ |      49.47 us   |      8.994 us   |      8.771 us   |
| transform2 inverse             |           N/A       |          N/A       |          N/A       |             N/A       |    83.1814 ns   |       N/A       |       N/A       |       N/A       |       N/A       |  __38.3216 ns__ |
| transform2 mul transform2      |           N/A       |          N/A       |          N/A       |             N/A       |    79.8949 ns   |       N/A       |       N/A       |       N/A       |       N/A       |  __53.0397 ns__ |
| transform3 inverse             |           N/A       |          N/A       |          N/A       |             N/A       | __509.3638 ns__ |       N/A       |       N/A       |       N/A       |       N/A       |   573.8688 ns   |
| transform3 mul transform3d     |           N/A       |          N/A       |          N/A       |             N/A       |   116.3846 ns   |       N/A       |       N/A       |       N/A       |       N/A       | __112.3300 ns__ |
| vector3 cross                  |       __4.4663 ns__ |        4.5852 ns   |        6.3479 ns   |           6.1689 ns   |    26.0655 ns   |    24.9554 ns   |    15.6013 ns   |    27.9000 ns   |    27.6733 ns   |    28.1612 ns   |
| vector3 dot                    |       __4.4944 ns__ |      __4.5232 ns__ |        6.4285 ns   |           6.2531 ns   |    25.3941 ns   |    24.9869 ns   |    13.6267 ns   |    24.5923 ns   |    25.9651 ns   |    25.8382 ns   |
| vector3 length                 |       __3.5110 ns__ |      __3.5936 ns__ |        5.4675 ns   |           5.4127 ns   |    20.7343 ns   |    21.0470 ns   |    20.4590 ns   |    21.0161 ns   |    20.7430 ns   |    20.5710 ns   |
| vector3 normalize              |       __7.8013 ns__ |        8.3383 ns   |       15.4976 ns   |          15.3918 ns   |    61.5877 ns   |    61.3314 ns   |    35.6648 ns   |    59.7074 ns   |    35.7934 ns   |    61.2340 ns   |



To get a better comparative view of the performance of AoSoA, here are the benchmarks restricted to ultraviolet's _wide_ types
(`Wec2, Wat2, WIsometry2`, etc.) and nalgebra types paramaterized by SIMD types (`Vector2<f32x4>, Matrix2<f32x8>, Isometry2<f32x16>`, etc.):

| benchmark                      |   ultraviolet_f32x4   |   nalgebra_f32x4   |   nalgebra_f32x8   |   nalgebra_f32x16   |
|--------------------------------|-----------------------|--------------------|--------------------|---------------------|
| euler 2d x10000                |             3.05 us   |          3.05 us   |         2.224 us   |        __2.076 us__ |
| euler 3d x10000                |            4.639 us   |         4.791 us   |       __2.809 us__ |          3.014 us   |
| isometry transform point2 x1   |           8.1874 ns   |        7.8197 ns   |      __5.6563 ns__ |       __5.7179 ns__ |
| isometry transform point2 x100 |            2.787 us   |         2.739 us   |       __2.587 us__ |        __2.582 us__ |
| isometry transform point3 x1   |          19.5679 ns   |       15.4410 ns   |     __10.1237 ns__ |        10.5417 ns   |
| isometry transform point3 x100 |            4.941 us   |          4.64 us   |       __4.377 us__ |          4.704 us   |
| isometry2 inverse              |           7.4126 ns   |        6.9687 ns   |        6.4494 ns   |       __6.0317 ns__ |
| isometry2 mul isometry2        |          10.2618 ns   |       10.1867 ns   |        9.2351 ns   |       __8.1413 ns__ |
| isometry3 inverse              |          21.6418 ns   |       16.2452 ns   |     __11.2699 ns__ |        12.3065 ns   |
| isometry3 mul isometry3        |          31.5684 ns   |       26.0439 ns   |     __16.5287 ns__ |        29.0822 ns   |
| matrix2 mul matrix2            |          10.4283 ns   |       10.3309 ns   |      __9.0379 ns__ |        10.6500 ns   |
| matrix2 mul vector2 x1         |           6.9242 ns   |        6.7758 ns   |      __5.2159 ns__ |         5.7680 ns   |
| matrix2 mul vector2 x100       |          __2.617 us__ |       __2.647 us__ |       __2.663 us__ |        __2.641 us__ |
| matrix2 transpose              |             N/A       |        6.6906 ns   |        6.8760 ns   |       __5.8718 ns__ |
| matrix3 inverse                |        __25.6965 ns__ |          N/A       |          N/A       |           N/A       |
| matrix3 mul matrix3            |          26.8799 ns   |       27.7722 ns   |     __19.6932 ns__ |        70.6877 ns   |
| matrix3 mul vector3 x1         |          13.7169 ns   |       13.6117 ns   |     __10.7913 ns__ |      __10.6031 ns__ |
| matrix3 mul vector3 x100       |          __4.738 us__ |         4.845 us   |       __4.807 us__ |          __4.7 us__ |
| matrix3 transpose              |          15.9171 ns   |       15.0385 ns   |     __12.8725 ns__ |        14.3912 ns   |
| matrix4 inverse                |        __90.5105 ns__ |          N/A       |          N/A       |           N/A       |
| matrix4 mul matrix4            |          75.8094 ns   |       76.5675 ns   |     __68.3461 ns__ |       235.3853 ns   |
| matrix4 mul vector4 x1         |          22.1028 ns   |       20.7324 ns   |     __15.4389 ns__ |        39.0102 ns   |
| matrix4 mul vector4 x100       |          __7.428 us__ |       __7.437 us__ |       __7.419 us__ |          8.339 us   |
| matrix4 transpose              |          25.7914 ns   |       25.8665 ns   |     __23.2408 ns__ |        95.1337 ns   |
| quaternion conjugate           |           6.9775 ns   |        7.5628 ns   |        6.3760 ns   |       __6.0223 ns__ |
| quaternion mul quaternion      |          12.6805 ns   |       12.3669 ns   |      __9.4567 ns__ |       __9.3504 ns__ |
| quaternion mul vector3         |          16.7836 ns   |       13.3755 ns   |      __7.7526 ns__ |         8.5309 ns   |
| vector3 cross                  |           6.1689 ns   |        6.3479 ns   |        4.5852 ns   |       __4.4663 ns__ |
| vector3 dot                    |           6.2531 ns   |        6.4285 ns   |      __4.5232 ns__ |       __4.4944 ns__ |
| vector3 length                 |           5.4127 ns   |        5.4675 ns   |      __3.5936 ns__ |       __3.5110 ns__ |
| vector3 normalize              |          15.3918 ns   |       15.4976 ns   |        8.3383 ns   |       __7.8013 ns__ |

As we can see, both `ultraviolet_f32x4` and `nalgebra_f32x4` yield roughly the same computation times. The most efficient
option for my processor is __nalgebra__ with `f32x8`: it often reaches the best performance, and `f32x16` comes
with little performance gain, and even significant regressions for some tests.

### Benchmark without `-C target-cpu=native`
It appears some rust linear algebra crates do not perform as well as they could if `-C target-cpu=native` is passed
to the compiler. This is for example the case of `glam` and `vek`. However, it appears that not using `-C target-cpu=native`
makes some methods of non-wide types of __ultraviolet__ much less efficient.

Because we don't use `-C target-cpu=native` here, both `f32x8` and `f32x16` won't emit 8- and 16-lanes AVX instructions, making
them only as efficient as `f32x4`.

Here is the same benchmark with:
- command line: `cargo bench`
- options in `Cargo.toml`: `codegen-units = 1`.
- CPU: `AMD Ryzen 9 3900X 12-Core Processor`

| benchmark                      |   nalgebra_f32x16   |   nalgebra_f32x8   |   nalgebra_f32x4   |   ultraviolet_f32x4   |      nalgebra   |   ultraviolet   |         glam   |           vek   |        cgmath   |        euclid   |
|--------------------------------|---------------------|--------------------|--------------------|-----------------------|-----------------|-----------------|----------------|-----------------|-----------------|-----------------|
| euler 2d x10000                |        __3.057 us__ |         3.069 us   |       __2.992 us__ |          __3.014 us__ |      9.028 us   |       5.28 us   |     5.166 us   |      5.258 us   |      5.259 us   |      8.631 us   |
| euler 3d x10000                |        __4.585 us__ |       __4.587 us__ |       __4.546 us__ |          __4.587 us__ |      17.84 us   |      18.34 us   |     6.311 us   |      17.57 us   |      18.04 us   |      17.97 us   |
| isometry transform point2 x1   |         7.7226 ns   |      __6.7828 ns__ |        8.1024 ns   |           8.6412 ns   |    23.4637 ns   |    54.5840 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point2 x100 |        __2.625 us__ |         2.701 us   |         2.801 us   |            2.837 us   |      3.109 us   |      4.918 us   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point3 x1   |        21.0932 ns   |     __16.1782 ns__ |     __16.1052 ns__ |          20.6723 ns   |    61.8824 ns   |   330.1143 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry transform point3 x100 |          6.466 us   |       __4.598 us__ |       __4.515 us__ |            4.794 us   |      6.546 us   |      18.19 us   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry2 inverse              |         7.4879 ns   |      __7.0432 ns__ |        7.3004 ns   |           7.7692 ns   |    24.8090 ns   |    59.3838 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry2 mul isometry2        |        13.3355 ns   |     __10.5486 ns__ |       12.3278 ns   |          12.7816 ns   |    34.5714 ns   |   110.7837 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry3 inverse              |        29.6336 ns   |       19.3869 ns   |     __17.1929 ns__ |          21.4199 ns   |    63.9200 ns   |   212.2193 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| isometry3 mul isometry3        |        51.0123 ns   |       39.2781 ns   |     __28.5785 ns__ |          37.5971 ns   |    98.0279 ns   |   459.4930 ns   |      N/A       |       N/A       |       N/A       |       N/A       |
| matrix2 determinant            |           N/A       |          N/A       |          N/A       |             N/A       |    16.0198 ns   |       N/A       | __11.2070 ns__ |    15.8621 ns   |    16.0906 ns   |       N/A       |
| matrix2 inverse                |           N/A       |          N/A       |          N/A       |             N/A       |    26.5165 ns   |       N/A       | __18.9069 ns__ |       N/A       |    26.2478 ns   |       N/A       |
| matrix2 mul matrix2            |        60.2594 ns   |     __10.6371 ns__ |       12.5352 ns   |        __10.7532 ns__ |    25.4533 ns   |    25.7148 ns   |   16.3060 ns   |   301.3775 ns   |    25.6988 ns   |       N/A       |
| matrix2 mul vector2 x1         |        29.6210 ns   |        8.0023 ns   |      __7.1695 ns__ |           8.0907 ns   |    23.0932 ns   |    24.4506 ns   |   16.4141 ns   |    93.3601 ns   |    25.0774 ns   |       N/A       |
| matrix2 mul vector2 x100       |            3.5 us   |       __2.591 us__ |         2.684 us   |            2.698 us   |      3.137 us   |      3.174 us   |     2.828 us   |      9.558 us   |      3.122 us   |       N/A       |
| matrix2 transpose              |         6.8152 ns   |        7.4080 ns   |      __6.4984 ns__ |             N/A       |    11.0205 ns   |       N/A       |   10.9890 ns   |    10.8180 ns   |    10.3812 ns   |       N/A       |
| matrix3 determinant            |           N/A       |          N/A       |          N/A       |             N/A       |    33.1252 ns   |       N/A       | __22.2592 ns__ |    31.8128 ns   |    31.7086 ns   |       N/A       |
| matrix3 inverse                |           N/A       |          N/A       |          N/A       |        __26.7493 ns__ |    92.8270 ns   |   284.1032 ns   |   93.5328 ns   |       N/A       |    82.3820 ns   |       N/A       |
| matrix3 mul matrix3            |         0.1494 us   |       0.03354 us   |       0.02883 us   |        __0.02638 us__ |    0.09077 us   |    0.08728 us   |    0.0474 us   |      1.005 us   |    0.08579 us   |       N/A       |
| matrix3 mul vector3 x1         |        52.3315 ns   |       14.0998 ns   |     __13.7548 ns__ |        __13.6309 ns__ |    46.4205 ns   |    46.5016 ns   |   21.5466 ns   |   317.8168 ns   |    47.3542 ns   |       N/A       |
| matrix3 mul vector3 x100       |          10.68 us   |         5.033 us   |       __4.835 us__ |          __4.917 us__ |      6.138 us   |      6.261 us   |     6.633 us   |      32.93 us   |      6.297 us   |       N/A       |
| matrix3 transpose              |        20.9653 ns   |     __15.7305 ns__ |     __15.7501 ns__ |        __15.4925 ns__ |    52.7300 ns   |    53.0845 ns   |   24.1975 ns   |    55.4793 ns   |    52.0874 ns   |       N/A       |
| matrix4 determinant            |           N/A       |          N/A       |          N/A       |             N/A       |   690.7027 ns   |       N/A       | __85.5778 ns__ |   176.1770 ns   |   110.6990 ns   |   174.6754 ns   |
| matrix4 inverse                |           N/A       |          N/A       |          N/A       |        __0.08342 us__ |     0.5282 us   |     0.3953 us   |     0.257 us   |      3.792 us   |     0.5096 us   |      0.651 us   |
| matrix4 mul matrix4            |         0.4467 us   |       0.08671 us   |     __0.06897 us__ |        __0.07068 us__ |     0.1285 us   |     0.1493 us   |   0.07653 us   |      2.024 us   |     0.1185 us   |     0.1152 us   |
| matrix4 mul vector4 x1         |        84.1744 ns   |     __20.9291 ns__ |     __21.1243 ns__ |        __20.6690 ns__ |    31.5352 ns   |    30.3570 ns   |   24.7876 ns   |   512.0570 ns   |    30.9776 ns   |       N/A       |
| matrix4 mul vector4 x100       |          10.32 us   |       __7.592 us__ |       __7.595 us__ |          __7.662 us__ |      8.472 us   |      8.379 us   |     7.823 us   |      51.42 us   |      8.366 us   |       N/A       |
| matrix4 transpose              |       103.5080 ns   |       32.5330 ns   |     __26.2948 ns__ |          27.1962 ns   |   103.0829 ns   |   101.3104 ns   |   29.2236 ns   |   105.6003 ns   |    98.1151 ns   |       N/A       |
| quaternion conjugate           |       __6.7367 ns__ |        7.6066 ns   |      __6.6130 ns__ |         __6.6179 ns__ |    24.5468 ns   |    25.5657 ns   |   11.1447 ns   |    24.2229 ns   |    25.7246 ns   |    24.9413 ns   |
| quaternion mul quaternion      |        20.0365 ns   |       16.6831 ns   |     __14.6380 ns__ |          16.6299 ns   |    39.3908 ns   |   274.4676 ns   |   27.3533 ns   |    62.0697 ns   |    35.0299 ns   |    59.5286 ns   |
| quaternion mul vector3         |        19.3629 ns   |     __14.7722 ns__ |     __14.7579 ns__ |          18.5064 ns   |    52.7303 ns   |   170.8328 ns   |   44.1336 ns   |    81.1243 ns   |    52.5011 ns   |    54.1958 ns   |
| transform point2 x1            |           N/A       |          N/A       |          N/A       |             N/A       |    36.6350 ns   |       N/A       | __25.6516 ns__ |   337.3442 ns   |    30.5781 ns   |    28.5532 ns   |
| transform point2 x100          |           N/A       |          N/A       |          N/A       |             N/A       |      5.475 us   |       N/A       |     5.732 us   |      33.81 us   |      5.118 us   |    __4.003 us__ |
| transform point3 x1            |           N/A       |          N/A       |          N/A       |             N/A       |    66.3694 ns   |       N/A       | __24.0601 ns__ |   517.9224 ns   |    67.8205 ns   |    68.0836 ns   |
| transform point3 x100          |           N/A       |          N/A       |          N/A       |             N/A       |      9.403 us   |       N/A       |   __7.824 us__ |       52.5 us   |      9.559 us   |      10.07 us   |
| transform vector2 x1           |           N/A       |          N/A       |          N/A       |             N/A       |    32.5667 ns   |       N/A       | __21.3971 ns__ |   330.5713 ns   |       N/A       |    23.5693 ns   |
| transform vector2 x100         |           N/A       |          N/A       |          N/A       |             N/A       |      5.392 us   |       N/A       |     5.579 us   |      33.45 us   |       N/A       |    __3.909 us__ |
| transform vector3 x1           |           N/A       |          N/A       |          N/A       |             N/A       |    55.3600 ns   |       N/A       | __24.3628 ns__ |   515.1730 ns   |    59.1129 ns   |    47.9383 ns   |
| transform vector3 x100         |           N/A       |          N/A       |          N/A       |             N/A       |      9.185 us   |       N/A       |   __7.958 us__ |      52.39 us   |      8.992 us   |      8.665 us   |
| transform2 inverse             |           N/A       |          N/A       |          N/A       |             N/A       |    87.2060 ns   |       N/A       |      N/A       |       N/A       |       N/A       |  __45.0272 ns__ |
| transform2 mul transform2      |           N/A       |          N/A       |          N/A       |             N/A       |    87.5702 ns   |       N/A       |      N/A       |       N/A       |       N/A       |  __40.1995 ns__ |
| transform3 inverse             |           N/A       |          N/A       |          N/A       |             N/A       | __542.8401 ns__ |       N/A       |      N/A       |       N/A       |       N/A       |   748.2648 ns   |
| transform3 mul transform3d     |           N/A       |          N/A       |          N/A       |             N/A       | __118.0659 ns__ |       N/A       |      N/A       |       N/A       |       N/A       | __115.3294 ns__ |
| vector3 cross                  |         5.9052 ns   |      __5.7307 ns__ |        6.4232 ns   |           6.2395 ns   |    25.0006 ns   |    36.5961 ns   |   15.0303 ns   |    28.6082 ns   |    28.6343 ns   |    29.5467 ns   |
| vector3 dot                    |       __5.7524 ns__ |      __5.8113 ns__ |        6.6820 ns   |           6.3391 ns   |    25.5593 ns   |    26.1824 ns   |   13.6831 ns   |    25.4740 ns   |    25.9099 ns   |    26.1271 ns   |
| vector3 length                 |       __5.3441 ns__ |        5.4417 ns   |        5.3741 ns   |         __5.2332 ns__ |    20.5369 ns   |    34.2988 ns   |   20.5652 ns   |    20.6259 ns   |    20.9281 ns   |    20.6052 ns   |
| vector3 normalize              |      __15.6224 ns__ |     __15.3854 ns__ |     __15.5892 ns__ |        __15.6585 ns__ |    59.1804 ns   |    60.9510 ns   |   35.7763 ns   |    61.3666 ns   |    36.7304 ns   |    61.3199 ns   |


## Conclusion

The use of SIMD AoSoA is extremely promising for doing efficiently lots of linear algebra on large arrays of entities with the same types.
This will be possible in __nalgebra__ in its next version 0.21.0 and will perform as efficiently as the current implementation in __ultraviolet__
 when using `f32x4` and will also be compatible with other SIMD types as well (e.g. `f32x16`, `f64x2`, `i32x4`, `u8x4`, etc.) Those types are newtypes wrapping
 the types from __packed_simd__. Those newtypes will come from a new crate named [simba](https://crates.io/crates/simba)
 which I will present in more depth in the next edition of the `This month in Rustsim` blog posts.

Finaly here are two elements to keep in mind:
- Compilation flags matter a lot when measuring performances. `-C target-cpu` or `codegen-units=1` can have significant
impacts on your release performance.
- SIMD AoSoA comes with a price: algorithms must be carefully designed to obtain as much gain as possible compared to an
AoS approach.

----

**Thank you all for reading, and for your support on [patreon](https://www.patreon.com/sebcrozet) or [GitHub sponsor](https://github.com/sponsors/sebcrozet)!**

**Don't hesitate to share your thoughts on this topic, or to correct me if something seems off to you.**