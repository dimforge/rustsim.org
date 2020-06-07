---
title: This month in rustsim #11 (April - May 2020)
author: Sébastien Crozet
---

Welcome to the tenth edition of _This month in rustsim_! This newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org) (physics engine),  [**salva**](https://salva.rs) (fluid simulation), [**ncollide**](https://ncollide.org) (for collision-detection),
[**nalgebra**](https://nalgebra.org) (for linear algebra), and
[**simba**](https://github.com/rustsim/simba) (for abstract algebra) crates. This eleventh edition will contain updates for the months of April and May 2020.


<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# Make nphysics 0.16 deterministic with fixed-point numbers!

Starting with the version 0.16, **nphysics2d** and **nphysics3d** can be used with **fixed-point numbers** as their scalar
type. This allows you to use fixed-point numbers from the [`simba` crate](https://crates.io/crates/simba) (which wraps
fixed-points numbers from the [`fixed` crate](https://crates.io/crates/fixed)) as the scalar type `N` of all the **nphysics**
entities. This will result in **cross-platform determinism** of the simulation.

_This work was made possible by a [**GitHub sponsorship**](https://github.com/sponsors/sebcrozet/) dedicated to the implementation of this feature._

_Cross-platform determinism_ means that two scenes initialized in the exact same ways (including the same insertion order
of bodies/colliders) on two different machines/platforms will result in the exact same simulation result. This is generally not
possible with conventional hardware-accelerated floating point numbers like `f32` or `f64` because different
processors may process float operations with different levels of internal accuracy. This problem is avoided by using
fixed-point numbers. In order to make the simulation work with fixed-point numbers it is necessary to:
1. Enable the `improved_fixed_point_support` cargo feature of **nphysics**. This will enable some numerical stability improvements
that can have a slight negative performance impact when enabled. They are necessary for fixed-point numbers to work.
2. Enable the `partial_fixed_point_support` cargo feature of **simba**, otherwise you won't have access to the simba fixed-point types.
3. Use at least 24 bits for the decimal part of the number. I tested mostly with
[`simba::scalar::FixedI40F24`](https://docs.rs/simba/0.1.4/simba/scalar/type.FixedI40F24.html) and
[`simba::scalar::FixedI32F32`](https://docs.rs/simba/0.1.4/simba/scalar/type.FixedI32F32.html).
4. Be careful with the size of the colliders and the mass of the bodies. These should not be too large or too small to
avoid overflow or underflow of the fixed-point numbers. The exact valid range depends on the actual fixed-point numbers
you use. See the **nphysics** demos on the [examples2d](https://github.com/rustsim/nphysics/tree/master/examples2d) and
[examples3d](https://github.com/rustsim/nphysics/tree/master/examples3d) directories to get an idea of what dimensions
work. It is possible to experiment with various scalar types on the **nphysics** demos by changing the type alias `type Real = ...;` on the
[`all_examples2.rs`](https://github.com/rustsim/nphysics/blob/1ee5225cb1b57a676b1432fedad8a80a0c4a7c55/examples2d/all_examples2.rs#L69) and
[`all_examples3.rs`](https://github.com/rustsim/nphysics/blob/1ee5225cb1b57a676b1432fedad8a80a0c4a7c55/examples3d/all_examples3.rs#L72) demo files.

The support of fixed-point numbers is considered experimental because it needs more testing in real-world applications.
So far most of the testing was done with the **nphysics** demos. Any non-deterministic behavior (even cross-platform) will
be considered a bug when using fixed-point numbers.

### About the new **cordic** crate

In order to make **nphysics** work with fixed-points numbers, it was necessary to implement various special function, namely
`sin, cos, tan, asin, acos, atan, atan2, exp, sqrt` for fixed-point numbers. They have been implemented using algorithms based on
the CORDIC method, available on the new [cordic crate](https://crates.io/crates/cordic).

### Fixed-point compatibility of simba, ncollide, and nalgebra
- The **simba** crate has the `partial_fixed_point_support` cargo feature. This will allow you to use all the `simba::scalar::Fixed*`
types. These aliases follow the [naming convention](https://docs.rs/fixed/1.0.0/fixed/types/index.html) of the type the
wrap on the **fixed crate**. Note however that this fixed-point number support is only **partial**. Even though the `simba::scalar::RealField`
trait is implemented for these numbers, most of their special functions are just filled with `undefined!()`. The methods that are not
`undefined!()` are these needed by **nphysics** itself and implemented in the new [cordic crate](https://crates.io/crates/cordic).
- The **ncollide2d/ncollide3** crates now have an `improved_fixed_point_support` cargo feature is well. This will also
enable some numerical stability improvements for fixed-point numbers.

Note that this also means that **nalgebra** itself is now compatible with fixed-point numbers. Most transformation types, as
well as matrix decompositions will work too (as long as your input do not cause any overflow/underflow).

----
# Other changes unrelated to deterministic physics
### Changes in nalgebra
A few features were added to **nalgebra** v0.21.1:
- It is now possible to build a Cholesky decomposition without checking that its input is positive-definite using
`Choleksy::new_unchecked`. Not having these checks also remove all branching from the Cholesky decomposition, making it
suitable to the use with SIMD types for, e.g., building the Cholesky decompositions of four matrices at once using a `Matrix4<simba::simd::f32x4>`.
- Thanks to the contribution of [m-ou-se](https://github.com/m-ou-se), the `Default` trait is now implemented for matrices,
  and quaternions. They are all filled with zeros, except for UnitQuaternion which is initialized with the identity.
- Thanks to the contribution of [fredrik-jansson-se](https://github.com/fredrik-jansson-se), it is now posible to compute the
matrix exponential with `matrix.exp()`.

### Changes in the nphysics
- It is now possible to retrieve the number of `BodyPart` that compose a `Body` using `body.num_parts()`. This allows you to
  iterate through all the parts on a loop like `for i in 0..body.num_parts() { let part = body.part(i); ... }`.
- Thanks to the contribution of [m-ou-se](https://github.com/m-ou-se) the testbeds of nphysics **nphysics_testbed2d** and
**nphysics_testbed3d** can now be used with scalar types other than `f32`.
---

# Thanks
I would like to thank the whole community and contributors. In particular, thanks to the contributors from the past two months[^1]:

- [chiache-msft](https://github.com/chiache-msft)
- [fredrik-jansson-se](https://github.com/fredrik-jansson-se)
- [Hodapp87](https://github.com/Hodapp87)
- [jannickj](https://github.com/jannickj)
- [LiquidityC](https://github.com/LiquidityC)
- [m-ou-se](https://github.com/m-ou-se)
- [mxxo](https://github.com/mxxo)
- [Nateckert](https://github.com/Nateckert)
- [oisincar](https://github.com/oisincar)
- [philippeitis](https://github.com/philippeitis)
- [ProfFan](https://github.com/ProfFan)
- [sebcrozet](https://github.com/sebcrozet)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks,
discuss features, and get assistance!

Finally, thanks to all the former, current and new patrons supporting me, [sebcrozet](https://github.com/sebcrozet), the
lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet) or [GitHub sponsors](https://github.com/sponsors/sebcrozet/)!
This help is greatly appreciated and allows me do spend a significant amount of time developing those crates.

[^1]: _The list of contributors is automatically generated from the past two months' github commit history.
Don't hesitate to let us know if your name should have been mentioned here._
