---
title: The last two months in rustsim #4 (January - February 2019)
author: Sébastien Crozet
---

Welcome to the fourth edition of _This month in rustsim_. This monthly newsletter will provide you with a
summary of important update that occurred within the rustsim community. This includes in particular updates about
the [**nphysics**](https://nphysics.org), [**ncollide**](https://ncollide.org), [**nalgebra**](https://nalgebra.org),
and [**alga**](https://github.com/rustsim/alga) crate. This fourth edition will actually contain updates for the past
two months since we unfortunately skipped the last edition because of the significant load of work that kept us busy
for the huge release of nphysics 0.10.

<!--truncate-->

Join us on [discord](https://discord.gg/vt9DJSW) and on our [user forum](https://discourse.nphysics.org)!

# January 2019
## Improvements on nphysics
The most significant work that happened in January was the preparation for the release of nphysics 0.10. You can see
all the novelties brought by this release on the original [announcement on Patreon](https://www.patreon.com/posts/nphysics-0-10-24466961).
For example this release included:
 
* Support for deformable bodies (aka. soft-bodies).
* Builder patterns for constructing bodies and colliders.
* Support for capsules and heightfield colliders.
* Support for per-feature materials.
* Support for conveyor-belts simulation.
* And much more listed in the [original announcement](https://www.patreon.com/posts/nphysics-0-10-24466961)!

## Improvements on nalgebra
At the end of January, we released the version 0.17 of nalgebra. This includes several incremental improvements you can
find listed on its [Changelog](https://github.com/rustsim/nalgebra/blob/complex/CHANGELOG.md#0170). We also started working
on sparse matrices support, based on the Compressed Sparse Column storage scheme. So far our goal was to implement
enough operations to be able to implement a sparse Cholesky decomposition. This includes:

* The definition of `CsMatrix`, and `CsVector` on the [sparse module](https://www.nalgebra.org/rustdoc/nalgebra/sparse/index.html).
* Sums and products of two sparse matrices (and sparse vectors) as well as the product of a sparse matrix with a dense matrix.
* Resolution of linear systems `Ax = b` where `A` is sparse-lower-triangular, and `b` is either a sparse or dense vector.
* Up-looking and left-looking sparse Cholesky decomposition behind the `CsCholesky` [type](https://www.nalgebra.org/rustdoc/nalgebra/sparse/struct.CsCholesky.html).
* Parsing of sparse matrix under the Matrix Market [file format](https://math.nist.gov/MatrixMarket/). The parser dose
not handle all variants of the format yet. It can be enabled with nalgebra's `io` feature which exposes the
[io module](https://www.nalgebra.org/rustdoc/nalgebra/io/index.html).


Sparse matrix support has to be enabled explicitly with the `sparse` feature of nalgebra. It is still incomplete and not
polished yet, so it should not be considered ready for production use, and its API may change significantly in the future.

# February 2019
## Improvements on nphysics
After the release of nphysics 0.10 we got a lot of feedbacks regarding our deformable bodies simulation. In particular,
it was observed that under large deformations, our FEM-based models caused the application to crash. This was the
expected behaviour by-design but it was clearly not satisfactory enough. Therefore, we developed a more robust approach
for dealing with singularities that appear when deformable volumes are subject to large deformations. Our new results are that:

* If plasticity is not enabled, the app will no longer crash and the heavily deformed shape will try hard to recover its
undeformed state in a visually appealing way.
* If plasticity is enabled, the app will no longer crash but you may get a permanent growth of volume under large
deformations (which can be be very unrealistic). Getting rid of those growth of volume is a challenge we would like to
address at some point in the future.

In any case, preventing the simulation from crashing will allow other more significant part of the simulation to
continue to work properly. Thanks to [Andlon](https://github.com/Andlon) for pointing us toward the right bibliography!
   
## Improvements on nalgebra
One noteworthy addition to the latest nalgebra version, i.e., v0.17.2, is
the **extraction of a 3D rotation matrix** `Rotation3` (or of an `UnitQuaternion`) from a raw 3x3 matrix `Matrix3`. This also includes
the **extraction of a 2D rotation matrix** `Rotation2` (but not an `UnitComplex` yet) from a raw 2x2 matrix `Matrix2`. This is based
on the paper _A Robust Method to Extract the Rotational Part of Deformations_ by [Müller et al.](https://animation.rwth-aachen.de/media/papers/2016-MIG-StableRotation.pdf) See the `::from_matrix` [constructors](https://www.nalgebra.org/rustdoc/nalgebra/geometry/type.Rotation3.html#method.from_matrix)
of `Rotation2`, `Rotation3` and `UnitQuaternion`.


Afterward we started our work on the better support of complex numbers on nalgebra. We are working on the
[complex branch](https://github.com/rustsim/nalgebra/tree/complex) so this is not released yet. So far we managed to:

* Make all basic operations on complex matrices/vectors work properly wherever only real matrices/vectors were allowed before.
* Make the Cholesky, LU, and QR decompositions work with complex matrices.

We are in the process of making the other decompositions like Schur, Eigendecomposition and SVD work on complex number
as well. Hopefully all this will be released at the end of March.

# Thanks
We would like to thank the whole community and contributors. In particular, thanks to the contributors from the past two months[^1]:

* [adamnemecek](https://github.com/adamnemecek)
* [anderspitman](https://github.com/anderspitman)
* [bwhetherington](https://github.com/bwhetherington)
* [caitp](https://github.com/caitp)
* [dcrewi](https://github.com/dcrewi)
* [fabienjuif](https://github.com/fabienjuif)
* Gedl
* [gmorenz](https://github.com/gmorenz)
* [ignatenkobrain](https://github.com/ignatenkobrain)
* [JameeKim](https://github.com/JameeKim)
* [jeremystucki](https://github.com/jeremystucki)
* [jswrenn](https://github.com/jswrenn)
* [Noah2610](https://github.com/Noah2610)
* [Robogoogol](https://github.com/Robogoogol)
* [sebcrozet](https://github.com/sebcrozet)
* [seppo0010](https://github.com/seppo0010)
* [shivshank](https://github.com/shivshank)
* [xlambein](https://github.com/xlambein)
* [ybyygu](https://github.com/ybyygu)
* [yuvallanger](https://github.com/yuvallanger)
* Thanks to users reporting spelling mistakes on the documentation. This is always appreciated.
* Thanks to users joining us on our [discord server](https://discord.gg/vt9DJSW) to provide feedbacks, discuss features, and get assistance!

Finally, thanks to all the current and new patrons supporting [sebcrozet](https://github.com/sebcrozet), the lead developer of the current crates part of this organization on [patreon](http://patreon.com/sebcrozet)!

[^1]: _The list of contributors is automatically generated from past month's github commit history.
Don't hesitate to let us know if your name should have been mentioned here._