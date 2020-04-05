---
title: This month in rustsim #10 (March 2020)
author: Sébastien Crozet
---

Welcome to the tenth edition of _This month in rustsim_! This newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org) (physics engine),  [**salva**](https://salva.rs) (fluid simulation), [**ncollide**](https://ncollide.org) (for collision-detection),
[**nalgebra**](https://nalgebra.org) (for linear algebra),
[**simba**](https://github.com/rustsim/simba), and [**alga**](https://github.com/rustsim/alga) (for abstract algebra) crates. This tenth edition will contain updates for the month of March 2020.


<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# Say hello to Simba!

<center>
![simba logo](https://rustsim.org/img/logo_simba_wide_wide.svg)
</center>

I am thrilled to announce the release of the new [simba](https://crates.io/crates/simba) crate! __Simba__ is a crate that defines
a set of traits for writing code that can be generic with regard to the number of lanes of the input numeric value.
Those traits are implemented by `f32`, `u32`, `i16`, `bool` as well as SIMD types like `f32x4, u32x8, i16x2`, etc.
Here is a diagram showing most of the traits of __Simba__:

<center>
![simba logo](https://rustsim.org/img/simba_trait_hierarchy.svg)
</center>

Each solid arrow illustrates trait inheritance, e.g., `SimdComplexField` is a subtrait of `SimdSigned`. Dashed arrows
illustrate blanket impls, e.g., any type implementing `RealField` also automatically implements `SimdRealField`.
All the `Simd*` traits (as well as `Field`) are implemented for SIMD types like `f32x8`, `f64x4` as well as scalar types like `f32` and `f64`.
Non-Simd traits on the other hand (except `Field`) are only implemented for scalar types.
by scalar types like `f32` and `f64` (and the blanket impls make them implement the `Simd*` traits too).
__Simba__ is both much simpler and more easily extensible than our [alga](https://crates.io/crates/alga) crate which has
a much deeper and complex trait hierarchy.

One example of use-case applied by the [nalgebra crate](https://nalgebra.org) is to define generic methods
like vector normalization that will work for `Vector3<f32>` as well as `Vector3<f32x4>`.
This makes it easier leverage the power of [SIMD Array-of-Struct-of-Array (AoSoA)](https://www.rustsim.org/blog/2020/03/23/simd-aosoa-in-nalgebra/)
with less code duplication.

#### Two optional cargo features can be enabled:
- With the __`packed_simd`__ feature enabled, the `simba::simd` module will export several SIMD types like `f32x2`,
 `f64x4`, `i32i8`, `u16i16`, etc. There types are wrappers around the SIMD types from the [__packed_simd__
 crate](https://docs.rs/packed_simd). **This requires a nightly compiler.**
- With the __`wide`__ feature enabled, the `simba::simd` module will export the `WideF32x4` and `WideBoolF32x4`
  types. These types are wrapper around the `wide::f32x4` type from the [__wide__ crate](https://docs.rs/wide).
  **This will work with both stable and nightly compilers.**
  
If none of those features are enabled, __simba__ will define all the scalar and SIMD traits (and will be
compatible with both stable an nightly compilers). However, the SIMD traits won't be implemented for any
SIMD types. Therefore library developers writing generic code are not required to enable those features.
However, users who will pick concrete SIMD numeric types are recommended to:
- Enable the `packed_simd` feature and use the types like `simba::simd::{f32x4, i32x2, ...}` if they want the most complete
platform/numeric type coverage, and can afford to use a nightly compiler.
- Enable the `wide` feature and use the `simba::simd::{WideF32x4, WideBoolF32x4}` if they only need 4-lanes
32-bits floats, and can't afford to use a nightly compiler.


# Use of the Simba crate by nalgebra 0.21
The use of Simba in the new version of __nalgebra__ is what makes it possible to leverage the strengths of 
SIMD AoSoA to obtain great performance boosts:

| benchmark                      |      nalgebra   |   nalgebra_f32x4   |   nalgebra_f32x8   |   nalgebra_f32x16   |
|--------------------------------|-----------------|--------------------|--------------------|---------------------|
| euler 2d x10000                |      9.674 us   |          3.05 us   |         2.224 us   |        __2.076 us__ |
| euler 3d x10000                |      18.18 us   |         4.791 us   |       __2.809 us__ |          3.014 us   |
| isometry transform point2      |    22.8197 ns   |        7.8197 ns   |      __5.6563 ns__ |       __5.7179 ns__ |
| isometry transform point3      |    60.0877 ns   |       15.4410 ns   |     __10.1237 ns__ |        10.5417 ns   |
| isometry2 mul isometry2        |    34.5250 ns   |       10.1867 ns   |        9.2351 ns   |       __8.1413 ns__ |
| isometry3 mul isometry3        |    97.8058 ns   |       26.0439 ns   |     __16.5287 ns__ |        29.0822 ns   |
| matrix2 mul matrix2            |    24.7601 ns   |       10.3309 ns   |      __9.0379 ns__ |        10.6500 ns   |
| matrix2 mul vector2            |    22.9934 ns   |        6.7758 ns   |      __5.2159 ns__ |         5.7680 ns   |
| matrix3 mul matrix3            |    83.2946 ns   |       27.7722 ns   |     __19.6932 ns__ |        70.6877 ns   |
| matrix3 mul vector3            |    46.1231 ns   |       13.6117 ns   |     __10.7913 ns__ |      __10.6031 ns__ |
| matrix4 mul matrix4            |     0.1247 us   |       0.07657 us   |     __0.06835 us__ |         0.2354 us   |
| matrix4 mul vector4            |    30.6785 ns   |       20.7324 ns   |     __15.4389 ns__ |        39.0102 ns   |
| quaternion mul quaternion      |    30.0095 ns   |       12.3669 ns   |      __9.4567 ns__ |       __9.3504 ns__ |
| quaternion mul vector3         |    49.3278 ns   |       13.3755 ns   |      __7.7526 ns__ |         8.5309 ns   |
| vector3 cross                  |    26.0655 ns   |        6.3479 ns   |        4.5852 ns   |       __4.4663 ns__ |
| vector3 dot                    |    25.3941 ns   |        6.4285 ns   |      __4.5232 ns__ |       __4.4944 ns__ |
| vector3 length                 |    20.7343 ns   |        5.4675 ns   |      __3.5936 ns__ |       __3.5110 ns__ |
| vector3 normalize              |    61.5877 ns   |       15.4976 ns   |        8.3383 ns   |       __7.8013 ns__ |

Refer to the [full benchmark](https://www.rustsim.org/blog/2020/03/23/simd-aosoa-in-nalgebra/) for details about those
numbers and comparison with other linear algebra crates.

- Before the version 0.21, __nalgebra__ relied on the traits from the __alga__ crate (e.g. `RealField`, `ComplexField`, etc).
 Those traits have now been replaced by the traits from the __simba__ crate which have similar names.
 For example the equivalent of `alga::general::{RealField, ComplexField}` is `simba::scalar::{RealField, ComplexField}`.
- In many places, you will see the `SimdRealField` or `SimdComplexField` traits which are slightly more general than
 `RealField` and `ComplexField` because they are also implemented for SIMD types like `f32x4`, `f64x2`, etc.
- The dependency to __alga__ is now completely optional. All the implementations of __alga__ traits are still present,
  though the `alga` cargo feature must be enabled to get them.

The `linalg` and `sparse` modules don't use the `SimdRealField` and `SimdComplexField` traits at all. This is because the
algorithms they implement are full of branching, and thus are difficult to rewrite in an SIMD AoSoA friendly manner.
Finally, note that:

1. If you are not using any generics with nalgebra, chances are that your code will still compile as-is.
2. If you are using some generics, chances are that simply replacing all occurrences of
   `alga::general::{RealField, ComplexField}` by `simba::scalar::{RealField, ComplexField}` will likely do the trick.

# The status of alga

Starting today, the __alga__ crate switches to passive maintenance mode. Unfortunately, the traits structure of __alga__
is very complicated, and makes it hardly accessible to users without strong knowledge about set theory. Moreover it does
not seem to be much used within the community. Thoses are other reasons why __nalgebra__ is now relies on traits from
__simba__ instead of __alga__.


# Thanks
We would like to thank the whole community and contributors. In particular, thanks to the contributors from the past month[^1]:

- [Aaron1011](https://github.com/Aaron1011)
- [Andlon](https://github.com/Andlon)
- [DasEtwas](https://github.com/DasEtwas)
- [ProfFan](https://github.com/ProfFan)
- [SBrandeis](https://github.com/SBrandeis)
- [alexbool](https://github.com/alexbool)
- [aweinstock314](https://github.com/aweinstock314)
- [azriel91](https://github.com/azriel91)
- [cuviper](https://github.com/cuviper)
- [daingun](https://github.com/daingun)
- [eclipseo](https://github.com/eclipseo)
- [hmunozb](https://github.com/hmunozb)
- [ignatenkobrain](https://github.com/ignatenkobrain)
- [ilya-epifanov](https://github.com/ilya-epifanov)
- Kristof Lünenschloß
- [kubkon](https://github.com/kubkon)
- [m-ou-se](https://github.com/m-ou-se)
- [nestordemeure](https://github.com/nestordemeure)
- [nnmm](https://github.com/nnmm)
- [sebcrozet](https://github.com/sebcrozet)
- [waywardmonkeys](https://github.com/waywardmonkeys)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks,
discuss features, and get assistance!

Finally, thanks to all the former, current and new patrons supporting me, [sebcrozet](https://github.com/sebcrozet), the
lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet) or [GitHub sponsors](https://github.com/sponsors/sebcrozet/)!
This help is greatly appreciated and allows me do spend a significant amount of time developing those crates.

[^1]: _The list of contributors is automatically generated from the past months' github commit history.
Don't hesitate to let us know if your name should have been mentioned here._
