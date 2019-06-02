---
title: This month in rustsim #5 (March 2019)
author: Sébastien Crozet
---

Welcome to the fifth edition of _This month in rustsim_. This monthly newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org), [**ncollide**](https://ncollide.org), [**nalgebra**](https://nalgebra.org),
and [**alga**](https://github.com/rustsim/alga) crate.

<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# Progress of current developments
## Complex numbers support for alga 0.9 and nalgebra 0.18
The most notable progress this month is the addition of full support of complex numbers in alga and nalgebra. This was
one of our big goals for 2019! This implies:

- The addition of a new trait `alga::general::ComplexField` which is implemented by `num_complex::Complex` and floats like `f32` and `f64`.
- The rename of the `alga::general::Real` trait to `RealField` for uniformity. This trait derives from `ComplexField`.
- The use of `ComplexField` instead of `RealField` whenever it makes sense mathematically. Complex numbers
are still forbidden as parameters of transformation types (like `Isometry3`, `Quaternion`, `Similarity`, etc.) from the
`geometry` module.

This last point implies that **all matrix decomposition algorithms support complex matrices** as well.
This was a non-straightforward work as the algorithms had to be adapted to work on both complex and real matrices
with the same generic code. This also implied adding implementation BLAS operations like `gerc` and `dotc` that take the
adjoint of one of its inputs. Refer to nalgebra's [CHANGELOG](https://www.nalgebra.org/changelog/#version-018) for a
complete list of methods added to the version 0.18.

Finally, keep in mind that all this **remain compatible with #[no-std]**.

## Other additions to nalgebra
1. A significant amount of work has been delivered by [adamnemecek](https://github.com/adamnemecek) to add the
implementation of **trigonometric function on quaternions**, as well as some **geometric algebra operators**. In the continuity
of this work, we are in the process of discussing the addition of [dual-quaternions](https://en.wikipedia.org/wiki/Dual_quaternion)
(which can represent a transformation like an isometry) to nalgebra.
2. A first implementation of **convolution** has been added to nalgebra by [npapapietro](https://github.com/npapapietro).
This implementation is not based on a FFT yet though that would be a great addition for anyone interested!

# Next objectives
Our next goal has already been mentioned before, and this time we will start working on it for good: the addition of **Continuous
Collision Detection (CCD)** to nphysics! This will prevent fast-moving objects from passing through other objects (also known as
the "tunneling effect".) We expect this work to take at least two months with the following best-case scenario:

1. April will be dedicated to experimenting various designs as we want modifications made for CCD to prepare the road
for the future addition of multithreading.
2. May will be dedicated to actually implementing whatever design we selected.


# Thanks
We would like to thank the whole community and contributors. In particular, thanks to the contributors from the past month[^1]:

* [adamnemecek](https://github.com/adamnemecek)
* [est31](https://github.com/est31)
* [greizgh](https://github.com/greizgh)
* [IcanDivideBy0](https://github.com/IcanDivideBy0)
* [npapapietro](https://github.com/npapapietro)
* [Ralith](https://github.com/Ralith)
* [sebcrozet](https://github.com/sebcrozet)
* [simonpuchert](https://github.com/simonpuchert)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks,
discuss features, and get assistance!

Finally, thanks to all the former, current and new patrons supporting [sebcrozet](https://github.com/sebcrozet), the
lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet)! This help is
greatly appreciated and allows me do spend a significant amount of time developing those crates.

[^1]: _The list of contributors is automatically generated from past month's github commit history.
Don't hesitate to let us know if your name should have been mentioned here._